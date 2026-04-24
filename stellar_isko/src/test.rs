#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::{Address as _}, Address, BytesN, Env};

#[test]
fn test_end_to_end_flow() {
    let env = Env::default();
    env.mock_all_auths(); // Web2: Like a "Mock Service Worker" (MSW) or a mock session.

    let contract_id = env.register(StellarIsko, ());
    let client = StellarIskoClient::new(&env, &contract_id);

    // Mock Addresses (Think of these as "Mocks" for your Vitest/Jest tests)
    let admin = Address::generate(&env);
    let student = Address::generate(&env);
    let treasury = Address::generate(&env);
    
    // 1. Mock the Payment Token (USDC contract)
    let token_admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract_v2(token_admin.clone()).address();
    let token_client = token::StellarAssetClient::new(&env, &token_id);
    let token_logic = token::Client::new(&env, &token_id);
    
    // 2. Initialize StellarIsko (Like setting your config/environment)
    client.initialize(&admin, &treasury, &token_id);

    // 3. Give student money for the test
    token_client.mint(&student, &500);

    // --- STEP 1: Student pays for the document ---
    client.request_and_pay(&student, &150);
    assert_eq!(token_logic.balance(&student), 350);
    assert_eq!(token_logic.balance(&treasury), 150);

    // --- STEP 2: Registrar (Admin) issues the SBT ---
    let doc_hash = BytesN::from_array(&env, &[7u8; 32]);
    client.issue_soulbound_credential(&admin, &student, &doc_hash);

    // --- STEP 3: Verification (The "Green" Light for Employers) ---
    assert_eq!(client.verify_credential(&student, &doc_hash), true);
}

#[test]
#[should_panic(expected = "Error(Auth, InvalidAction)")] // Correct Soroban auth error
fn test_unauthorized_minting() {
    let env = Env::default();
    // WE DON'T MOCK AUTH HERE TO TEST FAILURE
    
    let contract_id = env.register(StellarIsko, ());
    let client = StellarIskoClient::new(&env, &contract_id);

    let fake_admin = Address::generate(&env);
    let student = Address::generate(&env);
    let doc_hash = BytesN::from_array(&env, &[9u8; 32]);

    // This should fail because 'fake_admin' didn't sign the transaction!
    client.issue_soulbound_credential(&fake_admin, &student, &doc_hash);
}
