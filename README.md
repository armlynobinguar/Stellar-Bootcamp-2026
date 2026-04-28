# Stellar Philippines UniTour — University Campus Bootcamp Tour

**Platform:** [Rise In](https://www.risein.com/programs)  
**Track:** Stellar Smart Contract Bootcamp  
**Duration:** 4 Hours | 4:00 PM - 8:00 PM

---

## Overview

Welcome to the **Stellar Philippines UniTour**—a **university-wide campus bootcamp tour** that brings Soroban and Stellar to students across Philippine campuses. In this session, you’ll receive an assigned Soroban smart contract, complete it, deploy to Stellar **testnet**, then submit your work on Rise In for certification.

No prior Web3 experience needed—follow the steps below.

---

## Your Goal

1. **Receive** your assigned Soroban smart contract
2. **Complete** the contract code as instructed
3. **Test** it locally using `cargo test` (with **3+** passing tests)
4. **Deploy** it to the Stellar testnet
5. **Submit** your Contract ID + GitHub repo on Rise In

---
## Bootcamp Participant

- Full Name: Yhasmen B. Nogales
- Profession: Student / BS Computer Science
- Telegram Username: @yasmngls_fu
- Facebook: https://www.facebook.com/yhasmen.nogales.3/
  
---


## Step-by-Step Guide

### Step 1 - Set Up Your Environment

For full installation instructions and troubleshooting, use the local guide:

- `[ENG] Pre-Workshop Setup Guide.pdf`

Install the following before or at the start of the session:

- [Rust](https://rustup.rs/)
- Add WASM target:

- **macOS (Terminal):**

```bash
rustup target add wasm32-unknown-unknown
```

- **Windows (PowerShell):**

```powershell
rustup target add wasm32-unknown-unknown
```

- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli):

- **macOS (Terminal):**

```bash
cargo install --locked stellar-cli
```

- **Windows (PowerShell):**

```powershell
cargo install --locked stellar-cli
```

- [Freighter Wallet](https://freighter.app) (browser extension), set to **Testnet**

### Step 2 - Complete the Contract

Open `src/lib.rs` and complete the contract logic as instructed.

Make sure you have at least **3 passing unit tests** in `src/test.rs`.

- **macOS (Terminal):**

```bash
cargo test
```

- **Windows (PowerShell):**

```powershell
cargo test
```

### Step 3 - Deploy to Stellar Testnet

**Create an identity (first time only):**

- **macOS (Terminal):**

```bash
stellar keys generate --global my-key --network testnet
stellar keys address my-key
```

- **Windows (PowerShell):**

```powershell
stellar keys generate --global my-key --network testnet
stellar keys address my-key
```

**Fund your testnet account:**

- **macOS (Terminal):**

```bash
stellar keys fund my-key --network testnet
```

- **Windows (PowerShell):**

```powershell
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

- **macOS (Terminal):**

```bash
cargo build --target wasm32-unknown-unknown --release
ls target/wasm32-unknown-unknown/release/*.wasm
```

- **Windows (PowerShell):**

```powershell
cargo build --target wasm32-unknown-unknown --release
Get-ChildItem target\wasm32-unknown-unknown\release\*.wasm
```

If you do not see a `.wasm` file, confirm your contract crate name and retry the build command.

**Deploy to testnet:**

- **macOS (Terminal):**

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_community_treasury.wasm \
  --source my-key \
  --network testnet
```

- **Windows (PowerShell):**

```powershell
stellar contract deploy `
  --wasm target/wasm32-unknown-unknown/release/soroban_community_treasury.wasm `
  --source my-key `
  --network testnet
```

Copy the **Contract ID** from the output (starts with `C...`).

Verify on Stellar Expert:

```text
https://stellar.expert/explorer/testnet/contract/<YOUR_CONTRACT_ID>
```

### Step 4 - Submit on Rise In

Submit the following on your Rise In program page:

| Field | What to Submit |
|-------|----------------|
| **GitHub Repository** | Public repo link with your contract source code |
| **Contract ID** | Your deployed testnet contract address |
| **Stellar Expert Link** | `https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>` |
| **Short Description** | 2-3 sentences on what your contract does |

Submit on the **Rise In program page** your facilitator shares for your campus stop, or browse programs at [risein.com/programs](https://www.risein.com/programs).

---

## Git Workflow Guide

Use this Git workflow during the bootcamp, including `.gitignore` setup.
Submit using your **own GitHub repository** (not this bootcamp/facilitator repository).

### 1) Clone the Repository

- **macOS (Terminal):**

```bash
git clone <facilitator-provided-repo-link>
cd <contract-folder>
```

- **Windows (PowerShell):**

```powershell
git clone <facilitator-provided-repo-link>
Set-Location <contract-folder>
```

### 2) Connect the Project to Your Own GitHub Repository

Create a new empty repository in your GitHub account first, then update `origin` to your own repo URL:

- **macOS (Terminal):**

```bash
git remote -v
git remote set-url origin <your-github-repo-url>
git remote -v
```

- **Windows (PowerShell):**

```powershell
git remote -v
git remote set-url origin <your-github-repo-url>
git remote -v
```

Make sure `origin` points to your GitHub username/repo before pushing.

### 3) Add a `.gitignore` File

Create `.gitignore` to avoid committing build artifacts and secrets.

Recommended `.gitignore` content:

```gitignore
/target/
Cargo.lock
.DS_Store
.env
*.log
```

- **macOS (Terminal):**

```bash
touch .gitignore
nano .gitignore
```

- **Windows (PowerShell):**

```powershell
New-Item -Path .gitignore -ItemType File -Force
notepad .gitignore
```

Track `.gitignore` in Git:

```bash
git add .gitignore
git commit -m "Add gitignore for Soroban project"
```

### 4) Create Your Branch

```bash
git checkout -b <your-name>-contract-submission
```

or

```powershell
git checkout -b <your-name>-contract-submission
```

### 5) Stage and Commit Changes

```bash
git add .
git commit -m "Complete assigned Soroban contract"
```

or

```powershell
git add .
git commit -m "Complete assigned Soroban contract"
```

### 6) Push to GitHub (Your Own Repo)

```bash
git push -u origin <your-name>-contract-submission
```

or

```powershell
git push -u origin <your-name>-contract-submission
```

### 7) Useful Git Checks

```bash
git status
git log --oneline -n 5
git branch -vv
```

---

## 📁 Required Repo Structure

For **EC Contract Certificate**:

```text
contract/
└── src/
    ├── lib.rs
    └── test.rs
```

For **Prize Pool Joiner Submission**:

```text
<project-root>/
├── contract/
├── frontend/
├── backend/ (optional)
├── scripts/
│   ├── build-contract.sh
│   ├── build-contract.ps1
│   ├── deploy-testnet.sh
│   └── deploy-testnet.ps1
├── codes/
│   ├── contract-snippets/
│   ├── frontend-snippets/
│   └── backend-snippets/
├── learning/
│   ├── hello-world/
│   │   └── src/
│   │       ├── lib.rs
│   │       └── test.rs
│   ├── rust-syntax/
│   │   └── src/
│   │       ├── lib.rs
│   │       └── test.rs
│   ├── variables-and-types/
│   │   └── src/
│   │       ├── lib.rs
│   │       └── test.rs
│   ├── conditionals-and-loops/
│   │   └── src/
│   │       ├── lib.rs
│   │       └── test.rs
│   ├── functions-and-errors/
│   │   └── src/
│   │       ├── lib.rs
│   │       └── test.rs
│   ├── state-storage/
│   │   └── src/
│   │       ├── lib.rs
│   │       └── test.rs
│   ├── events/
│   │   └── src/
│   │       ├── lib.rs
│   │       └── test.rs
│   ├── auth-and-admin/
│   │   └── src/
│   │       ├── lib.rs
│   │       └── test.rs
│   ├── maps-and-keys/
│   │   └── src/
│   │       ├── lib.rs
│   │       └── test.rs
│   ├── token-ledger-basics/
│   │   └── src/
│   │       ├── lib.rs
│   │       └── test.rs
│   ├── enums-and-matches/
│   │   └── src/
│   │       ├── lib.rs
│   │       └── test.rs
│   ├── structs-and-methods/
│   │   └── src/
│   │       ├── lib.rs
│   │       └── test.rs
│   ├── storage-ttl/
│   │   └── src/
│   │       ├── lib.rs
│   │       └── test.rs
│   └── scripts/
│       ├── run-tests.sh
│       └── run-tests.ps1
└── soroban-examples/
    ├── hello-soroban/
    │   ├── Cargo.toml
    │   └── src/
    │       ├── lib.rs
    │       └── test.rs
    ├── counter-storage/
    │   ├── Cargo.toml
    │   └── src/
    │       ├── lib.rs
    │       └── test.rs
    ├── auth-check/
    │   ├── Cargo.toml
    │   └── src/
    │       ├── lib.rs
    │       └── test.rs
    ├── events-demo/
    │   ├── Cargo.toml
    │   └── src/
    │       ├── lib.rs
    │       └── test.rs
    ├── simple-voting/
    │   ├── Cargo.toml
    │   └── src/
    │       ├── lib.rs
    │       └── test.rs
    └── scripts/
        ├── run-tests.sh
        └── run-tests.ps1
```

Each module under `learning/` and `soroban-examples/` should include its own `Cargo.toml`, `src/lib.rs`, and `src/test.rs`.

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
