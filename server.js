const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// DEMO WALLET (memory only)
let userBalance = 1000;

// MIN–MAX BET
const MIN_BET = 2;
const MAX_BET = 3000;

// GENERATE PROVABLY FAIR RESULT
function generateSpin(clientSeed, serverSeed) {
    const combined = clientSeed + serverSeed;
    const hash = crypto.createHash("sha256").update(combined).digest("hex");

    // Convert hash → number
    const num = parseInt(hash.substring(0, 8), 16);
    const result = (num % 100) + 1;

    return { result, hash };
}

// SPIN API
app.post("/api/spin", (req, res) => {
    const { bet, clientSeed } = req.body;

    if (bet < MIN_BET || bet > MAX_BET) {
        return res.json({ error: "Bet must be between 2 and 3000" });
    }

    if (userBalance < bet) {
        return res.json({ error: "Balance not enough" });
    }

    const serverSeed = crypto.randomBytes(16).toString("hex");

    const { result, hash } = generateSpin(clientSeed, serverSeed);

    userBalance -= bet;

    let win = 0;
    if (result > 95) win = bet * 6;
    else if (result > 70) win = bet * 2;

    userBalance += win;

    res.json({
        result,
        win,
        balance: userBalance,
        provably_fair: {
            clientSeed,
            serverSeed,
            hash
        }
    });
});

// GET BALANCE
app.get("/api/balance", (req, res) => {
    res.json({ balance: userBalance });
});

// SERVER START
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
