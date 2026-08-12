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

document.getElementById('nav-icon').addEventListener('click', function (e) {
    e.preventDefault();
    var checkbox = document.getElementById('nav-toggle');
    checkbox.checked = !checkbox.checked;
});

document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', function () {
        document.getElementById('nav-toggle').checked = false;
    });
});

window.addEventListener('scroll', () => {
    const checkbox = document.getElementById('nav-toggle');
    if (checkbox.checked) {
        checkbox.checked = false;
    }

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

