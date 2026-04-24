# 📄 Product Requirements Document (PRD)

**Project Name:** StellarIsko: Pay & Mint
**Platform:** Web Application (Next.js) & Soroban Smart Contract
**Theme:** Finance & Identity (Micro-payments + Verifiable Credentials)

## 1. Executive Summary
**StellarIsko** modernizes the university document request process. It replaces the agonizing 1-3 day manual payment verification delay at state universities with instant stablecoin settlements. Furthermore, upon successful payment and processing, it automatically issues the requested document as a **Soulbound Token (SBT)** directly to the student's wallet, creating a tamper-proof, instantly verifiable digital credential.

## 2. Problem Statement
At the Polytechnic University of the Philippines (PUP), students requesting urgent academic documents (like Certificates of Registration or Transcripts) face a rigid bottleneck:
1.  **Payment Friction:** Traditional bank transfers take 1-3 business days to verify manually by the cashier.
2.  **Verification Friction:** Once issued, physical documents are easily forged and difficult for third parties (employers, other universities) to verify quickly.

## 3. Value Proposition
* **For Students:** Zero anxiety. Instant payment confirmation and permanent digital ownership of their academic records.
* **For the University:** Automated ledger reconciliation and elimination of manual payment checking.
* **For Employers:** Instant, trustless verification of a student's credentials via the blockchain.

## 4. User Stories
* **Student:** "As a student, I want to pay for my document using a stablecoin so my request is queued immediately without a 3-day waiting period."
* **Student:** "As a graduating student, I want my Certificate of Registration minted to my wallet so I can prove my enrollment status instantly to employers."
* **Registrar (Admin):** "As an admin, I want a dashboard that automatically flags paid requests so I only spend time generating documents, not checking bank receipts."

## 5. Functional Requirements

### 5.1. Student Facing (Next.js Web App)
* **Wallet Integration:** Users must be able to connect a Stellar wallet (e.g., Freighter).
* **Document Catalog:** A UI to select which document to request and view the USDC/PHP fee.
* **Checkout Flow:** A one-click transaction trigger that prompts the wallet to sign the payment.
* **Credential Wallet UI:** A dedicated dashboard tab displaying all Soulbound Tokens (academic documents) the student currently holds.

### 5.2. Admin Facing (Dashboard)
* **Automated Queue:** A real-time feed of requested documents that have a verified on-chain payment status.
* **Issuance Trigger:** A button that allows the admin to mark a document as "Processed," triggering the smart contract to mint the SBT to the student.

### 5.3. Smart Contract (Soroban / Rust)
* **Payment Escrow/Routing:** Accept USDC from the student and route it to the University Treasury.
* **SBT Registry:** A data structure mapping a student's `Address` to a specific `Document Hash`.
* **Non-Transferability (The Soulbound Mechanic):** The contract must physically prevent the token/credential from being transferred to another wallet once minted.

## 6. Technical Architecture & Tech Stack
To move fast during a hackathon weekend, we will utilize a modern web development stack paired with Stellar's robust infrastructure:

| Component | Technology Choice | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | Next.js (App Router), Tailwind CSS | Fast, reactive student and admin dashboards. |
| **Wallet Auth** | Stellar Freighter API | Secure user login and transaction signing. |
| **Smart Contract** | Rust (Soroban SDK) | Handling the payment logic and SBT registry. |
| **Off-Chain DB** | Supabase (PostgreSQL) | Storing non-critical metadata (e.g., student names, UI display preferences) to keep on-chain costs low. |
| **Blockchain** | Stellar Testnet | Network for executing transactions and deploying the contract. |

---

# 📚 Technical Documentation & Implementation Guide

This section defines the precise mechanics of how the Soulbound Token (SBT) works within the Stellar/Soroban ecosystem.

## 1. How the Soulbound Mechanic Works on Soroban
Unlike standard Stellar Assets which are inherently tradable, our SBT is implemented natively within the Soroban contract state. 

Instead of issuing a standard token, the contract maintains a strict registry. When a document is issued, the contract writes a record linking the `Student_Address` to the `Document_Metadata_Hash`. Because there is **no transfer function** written into this contract, the credential is mathematically locked to the student's address forever.

## 2. Core Smart Contract API (MVP Scope)

### `initialize(env: Env, treasury: Address, payment_token: Address)`
Sets up the contract with the university's receiving wallet and the accepted stablecoin (e.g., USDC).

### `request_and_pay(env: Env, student: Address, doc_type: u32, amount: i128)`
1.  Verifies the student signed the transaction.
2.  Transfers `amount` of `payment_token` from the student to the `treasury`.
3.  Emits a `PaymentReceived` event so the Next.js frontend updates instantly.

### `issue_soulbound_credential(env: Env, admin: Address, student: Address, doc_hash: BytesN<32>)`
1.  Verifies the `admin` (Registrar) signed the transaction.
2.  Writes to persistent storage: `DataKey::Credential(student, doc_hash) = true`.
3.  Emits a `CredentialMinted` event.

### `verify_credential(env: Env, student: Address, doc_hash: BytesN<32>) -> bool`
A read-only function that employers or third parties can call to check if a student legitimately holds a specific document.

## 3. Hackathon Execution Plan (48 Hours)

* **Friday Night (Hours 1-8):** * Initialize the Next.js repository.
    * Set up Supabase for basic user tracking.
    * Draft the Soroban contract (`lib.rs`) with just the payment and minting functions.
* **Saturday (Hours 9-32):**
    * Deploy the contract to the Stellar Testnet.
    * Build the frontend connection: wire up the Freighter wallet to trigger the `request_and_pay` function.
    * Build the Admin view to trigger the `issue_soulbound_credential` function.
* **Sunday (Hours 33-48):**
    * Polish the UI (add a confetti animation when the SBT drops into their wallet).
    * Record the 2-minute pitch video proving the instant settlement.

## 4. Pitch Strategy for Judges
**The Hook:** Start by asking the room: *"Who here has ever waited days for a university cashier to clear a simple payment?"* **The Demo:** Show a split screen. On the left, the Student hits "Pay 150 USDC". On the right, the Admin dashboard instantly lights up green in under 5 seconds. The admin hits "Issue Document," and the Student's wallet instantly displays a verified, untamperable Certificate of Registration.
**The Close:** You aren't just speeding up payments; you are turning a painful administrative bottleneck into a permanent, verifiable digital identity for the student.