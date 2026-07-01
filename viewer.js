let _3d = null;

function init3DViewer(container) {
  if (_3d) {
    _3d._dead = true;
    cancelAnimationFrame(_3d.rafId);
    try { _3d.renderer.dispose(); } catch (e) { }
    container.innerHTML = '';
  }

  const CW = container.clientWidth || 340;
  const CH = container.clientHeight || 210;
  const DPR = Math.min(window.devicePixelRatio, 2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(DPR); renderer.setSize(CW, CH);
  container.appendChild(renderer.domElement);
  renderer.setClearColor(0xeef2fb, 0);

  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.72));
  const d1 = new THREE.DirectionalLight(0xffffff, 0.88); d1.position.set(4, 7, 5); scene.add(d1);
  const d2 = new THREE.DirectionalLight(0xccddff, 0.4); d2.position.set(-3, -2, -4); scene.add(d2);
  const pt = new THREE.PointLight(0xffffff, 0.55, 20); pt.position.set(0, 0, 0); scene.add(pt);

  const camera = new THREE.PerspectiveCamera(38, CW / CH, 0.001, 1000);
  camera.lookAt(0, 0, 0);

  let rotX = 0.38, rotY = 0.68, zoom = 1.0, bx = 2.2, by = 1.6, bz = 2.8;
  const autoRotateSpeed = 0.0035;
  const pivot = new THREE.Group(); scene.add(pivot);

  let isDragging = false, prevX = 0, prevY = 0;
  const el = renderer.domElement;
  el.addEventListener('mousedown', e => { isDragging = true; prevX = e.clientX; prevY = e.clientY; e.preventDefault(); });
  el.addEventListener('touchstart', e => { if (e.touches.length === 1) { isDragging = true; prevX = e.touches[0].clientX; prevY = e.touches[0].clientY; } }, { passive: true });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('mousemove', e => {
    if (!isDragging || (_3d && _3d._dead)) return;
    rotY += (e.clientX - prevX) * 0.012; rotX += (e.clientY - prevY) * 0.008;
    rotX = Math.max(-1.5, Math.min(1.5, rotX)); prevX = e.clientX; prevY = e.clientY;
  });
  window.addEventListener('touchmove', e => {
    if (e.touches.length !== 1 || !isDragging || (_3d && _3d._dead)) return;
    rotY += (e.touches[0].clientX - prevX) * 0.012; rotX += (e.touches[0].clientY - prevY) * 0.008;
    rotX = Math.max(-1.5, Math.min(1.5, rotX)); prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener('wheel', e => { e.preventDefault(); zoom *= e.deltaY > 0 ? 1.1 : 0.91; zoom = Math.max(0.15, Math.min(6, zoom)); }, { passive: false });

  let pinchD = null;
  el.addEventListener('touchstart', e => { if (e.touches.length === 2) pinchD = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); }, { passive: true });
  el.addEventListener('touchmove', e => { if (e.touches.length === 2 && pinchD) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); zoom *= pinchD / d; zoom = Math.max(0.15, Math.min(6, zoom)); pinchD = d; } }, { passive: true });
  el.addEventListener('touchend', () => { pinchD = null; }, { passive: true });

  const lc = document.createElement('canvas');
  lc.style.cssText = 'position:absolute;inset:0;pointer-events:none;width:100%;height:100%';
  lc.width = CW * DPR; lc.height = CH * DPR;
  container.appendChild(lc);
  const lctx = lc.getContext('2d');

  const hint = document.createElement('span');
  hint.style.cssText = 'position:absolute;bottom:8px;left:8px;font-size:10px;color:#8a97b8;font-family:Barlow Condensed,sans-serif;pointer-events:none;z-index:4;opacity:0.75';
  hint.textContent = '🖱 Drag · Scroll = zoom'; container.appendChild(hint);

  const state = {
    renderer,
    scene,
    camera,
    pivot,
    rafId: null,
    container,
    lc,
    lctx,
    dimLines: [],
    _dead: false,
    setBase(x, y, z) { bx = x; by = y; bz = z; }
  };
  _3d = state;

  function animate() {
    if (state._dead) return;
    state.rafId = requestAnimationFrame(animate);
    if (!isDragging) rotY += autoRotateSpeed;
    pivot.rotation.x = rotX; pivot.rotation.y = rotY;
    camera.position.set(bx * zoom, by * zoom, bz * zoom); camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    if (state.dimLines && state.dimLines.length) _drawDims(lctx, lc, camera, pivot, CW, CH, DPR);
    else lctx.clearRect(0, 0, lc.width, lc.height);
  }
  animate();
}

function dispose3DViewer() {
  if (!_3d) return;
  _3d._dead = true;
  cancelAnimationFrame(_3d.rafId);
  try { _3d.renderer.dispose(); } catch (e) { }
  _3d.container.innerHTML = '';
  _3d = null;
}

function _drawDims(lctx, lc, camera, pivot, W, H, DPR) {
  lctx.clearRect(0, 0, lc.width, lc.height);
  _3d.dimLines.forEach(({ p1, p2, text, color }) => {
    const col = color || '#1B3F8B';
    const c1 = _w2s(p1, camera, pivot, W, H), c2 = _w2s(p2, camera, pivot, W, H);
    if (!c1 || !c2) return;
    const mx = (c1.x + c2.x) / 2, my = (c1.y + c2.y) / 2;
    lctx.save(); lctx.scale(DPR, DPR);
    lctx.strokeStyle = col; lctx.lineWidth = 1.5;
    lctx.beginPath(); lctx.moveTo(c1.x, c1.y); lctx.lineTo(c2.x, c2.y); lctx.stroke();
    _ah(lctx, c1, c2, col); _ah(lctx, c2, c1, col);
    lctx.font = 'bold 11px Barlow Condensed,sans-serif';
    const tw = lctx.measureText(text).width + 10;
    lctx.fillStyle = 'rgba(237,242,255,0.93)';
    if (lctx.roundRect) { lctx.beginPath(); lctx.roundRect(mx - tw / 2, my - 9, tw, 16, 3); lctx.fill(); }
    else lctx.fillRect(mx - tw / 2, my - 9, tw, 16);
    lctx.fillStyle = col; lctx.textAlign = 'center'; lctx.textBaseline = 'middle';
    lctx.fillText(text, mx, my); lctx.restore();
  });
}

function _ah(ctx, from, to, col) {
  const a = Math.atan2(to.y - from.y, to.x - from.x), len = 7;
  ctx.save(); ctx.fillStyle = col; ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - len * Math.cos(a - 0.4), to.y - len * Math.sin(a - 0.4));
  ctx.lineTo(to.x - len * Math.cos(a + 0.4), to.y - len * Math.sin(a + 0.4));
  ctx.closePath(); ctx.fill(); ctx.restore();
}

function _w2s(wp, camera, pivot, W, H) {
  const p = wp.clone().applyEuler(pivot.rotation).project(camera);
  return { x: (p.x * .5 + .5) * W, y: (-p.y * .5 + .5) * H };
}

function _mats() {
  return {
    galv: new THREE.MeshPhongMaterial({ color: 0xbacedd, specular: 0x99aabb, shininess: 55, side: THREE.DoubleSide }),
    inner: new THREE.MeshPhongMaterial({ color: 0x8898aa, specular: 0x667788, shininess: 30, side: THREE.DoubleSide }),
    flange: new THREE.MeshPhongMaterial({ color: 0x1a2a3a, specular: 0x334455, shininess: 50, side: THREE.DoubleSide }),
    edge: new THREE.LineBasicMaterial({ color: 0x1a3050 }),
    red: new THREE.MeshPhongMaterial({ color: 0xcc2222, specular: 0x881111, shininess: 40, side: THREE.DoubleSide }),
  };
}

function _mesh(pivot, geo, mat, pos) { const m = new THREE.Mesh(geo, mat); if (pos) m.position.set(...pos); pivot.add(m); return m; }
function _edge(pivot, geo, mat, pos) { const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), mat); if (pos) e.position.set(...pos); pivot.add(e); return e; }
function _box(pivot, w, h, d, mat, edge, pos) { const g = new THREE.BoxGeometry(w, h, d); _mesh(pivot, g, mat, pos); if (edge) _edge(pivot, g, edge, pos); return g; }
function _fitCam(L, H, W) { if (!_3d) return; const s = Math.max(L, H, W) * 1.9; _3d.setBase(s * 0.9, s * 0.65, s * 1.1); }
function _v3(x, y, z) { return new THREE.Vector3(x, y, z); }

function _hollowRect(grp, L, W, H, T) {
  const m = _mats();
  T = Math.min(T, W / 2 * 0.9, H / 2 * 0.9);
  [
    { w: L, h: T, d: W, py: H / 2 - T / 2, pz: 0 },  
    { w: L, h: T, d: W, py: -H / 2 + T / 2, pz: 0 },  
    { w: L, h: H - 2 * T, d: T, py: 0, pz: W / 2 - T / 2 },
    { w: L, h: H - 2 * T, d: T, py: 0, pz: -W / 2 + T / 2 },
  ].forEach(p => {
    _box(grp, p.w, p.h, p.d, m.galv, m.edge, [0, p.py, p.pz]);
  });
}

function _flangeRect(grp, x, W, H, m) {
  const ext = 0.04, t = 0.025;
  [[W + ext * 2, t, 0, H / 2 + ext / 2, 0],
  [W + ext * 2, t, 0, -H / 2 - ext / 2, 0],
  [t, H + ext * 2, 0, 0, W / 2 + ext / 2],
  [t, H + ext * 2, 0, 0, -W / 2 - ext / 2],
  ].forEach(([fw, fh, , py, pz]) => {
    const g = new THREE.BoxGeometry(t, fh, fw); const bm = new THREE.Mesh(g, m.flange); bm.position.set(x, py, pz); grp.add(bm);
  });
}

function _hollowRound(grp, L, R, T) {
  const m = _mats(); const iR = Math.max(R - T, R * 0.84);
  [R, iR].forEach((r, i) => {
    const g = new THREE.CylinderGeometry(r, r, L, 48, 1, true); g.rotateZ(Math.PI / 2);
    _mesh(grp, g, i === 0 ? m.galv : m.inner);
  });
  [-L / 2, L / 2].forEach(x => {
    const sh = new THREE.Shape(); sh.absarc(0, 0, R, 0, Math.PI * 2, false);
    const ho = new THREE.Path(); ho.absarc(0, 0, iR, 0, Math.PI * 2, true); sh.holes.push(ho);
    const g = new THREE.ShapeGeometry(sh, 48); const cm = new THREE.Mesh(g, m.flange); cm.rotation.y = Math.PI / 2; cm.position.x = x; grp.add(cm);
  });
}

function _hollowReducer(grp, W1, H1, W2, H2, L) {
  const m = _mats(); const half = L / 2;
  const T = Math.max(Math.min(W1, H1, W2, H2) * 0.08, 0.018);
  const w1i = W1 - T * 2, h1i = H1 - T * 2, w2i = W2 - T * 2, h2i = H2 - T * 2;
  const faces = [
    {
      vO: [-half, H1 / 2, W1 / 2, -half, H1 / 2, -W1 / 2, half, H2 / 2, -W2 / 2, half, H2 / 2, W2 / 2], 
      vI: [-half, h1i / 2, w1i / 2, -half, h1i / 2, -w1i / 2, half, h2i / 2, -w2i / 2, half, h2i / 2, w2i / 2]
    },
    {
      vO: [-half, -H1 / 2, -W1 / 2, -half, -H1 / 2, W1 / 2, half, -H2 / 2, W2 / 2, half, -H2 / 2, -W2 / 2], 
      vI: [-half, -h1i / 2, -w1i / 2, -half, -h1i / 2, w1i / 2, half, -h2i / 2, w2i / 2, half, -h2i / 2, -w2i / 2]
    },
    {
      vO: [-half, -H1 / 2, W1 / 2, -half, H1 / 2, W1 / 2, half, H2 / 2, W2 / 2, half, -H2 / 2, W2 / 2],
      vI: [-half, -h1i / 2, w1i / 2, -half, h1i / 2, w1i / 2, half, h2i / 2, w2i / 2, half, -h2i / 2, w2i / 2]
    },
    {
      vO: [-half, H1 / 2, -W1 / 2, -half, -H1 / 2, -W1 / 2, half, -H2 / 2, -W2 / 2, half, H2 / 2, -W2 / 2],
      vI: [-half, h1i / 2, -w1i / 2, -half, -h1i / 2, -w1i / 2, half, -h2i / 2, -w2i / 2, half, h2i / 2, -w2i / 2]
    },
  ];
  faces.forEach(({ vO, vI }) => {
    const go = new THREE.BufferGeometry(); go.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vO), 3)); go.setIndex([0, 1, 2, 0, 2, 3]); go.computeVertexNormals(); _mesh(grp, go, m.galv); _edge(grp, go, m.edge);
    const gi = new THREE.BufferGeometry(); gi.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vI), 3)); gi.setIndex([0, 2, 1, 0, 3, 2]); gi.computeVertexNormals(); _mesh(grp, gi, m.inner);
  });
  [{ x: -half, W: W1, H: H1, Wi: w1i, Hi: h1i }, { x: half, W: W2, H: H2, Wi: w2i, Hi: h2i }].forEach(({ x, W, H, Wi, Hi }) => {
    const cv = new Float32Array([W / 2, H / 2, 0, Wi / 2, Hi / 2, 0, Wi / 2, -Hi / 2, 0, W / 2, -H / 2, 0, -W / 2, H / 2, 0, -Wi / 2, Hi / 2, 0, -Wi / 2, -Hi / 2, 0, -W / 2, -H / 2, 0]);
    const ci = [0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7];
    const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.BufferAttribute(cv, 3)); cg.setIndex(ci); cg.computeVertexNormals();
    const cm = new THREE.Mesh(cg, m.flange); cm.rotation.y = Math.PI / 2; cm.position.x = x; grp.add(cm);
  });
}

function _rectToRound(grp, W, H, R, L) {
  const m = _mats(); const segs = 24, half = L / 2;
  for (let i = 0; i < segs; i++) {
    const t0 = i / segs * Math.PI * 2, t1 = (i + 1) / segs * Math.PI * 2;
    const blend = t => {
      const cx = Math.cos(t), cy = Math.sin(t);
      const rx = W / 2 * Math.sign(cx) || 0.001, ry = H / 2 * Math.sign(cy) || 0.001;
      return [W / 2 * cx, H / 2 * cy];
    };
    const [x0, y0] = blend(t0), [x1, y1] = blend(t1);
    const cx0 = R * Math.cos(t0), cy0 = R * Math.sin(t0), cx1 = R * Math.cos(t1), cy1 = R * Math.sin(t1);
    const verts = new Float32Array([-half, y0, x0, -half, y1, x1, half, cy1, cx1, half, cy0, cx0]);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(verts, 3)); g.setIndex([0, 1, 2, 0, 2, 3]); g.computeVertexNormals(); _mesh(grp, g, m.galv);
  }
  const rs = new THREE.Shape(); rs.moveTo(-W / 2, -H / 2); rs.lineTo(W / 2, -H / 2); rs.lineTo(W / 2, H / 2); rs.lineTo(-W / 2, H / 2); rs.closePath();
  const rh = new THREE.Path(); const ri = 0.88; rh.moveTo(-W / 2 * ri, -H / 2 * ri); rh.lineTo(W / 2 * ri, -H / 2 * ri); rh.lineTo(W / 2 * ri, H / 2 * ri); rh.lineTo(-W / 2 * ri, H / 2 * ri); rh.closePath(); rs.holes.push(rh);
  const rcg = new THREE.ShapeGeometry(rs, 4); const rcm = new THREE.Mesh(rcg, m.flange); rcm.rotation.y = Math.PI / 2; rcm.position.x = -half; grp.add(rcm);
  const cs = new THREE.Shape(); cs.absarc(0, 0, R, 0, Math.PI * 2, false); const ch = new THREE.Path(); ch.absarc(0, 0, R * 0.87, 0, Math.PI * 2, true); cs.holes.push(ch); 
  const ccg = new THREE.ShapeGeometry(cs, 32); const ccm = new THREE.Mesh(ccg, m.flange); ccm.rotation.y = Math.PI / 2; ccm.position.x = half; grp.add(ccm);
}

function _hollowYAsymmetric(grp, A, B, C, D, E, FF, L, R) {
  const m = _mats();
  const half = L / 2;
  const T = Math.max(Math.min(A, B, C, D, E, FF) * 0.08, 0.014);
  const x_in = -half;
  const x_out = half;
  const x_arc = x_in + R;
  const x_c = Math.min(x_arc + E, x_out - T);
  const z_back = -A / 2;
  const z_front = A / 2;
  const z_br_front = A / 2 + R;
  const y_top = B / 2;
  const y_bot = -B / 2;
  const y_br_bot = B / 2 - FF;

  _box(grp, L, T, A, m.galv, m.edge, [0, y_top - T / 2, 0]);
  _box(grp, L, T, A, m.galv, m.edge, [0, y_bot + T / 2, 0]);
  _box(grp, L, B - 2 * T, T, m.galv, m.edge, [0, 0, z_back + T / 2]);

  const fw_len = x_out - x_c;
  if (fw_len > 0) {
    _box(grp, fw_len, B - 2 * T, T, m.galv, m.edge, [x_c + fw_len / 2, 0, z_front - T / 2]);
  }

  const bw_len = x_c - x_in;
  const bw_h = B - FF;
  if (bw_h > 0) {
    _box(grp, bw_len, bw_h, T, m.galv, m.edge, [x_in + bw_len / 2, y_bot + bw_h / 2, z_front - T / 2]);
  }

  const s = new THREE.Shape();
  s.moveTo(x_in, z_front);
  s.absarc(x_in, z_br_front, R, -Math.PI / 2, 0, false);
  s.lineTo(x_c, z_br_front);
  s.lineTo(x_c, z_front);
  s.closePath();

  const sgTop = new THREE.ShapeGeometry(s);
  sgTop.rotateX(Math.PI / 2);
  const mTop = new THREE.Mesh(sgTop, m.galv);
  mTop.position.y = y_top - T / 2;
  grp.add(mTop);
  _edge(grp, sgTop, m.edge, [0, y_top - T / 2, 0]);

  const sgBot = new THREE.ShapeGeometry(s);
  sgBot.rotateX(Math.PI / 2);
  const mBot = new THREE.Mesh(sgBot, m.galv);
  mBot.position.y = y_br_bot + T / 2;
  grp.add(mBot);
  _edge(grp, sgBot, m.edge, [0, y_br_bot + T / 2, 0]);

  const branchH = Math.max(FF - 2 * T, T);
  const branchY = y_top - FF / 2;

  if (x_c - x_arc > T) {
    _box(grp, x_c - x_arc, branchH, T, m.galv, m.edge, [(x_arc + x_c) / 2, branchY, z_br_front - T / 2]);
  }
  _box(grp, T, branchH, R, m.galv, m.edge, [x_c - T / 2, branchY, z_front + R / 2]);

  const arcG = new THREE.CylinderGeometry(R, R, FF, 16, 1, true, Math.PI / 2, Math.PI / 2);
  const arcM = new THREE.Mesh(arcG, m.galv);
  arcM.position.set(x_in, branchY, z_br_front);
  grp.add(arcM);
  _edge(grp, arcG, m.edge, [x_in, branchY, z_br_front]);

  _flangeRect(grp, x_in, A, B, m);
  _flangeRect(grp, x_out, C, D, m);

  const f_branch = new THREE.Group();
  _flangeRect(f_branch, 0, E, FF, m);
  f_branch.rotation.y = -Math.PI / 2;
  f_branch.position.set(x_arc + E / 2, branchY, z_br_front);
  grp.add(f_branch);
}

function build3DDuct(key, f) {
  if (!_3d) return;
  const { pivot } = _3d;
  while (pivot.children.length) pivot.remove(pivot.children[0]);
  _3d.dimLines = [];
  const m = _mats();
  const S = 1 / 800;

  switch (key) {
    case 'rect_straight': case 'transfer_air': {
      const W = (+f.A || 400) * S, H = (+f.B || 300) * S, L = (+f.L || 600) * S, T = Math.min(W, H) * 0.09;
      _hollowRect(pivot, L, W, H, T);
      _flangeRect(pivot, -L / 2, W, H, m); _flangeRect(pivot, L / 2, W, H, m);
      if (key === 'transfer_air') {
        [-W / 2 * 0.4, 0, W / 2 * 0.4].forEach(pz => {
          const sg = new THREE.BoxGeometry(L * 0.9, H * 0.1, 0.01); const sm = new THREE.Mesh(sg, m.edge && new THREE.MeshPhongMaterial({ color: 0x445566, side: THREE.DoubleSide })); sm.position.set(0, H / 2, pz); pivot.add(sm);
        });
      }
      _3d.dimLines = [
        { p1: _v3(-L / 2, H / 2 + 0.09, 0), p2: _v3(L / 2, H / 2 + 0.09, 0), text: `${f.L} mm` },
        { p1: _v3(-L / 2 - 0.12, -H / 2, 0), p2: _v3(-L / 2 - 0.12, H / 2, 0), text: `${f.B} mm` },
        { p1: _v3(-L / 2 - 0.12, H / 2 + 0.06, -W / 2), p2: _v3(-L / 2 - 0.12, H / 2 + 0.06, W / 2), text: `${f.A} mm` },
      ]; _fitCam(L, H, W); break;
    }
    case 'canvas_rect': {
      const W = (+f.A || 400) * S, H = (+f.B || 300) * S, L = (+f.L || 600) * S, T = Math.min(W, H) * 0.09;
      _hollowRect(pivot, L, W, H, T);
      [-L / 2 + 0.02, L / 2 - 0.02].forEach(x => { _box(pivot, 0.04, H + 0.01, W + 0.01, m.red, null, [x, 0, 0]); });
      _3d.dimLines = [
        { p1: _v3(-L / 2, H / 2 + 0.09, 0), p2: _v3(L / 2, H / 2 + 0.09, 0), text: `${f.L} mm` },
        { p1: _v3(-L / 2 - 0.12, -H / 2, 0), p2: _v3(-L / 2 - 0.12, H / 2, 0), text: `${f.B} mm` },
        { p1: _v3(-L / 2 - 0.12, H / 2 + 0.06, -W / 2), p2: _v3(-L / 2 - 0.12, H / 2 + 0.06, W / 2), text: `${f.A} mm` },
      ]; _fitCam(L, H, W); break;
    }
    case 'round_straight': {
      const R = (+f.D || 400) / 2 * S, L = (+f.L || 600) * S, T = R * 0.09;
      _hollowRound(pivot, L, R, T);
      _3d.dimLines = [
        { p1: _v3(-L / 2, 0, 0), p2: _v3(L / 2, 0, 0), text: `${f.L} mm` },
        { p1: _v3(0, R + 0.07, 0), p2: _v3(0, -R - 0.07, 0), text: `Ø${f.D} mm`, color: '#D72B2B' },
      ]; _fitCam(L, R * 2, R * 2); break;
    }
    case 'canvas_round': {
      const R = (+f.D || 400) / 2 * S, L = (+f.L || 600) * S, T = R * 0.09;
      _hollowRound(pivot, L, R, T);
      [-L / 2, L / 2].forEach(x => { const g = new THREE.CylinderGeometry(R * 1.06, R * 1.06, 0.045, 32); const bm = new THREE.Mesh(g, m.red); bm.rotation.z = Math.PI / 2; bm.position.x = x; pivot.add(bm); });
      _3d.dimLines = [
        { p1: _v3(-L / 2, 0, 0), p2: _v3(L / 2, 0, 0), text: `${f.L} mm` },
        { p1: _v3(0, R + 0.08, 0), p2: _v3(0, -R - 0.08, 0), text: `Ø${f.D} mm`, color: '#D72B2B' },
      ]; _fitCam(L, R * 2, R * 2); break;
    }
    case 'rect_elbow90': {
      const W = (+f.A || 300) * S, H = (+f.B || 250) * S, RL = (+f.R || 150) * S, L = (+f.L || 300) * S, T = Math.min(W, H) * 0.09;
      const SEGS = 32;
      const Ri = RL, Ro = RL + W, Rc = RL + W / 2;
      function sweepWall(r, matl, flip) {
        const verts = [], idx = [];
        for (let i = 0; i <= SEGS; i++) {
          const a = i / SEGS * (Math.PI / 2);
          verts.push(r * Math.sin(a), -H / 2, -r * Math.cos(a),
            r * Math.sin(a), H / 2, -r * Math.cos(a));
        }
        for (let i = 0; i < SEGS; i++) {
          const b = i * 2;
          if (flip) idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
          else idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
        g.setIndex(idx); g.computeVertexNormals(); _mesh(pivot, g, matl);
      }
      function sweepCap(y, flip) {
        const verts = [], idx = [];
        for (let i = 0; i <= SEGS; i++) {
          const a = i / SEGS * (Math.PI / 2), ca = Math.cos(a), sa = Math.sin(a);
          verts.push(Ri * sa, y, -Ri * ca, Ro * sa, y, -Ro * ca);
        }
        for (let i = 0; i < SEGS; i++) {
          const b = i * 2;
          if (flip) idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3);
          else idx.push(b, b + 1, b + 3, b, b + 3, b + 2);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
        g.setIndex(idx); g.computeVertexNormals(); _mesh(pivot, g, m.galv);
      }
      sweepWall(Ro, m.galv, false);
      sweepWall(Ri, m.inner, true);
      sweepCap(H / 2, false);
      sweepCap(-H / 2, true);
      const arm1 = new THREE.Group(); _hollowRect(arm1, L, W, H, T); arm1.position.set(-L / 2, 0, -Rc); pivot.add(arm1);
      const arm2 = new THREE.Group(); _hollowRect(arm2, L, W, H, T);
      arm2.rotation.y = -Math.PI / 2;
      arm2.position.set(Rc, 0, L / 2); pivot.add(arm2);
      _3d.dimLines = [
        { p1: _v3(-L, H / 2 + 0.10, -Rc), p2: _v3(0, H / 2 + 0.10, -Rc), text: `${f.L} mm` },
        { p1: _v3(-L / 2 - 0.12, -H / 2, -Rc), p2: _v3(-L / 2 - 0.12, H / 2, -Rc), text: `${f.B} mm` },
        { p1: _v3(0, H / 2 + 0.12, -Ri), p2: _v3(0, H / 2 + 0.12, -Ro), text: `R ${f.R} mm`, color: '#D72B2B' },
        { p1: _v3(0, H / 2 + 0.08, -Ro), p2: _v3(Ro, H / 2 + 0.08, -Ro), text: `${f.A} mm` },
      ];
      _fitCam(L + Ro, H, L + Ro); break;
    }
    case 'rect_elbow45': {
      const A = (+f.A || 300) * S, B = (+f.B || 250) * S, RL = (+f.R || 150) * S, L = (+f.L || 300) * S, T = Math.min(A, B) * 0.09;
      const arm1 = new THREE.Group(); _hollowRect(arm1, L, A, B, T); arm1.position.x = -L / 2; pivot.add(arm1);
      const arm2 = new THREE.Group(); _hollowRect(arm2, L, A, B, T);
      const ang = Math.PI / 4;
      arm2.rotation.y = ang; arm2.position.set(L / 2 * Math.cos(ang) * 0.5, 0, L / 2 * Math.sin(ang) + A / 2); pivot.add(arm2);
      _3d.dimLines = [
        { p1: _v3(-L, B / 2 + 0.1, 0), p2: _v3(0, B / 2 + 0.1, 0), text: `${f.L} mm` },
        { p1: _v3(-L / 2 - 0.1, -B / 2, 0), p2: _v3(-L / 2 - 0.1, B / 2, 0), text: `${f.B} mm` },
      ]; _fitCam(L * 1.5, B, L); break;
    }
    case 'round_elbow90': {
      const R = (+f.D || 250) / 2 * S, bend = (+f.R || 300) * S, L = (+f.L || 250) * S;
      const tg = new THREE.TorusGeometry(bend, R, 16, 32, Math.PI / 2);
      tg.rotateZ(-Math.PI / 2);
      tg.rotateX(Math.PI / 2);
      _mesh(pivot, tg, m.galv);
      const ag = new THREE.CylinderGeometry(R, R, L, 32, 1, true);
      ag.rotateZ(Math.PI / 2);
      const am = new THREE.Mesh(ag, m.galv);
      am.position.set(-L / 2, 0, -bend);
      pivot.add(am);
      const ag2 = new THREE.CylinderGeometry(R, R, L, 32, 1, true);
      ag2.rotateX(Math.PI / 2);
      const am2 = new THREE.Mesh(ag2, m.galv);
      am2.position.set(bend, 0, L / 2);
      pivot.add(am2);
      _3d.dimLines = [
        { p1: _v3(-L, -R - 0.05, -bend), p2: _v3(0, -R - 0.05, -bend), text: `${f.L} mm` },
        { p1: _v3(0, -R, -bend - 0.1), p2: _v3(0, R, -bend - 0.1), text: `Ø${f.D} mm`, color: '#D72B2B' },
        { p1: _v3(0, R + 0.1, -bend), p2: _v3(bend, R + 0.1, -bend), text: `R ${f.R} mm`, color: '#D72B2B' },
      ]; _fitCam(L + bend, R * 2 + bend, R * 2); break;
    }
    case 'duct_reducer': case 'reducer_duct': case 'collar_duct': case 'fan_conn': {
      const W1 = (+f.A || 500) * S, H1 = (+f.B || 400) * S, W2 = (+f.C || 300) * S, H2 = (+(f.D2 || f.D || 250)) * S, L = (+f.L || 500) * S;
      _hollowReducer(pivot, W1, H1, W2, H2, L);
      _flangeRect(pivot, -L / 2, W1, H1, m); _flangeRect(pivot, L / 2, W2, H2, m);
      _3d.dimLines = [
        { p1: _v3(-L / 2, H1 / 2 + 0.12, 0), p2: _v3(L / 2, H2 / 2 + 0.12, 0), text: `L ${f.L} mm` },
        { p1: _v3(-L / 2 - 0.13, -H1 / 2, 0), p2: _v3(-L / 2 - 0.13, H1 / 2, 0), text: `${f.B} mm` },
        { p1: _v3(L / 2 + 0.13, -H2 / 2, 0), p2: _v3(L / 2 + 0.13, H2 / 2, 0), text: `${f.D2 || f.D || ''} mm`, color: '#D72B2B' },
      ]; _fitCam(L, Math.max(H1, H2), Math.max(W1, W2)); break;
    }
    case 'reducer_duct_r': {
      const W1 = (+f.A || 500) * S, H1 = (+f.B || 400) * S, W2 = (+f.C || 300) * S, H2 = (+(f.D2 || 250)) * S, L = (+f.L || 500) * S, RL = (+f.R || 100) * S;
      _hollowReducer(pivot, W1, H1, W2, H2, L);
      pivot.children.forEach(c => { if (c.position && c.position.x > 0) c.position.y += RL; });
      _3d.dimLines = [
        { p1: _v3(-L / 2, H1 / 2 + 0.12, 0), p2: _v3(L / 2, H2 / 2 + 0.12 + RL, 0), text: `L ${f.L} mm` },
        { p1: _v3(-L / 2 - 0.13, -H1 / 2, 0), p2: _v3(-L / 2 - 0.13, H1 / 2, 0), text: `${f.B} mm` },
        { p1: _v3(0, 0, W1 / 2 + 0.12), p2: _v3(0, RL, W1 / 2 + 0.12), text: `R ${f.R} mm`, color: '#D72B2B' },
      ]; _fitCam(L, Math.max(H1, H2) + RL, Math.max(W1, W2)); break;
    }
    case 'rect_to_round': {
      const W = (+f.A || 500) * S, H = (+f.B || 400) * S, R = (+f.D || 300) / 2 * S, L = (+f.L || 500) * S;
      _rectToRound(pivot, W, H, R, L);
      _3d.dimLines = [
        { p1: _v3(-L / 2, H / 2 + 0.1, 0), p2: _v3(L / 2, R + 0.1, 0), text: `L ${f.L} mm` },
        { p1: _v3(-L / 2 - 0.12, -H / 2, 0), p2: _v3(-L / 2 - 0.12, H / 2, 0), text: `${f.B} mm` },
        { p1: _v3(L / 2 + 0.08, R + 0.05, 0), p2: _v3(L / 2 + 0.08, -R - 0.05, 0), text: `Ø${f.D} mm`, color: '#D72B2B' },
      ]; _fitCam(L, Math.max(H, R * 2), Math.max(W, R * 2)); break;
    }
    case 'offset_duct': {
      const A = (+f.A || 400) * S, B = (+f.B || 300) * S, RL = (+f.R || 200) * S, L = (+f.L || 600) * S, T = Math.min(A, B) * 0.09;
      const seg = L / 3;
      const g1 = new THREE.Group(); _hollowRect(g1, seg, A, B, T); g1.position.set(-seg, 0, 0); pivot.add(g1);
      const mLen = Math.sqrt(seg ** 2 + RL ** 2);
      const ang = Math.atan2(RL, seg);
      const g2 = new THREE.Group(); _hollowRect(g2, mLen, A, B, T); g2.rotation.z = ang; g2.position.set(0, RL / 2, 0); pivot.add(g2);
      const g3 = new THREE.Group(); _hollowRect(g3, seg, A, B, T); g3.position.set(seg, RL, 0); pivot.add(g3);
      _3d.dimLines = [
        { p1: _v3(-seg * 1.5, B / 2 + 0.09, 0), p2: _v3(seg * 1.5, B / 2 + 0.09 + RL, 0), text: `${f.L} mm` },
        { p1: _v3(-seg * 1.5 - 0.12, -B / 2, 0), p2: _v3(-seg * 1.5 - 0.12, B / 2, 0), text: `${f.B} mm` },
        { p1: _v3(0, 0, A / 2 + 0.12), p2: _v3(0, RL, A / 2 + 0.12), text: `R ${f.R} mm`, color: '#D72B2B' },
      ]; _fitCam(L, B + RL, A); break;
    }
    case 'y_duct': {
      const A = (+f.A || 200) * S, B = (+f.B || 200) * S;
      const E = (+f.E || 200) * S, FF = (+f.F || 150) * S, L = (+f.L || 375) * S;
      const R = (+f.R || 75) * S;
      _hollowYAsymmetric(pivot, A, B, A, B, E, FF, L, R);
      const half = L / 2, x_in = -half, x_out = half;
      const z_front = A / 2, z_br_front = A / 2 + R;
      const y_top = B / 2;
      const x_c = Math.min(x_in + R + E, x_out - Math.min(A, B, E, FF) * 0.08);
      _3d.dimLines = [
        { p1: _v3(x_in, y_top + 0.08, -A / 2), p2: _v3(x_out, y_top + 0.08, -A / 2), text: `L ${f.L} mm` },
        { p1: _v3(x_in - 0.08, -B / 2, -A / 2), p2: _v3(x_in - 0.08, B / 2, -A / 2), text: `B ${f.B} mm` },
        { p1: _v3(x_in - 0.08, y_top + 0.08, -A / 2), p2: _v3(x_in - 0.08, y_top + 0.08, A / 2), text: `A ${f.A} mm` },
        { p1: _v3(x_in + R, y_top + 0.08, z_br_front), p2: _v3(x_c, y_top + 0.08, z_br_front), text: `E ${f.E} mm` },
        { p1: _v3(x_c + 0.04, y_top, z_br_front + 0.05), p2: _v3(x_c + 0.04, y_top - FF, z_br_front + 0.05), text: `F ${f.F} mm` },
        { p1: _v3(x_in, y_top + 0.05, z_front), p2: _v3(x_in + R, y_top + 0.05, z_br_front), text: `R${f.R}`, color: '#D72B2B' },
      ];
      _fitCam(L, B + FF, A + E); break;
    }
    case 'butterfly_rect': {
      const A = (+f.A || 400) * S, B = (+f.B || 300) * S, C = (+f.C || 300) * S, D = (+f.D2 || 250) * S;
      const R1 = (+f.R1 || 200) * S, E = (+f.E || 300) * S, FF = (+f.F || 250) * S, R2 = (+f.R2 || 200) * S;
      const T = Math.min(A, B) * 0.09;
      _hollowRect(pivot, A, A, B, T);
      const lb = new THREE.Group(); _hollowRect(lb, R1 * 1.4, C, D, Math.min(C, D) * 0.09);
      lb.rotation.y = Math.PI / 4; lb.position.set(0, 0, -(R1 * 0.8 + A / 4)); pivot.add(lb);
      const rb = new THREE.Group(); _hollowRect(rb, R2 * 1.4, E, FF, Math.min(E, FF) * 0.09);
      rb.rotation.y = -Math.PI / 4; rb.position.set(0, 0, R2 * 0.8 + A / 4); pivot.add(rb);
      _3d.dimLines = [
        { p1: _v3(-A / 2, B / 2 + 0.1, 0), p2: _v3(A / 2, B / 2 + 0.1, 0), text: `${f.A} mm` },
        { p1: _v3(-A / 2 - 0.12, -B / 2, 0), p2: _v3(-A / 2 - 0.12, B / 2, 0), text: `${f.B} mm` },
        { p1: _v3(0, B / 2 + 0.1, -(R1 + A / 4) + 0.1), p2: _v3(0, B / 2 + 0.1, R2 + A / 4 - 0.1), text: `R1+R2` },
      ]; _fitCam(A + R1 * 0.8, B, R1 + R2 + A); break;
    }
    case 'r_type': {
      const A = (+f.A || 400) * S, B = (+f.B || 300) * S, C = (+f.C || 300) * S, D = (+f.D2 || 250) * S;
      const E = (+f.E || 250) * S, FF = (+f.F || 200) * S, RL = (+f.R || 250) * S, L = (+f.L || 600) * S;
      const T = Math.min(A, B) * 0.09;
      const main = new THREE.Group(); _hollowRect(main, L * 0.4, A, B, T); main.position.x = -L * 0.25; pivot.add(main);
      const tg = new THREE.TorusGeometry(RL, Math.min(C, D) / 2, 8, 16, Math.PI / 2); tg.rotateX(Math.PI / 2);
      const tm = new THREE.Mesh(tg, m.galv); tm.position.set(L * 0.15, RL / 2, 0); pivot.add(tm);
      const out = new THREE.Group(); _hollowRect(out, L * 0.4, E, FF, Math.min(E, FF) * 0.09);
      out.rotation.y = Math.PI / 2; out.position.set(L * 0.15, RL, L * 0.25); pivot.add(out);
      _3d.dimLines = [
        { p1: _v3(-L / 2, B / 2 + 0.1, 0), p2: _v3(L * 0.15, B / 2 + 0.1, 0), text: `${f.L} mm` },
        { p1: _v3(-L / 2 - 0.12, -B / 2, 0), p2: _v3(-L / 2 - 0.12, B / 2, 0), text: `${f.B} mm` },
        { p1: _v3(L * 0.15 + 0.1, 0, 0), p2: _v3(L * 0.15 + 0.1, RL, 0), text: `R ${f.R} mm`, color: '#D72B2B' },
      ]; _fitCam(L, B + RL, A); break;
    }
    case 'plenum_box': {
      const A = (+f.A || 600) * S, B = (+f.B || 400) * S, H = (+f.H || 300) * S, D = (+f.D || 200) * S, H2 = (+f.H2 || 150) * S;
      const T = Math.min(A, B, H) * 0.08;
      [
        { w: A, h: T, d: B, px: 0, py: -H / 2 + T / 2, pz: 0 },
        { w: A, h: T, d: B, px: 0, py: H / 2 - T / 2, pz: 0 },
        { w: T, h: H, d: B, px: -A / 2 + T / 2, py: 0, pz: 0 },
        { w: T, h: H, d: B, px: A / 2 - T / 2, py: 0, pz: 0 },
        { w: A, h: H, d: T, px: 0, py: 0, pz: -B / 2 + T / 2 },
      ].forEach(p => _box(pivot, p.w, p.h, p.d, m.galv, m.edge, [p.px, p.py, p.pz]));
      const cg = new THREE.Group(); _hollowRound(cg, H2, D / 2, D / 2 * 0.09); cg.position.set(A / 2 + H2 / 2, 0, 0); pivot.add(cg);
      _3d.dimLines = [
        { p1: _v3(-A / 2, H / 2 + 0.12, 0), p2: _v3(A / 2, H / 2 + 0.12, 0), text: `${f.A} mm` },
        { p1: _v3(-A / 2 - 0.14, -H / 2, 0), p2: _v3(-A / 2 - 0.14, H / 2, 0), text: `H ${f.H} mm` },
        { p1: _v3(-A / 2 - 0.14, H / 2 + 0.1, -B / 2), p2: _v3(-A / 2 - 0.14, H / 2 + 0.1, B / 2), text: `${f.B} mm` },
        { p1: _v3(A / 2 + H2 / 2 + 0.05, D / 2 + 0.06, 0), p2: _v3(A / 2 + H2 / 2 + 0.05, -D / 2 - 0.06, 0), text: `Ø${f.D} mm`, color: '#D72B2B' },
      ]; _fitCam(A + H2, H, B); break;
    }
    case 'plenum_top': {
      const A = (+f.A || 600) * S, B = (+f.B || 400) * S, H = (+f.H || 300) * S, D = (+f.D || 200) * S, H2 = (+f.H2 || 150) * S;
      const T = Math.min(A, B, H) * 0.08;
      [
        { w: A, h: T, d: B, px: 0, py: -H / 2 + T / 2, pz: 0 },
        { w: T, h: H, d: B, px: -A / 2 + T / 2, py: 0, pz: 0 },
        { w: T, h: H, d: B, px: A / 2 - T / 2, py: 0, pz: 0 },
        { w: A, h: H, d: T, px: 0, py: 0, pz: -B / 2 + T / 2 },
        { w: A, h: H, d: T, px: 0, py: 0, pz: B / 2 - T / 2 },
      ].forEach(p => _box(pivot, p.w, p.h, p.d, m.galv, m.edge, [p.px, p.py, p.pz]));
      const cg = new THREE.Group(); _hollowRound(cg, H2, D / 2, D / 2 * 0.09); cg.rotation.z = Math.PI / 2; cg.position.set(0, H / 2 + H2 / 2, 0); pivot.add(cg);
      _3d.dimLines = [
        { p1: _v3(-A / 2, H / 2 + H2 + 0.12, 0), p2: _v3(A / 2, H / 2 + H2 + 0.12, 0), text: `${f.A} mm` },
        { p1: _v3(-A / 2 - 0.14, -H / 2, 0), p2: _v3(-A / 2 - 0.14, H / 2, 0), text: `H ${f.H} mm` },
        { p1: _v3(-A / 2 - 0.14, H / 2 + 0.1, -B / 2), p2: _v3(-A / 2 - 0.14, H / 2 + 0.1, B / 2), text: `${f.B} mm` },
        { p1: _v3(A / 2 + 0.08, H / 2 + H2 / 2, 0), p2: _v3(-A / 2 - 0.08, H / 2 + H2 / 2, 0), text: `Ø${f.D} mm`, color: '#D72B2B' },
      ]; _fitCam(A, H + H2, B); break;
    }
    case 'wire_mesh': {
      const A = (+f.A || 600) * S, B = (+f.B || 400) * S;
      const g1 = new THREE.PlaneGeometry(A, B, 12, 8);
      _mesh(pivot, g1, new THREE.MeshPhongMaterial({ color: 0xaabbcc, side: THREE.DoubleSide }));
      _mesh(pivot, new THREE.PlaneGeometry(A, B, 12, 8), new THREE.MeshBasicMaterial({ color: 0x4466aa, wireframe: true }));
      _3d.dimLines = [
        { p1: _v3(-A / 2, B / 2 + 0.1, 0), p2: _v3(A / 2, B / 2 + 0.1, 0), text: `${f.A} mm` },
        { p1: _v3(-A / 2 - 0.12, -B / 2, 0), p2: _v3(-A / 2 - 0.12, B / 2, 0), text: `${f.B} mm` },
      ]; _fitCam(A, B, 0.1); break;
    }
    case '4ways': {
      const A = (+f.A || 400) * S, B = (+f.B || 300) * S, C = (+f.C || 200) * S, D = (+f.D2 || 150) * S, L = (+f.L || 300) * S;
      const bLen = L * 0.9, bT = Math.min(C, D) * 0.09;
      _box(pivot, A, B, A, m.galv, m.edge);
      [[1, 0, 0, 0], [-1, 0, 0, Math.PI], [0, 0, 1, -Math.PI / 2], [0, 0, -1, Math.PI / 2]].forEach(([dx, , dz, ry]) => {
        const bg = new THREE.Group(); _hollowRect(bg, bLen, C, D, bT);
        bg.rotation.y = ry; bg.position.set(dx * (A / 2 + bLen / 2), 0, dz * (A / 2 + bLen / 2)); pivot.add(bg);
      });
      _3d.dimLines = [
        { p1: _v3(-A / 2 - 0.12, -B / 2, 0), p2: _v3(-A / 2 - 0.12, B / 2, 0), text: `${f.B} mm` },
        { p1: _v3(A / 2 + bLen + 0.1, -D / 2, 0), p2: _v3(A / 2 + bLen + 0.1, D / 2, 0), text: `${f.D2 || ''} mm`, color: '#D72B2B' },
      ]; _fitCam(A + bLen * 2, B, A + bLen * 2); break;
    }
    default: {
      const W = (+f.A || 400) * S || 0.5, H = (+f.B || 300) * S || 0.38, L = (+f.L || 600) * S || 0.75, T = Math.min(W, H) * 0.09;
      _hollowRect(pivot, L, W, H, T); _fitCam(L, H, W); break;
    }
  }
}
