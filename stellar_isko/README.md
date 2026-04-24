# Stellaroid Earn 🎓

**Problem:** A graduating student in the Philippines cannot easily prove their credentials to employers or access financial opportunities, forcing them to rely on manual verification that delays hiring and limits income.

**Solution:** Using Stellar, Stellaroid Earn builds a transparent on-chain system where each certificate has a unique, traceable identity anchored to its rightful owner. Students unlock XLM-based rewards, job payouts, and financial access upon instant credential verification.

## 🚀 Features
- **On-chain Registration:** Securely register certificate hashes mapped to student addresses.
- **Learn-to-Earn Rewards:** Automatically reward students with XLM (or other tokens) upon credential issuance.
- **Employer Payments:** Streamlined, instant payments from employers to verified student wallets.
- **Tamper-Proof Verification:** Verify any credential in seconds using the Stellar blockchain.

## 🛠 Tech Stack
- **Smart Contract:** Soroban (Rust)
- **Asset Transfers:** Stellar Asset Contract (SAC) for XLM/USDC
- **Blockchain:** Stellar Testnet

## 📅 Timeline
- **Phase 1 (MVP):** Smart contract for registration and rewards (Completed)
- **Phase 2:** Frontend dApp for student dashboard and employer verification (In Progress)
- **Phase 3:** Integration with University Anchor nodes for official issuance.

## 🏗 Build & Test

### Prerequisites
- [Rust & Cargo](https://rustup.rs/)
- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli)

### Build the Contract
```bash
cargo build --target wasm32-unknown-unknown --release
```

### Run Tests
```bash
cargo test
```

### Deploy to Testnet
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellaroid_earn.wasm \
  --source my-key \
  --network testnet
```

### Sample CLI Invocation
Register a certificate:
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source student-key \
  --network testnet \
  -- \
  register_certificate \
  --student <STUDENT_ADDRESS> \
  --cert_hash <32_BYTE_HASH>
```

## 📜 License
MIT License
