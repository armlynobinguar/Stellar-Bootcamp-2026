# 🚀 Stellar Philippines UniTour — University Campus Bootcamp Tour

**Platform:** [Rise In](https://www.risein.com/programs)  
**Track:** Stellar Smart Contract Bootcamp  
**Duration:** 4 Hours | 4:00 PM - 8:00 PM

---

## 📋 Overview

Welcome to the **Stellar Philippines UniTour**—a **university-wide campus bootcamp tour** that brings Soroban and Stellar to students across Philippine campuses. In this session, you’ll receive an assigned Soroban smart contract, complete it, deploy to Stellar **testnet**, then submit your work on Rise In for certification.

No prior Web3 experience needed—follow the steps below.

---

## 🎯 Your Goal

1. **Receive** your assigned Soroban smart contract
2. **Complete** the contract code as instructed
3. **Test** it locally using `cargo test` (with **3+** passing tests)
4. **Deploy** it to the Stellar testnet
5. **Submit** your Contract ID + GitHub repo on Rise In

---

## ✅ Step-by-Step Guide

### Step 1 - Set Up Your Environment

For full installation instructions and troubleshooting, use the local guide:

- `[ENG] Pre-Workshop Setup Guide.pdf`

Install the following before or at the start of the session:

- [Rust](https://rustup.rs/)
- Add WASM target:

```bash
rustup target add wasm32-unknown-unknown
```

- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli):

```bash
cargo install --locked stellar-cli --features opt
```

- [Freighter Wallet](https://freighter.app) (browser extension), set to **Testnet**

### Step 2 - Get Your Assigned Contract

Your facilitator will share the assigned smart contract during the session.

```bash
git clone <facilitator-provided-repo-link>
cd <contract-folder>
```

### Step 3 - Complete the Contract

Open `src/lib.rs` and complete the contract logic as instructed.

Make sure you have at least **3 passing unit tests** in `src/test.rs`.

```bash
cargo test
```

### Step 4 - Deploy to Stellar Testnet

**Create an identity (first time only):**

```bash
stellar keys generate --global my-key --network testnet
stellar keys address my-key
```

**Fund your testnet account:**

```bash
stellar keys fund my-key --network testnet
```

**Fund XLM to your Freighter Testnet wallet (macOS + Windows):**

1. Open Freighter and switch network to **Testnet**.
2. Copy your wallet public address (starts with `G...`).
3. Open Friendbot and fund your address:
   - [https://friendbot.stellar.org](https://friendbot.stellar.org)
4. Paste your `G...` address and submit.
5. Wait a few seconds, then refresh Freighter to see test XLM.

If Friendbot UI is unavailable, use this CLI fallback:

- **macOS (Terminal):**

```bash
curl "https://friendbot.stellar.org?addr=<YOUR_FREIGHTER_TESTNET_ADDRESS>"
```

- **Windows (PowerShell):**

```powershell
Invoke-WebRequest "https://friendbot.stellar.org?addr=<YOUR_FREIGHTER_TESTNET_ADDRESS>"
```

**Build your contract:**

```bash
cargo build --target wasm32-unknown-unknown --release
```

Confirm the compiled WASM file exists:

```bash
ls target/wasm32-unknown-unknown/release/*.wasm
```

**Deploy to testnet:**

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_community_treasury.wasm \
  --source my-key \
  --network testnet
```

Copy the **Contract ID** from the output (starts with `C...`).

Verify on Stellar Expert:

```text
https://stellar.expert/explorer/testnet/contract/<YOUR_CONTRACT_ID>
```

### Step 5 - Submit on Rise In

Submit the following on your Rise In program page:

| Field | What to Submit |
|-------|----------------|
| **GitHub Repository** | Public repo link with your contract source code |
| **Contract ID** | Your deployed testnet contract address |
| **Stellar Expert Link** | `https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>` |
| **Short Description** | 2-3 sentences on what your contract does |

Submit on the **Rise In program page** your facilitator shares for your campus stop, or browse programs at [risein.com/programs](https://www.risein.com/programs).

---

## 📁 Required Repo Structure

```text
my-soroban-contract/
├── src/
│   ├── lib.rs
│   └── test.rs
├── Cargo.toml
└── README.md
```

---

## 🏆 Certificate Requirements

| Requirement | Status |
|-------------|--------|
| ✅ Attend the bootcamp session | Required |
| ✅ Complete the assigned smart contract | Required |
| ✅ Pass `cargo test` with 3+ tests | Required |
| ✅ Deploy contract to Stellar testnet | Required |
| ✅ Submit on Rise In (repo + contract ID) | Required |

> Certificates are typically issued within **3-5 business days** after review.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Rise In Programs | [risein.com/programs](https://www.risein.com/programs) |
| Stellar Docs | [developers.stellar.org](https://developers.stellar.org) |
| Soroban SDK | [docs.rs/soroban-sdk](https://docs.rs/soroban-sdk) |
| Stellar CLI Docs | [developers.stellar.org/docs/tools/stellar-cli](https://developers.stellar.org/docs/tools/stellar-cli) |
| Freighter Wallet | [freighter.app](https://freighter.app) |
| Stellar Expert (Testnet) | [stellar.expert/explorer/testnet](https://stellar.expert/explorer/testnet) |
| Stellar Lab | [lab.stellar.org](https://lab.stellar.org) |

---

## 🇵🇭 About Stellar Philippines UniTour

The Stellar UniTour is a **multi-campus roadshow**: the same Stellar Smart Contract Bootcamp format travels to universities across the Philippines so more students can build and deploy on **testnet** with guided support. It is run in partnership with [Rise In](https://risein.com).

---

*Questions? Ask your facilitator during the session or reach out via the Rise In platform.*
