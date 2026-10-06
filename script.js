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
            nowPlaying.classList.add('loaded');
        })
        .catch(() => {
            // Only the song card goes. It used to remove the whole module,
            // which now also holds the book, show and game cards.
            document.getElementById('now-playing-card')?.remove();
            initRotation();
        });
}

// Mark the masthead nav link for the page being viewed. The site is three
// documents, not one scroll, so this is a URL comparison rather than the
// IntersectionObserver that used to watch which section crossed the viewport.
//
// Compared as normalised paths, not filenames. The pages live at /, /work/
// and /projects/ now, so the old "last path segment" test broke: splitting
// "/work/" on "/" ends in an empty string, same as "/" does. Normalising
// folds "/work", "/work/" and "/work/index.html" onto one key.
const normalisePath = (p) => {
    const path = p.replace(/index\.html$/, '');
    return path.endsWith('/') ? path : path + '/';
};

const here = normalisePath(window.location.pathname);

document.querySelectorAll('#masthead-nav a').forEach(link => {
    // link.href is already absolute, so this also covers a relative href
    if (normalisePath(new URL(link.href).pathname) !== here) return;
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
});

// ---- Rotation deck ----
// Four cards sharing one slot. Everything is visible until this runs, so a
// JS failure degrades to a plain stack rather than to one hidden card.
function initRotation() {
    const deck = document.querySelector('.rot-deck');
    const nav = document.querySelector('.rot-nav');
    if (!deck || !nav) return;

    const cards = [...deck.querySelectorAll('.rot-card')];
    if (cards.length < 2) {
        nav.hidden = true;
        deck.classList.remove('is-deck');
        cards.forEach(c => c.removeAttribute('aria-hidden'));
        return;
    }

    deck.classList.add('is-deck');
    nav.hidden = false;
    const count = nav.querySelector('.rot-count');
    let i = 0;

    const show = n => {
        i = (n + cards.length) % cards.length;
        cards.forEach((c, k) => c.setAttribute('aria-hidden', String(k !== i)));
        count.textContent = `${i + 1} / ${cards.length}`;
    };

    nav.querySelectorAll('.rot-btn').forEach(btn => {
        btn.addEventListener('click', () => show(i + Number(btn.dataset.dir)));
    });

    show(0);
}

initRotation();

// ---- Theme toggle ----
// The <head> script has already applied a stored choice before paint; this
// only handles clicks and keeps the button's label truthful. With no stored
// choice there is no data-theme attribute at all, so the page follows the OS
// through the media query and the button reports whatever that resolves to.
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    const activeTheme = () =>
        root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');

    const syncLabel = () => {
        const dark = activeTheme() === 'dark';
        themeToggle.setAttribute('aria-pressed', String(dark));
        themeToggle.setAttribute('aria-label', dark ? 'switch to light mode' : 'switch to dark mode');
        themeToggle.setAttribute('title', dark ? 'light mode' : 'dark mode');
    };

    themeToggle.addEventListener('click', () => {
        const next = activeTheme() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        // Safari in private mode throws on write, and a failed save is not
        // worth breaking the toggle over — the theme still applies this visit.
        try {
            localStorage.setItem('theme', next);
        } catch (e) { }
        syncLabel();
    });

    // Track the OS only while the visitor has made no explicit choice.
    systemDark.addEventListener('change', () => {
        if (!root.hasAttribute('data-theme')) syncLabel();
    });

    syncLabel();
}
