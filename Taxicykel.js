/* ===================== SPROGSWITCHER ===================== */

const SPROG_KNAP_TEKST = {
    da: '🇩🇰 Dansk ▼',
    en: '🇬🇧 English ▼',
    fr: '🇫🇷 Français ▼',
    ar: '🇸🇦 العربية ▼',
    it: '🇮🇹 Italiano ▼',
    de: '🇩🇪 Deutsch ▼'
};

function saetSprog(sprog) {
    // Skift korte tekster via data-[sprog] attribut
    document.querySelectorAll('[data-da]').forEach(el => {
        const tekst = el.dataset[sprog];
        if (tekst !== undefined) {
            el.textContent = tekst;
        }
    });

    // Vis/skjul sprogspecifikke blokke (lange tekster) — spring dropdown-links over
    document.querySelectorAll('[data-lang]').forEach(el => {
        if (el.closest('.language-dropdown')) return;
        el.style.display = (el.dataset.lang === sprog) ? '' : 'none';
    });

    // Arabisk = RTL, alle andre = LTR
    document.documentElement.dir  = (sprog === 'ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = sprog;

    // Opdater sprogswitcher-knap
    const langKnap = document.getElementById('langBtn');
    if (langKnap) langKnap.textContent = SPROG_KNAP_TEKST[sprog] || SPROG_KNAP_TEKST.da;

    localStorage.setItem('guldkareten_sprog', sprog);
}

function indlaesSprog() {
    const gemt = localStorage.getItem('guldkareten_sprog') || 'da';
    saetSprog(gemt);
}

/* ===================== HAMBURGER MENU ===================== */

function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const nav       = document.getElementById('nav');
    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', nav.classList.contains('open'));
    });

    document.addEventListener('click', e => {
        if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
            nav.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ===================== SPROG-DROPDOWN ===================== */

function initSprogDropdown() {
    const menu = document.getElementById('languageMenu');
    const knap = document.getElementById('langBtn');
    if (!menu || !knap) return;

    knap.addEventListener('click', e => {
        e.stopPropagation();
        menu.classList.toggle('open');
    });

    menu.querySelectorAll('a[data-lang]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            saetSprog(link.dataset.lang);
            menu.classList.remove('open');
        });
    });

    document.addEventListener('click', e => {
        if (!menu.contains(e.target)) menu.classList.remove('open');
    });
}

/* ===================== AKTIV NAVLINK ===================== */

function markerAktivSide() {
    const nuvaerende = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('header nav a[href]').forEach(link => {
        if (link.getAttribute('href') === nuvaerende) link.classList.add('aktiv');
    });
}

/* ===================== KONTAKTFORMULAR ===================== */

function initKontaktFormular() {
    const form = document.getElementById('kontaktForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const navn    = document.getElementById('navn')?.value.trim()    || '';
        const email   = document.getElementById('email')?.value.trim()   || '';
        const telefon = document.getElementById('telefon')?.value.trim() || '';
        const tur     = document.getElementById('tur')?.value            || '';
        const besked  = document.getElementById('besked')?.value.trim()  || '';

        const emne = `Forespørgsel fra ${navn} — ${tur || 'Generel henvendelse'}`;
        const krop = [
            `Navn: ${navn}`,
            `E-mail: ${email}`,
            telefon ? `Telefon: ${telefon}` : '',
            tur     ? `Tur: ${tur}`         : '',
            '',
            `Besked:\n${besked}`
        ].filter(Boolean).join('\n');

        window.location.href =
            `mailto:gul.kareten@gmail.com?subject=${encodeURIComponent(emne)}&body=${encodeURIComponent(krop)}`;
    });
}

/* ===================== INIT ===================== */

document.addEventListener('DOMContentLoaded', () => {
    initHamburger();
    initSprogDropdown();
    markerAktivSide();
    indlaesSprog();
    initKontaktFormular();
});
