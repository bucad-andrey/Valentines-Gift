import React, { useState } from "react";
import ImageUploader from "../ui/ImageUploader";

//This will be about the theme song or record message of the Sender
//It will have a more message but more about the experience of being together and how much the Sender willing to persue the future with the Reciever

/*
  THIS WILL BE ABOUT THE INVITATION FOR THE RECIEVER
*/

function SharePage() {
  const [invitationType, setInvitationType] = useState("");
  const [customType, setCustomType] = useState("");
  const [when, setWhen] = useState("");
  const [whereImages, setWhereImages] = useState([null, null, null]);
  const [selectedWhereIndex, setSelectedWhereIndex] = useState(null);
  const [dressCode, setDressCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const payload = {
      invitationType: invitationType === "custom" ? customType : invitationType,
      when,
      whereImage: whereImages[selectedWhereIndex],
      dressCode,
      message,
      createdAt: new Date()
    };

    console.log("SAVE TO FIRESTORE:", payload);

    // TODO:
    // Save to Firestore under sender document
  };

  return (
    <section className="bg-gradient-to-br from-primary-soft to-secondary-soft p-6 text-primary-text min-h-screen">
      <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl space-y-6">

        {/* Invitation Type */}
        <div>
          <p className="font-semibold mb-2">Invitation Type</p>
          <div className="flex gap-4 flex-wrap">
            {["movie night", "coffee", "surprise", "custom"].map(type => (
              <label key={type} className="flex items-center gap-2 capitalize">
                <input
                  type="radio"
                  name="invitation"
                  value={type}
                  onChange={() => setInvitationType(type)}
                />
                {type}
              </label>
            ))}
          </div>

          {invitationType === "custom" && (
            <input
              type="text"
              placeholder="Enter custom invitation"
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              className="mt-2 w-full p-2 rounded-lg"
            />
          )}
        </div>

        {/* When */}
        <div>
          <p className="font-semibold mb-2">When</p>
          <input
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="w-full p-2 rounded-lg"
          />
        </div>

        {/* Where */}
        <div>
          <p className="font-semibold mb-2">Where (choose one)</p>
          <div className="grid grid-cols-3 gap-4">
            {whereImages.map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedWhereIndex(index)}
                className={`rounded-xl p-1 cursor-pointer
                  ${selectedWhereIndex === index ? "ring-4 ring-rose-400" : ""}`}
              >
                <ImageUploader
                width="100px"
                  height="100px"
                  value={img}
                  onChange={(url) => {
                    const copy = [...whereImages];
                    copy[index] = url;
                    setWhereImages(copy);
                  }}
                  
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dress Code */}
        <div>
          <p className="font-semibold mb-2">Dress Code (optional)</p>
          <input
            type="text"
            value={dressCode}
            onChange={(e) => setDressCode(e.target.value)}
            className="w-full p-2 rounded-lg"
          />
        </div>

        {/* URL SoundTrack */}
        <div>
          <p className="font-semibold mb-2">Paste the URL (spotify or youtube)</p>
          <input
            type="text"
            value={dressCode}
            onChange={(e) => setDressCode(e.target.value)}
            className="w-full p-2 rounded-lg"
            placeholder="Music that you think romantic or he/she likes"
          />
        </div>

        {/* Message */}
        <div>
          <p className="font-semibold mb-2">Message</p>
          <textarea
            placeholder="Would you like to spend this moment with me?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 p-3 rounded-xl resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-rose-500 text-white py-3 rounded-xl font-semibold hover:bg-rose-600"
        >
          Save Invitation
        </button>

      </div>
    </section>
  );
}

export default SharePage;
