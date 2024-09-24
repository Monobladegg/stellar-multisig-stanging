import { doc, updateDoc } from "firebase/firestore";
import firestore from "../..";
import { Transaction } from "stellar-sdk";

async function sendSignatureToTransaction(
  transactionId: string,
  signedTransaction: Transaction | null,
  net: "public" | "testnet"
): Promise<void> {
  if (!firestore) {
    throw new Error("Firestore не инициализирован");
  }

  if (!signedTransaction) {
    throw new Error("Отсутствует подписанная транзакция");
  }

  // Определяем название коллекции на основе сети
  let collectionName: string;
  if (net === "public") {
    collectionName = "TransactionsForSignPublic";
  } else if (net === "testnet") {
    collectionName = "TransactionsForSignTestnet";
  } else {
    throw new Error(`Неизвестная сеть: ${net}`);
  }

  const transactionRef = doc(firestore, collectionName, transactionId);

  const newXdr = signedTransaction.toXDR();

  try {
    await updateDoc(transactionRef, {
      xdr: newXdr,
      updatedAt: Date.now(),
    });
    console.log("Транзакция успешно обновлена с новой подписью");
  } catch (error) {
    console.error("Ошибка при обновлении транзакции: ", error);
    throw error;
  }
}

export default sendSignatureToTransaction;
