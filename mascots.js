(function () {
  'use strict';

  var sprites = window.PIXEL_SPRITES;
  if (!sprites) return;

  var W = sprites.width, H = sprites.height;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktop = window.matchMedia('(min-width: 701px)');
  var names = { beaver: 'CASTOR', ghost: 'FANTOM', cheese: 'Cheesefill', lol: 'LoL, Library of Layers' };
  var quotes = {
    beaver: 'One regime at a time, I build the causal picture.',
    ghost: 'Boo! Follow the flow. Find the causes.',
    cheese: 'Holes in the data? There’s still a story to uncover.',
    lol: 'Same layers. A different path for every problem.'
  };

  function fit(canvas, scale, width, height) {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * scale * dpr);
    canvas.height = Math.round(height * scale * dpr);
    canvas.style.width = (width * scale) + 'px';
    canvas.style.height = (height * scale) + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    ctx.imageSmoothingEnabled = false;
    return ctx;
  }

  function paint(ctx, grid, palette, width, height) {
    ctx.clearRect(0, 0, width, height);
    grid.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        var color = palette[row[x]];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    });
  }

  var logo = document.getElementById('logoCanvas');
  if (logo) {
    var accent = getComputedStyle(document.documentElement).getPropertyValue('--olive').trim();
    paint(fit(logo, 2, 11, 7), [
      '.###..####.', '#...#.#...#', '#...#.#...#', '#####.####.',
      '#...#.#..#.', '#...#.#...#', '#...#.#...#'
    ], { '#': accent }, 11, 7);
  }

  function paintPreviews() {
    document.querySelectorAll('[data-sprite]').forEach(function (canvas) {
      var kind = canvas.dataset.sprite;
      var grid = kind === 'me' ? sprites.me.waveA : sprites[kind];
      paint(fit(canvas, Number(canvas.dataset.scale) || 3, W, H), grid, sprites.palette, W, H);
    });
  }
  paintPreviews();

  var box = document.getElementById('mascot');
  var meCanvas = document.getElementById('meCanvas');
  var buddyCanvas = document.getElementById('buddyCanvas');
  var bubble = document.getElementById('bubble');
  var quote = document.getElementById('companion-quote');
  var credit = document.getElementById('companion-credit');
  var ctx = fit(meCanvas, 3, W, H);
  var buddyCtx = fit(buddyCanvas, 3, W, H);
  var activeKind = null, activeTrigger = null, bubbleTimer = 0;
  var x = 80, direction = 1, lastTime = performance.now(), walkUntil = 0;
  var waveUntil = lastTime + 4200, animationId = 0;

  function place(bob) {
    x = Math.max(72, Math.min(x, window.innerWidth - 300));
    box.style.transform = 'translate(' + Math.round(x) + 'px,' + (-bob) + 'px)';
  }
  function hush() {
    window.clearTimeout(bubbleTimer);
    box.classList.remove('talking');
  }
  function say(text, duration) {
    window.clearTimeout(bubbleTimer);
    bubble.textContent = text;
    box.classList.add('talking');
    place(0);
    if (duration) bubbleTimer = window.setTimeout(hush, duration);
  }
  function introduce(kind, trigger) {
    activeKind = kind;
    activeTrigger = trigger;
    box.classList.add('has-buddy');
    paint(buddyCtx, sprites[kind], sprites.palette, W, H);
    say(names[kind] + ': “' + quotes[kind] + '”');
    quote.textContent = '“' + quotes[kind] + '”';
    credit.textContent = '— ' + names[kind];
    document.querySelectorAll('.companion').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.mascot === kind));
    });
    paint(ctx, sprites.me.idle, sprites.palette, W, H);
  }
  function dismiss(trigger) {
    if (activeTrigger !== trigger) return;
    activeKind = null;
    activeTrigger = null;
    box.classList.remove('has-buddy');
    hush();
  }

  document.querySelectorAll('[data-mascot]').forEach(function (trigger) {
    var kind = trigger.dataset.mascot;
    if (!quotes[kind]) return;
    if (trigger.tagName !== 'BUTTON') {
      trigger.tabIndex = 0;
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-label', 'Meet ' + names[kind]);
      trigger.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          introduce(kind, trigger);
        }
      });
    }
    trigger.addEventListener('pointerenter', function (event) {
      if (event.pointerType !== 'touch') introduce(kind, trigger);
    });
    trigger.addEventListener('pointerleave', function () {
      if (document.activeElement !== trigger) dismiss(trigger);
    });
    trigger.addEventListener('focus', function () { introduce(kind, trigger); });
    trigger.addEventListener('blur', function () { dismiss(trigger); });
    trigger.addEventListener('click', function () { introduce(kind, trigger); });
    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') dismiss(trigger);
    });
  });

  function loop(now) {
    var dt = Math.min(now - lastTime, 60);
    lastTime = now;
    var moving = now < walkUntil && !activeKind && !box.classList.contains('talking');
    var grid = sprites.me.idle;
    var bob = 0;
    if (!activeKind && now < waveUntil) {
      grid = Math.floor(now / 300) % 2 ? sprites.me.waveA : sprites.me.waveB;
    } else if (moving) {
      x += direction * 0.035 * dt;
      if (x >= window.innerWidth - 300) direction = -1;
      if (x <= 72) direction = 1;
      var frame = Math.floor(now / 170) % 4;
      grid = frame === 1 ? sprites.me.walkA : frame === 3 ? sprites.me.walkB : sprites.me.idle;
      bob = frame % 2;
    } else if (now % 4800 > 4600) {
      grid = sprites.me.blink;
    }
    paint(ctx, grid, sprites.palette, W, H);
    place(bob);
    animationId = window.requestAnimationFrame(loop);
  }
  function updateAnimation() {
    window.cancelAnimationFrame(animationId);
    lastTime = performance.now();
    paint(ctx, sprites.me.idle, sprites.palette, W, H);
    place(0);
    if (!reducedMotion.matches && desktop.matches && !document.hidden) {
      animationId = window.requestAnimationFrame(loop);
    }
  }
  window.addEventListener('scroll', function () { walkUntil = performance.now() + 2600; }, { passive: true });
  window.addEventListener('resize', function () {
    paintPreviews();
    ctx = fit(meCanvas, 3, W, H);
    buddyCtx = fit(buddyCanvas, 3, W, H);
    if (activeKind) paint(buddyCtx, sprites[activeKind], sprites.palette, W, H);
    updateAnimation();
  });
  reducedMotion.addEventListener('change', updateAnimation);
  desktop.addEventListener('change', updateAnimation);
  document.addEventListener('visibilitychange', updateAnimation);

  var about = document.getElementById('about');
  if (about) {
    var told = false;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !told && !activeKind) {
          told = true;
          say('EPFL researcher, DeepMind explorer. Meet my research companions!', 6500);
        }
      });
    }, { threshold: 0.2 }).observe(about);
  }
  say('Hi! I’m Abdellah. Welcome to my little corner of research.', 4200);
  updateAnimation();
})();
