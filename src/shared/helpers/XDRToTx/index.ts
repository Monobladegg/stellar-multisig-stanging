import __wbg_init, { decode } from "@stellar/stellar-xdr-json-web";

async function decodeXDRToTransaction(xdr: string) {
  if (!xdr) {
    throw new Error('XDR string is required');
  }

  try {
    await __wbg_init();
    const decodedTransaction = decode(xdr, 'base64');
    return decodedTransaction;
  } catch (err) {
    throw new Error('Invalid XDR format or decoding error.', err as Error);
  }
}

export default decodeXDRToTransaction;
