/* =========================================================
   DIGITAL SOUL — Premium Redesign
   script.js  (vanilla, no dependencies)
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav: scrolled state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Scroll progress bar ---------- */
  const bar = document.getElementById("scrollProgress");
  const updateProgress = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("navBurger");
  const mobile = document.getElementById("navMobile");
  if (burger) {
    burger.addEventListener("click", () => {
      const open = mobile.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    mobile.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobile.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Reveal on scroll (with stagger per group) ---------- */
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window && !prefersReduced) {
    // assign a small stagger to siblings sharing a parent
    const groups = new Map();
    revealEls.forEach((el) => {
      const p = el.parentElement;
      if (!groups.has(p)) groups.set(p, 0);
      const i = groups.get(p);
      el.style.setProperty("--reveal-delay", (i * 0.07).toFixed(2) + "s");
      groups.set(p, i + 1);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));

    // Failsafe: reveal anything already in the viewport on load, and never
    // let content stay permanently hidden if the observer doesn't fire.
    const revealInView = () => {
      revealEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-visible");
      });
    };
    window.addEventListener("load", revealInView);
    setTimeout(revealInView, 400);
    setTimeout(() => revealEls.forEach((el) => el.classList.add("is-visible")), 3000);
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Process steps line fill ---------- */
  const steps = document.querySelectorAll(".step");
  if ("IntersectionObserver" in window) {
    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            sio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    steps.forEach((s) => sio.observe(s));
  }

  /* ---------- Animated counters ---------- */
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const suffix = el.getAttribute("data-suffix") || "";
    if (prefersReduced) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const val = target * easeOut(p);
      el.textContent = val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(tick);
  }
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Magnetic buttons ---------- */
  if (!prefersReduced && window.matchMedia("(hover:hover)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 0.32;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---------- Card tilt (pillars) — removed for flat brand aesthetic ---------- */

  /* ---------- Cursor glow — removed for flat brand aesthetic ---------- */

  /* ---------- Hero parallax on video ---------- */
  const heroVideo = document.querySelector(".hero__video");
  if (heroVideo && !prefersReduced) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroVideo.style.transform = `translateY(${y * 0.18}px) scale(1.05)`;
      }
    }, { passive: true });
  }

  /* ---------- Case studies: drag to scroll ---------- */
  const scroller = document.getElementById("workScroller");
  if (scroller) {
    let isDown = false, startX = 0, startScroll = 0, moved = 0;
    scroller.addEventListener("mousedown", (e) => {
      isDown = true; moved = 0;
      startX = e.pageX; startScroll = scroller.scrollLeft;
      scroller.classList.add("is-drag");
    });
    window.addEventListener("mouseup", () => { isDown = false; scroller.classList.remove("is-drag"); });
    window.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const dx = e.pageX - startX;
      moved = Math.abs(dx);
      scroller.scrollLeft = startScroll - dx;
    });
    // prevent click navigation right after a drag
    scroller.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", (e) => { if (moved > 6) e.preventDefault(); })
    );
    // convert vertical wheel to horizontal when hovering
    scroller.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scroller.scrollLeft += e.deltaY;
        if (e.cancelable) e.preventDefault();
      }
    }, { passive: false });
  }

  /* ---------- Smooth anchor offset for fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });
})();
