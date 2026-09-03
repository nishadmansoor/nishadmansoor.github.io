// Docks the nav links and fades in the top bar.
// Fires as soon as About gives up ~10% of the viewport, rather than waiting
// until it has almost fully scrolled away — that head start is what lets the
// links finish moving up before the next section's content is on screen.
const DOCK_THRESHOLD = 0.9;
const firstSection = document.getElementById('about');
if (firstSection) {
    const updateNav = () => {
        const bottom = firstSection.getBoundingClientRect().bottom;
        const docked = bottom <= window.innerHeight * DOCK_THRESHOLD;
        document.body.classList.toggle('past-hero', docked);
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
