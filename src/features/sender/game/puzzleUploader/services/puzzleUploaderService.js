import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  limit,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../../../../config/firestore";

import { uploadImageToCloudinary } from "../../../../../config/firestoreHelpers";

/*
  FUNCTIONALITY:
  Upload image to Cloudinary
  and save metadata into Firestore.

  Path:
  Senders/{userUID}/game/puzzle/puzzlePictures/{imageId}
*/
export const uploadPuzzleImage = async ({
  userUID,
  imageFile,
}) => {

  console.group("[PuzzleUploaderService]");
  console.log("Starting upload...");
  console.log({ userUID, imageFile });

  // FUNCTIONALITY: upload to Cloudinary
  const uploadedUrl = await uploadImageToCloudinary(imageFile);

  console.log("Cloudinary upload success");
  console.log(uploadedUrl);

  // FUNCTIONALITY: create collection reference
  const collectionRef = collection(
    db,
    "Senders",
    userUID,
    "game",
    "puzzle",
    "puzzlePictures"
  );

  // FUNCTIONALITY: save metadata into Firestore
  await addDoc(collectionRef, {
    imageUrl: uploadedUrl,
    fileName: imageFile.name,
    fileSize: imageFile.size,
    uploadedAt: serverTimestamp(),
  });

  console.log("Firestore save success");

  console.groupEnd();

  return uploadedUrl;
};

/*
  FUNCTIONALITY:
  Fetch latest puzzle uploads.
*/
export const fetchLatestPuzzleImages = async (userUID) => {

  const collectionRef = collection(
    db,
    "Senders",
    userUID,
    "game",
    "puzzle",
    "puzzlePictures"
  );

  const q = query(
    collectionRef,
    orderBy("uploadedAt", "desc")
  );

  const snapshot = await getDocs(q);

  const images = [];

  snapshot.forEach((docSnap) => {
    images.push({
      id: docSnap.id,
      ...docSnap.data(),
    });
  });

  return images;
};

/*
  FUNCTIONALITY:
  Keep only latest 3 uploads.
*/
export const cleanupOldPuzzleImages = async (userUID) => {

  console.group("[PuzzleUploaderService]");
  console.log("Running cleanup...");

  const collectionRef = collection(
    db,
    "Senders",
    userUID,
    "game",
    "puzzle",
    "puzzlePictures"
  );

  const q = query(
    collectionRef,
    orderBy("uploadedAt", "desc")
  );

  const snapshot = await getDocs(q);

  const docs = snapshot.docs;

  // FUNCTIONALITY:
  // remove all older uploads beyond latest 3
  if (docs.length > 3) {

    const oldDocs = docs.slice(3);

    for (const oldDoc of oldDocs) {

      console.log("Deleting old image:", oldDoc.id);

      await deleteDoc(
        doc(
          db,
          "Senders",
          userUID,
          "game",
          "puzzle",
          "puzzlePictures",
          oldDoc.id
        )
      );
    }
  }

  console.groupEnd();
};