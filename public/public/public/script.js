async function updateBalance() {
    let res = await fetch("/api/balance");
    let data = await res.json();
    document.getElementById("balance").innerText = "Balance: " + data.balance;
}

async function spin() {
    let bet = parseInt(document.getElementById("betBox").value);
    let seed = document.getElementById("seedBox").value || "default";

    let res = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bet, clientSeed: seed })
    });

    let data = await res.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    document.getElementById("result").innerText =
        `Result: ${data.result} | Win: ${data.win}`;

    updateBalance();
}

updateBalance();
