#![no_std] // Web2: Like a "Tree-shaking" setting for the smallest possible bundle size.
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, BytesN, Env, token};

mod test; // Web2: Like importing a local test file for Vitest/Jest.

/// --- DATA SCHEMA ---
/// In React, you'd use an Interface or Type. Here, we define what the 
/// blockchain database ("Ledger") will store.
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,                         // Address of the Registrar (PUP Admin)
    Treasury,                      // Address where student USDC goes
    PaymentToken,                  // Address of the USDC/XLM contract
    Credential(Address, BytesN<32>), // Links (Student_Address, Doc_Hash) -> true
}

#[contract]
pub struct StellarIsko;

#[contractimpl]
impl StellarIsko {
    /// --- INITIALIZE ---
    /// Web2: Like setting up your .env variables or a Constructor in a Class.
    pub fn initialize(env: Env, admin: Address, treasury: Address, payment_token: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized"); // Web2: Prevents overwriting "Environment Variables"
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Treasury, &treasury);
        env.storage().instance().set(&DataKey::PaymentToken, &payment_token);
    }

    /// --- REQUEST & PAY ---
    /// Web2: Like a POST /payment endpoint that triggers a Stripe transfer.
    pub fn request_and_pay(env: Env, student: Address, amount: i128) {
        student.require_auth(); // Web2: Like an "Auth Middleware" (Check JWT/Session)

        let token_addr = env.storage().instance().get::<_, Address>(&DataKey::PaymentToken).unwrap();
        let treasury = env.storage().instance().get::<_, Address>(&DataKey::Treasury).unwrap();
        
        let client = token::Client::new(&env, &token_addr); // Web2: Initializing the "Stripe SDK"
        
        // Move money from Student to University Treasury
        client.transfer(&student, &treasury, &amount);

        // Emit an Event (Web2: Like a Webhook or a Socket.io broadcast for the UI)
        env.events().publish(
            (symbol_short!("pay"), student.clone()),
            amount,
        );
    }

    /// --- ISSUE SOULBOUND CREDENTIAL (SBT) ---
    /// Web2: Like an Admin action that writes a permanent record to the Database.
    /// This is "Soulbound" because there is NO "transfer" function.
    pub fn issue_soulbound_credential(env: Env, admin: Address, student: Address, doc_hash: BytesN<32>) {
        admin.require_auth(); // Only the Registrar can do this!

        let key = DataKey::Credential(student.clone(), doc_hash.clone());
        
        // Write the permanent "Credential Record" to the Blockchain Ledger
        env.storage().persistent().set(&key, &true);

        env.events().publish(
            (symbol_short!("mint"), student),
            doc_hash,
        );
    }

    /// --- VERIFY CREDENTIAL ---
    /// Web2: Like a GET /verify/:student/:hash endpoint.
    /// Read-only function for employers.
    pub fn verify_credential(env: Env, student: Address, doc_hash: BytesN<32>) -> bool {
        let key = DataKey::Credential(student, doc_hash);
        env.storage().persistent().has(&key) // Returns true if it exists, false if not.
    }
}
