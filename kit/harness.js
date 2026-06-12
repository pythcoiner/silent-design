/* Silent — gallery harness. Plain JS (loaded before the Babel specimen script).
   A panel page calls Gallery.render({...}) with React elements; this builds the
   page chrome (header + theme toggle) and mounts each specimen into a card. */
(function () {
  function el(tag, cls, txt) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'light');
    document.querySelectorAll('.gx-themebar button').forEach(b =>
      b.classList.toggle('is-on', b.dataset.mode === mode));
  }

  function render(cfg) {
    const root = el('div', 'gx-wrap');

    const top = el('div', 'gx-top');
    const back = el('a', 'gx-back', '← Panels');
    back.href = 'index.html';
    top.appendChild(back);
    const themebar = el('div', 'gx-themebar');
    ['light', 'dark'].forEach(m => {
      const b = el('button', m === 'light' ? 'is-on' : '', m[0].toUpperCase() + m.slice(1));
      b.dataset.mode = m;
      b.onclick = () => setTheme(m);
      themebar.appendChild(b);
    });
    top.appendChild(themebar);
    root.appendChild(top);

    root.appendChild(el('div', 'gx-kicker', 'Silent · ' + (cfg.kicker || 'Panel components')));
    root.appendChild(el('div', 'gx-h1', cfg.title || ''));
    if (cfg.lede) root.appendChild(el('div', 'gx-lede', cfg.lede));

    const mounts = [];
    (cfg.groups || []).forEach(group => {
      const sec = el('div', 'gx-sec');
      sec.appendChild(el('div', 'gx-sec-title', group.name));
      const grid = el('div', 'gx-grid');
      (group.items || []).forEach(item => {
        const card = el('div', 'gx-card' + (item.span ? ' ' + item.span : ''));
        const cap = el('div', 'gx-cap');
        cap.appendChild(el('b', '', item.title || ''));
        if (item.tag) cap.appendChild(el('span', 'tag', item.tag));
        card.appendChild(cap);

        const body = el('div', 'gx-body' + (item.frame ? ' flush' : ''));
        if (item.frame) {
          const frame = el('div', 'gx-frame');
          frame.style.height = (item.height || 560) + 'px';
          body.appendChild(frame);
          mounts.push({ node: frame, el: item.el });
        } else {
          mounts.push({ node: body, el: item.el });
        }
        card.appendChild(body);
        grid.appendChild(card);
      });
      sec.appendChild(grid);
      root.appendChild(sec);
    });

    document.body.appendChild(root);

    // mount React elements once React is present
    mounts.forEach(m => {
      try { ReactDOM.createRoot(m.node).render(m.el); } catch (e) { console.error(e); }
    });
  }

  window.Gallery = { render, setTheme };
})();
