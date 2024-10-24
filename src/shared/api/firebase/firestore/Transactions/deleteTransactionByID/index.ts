import { doc, deleteDoc, Firestore } from "firebase/firestore";
import { Net } from "@/shared/types/store/slices";

async function deleteTransactionByID(
  firestore: Firestore | undefined,
  net: Net,
  transactionId: string
): Promise<void> {
  if (!firestore) {
    throw new Error("Firestore not initialized");
  }

  let collectionName: string;
  if (net === "public") {
    collectionName = "TransactionsForSignPublic";
  } else if (net === "testnet") {
    collectionName = "TransactionsForSignTestnet";
  } else {
    throw new Error(`Unknown net: ${net}`);
  }

  const transactionRef = doc(firestore, collectionName, transactionId);

  try {
    await deleteDoc(transactionRef);
  } catch (error) {
    console.error("Error deleting transaction: ", error);
    throw error;
  }
}

export default deleteTransactionByID;
