(function () {
  var DV = window.DV || {};
  var cs = DV.cs || getComputedStyle(document.documentElement);
  var calm = !!DV.calm;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var v = function (n) { return cs.getPropertyValue(n).trim(); };
  function store(k, val) {
    try { if (val === undefined) return localStorage.getItem(k); localStorage.setItem(k, val); } catch (e) {}
    return null;
  }
  function boom() { if (DV.fireworks && !calm) DV.fireworks(); }

  var PAL = [
    ['--color-crimson', 'Crimson'], ['--color-magenta', 'Magenta'], ['--color-accent', 'Marigold'], ['--color-flame', 'Flame'],
    ['--color-leaf', 'Leaf green'], ['--color-peacock', 'Peacock blue'], ['--color-peacock-deep', 'Deep blue'], ['--color-accent-hi', 'Gold']
  ];
  function swatches(host, list, current, onPick, name) {
    host.innerHTML = '';
    list.forEach(function (it, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'sw';
      b.style.setProperty('--c', 'var(' + it[0] + ')');
      b.setAttribute('aria-label', (name ? name + ': ' : '') + it[1]);
      b.setAttribute('aria-pressed', i === current ? 'true' : 'false');
      b.addEventListener('click', function () {
        $$('.sw', host).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        onPick(i);
      });
      host.appendChild(b);
    });
  }
  function segment(host, items, current, onPick) {
    host.innerHTML = '';
    items.forEach(function (label, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'segb'; b.textContent = label;
      b.setAttribute('aria-pressed', i === current ? 'true' : 'false');
      b.addEventListener('click', function () {
        $$('.segb', host).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        onPick(i);
      });
      host.appendChild(b);
    });
  }

  /* ---------- countdown to 8 November 2026, 6 pm ---------- */
  (function () {
    var out = { d: $('#cd-d'), h: $('#cd-h'), m: $('#cd-m'), s: $('#cd-s') }, msg = $('#cd-msg'); if (!out.d) return;
    var target = new Date(2026, 10, 8, 18, 0, 0), fired = false;
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
      var ms = target - Date.now();
      if (ms <= 0) {
        out.d.textContent = '0'; out.h.textContent = out.m.textContent = out.s.textContent = '00';
        if (ms > -86400000) {
          msg.textContent = 'Happy Deepavali! The lamps are lit.';
          if (!fired && ms > -5000) { fired = true; boom(); }
        } else { msg.textContent = 'Happy Deepavali. See you next year.'; }
        return;
      }
      msg.textContent = 'Counting to 6 pm on 8 November 2026.';
      var s = Math.floor(ms / 1000);
      out.d.textContent = Math.floor(s / 86400);
      out.h.textContent = pad(Math.floor(s % 86400 / 3600));
      out.m.textContent = pad(Math.floor(s % 3600 / 60));
      out.s.textContent = pad(s % 60);
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ---------- sweets ---------- */
  (function () {
    var list = $('#sw-list'), det = $('#sw-det'); if (!list) return;
    var S = [
      ['Laddu', 'Round sweets rolled from flour, ghee and sugar. Besan laddu uses roasted gram flour and is a favourite at festival time.'],
      ['Jalebi', 'Spirals of batter fried crisp, then soaked in warm sugar syrup. Best eaten fresh.'],
      ['Murukku', 'A crunchy spiral snack made from rice flour and lentil flour, pressed straight into hot oil.'],
      ['Gulab jamun', 'Soft milk dumplings fried golden and soaked in rose-scented syrup.'],
      ['Mysore pak', 'A rich fudge of gram flour, ghee and sugar that melts on the tongue.'],
      ['Kaju katli', 'Thin diamonds of cashew and sugar, sometimes topped with edible silver leaf.']
    ];
    function show(i) {
      $$('button', list).forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      det.innerHTML = '';
      var h = document.createElement('h3'); h.textContent = S[i][0];
      var p = document.createElement('p'); p.textContent = S[i][1];
      det.appendChild(h); det.appendChild(p);
    }
    S.forEach(function (it, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'swrow'; b.textContent = it[0];
      b.addEventListener('click', function () { show(i); });
      list.appendChild(b);
    });
    show(0);
  })();

  /* ---------- diya designer ---------- */
  (function () {
    var svg = $('#dz'); if (!svg) return;
    var CLAY = [['--color-clay', 'Terracotta'], ['--color-peacock', 'Peacock blue'], ['--color-crimson', 'Crimson'], ['--color-leaf', 'Leaf green'], ['--color-magenta', 'Magenta']];
    var FLAME = [['--color-flame', 'Orange'], ['--color-accent', 'Marigold'], ['--color-crimson', 'Crimson'], ['--color-magenta', 'Magenta'], ['--color-peacock', 'Blue']];
    var ci = 0, fi = 0;
    var FL = '<g class="flame on"><path class="flame-out" d="M60 8 C74 30 80 46 60 70 C40 46 46 30 60 8Z"/><path class="flame-in" d="M60 32 C67 44 69 54 60 68 C51 54 53 44 60 32Z"/></g>';
    function paint(el, c, f) {
      var base = v(CLAY[c][0]);
      el.style.setProperty('--color-clay', base);
      el.style.setProperty('--color-clay-hi', 'color-mix(in oklab, ' + base + ' 72%, ' + v('--color-ink') + ')');
      el.style.setProperty('--color-clay-deep', 'color-mix(in oklab, ' + base + ' 55%, ' + v('--color-shade') + ')');
      el.style.setProperty('--color-flame', v(FLAME[f][0]));
    }
    var wishIn = $('#dz-in'), wish = $('#dz-wish'), made = $('#made'), empty = $('#made-empty');
    function sync() { paint(svg, ci, fi); wish.textContent = wishIn.value.trim(); }
    swatches($('#dz-clay'), CLAY, 0, function (i) { ci = i; sync(); }, 'Clay');
    swatches($('#dz-flame'), FLAME, 0, function (i) { fi = i; sync(); }, 'Flame');
    wishIn.addEventListener('input', sync); sync();
    var items = [];
    try { items = JSON.parse(store('dv-made') || '[]'); } catch (e) { items = []; }
    // storage is user-editable: keep only well-formed entries
    items = (Array.isArray(items) ? items : []).filter(function (it) {
      return it && Number.isInteger(it.c) && it.c >= 0 && it.c < CLAY.length && Number.isInteger(it.f) && it.f >= 0 && it.f < FLAME.length;
    }).slice(-10).map(function (it) { return { c: it.c, f: it.f, w: typeof it.w === 'string' ? it.w.slice(0, 30) : '' }; });
    function render() {
      made.innerHTML = '';
      items.forEach(function (it) {
        var li = document.createElement('li');
        li.innerHTML = '<svg class="diya" viewBox="0 0 120 130" aria-hidden="true"><use href="#diya-body"/>' + FL + '</svg><span></span>';
        paint($('svg', li), it.c, it.f);
        $('span', li).textContent = it.w || '';
        made.appendChild(li);
      });
      empty.hidden = items.length > 0;
    }
    $('#dz-add').addEventListener('click', function () {
      items.push({ c: ci, f: fi, w: wishIn.value.trim() });
      if (items.length > 10) items.shift();
      store('dv-made', JSON.stringify(items)); render();
    });
    $('#dz-clear').addEventListener('click', function () { items = []; store('dv-made', '[]'); render(); });
    render();
  })();

  /* ---------- rangoli maker ---------- */
  (function () {
    var svg = $('#rg'); if (!svg) return;
    var RINGS = [
      { n: 16, r0: 41, L: 46, w: 13.5, off: 0, label: 'Outer petals' },
      { n: 16, r0: 31, L: 35, w: 11, off: 11.25, label: 'Second ring' },
      { n: 16, r0: 22, L: 27, w: 8.5, off: 0, label: 'Third ring' },
      { n: 8, r0: 12, L: 18, w: 7, off: 22.5, label: 'Inner ring' }
    ];
    var sel = [0, 4, 2, 1, 2];
    function petal(r0, L, w) {
      var r1 = r0 + L;
      return 'M0 ' + (-r0) + ' C' + w + ' ' + (-(r0 + L * 0.25)) + ' ' + w + ' ' + (-(r0 + L * 0.75)) + ' 0 ' + (-r1) +
        ' C' + (-w) + ' ' + (-(r0 + L * 0.75)) + ' ' + (-w) + ' ' + (-(r0 + L * 0.25)) + ' 0 ' + (-r0) + 'Z';
    }
    function col(i) { return v(PAL[((i % 8) + 8) % 8][0]); }
    var beadCols = ['--color-accent', '--color-crimson', '--color-leaf', '--color-peacock'];
    function build() {
      var s = '<circle r="90" fill="' + v('--color-paper-3') + '" stroke="' + v('--color-rule') + '" stroke-width="0.8"/>';
      for (var d = 0; d < 56; d++) {
        var an = d * Math.PI / 28;
        s += '<circle cx="' + (Math.sin(an) * 93).toFixed(1) + '" cy="' + (-Math.cos(an) * 93).toFixed(1) + '" r="' + (d % 2 ? 1.5 : 2.3) + '" fill="' + v(beadCols[d % 4]) + '"/>';
      }
      RINGS.forEach(function (R, ri) {
        for (var i = 0; i < R.n; i++) {
          var c = i % 2 ? col(sel[ri] + 3) : col(sel[ri]);
          s += '<g transform="rotate(' + ((360 / R.n) * i + R.off).toFixed(2) + ')">' +
            '<path d="' + petal(R.r0, R.L, R.w) + '" fill="' + c + '" stroke="' + v('--color-paper-2') + '" stroke-width="0.9"/>' +
            '<path d="' + petal(R.r0 + R.L * 0.2, R.L * 0.62, R.w * 0.34) + '" fill="' + col(sel[ri] + 2) + '"/></g>';
        }
      });
      s += '<circle r="12" fill="' + col(sel[4]) + '"/><circle r="7.4" fill="' + col(sel[4] + 3) + '"/><circle r="3" fill="' + v('--color-accent-hi') + '"/>';
      svg.innerHTML = s;
    }
    var host = $('#rg-controls');
    var labels = RINGS.map(function (r) { return r.label; }).concat(['Centre']);
    labels.forEach(function (lab, ri) {
      var row = document.createElement('div'); row.className = 'rrow';
      var t = document.createElement('span'); t.textContent = lab;
      var sw = document.createElement('div'); sw.className = 'sws';
      row.appendChild(t); row.appendChild(sw); host.appendChild(row);
      swatches(sw, PAL, sel[ri], function (i) { sel[ri] = i; build(); }, lab);
    });
    function resync() {
      $$('.rrow', host).forEach(function (row, ri) {
        $$('.sw', row).forEach(function (b, i) { b.setAttribute('aria-pressed', i === sel[ri] ? 'true' : 'false'); });
      });
    }
    $('#rg-rand').addEventListener('click', function () {
      sel = sel.map(function () { return Math.floor(Math.random() * 8); }); resync(); build();
    });
    $('#rg-dl').addEventListener('click', function () {
      var size = 1080, c = document.createElement('canvas'); c.width = c.height = size;
      var g = c.getContext('2d');
      g.fillStyle = v('--color-paper-2'); g.fillRect(0, 0, size, size);
      g.translate(size / 2, size / 2); var k = size / 200; g.scale(k, k);
      g.fillStyle = v('--color-paper-3'); g.strokeStyle = v('--color-rule'); g.lineWidth = 0.8;
      g.beginPath(); g.arc(0, 0, 90, 0, 6.2832); g.fill(); g.stroke();
      for (var d = 0; d < 56; d++) {
        var an = d * Math.PI / 28; g.fillStyle = v(beadCols[d % 4]);
        g.beginPath(); g.arc(Math.sin(an) * 93, -Math.cos(an) * 93, d % 2 ? 1.5 : 2.3, 0, 6.2832); g.fill();
      }
      RINGS.forEach(function (R, ri) {
        var P = new Path2D(petal(R.r0, R.L, R.w)), Q = new Path2D(petal(R.r0 + R.L * 0.2, R.L * 0.62, R.w * 0.34));
        for (var i = 0; i < R.n; i++) {
          g.save(); g.rotate(((360 / R.n) * i + R.off) * Math.PI / 180);
          g.fillStyle = i % 2 ? col(sel[ri] + 3) : col(sel[ri]); g.strokeStyle = v('--color-paper-2'); g.lineWidth = 0.9;
          g.fill(P); g.stroke(P); g.fillStyle = col(sel[ri] + 2); g.fill(Q); g.restore();
        }
      });
      g.fillStyle = col(sel[4]); g.beginPath(); g.arc(0, 0, 12, 0, 6.2832); g.fill();
      g.fillStyle = col(sel[4] + 3); g.beginPath(); g.arc(0, 0, 7.4, 0, 6.2832); g.fill();
      g.fillStyle = v('--color-accent-hi'); g.beginPath(); g.arc(0, 0, 3, 0, 6.2832); g.fill();
      c.toBlob(function (b) { saveBlob(b, 'my-rangoli.png'); });
    });
    build();
  })();

  function saveBlob(b, name) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  /* ---------- games ---------- */
  (function () {
    var tq = $('#tab-quiz'), tm = $('#tab-mem'); if (!tq) return;
    var pq = $('#pane-quiz'), pm = $('#pane-mem');
    function tab(which) {
      tq.setAttribute('aria-selected', which === 'q' ? 'true' : 'false');
      tm.setAttribute('aria-selected', which === 'm' ? 'true' : 'false');
      pq.hidden = which !== 'q'; pm.hidden = which !== 'm';
    }
    tq.addEventListener('click', function () { tab('q'); });
    tm.addEventListener('click', function () { tab('m'); });

    var Q = [
      ['How many days does the festival run in much of India?', ['Three', 'Five', 'Seven'], 1],
      ['Which goddess is welcomed on the main night?', ['Saraswati', 'Lakshmi', 'Durga'], 1],
      ['Who returned to Ayodhya to a city full of lamps?', ['Rama', 'Hanuman', 'Arjuna'], 0],
      ['What is the rice-flour floor art at the door called?', ['Origami', 'Mehndi', 'Kolam'], 2],
      ['What does a diya usually burn?', ['Gas', 'Oil or ghee', 'Wax only'], 1]
    ];
    var qi = 0, score = 0, done = false;
    var cnt = $('#qz-count'), qt = $('#qz-q'), opts = $('#qz-opts'), fb = $('#qz-fb'), nx = $('#qz-next');
    function showQ() {
      done = false; fb.textContent = ''; nx.hidden = true; opts.innerHTML = '';
      if (qi >= Q.length) {
        cnt.textContent = 'All done';
        qt.textContent = 'You got ' + score + ' of ' + Q.length + '.';
        fb.textContent = score === Q.length ? 'Perfect score. Happy Deepavali!' : 'Good effort. Try again?';
        if (score === Q.length) boom();
        nx.textContent = 'Play again'; nx.hidden = false; return;
      }
      cnt.textContent = 'Question ' + (qi + 1) + ' of ' + Q.length;
      qt.textContent = Q[qi][0];
      Q[qi][1].forEach(function (o, i) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.textContent = o;
        b.addEventListener('click', function () {
          if (done) return; done = true;
          var ok = i === Q[qi][2];
          if (ok) score++;
          b.classList.add(ok ? 'right' : 'wrong');
          $$('.opt', opts)[Q[qi][2]].classList.add('right');
          fb.textContent = ok ? 'Correct.' : 'Not quite. The answer is ' + Q[qi][1][Q[qi][2]] + '.';
          nx.textContent = qi === Q.length - 1 ? 'See score' : 'Next'; nx.hidden = false;
        });
        opts.appendChild(b);
      });
    }
    nx.addEventListener('click', function () {
      if (qi >= Q.length) { qi = 0; score = 0; } else { qi++; }
      showQ();
    });
    showQ();

    var W = ['Diya', 'Kolam', 'Laddu', 'Lakshmi', 'Rama', 'Jalebi'];
    var grid = $('#mm-grid'), info = $('#mm-info'), moves = 0, first = null, lock = false, matched = 0;
    function newGame() {
      var deck = W.concat(W).sort(function () { return Math.random() - 0.5; });
      grid.innerHTML = ''; moves = 0; first = null; lock = false; matched = 0;
      info.textContent = 'Find the six pairs. Moves: 0';
      deck.forEach(function (w) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'tile'; b.dataset.w = w;
        b.setAttribute('aria-label', 'Hidden tile');
        b.innerHTML = '<span class="back" aria-hidden="true"><svg class="diya" viewBox="0 0 120 130"><use href="#diya-body"/></svg></span><span class="front"></span>';
        $('.front', b).textContent = w;
        b.addEventListener('click', function () {
          if (lock || b.classList.contains('up') || b.classList.contains('done')) return;
          b.classList.add('up'); b.setAttribute('aria-label', w);
          if (!first) { first = b; return; }
          moves++; info.textContent = 'Find the six pairs. Moves: ' + moves;
          if (first.dataset.w === w) {
            first.classList.add('done'); b.classList.add('done'); first = null; matched++;
            if (matched === W.length) { info.textContent = 'Done in ' + moves + ' moves. Happy Deepavali!'; boom(); }
          } else {
            lock = true; var a = first; first = null;
            setTimeout(function () {
              a.classList.remove('up'); b.classList.remove('up');
              a.setAttribute('aria-label', 'Hidden tile'); b.setAttribute('aria-label', 'Hidden tile'); lock = false;
            }, 850);
          }
        });
        grid.appendChild(b);
      });
    }
    $('#mm-new').addEventListener('click', newGame); newGame();
  })();

  /* ---------- lights off ---------- */
  (function () {
    var btn = $('#lights'); if (!btn) return;
    var veil = document.createElement('div'); veil.className = 'veil'; veil.setAttribute('aria-hidden', 'true'); document.body.appendChild(veil);
    function pos(x, y) { veil.style.setProperty('--mx', x + 'px'); veil.style.setProperty('--my', y + 'px'); }
    pos(innerWidth / 2, innerHeight / 2);
    document.addEventListener('pointermove', function (e) { pos(e.clientX, e.clientY); });
    document.addEventListener('pointerdown', function (e) { pos(e.clientX, e.clientY); });
    btn.addEventListener('click', function () {
      var off = document.documentElement.classList.toggle('dark-room');
      btn.setAttribute('aria-pressed', off ? 'true' : 'false'); btn.textContent = off ? 'Lights off' : 'Lights on';
    });
  })();

  /* ---------- cards: greeting and invitation ---------- */
  var LANG = [['English', 'Happy Deepavali'], ['தமிழ்', 'தீபாவளி நல்வாழ்த்துகள்'], ['हिन्दी', 'शुभ दीपावली'], ['తెలుగు', 'దీపావళి శుభాకాంక్షలు']];
  var LOOKS = [['Night', '--color-crimson', '--color-paper-3'], ['Peacock', '--color-peacock', '--color-peacock-deep'], ['Rose', '--color-magenta', '--color-paper-3']];
  function lookCard(card, i) {
    card.style.setProperty('--cf', 'var(' + LOOKS[i][1] + ')');
    card.style.setProperty('--ct', 'var(' + LOOKS[i][2] + ')');
  }
  function drawCard(o) {
    var fam = v('--font-display') || 'serif', body = v('--font-body') || 'sans-serif', L = LOOKS[o.look];
    return document.fonts.load('500 60px ' + fam, o.head + (o.name || '')).catch(function () {}).then(function () {
      var cw = 1080, ch = 1350, c = document.createElement('canvas'); c.width = cw; c.height = ch;
      var g = c.getContext('2d');
      g.fillStyle = v(L[2]); g.fillRect(0, 0, cw, ch);
      var rg = g.createRadialGradient(cw / 2, ch, 40, cw / 2, ch, ch * 0.95);
      rg.addColorStop(0, v(L[1])); rg.addColorStop(1, v(L[2]));
      g.globalAlpha = 0.75; g.fillStyle = rg; g.fillRect(0, 0, cw, ch); g.globalAlpha = 1;
      var gl = g.createRadialGradient(cw / 2, 400, 10, cw / 2, 400, 520);
      gl.addColorStop(0, v('--color-flame')); gl.addColorStop(1, v(L[2]));
      g.globalAlpha = 0.32; g.fillStyle = gl; g.fillRect(0, 0, cw, ch); g.globalAlpha = 1;
      var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      for (var i = 0; i < 70; i++) {
        g.globalAlpha = 0.25 + rnd() * 0.6; g.fillStyle = [v('--color-accent'), v('--color-accent-hi'), v('--color-flame-core')][i % 3];
        g.beginPath(); g.arc(rnd() * cw, rnd() * ch, 1.5 + rnd() * 3, 0, 6.283); g.fill();
      }
      g.globalAlpha = 1;
      var P = {
        oil: new Path2D('M16 72 C36 80 84 80 104 72 C100 78 84 84 60 84 C36 84 20 78 16 72Z'),
        wick: new Path2D('M57 66 h6 v12 h-6Z'),
        bowl: new Path2D('M6 70 C20 74 40 80 60 80 C80 80 100 74 114 70 C112 100 88 122 60 122 C32 122 8 100 6 70Z'),
        rim: new Path2D('M6 70 C20 74 40 80 60 80 C80 80 100 74 114 70 C100 68 80 74 60 74 C40 74 20 68 6 70Z'),
        fo: new Path2D('M60 8 C74 30 80 46 60 70 C40 46 46 30 60 8Z'),
        fi: new Path2D('M60 32 C67 44 69 54 60 68 C51 54 53 44 60 32Z')
      };
      [-1, 0, 1].forEach(function (k) {
        g.save(); g.translate(cw / 2 + k * 290 - 100, 270); g.scale(200 / 120, 200 / 120);
        g.fillStyle = v('--color-clay-deep'); g.fill(P.oil);
        g.fillStyle = v('--color-ink-2'); g.fill(P.wick);
        g.fillStyle = v('--color-clay'); g.fill(P.bowl);
        g.fillStyle = v('--color-clay-hi'); g.fill(P.rim);
        g.shadowColor = v('--color-flame'); g.shadowBlur = 40;
        g.fillStyle = v('--color-flame'); g.fill(P.fo);
        g.shadowBlur = 0; g.fillStyle = v('--color-flame-core'); g.fill(P.fi);
        g.restore();
      });
      function fit(t, size, maxW, weight) { g.font = (weight || '500') + ' ' + size + 'px ' + fam; while (g.measureText(t).width > maxW && size > 36) { size -= 4; g.font = (weight || '500') + ' ' + size + 'px ' + fam; } return size; }
      g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      g.fillStyle = v('--color-ink'); fit(o.head, 130, 940); g.fillText(o.head, cw / 2, 700);
      var y = 800;
      if (o.name) { g.fillStyle = v('--color-accent'); fit(o.name, 130, 940); y = 860; g.fillText(o.name, cw / 2, y); y += 100; }
      g.fillStyle = v('--color-ink-2');
      (o.lines || []).forEach(function (ln) {
        var s = 46; g.font = '400 ' + s + 'px ' + body;
        while (g.measureText(ln).width > 940 && s > 26) { s -= 2; g.font = '400 ' + s + 'px ' + body; }
        g.fillText(ln, cw / 2, y); y += 66;
      });
      g.fillStyle = v('--color-muted'); g.font = '400 32px ' + body; g.fillText('Happy Deepavali', cw / 2, 1270);
      return new Promise(function (res) { c.toBlob(res, 'image/png'); });
    });
  }
  function shareImage(blob, text, noteEl) {
    var f = new File([blob], 'deepavali-card.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [f] })) return navigator.share({ files: [f], text: text }).catch(function () {});
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
    noteEl.textContent = 'WhatsApp opened with your words. Use Download to attach the picture.';
  }

  (function () {
    var who = $('#who'), msg = $('#msg'), card = $('#gcard'), note = $('#copied'); if (!who) return;
    var lang = 0, look = 0;
    function head() { var n = who.value.trim(); return LANG[lang][1] + (n ? ', ' + n : ''); }
    function full() { return head() + '! May your home glow all year.'; }
    function sync() { msg.textContent = head(); lookCard(card, look); }
    segment($('#g-lang'), LANG.map(function (l) { return l[0]; }), 0, function (i) { lang = i; sync(); });
    segment($('#g-look'), LOOKS.map(function (l) { return l[0]; }), 0, function (i) { look = i; sync(); });
    who.addEventListener('input', sync); sync();
    function opts() {
      var n = who.value.trim();
      return { head: LANG[lang][1], name: n, lines: ['May your home glow all year.'], look: look };
    }
    $('#copy').addEventListener('click', function () {
      var done = function () { note.textContent = 'Copied. Paste it into a message.'; };
      if (navigator.clipboard) navigator.clipboard.writeText(full()).then(done, done); else done();
    });
    $('#dl').addEventListener('click', function () { drawCard(opts()).then(function (b) { saveBlob(b, 'deepavali-card.png'); note.textContent = 'Card saved as a picture.'; }); });
    $('#wa').addEventListener('click', function () { drawCard(opts()).then(function (b) { shareImage(b, full(), note); }); });
  })();

  (function () {
    var from = $('#iv-from'), when = $('#iv-when'), where = $('#iv-where'), card = $('#icard'), note = $('#inote'); if (!from) return;
    var look = 0;
    function put(id, label, val) { var el = $(id); el.textContent = val ? label + ': ' + val : ''; el.hidden = !val; }
    function sync() {
      put('#ip-when', 'When', when.value.trim()); put('#ip-where', 'Where', where.value.trim()); put('#ip-from', 'From', from.value.trim());
      lookCard(card, look);
    }
    segment($('#i-look'), LOOKS.map(function (l) { return l[0]; }), 0, function (i) { look = i; sync(); });
    [from, when, where].forEach(function (el) { el.addEventListener('input', sync); });
    sync();
    function lines() {
      var a = [];
      if (when.value.trim()) a.push('When: ' + when.value.trim());
      if (where.value.trim()) a.push('Where: ' + where.value.trim());
      if (from.value.trim()) a.push('From: ' + from.value.trim());
      return a;
    }
    function opts() { return { head: 'You are invited', name: 'Deepavali open house', lines: lines(), look: look }; }
    function text() { return ['You are invited to our Deepavali open house.'].concat(lines()).join('\n'); }
    $('#idl').addEventListener('click', function () { drawCard(opts()).then(function (b) { saveBlob(b, 'deepavali-invitation.png'); note.textContent = 'Invitation saved as a picture.'; }); });
    $('#iwa').addEventListener('click', function () { drawCard(opts()).then(function (b) { shareImage(b, text(), note); }); });
  })();

  /* ---------- tour ---------- */
  (function () {
    var box = $('#tour'); if (!box) return;
    var steps = [
      ['#diyas', 'Tap the lamps to light them. Light all five for fireworks.'],
      ['#surprise', 'Surprise me starts a 30 second fireworks show.'],
      ['.dock', 'Sound and lights-off mode live here.'],
      ['#create', 'Make your own diya and paint a rangoli.'],
      ['#greeting', 'Send a card in four languages, or invite people home.']
    ];
    var at = -1, hi = null;
    function clear() { if (hi) hi.classList.remove('tour-hi'); hi = null; }
    function go(n) {
      clear(); at = n;
      if (at >= steps.length) { box.hidden = true; store('dv-tour', 'done'); return; }
      var el = $(steps[at][0]); if (!el) { go(at + 1); return; }
      hi = el; el.classList.add('tour-hi');
      if (!el.matches('.dock, #surprise')) el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
      $('#tour-t').textContent = (at + 1) + ' of ' + steps.length + '. ' + steps[at][1];
      $('#tour-next').textContent = at === steps.length - 1 ? 'Done' : 'Next';
      box.hidden = false;
    }
    $('#tour-next').addEventListener('click', function () { go(at + 1); });
    $('#tour-skip').addEventListener('click', function () { clear(); box.hidden = true; store('dv-tour', 'done'); });
    $('#tour-start').addEventListener('click', function () { go(0); });
    if (store('dv-tour') !== 'done') setTimeout(function () { if (box.hidden && scrollY < innerHeight) go(0); }, 5000);
  })();

  /* ---------- install as an app ---------- */
  (function () {
    var btn = $('#install'), deferred = null;
    addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; if (btn) btn.hidden = false; });
    if (btn) btn.addEventListener('click', function () { if (deferred) { deferred.prompt(); deferred = null; btn.hidden = true; } });
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  })();
})();
