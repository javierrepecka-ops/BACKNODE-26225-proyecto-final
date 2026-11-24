// Capa de modelos: única capa que habla con Firestore
// Se usan getDocsFromServer/getDocFromServer para que, si Firestore no responde,
// se produzca un error (-> 500) en lugar de devolver datos vacíos de la caché local.
import {
  collection,
  doc,
  getDocsFromServer,
  getDocFromServer,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase.js";

const COLLECTION = process.env.FIRESTORE_COLLECTION || "products";
const productsCollection = collection(db, COLLECTION);

// Convierte un documento de Firestore en un objeto plano con su id
const toProduct = (snap) => {
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    // Los Timestamp de Firestore se devuelven como fecha ISO
    ...(data.createdAt?.toDate && { createdAt: data.createdAt.toDate().toISOString() }),
    ...(data.updatedAt?.toDate && { updatedAt: data.updatedAt.toDate().toISOString() }),
  };
};

export const getAll = async () => {
  const snapshot = await getDocsFromServer(productsCollection);
  return snapshot.docs.map(toProduct);
};

export const getById = async (id) => {
  const snap = await getDocFromServer(doc(db, COLLECTION, id));
  return snap.exists() ? toProduct(snap) : null;
};

export const create = async (product) => {
  const ref = await addDoc(productsCollection, {
    ...product,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...product };
};

export const update = async (id, data) => {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDocFromServer(ref);
  if (!snap.exists()) return null;
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  const updated = await getDocFromServer(ref);
  return toProduct(updated);
};

export const remove = async (id) => {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDocFromServer(ref);
  if (!snap.exists()) return false;
  await deleteDoc(ref);
  return true;
};
