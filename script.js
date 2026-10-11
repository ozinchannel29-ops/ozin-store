// Ganti dengan nomor WhatsApp admin (format internasional, tanpa + atau 0 di depan)
const WA_NUMBER = "6287868325296";

// Semua elemen dengan atribut data-wa membuka chat WhatsApp dengan pesan otomatis
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(el.dataset.wa)}`;
  el.target = "_blank";
  el.rel = "noopener";
});

// Navbar berubah saat di-scroll
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Menu mobile
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
const setMenu = (open) => {
  burger.classList.toggle("open", open);
  navLinks.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
};
burger.addEventListener("click", (e) => {
  e.stopPropagation();
  setMenu(!navLinks.classList.contains("open"));
});
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
// Tutup menu saat area gelap di luar menu disentuh
document.addEventListener("click", (e) => {
  if (navLinks.classList.contains("open") && !navLinks.contains(e.target)) setMenu(false);
});

// Slider (harga paket): tombol ‹ ›, titik penanda, dan geser
document.querySelectorAll("[data-slider]").forEach((slider) => {
  const track = slider.querySelector(".slider-track");
  const items = [...track.children];
  const nav = slider.querySelector(".slider-nav");
  const prev = slider.querySelector("[data-prev]");
  const next = slider.querySelector("[data-next]");
  const dotsEl = slider.querySelector(".slider-dots");
  const step = () => (items[1] ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth);
  const maxScroll = () => track.scrollWidth - track.clientWidth;

  const update = () => {
    const atStart = track.scrollLeft <= 2;
    const atEnd = track.scrollLeft >= maxScroll() - 2;
    prev.disabled = atStart;
    next.disabled = atEnd;
    const i = atEnd ? dotsEl.children.length - 1 : Math.round(track.scrollLeft / step());
    [...dotsEl.children].forEach((d, n) => d.classList.toggle("active", n === i));
  };

  const build = () => {
    const pages = maxScroll() > 2 ? Math.round(maxScroll() / step()) + 1 : 1;
    nav.hidden = pages <= 1;
    // di HP, resize juga terpicu saat address bar muncul/hilang; titik cukup dibuat ulang kalau jumlahnya berubah
    if (dotsEl.children.length === pages) return update();
    dotsEl.innerHTML = "";
    for (let n = 0; n < pages; n++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Geser ke posisi ${n + 1}`);
      dot.addEventListener("click", () => track.scrollTo({ left: n * step() }));
      dotsEl.appendChild(dot);
    }
    update();
  };

  prev.addEventListener("click", () => track.scrollBy({ left: -step() }));
  next.addEventListener("click", () => track.scrollBy({ left: step() }));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", build);
  build();
});

// Animasi muncul saat di-scroll + counter statistik
const countUp = (el) => {
  const target = +el.dataset.count;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / 1400, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      const counter = entry.target.querySelector("[data-count]");
      if (counter) countUp(counter);
      io.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// FAQ: hanya satu yang terbuka
document.querySelectorAll(".faq details").forEach((d) =>
  d.addEventListener("toggle", () => {
    if (d.open) document.querySelectorAll(".faq details").forEach((o) => o !== d && (o.open = false));
  })
);

document.getElementById("year").textContent = new Date().getFullYear();
