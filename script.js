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

// fading header on scroll 
const aboutSection = document.getElementById('about');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        document.body.classList.toggle('past-about', !entry.isIntersecting);
    });
}, { threshold: 0 });
aboutSection.observe(aboutSection);