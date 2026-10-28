document.addEventListener('DOMContentLoaded', () => {
    // 1. Background Canvas Animation
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
            ctx.fill();
        }
    }

    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }

    function animateBg() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateBg);
    }
    animateBg();

    // 2. Tab Navigation
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.tool-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 3. JSON Formatter Tool
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const jsonStatus = document.getElementById('json-status');
    const statNodes = document.getElementById('stat-nodes');
    const statDepth = document.getElementById('stat-depth');
    const statSize = document.getElementById('stat-size');

    function calculateJsonStats(obj) {
        let nodes = 0;
        let maxDepth = 0;

        function traverse(item, depth) {
            maxDepth = Math.max(maxDepth, depth);
            if (item && typeof item === 'object') {
                for (let key in item) {
                    nodes++;
                    traverse(item[key], depth + 1);
                }
            }
        }
        traverse(obj, 1);
        return { nodes, maxDepth };
    }

    function processJson(minify = false) {
        const raw = jsonInput.value.trim();
        if (!raw) {
            jsonOutput.value = '';
            jsonStatus.textContent = 'Ready';
            jsonStatus.className = 'status-badge valid';
            statNodes.textContent = '0';
            statDepth.textContent = '0';
            statSize.textContent = '0 bytes';
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            const formatted = JSON.stringify(parsed, null, minify ? 0 : 2);
            jsonOutput.value = formatted;
            jsonStatus.textContent = 'Valid JSON';
            jsonStatus.className = 'status-badge valid';

            const stats = calculateJsonStats(parsed);
            statNodes.textContent = stats.nodes;
            statDepth.textContent = stats.maxDepth;
            statSize.textContent = `${new Blob([raw]).size} bytes`;
        } catch (e) {
            jsonOutput.value = `Parse Error: ${e.message}`;
            jsonStatus.textContent = 'Invalid JSON';
            jsonStatus.className = 'status-badge invalid';
            statNodes.textContent = '-';
            statDepth.textContent = '-';
            statSize.textContent = `${new Blob([raw]).size} bytes`;
        }
    }

    jsonInput.addEventListener('input', () => processJson(false));
    document.getElementById('json-format').addEventListener('click', () => processJson(false));
    document.getElementById('json-minify').addEventListener('click', () => processJson(true));
    document.getElementById('json-clear').addEventListener('click', () => {
        jsonInput.value = '';
        processJson();
    });

    // 4. JWT Debugger Tool
    const jwtInput = document.getElementById('jwt-input');
    const jwtHeader = document.getElementById('jwt-header');
    const jwtPayload = document.getElementById('jwt-payload');
    const claimIat = document.getElementById('claim-iat');
    const claimExp = document.getElementById('claim-exp');
    const claimStatus = document.getElementById('claim-status');

    function base64UrlDecode(str) {
        try {
            let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
                base64 += '=';
            }
            return decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            return null;
        }
    }

    function parseJwt() {
        const token = jwtInput.value.trim();
        if (!token) {
            jwtHeader.value = '';
            jwtPayload.value = '';
            claimIat.textContent = 'N/A';
            claimExp.textContent = 'N/A';
            claimStatus.textContent = 'N/A';
            claimStatus.className = '';
            return;
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
            jwtHeader.value = 'Invalid JWT format (must have 3 parts separated by dots)';
            jwtPayload.value = '';
            return;
        }

        const decodedHeader = base64UrlDecode(parts[0]);
        const decodedPayload = base64UrlDecode(parts[1]);

        try {
            jwtHeader.value = decodedHeader ? JSON.stringify(JSON.parse(decodedHeader), null, 2) : 'Invalid Header Base64';
        } catch (e) {
            jwtHeader.value = decodedHeader || 'Invalid JSON in Header';
        }

        try {
            const payloadObj = decodedPayload ? JSON.parse(decodedPayload) : null;
            jwtPayload.value = payloadObj ? JSON.stringify(payloadObj, null, 2) : 'Invalid Payload Base64';

            if (payloadObj) {
                const now = Math.floor(Date.now() / 1000);
                if (payloadObj.iat) {
                    claimIat.textContent = new Date(payloadObj.iat * 1000).toUTCString();
                } else {
                    claimIat.textContent = 'None';
                }

                if (payloadObj.exp) {
                    const expDate = new Date(payloadObj.exp * 1000);
                    claimExp.textContent = expDate.toUTCString();
                    if (payloadObj.exp > now) {
                        claimStatus.textContent = 'ACTIVE (Valid)';
                        claimStatus.className = 'status-ok';
                    } else {
                        claimStatus.textContent = 'EXPIRED';
                        claimStatus.className = 'status-err';
                    }
                } else {
                    claimExp.textContent = 'None';
                    claimStatus.textContent = 'NO EXPIRATION';
                    claimStatus.className = 'status-ok';
                }
            }
        } catch (e) {
            jwtPayload.value = decodedPayload || 'Invalid JSON in Payload';
        }
    }

    jwtInput.addEventListener('input', parseJwt);
    document.getElementById('jwt-sample').addEventListener('click', () => {
        // Sample test JWT: header.payload.signature
        jwtInput.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIFNtaXRoIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MjQ5MDU2MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        parseJwt();
    });
    document.getElementById('jwt-clear').addEventListener('click', () => {
        jwtInput.value = '';
        parseJwt();
    });

    // 5. Regex Tester Tool
    const regexPattern = document.getElementById('regex-pattern');
    const regexTestString = document.getElementById('regex-test-string');
    const regexMatchesOutput = document.getElementById('regex-matches-output');
    const flagG = document.getElementById('flag-g');
    const flagI = document.getElementById('flag-i');
    const flagM = document.getElementById('flag-m');

    function runRegex() {
        const pattern = regexPattern.value;
        const text = regexTestString.value;

        if (!pattern) {
            regexMatchesOutput.innerHTML = '<span style="color:var(--text-secondary)">Enter a regex pattern...</span>';
            return;
        }

        let flags = '';
        if (flagG.checked) flags += 'g';
        if (flagI.checked) flags += 'i';
        if (flagM.checked) flags += 'm';

        try {
            const regex = new RegExp(pattern, flags);
            let match;
            let html = '';
            let count = 0;

            if (flags.includes('g')) {
                while ((match = regex.exec(text)) !== null) {
                    count++;
                    html += `<div class="match-item">
                        <div>Match #${count}: <strong>${escapeHtml(match[0])}</strong> (Index: ${match.index})</div>`;
                    if (match.length > 1) {
                        for (let i = 1; i < match.length; i++) {
                            html += `<div class="match-group">&bull; Group ${i}: ${escapeHtml(match[i] || '')}</div>`;
                        }
                    }
                    html += `</div>`;
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++; // avoid infinite loops on zero-width matches
                    }
                }
            } else {
                match = regex.exec(text);
                if (match) {
                    count = 1;
                    html += `<div class="match-item">
                        <div>Match #1: <strong>${escapeHtml(match[0])}</strong> (Index: ${match.index})</div>`;
                    if (match.length > 1) {
                        for (let i = 1; i < match.length; i++) {
                            html += `<div class="match-group">&bull; Group ${i}: ${escapeHtml(match[i] || '')}</div>`;
                        }
                    }
                    html += `</div>`;
                }
            }

            if (count === 0) {
                regexMatchesOutput.innerHTML = '<span style="color:var(--text-secondary)">No matches found.</span>';
            } else {
                regexMatchesOutput.innerHTML = html;
            }
        } catch (e) {
            regexMatchesOutput.innerHTML = `<span style="color:var(--accent-red)">Regex Error: ${escapeHtml(e.message)}</span>`;
        }
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    [regexPattern, regexTestString, flagG, flagI, flagM].forEach(el => {
        el.addEventListener('input', runRegex);
        el.addEventListener('change', runRegex);
    });
    runRegex();

    // 6. Crypto & Hashes Tool
    const cryptoInput = document.getElementById('crypto-input');
    const hashSha256 = document.getElementById('hash-sha256');
    const hashSha512 = document.getElementById('hash-sha512');
    const encBase64 = document.getElementById('enc-base64');
    const encUrl = document.getElementById('enc-url');

    async function updateCrypto() {
        const text = cryptoInput.value;
        if (!text) {
            hashSha256.value = '';
            hashSha512.value = '';
            encBase64.value = '';
            encUrl.value = '';
            return;
        }

        // Encoders
        try {
            encBase64.value = btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
        } catch (e) {
            encBase64.value = 'Encoding Error';
        }
        encUrl.value = encodeURIComponent(text);

        // Hashes using Web Crypto API
        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        try {
            const hashBuffer256 = await crypto.subtle.digest('SHA-256', data);
            hashSha256.value = Array.from(new Uint8Array(hashBuffer256)).map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            hashSha256.value = 'Not supported';
        }

        try {
            const hashBuffer512 = await crypto.subtle.digest('SHA-512', data);
            hashSha512.value = Array.from(new Uint8Array(hashBuffer512)).map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            hashSha512.value = 'Not supported';
        }
    }

    cryptoInput.addEventListener('input', updateCrypto);
    updateCrypto();

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const inputEl = document.getElementById(targetId);
            if (inputEl && inputEl.value) {
                navigator.clipboard.writeText(inputEl.value);
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = originalText, 1500);
            }
        });
    });

    // 7. Sorting Algorithm Visualizer
    const barsContainer = document.getElementById('visualizer-bars');
    const algoComparisons = document.getElementById('algo-comparisons');
    const algoSwaps = document.getElementById('algo-swaps');
    const algoStatus = document.getElementById('algo-status');
    const algoSelect = document.getElementById('algo-select');
    let arraySize = 40;
    let array = [];
    let isSorting = false;
    let comparisons = 0;
    let swaps = 0;

    function generateNewArray() {
        if (isSorting) return;
        array = [];
        barsContainer.innerHTML = '';
        comparisons = 0;
        swaps = 0;
        algoComparisons.textContent = '0';
        algoSwaps.textContent = '0';
        algoStatus.textContent = 'Ready';

        for (let i = 0; i < arraySize; i++) {
            array.push(Math.floor(Math.random() * 260) + 20);
        }

        array.forEach((val) => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${val}px`;
            barsContainer.appendChild(bar);
        });
    }

    document.getElementById('algo-generate').addEventListener('click', generateNewArray);
    generateNewArray();

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function startSort() {
        if (isSorting) return;
        isSorting = true;
        algoStatus.textContent = 'Sorting...';
        const algo = algoSelect.value;
        const bars = barsContainer.children;

        if (algo === 'bubble') {
            for (let i = 0; i < array.length; i++) {
                for (let j = 0; j < array.length - i - 1; j++) {
                    comparisons++;
                    algoComparisons.textContent = comparisons;
                    bars[j].classList.add('comparing');
                    bars[j + 1].classList.add('comparing');
                    await sleep(20);

                    if (array[j] > array[j + 1]) {
                        swaps++;
                        algoSwaps.textContent = swaps;
                        let temp = array[j];
                        array[j] = array[j + 1];
                        array[j + 1] = temp;
                        bars[j].style.height = `${array[j]}px`;
                        bars[j + 1].style.height = `${array[j + 1]}px`;
                        bars[j].classList.add('swapping');
                        bars[j + 1].classList.add('swapping');
                        await sleep(20);
                        bars[j].classList.remove('swapping');
                        bars[j + 1].classList.remove('swapping');
                    }
                    bars[j].classList.remove('comparing');
                    bars[j + 1].classList.remove('comparing');
                }
                bars[array.length - 1 - i].classList.add('sorted');
            }
        } else if (algo === 'selection') {
            for (let i = 0; i < array.length; i++) {
                let minIdx = i;
                bars[minIdx].classList.add('comparing');
                for (let j = i + 1; j < array.length; j++) {
                    comparisons++;
                    algoComparisons.textContent = comparisons;
                    bars[j].classList.add('comparing');
                    await sleep(15);
                    if (array[j] < array[minIdx]) {
                        bars[minIdx].classList.remove('comparing');
                        minIdx = j;
                        bars[minIdx].classList.add('comparing');
                    } else {
                        bars[j].classList.remove('comparing');
                    }
                }
                if (minIdx !== i) {
                    swaps++;
                    algoSwaps.textContent = swaps;
                    let temp = array[i];
                    array[i] = array[minIdx];
                    array[minIdx] = temp;
                    bars[i].style.height = `${array[i]}px`;
                    bars[minIdx].style.height = `${array[minIdx]}px`;
                }
                bars[minIdx].classList.remove('comparing');
                bars[i].classList.add('sorted');
            }
        } else if (algo === 'insertion') {
            for (let i = 1; i < array.length; i++) {
                let key = array[i];
                let j = i - 1;
                bars[i].classList.add('comparing');
                await sleep(20);

                while (j >= 0 && array[j] > key) {
                    comparisons++;
                    swaps++;
                    algoComparisons.textContent = comparisons;
                    algoSwaps.textContent = swaps;
                    array[j + 1] = array[j];
                    bars[j + 1].style.height = `${array[j + 1]}px`;
                    bars[j].classList.add('swapping');
                    await sleep(20);
                    bars[j].classList.remove('swapping');
                    j--;
                }
                array[j + 1] = key;
                bars[j + 1].style.height = `${key}px`;
                bars[i].classList.remove('comparing');
            }
            for (let k = 0; k < bars.length; k++) {
                bars[k].classList.add('sorted');
            }
        }

        for (let k = 0; k < bars.length; k++) {
            bars[k].classList.add('sorted');
        }
        algoStatus.textContent = 'Completed';
        isSorting = false;
    }

    document.getElementById('algo-start').addEventListener('click', startSort);

    // 8. Keymaker & Secure Token Generator
    const kmType = document.getElementById('km-type');
    const kmEngine = document.getElementById('km-engine');
    const kmPrefix = document.getElementById('km-prefix');
    const kmPrefixGroup = document.getElementById('km-prefix-group');
    const kmLength = document.getElementById('km-length');
    const kmLengthVal = document.getElementById('km-length-val');
    const kmOutput = document.getElementById('km-output');
    const kmCliCmd = document.getElementById('km-cli-cmd');
    const kmEntropy = document.getElementById('km-entropy');
    const kmEngineStatus = document.getElementById('km-engine-status');

    const dicewareWords = [
        'apple', 'orbit', 'quantum', 'cipher', 'matrix', 'beacon', 'delta', 'echo',
        'falcon', 'gravity', 'helix', 'ignite', 'junction', 'kinetic', 'lunar', 'nexus',
        'prism', 'quasar', 'radar', 'stellar', 'turbo', 'umbra', 'vortex', 'warp',
        'xenon', 'zenith', 'alpha', 'beta', 'gamma', 'omega', 'nexus', 'core',
        'packet', 'router', 'subnet', 'firewall', 'kernel', 'buffer', 'cache', 'proxy'
    ];

    function updateKeymakerOptions() {
        const type = kmType.value;
        if (type === 'apikey') {
            kmPrefixGroup.style.display = 'block';
            kmPrefixGroup.querySelector('label').textContent = 'Key Prefix / Namespace';
            kmPrefix.value = 'API_KEY=';
            kmLength.min = '16';
            kmLength.max = '96';
            kmLength.step = '4';
            kmLength.value = '32';
            kmLengthVal.textContent = kmLength.value;
        } else if (type === 'ssh') {
            kmPrefixGroup.style.display = 'block';
            kmPrefixGroup.querySelector('label').textContent = 'SSH Key Comment / Email';
            kmPrefix.value = 'SandfordAE@GitHub.io';
            kmLength.min = '256';
            kmLength.max = '4096';
            kmLength.step = '2048';
            kmLength.value = '256';
            kmLengthVal.textContent = 'Ed25519 (256-bit)';
        } else if (type === 'uuid') {
            kmPrefixGroup.style.display = 'none';
            kmLengthVal.textContent = '128 bits (fixed)';
        } else if (type === 'hex' || type === 'base64') {
            kmPrefixGroup.style.display = 'none';
            kmLength.min = '16';
            kmLength.max = '128';
            kmLength.step = '4';
            kmLength.value = '32';
            kmLengthVal.textContent = kmLength.value;
        } else if (type === 'passphrase') {
            kmPrefixGroup.style.display = 'none';
            kmLength.min = '4';
            kmLength.max = '8';
            kmLength.step = '1';
            kmLength.value = '4';
            kmLengthVal.textContent = `${kmLength.value} words`;
        }
        generateKey();
    }

    function generateKey() {
        const type = kmType.value;
        const engine = kmEngine.value;
        const len = parseInt(kmLength.value);
        if (type === 'ssh') {
            if (len === 256) kmLengthVal.textContent = 'Ed25519 (256-bit)';
            else if (len === 2048) kmLengthVal.textContent = 'RSA (2048-bit)';
            else if (len === 4096) kmLengthVal.textContent = 'RSA (4096-bit)';
            else kmLengthVal.textContent = `${len} bits`;
        } else if (type !== 'passphrase' && type !== 'uuid') {
            kmLengthVal.textContent = len;
        } else if (type === 'passphrase') {
            kmLengthVal.textContent = `${len} words`;
        }

        let result = '';
        let entropyBits = 0;
        let cliCommand = '';

        if (engine === 'crypto') {
            kmEngineStatus.textContent = 'Cryptographically Secure (Web Crypto API)';
            kmEngineStatus.style.color = 'var(--accent-green)';
        } else if (engine === 'math') {
            kmEngineStatus.textContent = 'Insecure PRNG (Math.random - Sandbox Only!)';
            kmEngineStatus.style.color = 'var(--accent-red)';
        } else if (engine === 'cli') {
            kmEngineStatus.textContent = 'CLI Reference Mode (OpenSSL / Python)';
            kmEngineStatus.style.color = 'var(--accent-cyan)';
        }

        const getRandomByte = () => {
            if (engine === 'crypto' || engine === 'cli') {
                const arr = new Uint8Array(1);
                window.crypto.getRandomValues(arr);
                return arr[0];
            } else {
                return Math.floor(Math.random() * 256);
            }
        };

        const sshOutputContainer = document.getElementById('ssh-output-container');
        const standardOutputContainer = document.getElementById('standard-output-container');
        const kmPrivateKey = document.getElementById('km-private-key');
        const kmPublicKey = document.getElementById('km-public-key');

        if (type === 'ssh') {
            sshOutputContainer.style.display = 'block';
            standardOutputContainer.style.display = 'none';

            const comment = kmPrefix.value.trim() || 'SandfordAE@GitHub.io';
            const bits = len;
            let algo = bits >= 2048 ? 'rsa' : 'ed25519';
            if (bits === 256) algo = 'ed25519';

            const randBytes = new Uint8Array(32);
            window.crypto.getRandomValues(randBytes);
            let b64 = btoa(String.fromCharCode(...randBytes)).replace(/=+$/, '');

            if (algo === 'ed25519') {
                const pubKey = `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI${b64} ${comment}`;
                const privKey = `-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW\nQyNTUxOQAAACD${b64.slice(0,32)}AAAAC3NzaC1lZDI1NTE5AAAAI${b64} ${comment}\n-----END OPENSSH PRIVATE KEY-----`;
                
                kmPublicKey.value = pubKey;
                kmPrivateKey.value = privKey;
                entropyBits = 256;
                cliCommand = `ssh-keygen -t ed25519 -C "${comment}" -f ~/.ssh/id_ed25519`;
                kmEntropy.textContent = `256 bits (Ed25519 Key Pair)`;
            } else {
                const pubKey = `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQ${b64} ${comment}`;
                const privKey = `-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAA... ${comment}\n-----END OPENSSH PRIVATE KEY-----`;

                kmPublicKey.value = pubKey;
                kmPrivateKey.value = privKey;
                entropyBits = bits;
                cliCommand = `ssh-keygen -t rsa -b ${bits} -C "${comment}" -f ~/.ssh/id_rsa_${bits}`;
                kmEntropy.textContent = `${bits} bits (RSA Key Pair)`;
            }
        } else {
            sshOutputContainer.style.display = 'none';
            standardOutputContainer.style.display = 'block';

            if (type === 'apikey') {
                const prefix = kmPrefix.value.trim();
                const byteLen = len;
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let token = '';
                for (let i = 0; i < byteLen; i++) {
                    token += chars[getRandomByte() % chars.length];
                }
                result = prefix ? `${prefix}${token}` : token;
                entropyBits = Math.round(byteLen * Math.log2(62));
                cliCommand = `python3 -c "import secrets; print('${prefix}' + ''.join(secrets.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') for _ in range(${byteLen})))"`;
            } else if (type === 'uuid') {
                if (engine === 'crypto' && window.crypto.randomUUID) {
                    result = window.crypto.randomUUID();
                } else {
                    result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = getRandomByte() * 16 / 256 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }
                entropyBits = 122;
                cliCommand = `uuidgen || python3 -c "import uuid; print(uuid.uuid4())"`;
            } else if (type === 'hex') {
                const byteLen = len;
                let bytes = [];
                for (let i = 0; i < byteLen; i++) {
                    bytes.push(getRandomByte().toString(16).padStart(2, '0'));
                }
                result = bytes.join('');
                entropyBits = byteLen * 8;
                cliCommand = `openssl rand -hex ${byteLen}`;
            } else if (type === 'base64') {
                const byteLen = len;
                let binary = '';
                for (let i = 0; i < byteLen; i++) {
                    binary += String.fromCharCode(getRandomByte());
                }
                result = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                entropyBits = byteLen * 8;
                cliCommand = `openssl rand -base64 ${byteLen} | tr -d '=' | tr '+/' '-_'`;
            } else if (type === 'passphrase') {
                const wordCount = len;
                let words = [];
                for (let i = 0; i < wordCount; i++) {
                    const idx = getRandomByte() % dicewareWords.length;
                    words.push(dicewareWords[idx]);
                }
                result = words.join('-');
                entropyBits = Math.round(wordCount * Math.log2(dicewareWords.length));
                cliCommand = `python3 -c "import secrets; words = ${JSON.stringify(dicewareWords)}; print('-'.join(secrets.choice(words) for _ in range(${wordCount})))"`;
            }

            kmOutput.value = result;
            kmEntropy.textContent = `${entropyBits} bits`;
        }

        kmCliCmd.value = cliCommand;
    }

    kmType.addEventListener('change', updateKeymakerOptions);
    kmEngine.addEventListener('change', generateKey);
    kmLength.addEventListener('input', generateKey);
    kmPrefix.addEventListener('input', generateKey);
    document.getElementById('km-generate').addEventListener('click', generateKey);
    updateKeymakerOptions();
});
