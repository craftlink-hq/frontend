Here’s a refined and professional version of your **CraftLink README**, with clearer structure, improved grammar, added gasless feature, and some suggested enhancements for clarity and impact:

---

# 🚀 CraftLink

**CraftLink** is a decentralized marketplace that connects artisans and informal workers with global job opportunities and secure payments. Designed for borderless collaboration, CraftLink combines elegant UX with blockchain-based guarantees for trust, transparency, and ownership.

Built using **Next.js**, **Tailwind CSS**, and **smart contracts on Base**, CraftLink supports gasless transactions and on-chain portfolios, giving artisans full control of their digital reputation and income.

---

## 🔧 Features

* **Job Listings** – Clients can post gigs; artisans apply based on skills and availability.
* **Secure Escrow Payments** – Smart contracts hold funds and release upon job completion.
* **Artisan Profiles** – Showcase portfolios, completed gigs, reviews, and ratings.
* **On-Chain Verification** – Transactions and deliverables are recorded using Merkle trees for transparency and future-proof proof-of-work.
* **Gasless Transactions** – Integrated meta-transactions allow users to interact without paying gas directly.
* **Seamless UI** – Built with React + Tailwind CSS for responsive and user-friendly design.
* **Wallet Integration** – Connect with MetaMask, Coinbase Wallet, or WalletConnect to manage on-chain gigs.

---

## 🧱 Tech Stack

| Layer           | Tech                                              |
| --------------- | ------------------------------------------------- |
| Frontend        | Next.js, React, Tailwind CSS                      |
| Smart Contracts | Solidity, Base Mainnet (OP Stack)                 |
| Storage         | IPFS (portfolio media), MongoDB (gigs & profiles) |
| Auth & Wallet   | Wagmi, RainbowKit, Ethers.js                      |
| Gasless Infra   | Biconomy / Custom Relayer (for meta-tx)           |

---

## ⚙️ Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/pope-h/craft-link.git
   cd craft-link
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

> You'll need environment variables for MongoDB, IPFS, and your wallet provider API keys. Refer to `.env.example` for guidance.

---

## 🚀 Deployment

* **Smart Contracts:** Deployed on **Base Mainnet**
* **Frontend:** Hosted on **Vercel**
* **Storage:** IPFS (decentralized media) + MongoDB (off-chain data)

---
