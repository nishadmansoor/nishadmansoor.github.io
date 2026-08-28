window.addEventListener('scroll', () => {
    const aboutBottom = document.getElementById('about').getBoundingClientRect().bottom;
    document.body.classList.toggle('past-hero', aboutBottom <= 60);
});
window.dispatchEvent(new Event('scroll'));

document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', function () {
        const section = this.closest('section');
        const wasFlipped = this.classList.contains('flipped');
        section.querySelectorAll('.flip-card').forEach(c => c.classList.remove('flipped'));
        if (!wasFlipped) {
            this.classList.add('flipped');
        }
    });
});

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const syncPressed = () => {
        const isDark = document.documentElement.classList.contains('dark');
        themeToggle.setAttribute('aria-pressed', String(isDark));
    };
    syncPressed();
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        syncPressed();
        try {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        } catch (e) {
            /* storage unavailable (private mode) — theme still applies for this page */
        }
    });
}
