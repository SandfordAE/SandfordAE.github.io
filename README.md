# Dev Forge & Interactive Sandbox // SandfordAE.github.io

[![System Status](https://img.shields.io/badge/SYSTEM-ONLINE-00f0ff?style=flat-square&logo=git&logoColor=00f0ff)](https://sandfordae.github.io)
[![Security](https://img.shields.io/badge/100%25-Client--Side-10b981?style=flat-square&logo=shield&logoColor=10b981)](https://sandfordae.github.io)
[![License](https://img.shields.io/badge/License-MIT-8b5cf6?style=flat-square)](LICENSE)

A high-performance, secure, and interactive developer workbench and sandbox hosted on GitHub Pages. Built with pure HTML5, CSS3, and JavaScript with **zero external framework build dependencies**.

---

## 🚀 Interactive Developer Tool Suite

1. **Secure Keymaker & Token Generator**
   - **Key Types:** API Keys / Secret Tokens (with custom prefixes), Cryptographic Hex/Salts, Base64URL tokens, UUID v4, Memorable Diceware Passphrases, and **SSH Key Pairs** (Ed25519 & RSA 2048/4096-bit with OpenSSH PEM private keys and public `.pub` outputs).
   - **RNG Engines:** Choose between Web Crypto API (`window.crypto.getRandomValues`), sandbox PRNG, or CLI reference mode.
   - **CLI Command Generator:** Automatically displays the exact local terminal command (`openssl rand`, `ssh-keygen`, `uuidgen`, `python3 secrets`) for every generated token.

2. **JSON Formatter, Validator & Statistics**
   - Live JSON validation, 2-space indentation formatting, minification, and recursive structural node/depth statistics.

3. **JWT Debugger & Inspector**
   - Client-side decoding of JWT Headers and Payloads, expiration checking (`iat` & `exp`), and validation status.

4. **Regular Expression Live Tester**
   - Real-time regex matching against test strings with live capture group breakdown and customizable flags (`g`, `i`, `m`).

5. **Client-Side Cryptography & Encoders**
   - Instant SHA-256 and SHA-512 hashing via the Web Crypto API, Base64 encoding, and URL encoding with one-click copy.

6. **Sorting Algorithm Visualizer**
   - Interactive animated visualizer comparing Bubble, Selection, and Insertion sorts with real-time comparison and swap counters.

---

## 🔒 Security & Architecture

- **Privacy-First:** All computations and key generation happen locally in your browser using secure Web Crypto APIs (`window.crypto.getRandomValues`). No data is ever transmitted to external servers.
- **Zero Build Step:** Comprises only pure static assets (`index.html`, `styles.css`, `app.js`), making it lightweight (< 50KB) and instantly deployable on GitHub Pages.

---

## 🛠️ Local Development & Preview

To run or preview locally, clone the repository and serve with any static web server:

```bash
git clone https://github.com/SandfordAE/SandfordAE.github.io.git
cd SandfordAE.github.io

# Using Python 3
python3 -m http.server 8080

# Or Node.js (npx)
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
