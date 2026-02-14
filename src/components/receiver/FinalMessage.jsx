import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firestore";
import { fetchLatestFinalMessage, saveFinalResponse } from "../utils/firestoreHelpers";

function extractYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "") || null;
    }
    if (u.hostname.includes("youtube.com")) {
      return u.searchParams.get("v") || null;
    }
    return null;
  } catch {
    return null;
  }
}

function buildSpotifyEmbed(url) {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("spotify.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    // e.g. /track/{id} | /playlist/{id} | /album/{id}
    if (parts.length < 2) return null;
    const type = parts[0];
    const id = parts[1];
    return `https://open.spotify.com/embed/${type}/${id}`;
  } catch {
    return null;
  }
}

function formatWhen(when) {
  if (!when) return "";
  const d = new Date(when);
  if (Number.isNaN(d.getTime())) return when;
  return d.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FinalMessage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedThumbIndex, setSelectedThumbIndex] = useState(null);
  const [choice, setChoice] = useState(null); // "yes" | "no" | null
  const [responseText, setResponseText] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null); // "success" | "error" | null
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      

      try {
        const latest = await fetchLatestFinalMessage("andreybucad18@gmail.com");
        if (!latest) {
          setError("No invitation found yet. Create one first.");
        } else {
          setData(latest);
        }
      } catch (err) {
        console.error("Failed to load final message:", err);
        setError(err?.message || "Failed to load invitation.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const whenPretty = useMemo(() => formatWhen(data?.when), [data?.when]);

  const whereImages = data?.where?.images || [];
  const initialSelectedIndex =
    typeof data?.where?.selectedIndex === "number" ? data.where.selectedIndex : 0;
  const effectiveSelectedIndex =
    selectedThumbIndex !== null ? selectedThumbIndex : initialSelectedIndex;
  const heroImage =
    whereImages?.[effectiveSelectedIndex] || whereImages?.find(Boolean) || null;

  const youtubeId = useMemo(() => extractYouTubeId(data?.soundtrackUrl || ""), [
    data?.soundtrackUrl,
  ]);
  const spotifyEmbed = useMemo(
    () => buildSpotifyEmbed(data?.soundtrackUrl || ""),
    [data?.soundtrackUrl]
  );

  const handleSubmitResponse = async () => {
    if (!auth.currentUser?.email || !data?.id) return;

    setSubmitError("");
    setSubmitStatus(null);

    if (!choice) {
      setSubmitError("Please choose if you will come or not.");
      return;
    }

    const trimmed = (responseText || "").trim();

    if (choice === "no" && trimmed.length < 10) {
      setSubmitError("Please share at least 10 characters so they understand why. 🥺");
      return;
    }

    setIsSubmitting(true);

    try {
      await saveFinalResponse({
        userEmail: "andreybucad18@gmail.com",
        attending: choice === "yes",
        message: trimmed,
      });
      navigate('/ending')

      setSubmitStatus("success");
    } catch (err) {
      console.error("Failed to save response:", err);
      setSubmitStatus("error");
      setSubmitError(err?.message || "Failed to save your response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-linear-to-br from-primary-soft to-secondary-soft py-10 px-6 flex justify-center items-center min-h-screen">
        <div className="text-primary-text text-xl">Loading your invitation...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-linear-to-br from-primary-soft to-secondary-soft py-10 px-6 flex justify-center items-center min-h-screen">
        <div className="max-w-xl w-full bg-surface-glass backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30">
          <h2 className="text-2xl font-semibold text-primary-text mb-3">
            Something’s missing
          </h2>
          <p className="text-error mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/message3")}
              className="px-6 py-3 rounded-2xl bg-primary text-white hover:bg-primary-hover transition font-semibold"
            >
              Create Invitation
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-2xl bg-white/70 border border-white/40 hover:bg-white/90 transition font-semibold"
            >
              Back Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-linear-to-br from-primary-soft to-secondary-soft py-10 px-4 sm:px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="bg-surface-glass backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT: HERO IMAGE */}
            <div className="relative">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Location"
                  className="w-full h-72 sm:h-96 lg:h-full object-cover"
                />
              ) : (
                <div className="w-full h-72 sm:h-96 lg:h-full bg-white/30 flex items-center justify-center">
                  <span className="text-primary-text/70">No location image</span>
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white/90 text-sm">You’re invited to</p>
                <h1 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight drop-shadow">
                  {data?.invitationType || "a special moment"}
                </h1>
                {whenPretty && (
                  <p className="mt-2 text-white/90 text-sm sm:text-base">
                    {whenPretty}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT: DETAILS */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-primary-text">
                  A little note for you
                </h2>
                <p className="text-primary-text/70">
                  Please read this slowly… it’s meant to be felt.
                </p>
              </div>

              <div className="rounded-3xl bg-white/55 border border-white/40 p-5 sm:p-6 shadow-(--box-shadow-soft)">
                <p className="whitespace-pre-wrap text-primary-text text-lg leading-relaxed">
                  {data?.message || ""}
                </p>
              </div>

              {(data?.dressCode || whenPretty) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {whenPretty && (
                    <div className="rounded-2xl bg-white/45 border border-white/40 p-4">
                      <p className="text-xs uppercase tracking-wider text-primary-text/60">
                        When
                      </p>
                      <p className="mt-1 font-semibold text-primary-text">
                        {whenPretty}
                      </p>
                    </div>
                  )}
                  {data?.dressCode && (
                    <div className="rounded-2xl bg-white/45 border border-white/40 p-4">
                      <p className="text-xs uppercase tracking-wider text-primary-text/60">
                        Dress code
                      </p>
                      <p className="mt-1 font-semibold text-primary-text">
                        {data.dressCode}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* LOCATION THUMBNAILS */}
              {whereImages?.filter(Boolean)?.length > 1 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary-text">
                    Location options
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {whereImages.map((url, idx) => {
                      if (!url) return null;
                      const isSelected = idx === effectiveSelectedIndex;
                      return (
                        <div
                          key={`${idx}-${url}`}
                          onClick={() => setSelectedThumbIndex(idx)}
                          className={`w-16 h-16 rounded-2xl overflow-hidden border transition cursor-pointer
                            ${
                              isSelected
                                ? "border-rose-300 ring-2 ring-rose-300/60"
                                : "border-white/40 opacity-80 hover:border-rose-200 hover:opacity-100"
                            }`}
                          title={isSelected ? "Selected" : "Click to select"}
                        >
                          <img
                            src={url}
                            alt={`Location option ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SOUNDTRACK */}
              {(youtubeId || spotifyEmbed || data?.soundtrackUrl) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-sm font-semibold text-primary-text">
                      Soundtrack
                    </p>
                    {data?.soundtrackUrl && (
                      <a
                        href={data.soundtrackUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-rose-600 hover:text-rose-700 underline"
                      >
                        Open link
                      </a>
                    )}
                  </div>

                  {youtubeId && (
                    <div className="rounded-3xl overflow-hidden border border-white/40 bg-white/30">
                      <iframe
                        className="w-full aspect-video"
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title="YouTube soundtrack"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {!youtubeId && spotifyEmbed && (
                    <div className="rounded-3xl overflow-hidden border border-white/40 bg-white/30">
                      <iframe
                        className="w-full h-[152px]"
                        src={spotifyEmbed}
                        title="Spotify soundtrack"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {!youtubeId && !spotifyEmbed && data?.soundtrackUrl && (
                    <div className="rounded-2xl border border-white/40 bg-white/45 p-4 text-primary-text/80 text-sm">
                      {data.soundtrackUrl}
                    </div>
                  )}
                </div>
              )}

              {/* RESPONSE CHOICE */}
              <div className="space-y-3 pt-2">
                <p className="text-sm font-semibold text-primary-text">
                  Will you come?
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setChoice("yes");
                      setSubmitStatus(null);
                      setSubmitError("");
                    }}
                    className={`w-full px-6 py-3 rounded-2xl font-semibold transition shadow-sm border
                      ${
                        choice === "yes"
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-white/80 text-primary-text border-white/60 hover:bg-white"
                      }`}
                  >
                    Yes, I will come
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChoice("no");
                      setSubmitStatus(null);
                      setSubmitError("");
                    }}
                    className={`w-full px-6 py-3 rounded-2xl font-semibold transition shadow-sm border
                      ${
                        choice === "no"
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-white/80 text-primary-text border-white/60 hover:bg-white"
                      }`}
                  >
                    No, I'm sorry
                  </button>
                </div>
              </div>

              {/* RESPONSE TEXTAREA */}
              {choice && (
                <div className="space-y-2">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder={
                      choice === "yes"
                        ? "Do you have something to tell me? A request you want me to do?"
                        : "Please tell me why? 🥺🥺🥺"
                    }
                    className="w-full min-h-[120px] rounded-2xl bg-white/55 border border-white/40 p-4 text-primary-text resize-none focus:outline-none focus:border-rose-300"
                  />
                  {choice === "no" && (
                    <p className="text-xs text-primary-text/60">
                      Please write at least 10 characters so they can understand.
                    </p>
                  )}
                </div>
              )}

              {/* SUBMIT STATUS & BUTTON */}
              {choice && (
                <div className="space-y-2">
                  {submitError && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                      {submitError}
                    </div>
                  )}
                  {submitStatus === "success" && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                      Your response has been saved. Thank you for answering honestly.
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={
                      isSubmitting ||
                      (choice === "no" && (responseText || "").trim().length < 10)
                    }
                    onClick={handleSubmitResponse}
                    className={`w-full px-6 py-3 rounded-2xl font-semibold shadow-lg transition
                      ${
                        isSubmitting ||
                        (choice === "no" && (responseText || "").trim().length < 10)
                          ? "bg-disabled text-error cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary-hover"
                      }`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit response"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-primary-text/70 text-sm">
          Made with love — and a little bit of courage.
        </p>
      </div>
    </section>
  );
}

export default FinalMessage;