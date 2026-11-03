document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 2. Dynamic terminal system timestamp & readiness log
    const terminalOutput = document.querySelector('.terminal-body');
    if (terminalOutput) {
        const now = new Date().toUTCString();
        const timeLine = document.createElement('div');
        timeLine.className = 't-output';
        timeLine.style.color = 'var(--accent-cyan)';
        timeLine.innerHTML = `[SYS] Session initialized at ${now}`;
        terminalOutput.insertBefore(timeLine, terminalOutput.children[1]);
    }
});
