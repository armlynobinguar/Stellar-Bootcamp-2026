# PledgeRun

**Trustless crowdfunding on Stellar** — campaign rules and pledge balances enforced by a **Soroban** smart contract, with an optional **React** UI in `web/`.

Submitted for the **Stellar Philippines UniTour — University of East Caloocan** bootcamp via [Rise In](https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan).

**Student:** Troy Lauren T. Lazaro · BSIT 2nd Year (BSIT2-1N) · Telegram: [@Itsniched](https://t.me/Itsniched)

---

## Problem and solution

**Problem:** College students and indie creators often lose money to crowdfunding platforms that charge high fees, can freeze funds, and offer weak guarantees when a campaign fails.

**Solution:** **PledgeRun** uses a Soroban contract to store campaign state on-chain: pledges accrue toward a goal and deadline; after the deadline, the contract supports **release** (goal met) or **refund** (goal not met) — no platform in the middle of the rules.

More detail: [PROJECT_BRIEF.md](./PROJECT_BRIEF.md).

---

## Timeline

| Phase | Focus |
|--------|--------|
| **Design** | Problem/solution, contract storage & auth model |
| **Contract** | `init` / `pledge` / `release` / `refund` + unit tests |
| **Frontend** | Vite + React + Freighter (`web/`), testnet RPC |
| **Deploy** | WASM build, testnet deploy, `VITE_CONTRACT_ID` for the UI |

---

## Stellar features used

| Feature | Use in PledgeRun |
|--------|-------------------|
| **Soroban smart contract** | Escrow-style campaign state, `Address` auth, instance storage (`Campaign`, pledge `Map`) |
| **Stellar testnet** | Deploy + invoke via Stellar CLI; web uses Soroban RPC (`soroban-testnet.stellar.org`) |
| **Freighter** | Wallet connect + sign transactions from the browser |
| **Native XLM settlement** | Roadmap — MVP records pledge **amounts** on-chain; wiring token transfers is a follow-on |

---

## Prerequisites

| Tool | Notes |
|------|--------|
| **Rust** | Stable toolchain via [rustup](https://rustup.rs/) (e.g. **1.75+** recommended) |
| **WASM target** | `rustup target add wasm32v1-none` |
| **Stellar CLI** (includes Soroban workflows) | **≥ 20.x** — check with `stellar --version` (e.g. **25.x**). Install: [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli) — `cargo install --locked stellar-cli` |
| **Node.js** | **18+** for `web/` (optional) |

Older tutorials may refer to a standalone **`soroban`** binary; current releases expose the same flows as **`stellar contract …`**.

---

## How to build

From the repository root:

```bash
cd contract
stellar contract build
```

Output (default): `contract/target/wasm32v1-none/release/pledge_run.wasm`.

If your environment still has the legacy Soroban CLI name:

```bash
soroban contract build
```

(equivalent intent; prefer **`stellar contract build`** with the unified CLI.)

---

## How to test

```bash
cd contract
cargo test
```

Expect **3** tests passing.

---

## How to deploy to testnet

Fund a testnet identity (once), build WASM, then deploy:

```bash
stellar keys generate student --network testnet   # skip if you already have a key
stellar keys fund student --network testnet

cd contract
stellar contract build
stellar contract deploy \
  --wasm target/wasm32v1-none/release/pledge_run.wasm \
  --source-account student \
  --network testnet
```

Copy the printed **Contract ID** (`C…`). For the web app, set `VITE_CONTRACT_ID` in `web/.env` (see `web/.env.example`).

Legacy alias:

```bash
soroban contract deploy --wasm ... --source-account student --network testnet
```

---

## Deployed contract (testnet)

> ✅ Live on Stellar testnet — deployed 2026-03-30.

| Field | Value |
|-------|-------|
| **Contract ID** | `CDKNMIS5XGMULBIH2SHX2XNZXOFLPVNBKPONCHIRJXQPX4AVIOJOWQYJ` |
| **WASM hash** | `cd0b03985a406f24629fb4fe599b38132525512672549a26eea1f6397906076a` |
| **WASM size** | 6,073 bytes |
| **Deployer** | `GC3I3KC2JGYVMDDPQBNEHCY5EKQVEAH2DOAJJMKF2RI64ZJSZT3TFJGL` (`student`) |
| **Upload tx** | [`da0b1acd…`](https://stellar.expert/explorer/testnet/tx/da0b1acdca7d07321fbf1408954181915a4eccdee3ec79d7b7ade8884ce57c54) |
| **Deploy tx** | [`10ac9df9…`](https://stellar.expert/explorer/testnet/tx/10ac9df9cfd4873e63eb539fafe4fd353c8e12850b0c96c63eec6fd4730b355f) |
| **Stellar Lab** | [View contract](https://lab.stellar.org/r/testnet/contract/CDKNMIS5XGMULBIH2SHX2XNZXOFLPVNBKPONCHIRJXQPX4AVIOJOWQYJ) |

### Web app setup

`web/.env` is already pre-filled with the contract ID above:

```env
VITE_CONTRACT_ID=CDKNMIS5XGMULBIH2SHX2XNZXOFLPVNBKPONCHIRJXQPX4AVIOJOWQYJ
```

Just run the frontend and connect Freighter on **testnet** — no manual deploy needed.

---

## Sample CLI invocation (MVP)

`init` must be signed by the **creator**; `creator` must match `--source-account`. Example using the same testnet identity for both:

```bash
export CONTRACT_ID="C_REPLACE_WITH_YOUR_DEPLOYED_CONTRACT_ID"
export CREATOR="$(stellar keys address student)"

stellar contract invoke \
  --id "$CONTRACT_ID" \
  --network testnet \
  --source-account student \
  -- \
  init \
  --creator "$CREATOR" \
  --goal 1000000000 \
  --deadline 2000000000
```

- **`goal`** is in **stroops** (1 XLM = 10_000_000 stroops); `1000000000` ≈ **100 XLM**.
- **`deadline`** is a **Unix timestamp** (seconds); must be in the future at invocation time (use a real future time).

Example **`pledge`** (backer must sign; here the backer is the same account):

```bash
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --network testnet \
  --source-account student \
  -- \
  pledge \
  --backer "$CREATOR" \
  --amount 50000000
```

`50000000` stroops = **5 XLM** (dummy-sized pledge).

Simulate without submitting: add **`--send no`** to `stellar contract invoke` (returns simulation result only).

---

## Repo layout

```
├── contract/          Soroban contract (Rust)
├── web/               React + Vite + Tailwind + shadcn/ui
├── PROJECT_BRIEF.md
└── LICENSE
```

### Web UI (optional)

```bash
cd web && npm install && npm run dev
```

Or from repo root (after `web` deps installed): `npm run dev` → **http://127.0.0.1:5173**

Set **`VITE_CONTRACT_ID`** in `web/.env`. Use **Freighter** on **testnet**.

**Production build:** `npm run build:web` → `web/dist/`.

---

## Contract API (MVP)

| Function | Role |
|----------|------|
| `init` | One-time campaign: creator, goal (stroops), deadline (unix) |
| `pledge` | Backer pledge amount (tracked on-chain) |
| `release` | After deadline if goal met — finalize |
| `refund` | After deadline if goal not met — finalize |
| `get_campaign` | Read campaign state |
| `get_pledge` | Read a backer’s pledged amount |

---

## Links

- [Stellar Docs](https://developers.stellar.org)
- [Soroban SDK](https://docs.rs/soroban-sdk)
- [Stellar Expert (testnet)](https://stellar.expert/explorer/testnet)

---

## License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE).
