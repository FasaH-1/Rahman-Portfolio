(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) Mark what should animate when it scrolls into view
  var targets = [
    ['.hero .hello', 0], ['.hero h1', 120], ['.hero .tagline', 240], ['.hero .cta', 360],
    ['.hero img', 200, 'rv-right'],
    ['.title', 0], ['.page-title', 0], ['.lead', 100], ['.focus h2', 0],
    ['.journey .avatar-panel', 0, 'rv-fade'], ['.journey .card', 120], ['.mini li', 0],
    ['.tabs', 0], ['.panel:not([hidden])', 80], ['.focus-img', 0, 'rv-fade'], ['.roles', 0], ['.rolepanel:not([hidden])', 80],
    ['.about-grid .card', 0], ['.about-grid .avatar-panel', 120, 'rv-fade'], ['.sub', 0], ['.edu li', 0],
    ['.courses-wrap > div:first-child', 0], ['.courses li', 0],
    ['.sec-head', 0], ['.item', 0], ['.tags li', 0, 'rv-pop'], ['.chips li', 0, 'rv-pop'], ['.skillchips li', 0, 'rv-pop'],
    ['.tool-groups > div', 0], ['.skill-h', 0], ['.certs li', 0], ['.langs .lang', 0],
    ['.proj-group > .who', 0], ['.proj-group > .sub-line', 60], ['.trio figure', 0], ['.pair figure', 0], ['.six figure', 0], ['.case', 0],
    ['.act', 0], ['.contacts li', 0], ['.ending-grid .quote', 150], ['.pager', 0]
  ];
  var els = [];
  targets.forEach(function (t) {
    var list = document.querySelectorAll(t[0]);
    list.forEach(function (el, i) {
      if (el.classList.contains('rv') || el.closest('[hidden]')) return;
      el.classList.add('rv');
      if (t[2]) el.classList.add(t[2]);
      var step = /li|figure|\.act|\.item|lang|\.case/.test(t[0]) ? 80 : 0;
      var chip = /tags|chips|skillchips/.test(t[0]);
      var d = t[1] + (chip ? Math.min(i % 12 * 35, 400) : Math.min(i % 6 * step, 480));
      el.style.setProperty('--d', d + 'ms');
      els.push(el);
    });
  });
  // Underline bars follow their heading (or reveal themselves)
  document.querySelectorAll('.bar').forEach(function (b) {
    if (b.closest('[hidden]')) return;
    b.classList.add('rv');
    var prev = b.previousElementSibling;
    if (!prev || !prev.classList.contains('rv')) els.push(b);
  });

  if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); document.querySelectorAll('.bar').forEach(function (e) { e.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var above = !en.isIntersecting && en.boundingClientRect.top < 0;
        if (en.isIntersecting || above) {
          if (above) en.target.style.setProperty('--d', '0ms');
          en.target.classList.add('in');
          io.unobserve(en.target);
          // the bar right after a heading reveals together with it
          var n = en.target.nextElementSibling;
          if (n && n.classList.contains('bar')) n.classList.add('in');
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    els.forEach(function (e) { io.observe(e); });
  }

  // 2) Focus Area: fade the collage when the role changes
  document.querySelectorAll('.role-tab').forEach(function (t) {
    t.addEventListener('click', function () {
      var img = document.getElementById('focus-img');
      if (!img) return;
      img.classList.remove('swap'); void img.offsetWidth; img.classList.add('swap');
    });
  });

  // 3) Fade out before opening another page of the site
  if (!reduce) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      var h = a.getAttribute('href') || '';
      if (a.target === '_blank' || !/^[\w-]+\.html$/.test(h)) return;
      e.preventDefault();
      root.classList.add('leaving');
      setTimeout(function () { location.href = h; }, 180);
    });
    window.addEventListener('pageshow', function () { root.classList.remove('leaving'); });
  }
})();
