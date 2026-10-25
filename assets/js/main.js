(function () {
  // Menü
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  if (btn && nav) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // Escape schließt das Menü und setzt den Fokus zurück auf den Menüknopf (Barrierefreiheit 18.10.2026)
  if (btn && nav) document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !nav.classList.contains('open')) return;
    if (document.querySelector('.dd.open')) return;
    nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus();
  });

  // Startseite: Lage ankreuzen füllt das Prüfprotokoll
  var data = document.getElementById('protos');
  if (data) {
    var P = JSON.parse(data.textContent), card = document.querySelector('.hero .proto');
    var q = function (k) { return card.querySelector('[data-k="' + k + '"]'); };
    var I = {
      ok: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      no: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M8 3.5v5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="12" r="1.2" fill="currentColor"/></svg>',
      arr: '<svg class="arr ext" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M5 11l6-6M6 5h5v5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="visually-hidden"> (neuer Tab)</span>'
    };
    var esc = function (s) { return String(s).replace(/(\d) (€|%)/g, '$1\u00a0$2').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    // Zeiger der Antwortkarte auf die gewählte Lage ausrichten
    var place = function () {
      var sel = document.querySelector('input[name="lage"]:checked'); if (!sel) return;
      var lab = sel.closest('label'), r1 = lab.getBoundingClientRect(), r2 = card.getBoundingClientRect();
      card.style.setProperty('--cy', Math.max(18, Math.min(r2.height - 38, r1.top + r1.height / 2 - r2.top - 10)) + 'px');
    };
    place(); window.addEventListener('resize', place);
    document.querySelectorAll('input[name="lage"]').forEach(function (inp) { inp.addEventListener('change', function () { setTimeout(place, 0); }); });
    document.querySelectorAll('input[name="lage"]').forEach(function (inp) {
      inp.addEventListener('change', function () {
        var d = P[inp.value]; if (!d) return;
        card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
        q('title').textContent = d.title;
        var lg = q('logo'); if (lg) { if (d.logo) { lg.src = d.logo; lg.parentNode.hidden = false; } else { lg.parentNode.hidden = true; } }
        var f = q('for'); if (f) f.textContent = inp.parentNode.textContent.trim();
        var b = q('btn'); b.href = d.href; b.innerHTML = '<span class="lb-w"><span class="lb-l">' + esc(d.btn) + '</span><span class="lb-s">' + esc(d.btnShort || d.btn) + '</span>' + (d.partner ? '<sup class="ast">*</sup>' : '') + '</span> ' + I.arr.replace('(neuer Tab)', d.partner ? '(neuer Tab, Partnerlink)' : '(neuer Tab)');
        b.rel = d.partner ? 'nofollow sponsored noopener' : 'nofollow noopener';
        b.removeAttribute('data-fm-tracked');
        var det = q('detail'); det.href = d.detail; var detSr = det.querySelector('.visually-hidden'); if (detSr) detSr.textContent = ' zu ' + (d.detailName || ''); else det.textContent = d.detailLabel;
        q('src').textContent = d.src;
        var stand = q('stand'); if (stand) stand.textContent = d.stand;
        q('rows').innerHTML = d.rows.map(function (r, i) {
          return '<li class="' + (r[2] ? 'ok' : 'no') + '" style="animation-delay:' + (i * 70) + 'ms"><span class="mk">' + (r[2] ? I.ok : I.no) + '</span><span class="k">' + esc(r[0]) + '</span><span class="v">' + esc(r[1]) + '</span></li>';
        }).join('');
      });
    });
  }

  // Startseite: Vergleich eingrenzen
  var hv = document.getElementById('hv-list');
  if (hv) {
    var rows = Array.prototype.slice.call(hv.children), more = document.getElementById('hv-more');
    var hvCount = document.getElementById('hv-count'), hvEmpty = document.getElementById('hv-empty'), open = !!hv.closest('[data-all]');
    var limit = window.matchMedia('(min-width:1000px)').matches ? 8 : 5;
    function hvApply() {
      var k = (document.querySelector('input[name="hv"]:checked') || {}).value || 'alle', n = 0, total = 0;
      rows.forEach(function (el, i) {
        var match = k === 'alle' || (el.getAttribute('data-f') || '').split(' ').indexOf(k) > -1;
        if (match) total++;
        var show = match && (k !== 'alle' || open || i < limit);
        el.hidden = !show; if (show) n++;
      });
      hvCount.textContent = k === 'alle' ? (n < total ? n + ' von ' + total + ' Konten' : total + ' Konten') : total + (total === 1 ? ' Konto passt' : ' Konten passen');
      hvEmpty.hidden = total > 0;
      if (more) more.hidden = !(k === 'alle' && n < total);
    }
    document.querySelectorAll('input[name="hv"]').forEach(function (r) { r.addEventListener('change', hvApply); });
    if (more) more.addEventListener('click', function () {
      var first = rows.filter(function (el) { return el.hidden; })[0]; open = true; hvApply();
      if (first) { var a = first.querySelector('h3 a'); if (a) a.focus(); }
    });
    hvApply();
  }

  // Vergleich: Filter und Sortierung
  var cards = document.getElementById('cards');
  if (cards && document.getElementById('sort')) {
    var items = Array.prototype.slice.call(cards.children), count = document.getElementById('count'), empty = document.getElementById('empty');
    var sort = document.getElementById('sort'), boxes = document.querySelectorAll('input[name="f"]');
    function apply() {
      var on = Array.prototype.filter.call(boxes, function (b) { return b.checked; }).map(function (b) { return b.value; });
      var n = 0;
      items.forEach(function (el) {
        var f = (el.getAttribute('data-f') || '').split(' ');
        var ok = on.every(function (k) { return f.indexOf(k) > -1; });
        el.hidden = !ok; if (ok) n++;
      });
      count.textContent = n + (n === 1 ? ' Konto' : ' Konten');
      empty.hidden = n > 0;
    }
    function order() {
      var k = sort.value;
      items.sort(function (a, b) {
        if (k === 'name') return a.dataset.name.localeCompare(b.dataset.name, 'de');
        if (k === 'kosten') return (a.dataset.kosten - b.dataset.kosten) || (a.dataset.rang - b.dataset.rang);
        return a.dataset.rang - b.dataset.rang;
      }).forEach(function (el) { cards.appendChild(el); });
    }
    boxes.forEach(function (b) { b.addEventListener('change', apply); });
    sort.addEventListener('change', order);
    document.getElementById('reset').addEventListener('click', function () { boxes.forEach(function (b) { b.checked = false; }); apply(); });
  }
})();

/* Kommentare: freigegebene laden, neue senden. Läuft nur, wenn /kommentare/api.php erreichbar ist. */
(function () {
  var sec = document.querySelector('[data-comments]');
  if (!sec) return;
  var page = sec.getAttribute('data-comments');
  var api = '/gemeinschaftskonto24-test-pages/kommentare/api.php';
  var list = sec.querySelector('.c-list'), empty = sec.querySelector('.c-empty');
  var form = sec.querySelector('.c-form'), status = sec.querySelector('.c-status');
  var shown = Date.now();
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function item(c) {
    var d = c.date.slice(0, 10).split('-');
    var paras = c.text.trim().split(/\n{2,}/).map(function (p) { return '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>'; }).join('');
    return '<article class="c-item' + (c.author ? ' c-author' : '') + '" id="k' + c.id + '"><p class="c-meta"><strong>' + esc(c.name) + '</strong>' +
      (c.author ? '<span class="c-badge">Autorin</span>' : '') + '<time datetime="' + esc(c.date) + '">' + d[2] + '.' + d[1] + '.' + d[0] + '</time></p><div class="c-text">' + paras + '</div></article>';
  }
  if (location.protocol !== 'file:') {
    fetch(api + '?page=' + encodeURIComponent(page), { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.comments) return;
        var tops = d.comments.filter(function (c) { return !c.parent; });
        list.innerHTML = tops.map(function (t) {
          return '<li>' + item(t) + d.comments.filter(function (r) { return r.parent === t.id; }).map(item).join('') + '</li>';
        }).join('');
        empty.hidden = tops.length > 0;
      }).catch(function () {});
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button');
    var data = { page: page, t: Date.now() - shown };
    ['name', 'email', 'text', 'website'].forEach(function (k) { data[k] = form.elements[k].value; });
    // Fehler am Feld markieren und den Fokus dorthin setzen (Barrierefreiheit 18.10.2026)
    var bad = data.name.trim().length < 2 ? 'name' : (data.text.trim().length < 10 ? 'text' : '');
    ['name', 'text'].forEach(function (k) { form.elements[k].removeAttribute('aria-invalid'); });
    if (bad) {
      form.elements[bad].setAttribute('aria-invalid', 'true');
      status.className = 'c-status err';
      status.textContent = bad === 'name' ? 'Bitte geben Sie Ihren Namen an.' : 'Bitte schreiben Sie einen Kommentar mit mindestens 10 Zeichen.';
      form.elements[bad].focus(); return;
    }
    if (btn.getAttribute('aria-disabled') === 'true') return;
    // aria-disabled statt disabled: der Knopf behält den Fokus
    btn.setAttribute('aria-disabled', 'true'); status.className = 'c-status'; status.textContent = 'Wird gesendet …';
    fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok) { form.reset(); status.className = 'c-status ok'; status.textContent = res.j.message || 'Danke! Ihr Kommentar erscheint nach Prüfung.'; }
        else { status.className = 'c-status err'; status.textContent = res.j.error || 'Das hat nicht geklappt.'; }
      })
      .catch(function () { status.className = 'c-status err'; status.textContent = 'Keine Verbindung. Bitte später erneut versuchen.'; })
      .then(function () { btn.removeAttribute('aria-disabled'); });
  });
})();

/* Quiz „Passt das Konto zu Ihnen?“ auf Bankseiten (14.10.2026) */
(function () {
  var f = document.querySelector('[data-quiz]');
  if (!f) return;
  f.classList.add('js');
  var qs = [].slice.call(f.querySelectorAll('.q'));
  var segs = [].slice.call(f.querySelectorAll('.steps3 i')), res = f.querySelector('.res'), again = f.querySelector('.again');
  var cta = document.querySelector('.bk-actrow .btn');
  var step = 0;
  function show(i) {
    step = i;
    qs.forEach(function (q, k) { q.hidden = k !== i; });
    segs.forEach(function (g, k) { g.className = k < i ? 'done' : (k === i ? 'cur' : ''); });
  }
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function result() {
    var miss = [], blocked = false;
    qs.forEach(function (q, index) {
      var c = q.querySelector('input:checked');
      if (c && c.value !== q.getAttribute('data-good')) {
        miss.push(q.getAttribute('data-hint'));
        if ((f.dataset.requiredQuestion || '').split(',').indexOf(String(index)) !== -1) blocked = true;
      }
      q.hidden = true;
    });
    segs.forEach(function (g) { g.className = 'done'; });
    var h, cls;
    if (!miss.length) { cls = 'ok'; h = f.dataset.positiveTitle || 'Passt gut zu Ihnen'; }
    else if (miss.length === 1) { cls = 'mid'; h = 'Passt – mit einer Einschränkung'; }
    else { cls = 'no'; h = 'Passt eher weniger'; }
    if (miss.length && f.dataset.cautionTitle) h = f.dataset.cautionTitle;
    if (blocked) { cls = 'no'; h = f.dataset.requiredTitle; }
    var html = '<p class="rh ' + cls + '">' + esc(h) + '</p>';
    if (miss.length) html += '<ul>' + miss.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>';
    else html += '<p>' + esc(f.dataset.positiveText || 'Nach Ihren Antworten gibt es keinen Haken.') + '</p>';
    html += '<div class="ra">';
    if (cta && !blocked) html += cta.outerHTML;
    if (miss.length) html += '<a class="alt" href="#alternativen">Gute Alternativen ansehen</a>';
    html += '</div>';
    res.innerHTML = html; res.hidden = false; again.hidden = false;
  }
  qs.forEach(function (q, i) {
    q.addEventListener('change', function () {
      // Fokus nie verlieren: nächste Frage bzw. Ergebnis bekommt den Fokus (Barrierefreiheit 18.10.2026)
      setTimeout(function () {
        if (i + 1 < qs.length) { show(i + 1); var n = qs[i + 1].querySelector('input'); if (n) n.focus(); }
        else { result(); res.setAttribute('tabindex', '-1'); res.focus(); }
      }, 180);
    });
  });
  again.addEventListener('click', function () {
    f.reset(); res.hidden = true; again.hidden = true; show(0);
    var first = qs[0].querySelector('input'); if (first) first.focus();
  });
  show(0);
})();
