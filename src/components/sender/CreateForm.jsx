import React, { useState } from 'react';

import { db } from "../utils/firestore";
import { setDoc, doc } from "firebase/firestore";

function CreateForm() {
  const [isName, setName] = useState("");

  const createSender = async () => {
    try {
      await setDoc(doc(db, "Senders", isName), {
        username: isName,
        createdAt: Date.now()
      });

      console.log("Sender created:", isName);
    } catch (err) {
      console.error("Error writing document:", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your name..."
        className="h-fit w-auto bg-black text-white"
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={createSender} className="bg-green-500">
        Create Sender
      </button>
    </div>
  );
}

export default CreateForm;
