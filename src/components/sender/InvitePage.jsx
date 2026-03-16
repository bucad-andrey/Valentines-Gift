import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../ui/ImageUploader";
import { auth } from "../utils/firestore";
import {
  saveFinalMessage,
  fetchLatestFinalMessage,
} from "../utils/firestoreHelpers";
import {
  loadInviteDraft,
  saveInviteDraft,
} from "../hooks/saveToLocalStorage";

//This will be about the theme song or record message of the Sender
//It will have a more message but more about the experience of being together and how much the Sender willing to persue the future with the Reciever

/*
  THIS WILL BE ABOUT THE INVITATION FOR THE RECIEVER
*/

function InvitePage() {
  const navigate = useNavigate();

  const INVITE_TYPES = useMemo(
    () => ["movie night", "coffee", "surprise", "custom"],
    []
  );

  const [invitationType, setInvitationType] = useState("");
  const [customType, setCustomType] = useState("");
  const [when, setWhen] = useState("");
  const [whereImageFiles, setWhereImageFiles] = useState([null, null, null]);
  const [whereImagePreviews, setWhereImagePreviews] = useState([
    null,
    null,
    null,
  ]);
  const [whereImageUrls, setWhereImageUrls] = useState([null, null, null]); // Firestore/Cloudinary URLs
  const [selectedWhereIndex, setSelectedWhereIndex] = useState(null);
  const [dressCode, setDressCode] = useState("");
  const [soundtrackUrl, setSoundtrackUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // "success" | "error" | null
  const [errorMessage, setErrorMessage] = useState("");
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  const finalInvitationType = useMemo(() => {
    const raw =
      invitationType === "custom" ? (customType || "").trim() : invitationType;
    return (raw || "").trim();
  }, [invitationType, customType]);

  const selectedWhereFile =
    typeof selectedWhereIndex === "number"
      ? whereImageFiles[selectedWhereIndex]
      : null;

  const selectedWherePreview =
    typeof selectedWhereIndex === "number"
      ? whereImagePreviews[selectedWhereIndex]
      : null;

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  // 1) Firestore wins if it has data.
  // 2) Otherwise fall back to localStorage draft.
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const userId = auth.currentUser?.uid;
        const fromFirestore = userId
          ? await fetchLatestFinalMessage(userId)
          : null;

        if (cancelled) return;

        if (fromFirestore) {
          const savedType = (fromFirestore?.invitationType || "").trim();
          const isKnown = INVITE_TYPES.includes(savedType);

          setInvitationType(isKnown ? savedType : "custom");
          setCustomType(isKnown ? "" : savedType);
          setWhen(fromFirestore?.when || "");
          setDressCode(fromFirestore?.dressCode || "");
          setSoundtrackUrl(fromFirestore?.soundtrackUrl || "");
          setMessage(fromFirestore?.message || "");

          const images = Array.isArray(fromFirestore?.where?.images)
            ? fromFirestore.where.images
            : [];
          const normalizedImages = [0, 1, 2].map((i) => images[i] || null);
          setWhereImagePreviews(normalizedImages);
          setWhereImageUrls(normalizedImages);
          setWhereImageFiles([null, null, null]);
          setSelectedWhereIndex(
            typeof fromFirestore?.where?.selectedIndex === "number"
              ? fromFirestore.where.selectedIndex
              : null
          );

          // Also cache what we got (so refresh works even if Firestore is slow/offline)
          saveInviteDraft({
            invitationType: isKnown ? savedType : "custom",
            customType: isKnown ? "" : savedType,
            when: fromFirestore?.when || "",
            dressCode: fromFirestore?.dressCode || "",
            soundtrackUrl: fromFirestore?.soundtrackUrl || "",
            message: fromFirestore?.message || "",
            selectedWhereIndex:
              typeof fromFirestore?.where?.selectedIndex === "number"
                ? fromFirestore.where.selectedIndex
                : null,
            whereImagePreviews: normalizedImages,
            whereImageUrls: normalizedImages,
            source: "firestore",
            updatedAt: Date.now(),
          });
        } else {
          const draft = loadInviteDraft();
          if (!draft) return;
          if (cancelled) return;

          setInvitationType(draft?.invitationType || "");
          setCustomType(draft?.customType || "");
          setWhen(draft?.when || "");
          setDressCode(draft?.dressCode || "");
          setSoundtrackUrl(draft?.soundtrackUrl || "");
          setMessage(draft?.message || "");
          setSelectedWhereIndex(
            typeof draft?.selectedWhereIndex === "number"
              ? draft.selectedWhereIndex
              : null
          );

          const previews = Array.isArray(draft?.whereImagePreviews)
            ? draft.whereImagePreviews
            : [];
          const urls = Array.isArray(draft?.whereImageUrls)
            ? draft.whereImageUrls
            : [];
          setWhereImagePreviews([0, 1, 2].map((i) => previews[i] || null));
          setWhereImageUrls([0, 1, 2].map((i) => urls[i] || null));
          setWhereImageFiles([null, null, null]);
        }
      } catch (err) {
        console.error("InvitePage bootstrap failed:", err);
      } finally {
        if (!cancelled) setIsBootstrapped(true);
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [INVITE_TYPES]);

  // Autosave draft to prevent data loss on refresh.
  useEffect(() => {
    if (!isBootstrapped) return;

    saveInviteDraft({
      invitationType,
      customType,
      when,
      dressCode,
      soundtrackUrl,
      message,
      selectedWhereIndex,
      whereImagePreviews,
      whereImageUrls,
      source: "draft",
      updatedAt: Date.now(),
    });
  }, [
    invitationType,
    customType,
    when,
    dressCode,
    soundtrackUrl,
    message,
    selectedWhereIndex,
    whereImagePreviews,
    whereImageUrls,
    isBootstrapped,
  ]);

  const handleSubmit = async () => {
    if (!auth.currentUser?.uid) return;

    setErrorMessage("");
    setSaveStatus(null);

    // Switch-based validation (instead of an if-chain)
    switch (true) {
      case !finalInvitationType: {
        setErrorMessage(
          "Please choose an invitation type (or write a custom one)."
        );
        return;
      }
      case !when: {
        setErrorMessage("Please pick a date & time.");
        return;
      }
      case selectedWhereIndex === null: {
        setErrorMessage("Please select which location photo you want to use.");
        return;
      }
      case !selectedWherePreview && !selectedWhereFile: {
        setErrorMessage("Please upload a photo for the selected location.");
        return;
      }
      case !message.trim(): {
        setErrorMessage("Please write a message.");
        return;
      }
      default:
        break;
    }

    setIsSaving(true);

    try {
      const saved = await saveFinalMessage({
        userEmail: auth.currentUser.uid,
        invitationType: finalInvitationType,
        when,
        whereImageFiles,
        existingWhereImages: whereImageUrls,
        selectedWhereIndex,
        dressCode,
        soundtrackUrl,
        message,
      });

      const savedImages = Array.isArray(saved?.where?.images)
        ? saved.where.images
        : whereImageUrls;
      const normalizedSavedImages = [0, 1, 2].map(
        (i) => savedImages?.[i] || null
      );

      setWhereImageUrls(normalizedSavedImages);
      setWhereImagePreviews((prev) =>
        prev.map((p, i) => p || normalizedSavedImages[i])
      );

      setSaveStatus("success");
    } catch (err) {
      console.error("Failed to save final invitation:", err);
      setSaveStatus("error");
      setErrorMessage(err?.message || "Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-linear-to-br from-primary-soft to-secondary-soft px-4 sm:px-6 py-8 text-primary-text min-h-screen">
      <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl p-5 sm:p-8 rounded-3xl shadow-2xl space-y-7 border border-white/30">

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            The Invitation
          </h2>
          <p className="text-primary-text/80">
            Save the final details—then preview it like your partner will see it.
          </p>
        </div>

        {/* Invitation Type */}
        <div className="space-y-3">
          <p className="font-semibold">Invitation Type</p>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
            {INVITE_TYPES.map((type) => (
              <label
                key={type}
                className={`flex items-center gap-2 capitalize rounded-xl px-3 py-2 border transition cursor-pointer
                  ${invitationType === type
                    ? "bg-rose-50 border-rose-200"
                    : "bg-white/50 border-white/40 hover:bg-white/70"
                  }`}
              >
                <input
                  type="radio"
                  name="invitation"
                  value={type}
                  checked={invitationType === type}
                  onChange={() => setInvitationType(type)}
                />
                <span className="font-medium">{type}</span>
              </label>
            ))}
          </div>

          {invitationType === "custom" && (
            <input
              type="text"
              placeholder="Enter custom invitation"
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/60 border border-white/40 focus:outline-none focus:border-rose-300"
            />
          )}
        </div>

        {/* When */}
        <div className="space-y-2">
          <p className="font-semibold">When</p>
          <input
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/60 border border-white/40 focus:outline-none focus:border-rose-300"
          />
        </div>

        {/* Where */}
        <div className="space-y-3">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold">Where</p>
              <p className="text-sm text-primary-text/70">
                Upload up to 3 location photos and select your favorite.
              </p>
            </div>
            {selectedWhereIndex !== null && (
              <span className="text-sm font-medium text-rose-600">
                Selected: #{selectedWhereIndex + 1}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {whereImageFiles.map((_, index) => (
              <div
                key={index}
                onClick={() => setSelectedWhereIndex(index)}
                className={`rounded-2xl p-1 cursor-pointer transition
                  ${selectedWhereIndex === index
                    ? "ring-4 ring-rose-400/80"
                    : "hover:ring-2 hover:ring-white/60"
                  }`}
                title="Click to select this location photo"
              >
                <div className="relative">
                  <ImageUploader
                    width="100%"
                    height="96px"
                    initialImage={whereImagePreviews[index]}
                    onSelect={async (file) => {
                      setWhereImageFiles((prev) => {
                        const copy = [...prev];
                        copy[index] = file;
                        return copy;
                      });

                      try {
                        const dataUrl = await readFileAsDataURL(file);
                        setWhereImagePreviews((prev) => {
                          const copy = [...prev];
                          copy[index] = dataUrl;
                          return copy;
                        });
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs rounded-full bg-white/80 border border-white/40 shadow">
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dress Code */}
        <div className="space-y-2">
          <p className="font-semibold">Dress Code (optional)</p>
          <input
            type="text"
            value={dressCode}
            onChange={(e) => setDressCode(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/60 border border-white/40 focus:outline-none focus:border-rose-300"
            placeholder="e.g. Elegant, something red, casual chic..."
          />
        </div>

        {/* URL SoundTrack */}
        <div className="space-y-2">
          <p className="font-semibold">Soundtrack URL (Spotify or YouTube)</p>
          <input
            type="text"
            value={soundtrackUrl}
            onChange={(e) => setSoundtrackUrl(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/60 border border-white/40 focus:outline-none focus:border-rose-300"
            placeholder="Music that you think romantic or he/she likes"
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <p className="font-semibold">Message</p>
          <textarea
            placeholder="Would you like to spend this moment with me?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-36 p-3 rounded-2xl resize-none bg-white/60 border border-white/40 focus:outline-none focus:border-rose-300"
          />
        </div>

        {errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            {errorMessage}
          </div>
        )}

        {saveStatus === "success" && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
            Saved. You can preview it now.
          </div>
        )}

        {saveStatus === "error" && !errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            Failed to save. Please try again.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className={`w-full py-3 rounded-2xl font-semibold transition shadow-lg
              ${isSaving
                ? "bg-disabled text-error cursor-not-allowed"
                : "bg-rose-500 text-white hover:bg-rose-600"
              }`}
          >
            {isSaving ? "Saving..." : "Save Invitation"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/finalMessage")}
            className="w-full py-3 rounded-2xl font-semibold bg-white/70 border border-white/40 hover:bg-white/90 transition"
          >
            Preview Final Message
          </button>
        </div>

      </div>
    </section>
  );
}

export default InvitePage;
