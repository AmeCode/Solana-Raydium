// metrics.js

const startTime = Date.now();

const metrics = {
  startTime,
  poolsChecked: 0,
  poolsSniped: 0,
  lastPoolAddress: null,
  lastPoolSizeUSDC: null,
  lastTradeSide: null,          // "buy" or "sell"
  lastTradeSizeUSDC: null,
  lastTradePnLUSDC: null,       // realized PnL for last trade
  realizedPnLUSDC: 0,           // total realized PnL
  errors: 0
};

function incPoolsChecked() {
  metrics.poolsChecked += 1;
}

function recordPool({ address, sizeUSDC }) {
  metrics.lastPoolAddress = address || null;
  metrics.lastPoolSizeUSDC = typeof sizeUSDC === 'number' ? sizeUSDC : null;
}

function recordTrade({ side, sizeUSDC, pnlUSDC }) {
  metrics.poolsSniped += 1;
  metrics.lastTradeSide = side || null;
  metrics.lastTradeSizeUSDC = typeof sizeUSDC === 'number' ? sizeUSDC : null;
  if (typeof pnlUSDC === 'number') {
    metrics.lastTradePnLUSDC = pnlUSDC;
    metrics.realizedPnLUSDC += pnlUSDC;
  }
}

function incErrors() {
  metrics.errors += 1;
}

function getMetrics() {
  const now = Date.now();
  const uptimeMs = now - metrics.startTime;
  const uptimeSeconds = Math.floor(uptimeMs / 1000);
  const uptimeMinutes = Math.floor(uptimeSeconds / 60);
  const uptimeHours = Math.floor(uptimeMinutes / 60);

  return {
    ...metrics,
    uptimeSeconds,
    uptimeMinutes,
    uptimeHours
  };
}

module.exports = {
  metrics,
  incPoolsChecked,
  recordPool,
  recordTrade,
  incErrors,
  getMetrics
};
