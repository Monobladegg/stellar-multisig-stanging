import { Net } from '@/shared/types/store/slices'
import React, { FC } from 'react'
import { InlineTransaction } from '@/features'
import { Transaction } from 'stellar-sdk'

interface Props {
  decodedTransactions: Transaction[]
  seqNumsIsStale: boolean[]
  updatedTransactionSequence: (publicKey: string, net: Net) => void
}

const ShowTransactions: FC<Props> = ({decodedTransactions, seqNumsIsStale, updatedTransactionSequence}) => {
  return (
    (
      <div className="tabs space inline-right">
        <div className="tabs-header">
          <div>
            <a href="#" className="tabs-item condensed selected">
              <span className="tabs-item-text selected">
                Transactions for sign
              </span>
            </a>
          </div>
        </div>
        <hr className="flare" />
        <div className="tabs-body">
          <div className="relative segment blank">
            <table
              className="table exportable"
              style={{ width: "100%" }}
            >
              <thead style={{ width: "100%" }}>
                <tr>
                  <th style={{ display: "none" }}>ID</th>
                  <th>Transaction</th>
                </tr>
              </thead>
              <tbody style={{ width: "100%" }}>
                {decodedTransactions.map(
                  (transaction: Transaction, index: number) => (
                    <InlineTransaction
                      key={index}
                      index={index}
                      transaction={transaction}
                      seqNumsIsStale={seqNumsIsStale}
                      updatedTransactionSequence={updatedTransactionSequence}
                    />
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  )
}

export default ShowTransactions;
