from flask import Flask, render_template, request, jsonify
import hashlib
import httpx
from zxcvbn import zxcvbn

app = Flask(__name__)

def check_pwned(password):
    sha1 = hashlib.sha1(password.encode()).hexdigest().upper()
    prefix, suffix = sha1[:5], sha1[5:]
    url = f"https://api.pwnedpasswords.com/range/{prefix}"
    try:
        r = httpx.get(url, timeout=10)
        if r.status_code != 200:
            return -1
        for line in r.text.splitlines():
            h, count = line.split(":")
            if h == suffix:
                return int(count)
    except:
        return -1
    return 0

def risk_score(bits,pwned,length,categories):
    if bits >= 20: entropy_score = 1000/bits
    else: entropy_score = 50

    if pwned == 0:
        breach_score = 0
    elif pwned < 1_000:
        breach_score = 5
    elif pwned < 10_000:
        breach_score = 15
    elif pwned < 1_000_000:
        breach_score = 30
    else:
        breach_score = 50

    if length >= 20: length_score = 0.1
    elif length >= 14: length_score = 4
    elif length >= 10: length_score = 8
    elif length >= 6: length_score = 12
    else: length_score = 15

    if categories == 1: categories_score = 15
    elif categories == 2: categories_score = 10
    elif categories == 3: categories_score = 5
    elif categories >= 4: categories_score = 0.1

    return min(100,round(entropy_score + breach_score + length_score + categories_score, 1))


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/check", methods=["POST"])
def check():
    data = request.json
    password = data.get("password", "")

    if not password:
        return jsonify({"empty": True})

    # zxcvbn analysis
    result = zxcvbn(password)
    bits = round(result["guesses_log10"] * 3.321928, 1)
    crack_time = result["crack_times_display"]["offline_fast_hashing_1e10_per_second"]
    warning = result["feedback"]["warning"] or ""
    sequences = result["sequence"]

    # HIBP checking (added to live updates)
    pwned = check_pwned(password)

    categories = 0
    has_lower = any(c.islower() for c in password)
    has_upper = any(c.isupper() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_symbol = any(not c.isalnum() for c in password)
    categories = has_lower + has_upper + has_digit + has_symbol

    risk = risk_score(bits, pwned, len(password), categories)

    return jsonify({
        "empty": False,
        "bits": bits,
        "crack_time": crack_time,
        "warning": warning,
        "score": result["score"],
        "pwned": pwned,
        "sequences": sequences,
        "risk": risk
    })

if __name__ == "__main__":
    app.run(debug=True)
