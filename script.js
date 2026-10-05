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
// Matching on the last path segment keeps it working whether the page was
// reached as /, /index.html or /projects.html.
//
// Gone with the dock and the mobile drawer: the relocation handler that moved
// the utility group between the top bar and the dock at 769px, and the
// click handler that unchecked #nav-toggle to close the drawer. One nav in
// the masthead needs neither.
const pageName = (() => {
    const last = window.location.pathname.split('/').pop();
    return last === '' ? 'index.html' : last;
})();

document.querySelectorAll('#masthead-nav a').forEach(link => {
    const target = (link.getAttribute('href') || '').split('/').pop();
    // Only the three page links can match; resume is a PDF
    if (target !== pageName) return;
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
