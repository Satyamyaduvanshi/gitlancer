# SOLUX Agentic Architecture

## Vision
SOLUX is designed as an autonomous engineering agent that converts merged GitHub contributions into verifiable, policy-aware Solana payouts. The system does more than score pull requests: it observes events, reasons over code diffs, records state transitions, and prepares cryptographically constrained transactions for contributors to execute.

This architecture positions SOLUX as an **agentic engineering loop**:
- **Perceive:** detect merged PRs from signed GitHub webhooks.
- **Reason:** evaluate code deltas with Gemini and produce a machine-readable bounty decision.
- **Act:** persist contribution decisions and orchestrate user claim actions.
- **Execute Securely:** route payouts through an on-chain oracle-gated smart contract with deterministic PDA state.
- **Learn Operationally:** leave auditable logs and immutable payout records that improve trust and policy tuning over time.

## Core Components
- **GitHub Ingestion Layer (NestJS)**  
  `webhooks.controller.ts` verifies `x-hub-signature-256` and emits `pr.merged` only for merged pull requests.
- **Event-Driven Worker (NestJS EventEmitter)**  
  `webhooks.service.ts` handles `pr.merged` asynchronously, enabling non-blocking autonomous processing.
- **AI Auditor (Gemini)**  
  `ai.service.ts` fetches raw PR diff (`diff_url`), prompts Gemini (`gemini-3-flash-preview`) to return strict JSON (`score`, `bountyUSDC`, `reasoning`), then parses structured output for deterministic downstream usage.
- **State + Policy Store (Postgres via Prisma)**  
  `Vault`, `Contribution`, and `User` models maintain payout policy state (`budgetLimit`), recipient identity, and claim lifecycle (`AUDITED`, `PENDING_APPROVAL`, `CLAIMED`).
- **Claim Action API (Blink-compatible)**  
  `actions.controller.ts` exposes metadata and transaction endpoints for self-serve claims tied to audited contribution records.
- **Solana Oracle Executor (NestJS + Anchor client)**  
  `solana.service.ts` derives PDAs, builds `distributeBounty` instructions, and partially signs with the oracle delegate key.
- **Anchor Program (On-chain enforcement)**  
  `lib.rs` enforces oracle signer authorization, PDA ownership constraints, and per-PR anti-double-spend account initialization.

## Autonomous Flow: GitHub Diff to Solana Payout
1. **Webhook Verification & Event Emission**
   - GitHub sends PR event.
   - Oracle backend validates HMAC signature.
   - On `closed + merged`, system emits `pr.merged`.

2. **Background AI Audit**
   - Worker loads `pull_request.diff_url`.
   - Gemini receives a bounded diff segment and outputs structured bounty recommendation.
   - Agent persists reasoning + amount by creating a `Contribution` entry.

3. **Policy-Aware Routing**
   - If payout is within policy bounds, contribution is marked claimable (`AUDITED`).
   - If above configured policy (e.g., `budgetLimit` in alternate flow), it routes to human approval (`PENDING_APPROVAL`), enabling progressive autonomy.

4. **Contributor Claim Orchestration**
   - Contributor opens claim link (Blink/action endpoint).
   - Oracle verifies requester wallet matches linked wallet (`account === user.solanaWallet`).
   - Backend creates payout transaction bound to repo + PR identity.

5. **Hybrid Signature Execution**
   - Oracle partially signs transaction.
   - Contributor co-signs and submits.
   - Program transfers USDC from vault PDA ATA to contributor ATA.

6. **Immutable Settlement Guardrails**
   - Program initializes a unique `bounty_record` PDA keyed by `(vault_state, pr_id)`.
   - Replaying same PR payout fails because the PDA already exists.

## Why This Is Agentic (Not Just Automation)
- **Goal-driven behavior:** convert merged code contributions into fair payouts with explainable reasoning.
- **Structured reasoning output:** AI model produces machine-consumable JSON for deterministic orchestration.
- **Stateful decisions over time:** contribution and vault state govern next actions.
- **Autonomous actuation:** system triggers comments, claim links, and transaction generation without manual intervention.
- **Safety boundaries:** policy thresholds and signer constraints ensure autonomy remains bounded and auditable.

## Evolution Path: Tool -> Agentic Engineer

### Phase 1: AI Tool (Current Foundation)
- PR diffs are scored and bounty amounts suggested.
- System posts human-readable explanations and creates payout intents.

### Phase 2: Policy-Constrained Agent (Current + In Progress)
- Event-driven autonomous processing on merge.
- Risk routing to approval workflows for high-value payouts.
- Identity and wallet checks before transaction construction.

### Phase 3: Autonomous Agentic Engineer (Target)
- Multi-signal evaluation (diff quality, test impact, file criticality, historical contributor trust).
- Adaptive payout policies per repository and risk class.
- Continuous self-evaluation loop: compare AI predictions vs maintainer outcomes and adjust decision heuristics.
- Cross-repo planning behaviors: prioritize reviews, recommend bounty pools, and optimize treasury usage.

## Production-Grade Agent Design Principles
- **Deterministic boundaries around probabilistic AI:** LLM output is constrained to schema and validated before action.
- **Split trust model:** backend intelligence + on-chain enforcement.
- **Cryptographic event trust:** webhook signatures and transaction signatures.
- **Replay resistance by design:** one PR, one payout record.
- **Incremental decentralization:** start with oracle-assisted payouts, progressively reduce manual intervention while preserving hard on-chain checks.

## Outcome
SOLUX demonstrates a practical pattern for agentic software engineering economies: AI evaluates work, backend orchestrates policy and UX, and Solana enforces settlement integrity. This architecture scales from individual bounty decisions to autonomous, high-throughput engineering reward systems.

