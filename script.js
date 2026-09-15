// Docks the nav links and fades in the top bar.
// Fires as soon as the first screen gives up ~10% of the viewport, rather
// than waiting until it has almost fully scrolled away — that head start is
// what lets the links finish moving up before the next section is on screen.
const DOCK_THRESHOLD = 0.9;
const firstSection = document.getElementById('hero') || document.getElementById('about');
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

// Drives the section's backdrop, which only #projects has.
const syncFlipState = section => {
    section.classList.toggle('has-flipped', !!section.querySelector('.flip-card.flipped'));
};

const closeFlipped = section => {
    section.querySelectorAll('.flip-card.flipped').forEach(c => c.classList.remove('flipped'));
    syncFlipState(section);
};

document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', function (e) {
        // Let links inside a card navigate instead of toggling the flip
        if (e.target.closest('a')) return;

        const closer = e.target.closest('[data-flip-close]');
        // Clicking around inside an open detail panel shouldn't shut it —
        // only the close button, the backdrop, or Escape do that.
        if (!closer && e.target.closest('.flip-card-back')) return;

        const section = this.closest('section');
        const wasFlipped = this.classList.contains('flipped');
        section.querySelectorAll('.flip-card').forEach(c => c.classList.remove('flipped'));
        if (!wasFlipped && !closer) {
            this.classList.add('flipped');
        }
        syncFlipState(section);
    });
});

// Backdrop sits outside the cards, so it needs its own listener
document.querySelectorAll('.flip-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', () => closeFlipped(backdrop.closest('section')));
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('section').forEach(closeFlipped);
    }
});

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const syncPressed = () => {
        const isDark = document.documentElement.classList.contains('dark');
        themeToggle.setAttribute('aria-pressed', String(isDark));
    };
    syncPressed();
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        syncPressed();
        try {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        } catch (e) {
            /* storage blocked (private mode) — the theme still applies here */
        }
    });
}

// Only <a> children, so the theme toggle button isn't treated as a section link
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

// Social icons belong in the footer on desktop and in the nav bar on mobile.
// nav and #footer are separate elements, so CSS can't move the node between
// them — relocating beats duplicating three inline SVGs into both.
const navSocials = document.getElementById('nav-socials');
const socialGroup = document.getElementById('social-links');
const footerBox = document.getElementById('footer');
if (navSocials && socialGroup && footerBox) {
    const mq = window.matchMedia('(max-width: 768px)');
    const placeSocials = () => {
        if (mq.matches) {
            if (navSocials.parentElement !== socialGroup) {
                // Back between Resume and the theme toggle
                socialGroup.insertBefore(navSocials, document.getElementById('theme-toggle'));
            }
        } else if (navSocials.parentElement !== footerBox) {
            footerBox.appendChild(navSocials);
        }
    };
    placeSocials();
    mq.addEventListener('change', placeSocials);
}

// Close the mobile drawer after tapping a nav link.
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const toggle = document.getElementById('nav-toggle');
        if (toggle) toggle.checked = false;
    });
});
