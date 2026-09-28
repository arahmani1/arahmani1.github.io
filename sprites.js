/* Hand-drawn, code-native pixel art. Every frame is a 32 × 40 transparent grid. */
(function () {
  'use strict';

  var W = 32, H = 40;
  var palette = {
    o: '#172C38', h: '#292526', H: '#4B3934', b: '#3D2B27', B: '#624233',
    s: '#CE926A', S: '#AD704F', a: '#E7AF84', e: '#24252C', w: '#FFF9EB',
    j: '#294A70', J: '#41678E', z: '#1C3554', v: '#B294CD', V: '#D1B7E8',
    p: '#3B4149', P: '#565D66', q: '#232B35', d: '#A9BEC6',
    g: '#ECFFFF', G: '#C5F0EE', c: '#88D8DD', C: '#4CABB8', i: '#326079',
    n: '#F8C64E', N: '#D68B2B', y: '#FFE48A', Y: '#E9AA33', u: '#A96B28',
    t: '#9E673F', T: '#C38953', r: '#5B392B', R: '#79482F', f: '#E0B178',
    l: '#8273CB', L: '#B6A0EC', k: '#4C4382', m: '#58BEB4', M: '#9DE1CC',
    x: '#E28A6D', X: '#F3B18A', D: '#DAE6D5'
  };

  function grid() {
    return Array.from({ length: H }, function () { return Array(W).fill('.'); });
  }
  function pixel(g, x, y, c) {
    if (x >= 0 && x < W && y >= 0 && y < H) g[y][x] = c;
  }
  function rect(g, x, y, w, h, c) {
    for (var yy = y; yy < y + h; yy++)
      for (var xx = x; xx < x + w; xx++) pixel(g, xx, yy, c);
  }
  function line(g, x0, y0, x1, y1, c) {
    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1, err = dx + dy;
    for (;;) {
      pixel(g, x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      var e2 = err * 2;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  function polygon(g, points, fill, edge) {
    for (var y = 0; y < H; y++) {
      for (var x = 0; x < W; x++) {
        var inside = false;
        for (var a = 0, b = points.length - 1; a < points.length; b = a++) {
          var pa = points[a], pb = points[b];
          if ((pa[1] > y) !== (pb[1] > y) &&
              x < (pb[0] - pa[0]) * (y - pa[1]) / (pb[1] - pa[1]) + pa[0]) inside = !inside;
        }
        if (inside) pixel(g, x, y, fill);
      }
    }
    for (var i = 0; i < points.length; i++) {
      var start = points[i], end = points[(i + 1) % points.length];
      line(g, start[0], start[1], end[0], end[1], edge || fill);
    }
  }
  function oval(g, x, y, w, h, c) {
    for (var yy = 0; yy < h; yy++) {
      for (var xx = 0; xx < w; xx++) {
        if (Math.pow((xx + 0.5 - w / 2) / (w / 2), 2) +
            Math.pow((yy + 0.5 - h / 2) / (h / 2), 2) <= 1)
          pixel(g, x + xx, y + yy, c);
      }
    }
  }
  function outlineBox(g, x, y, w, h, fill, border) {
    rect(g, x, y, w, h, border || 'o');
    rect(g, x + 1, y + 1, w - 2, h - 2, fill);
  }
  function sparkle(g, x, y, c) {
    pixel(g, x, y - 1, c); pixel(g, x - 1, y, c);
    pixel(g, x, y, 'w'); pixel(g, x + 1, y, c); pixel(g, x, y + 1, c);
  }
  function finish(g) { return g.map(function (row) { return row.join(''); }); }

  function makeMe(pose) {
    var g = grid(), waving = pose === 'waveA' || pose === 'waveB';

    // Charcoal trousers and pale-soled trainers; the feet alternate when walking.
    polygon(g, [[9, 30], [23, 30], [23, 36], [21, 38], [17, 38], [16, 33], [15, 38], [10, 38]], 'p', 'o');
    rect(g, 10, 32, 3, 5, 'P'); rect(g, 19, 32, 3, 5, 'q');
    if (pose === 'walkA') {
      rect(g, 8, 35, 6, 4, 'o'); rect(g, 9, 35, 4, 2, 'p'); rect(g, 8, 38, 6, 1, 'w');
      rect(g, 20, 34, 5, 4, 'o'); rect(g, 21, 35, 3, 2, 'p'); rect(g, 21, 38, 5, 1, 'd');
    } else if (pose === 'walkB') {
      rect(g, 11, 34, 5, 4, 'o'); rect(g, 12, 35, 3, 2, 'p'); rect(g, 10, 38, 6, 1, 'd');
      rect(g, 18, 35, 6, 4, 'o'); rect(g, 19, 35, 4, 2, 'p'); rect(g, 18, 38, 6, 1, 'w');
    } else {
      outlineBox(g, 9, 36, 7, 3, 'q'); outlineBox(g, 17, 36, 7, 3, 'q');
      rect(g, 9, 38, 7, 1, 'd'); rect(g, 17, 38, 7, 1, 'd');
      rect(g, 10, 37, 3, 1, 'w'); rect(g, 20, 37, 3, 1, 'w');
    }

    // A navy hoodie with lilac lining, ribbed cuffs and a kangaroo pocket.
    polygon(g, [[9, 20], [13, 19], [19, 19], [23, 21], [25, 28], [23, 33], [9, 33], [7, 28]], 'j', 'o');
    rect(g, 10, 23, 3, 8, 'J'); rect(g, 21, 24, 2, 8, 'z');
    rect(g, 10, 32, 12, 1, 'v');
    polygon(g, [[11, 20], [15, 21], [16, 24], [12, 23]], 'v', 'z');
    polygon(g, [[20, 20], [17, 21], [16, 24], [21, 23]], 'v', 'z');
    rect(g, 13, 29, 7, 2, 'z'); rect(g, 14, 29, 5, 1, 'j');

    // Arms are separate to preserve a recognisable greeting and walk cycle.
    polygon(g, [[8, 21], [11, 23], [9, 29], [8, 31], [4, 30], [5, 24]], 'j', 'o');
    line(g, 6, 24, 5, 28, 'J'); rect(g, 5, 29, 4, 2, 'z');
    oval(g, 4, 30, 5, 4, 'o'); rect(g, 5, 31, 3, 2, 's'); pixel(g, 5, 31, 'a');
    if (waving) {
      polygon(g, [[22, 21], [25, 22], [28, 20], [29, 15], [25, 14], [24, 18], [22, 19]], 'j', 'o');
      line(g, 25, 19, 27, 19, 'J'); rect(g, 25, 14, 4, 2, 'z');
      if (pose === 'waveA') {
        polygon(g, [[25, 14], [24, 11], [25, 9], [26, 10], [26, 7], [27, 7], [27, 9], [28, 8], [29, 8], [29, 13], [28, 15]], 's', 'o');
        rect(g, 26, 10, 3, 4, 's'); line(g, 26, 10, 26, 12, 'a');
      } else {
        polygon(g, [[25, 14], [25, 11], [26, 10], [27, 11], [28, 8], [29, 8], [29, 10], [30, 9], [31, 10], [30, 13], [28, 15]], 's', 'o');
        rect(g, 26, 11, 3, 3, 's'); pixel(g, 27, 11, 'a');
      }
    } else {
      polygon(g, [[23, 21], [26, 24], [28, 30], [24, 31], [22, 26]], 'j', 'o');
      line(g, 24, 23, 26, 28, 'J'); rect(g, 24, 29, 4, 2, 'z');
      oval(g, 24, 30, 5, 4, 'o'); rect(g, 25, 31, 3, 2, 's'); pixel(g, 25, 31, 'a');
    }

    // White conference lanyard and a small badge from the reference photograph.
    line(g, 12, 22, 15, 28, 'w'); line(g, 20, 22, 17, 28, 'w');
    outlineBox(g, 14, 27, 5, 5, 'w', 'd'); rect(g, 15, 28, 3, 1, 'j'); pixel(g, 16, 30, 'c');

    // Warm olive complexion, short wavy hair, heavy brows and a smiling beard.
    rect(g, 13, 17, 7, 4, 'o'); rect(g, 14, 18, 5, 3, 's'); rect(g, 14, 18, 5, 1, 'S');
    oval(g, 7, 8, 4, 7, 'o'); oval(g, 8, 9, 3, 5, 's'); pixel(g, 8, 11, 'S');
    oval(g, 22, 8, 4, 7, 'o'); oval(g, 22, 9, 3, 5, 's'); pixel(g, 24, 11, 'S');
    oval(g, 8, 3, 17, 17, 'o'); oval(g, 9, 5, 15, 14, 's');
    rect(g, 10, 7, 3, 6, 'a'); rect(g, 22, 9, 2, 7, 'S');
    polygon(g, [[8, 10], [7, 6], [9, 3], [12, 3], [13, 1], [17, 1], [18, 2], [21, 2], [23, 4], [24, 7], [23, 11], [22, 8], [20, 6], [17, 7], [15, 6], [12, 8], [10, 7], [10, 10]], 'h', 'h');
    rect(g, 12, 3, 3, 1, 'H'); rect(g, 17, 3, 3, 1, 'H');
    rect(g, 9, 5, 3, 1, 'H'); pixel(g, 20, 5, 'H'); pixel(g, 14, 5, 'H');
    rect(g, 11, 9, 4, 1, 'b'); rect(g, 18, 9, 4, 1, 'b');
    if (pose === 'blink') {
      rect(g, 11, 11, 3, 1, 'b'); rect(g, 19, 11, 3, 1, 'b');
    } else {
      rect(g, 12, 10, 2, 2, 'e'); rect(g, 19, 10, 2, 2, 'e');
      pixel(g, 12, 10, 'w'); pixel(g, 19, 10, 'w');
    }
    line(g, 16, 10, 15, 13, 'S'); rect(g, 16, 13, 2, 1, 'a');
    pixel(g, 10, 12, 'a'); pixel(g, 21, 12, 'a');
    polygon(g, [[9, 13], [11, 14], [13, 14], [14, 13], [18, 13], [19, 14], [22, 13], [23, 13], [22, 17], [20, 19], [13, 19], [10, 17]], 'b', 'b');
    pixel(g, 10, 14, 'B'); pixel(g, 22, 14, 'B');
    rect(g, 12, 14, 9, 2, 'e'); rect(g, 13, 14, 7, 1, 'w');
    rect(g, 14, 15, 5, 1, 'w'); rect(g, 14, 16, 5, 1, 'S');
    rect(g, 14, 18, 5, 1, 'B');
    return finish(g);
  }

  function makeGhost() {
    var g = grid();
    sparkle(g, 4, 12, 'c'); sparkle(g, 27, 7, 'G'); pixel(g, 28, 29, 'c');
    polygon(g, [[7, 18], [4, 21], [2, 26], [5, 27], [8, 24]], 'G', 'i');
    polygon(g, [[24, 18], [27, 20], [29, 25], [26, 27], [23, 24]], 'G', 'i');
    polygon(g, [[7, 31], [6, 23], [6, 16], [7, 12], [10, 9], [14, 7], [19, 7], [23, 9], [25, 13], [25, 24], [26, 31], [24, 35], [21, 33], [18, 36], [15, 33], [12, 35], [10, 32], [7, 34]], 'G', 'i');
    polygon(g, [[9, 29], [8, 18], [9, 13], [12, 10], [17, 9], [21, 10], [23, 14], [23, 25], [22, 31], [20, 30], [18, 33], [15, 30], [12, 32]], 'g', 'g');
    line(g, 24, 17, 24, 29, 'c'); pixel(g, 23, 31, 'c');
    rect(g, 10, 12, 2, 3, 'w'); rect(g, 12, 10, 4, 1, 'w');
    oval(g, 10, 17, 4, 6, 'i'); oval(g, 19, 17, 4, 6, 'i');
    rect(g, 11, 18, 2, 2, 'w'); rect(g, 20, 18, 2, 2, 'w');
    pixel(g, 12, 21, 'o'); pixel(g, 21, 21, 'o');
    rect(g, 8, 23, 3, 1, 'c'); rect(g, 22, 23, 3, 1, 'c');
    polygon(g, [[14, 24], [19, 24], [18, 27], [15, 27]], 'i', 'i');
    rect(g, 15, 26, 3, 1, 'c');
    return finish(g);
  }

  function makeBeaver() {
    var g = grid();
    // A broad paddle tail with a diagonal scale pattern.
    polygon(g, [[23, 26], [25, 21], [28, 20], [30, 22], [31, 27], [29, 32], [25, 34], [21, 32]], 'R', 'r');
    line(g, 26, 23, 30, 27, 't'); line(g, 24, 27, 28, 31, 't');
    line(g, 28, 23, 24, 29, 'r'); line(g, 30, 26, 26, 32, 'r');
    oval(g, 5, 17, 21, 19, 'o'); oval(g, 6, 18, 19, 17, 't');
    oval(g, 10, 22, 12, 12, 'T'); oval(g, 12, 24, 8, 8, 'f');
    outlineBox(g, 6, 34, 8, 4, 'R'); outlineBox(g, 18, 34, 8, 4, 'R');
    rect(g, 7, 35, 5, 1, 'T'); rect(g, 19, 35, 5, 1, 'T');
    pixel(g, 9, 37, 't'); pixel(g, 11, 37, 't'); pixel(g, 21, 37, 't'); pixel(g, 23, 37, 't');
    oval(g, 5, 7, 7, 8, 'o'); oval(g, 6, 8, 5, 6, 't'); oval(g, 7, 9, 3, 3, 'R');
    oval(g, 20, 7, 7, 8, 'o'); oval(g, 21, 8, 5, 6, 't'); oval(g, 22, 9, 3, 3, 'R');
    oval(g, 5, 10, 22, 16, 'o'); oval(g, 6, 11, 20, 14, 't');
    oval(g, 7, 11, 13, 8, 'T'); rect(g, 11, 11, 5, 1, 'f');
    rect(g, 10, 15, 3, 1, 'r'); rect(g, 19, 15, 3, 1, 'r');
    oval(g, 10, 16, 4, 4, 'o'); oval(g, 19, 16, 4, 4, 'o');
    pixel(g, 11, 16, 'w'); pixel(g, 20, 16, 'w');
    oval(g, 9, 19, 15, 6, 'f');
    oval(g, 13, 18, 7, 4, 'r'); rect(g, 14, 18, 4, 1, 'B');
    line(g, 16, 21, 16, 24, 'r'); line(g, 11, 22, 13, 23, 'r'); line(g, 21, 22, 19, 23, 'r');
    // Separate ivory incisors, with a dark one-pixel gap.
    rect(g, 13, 23, 7, 4, 'r'); rect(g, 13, 23, 3, 3, 'w'); rect(g, 17, 23, 3, 3, 'w');
    pixel(g, 13, 25, 'D'); pixel(g, 19, 25, 'D');
    line(g, 8, 21, 5, 20, 'r'); line(g, 8, 23, 4, 23, 'r');
    line(g, 24, 21, 27, 20, 'r'); line(g, 24, 23, 28, 23, 'r');
    oval(g, 4, 25, 6, 7, 'o'); oval(g, 5, 25, 4, 6, 't'); pixel(g, 6, 27, 'T');
    oval(g, 22, 25, 6, 7, 'o'); oval(g, 23, 25, 4, 6, 't'); pixel(g, 24, 27, 'T');
    return finish(g);
  }

  function makeCheese() {
    var g = grid();
    outlineBox(g, 10, 33, 4, 4, 'N'); outlineBox(g, 22, 33, 4, 4, 'N');
    rect(g, 8, 36, 6, 2, 'o'); rect(g, 22, 36, 6, 2, 'o');
    polygon(g, [[6, 24], [3, 25], [2, 29], [5, 30], [8, 27]], 'n', 'o');
    polygon(g, [[27, 23], [30, 22], [31, 26], [28, 29], [25, 26]], 'n', 'o');
    // A golden wedge: bright triangular face and a richly shaded right rind.
    polygon(g, [[22, 8], [27, 10], [29, 30], [25, 34], [6, 34], [4, 30]], 'N', 'o');
    polygon(g, [[22, 8], [25, 31], [4, 31]], 'n', 'o');
    line(g, 22, 10, 24, 28, 'y'); line(g, 7, 29, 20, 15, 'y');
    rect(g, 7, 32, 17, 1, 'Y'); line(g, 27, 15, 28, 28, 'Y');
    // The holes have a dark inset and a lit lower lip.
    oval(g, 18, 14, 4, 4, 'N'); rect(g, 19, 14, 2, 1, 'u'); pixel(g, 20, 17, 'y');
    oval(g, 10, 24, 3, 4, 'N'); pixel(g, 10, 24, 'u'); pixel(g, 11, 27, 'y');
    oval(g, 21, 27, 3, 3, 'N'); pixel(g, 22, 27, 'u');
    oval(g, 26, 20, 2, 4, 'u'); pixel(g, 27, 23, 'Y');
    rect(g, 14, 22, 3, 4, 'o'); rect(g, 20, 21, 3, 4, 'o');
    pixel(g, 14, 22, 'w'); pixel(g, 20, 21, 'w');
    pixel(g, 13, 26, 'X'); pixel(g, 23, 25, 'X');
    polygon(g, [[16, 27], [20, 27], [19, 29], [17, 29]], 'o', 'o');
    rect(g, 17, 27, 2, 1, 'w');
    sparkle(g, 6, 14, 'y');
    return finish(g);
  }

  function makeLol() {
    var g = grid();
    outlineBox(g, 10, 33, 4, 4, 'l'); outlineBox(g, 21, 33, 4, 4, 'm');
    rect(g, 8, 36, 6, 2, 'o'); rect(g, 21, 36, 6, 2, 'o');
    // Reusable transformer layers: differently coloured book-like modules.
    outlineBox(g, 7, 27, 21, 7, 'x'); rect(g, 9, 28, 16, 1, 'X'); rect(g, 9, 31, 17, 1, 'N');
    outlineBox(g, 5, 21, 21, 7, 'l'); rect(g, 7, 22, 17, 1, 'L'); rect(g, 7, 26, 17, 1, 'k');
    outlineBox(g, 8, 15, 20, 7, 'm'); rect(g, 10, 16, 16, 1, 'M'); rect(g, 10, 20, 16, 1, 'C');
    outlineBox(g, 5, 9, 21, 7, 'j'); rect(g, 7, 10, 17, 1, 'J'); rect(g, 7, 14, 17, 1, 'z');
    // Warm yellow spines, and tiny tokens running through the stack.
    rect(g, 7, 10, 2, 5, 'n'); rect(g, 10, 16, 2, 5, 'y');
    rect(g, 7, 22, 2, 5, 'v'); rect(g, 9, 28, 2, 5, 'y');
    pixel(g, 12, 12, 'c'); pixel(g, 16, 12, 'c'); pixel(g, 20, 12, 'c');
    line(g, 12, 12, 20, 12, 'G'); pixel(g, 15, 12, 'c'); pixel(g, 19, 12, 'c');
    // A simple routing trail skips and reuses layers; arrowheads stay legible.
    line(g, 26, 12, 30, 12, 'C'); line(g, 30, 12, 30, 24, 'C');
    line(g, 27, 24, 30, 24, 'C'); pixel(g, 28, 23, 'C'); pixel(g, 28, 25, 'C');
    line(g, 2, 19, 2, 30, 'N'); line(g, 2, 30, 5, 30, 'N');
    line(g, 2, 19, 6, 19, 'N'); pixel(g, 5, 18, 'N'); pixel(g, 5, 20, 'N');
    // The face spans the central layers like a friendly little library robot.
    rect(g, 14, 17, 3, 3, 'o'); rect(g, 22, 17, 3, 3, 'o');
    pixel(g, 14, 17, 'w'); pixel(g, 22, 17, 'w');
    rect(g, 12, 20, 2, 1, 'X'); rect(g, 25, 20, 2, 1, 'X');
    rect(g, 16, 23, 6, 1, 'o'); rect(g, 17, 24, 4, 1, 'o');
    rect(g, 17, 23, 4, 1, 'w');
    // A small bookmark and routing spark crown the library.
    rect(g, 11, 5, 7, 4, 'o'); rect(g, 12, 6, 5, 3, 'n'); pixel(g, 14, 8, 'o');
    sparkle(g, 23, 4, 'y');
    return finish(g);
  }

  window.PIXEL_SPRITES = {
    width: W, height: H, palette: palette,
    me: {
      idle: makeMe('idle'), blink: makeMe('blink'),
      walkA: makeMe('walkA'), walkB: makeMe('walkB'),
      waveA: makeMe('waveA'), waveB: makeMe('waveB')
    },
    ghost: makeGhost(), beaver: makeBeaver(), cheese: makeCheese(), lol: makeLol()
  };
}());
