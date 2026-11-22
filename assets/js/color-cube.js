/* Interactive RGB mixer + 3D colour cube for the "hex codes to color cubes" post.
   Expects THREE to be loaded, and the post markup to be present. */
(function () {
  function hex2(n) { return n.toString(16).padStart(2, '0').toUpperCase(); }

  function rgb2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    var h = 0, s = 0, l = (mx + mn) / 2;
    if (mx !== mn) {
      var d = mx - mn;
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }
    return [h, s, l];
  }

  function init() {
    var $ = function (id) { return document.getElementById(id); };
    var R = $('r'), G = $('g'), B = $('b'), canvas = $('cube');
    if (!R || !canvas || typeof THREE === 'undefined') return;

    var mode = 'cube', spin = true, drag = null;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { spin = false; $('spin').setAttribute('aria-pressed', 'false'); }

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(40, 4 / 3, 0.1, 100);
    cam.position.set(0, 0, 4.2);
    var group = new THREE.Group();
    scene.add(group);
    group.rotation.set(0.5, -0.7, 0);

    var N = 18, col = [], cubePos = [], hslPos = [];
    for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) for (var k = 0; k < N; k++) {
      var r = i / (N - 1), g = j / (N - 1), b = k / (N - 1);
      col.push(r, g, b);
      cubePos.push(r - 0.5, g - 0.5, b - 0.5);
      var hsl = rgb2hsl(r * 255, g * 255, b * 255), a = hsl[0] * Math.PI / 180;
      hslPos.push(Math.cos(a) * hsl[1] * 0.6, hsl[2] - 0.5, Math.sin(a) * hsl[1] * 0.6);
    }

    var geo = new THREE.BufferGeometry();
    var posArr = new Float32Array(cubePos);
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    group.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.035, vertexColors: true })));

    var edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
      new THREE.LineBasicMaterial({ color: 0x445566 }));
    group.add(edges);
    var cyl = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.6, 0.6, 1, 48, 1, true)),
      new THREE.LineBasicMaterial({ color: 0x445566 }));
    cyl.visible = false;
    group.add(cyl);

    var marker = new THREE.Mesh(
      new THREE.TorusGeometry(0.06, 0.012, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff }));
    scene.add(marker);

    var target = cubePos;

    function markerPos() {
      var r = +R.value / 255, g = +G.value / 255, b = +B.value / 255, v;
      if (mode === 'cube') {
        v = new THREE.Vector3(r - 0.5, g - 0.5, b - 0.5);
      } else {
        var hsl = rgb2hsl(r * 255, g * 255, b * 255), a = hsl[0] * Math.PI / 180;
        v = new THREE.Vector3(Math.cos(a) * hsl[1] * 0.6, hsl[2] - 0.5, Math.sin(a) * hsl[1] * 0.6);
      }
      return group.localToWorld(v);
    }

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    }
    resize();
    addEventListener('resize', resize);

    canvas.addEventListener('pointerdown', function (e) {
      drag = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drag) return;
      group.rotation.y += (e.clientX - drag.x) * 0.01;
      group.rotation.x += (e.clientY - drag.y) * 0.01;
      drag = { x: e.clientX, y: e.clientY };
    });
    canvas.addEventListener('pointerup', function () { drag = null; });

    (function loop() {
      if (spin && !drag) group.rotation.y += 0.004;
      var moving = false;
      for (var i = 0; i < posArr.length; i++) {
        var d = target[i] - posArr[i];
        if (Math.abs(d) > 1e-4) { posArr[i] += reduce ? d : d * 0.08; moving = true; }
      }
      if (moving) geo.attributes.position.needsUpdate = true;
      group.updateMatrixWorld();
      marker.position.copy(markerPos());
      marker.lookAt(cam.position);
      renderer.render(scene, cam);
      requestAnimationFrame(loop);
    })();

    Array.prototype.forEach.call(document.querySelectorAll('[data-mode]'), function (btn) {
      btn.addEventListener('click', function () {
        mode = btn.dataset.mode;
        target = mode === 'cube' ? cubePos : hslPos;
        edges.visible = mode === 'cube';
        cyl.visible = mode === 'hsl';
        Array.prototype.forEach.call(document.querySelectorAll('[data-mode]'), function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
      });
    });

    $('spin').addEventListener('click', function (e) {
      spin = !spin;
      e.currentTarget.setAttribute('aria-pressed', String(spin));
    });

    function update() {
      var r = +R.value, g = +G.value, b = +B.value;
      $('ro').textContent = r; $('go').textContent = g; $('bo').textContent = b;
      $('sw').style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
      $('hr').textContent = hex2(r); $('hg').textContent = hex2(g); $('hb').textContent = hex2(b);
      $('rgb').textContent = 'rgb(' + r + ', ' + g + ', ' + b + ')';
      var hsl = rgb2hsl(r, g, b);
      $('hsl').textContent = 'hsl(' + Math.round(hsl[0]) + ', ' +
        Math.round(hsl[1] * 100) + '%, ' + Math.round(hsl[2] * 100) + '%)';
    }
    [R, G, B].forEach(function (i) { i.addEventListener('input', update); });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
