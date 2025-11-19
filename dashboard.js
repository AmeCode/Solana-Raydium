// dashboard.js

const express = require("express");
const { getMetrics } = require("./metrics");

const app = express();
const PORT = process.env.DASHBOARD_PORT || 3000;

app.get("/stats", (req, res) => {
  const stats = getMetrics();
  res.json(stats);
});

app.get("/", (req, res) => {
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Sniper Bot Dashboard</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #111;
      color: #eee;
      padding: 20px;
    }
    h1 {
      margin-bottom: 0.5rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 1rem;
    }
    .card {
      background: #1b1b1b;
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid #333;
    }
    .label {
      font-size: 0.8rem;
      color: #999;
    }
    .value {
      font-size: 1.1rem;
      margin-top: 4px;
    }
    .positive {
      color: #4caf50;
    }
    .negative {
      color: #f44336;
    }
    .timestamp {
      margin-top: 10px;
      font-size: 0.8rem;
      color: #777;
    }
  </style>
</head>
<body>
  <h1>Solana Raydium Sniper – Live Dashboard</h1>
  <div class="timestamp" id="last-update">Last update: –</div>
  <div class="grid">
    <div class="card">
      <div class="label">Uptime</div>
      <div class="value" id="uptime">–</div>
    </div>
    <div class="card">
      <div class="label">Pools Checked</div>
      <div class="value" id="poolsChecked">–</div>
    </div>
    <div class="card">
      <div class="label">Pools Sniped</div>
      <div class="value" id="poolsSniped">–</div>
    </div>
    <div class="card">
      <div class="label">Realized PnL (USDC)</div>
      <div class="value" id="realizedPnL">–</div>
    </div>
    <div class="card">
      <div class="label">Last Pool</div>
      <div class="value" id="lastPool">–</div>
    </div>
    <div class="card">
      <div class="label">Last Pool Size (USDC)</div>
      <div class="value" id="lastPoolSize">–</div>
    </div>
    <div class="card">
      <div class="label">Last Trade</div>
      <div class="value" id="lastTrade">–</div>
    </div>
    <div class="card">
      <div class="label">Errors</div>
      <div class="value" id="errors">–</div>
    </div>
  </div>

  <script>
    async function fetchStats() {
      try {
        const res = await fetch("/stats");
        const data = await res.json();

        // uptime
        const hours = data.uptimeHours || 0;
        const minutes = (data.uptimeMinutes || 0) % 60;
        const seconds = (data.uptimeSeconds || 0) % 60;
        document.getElementById("uptime").textContent =
          hours + "h " + minutes + "m " + seconds + "s";

        document.getElementById("poolsChecked").textContent =
          data.poolsChecked ?? "-";
        document.getElementById("poolsSniped").textContent =
          data.poolsSniped ?? "-";

        const pnlElem = document.getElementById("realizedPnL");
        const pnl = data.realizedPnLUSDC ?? 0;
        pnlElem.textContent = pnl.toFixed ? pnl.toFixed(4) : pnl;
        pnlElem.classList.remove("positive", "negative");
        if (pnl > 0) pnlElem.classList.add("positive");
        if (pnl < 0) pnlElem.classList.add("negative");

        document.getElementById("lastPool").textContent =
          data.lastPoolAddress || "-";

        const lastPoolSize = data.lastPoolSizeUSDC;
        document.getElementById("lastPoolSize").textContent =
          typeof lastPoolSize === "number" ? lastPoolSize.toFixed(4) : "-";

        const lastTradeParts = [];
        if (data.lastTradeSide) lastTradeParts.push(data.lastTradeSide.toUpperCase());
        if (typeof data.lastTradeSizeUSDC === "number") {
          lastTradeParts.push(data.lastTradeSizeUSDC.toFixed(4) + " USDC");
        }
        if (typeof data.lastTradePnLUSDC === "number") {
          lastTradeParts.push("PnL " + data.lastTradePnLUSDC.toFixed(4) + " USDC");
        }
        document.getElementById("lastTrade").textContent =
          lastTradeParts.length ? lastTradeParts.join(" · ") : "-";

        document.getElementById("errors").textContent =
          data.errors ?? "-";

        const now = new Date();
        document.getElementById("last-update").textContent =
          "Last update: " + now.toLocaleTimeString();
      } catch (err) {
        console.error("Failed to fetch /stats", err);
      }
    }

    fetchStats();
    setInterval(fetchStats, 2000); // update every 2 seconds
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Dashboard listening on http://localhost:${PORT}`);
});
