(function () {
  var buttons = document.querySelectorAll('.row button');
  var glow = document.getElementById('glow');
  var status = document.getElementById('status');
  var lines = ['', 'One light is enough to start.', 'Two. The shadows are backing off.', 'Three. You can see the room now.', 'Four. Almost everyone is here.', 'All five. The room is bright. Happy Deepavali.'];
  function update() {
    var n = 0;
    buttons.forEach(function (b) {
      var on = b.getAttribute('aria-pressed') === 'true';
      if (on) n++;
      b.querySelector('.flame').classList.toggle('on', on);
      b.querySelector('.state').textContent = on ? 'Lit' : 'Unlit';
    });
    glow.style.opacity = n / 5;
    status.textContent = lines[n];
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      update();
    });
  });


  // whole-page fireworks: embers, rockets, cursor sparkler, scroll bursts, footer fountain
  var cv = document.getElementById('fx'), cx = cv.getContext('2d');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cs = getComputedStyle(document.documentElement);
  var pal = ['--color-accent','--color-accent-hi','--color-crimson','--color-magenta','--color-flame','--color-flame-core'].map(function (v) { return cs.getPropertyValue(v).trim(); });
  var gold = pal[0], warm = pal[4];
  var parts = [], rockets = [], running = false, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var finaleUntil = 0, mega = false, megaEnd = 0, megaTimer = null, W = innerWidth, H = innerHeight, fountain = false, mouse = null, lastSpark = 0;
  function size() { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); addEventListener('resize', size);

  // sound: synthesised firecracker audio (whistle, boom, crackle), no files
  var audio = null, soundOn = true, lastBoom = 0, noiseBuf = null;
  try { soundOn = localStorage.getItem('dv-sound') !== 'off'; } catch (e) {}
  function ac() {
    if (audio) return audio;
    var C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
    audio = new C(); var m = audio.createGain(); m.gain.value = 0.55; m.connect(audio.destination); audio.master = m;
    noiseBuf = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
    var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return audio;
  }
  function ready() { var a = soundOn && !calm && audio; if (a && a.state === 'suspended') a.resume(); return a && a.state !== 'closed' ? a : null; }
  function noise(a, t, dur, type, freq, gain) {
    var s = a.createBufferSource(); s.buffer = noiseBuf; s.playbackRate.value = 0.7 + Math.random() * 0.6;
    var f = a.createBiquadFilter(); f.type = type; f.frequency.value = freq;
    var g = a.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(a.master); s.start(t); s.stop(t + dur + 0.05);
  }
  var sfx = {
    whistle: function () {
      var a = ready(); if (!a) return; var t = a.currentTime;
      var o = a.createOscillator(), g = a.createGain(); o.type = 'sine';
      o.frequency.setValueAtTime(380 + Math.random() * 120, t); o.frequency.exponentialRampToValueAtTime(1500, t + 0.75);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
      o.connect(g); g.connect(a.master); o.start(t); o.stop(t + 0.85);
    },
    boom: function (v, crackle) {
      var a = ready(); if (!a) return; var now = performance.now(); if (now - lastBoom < 70) return; lastBoom = now;
      var t = a.currentTime, vol = v || 1;
      var o = a.createOscillator(), g = a.createGain(); o.type = 'sine';
      o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(32, t + 0.45);
      g.gain.setValueAtTime(0.9 * vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      o.connect(g); g.connect(a.master); o.start(t); o.stop(t + 0.6);
      noise(a, t, 0.7, 'lowpass', 900, 0.8 * vol);
    },
    bomb: function () {
      var a = ready(); if (!a) return; var t = a.currentTime;
      var cr = a.createBufferSource(); cr.buffer = noiseBuf;
      var cf = a.createBiquadFilter(); cf.type = 'highpass'; cf.frequency.value = 1400;
      var cg = a.createGain(); cg.gain.setValueAtTime(0.9, t); cg.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      cr.connect(cf); cf.connect(cg); cg.connect(a.master); cr.start(t); cr.stop(t + 0.2);
      [0, 0.3, 0.62].forEach(function (d, n) {
        var k = [1, 0.45, 0.22][n], tt = t + d;
        var o = a.createOscillator(), og = a.createGain(); o.type = 'sine';
        o.frequency.setValueAtTime(95, tt); o.frequency.exponentialRampToValueAtTime(20, tt + 1.5);
        og.gain.setValueAtTime(1.1 * k, tt); og.gain.exponentialRampToValueAtTime(0.001, tt + 1.6);
        o.connect(og); og.connect(a.master); o.start(tt); o.stop(tt + 1.7);
        var s = a.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
        var f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(1400, tt); f.frequency.exponentialRampToValueAtTime(70, tt + 2.2);
        var ng = a.createGain(); ng.gain.setValueAtTime(1.0 * k, tt); ng.gain.exponentialRampToValueAtTime(0.001, tt + 2.3);
        s.connect(f); f.connect(ng); ng.connect(a.master); s.start(tt); s.stop(tt + 2.4);
      });
    },
    pop: function () { var a = ready(); if (!a) return; noise(a, a.currentTime, 0.06, 'bandpass', 2200, 0.35); }
  };
  var snd = document.getElementById('sound');
  if (!calm) {
    snd.hidden = false;
    var syncSnd = function () { snd.textContent = soundOn ? 'Sound on' : 'Sound off'; snd.setAttribute('aria-pressed', soundOn ? 'true' : 'false'); };
    syncSnd();
    snd.addEventListener('click', function () {
      soundOn = !soundOn; ac(); syncSnd();
      try { localStorage.setItem('dv-sound', soundOn ? 'on' : 'off'); } catch (e) {}
      if (soundOn) sfx.boom(0.5);
    });
    // browsers only allow audio after a first tap or key press
    var unlock = function () { ac(); ready(); };
    addEventListener('pointerdown', unlock, { once: true }); addEventListener('keydown', unlock, { once: true });
  }

  function pick() { return pal[Math.floor(Math.random() * pal.length)]; }
  function spark(x, y, vx, vy, life, col, g, r) { parts.push({ x: x, y: y, vx: vx, vy: vy, life: life, max: life, col: col, g: g == null ? 0.06 : g, r: r || 2 }); }
  function burst(x, y, n, speed, life, kind) {
    var col = pick(), col2 = pick(); kind = kind || 'sphere';
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.283, s = speed * (0.35 + Math.random() * 0.65), g = 0.06, l = life, c = Math.random() < 0.3 ? col2 : col;
      if (kind === 'ring') { a = (6.283 / n) * i; s = speed; }
      if (kind === 'willow') { s = speed * 0.7 * (0.4 + Math.random() * 0.6); g = 0.035; l = life * 1.7; c = gold; }
      spark(x, y, Math.cos(a) * s, Math.sin(a) * s, l, c, g);
    }
    go();
  }
  function launch(tx, ty, fromX) {
    var x0 = fromX == null ? tx + (Math.random() - 0.5) * 160 : fromX, T = 46 + Math.random() * 14;
    sfx.whistle();
    rockets.push({ x: x0, y: H + 10, vx: (tx - x0) / T, vy: (ty - H - 10) / T, t: T });
    go();
  }
  function explode(x, y) {
    if (bombPending) { bombPending = false; detonate(x, y); return; }
    var k = ['sphere', 'ring', 'willow'][Math.floor(Math.random() * 3)];
    sfx.boom(mega ? 0.55 : 1, Date.now() < finaleUntil);
    burst(x, y, k === 'ring' ? 46 : 90, k === 'ring' ? 4.6 : 6, 70, k);
    for (var i = 0; i < 6; i++) { (function () { setTimeout(function () { spark(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 60, 0, 0, 10, pal[5], 0, 3); go(); }, 160 + Math.random() * 260); })(); }
  }
  var quietUntil = 0;
  function writeText() {
    var lines = W < 700 ? ['Happy', 'Deepavali'] : ['Happy Deepavali'];
    var fam = cs.getPropertyValue('--font-display').trim() || 'serif';
    var fs = Math.min(W * 0.92 / (W < 700 ? 4.6 : 7.4), 170);
    var oc = document.createElement('canvas'); oc.width = W; oc.height = Math.ceil(fs * 1.25 * lines.length);
    var o = oc.getContext('2d'); o.fillStyle = '#fff'; o.textAlign = 'center'; o.textBaseline = 'middle'; o.font = '500 ' + fs + 'px ' + fam;
    lines.forEach(function (ln, i) { o.fillText(ln, W / 2, fs * 0.65 + i * fs * 1.2); });
    var data = o.getImageData(0, 0, oc.width, oc.height).data, pts = [], step = Math.max(4, Math.round(fs / 30));
    for (var y = 0; y < oc.height; y += step) for (var x = 0; x < oc.width; x += step) if (data[(y * oc.width + x) * 4 + 3] > 128) pts.push([x, y]);
    var top = Math.max(90, H * 0.3 - oc.height / 2), cxp = W / 2, cyp = top + oc.height / 2, cols = [pal[0], pal[1], pal[5], pal[0], pal[4]];
    quietUntil = Date.now() + 3300;
    sfx.boom(1, true);
    pts.forEach(function (p) {
      var life = 165 + Math.random() * 20;
      parts.push({ x: cxp + (Math.random() - 0.5) * 20, y: cyp + (Math.random() - 0.5) * 20, hx: p[0] + (Math.random() - 0.5) * 1.5, hy: top + p[1] + (Math.random() - 0.5) * 1.5, ease: 0.05 + Math.random() * 0.04, vx: 0, vy: 0, g: 0, life: life, max: life, col: cols[Math.floor(Math.random() * cols.length)], r: 1.5 + Math.random() * 1.2, ph: Math.random() * 6 });
    });
    go();
  }
  // bomb cracker: one huge low explosion, shake and flash
  var flash = document.createElement('div'); flash.className = 'flash'; flash.setAttribute('aria-hidden', 'true'); document.body.appendChild(flash);
  var bombPending = false;
  function bomb() {
    if (bombPending) return;
    bombPending = true;
    launch(W * (0.3 + Math.random() * 0.4), H * (0.25 + Math.random() * 0.2), W * 0.5);
  }
  function detonate(bx, by) {
    sfx.bomb();
    burst(bx, by, 260, 11, 95); burst(bx, by, 60, 15, 80, 'ring'); burst(bx, by, 120, 8, 120, 'willow');
    flash.animate([{ opacity: 0.55 }, { opacity: 0 }], { duration: 650, easing: 'ease-out' });
    document.querySelector('main').animate([
      { transform: 'translate(0,0)' }, { transform: 'translate(-9px,5px)' }, { transform: 'translate(8px,-6px)' },
      { transform: 'translate(-6px,-4px)' }, { transform: 'translate(4px,3px)' }, { transform: 'translate(0,0)' }
    ], { duration: 520, easing: 'ease-out' });
  }
  function go() { if (!running) { running = true; requestAnimationFrame(tick); } }
  function tick() {
    cx.clearRect(0, 0, W, H);
    cx.globalCompositeOperation = 'lighter';
    // ambient embers rising all over the page
    if (!document.hidden && Math.random() < 0.32) spark(Math.random() * W, H + 6, (Math.random() - 0.5) * 0.5, -(0.7 + Math.random() * 1.2), 260 + Math.random() * 160, Math.random() < 0.5 ? warm : gold, -0.0008, 1 + Math.random() * 1.4);
    if (fountain || (mega && Date.now() > quietUntil)) {
      // six straight-up fountains across the bottom, every spark its own colour
      [0.06, 0.22, 0.38, 0.62, 0.78, 0.94].forEach(function (px) {
        for (var f = 0; f < 4; f++) {
          var sp = 14 + Math.random() * 6, sway = (Math.random() - 0.5) * 0.7;
          spark(W * px, H, sway * sp * 0.3, -sp, 100 + Math.random() * 35, pick(), 0.17, 1.2 + Math.random() * 1.6);
        }
      });
    }
    // side fountains on the left and right edges, only while the top of the page is in view
    if (!document.hidden && window.scrollY < H * 0.5) {
      [0, 1].forEach(function (s) {
        for (var q = 0; q < 2; q++) {
          var v = 13 + Math.random() * 5, ang = 1.32 + (Math.random() - 0.5) * 0.3;
          spark(s ? W * 0.97 : W * 0.03, H, (s ? -1 : 1) * Math.cos(ang) * v, -Math.sin(ang) * v, 105 + Math.random() * 30, pick(), 0.17, 1.2 + Math.random() * 1.5);
        }
      });
    }
    if (mega) {
      if (Date.now() > quietUntil && Math.random() < 0.14) launch(W * (0.05 + Math.random() * 0.9), H * (0.08 + Math.random() * 0.5));
      if (Date.now() > quietUntil && Math.random() < 0.025) sfx.boom(0.5), burst(W * (0.1 + Math.random() * 0.8), H * (0.1 + Math.random() * 0.45), 170, 7.5, 80, ['sphere', 'ring', 'willow'][Math.floor(Math.random() * 3)]);
    }
    rockets = rockets.filter(function (r) {
      r.x += r.vx; r.y += r.vy; r.t--;
      spark(r.x, r.y, (Math.random() - 0.5) * 0.6, 0.8 + Math.random(), 22, pal[4], 0.02, 1.6);
      if (r.t <= 0) { explode(r.x, r.y); return false; }
      return true;
    });
    parts = parts.filter(function (p) { return p.life > 0; });
    parts.forEach(function (p) {
      if (p.hx !== undefined) {
        p.x += (p.hx - p.x) * p.ease; p.y += (p.hy - p.y) * p.ease; p.life--;
        cx.globalAlpha = Math.max(Math.min(p.life / 40, 1), 0) * (0.78 + 0.22 * Math.sin(p.life * 0.35 + p.ph));
      } else {
      p.vy += p.g; p.vx *= 0.986; p.vy *= 0.986; p.x += p.vx; p.y += p.vy; p.life--;
      var t = p.life / p.max;
      cx.globalAlpha = Math.max(t, 0) * (p.g < 0 ? 0.55 + 0.45 * Math.sin(p.life * 0.3) : 1);
      }
      cx.fillStyle = p.col;
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill();
    });
    cx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  function fireworks() {
    for (var i = 0; i < 8; i++) (function (i) { setTimeout(function () { launch(W * (0.12 + Math.random() * 0.76), H * (0.12 + Math.random() * 0.4)); }, i * 420); })(i);
  }
  var bombBtn = document.getElementById('bomb');
  if (calm) bombBtn.hidden = true; else bombBtn.addEventListener('click', bomb);
  document.getElementById('boom').addEventListener('click', function () { if (!calm) fireworks(); });
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      if (calm || b.getAttribute('aria-pressed') !== 'true') return;
      var r = b.querySelector('svg').getBoundingClientRect();
      sfx.pop(); burst(r.left + r.width / 2, r.top + r.height * 0.2, 22, 2.6, 40);
      if (document.querySelectorAll('.row button[aria-pressed="true"]').length === 5) fireworks();
    });
  });
  if (!calm) {
    go();
    // a rocket every few seconds, unprompted
    (function auto() { setTimeout(function () { if (!document.hidden && Date.now() > quietUntil) launch(W * (0.1 + Math.random() * 0.8), H * (0.1 + Math.random() * 0.35)); auto(); }, 3500 + Math.random() * 3500); })();
    // click or tap anywhere to send a rocket there
    document.addEventListener('pointerdown', function (e) {
      if (e.target.closest('a, button, input, label')) return;
      launch(e.clientX, e.clientY);
    });
    // cursor sparkler
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var now = performance.now(); if (now - lastSpark < 16) return; lastSpark = now;
      for (var i = 0; i < 2; i++) spark(e.clientX, e.clientY, (Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 2.2 - 0.4, 26, Math.random() < 0.5 ? pal[1] : pal[5], 0.07, 1.5);
    });
    // a burst the first time each section arrives
    if ('IntersectionObserver' in window) {
      var seen = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { seen.unobserve(en.target); sfx.boom(0.6); var r = en.target.querySelector('h2').getBoundingClientRect(); burst(Math.min(r.left + 120, W - 60), Math.max(r.top, 80), 60, 4.2, 55); } });
      }, { threshold: 0.45 });
      document.querySelectorAll('.band').forEach(function (s) { seen.observe(s); });
      var foot = new IntersectionObserver(function (es) { fountain = es[0].isIntersecting; }, { threshold: 0.3 });
      foot.observe(document.querySelector('.footer'));
    }
  }

  // surprise: a 30 second mega show with a countdown, stop and restart any time
  var sb = document.getElementById('surprise');
  var MEGA_MS = 30000;
  function finale(n) { for (var i = 0; i < n; i++) (function (i) { setTimeout(function () { launch(W * (0.08 + (i / n) * 0.84), H * (0.1 + Math.random() * 0.3)); }, i * 140); })(i); }
  function megaStop(done) {
    mega = false; clearInterval(megaTimer);
    sb.textContent = 'Surprise me'; sb.setAttribute('aria-pressed', 'false');
    if (done) { finaleUntil = Date.now() + 4500; finale(9); }
  }
  function megaTick() {
    var left = Math.ceil((megaEnd - Date.now()) / 1000);
    if (left <= 0) { megaStop(true); return; }
    sb.textContent = 'Stop (' + left + 's)';
    if (left % 6 === 0 && Date.now() > quietUntil) finale(5);
  }
  if (!calm) {
    sb.hidden = false;
    sb.addEventListener('click', function () {
      if (mega) { megaStop(false); return; }
      mega = true; megaEnd = Date.now() + MEGA_MS;
      sb.setAttribute('aria-pressed', 'true'); writeText(); setTimeout(function () { if (mega) finale(7); }, 3300); megaTick();
      megaTimer = setInterval(megaTick, 1000);
      go();
    });
  }

  // kolam: a rangoli mandala, rings of petals blooming outward from the centre
  var k = document.getElementById('kolam'), out = '';
  function petal(r0, L, w) { var r1 = r0 + L; return 'M0 ' + (-r0) + ' C' + w + ' ' + (-(r0 + L * 0.25)) + ' ' + w + ' ' + (-(r0 + L * 0.75)) + ' 0 ' + (-r1) + ' C' + (-w) + ' ' + (-(r0 + L * 0.75)) + ' ' + (-w) + ' ' + (-(r0 + L * 0.25)) + ' 0 ' + (-r0) + 'Z'; }
  function ring(n, r0, L, w, off, cols, stripe, tip, stage) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var ang = (360 / n) * i + off, c = cols[i % cols.length];
      s += '<g transform="rotate(' + ang.toFixed(2) + ')"><g class="fe" style="--i:' + (stage * 4 + i * 0.35).toFixed(2) + '">' +
        '<path class="' + c + ' ko" d="' + petal(r0, L, w) + '"/>' +
        '<path class="' + stripe + '" d="' + petal(r0 + L * 0.2, L * 0.62, w * 0.34) + '"/>' +
        (tip ? '<circle class="' + tip + '" cx="0" cy="' + (-(r0 + L) + 3.2) + '" r="1.5"/>' : '') + '</g></g>';
    }
    return s;
  }
  // soft disc behind everything, then a beaded edge hugging the petal tips
  out += '<circle class="kd" r="90"/>';
  for (var d = 0; d < 56; d++) {
    var an = d * Math.PI / 28, bx = Math.sin(an) * 93, by = -Math.cos(an) * 93, bc = ['p1', 'p2', 'pg', 'pb'][d % 4];
    out += '<circle class="' + bc + '" cx="' + bx.toFixed(1) + '" cy="' + by.toFixed(1) + '" r="' + (d % 2 ? 1.5 : 2.3) + '"/>';
  }
  out += ring(16, 41, 46, 13.5, 0, ['p2', 'p3'], 'p1', 'p4', 3);
  out += ring(16, 31, 35, 11, 11.25, ['pg', 'pb'], 'p4', '', 2);
  out += ring(16, 22, 27, 8.5, 0, ['p1', 'pf'], 'p2', '', 1);
  out += ring(8, 12, 18, 7, 22.5, ['p3', 'p4'], 'p2', '', 0);
  out += '<g class="fe" style="--i:0"><circle class="p1 ko" r="12"/><circle class="p2" r="7.4"/><circle class="p4" r="3"/></g>';
  k.innerHTML = out;
  if (!calm && 'IntersectionObserver' in window) {
    k.classList.add('wait');
    var kObs = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { k.classList.add('go'); kObs.disconnect(); } }, { threshold: 0.4 });
    kObs.observe(k);
  }

  window.DV = { fireworks: fireworks, ac: ac, calm: calm, cs: cs };
})();
