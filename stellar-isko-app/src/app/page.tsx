"use client";

import React, { useState, useEffect, useCallback } from "react";
import { connectWallet, signWithFreighter } from "@/lib/stellar";
import { Client, networks } from "@/client";

// Types for our University Documents
interface DocumentItem {
  id: string;
  name: string;
  price: number; // in USDC/XLM
  description: string;
  hash: string; // The 32-byte hex hash representing this doc type
}

// Fixed hashes for our documents (matching the CLI hashes)
const documentCatalog: DocumentItem[] = [
  { 
    id: "cor", 
    name: "Certificate of Registration (COR)", 
    price: 5, 
    description: "Official proof of enrollment for the current semester.",
    hash: "0000000000000000000000000000000000000000000000000000000000000001"
  },
  { 
    id: "tor", 
    name: "Transcript of Records (TOR)", 
    price: 15, 
    description: "Official record of all grades and courses completed.",
    hash: "0000000000000000000000000000000000000000000000000000000000000002"
  },
  { 
    id: "cog", 
    name: "Certificate of Grades (COG)", 
    price: 3, 
    description: "Current semester grades for scholarship applications.",
    hash: "0000000000000000000000000000000000000000000000000000000000000003"
  },
];

export default function Home() {
  const [view, setView] = useState<"student" | "registrar">("student");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [ownedDocs, setOwnedDocs] = useState<DocumentItem[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  // Registrar Form State
  const [targetStudent, setTargetStudent] = useState("");
  const [targetDocHash, setTargetDocHash] = useState(documentCatalog[0].hash);

  const fetchOwnedDocs = useCallback(async (address: string) => {
    setLoadingDocs(true);
    const client = new Client({
      ...networks.testnet,
      publicKey: address,
    });

    const found: DocumentItem[] = [];
    try {
      for (const doc of documentCatalog) {
        const hashBuffer = Buffer.from(doc.hash, "hex");
        const { result } = await client.verify_credential({
          student: address,
          doc_hash: hashBuffer,
        });
        if (result === true) found.push(doc);
      }
      setOwnedDocs(found);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    if (walletAddress) fetchOwnedDocs(walletAddress);
    else setOwnedDocs([]);
  }, [walletAddress, fetchOwnedDocs]);

  const handleConnect = async () => {
    const pubKey = await connectWallet();
    if (pubKey) setWalletAddress(pubKey);
  };

  const handlePayment = async () => {
    if (!selectedDoc || !walletAddress) return;
    setProcessing(true);
    setSuccess(false);
    try {
      const client = new Client({
        ...networks.testnet,
        publicKey: walletAddress,
        signTransaction: async (tx) => {
          const signed = await signWithFreighter(tx, networks.testnet.networkPassphrase);
          if (!signed) throw new Error("Cancelled");
          return signed;
        }
      });
      const amountBigInt = BigInt(selectedDoc.price) * BigInt(10000000);
      const tx = await client.request_and_pay({ student: walletAddress, amount: amountBigInt });
      const response = await tx.signAndSend();
      // @ts-ignore
      setTxHash(response.hash || "unknown");
      setSuccess(true);
    } catch (err) {
      alert("Payment failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handleIssueCredential = async () => {
    if (!walletAddress || !targetStudent) return;
    setProcessing(true);
    try {
      const client = new Client({
        ...networks.testnet,
        publicKey: walletAddress,
        signTransaction: async (tx) => {
          const signed = await signWithFreighter(tx, networks.testnet.networkPassphrase);
          if (!signed) throw new Error("Cancelled");
          return signed;
        }
      });

      const hashBuffer = Buffer.from(targetDocHash, "hex");
      const tx = await client.issue_soulbound_credential({
        admin: walletAddress,
        student: targetStudent,
        doc_hash: hashBuffer,
      });

      const response = await tx.signAndSend();
      alert("Credential Issued Successfully on Testnet!");
      console.log("Issue Result:", response);
    } catch (err) {
      console.error(err);
      alert("Issuance failed. Are you sure you are the Admin?");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 selection:bg-pup-maroon/20 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-pup-maroon rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-pup-maroon/20">S</div>
            <span className="text-xl font-bold text-neutral-900 tracking-tight">Stellar<span className="text-pup-maroon">Isko</span></span>
          </div>
          
          <div className="hidden md:flex bg-neutral-100 p-1 rounded-xl border border-neutral-200">
            <button 
              onClick={() => setView("student")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${view === "student" ? "bg-white text-pup-maroon shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
            >Student View</button>
            <button 
              onClick={() => setView("registrar")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${view === "registrar" ? "bg-white text-pup-maroon shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
            >Registrar Dashboard</button>
          </div>
        </div>
        
        <button 
          onClick={handleConnect}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
            walletAddress ? "bg-neutral-100 text-neutral-600 border border-neutral-200" : "bg-pup-maroon text-white hover:bg-pup-dark shadow-md"
          }`}
        >
          {walletAddress ? `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : "Connect Wallet"}
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {view === "student" ? (
          <>
            {/* Student View Content */}
            <section className="mb-16">
              <h1 className="text-5xl lg:text-6xl font-black text-neutral-900 mb-4 leading-tight tracking-tight">Instant Payments. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pup-maroon to-rose-600 font-black">Soulbound Credentials.</span></h1>
              <p className="text-xl text-neutral-500 max-w-2xl leading-relaxed">Modernizing the PUP experience. Documents are verified on-chain and persist in your wallet forever.</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
              <section className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-pup-maroon rounded-full"></span>Document Catalog
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentCatalog.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`group p-6 text-left rounded-2xl border transition-all duration-300 ${
                        selectedDoc?.id === doc.id ? "bg-white border-pup-maroon shadow-2xl ring-2 ring-pup-maroon/10 scale-[1.02]" : "bg-white border-neutral-200 hover:border-pup-maroon/30"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-neutral-50 rounded-lg">
                          <svg className={`w-6 h-6 ${selectedDoc?.id === doc.id ? "text-pup-maroon" : "text-neutral-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-sm font-bold bg-pup-gold/10 text-pup-dark px-3 py-1 rounded-full">{doc.price} XLM</span>
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-2">{doc.name}</h3>
                      <p className="text-sm text-neutral-500 leading-snug">{doc.description}</p>
                    </button>
                  ))}
                </div>
              </section>

              <aside className="lg:sticky lg:top-28 h-fit">
                <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-2xl relative overflow-hidden">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6 relative">Summary</h2>
                  {selectedDoc ? (
                    <div className="space-y-6 relative">
                      <div className="flex justify-between text-neutral-600"><span>Document Fee</span><span>{selectedDoc.price}.00 XLM</span></div>
                      <div className="pt-6 border-t border-neutral-100"><div className="flex justify-between text-xl font-black text-neutral-900"><span>Total</span><span>{selectedDoc.price}.00 XLM</span></div></div>
                      <button
                        disabled={processing || !walletAddress}
                        onClick={handlePayment}
                        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                          walletAddress ? "bg-pup-maroon text-white hover:bg-pup-dark shadow-xl shadow-pup-maroon/20" : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
                        }`}
                      >
                        {processing ? "Processing..." : success ? "Payment Sent!" : walletAddress ? "Confirm & Pay" : "Connect Wallet First"}
                      </button>
                      {success && <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm text-center font-medium animate-pulse">Payment confirmed! Awaiting registrar issuance.</div>}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-neutral-400 border-2 border-dashed border-neutral-100 rounded-2xl">Select a document to begin</div>
                  )}
                </div>
              </aside>
            </div>

            {/* Credential Wallet Section */}
            <section className="space-y-8">
              <div className="flex items-end justify-between">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-neutral-900">Your Credential Wallet</h2>
                  <p className="text-neutral-500">Your soulbound academic documents are anchored on the Stellar Ledger.</p>
                </div>
                <button onClick={() => walletAddress && fetchOwnedDocs(walletAddress)} className="text-sm font-bold text-pup-maroon hover:underline">↻ Refresh Ledger</button>
              </div>

              {loadingDocs ? (
                <div className="py-20 text-center text-neutral-400 animate-pulse font-medium">Querying the blockchain ledger...</div>
              ) : ownedDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownedDocs.map((doc) => (
                    <div key={doc.id} className="group relative bg-white p-1 rounded-3xl border border-pup-maroon/20 shadow-xl overflow-hidden hover:scale-[1.02] transition-transform duration-500">
                      <div className="relative p-6 bg-white rounded-[1.4rem] border border-neutral-100">
                        <div className="flex justify-between items-start mb-8">
                          <div className="w-12 h-12 bg-pup-maroon/10 rounded-xl flex items-center justify-center text-pup-maroon">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                          </div>
                          <span className="text-[10px] font-black tracking-widest uppercase text-pup-maroon bg-pup-maroon/5 px-2 py-1 rounded border border-pup-maroon/10">Verified SBT</span>
                        </div>
                        <h3 className="text-xl font-black text-neutral-900 mb-1">{doc.name}</h3>
                        <p className="text-xs text-neutral-400 font-mono mb-6 tracking-tight">Proof: STLR-ISKO-{doc.id.toUpperCase()}-AN-CH-N</p>
                        <div className="pt-6 border-t border-dashed border-neutral-200 flex items-center justify-between">
                          <button className="text-xs font-bold text-pup-maroon hover:underline">View on Explorer →</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 bg-white rounded-3xl border-2 border-dashed border-neutral-100 flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-neutral-400 font-medium tracking-tight text-lg">No credentials found on-chain for this wallet. <br /> Once issued by the registrar, they will appear here permanently.</p>
                </div>
              )}
            </section>
          </>
        ) : (
          /* Registrar Dashboard Content */
          <section className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-black text-neutral-900 tracking-tight tracking-tight">Registrar Dashboard</h1>
              <p className="text-xl text-neutral-500">Official document issuance portal for the Polytechnic University.</p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-neutral-200 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pup-gold/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-wider text-neutral-400 ml-1">Student Wallet Address</label>
                <input 
                  type="text" 
                  placeholder="G..." 
                  value={targetStudent}
                  onChange={(e) => setTargetStudent(e.target.value)}
                  className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-pup-maroon/20 focus:border-pup-maroon outline-none transition-all font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-wider text-neutral-400 ml-1">Document to Issue</label>
                <select 
                  value={targetDocHash}
                  onChange={(e) => setTargetDocHash(e.target.value)}
                  className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-pup-maroon/20 focus:border-pup-maroon outline-none transition-all font-bold text-neutral-700"
                >
                  {documentCatalog.map(doc => (
                    <option key={doc.id} value={doc.hash}>{doc.name}</option>
                  ))}
                </select>
              </div>

              <div className="p-6 bg-pup-gold/5 border border-pup-gold/20 rounded-2xl space-y-3">
                <h4 className="font-bold text-pup-dark flex items-center gap-2 italic">⚠️ Registrar Security Notice</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">Issuing a document is a permanent blockchain transaction. Only authorized admin wallets can perform this action. Ensure the student has already paid the required XLM fee.</p>
              </div>

              <button 
                onClick={handleIssueCredential}
                disabled={processing || !walletAddress || !targetStudent}
                className="w-full py-5 bg-neutral-900 text-white rounded-2xl font-black text-lg hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "Signing Transaction..." : "Authorize & Issue SBT"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-neutral-200 rounded-3xl space-y-2 shadow-sm">
                <h4 className="text-neutral-400 text-xs font-black uppercase tracking-widest">Active Admin</h4>
                <p className="font-mono text-sm text-neutral-700 break-all">{walletAddress || "Not Connected"}</p>
              </div>
              <div className="p-6 bg-white border border-neutral-200 rounded-3xl space-y-2 shadow-sm">
                <h4 className="text-neutral-400 text-xs font-black uppercase tracking-widest">Contract ID</h4>
                <p className="font-mono text-sm text-neutral-700 break-all">CALA...UHT3</p>
              </div>
            </div>
          </section>
        )}
      </div>
      
      <footer className="bg-neutral-900 text-white py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4"><h4 className="text-xl font-bold text-pup-gold italic">Stellar Speed</h4><p className="text-neutral-400">Transactions settle in under 5 seconds. Real-time university operations.</p></div>
          <div className="space-y-4"><h4 className="text-xl font-bold text-pup-gold italic">Zero Forgery</h4><p className="text-neutral-400">Documents are Soulbound Tokens. Permanent and untamperable records.</p></div>
          <div className="space-y-4"><h4 className="text-xl font-bold text-pup-gold italic">PUP Legacy</h4><p className="text-neutral-400">Next-generation infrastructure for the Iskolars ng Bayan.</p></div>
        </div>
      </footer>
    </main>
  );
}
