// Demo client template for Senior Web3 Full-Stack assignment
// Node 18+ required (uses global fetch)

const BASE = process.env.BASE_URL || 'http://localhost:3001';

async function json(path, opts) {
  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

async function main() {
  console.log('1) Get wallet (miner address)');
  const wallet = await json('/wallet');
  console.log('wallet:', wallet);
  const miner = wallet.address || wallet;

  console.log('\n2) Create a transaction (send 10 to recipient)');
  const recipient = 'recipient-address-1';
  const tx = await json('/transactions', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ recipient, amount: 10 })
  });
  console.log('tx response:', tx);

  console.log('\n3) Mine a block (this will include pending txs and coinbase to miner)');
  const mine = await json('/mine', { method: 'POST' });
  console.log('mine response:', mine);

  console.log('\n4) Query balances');
  const b1 = await json(`/balance?address=${encodeURIComponent(miner)}`);
  const b2 = await json(`/balance?address=${encodeURIComponent(recipient)}`);
  console.log('miner balance:', b1);
  console.log('recipient balance:', b2);

  console.log('\nDemo complete');
}

main().catch(err => { console.error(err); process.exit(1); });