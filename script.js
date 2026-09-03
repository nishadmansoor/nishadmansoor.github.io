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

const navLinks = document.querySelectorAll('#nav-links a');

// Underline the nav link for whichever section is currently in view.
// Targets are derived from the links themselves, so adding or reordering
// nav items needs no change here.
const navTargets = [...navLinks]
    .map(link => {
        const href = link.getAttribute('href') || '';
        return { link, section: href.startsWith('#') ? document.querySelector(href) : null };
    })
    .filter(target => target.section);

if (navTargets.length) {
    const setActive = section => {
        navTargets.forEach(target => {
            const on = target.section === section;
            target.link.classList.toggle('active', on);
            if (on) {
                target.link.setAttribute('aria-current', 'true');
            } else {
                target.link.removeAttribute('aria-current');
            }
        });
    };

    // A 1%-tall band 40% down the viewport. Sections tile the page with no
    // gaps, so exactly one can cross it — and a section taller than the
    // viewport stays active for its whole scroll.
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActive(entry.target);
        });
    }, { rootMargin: '-40% 0px -59% 0px' });

    navTargets.forEach(target => sectionObserver.observe(target.section));
}

// Close the mobile drawer after tapping a nav link.
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const toggle = document.getElementById('nav-toggle');
        if (toggle) toggle.checked = false;
    });
});
