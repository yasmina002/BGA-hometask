# Candidate instructions — Senior Web3 Full-Stack (demo mode)

This repository is used as a take-home assessment for the Senior Web3 Full-Stack Engineer role. To make the assignment fair and focused, we support two submission modes:

A) Client / Integration demo (recommended)
- Implement a short Node.js or curl script that uses the API to exercise the full flow:
  1. Create / read a wallet
  2. Submit a transaction
  3. Mine a block
  4. Check balance
- Deliverables:
  - `candidate/demo-client.js` (or similar) — an executable Node script
  - `candidate/ARCHITECTURE.md` — short (2–4 paragraphs) architecture notes
  - README snippet describing how to run your demo

B) Full backend implementation (optional, larger scope)
- Implement missing core files in `src/` (crypto, core, chain, mempool, persistence, P2P).
- Deliverables: all updated `src/` files, tests still pass, and `candidate/ARCHITECTURE.md` describing key design choices.

Running locally (demo mode)
1. Start the lightweight stub server that implements the API endpoints used in the demo (this is **not** the full blockchain engine — it is a local shim to exercise API flows):

```powershell
npm run start:stub
```

2. In another terminal, run the demo client (example provided):

```powershell
npm run demo
# or
node candidate/demo-client-template.js
```

What we will grade (demo mode)
- The demo script demonstrates the full end-to-end flow: wallet → transaction → mine → balance.
- The architecture note explains assumptions and how this demo maps to a full implementation.
- Code clarity and reproducibility: clear run instructions and working demo.

Notes for full-backend candidates
- If you implement the full engine, run the full test suite: `npm install && npm test`.
- This repo contains many unit and integration tests; implementing the full engine increases scope substantially — see README for full test expectations.

Good luck and thank you for your interest!