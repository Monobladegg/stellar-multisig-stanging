// shared/api/firebase/firestore/transactions.ts
import { collection, addDoc } from "firebase/firestore";
import firestore from "../..";
import { Transaction } from "stellar-sdk";

async function sendTransaction(
  transaction: Transaction | null,
  net: "public" | "testnet"
): Promise<string> {
  if (!firestore) {
    throw new Error("Firestore не инициализирован");
  }

  if (!transaction) {
    throw new Error("Отсутствует транзакция");
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

  const transactionsCollection = collection(firestore, collectionName);

  // Конвертируем транзакцию в XDR и оборачиваем в обычный объект
  const transactionData = {
    xdr: transaction.toXDR(),
    createdAt: Date.now(),
  };

  try {
    const docRef = await addDoc(transactionsCollection, transactionData);
    console.log("Документ добавлен с ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Ошибка при добавлении документа: ", error);
    throw error;
  }
}

export default sendTransaction;
