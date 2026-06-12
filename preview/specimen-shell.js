/* Shared full-page shell for specimen pages. Loaded AFTER catalog-data.js.
   When a specimen is opened from the catalog (URL carries ?g=<category>), it
   wraps the bare demo in consistent chrome — header (back + theme toggle),
   eyebrow + title + function-name chips, and a titled panel around the demo.
   With no ?g (e.g. a DS-tab thumbnail) it only applies the saved theme and
   leaves the demo bare, so thumbnails stay clean. */
(function () {
  try { document.documentElement.setAttribute('data-theme', localStorage.getItem('silent-ds-theme') || 'light'); } catch (e) {}
  var g = new URLSearchParams(location.search).get('g');
  if (!g || !window.CATALOG_GROUPS) return;

  var file = location.pathname.split('/').pop().replace('.html', '');
  var label = file, cat = g.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }), fns = [];
  for (var i = 0; i < window.CATALOG_GROUPS.length; i++) {
    var grp = window.CATALOG_GROUPS[i], items = grp[2];
    for (var j = 0; j < items.length; j++) {
      if (items[j][0] === file) { label = items[j][1]; fns = items[j][3] || []; cat = grp[0]; }
    }
  }

  // move the existing demo into a holder
  var demo = document.createElement('div');
  demo.className = 'sh-demo';
  while (document.body.firstChild) demo.appendChild(document.body.firstChild);

  var chips = fns.map(function (f) { return '<code>' + f + '</code>'; }).join('');
  var wrap = document.createElement('div');
  wrap.className = 'sh-wrap';
  wrap.innerHTML =
    '<div class="sh-bar">' +
      '<a class="sh-pill" id="shBack"></a>' +
      '<button class="sh-pill sh-toggle" id="shToggle"><span class="sh-ic" id="shIcon"></span><span id="shLabel">Light</span></button>' +
    '</div>' +
    '<div class="sh-eyebrow">Silent · ' + cat + '</div>' +
    '<h1 class="sh-title"></h1>' +
    (chips ? '<div class="sh-fns">' + chips + '</div>' : '') +
    '<div class="sh-panel"><div class="sh-hd">Specimen</div><div class="sh-body"></div></div>';
  document.body.appendChild(wrap);
  wrap.querySelector('.sh-title').textContent = label;
  wrap.querySelector('.sh-body').appendChild(demo);

  var back = wrap.querySelector('#shBack');
  back.href = 'category.html?g=' + encodeURIComponent(g);
  back.textContent = '← ' + cat;

  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="15" height="15"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var r = document.documentElement, ic = wrap.querySelector('#shIcon'), lb = wrap.querySelector('#shLabel');
  function apply(t) { r.setAttribute('data-theme', t); try { localStorage.setItem('silent-ds-theme', t); } catch (e) {}
    ic.innerHTML = t === 'dark' ? MOON : SUN; lb.textContent = t === 'dark' ? 'Dark' : 'Light'; }
  apply(r.getAttribute('data-theme') || 'light');
  wrap.querySelector('#shToggle').addEventListener('click', function () {
    apply(r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
})();
