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

// The scroll listener that tracked About's band past the top bar is gone with
// the band: it toggled body.past-intro so the bar could swap its background
// and ink over dark teal, and there is no second state to swap into now. The
// bar's one appearance is set in CSS.
const navBar = document.querySelector('nav');

const navLinks = document.querySelectorAll('#nav-links a');

// Underline the dock link for the page being viewed. The site is three
// documents now, not one scroll, so this is a URL comparison rather than the
// IntersectionObserver that used to watch which section crossed the viewport.
// Matching on the last path segment keeps it working whether the page was
// reached as /, /index.html or /projects.html.
const pageName = (() => {
    const last = window.location.pathname.split('/').pop();
    return last === '' ? 'index.html' : last;
})();

navLinks.forEach(link => {
    const target = (link.getAttribute('href') || '').split('/').pop();
    // Only the three section links carry a page name; the resume link is a PDF
    if (target !== pageName) return;
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
});

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
