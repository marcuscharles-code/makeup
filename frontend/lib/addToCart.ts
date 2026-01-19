import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

export async function addToCart(item: {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}) {
  // 🔍 DEBUG: AUTH STATE
  const auth = getAuth();
  const user = auth.currentUser;

  console.log("🟣 Auth user:", user?.uid);

  if (!user) {
    throw new Error("User not authenticated");
  }

  // 🔍 DEBUG: DATA RECEIVED
  console.log("🟢 addToCart received item:", item);

  // 🚨 GUARD AGAINST UNDEFINED
  Object.entries(item).forEach(([key, value]) => {
    if (value === undefined) {
      console.error(`❌ Undefined field detected: ${key}`);
      throw new Error(`Invalid cart field: ${key}`);
    }
  });

  const cartRef = doc(db, "users", user.uid, "cart", item.productId);

  console.log("🟡 Cart document path:", cartRef.path);

  const snap = await getDoc(cartRef);

  if (snap.exists()) {
    console.log("🔁 Item already in cart. Updating quantity...");

    await updateDoc(cartRef, {
      quantity: snap.data().quantity + (item.quantity || 1),
      updatedAt: serverTimestamp(),
    });
  } else {
    console.log("🆕 Item not in cart. Creating new document...");

    await setDoc(cartRef, {
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity || 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  console.log("✅ addToCart completed successfully");
}
