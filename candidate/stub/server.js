// Lightweight stub server for demo mode
// Provides minimal API endpoints used by the demo client.

const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3001;

let state = require('./state.json');
let mempool = [];

// simple miner wallet
const minerAddress = process.env.MINER_ADDRESS || 'demo-miner-address';

function sendJson(res, obj, code=200) {
  const s = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(s);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function ensureAddress(addr) {
  if (!state.balances[addr]) state.balances[addr] = 0;
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  if (req.method === 'GET' && pathname === '/wallet') {
    // return the miner wallet address
    return sendJson(res, { address: minerAddress });
  }

  if (req.method === 'POST' && pathname === '/transactions') {
    try {
      const body = await parseBody(req);
      const { recipient, amount } = body || {};
      if (!recipient || typeof amount !== 'number') {
        return sendJson(res, { error: 'recipient and numeric amount required' }, 400);
      }
      // In this stub we accept transactions without signatures. We debit from miner if funds exist.
      ensureAddress(recipient);
      const tx = { id: 'tx-' + Date.now(), from: 'external', recipient, amount };
      mempool.push(tx);
      return sendJson(res, { status: 'ok', tx });
    } catch (e) {
      return sendJson(res, { error: e.message }, 400);
    }
  }

  if (req.method === 'POST' && pathname === '/mine') {
    // simple mining: coinbase reward to miner + apply pending txs
    const reward = 50;
    ensureAddress(minerAddress);
    state.balances[minerAddress] += reward;

    // apply mempool txs: subtract from miner if possible, credit recipient
    const included = [];
    for (const tx of mempool) {
      // For demo purposes, attempt to pay from miner balance
      if (state.balances[minerAddress] >= tx.amount) {
        state.balances[minerAddress] -= tx.amount;
        ensureAddress(tx.recipient);
        state.balances[tx.recipient] += tx.amount;
        included.push(tx);
      }
    }
    // record block in chain
    const block = { index: state.chain.length, timestamp: Date.now(), txs: included, reward };
    state.chain.push(block);
    mempool = mempool.filter(t => !included.find(i => i.id === t.id));
    return sendJson(res, { status: 'ok', block });
  }

  if (req.method === 'GET' && pathname === '/balance') {
    const addr = parsed.query.address;
    if (!addr) return sendJson(res, { error: 'address query required' }, 400);
    ensureAddress(addr);
    return sendJson(res, { address: addr, balance: state.balances[addr] });
  }

  // fallback
  sendJson(res, { error: 'not found' }, 404);
});

server.listen(PORT, () => {
  console.log(`Stub server listening on http://localhost:${PORT}`);
});
