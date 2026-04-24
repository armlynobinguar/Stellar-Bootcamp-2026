import freighter from "@stellar/freighter-api";

const { isConnected, getAddress, setAllowed, signTransaction } = freighter;

export const connectWallet = async () => {
  console.log("Checking Freighter connection...");
  const connected = await isConnected();
  
  if (connected) {
    try {
      // Step 1: Request permission from the user to see their address
      console.log("Requesting access (setAllowed)...");
      await setAllowed(); 
      
      // Step 2: Now that it's allowed, get the address
      console.log("Requesting address...");
      const result = await getAddress();
      console.log("Raw result from getAddress:", result);
      
      const address = typeof result === "string" ? result : result.address;
      
      if (!address) {
        console.warn("Address is still empty. Is your wallet locked?");
        alert("Wallet connected but address is hidden. Please unlock your Freighter wallet.");
        return null;
      }

      console.log("Retrieved address:", address);
      return address;
    } catch (e) {
      console.error("Error connecting wallet:", e);
      return null;
    }
  } else {
    alert("Please install Freighter wallet extension.");
    return null;
  }
};

export const signWithFreighter = async (xdr: string, networkPassphrase: string) => {
  try {
    const signedXdr = await signTransaction(xdr, {
      networkPassphrase,
    });
    return signedXdr;
  } catch (e) {
    console.error(e);
    return null;
  }
};
