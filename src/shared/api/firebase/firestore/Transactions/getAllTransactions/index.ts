// shared/api/firebase/firestore/transactions.ts
import {
  collection,
  getDocs,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import firestore from "../..";

interface TransactionData {
  xdr: string;
}

const transactionConverter: FirestoreDataConverter<TransactionData> = {
  toFirestore(transaction: TransactionData): DocumentData {
    return { xdr: transaction.xdr };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): TransactionData {
    const data = snapshot.data();
    return {
      xdr: data.xdr,
    };
  },
};

async function getAllTransactions(
  net: "public" | "testnet"
): Promise<Array<{ id: string; xdr: string }>> {
  if (!firestore) {
    throw new Error("Firestore не инициализирован");
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

  const transactionsCollection = collection(firestore, collectionName).withConverter(
    transactionConverter
  );

  try {
    const querySnapshot = await getDocs(transactionsCollection);
    const transactions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      xdr: doc.data().xdr,
    }));
    return transactions;
  } catch (error) {
    console.error("Ошибка при получении транзакций: ", error);
    throw error;
  }
}

export default getAllTransactions;
