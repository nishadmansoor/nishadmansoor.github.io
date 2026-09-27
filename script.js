// Fills the "what i'm listening to" row from a Spotify track id. oEmbed is
// used rather than the Web API because both of the API's auth flows need a
// client secret, which cannot ship in a static site; oEmbed needs no key and
// sends access-control-allow-origin: *, so it is callable from the page.
// It returns the title and cover art only — never the artist, which is why
// that line is hand-written in the markup. If the request fails the whole
// module is removed rather than left as an empty heading.
const nowPlaying = document.getElementById('now-playing');
if (nowPlaying && nowPlaying.dataset.track) {
    const trackUrl = `https://open.spotify.com/track/${nowPlaying.dataset.track}`;
    fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(trackUrl)}`)
        .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
        .then(data => {
            nowPlaying.querySelector('.aside-track-name').textContent = data.title;
            const art = nowPlaying.querySelector('.aside-track-art');
            if (data.thumbnail_url) art.src = data.thumbnail_url;
            nowPlaying.classList.add('loaded');
        })
        .catch(() => {
            document.getElementById('now-playing-module')?.remove();
        });
}

// Tracks whether About's teal band has scrolled up past the mobile top bar.
// Over the band the bar goes transparent with light ink and hides the name,
// which the band already prints at size; past it the bar takes the page
// background and dark ink. Keyed to the band clearing the bar's own height —
// the old version measured a full-viewport hero against 90% of the viewport,
// and with the hero gone that left the bar in its light-on-dark state for
// most of About, i.e. light ink on the beige page.
const banner = document.getElementById('about-band');
const navBar = document.querySelector('nav');
if (banner && navBar) {
    const updateNav = () => {
        // Nav is display: none on desktop, so offsetHeight is 0 there
        const barHeight = navBar.offsetHeight || 56;
        const cleared = banner.getBoundingClientRect().bottom <= barHeight;
        document.body.classList.toggle('past-intro', cleared);
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

// On desktop the utility group (Resume, theme toggle) lives in the floating
// dock; on mobile it stays in the top bar. nav and #nav-links are separate
// elements, so CSS can't move it — relocating beats duplicating.
// navBar is the one declared at the top of this file.
const socialGroup = document.getElementById('social-links');
const dock = document.getElementById('nav-links');
if (socialGroup && navBar && dock) {
    const mq = window.matchMedia('(max-width: 768px)');
    const placeSocials = () => {
        if (mq.matches) {
            if (socialGroup.parentElement !== navBar) navBar.appendChild(socialGroup);
        } else if (socialGroup.parentElement !== dock) {
            dock.appendChild(socialGroup);
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
