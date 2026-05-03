# SOLUX Technical Specification

## Scope
This specification defines the security and payout guarantees of the SOLUX Oracle + Anchor architecture, with emphasis on:
- Oracle trust and authorization model
- PDA-based vault design
- Double-spend prevention strategy

The system bridges off-chain AI decisioning and on-chain deterministic settlement for GitHub contribution bounties.

## System Roles and Trust Model
- **Maintainer** funds and configures vault context for a repository.
- **Contributor** submits code and claims rewards to a linked wallet.
- **Oracle Backend (NestJS)** verifies GitHub events, runs AI auditing, and prepares transactions.
- **Anchor Program** is the source of truth for payout authorization and replay protection.

Trust is intentionally split:
- **Off-chain layer** decides *what should be paid*.
- **On-chain layer** enforces *what can be paid*.

## Oracle Security Model

### 1) Authenticated Event Intake
- GitHub webhook handlers verify `x-hub-signature-256` using shared secret HMAC.
- Only valid signed events enter the merge-audit pipeline.

### 2) Scoped Credentials for GitHub Operations
- GitHub App JWT is used to mint installation tokens.
- Comment posting and metadata access occur via installation-scoped tokens, reducing credential blast radius.

### 3) Wallet Identity Binding
- Claim endpoint verifies the submitting wallet (`account`) equals persisted linked wallet (`user.solanaWallet`).
- This prevents a third party from generating claim transactions for someone else's bounty.

### 4) Oracle Key Control
- Oracle delegate keypair is loaded server-side and used for partial signing.
- On-chain program hard-checks the signer against a fixed oracle public key.
- Even if API surfaces are probed, unauthorized signers are rejected at program level.

### 5) Lifecycle State Controls
- Contributions are persisted with explicit statuses (`AUDITED`, `PENDING_APPROVAL`, `CLAIMED`).
- Policy routing (for larger payouts) enables bounded autonomy and optional human oversight.

## PDA Vault Architecture

### Vault PDA
- Derived with seeds: `["vault", repo_name]`.
- Stores vault metadata (`maintainer`, `repo_name`, `vault_bump`).
- Used as authority for the vault token account in transfer flows.

### Vault Token Account
- USDC token account is constrained to be owned by `vault_state`.
- Program validates this ownership before transfer.

### Contributor Token Account
- Destination token account for bounty payout.
- Oracle service can append ATA creation if contributor ATA does not exist, improving reliability without bypassing program checks.

### Bounty Record PDA (Replay Guard)
- Derived with seeds: `["bounty", vault_state, pr_id]`.
- Initialized during payout execution.
- Encodes one-time payout state for a unique PR in a vault context.

## Double-Spending Prevention
SOLUX prevents duplicate payout for the same PR using an account-initialization invariant:

1. `distribute_bounty` requires `bounty_record` to be created with `init` and deterministic seeds containing `pr_id`.
2. First successful payout creates this PDA and marks `is_paid = true`.
3. Any replay attempt for same `(vault_state, pr_id)` cannot re-initialize the account and fails.

This mechanism is stronger than a mutable boolean on shared state because the address itself acts as a cryptographic uniqueness proof.

## On-Chain Transfer Integrity

### Oracle Authorization
- Program checks:
  - `oracle` must sign transaction.
  - `oracle` must equal the hardcoded authorized oracle public key.

### Signer Seeds
- Program signs token transfer CPIs with vault PDA seeds and bump.
- This ensures only the correct vault authority can move vault funds.

### Token Transfer Primitive
- Uses `transfer_checked` from token interface.
- Enforces mint decimals and token program compatibility.

### Ownership Constraint
- `vault_token_account.owner == vault_state.key()` constraint prevents arbitrary source-account substitution.

## Transaction Assembly and Execution Path
1. Oracle service derives `vault_state` and `bounty_record` PDAs from `repoFullName` and `prId`.
2. Oracle constructs `distributeBounty(repo_name, amount, pr_id)` instruction.
3. Oracle partially signs transaction.
4. Contributor signs as fee payer / participant and submits.
5. Program validates all signer, PDA, and account constraints before transferring USDC.

## Failure Modes and Handling
- **Invalid GitHub signature:** request rejected at ingress.
- **Unknown vault:** audit flow aborts safely.
- **Wallet mismatch on claim:** claim execution denied.
- **Unauthorized oracle signer:** on-chain error `UnauthorizedOracle`.
- **Duplicate PR claim:** `bounty_record` re-init fails.
- **Missing contributor ATA:** pre-instruction ATA creation is appended by backend.

## Agentic Upscaling: Security Implications
As SOLUX evolves from “AI bounty tool” to autonomous engineering agent, security posture remains stable by keeping the same enforcement backbone:
- AI can become more autonomous in scoring and routing.
- Oracle backend can automate more decision branches.
- On-chain constraints remain deterministic and non-negotiable.

In other words, autonomy scales in the **decision layer**, while fund safety stays anchored in the **constraint layer**.

## Recommended Hardening for Grant-Scale Deployment
- Move oracle signer to HSM/KMS-backed signing.
- Add strict schema validation + guardrails for Gemini output parsing.
- Enforce idempotency keys at API level in addition to on-chain replay guards.
- Emit signed audit artifacts (hash of diff + model output) for forensic traceability.
- Add comprehensive integration tests for replay attempts, signer mismatch, and account substitution attacks.

## Conclusion
SOLUX combines AI-driven contribution assessment with deterministic Solana settlement. The Oracle introduces intelligent, autonomous behavior; the Anchor program preserves strict financial safety through PDA authority, signer verification, and replay-resistant bounty records. This architecture is well-suited for scaling into a full agentic engineering economy without compromising payout integrity.

