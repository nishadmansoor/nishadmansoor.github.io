window.addEventListener('scroll', () => {
    const heroBottom = document.getElementById('hero').getBoundingClientRect().bottom;
    document.body.classList.toggle('past-hero', heroBottom <= 0);
});
window.dispatchEvent(new Event('scroll'));

document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', function () {
        const wasFlipped = this.classList.contains('flipped');
        document.querySelectorAll('.flip-card').forEach(c => c.classList.remove('flipped'));
        if (!wasFlipped) {
            this.classList.add('flipped');
        }
        document.getElementById('beyond').classList.toggle('has-flipped', !wasFlipped);
    });
});
