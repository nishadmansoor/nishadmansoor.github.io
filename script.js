// Nav stays hidden over the first screen and fades in once it scrolls past.
const firstSection = document.getElementById('about');
if (firstSection) {
    const updateNav = () => {
        const bottom = firstSection.getBoundingClientRect().bottom;
        document.body.classList.toggle('past-hero', bottom <= 60);
    };
    window.addEventListener('scroll', updateNav);
    window.addEventListener('resize', updateNav);
    updateNav();
}

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

// Close the mobile drawer after tapping a nav link.
document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const toggle = document.getElementById('nav-toggle');
        if (toggle) toggle.checked = false;
    });
});
