# 🔒 Threat-Meter: Advanced Password Strength & Breach Analyzer

**Threat-Meter** is a high-accuracy, real-time password assessment tool built with **Flask**, **ZXCVBN**, and the **Have I Been Pwned (HIBP) API**.  
It evaluates password strength, entropy, crack time, pattern weaknesses, and breach exposure to deliver a unified **risk score** trusted by security best practices.

Designed for precision, privacy, and developer-friendly integration.

---

## ⭐ Key Capabilities

### 🧠 Intelligent Password Strength Analysis
- Entropy estimation (bits)
- Offline crack-time predictions
- Pattern detection (dates, sequences, repeat chars, dictionary words)
- Context-aware weakness warnings

### 📊 Comprehensive Risk Score (0–100)
Risk score combines:
- Entropy  
- Length  
- Character diversity  
- Pattern severity  
- Breach status  

### 🔎 HIBP Breach Check (K-Anonymity)
- Password is hashed locally (SHA-1)
- Only **first 5 characters** of the hash are sent
- 100% safe and privacy-preserving

### ⚡ Real-Time Feedback UI
- Dynamic strength bar  
- Crack-time meter  
- Breach indicators  
- Detailed pattern breakdown  

---

## 🖼️ Live output includes:
- Entropy  
- Crack time  
- Breach count  
- Risk score  
- ZXCVBN feedback  
- Pattern highlights  

---

## 📁 Project Structure

```
Threat-Meter/
│
├── app.py
├── static/
│   └── script.js
│   └── style.css
├── templates/
│   └── index.html
├── requirements.txt
└── README.md
```

---

## 🛠 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/CSS-user/Threat-Meter.git
cd Threat-Meter
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Flask server
```bash
python app.py
```

Access in browser:
```
http://127.0.0.1:5000
```

---

## 🔐 Privacy & Security

Threat-Meter is designed with strict security principles:

- No passwords are logged, stored, transmitted, or cached.
- Breach checks use **k-anonymous HIBP API v2**.
- Only SHA-1 prefix (5 chars) is sent—HIBP cannot reconstruct the password.
- All computations (entropy, patterns, strength) happen **locally**.

---

## 📦 Major Dependencies

| Library | Purpose |
|--------|---------|
| **Flask** | Backend web framework |
| **httpx** | Async HTTP client for HIBP |
| **ZXCVBN** | High-accuracy strength estimation |
| **hashlib** | SHA-1 hashing for breach checks |

---

## 🧭 Why This Algorithm Matters

Modern brute-force and credential-stuffing attacks break weak passwords in seconds.  
Single metrics like “length” or “contains special characters” no longer reflect real-world resistance.

**Threat-Meter** solves this by combining:

- Data-driven entropy modeling  
- Pattern-aware analysis  
- Real breach intelligence (HIBP)  
- K-anonymous privacy design  
- A unified risk score backed by modern security heuristics  

This results in realistic strength evaluation aligned with attacker capabilities—not outdated complexity rules.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.  
Please open a pull request or start a discussion.

---

## 📄 License

MIT License