# 🚀 StellarIsko: Implementation Roadmap

**Project Goal:** Modernize university document requests using instant USDC payments and Soulbound Token (SBT) credentials.

## 📍 Current Status: [INTEGRATION]
- [x] Initial research and environment setup.
- [x] PRD defined for "StellarIsko: Pay & Mint".
- [x] Refactor `stellaroid_earn` to `stellar_isko`.
- [x] Implement Soulbound Token (SBT) logic.
- [x] Initialize Next.js Frontend.
- [x] Integrate Freighter Wallet.

---

## 🛠 Phase 1: Smart Contract Refactor (Soroban/Rust) - COMPLETE ✅
**Goal:** Align the contract with the API defined in `PRD.md`.

### 1.1. Rename & Rebrand ✅
- Rename directory: `stellaroid_earn` -> `stellar_isko`.
- Update `Cargo.toml` package name to `stellar_isko`.

### 1.2. Core Logic Updates (`lib.rs`) ✅
- **`initialize`**: Add `treasury` and `payment_token` setup.
- **`request_and_pay`**: Handle the student-to-university USDC transfer.
- **`issue_soulbound_credential`**: Implement the permanent on-chain registry (SBT).
- **`verify_credential`**: Read-only check for employers.

### 1.3. Validation ✅
- Update `test.rs` to cover the new payment flow and SBT "locked" state.
- **Result:** `cargo test` passed with 100% success.

---

## 💻 Phase 2: Frontend Development (Next.js) - COMPLETE ✅
**Goal:** Build a clean UI for students and admins.

### 2.1. Scaffolding ✅
- Initialize `app/` directory with Next.js 14/15.
- Set up Tailwind CSS for a modern "State University" aesthetic.

### 2.2. Wallet Integration ✅
- Install `@stellar/freighter-api`.
- Create a `ConnectWallet` component.
- **Result:** Successfully connected Freighter wallet and retrieved public address.

### 2.3. Transaction Flow ✅
- Build the "Checkout" page where students trigger `request_and_pay`.
- Build the "Credential Wallet" where students see their minted documents.
- **Result:** UI designed with real wallet connectivity.

---

## 🧪 Phase 3: Deployment & Integration - IN PROGRESS 🏗️
**Goal:** Launch on Stellar Testnet and verify end-to-end.

- [x] **Deploy:** Deploy `stellar_isko.wasm` to Testnet. ✅
  - **Contract ID:** `CALAEYLGS5GPW74BETR77543UBKUFUPTOD3HOYMODGWQFHWQ7JBDUHT3`
- [x] **Initialize:** Contract initialized with Admin, Treasury, and Native XLM. ✅
- [x] **Client Generation:** TypeScript client generated and built. ✅
- [x] **Connect:** Wire the frontend to the deployed Contract ID. ✅
- [ ] **Demo:** Record the 2-minute "Instant Payment to SBT Mint" flow.

---

## ⚠️ Anticipated Challenges
1. **SBT Storage:** Ensuring the credential is "Soulbound" (cannot be moved) by simply not writing a transfer function.
2. **XLM/USDC Handling:** Managing trustlines for the student's wallet before they can pay.
3. **Admin Auth:** Ensuring only the Registrar's wallet can call `issue_soulbound_credential`.

---

## ✅ Progress Checklist
- [x] `Cargo.toml` Updated
- [x] `lib.rs` Logic Matched to PRD
- [x] Unit Tests Passing (`cargo test`)
- [x] Next.js App Initialized
- [x] Freighter Connection Successful
- [x] Contract Deployed and Initialized
