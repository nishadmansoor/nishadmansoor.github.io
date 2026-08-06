//adding typewriter functionality to splash screen 
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
// implementing typewriter effect on splash screen
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const line3 = document.getElementById('line3');
const explore = document.getElementById('explore');

//hero page
typeText(line1, "hey there! my name is nishad", 60, function () {
    setTimeout(function () {
        typeText(line2, "welcome to my portfolio", 60, function () {
            setTimeout(function () {
                typeText(line3, "click here to learn more about me", 60, function () {
                    explore.style.display = 'block';
                }, 300);
            }, 400);
        });
    }, 400);
});

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