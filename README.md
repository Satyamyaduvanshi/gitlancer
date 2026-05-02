# SOLUX

### Merge code, get paid. The autonomous Web3 bounty hunter.

**SOLUX** is a decentralized protocol designed to bridge the gap between open-source contributions and instant financial incentives. By combining **AI-driven code audits** with the **Solana blockchain**, SOLUX automates the entire lifecycle of a developer bounty: from PR submission to verified USDC settlement.

- **Website:** [solux.website](https://www.solux.website)
- **X:** [@SOLUXdev](https://x.com/SOLUXdev)

---

##  The Workflow

1. **Fund**: A maintainer initializes a Vault for their repository on the Solana devnet and deposits USDC.
2. **Code**: A contributor submits a Pull Request (PR) to the GitHub repository.
3. **Audit**: The SOLUX Bot (Blinky AI), triggered via NestJS webhooks, analyzes the code for quality and security.
4. **Merge & Pay**: Upon merging, the SOLUX Oracle verifies the contribution and triggers the smart contract to release USDC directly from the Vault to the contributor's wallet.

---

## System Architecture



---

## Technical Stack

- **Blockchain**: Solana (Anchor Framework, Rust).
- **Backend**: NestJS (Oracle Service & GitHub Webhook Listener).
- **Frontend**: Next.js 15+ (Turbopack), TypeScript, Tailwind CSS, Framer Motion.
- **3D Visuals**: Three.js, React Three Fiber (The "Monolith" Execution Core).
- **Database**: PostgreSQL with Prisma ORM.
- **Infrastructure**: Docker, Turborepo, Vercel.
- **Development Environment**: Developed and tested on Arch Linux.

---

## Key Features

- **Autonomous Audits**: Blinky AI provides real-time feedback on Pull Requests.
- **Instant Settlement**: No manual payout delays; USDC is transferred the moment code is merged.
- **Double-Spend Prevention**: Every PR ID is recorded on-chain in a `BountyRecord` to ensure one-time payment.
- **Secure Oracle**: Only the verified SOLUX Oracle signature can authorize bounty distributions.
- **Maintainer Controls**: Secure withdrawal functions for idle funds and easy "Uninstall" mechanics.

---

## Getting Started

### Prerequisites

- **Node.js & pnpm**
- **Rust & Anchor CLI**
- **Solana CLI** (configured to devnet)

### Installation

1. **Clone the Repo:**
  ```bash
    git clone https://github.com/Satyamyaduvanshi/gitlancer.git
    cd gitlancer
  ```
2. **Install Dependencies:**
  ```bash
    pnpm install
  ```
3. **Smart Contract Deployment:**
  ```bash
    cd solux_program
    anchor build
    anchor deploy
  ```
4. **Run the Web and oracle:(in different terminal)**
  ```bash
    pnpm --filter web dev
    pnpm --filter oracle dev
  ```

---

## Security Architecture

SOLUX implements a **Trust-But-Verify** model:

- **Vault Isolation**: Each repository has its own isolated PDA (Program Derived Address) vault.
- **Oracle Validation**: The smart contract strictly enforces that only the official SOLUX Oracle key can authorize payouts.
- **On-Chain State**: All payout statuses are immutable and verifiable on the Solana ledger.

---

## License

[LICENSE](LICENSE).

---

**Developed with ❤️ by [Satyam Yadav](https://github.com/Satyamyaduvanshi)**