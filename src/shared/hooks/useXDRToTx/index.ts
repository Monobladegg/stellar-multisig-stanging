import { useState, useEffect } from 'react';
import __wbg_init, { decode } from "@stellar/stellar-xdr-json-web";

const useXDRToTransaction = (xdr: string) => {
  const [transaction, setTransaction] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const decodeXDR = async () => {
      if (!xdr) {
        setTransaction(null);
        setError(null);
        return;
      }

      try {
        await __wbg_init();  // Инициализируем WebAssembly
        const decodedTransaction = decode(xdr, 'base64');  // Декодируем XDR строку

        setTransaction(decodedTransaction);
        setError(null);
      } catch (err) {
        setTransaction(null);
        setError('Invalid XDR format or decoding error.');
      }
    };

    decodeXDR();
  }, [xdr]);

  return { transaction, error };
};

export default useXDRToTransaction;
