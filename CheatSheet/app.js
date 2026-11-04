document.addEventListener('DOMContentLoaded', async () => {
    // 1. Background Canvas Animation (Matching Dev Forge)
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

    // 2. Load Cheatsheets from manifest.json
    const sheetNavContainer = document.getElementById('sheet-nav-container');
    const contentPane = document.getElementById('content-pane');

    try {
        const response = await fetch('manifest.json');
        const data = await response.json();
        const sheets = data.sheets || [];

        if (sheets.length === 0) {
            contentPane.innerHTML = '<p>No cheatsheets found in manifest.json</p>';
            return;
        }

        // Render sidebar nav
        sheetNavContainer.innerHTML = '';
        sheets.forEach((sheet, index) => {
            const btn = document.createElement('button');
            btn.className = `sheet-nav-btn ${index === 0 ? 'active' : ''}`;
            btn.innerHTML = `<span>${sheet.title}</span><span style="font-size:0.7rem; color:var(--text-secondary);">${sheet.category || ''}</span>`;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sheet-nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                loadSheet(sheet.file);
            });
            sheetNavContainer.appendChild(btn);
        });

        // Load first sheet by default
        loadSheet(sheets[0].file);

    } catch (e) {
        contentPane.innerHTML = `<p style="color:var(--accent-red);">Error loading manifest.json: ${e.message}</p>`;
    }

    async function loadSheet(filename) {
        contentPane.innerHTML = '<p style="color:var(--text-secondary);">Loading cheatsheet...</p>';
        try {
            const res = await fetch(`Sheets/${filename}`);
            const markdown = await res.text();
            renderMarkdown(markdown);
        } catch (e) {
            contentPane.innerHTML = `<p style="color:var(--accent-red);">Error loading Sheets/${filename}: ${e.message}</p>`;
        }
    }

    function renderMarkdown(md) {
        const lines = md.split('\n');
        let html = '';
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('# ')) {
                html += `<h1>${trimmed.substring(2)}</h1>`;
            } else if (trimmed.startsWith('## ')) {
                html += `<h2>${trimmed.substring(3)}</h2>`;
            } else if (trimmed.startsWith('- ')) {
                const content = trimmed.substring(2);
                const cmdStart = content.indexOf('`');
                const cmdEnd = content.indexOf('`', cmdStart + 1);

                if (cmdStart !== -1 && cmdEnd !== -1) {
                    const title = content.substring(0, cmdStart).replace(/\*\*/g, '').replace(/:$/, '').trim();
                    const cmd = content.substring(cmdStart + 1, cmdEnd);
                    const explanation = content.substring(cmdEnd + 1).replace(/^[:\s-]+/, '').trim();

                    const isDestructive = /prune|\brm\b|drop|clean|purge|rs/i.test(cmd) || /remove|clean|prune|delete/i.test(title);

                    html += `
                        <div class="cheat-item ${isDestructive ? 'destructive' : ''}">
                            <div class="cheat-top-row">
                                <span class="cheat-desc">${escapeHtml(title)}</span>
                                ${isDestructive ? '<span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-red); background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px;">DESTRUCTIVE</span>' : ''}
                            </div>
                            ${explanation ? `<div class="cheat-explanation">${escapeHtml(explanation)}</div>` : ''}
                            <div class="cheat-cmd-wrapper" data-cmd="${escapeHtml(cmd)}" title="Click anywhere to copy command">
                                <span style="font-family: var(--font-mono); overflow-x: auto; white-space: nowrap;">${escapeHtml(cmd)}</span>
                                <button class="btn btn-sm ${isDestructive ? '' : 'primary'} copy-snippet-btn" data-cmd="${escapeHtml(cmd)}" style="${isDestructive ? 'border-color: var(--accent-red); color: var(--accent-red); background: rgba(239, 68, 68, 0.1);' : ''}">Copy</button>
                            </div>
                        </div>
                    `;
                } else {
                    html += `<p style="margin-bottom: 8px; color:var(--text-secondary);">&bull; ${escapeHtml(content)}</p>`;
                }
            } else if (trimmed === '') {
                // empty line
            } else {
                html += `<p style="margin-bottom: 8px; color:var(--text-secondary);">${escapeHtml(trimmed)}</p>`;
            }
        });

        contentPane.innerHTML = html;

        // Attach click-to-copy listeners to command wrappers and buttons
        document.querySelectorAll('.cheat-cmd-wrapper').forEach(wrapper => {
            wrapper.addEventListener('click', (e) => {
                const cmd = wrapper.getAttribute('data-cmd');
                navigator.clipboard.writeText(cmd);
                
                const btn = wrapper.querySelector('.copy-snippet-btn');
                const orig = btn.textContent;
                btn.textContent = 'Copied!';
                wrapper.style.borderColor = 'var(--accent-green)';
                
                setTimeout(() => {
                    btn.textContent = orig;
                    wrapper.style.borderColor = '';
                }, 1500);
            });
        });
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
});
