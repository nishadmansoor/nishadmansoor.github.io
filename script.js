window.addEventListener('scroll', () => {
    const heroBottom = document.getElementById('hero').getBoundingClientRect().bottom;
    document.body.classList.toggle('past-hero', heroBottom <= 0);
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
