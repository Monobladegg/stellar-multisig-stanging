import React, { FC } from 'react'
import { sendTransaction } from '@/shared/api/firebase/firestore/Transactions';
import { Transaction } from 'stellar-sdk'
import { useStore } from '@/shared/store';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  transaction: Transaction | null;
}

const ShowXdrButtons: FC<Props> = ({transaction}) => {
  const {net} = useStore(useShallow((state) => state));
  const sendTransactionForSign = async () => {
    if (transaction) {
      const txHash = await sendTransaction(transaction, net);
      console.log(txHash)
    }
  }
  return (
    <button onClick={() => sendTransactionForSign()} >
      Send transaction for sign
    </button>
  )
}

export default ShowXdrButtons
