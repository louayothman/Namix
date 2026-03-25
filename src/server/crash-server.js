
/**
 * @fileOverview NAMIX SOVEREIGN REAL-TIME CRASH SERVER
 * Standalone WebSocket Server for Game Logic Synchronization.
 * Runs independently of the database for maximum performance.
 */

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });

let gameState = {
  status: 'waiting', // 'waiting' | 'running' | 'crashed'
  startTime: Date.now(),
  multiplier: 1.0,
  crashPoint: 0,
  history: [],
  bets: []
};

function generateCrashPoint() {
  const r = Math.random();
  // Provably Fair Formula: (1 / (1 - r)) * house_edge
  return Math.max(1.01, (1 / (1 - r)) * 0.96);
}

function broadcast(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

function tick() {
  const now = Date.now();
  const elapsed = (now - gameState.startTime) / 1000;

  if (gameState.status === 'waiting') {
    if (elapsed >= 8) { // 8 seconds betting phase
      gameState.status = 'running';
      gameState.startTime = Date.now();
      gameState.crashPoint = generateCrashPoint();
      broadcast({ type: 'ROUND_START', crashPoint: gameState.crashPoint });
    } else {
      broadcast({ type: 'WAITING', timer: Math.ceil(8 - elapsed) });
    }
  } else if (gameState.status === 'running') {
    const currentMult = Math.exp(0.055 * elapsed);
    gameState.multiplier = currentMult;

    if (currentMult >= gameState.crashPoint) {
      gameState.status = 'crashed';
      gameState.startTime = Date.now();
      gameState.history = [gameState.crashPoint, ...gameState.history].slice(0, 20);
      broadcast({ type: 'ROUND_CRASHED', multiplier: gameState.crashPoint, history: gameState.history });
    } else {
      broadcast({ type: 'MULTIPLIER_UPDATE', multiplier: currentMult });
    }
  } else if (gameState.status === 'crashed') {
    if (elapsed >= 4) { // 4 seconds cooldown
      gameState.status = 'waiting';
      gameState.startTime = Date.now();
      gameState.multiplier = 1.0;
      gameState.bets = [];
      broadcast({ type: 'ROUND_INIT' });
    }
  }
}

// Global Tick Loop (50ms for smooth sync)
setInterval(tick, 50);

wss.on('connection', (ws) => {
  // Sync initial state to new client
  ws.send(JSON.stringify({ 
    type: 'SYNC_STATE', 
    state: {
      status: gameState.status,
      history: gameState.history,
      multiplier: gameState.multiplier
    } 
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'PLACE_BET') {
        gameState.bets.push({ user: data.user, amount: data.amount, status: 'active' });
        broadcast({ type: 'BET_PLACED', bets: gameState.bets });
      }
      if (data.type === 'CASHOUT') {
        const bet = gameState.bets.find(b => b.user === data.user && b.status === 'active');
        if (bet) {
          bet.status = 'cashed';
          bet.multiplier = gameState.multiplier;
          broadcast({ type: 'PLAYER_CASHOUT', bets: gameState.bets });
        }
      }
    } catch (e) {
      console.error('Socket Message Error:', e);
    }
  });
});

console.log('🚀 Namix Sovereign Crash Server active on port 3001');
