# How to Deploy Stellaroid Earn to Stellar Testnet 🚀

Follow these steps to deploy your smart contract and start using it on the Stellar network.

### 1. Set Up Your Environment
Ensure you have the Stellar CLI and Rust WASM target installed:
```bash
rustup target add wasm32-unknown-unknown
cargo install --locked stellar-cli --features opt
```

### 2. Create a Testnet Identity
Generate a new keypair and fund it with test XLM:
```bash
stellar keys generate --global my-key --network testnet
stellar keys fund my-key --network testnet
```

### 3. Build the Contract
Compile the Rust code into a WebAssembly (WASM) file:
```bash
cd stellaroid_earn
cargo build --target wasm32-unknown-unknown --release
```

### 4. Deploy the Contract
Upload the WASM file to the Stellar network:
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellaroid_earn.wasm \
  --source my-key \
  --network testnet
```
**Important:** Save the **Contract ID** (starts with `C...`) returned by this command.

### 5. Initialize the Contract
You need to initialize the contract with the XLM token address (Testnet XLM is usually identified by its native contract ID).
On Testnet, the Native XLM Contract ID is `CDLZFC3SYJYDZT7K67VZ75YJBMKBAV27Z6Y6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6`.

```bash
stellar contract invoke \
  --id <YOUR_CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- \
  initialize \
  --asset CDLZFC3SYJYDZT7K67VZ75YJBMKBAV27Z6Y6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6
```

### 6. Fund the Contract (for Rewards)
Since the contract acts as a treasury, it needs some XLM to pay out rewards. Send some test XLM to your contract address.

### 7. Test the Registration
Invoke the `register_certificate` function:
```bash
stellar contract invoke \
  --id <YOUR_CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- \
  register_certificate \
  --student <YOUR_STUDENT_ADDRESS> \
  --cert_hash 0000000000000000000000000000000000000000000000000000000000000001
```

### 8. Verify on Stellar Expert
Check your contract transactions here:
`https://stellar.expert/explorer/testnet/contract/<YOUR_CONTRACT_ID>`
