(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  /* gold cursor */
  var dot = document.getElementById('cursorDot');
  if (dot && fine && !reduce) {
    document.body.classList.add('cursor-on');
    var x = 0, y = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; });
    (function loop() {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      dot.style.left = cx + 'px'; dot.style.top = cy + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('hovering'); });
    });
  }

  var nav = document.getElementById('nav');
  var rail = document.getElementById('rail');
  var railNum = document.getElementById('railNum');
  var railLabel = document.getElementById('railLabel');

  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('settled', y > 40);
    if (rail) rail.classList.toggle('visible', y > window.innerHeight * 0.4);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toneObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var dark = entry.target.dataset.tone === 'dark';
      if (nav) nav.classList.toggle('on-dark', dark);
      if (rail) rail.classList.toggle('on-dark', dark);
      if (railNum && entry.target.dataset.scene) railNum.textContent = entry.target.dataset.scene;
      if (railLabel && entry.target.dataset.label) railLabel.textContent = entry.target.dataset.label;
    });
  }, { rootMargin: '-8% 0px -88% 0px' });
  document.querySelectorAll('.scene').forEach(function (s) { toneObserver.observe(s); });

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('in'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

  var menu = document.getElementById('menu');
  var toggle = document.getElementById('navToggle');
  var close = document.getElementById('menuClose');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menu && toggle && close) {
    toggle.addEventListener('click', function () { setMenu(true); });
    close.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }
})();
