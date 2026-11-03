# [SandfordAE.github.io](http://SandfordAE.GitHub.io) - A GitHub hosted webpage.

[![System Status](https://img.shields.io/badge/SYSTEM-ONLINE-00f0ff?style=flat-square&logo=git&logoColor=00f0ff)](https://sandfordae.github.io)
[![Security](https://img.shields.io/badge/100%25-Client--Side-10b981?style=flat-square&logo=shield&logoColor=10b981)](https://sandfordae.github.io)
[![License](https://img.shields.io/badge/License-MIT-8b5cf6?style=flat-square)](LICENSE)

Personal engineering hub, secure developer workbench, and systems architecture portfolio hosted on GitHub Pages. Built with pure HTML5, CSS3, and JavaScript with **zero external framework build dependencies**.

---

## 🏛️ Architecture & Gateway Structure

- **`index.html` (Root Hub):** Professional landing page serving as the primary gateway, featuring live system status terminals, module navigation, and placeholders for future expansion (Project Vault, Engineering Notes).
- **`Dev_Forge/` (Developer Workbench):** High-performance, zero-trust client-side developer sandbox containing:
  1. **Secure Keymaker & Token Generator** (API keys, salts, UUIDs, diceware, and Ed25519/RSA SSH key pairs with OpenSSH PEM outputs & CLI reference commands).
  2. **JSON Formatter & Validator** (Live validation, minification, and recursive structural statistics).
  3. **JWT Debugger & Inspector** (Client-side header/payload decoding and expiration checks).
  4. **Regular Expression Live Tester** (Real-time regex matching and capture group breakdown).
  5. **Client-Side Cryptography & Encoders** (SHA-256/512 hashing, Base64, and URL encoding).
  6. **Sorting Algorithm Visualizer** (Interactive animated Bubble, Selection, and Insertion sorts).

---

## 🔒 Security & Privacy

- **Privacy-First:** All computations and key generation happen locally in the browser using Web Crypto APIs (`window.crypto.getRandomValues`). No telemetry or server transmissions.
- **Zero Build Step:** Pure static assets, extremely lightweight (< 50KB), instantly deployable on GitHub Pages.

---

## 🛠️ Local Development & Preview

To run locally, clone the repository and serve with any static web server:

```bash
git clone https://github.com/SandfordAE/SandfordAE.github.io.git
cd SandfordAE.github.io

# Using Python 3
python3 -m http.server 8080

# Or Node.js (npx)
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) for the root landing hub, or navigate to `/Dev_Forge/` for the workbench.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
h webp