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
typeText(line1, "Hello! Welcome to my portfolio", 60, function () {
    setTimeout(function () {
        typeText(line2, "My name is Nishad", 60, function () {
            setTimeout(function () {
                typeText(line3, "See what I've been building", 60, function () {
                    explore.style.display = 'block';
                }, 300);
            }, 400);
        });
    }, 400);
});