/* Injected into specimen pages. When a specimen is opened FROM a category page
   (VIEW → carries ?g=<slug>), show a back link to that category. With no ?g=
   (e.g. rendered as a DS-tab thumbnail) it adds nothing, so thumbnails stay clean. */
(function () {
  var g = new URLSearchParams(location.search).get('g');
  if (!g) return;
  try { document.documentElement.setAttribute('data-theme', localStorage.getItem('silent-ds-theme') || 'light'); } catch (e) {}
  var label = g.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  var a = document.createElement('a');
  a.href = 'category.html?g=' + encodeURIComponent(g);
  a.textContent = '← ' + label;
  a.style.cssText = 'position:fixed;top:12px;left:14px;z-index:9999;font:600 11px var(--font-mono),ui-monospace,monospace;'
    + 'letter-spacing:.1em;text-transform:uppercase;color:var(--accent);text-decoration:none;'
    + 'background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:5px 10px;'
    + 'box-shadow:0 2px 8px rgba(0,0,0,0.08);';
  document.body.appendChild(a);
  document.body.style.paddingTop = (parseInt(getComputedStyle(document.body).paddingTop) || 0) + 44 + 'px';
})();
