// implementing typewriter functionality
function typeText(element, text, speed, callback) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', function () {
        document.getElementById('nav-toggle').checked = false;
    });
});

const heroSection = document.getElementById('hero');
window.addEventListener('scroll', () => {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    document.body.classList.toggle('past-hero', heroBottom <= 0);
});
window.dispatchEvent(new Event('scroll'));

