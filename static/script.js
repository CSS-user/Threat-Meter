const passwordInput = document.getElementById("password");
const output = document.getElementById("output");
const hibpStatus = document.getElementById("hibpStatus");

let strengthTimer = null;  // For immediate strength feedback
let hibpTimer = null;      // For HIBP delayed request
const hibpCache = {};      // Cache previous password results

passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;

    // --- Password strength update (immediate) ---
    clearTimeout(strengthTimer);
    strengthTimer = setTimeout(() => {
        if (!password) {
            output.innerHTML = "";
            hibpStatus.innerHTML = "";
            document.getElementById("riskMeter").innerHTML = "";   // <-- MUST BE HERE
            return;
        }

        fetch("/check", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({password})
        })
        .then(res => res.json())
        .then(data => {
            updateStrengthUI(data);
            updateRiskUI(data.risk);
        });
    }, 100); // very short debounce for instant feedback

    // --- HIBP check (rate-limit safe, delayed) ---
    clearTimeout(hibpTimer);
    hibpTimer = setTimeout(() => {
        if (!password) return;

        // Check cache first
        if (hibpCache[password] !== undefined) {
            updateHIBPUI(hibpCache[password]);
            return;
        }

        hibpStatus.innerHTML = "<span style='color:#60a5fa'>Checking HIBP…</span>";

        fetch("/check", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({password})
        })
        .then(res => res.json())
        .then(data => {
            hibpCache[password] = data.pwned; // store in cache
            updateHIBPUI(data.pwned);
        });
    }, 1500); // 1.5s delay per HIBP recommendation
});

// --- Separate functions for UI updates ---
function updateStrengthUI(data) {
    if (data.empty) {
        output.innerHTML = "";
        return;
    }

    const colorClass =
        data.pwned > 1_000_000 ? "bad" :
        (data.pwned > 0 || data.score < 3) ? "warn" :
        "good";

    let sequencesHTML = "";
    data.sequences.forEach(seq => {
        sequencesHTML += `
            <p><strong>${seq.pattern}</strong> — "${seq.token}" (${seq.i}-${seq.j})<br>
        `;
        for (let key in seq) {
            if (!["pattern","token","i","j"].includes(key)) {
                sequencesHTML += `<small>${key}: ${seq[key]}</small><br>`;
            }
        }
        sequencesHTML += "</p><hr>";
    });

    output.innerHTML = `
        <div class="result ${colorClass}">
            <div class="huge">${data.bits} bits</div>
            <p><strong>Crack time:</strong> ${data.crack_time}</p>
            <p style="color:#94a3b8; font-size:0.9rem;">
                (Assumes offline GPU attack at 10 billion guesses/sec)
            </p>
            ${data.warning ? `<p style="color:#fbbf24"><strong>${data.warning}</strong></p>` : ""}
            <h3>Matched Patterns</h3>
            ${sequencesHTML}
        </div>
    `;
}

function updateHIBPUI(pwned) {
    if (pwned === 0)
        hibpStatus.innerHTML = "<span style='color:#10b981'>Not found in breaches ✔</span>";
    else if (pwned > 0)
        hibpStatus.innerHTML = `<span style='color:#ef4444'>This password has appeared in ${pwned} known data breaches ❗</span>`;
    else
        hibpStatus.innerHTML = "<span style='color:#f59e0b'>HIBP unavailable</span>";
}
function updateRiskUI(risk) {
    const riskMeter = document.getElementById("riskMeter");

    let color = "#10b981"; // green
    if (risk >= 70) color = "#ef4444"; // red (high risk)
    else if (risk >= 40) color = "#f59e0b"; // yellow (medium risk)

    riskMeter.innerHTML = `
        <div style="
            margin-top:20px; padding:15px;
            border-radius:12px; background:#1e293b;
            border-left:6px solid ${color};
            text-align:left;
        ">
            <strong style="font-size:1.1rem;">Risk Score:</strong>

            <div style="font-size:2rem; font-weight:bold; color:${color}">
                ${risk}/100
            </div>

            <!-- Bar Container -->
            <div style="
                width:100%;
                height:12px;
                background:#334155;
                border-radius:8px;
                margin-top:10px;
                overflow:hidden;
            ">
                <!-- Animated Bar -->
                <div style="
                    width:${risk}%;
                    height:100%;
                    background:${color};
                    transition:width 0.3s ease;
                "></div>
            </div>
        </div>
    `;
}