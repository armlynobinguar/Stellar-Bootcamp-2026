import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CALAEYLGS5GPW74BETR77543UBKUFUPTOD3HOYMODGWQFHWQ7JBDUHT3",
  }
} as const

/**
 * --- DATA SCHEMA ---
 * In React, you'd use an Interface or Type. Here, we define what the
 * blockchain database ("Ledger") will store.
 */
export type DataKey = {tag: "Admin", values: void} | {tag: "Treasury", values: void} | {tag: "PaymentToken", values: void} | {tag: "Credential", values: readonly [string, Buffer]};

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * --- INITIALIZE ---
   * Web2: Like setting up your .env variables or a Constructor in a Class.
   */
  initialize: ({admin, treasury, payment_token}: {admin: string, treasury: string, payment_token: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a request_and_pay transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * --- REQUEST & PAY ---
   * Web2: Like a POST /payment endpoint that triggers a Stripe transfer.
   */
  request_and_pay: ({student, amount}: {student: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a verify_credential transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * --- VERIFY CREDENTIAL ---
   * Web2: Like a GET /verify/:student/:hash endpoint.
   * Read-only function for employers.
   */
  verify_credential: ({student, doc_hash}: {student: string, doc_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a issue_soulbound_credential transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * --- ISSUE SOULBOUND CREDENTIAL (SBT) ---
   * Web2: Like an Admin action that writes a permanent record to the Database.
   * This is "Soulbound" because there is NO "transfer" function.
   */
  issue_soulbound_credential: ({admin, student, doc_hash}: {admin: string, student: string, doc_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAIEtLS0gREFUQSBTQ0hFTUEgLS0tCkluIFJlYWN0LCB5b3UnZCB1c2UgYW4gSW50ZXJmYWNlIG9yIFR5cGUuIEhlcmUsIHdlIGRlZmluZSB3aGF0IHRoZQpibG9ja2NoYWluIGRhdGFiYXNlICgiTGVkZ2VyIikgd2lsbCBzdG9yZS4AAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAIVHJlYXN1cnkAAAAAAAAAAAAAAAxQYXltZW50VG9rZW4AAAABAAAAAAAAAApDcmVkZW50aWFsAAAAAAACAAAAEwAAA+4AAAAg",
        "AAAAAAAAAFktLS0gSU5JVElBTElaRSAtLS0KV2ViMjogTGlrZSBzZXR0aW5nIHVwIHlvdXIgLmVudiB2YXJpYWJsZXMgb3IgYSBDb25zdHJ1Y3RvciBpbiBhIENsYXNzLgAAAAAAAAppbml0aWFsaXplAAAAAAADAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAACHRyZWFzdXJ5AAAAEwAAAAAAAAANcGF5bWVudF90b2tlbgAAAAAAABMAAAAA",
        "AAAAAAAAAFotLS0gUkVRVUVTVCAmIFBBWSAtLS0KV2ViMjogTGlrZSBhIFBPU1QgL3BheW1lbnQgZW5kcG9pbnQgdGhhdCB0cmlnZ2VycyBhIFN0cmlwZSB0cmFuc2Zlci4AAAAAAA9yZXF1ZXN0X2FuZF9wYXkAAAAAAgAAAAAAAAAHc3R1ZGVudAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAG0tLS0gVkVSSUZZIENSRURFTlRJQUwgLS0tCldlYjI6IExpa2UgYSBHRVQgL3ZlcmlmeS86c3R1ZGVudC86aGFzaCBlbmRwb2ludC4KUmVhZC1vbmx5IGZ1bmN0aW9uIGZvciBlbXBsb3llcnMuAAAAAAAAEXZlcmlmeV9jcmVkZW50aWFsAAAAAAAAAgAAAAAAAAAHc3R1ZGVudAAAAAATAAAAAAAAAAhkb2NfaGFzaAAAA+4AAAAgAAAAAQAAAAE=",
        "AAAAAAAAALAtLS0gSVNTVUUgU09VTEJPVU5EIENSRURFTlRJQUwgKFNCVCkgLS0tCldlYjI6IExpa2UgYW4gQWRtaW4gYWN0aW9uIHRoYXQgd3JpdGVzIGEgcGVybWFuZW50IHJlY29yZCB0byB0aGUgRGF0YWJhc2UuClRoaXMgaXMgIlNvdWxib3VuZCIgYmVjYXVzZSB0aGVyZSBpcyBOTyAidHJhbnNmZXIiIGZ1bmN0aW9uLgAAABppc3N1ZV9zb3VsYm91bmRfY3JlZGVudGlhbAAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAdzdHVkZW50AAAAABMAAAAAAAAACGRvY19oYXNoAAAD7gAAACAAAAAA" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        request_and_pay: this.txFromJSON<null>,
        verify_credential: this.txFromJSON<boolean>,
        issue_soulbound_credential: this.txFromJSON<null>
  }
}