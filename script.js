const DUCTS = {
  rect_straight: {
    label: 'Rectangular Straight Duct',
    tag: 'Straight',
    fields: [{ id: 'A', label: 'Width A' }, { id: 'B', label: 'Height B' }, { id: 'L', label: 'Length L' }],
    calc: f => `Ducting: ${f.A}×${f.B}×L${f.L}`,
    // Excel: Perimeter = 2*(A+B)/1000 m, Eq.Length = L(m), Area = Perimeter * Eq.Length
    area: f => 2 * ((+f.A) / 1000 + (+f.B) / 1000) * ((+f.L) / 1000),
  },
  round_straight: {
    label: 'Round Duct',
    tag: 'Round',
    fields: [{ id: 'D', label: 'Diameter Ø' }, { id: 'L', label: 'Length L' }],
    calc: f => `Round duct: Ø${f.D}×L${f.L}`,
    // Excel: Perimeter = PI*D/1000, Eq.Length = L/1000
    area: f => Math.PI * ((+f.D) / 1000) * ((+f.L) / 1000),
  },
  rect_elbow90: {
    label: 'Rectangular Elbow 90°',
    tag: 'Elbow 90°',
    fields: [{ id: 'A', label: 'Width A' }, { id: 'B', label: 'Height B' }, { id: 'R', label: 'Inner Radius R' }, { id: 'L', label: 'Arm Length L' }],
    calc: f => `Elbow 90°: ${f.A}×${f.B}×R${f.R}×L${f.L}`,
    // Excel: Perimeter=2*(A+B)/1000, EqLen = R/1000*1.2 + L/1000 (R=inner radius, L=straight arm)
    area: f => { const a = +f.A, b = +f.B, r = +f.R, l = +f.L; return 2 * (a + b) / 1000 * (r / 1000 * 1.2 + l / 1000); },
  },
  rect_elbow45: {
    label: 'Rectangular Elbow 45°',
    tag: 'Elbow 45°',
    fields: [{ id: 'A', label: 'Width A' }, { id: 'B', label: 'Height B' }, { id: 'R', label: 'Inner Radius R' }, { id: 'L', label: 'Arm Length L' }],
    calc: f => `Elbow 45°: ${f.A}×${f.B}×R${f.R}×L${f.L}`,
    // Excel: Perimeter=2*(A+B)/1000, EqLen = R/1000*1.2 + L/1000 (R=inner radius, L=straight arm)
    area: f => { const a = +f.A, b = +f.B, r = +f.R, l = +f.L; return 2 * (a + b) / 1000 * (r / 1000 * 1.2 + l / 1000); },
  },
  round_elbow90: {
    label: 'Round Elbow 90°',
    tag: 'Round Elbow',
    fields: [{ id: 'D', label: 'Diameter Ø' }, { id: 'R', label: 'Bend Radius R' }, { id: 'L', label: 'Arm Length L' }],
    calc: f => `Round elbow 90°: Ø${f.D}×R${f.R}×L${f.L}`,
    // Excel: Perimeter=PI*D/1000, EqLen = R/1000*1.2 + L/1000
    area: f => { const d = +f.D, r = +f.R, l = +f.L; return Math.PI * d / 1000 * (r / 1000 * 1.2 + l / 1000); },
  },
  duct_reducer: {
    label: 'Duct Reducer (Rect→Rect)',
    tag: 'Reducer',
    fields: [{ id: 'A', label: 'Start Width A' }, { id: 'B', label: 'Start Height B' }, { id: 'C', label: 'End Width C' }, { id: 'D2', label: 'End Height D' }, { id: 'L', label: 'Length L' }],
    calc: f => `Duct reducer: (${f.A}×${f.B})→(${f.C}×${f.D2})×L${f.L}`,
    // Excel: Perimeter=2*(A+B)/1000 (larger end), EqLen=L/1000*1.2
    area: f => { const a = +f.A, b = +f.B, l = +f.L; return 2 * (a + b) / 1000 * (l / 1000 * 1.2); },
  },
  rect_to_round: {
    label: 'Rectangle to Round',
    tag: 'Rect→Round',
    fields: [{ id: 'A', label: 'Rect Width A' }, { id: 'B', label: 'Rect Height B' }, { id: 'D', label: 'Round Ø' }, { id: 'L', label: 'Length L' }],
    calc: f => `Rect→Round: ${f.A}×${f.B}→Ø${f.D}×L${f.L}`,
    // Excel: Perimeter=2*(A+B)/1000 (larger rect end), EqLen=L/1000*1.2
    area: f => 2 * ((+f.A) + (+f.B)) / 1000 * ((+f.L) / 1000 * 1.2),
  },
  reducer_duct: {
    label: 'Reducer Duct (A×B→C×D×L)',
    tag: 'Reducer Duct',
    fields: [{ id: 'A', label: 'Large Width A' }, { id: 'B', label: 'Large Height B' }, { id: 'C', label: 'Small Width C' }, { id: 'D2', label: 'Small Height D' }, { id: 'L', label: 'Length L' }],
    calc: f => `Reducer: ${f.A}×${f.B}→${f.C}×${f.D2}×L${f.L}`,
    // Excel: Perimeter=2*(A+B)/1000 (larger end), EqLen=L/1000*1.2
    area: f => { const a = +f.A, b = +f.B, l = +f.L; return 2 * (a + b) / 1000 * (l / 1000 * 1.2); },
  },
  reducer_duct_r: {
    label: 'Reducer Duct with Offset R',
    tag: 'Reducer+Offset',
    fields: [{ id: 'A', label: 'Large Width A' }, { id: 'B', label: 'Large Height B' }, { id: 'C', label: 'Small Width C' }, { id: 'D2', label: 'Small Height D' }, { id: 'L', label: 'Length L' }, { id: 'R', label: 'Offset R' }],
    calc: f => `Reducer+offset: ${f.A}×${f.B}→${f.C}×${f.D2}×L${f.L}×R${f.R}`,
    // Excel: Perimeter=2*(A+B)/1000 (larger end), EqLen=L/1000*1.2
    area: f => { const a = +f.A, b = +f.B, l = +f.L; return 2 * (a + b) / 1000 * (l / 1000 * 1.2); },
  },
  collar_duct: {
    label: 'Collar Duct',
    tag: 'Collar',
    fields: [{ id: 'A', label: 'Start Width A' }, { id: 'B', label: 'Start Height B' }, { id: 'C', label: 'End Width C' }, { id: 'D2', label: 'End Height D' }, { id: 'L', label: 'Length L' }],
    calc: f => `Collar: ${f.A}×${f.B}→${f.C}×${f.D2}×L${f.L}`,
    // Excel: Perimeter=2*(A+B)/1000 (larger end), EqLen=L/1000*1.2
    area: f => { const a = +f.A, c = +f.C, l = +f.L; return 2 * (a + c) / 1000 * (l / 1000 * 1.2); },
  },
  offset_duct: {
    label: 'Offset Duct',
    tag: 'Offset',
    fields: [{ id: 'A', label: 'Width A' }, { id: 'B', label: 'Height B' }, { id: 'R', label: 'Offset Drop R' }, { id: 'L', label: 'Total Length L' }],
    calc: f => `Offset: ${f.A}×${f.B}×R${f.R}×L${f.L}`,
    // Excel: Perimeter=2*(A+B)/1000, EqLen = L/1000*1.2 + R/1000 (offset drop)
    area: f => { const a = +f.A, b = +f.B, l = +f.L, r = +f.R; return 2 * (a + b) / 1000 * (l / 1000 * 1.2 + r / 1000); },
  },
  y_duct: {
    label: 'Y-Ducting (Branch Takeoff)',
    tag: 'Y-Duct',
    fields: [
      { id: 'A', label: 'Main Width A' },
      { id: 'B', label: 'Main Height B' },
      { id: 'E', label: 'Branch Width E' },
      { id: 'F', label: 'Branch Height F' },
      { id: 'C', label: 'Side Width C' },
      { id: 'D', label: 'Side Height D' },
      { id: 'R', label: 'Fillet Radius R' },
      { id: 'L', label: 'Total Length L' },
    ],
    calc: f => `Branch takeoff: ${f.A}×${f.B} + branch ${f.E}×${f.F} + side ${f.C}×${f.D} R${f.R} × L${f.L}`,
    area: f => {
      const a = +f.A, b = +f.B, e = +f.E, ff = +f.F, l = +f.L, r = +f.R;
      const mainPerim = 2 * (a + b) / 1000;
      const branchPerim = 2 * (e + ff) / 1000;
      return mainPerim * (l / 1000) + branchPerim * (Math.PI / 2 * r / 1000);
    },
  },
  butterfly_rect: {
    label: 'Butterfly Duct (Rect)',
    tag: 'Butterfly',
    fields: [{ id: 'A', label: 'Main Width A' }, { id: 'B', label: 'Main Height B' }, { id: 'C', label: 'Left Branch C' }, { id: 'D2', label: 'Left Height D' }, { id: 'R1', label: 'Radius R1' }, { id: 'E', label: 'Right Branch E' }, { id: 'F', label: 'Right Height F' }, { id: 'R2', label: 'Radius R2' }],
    calc: f => `Butterfly: ${f.A}×${f.B}→${f.C}×${f.D2}R${f.R1}↔${f.E}×${f.F}R${f.R2}`,
    // Excel: Left branch = 2*(C+D)/1000 * PI/2*R1/1000 + Right branch = 2*(E+F)/1000 * PI/2*R2/1000 + Main neck = 2*(A+B)/1000 * (R1+R2)/2/1000
    area: f => {
      const a = +f.A, b = +f.B, c = +f.C, d = +f.D2, r1 = +f.R1, e = +f.E, ff = +f.F, r2 = +f.R2;
      return 2 * (c + d) / 1000 * (Math.PI / 2 * r1 / 1000) + 2 * (e + ff) / 1000 * (Math.PI / 2 * r2 / 1000) + 2 * (a + b) / 1000 * ((r1 + r2) / 2 / 1000);
    },
  },
  r_type: {
    label: 'R-Type Duct',
    tag: 'R-Type',
    fields: [{ id: 'A', label: 'Main Width A' }, { id: 'B', label: 'Main Height B' }, { id: 'C', label: 'Branch 1 C' }, { id: 'D2', label: 'Branch 1 Height D' }, { id: 'E', label: 'Branch 2 E' }, { id: 'F', label: 'Branch 2 Height F' }, { id: 'R', label: 'Radius R' }, { id: 'L', label: 'Length L' }],
    calc: f => `R-type: ${f.A}×${f.B}→${f.E}×${f.F}↔${f.C}×${f.D2}R${f.R}L${f.L}`,
    // Excel: main straight perim*(L/2/1000) + branch elbow perim*(PI/2*R/1000) + outlet perim*(L/2/1000)
    area: f => {
      const a = +f.A, b = +f.B, c = +f.C, d = +f.D2, e = +f.E, ff = +f.F, l = +f.L, r = +f.R;
      return 2 * (a + b) / 1000 * (l / 1000 * 0.5) + 2 * (c + d) / 1000 * (Math.PI / 2 * r / 1000) + 2 * (e + ff) / 1000 * (l / 1000 * 0.5);
    },
  },
  plenum_box: {
    label: 'Plenum Box (Side Inlet)',
    tag: 'Plenum Side',
    fields: [{ id: 'A', label: 'Body Width A' }, { id: 'B', label: 'Body Depth B' }, { id: 'H', label: 'Body Height H' }, { id: 'D', label: 'Connector Ø' }, { id: 'H2', label: 'Connector Height H2' }],
    calc: f => `Plenum: ${f.A}×${f.B}×H${f.H} Conn:Ø${f.D}×H${f.H2}`,
    // Excel: box surface = (2*A*B + 2*A*H + 2*B*H)/1e6 + PI*D*H2/1e6
    area: f => { const a = +f.A, b = +f.B, h = +f.H, d = +f.D, h2 = +f.H2; return (2 * a * b + 2 * a * h + 2 * b * h) / 1e6 + Math.PI * d * h2 / 1e6; },
  },
  plenum_top: {
    label: 'Plenum Box (Top Connector)',
    tag: 'Plenum Top',
    fields: [{ id: 'A', label: 'Body Width A' }, { id: 'B', label: 'Body Depth B' }, { id: 'H', label: 'Body Height H' }, { id: 'D', label: 'Connector Ø' }, { id: 'H2', label: 'Connector Height H2' }],
    calc: f => `Plenum top: ${f.A}×${f.B}×H${f.H} Conn:Ø${f.D}×H${f.H2}`,
    // Excel: box surface = (2*A*B + 2*A*H + 2*B*H)/1e6 + PI*D*H2/1e6
    area: f => { const a = +f.A, b = +f.B, h = +f.H, d = +f.D, h2 = +f.H2; return (2 * a * b + 2 * a * h + 2 * b * h) / 1e6 + Math.PI * d * h2 / 1e6; },
  },
  canvas_round: {
    label: 'Canvas Connection (Round)',
    tag: 'Canvas Round',
    fields: [{ id: 'D', label: 'Diameter Ø' }, { id: 'L', label: 'Canvas Length L' }],
    calc: f => `Canvas round: Ø${f.D}×L${f.L}`,
    // Excel: Perimeter = PI*D/1000, EqLen = L/1000 (canvas, no multiplier)
    area: f => Math.PI * ((+f.D) / 1000) * ((+f.L) / 1000),
  },
  canvas_rect: {
    label: 'Canvas Connection (Rect)',
    tag: 'Canvas Rect',
    fields: [{ id: 'A', label: 'Width A' }, { id: 'B', label: 'Height B' }, { id: 'L', label: 'Canvas Length L' }],
    calc: f => `Canvas rect: ${f.A}×${f.B}×L${f.L}`,
    // Excel: Perimeter = 2*(A+B)/1000, EqLen = L/1000 (canvas, no multiplier)
    area: f => 2 * ((+f.A) + (+f.B)) / 1000 * ((+f.L) / 1000),
  },
  fan_conn: {
    label: 'Fan Connection',
    tag: 'Fan Conn',
    fields: [{ id: 'A', label: 'Inlet Width A' }, { id: 'B', label: 'Inlet Height B' }, { id: 'C', label: 'Outlet Width C' }, { id: 'D2', label: 'Outlet Height D' }, { id: 'L', label: 'Length L' }],
    calc: f => `Fan conn: ${f.A}×${f.B}→${f.C}×${f.D2}×L${f.L}`,
    // Excel: Perimeter = 2*(A+B)/1000 (larger inlet end), EqLen = L/1000*1.2
    area: f => { const a = +f.A, b = +f.B, l = +f.L; return 2 * (a + b) / 1000 * (l / 1000 * 1.2); },
  },
  wire_mesh: {
    label: 'Wire Mesh',
    tag: 'Wire Mesh',
    fields: [{ id: 'A', label: 'Length A' }, { id: 'B', label: 'Width B' }],
    calc: f => `Wire mesh: ${f.A}×${f.B}`,
    // Excel: flat sheet area = A*B / 1e6 (mm² → m²)
    area: f => (+f.A) * (+f.B) / 1e6,
  },
  transfer_air: {
    label: 'Transfer Air Duct',
    tag: 'Transfer Air',
    fields: [{ id: 'A', label: 'Width A' }, { id: 'B', label: 'Height B' }, { id: 'L', label: 'Length L' }],
    calc: f => `Transfer air: ${f.A}×${f.B}×L${f.L}`,
    // Excel: Perimeter = 2*(A+B)/1000, EqLen = L/1000 (straight duct, no multiplier)
    area: f => 2 * ((+f.A) + (+f.B)) / 1000 * ((+f.L) / 1000),
  },
  '4ways': {
    label: '4-Ways Duct',
    tag: '4-Ways',
    fields: [{ id: 'A', label: 'Main Width A' }, { id: 'B', label: 'Main Height B' }, { id: 'C', label: 'Branch Width C' }, { id: 'D2', label: 'Branch Height D' }, { id: 'R', label: 'Radius R' }, { id: 'L', label: 'Length L' }],
    calc: f => `4-ways: ${f.A}×${f.B}→4×(${f.C}×${f.D2}R${f.R})×L${f.L}`,
    // Excel: main body = 2*(A+B)/1000 * L/1000 + 4 branches = 4 * 2*(C+D)/1000 * PI/2*R/1000
    area: f => {
      const a = +f.A, b = +f.B, c = +f.C, d = +f.D2, r = +f.R, l = +f.L;
      return 2 * (a + b) / 1000 * (l / 1000) + 4 * 2 * (c + d) / 1000 * (Math.PI / 2 * r / 1000);
    },
  }
};

// ══════════════════════════════════════════════════════════════
//  3D DUCT VIEWER  (Three.js r128) — ALL duct types supported
//  Features: drag rotate, scroll/pinch zoom, hollow walls
// ══════════════════════════════════════════════════════════════

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

// ── Dim labels ────────────────────────────────
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

// ── Materials ─────────────────────────────────
function _mats() {
  return {
    galv: new THREE.MeshPhongMaterial({ color: 0xbacedd, specular: 0x99aabb, shininess: 55, side: THREE.DoubleSide }),
    inner: new THREE.MeshPhongMaterial({ color: 0x8898aa, specular: 0x667788, shininess: 30, side: THREE.DoubleSide }),
    flange: new THREE.MeshPhongMaterial({ color: 0x1a2a3a, specular: 0x334455, shininess: 50, side: THREE.DoubleSide }),
    edge: new THREE.LineBasicMaterial({ color: 0x1a3050 }),
    red: new THREE.MeshPhongMaterial({ color: 0xcc2222, specular: 0x881111, shininess: 40, side: THREE.DoubleSide }),
  };
}

// ── Helpers ───────────────────────────────────
function _mesh(pivot, geo, mat, pos) { const m = new THREE.Mesh(geo, mat); if (pos) m.position.set(...pos); pivot.add(m); return m; }
function _edge(pivot, geo, mat, pos) { const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), mat); if (pos) e.position.set(...pos); pivot.add(e); return e; }
function _box(pivot, w, h, d, mat, edge, pos) { const g = new THREE.BoxGeometry(w, h, d); _mesh(pivot, g, mat, pos); if (edge) _edge(pivot, g, edge, pos); return g; }
function _fitCam(L, H, W) { if (!_3d) return; const s = Math.max(L, H, W) * 1.9; _3d.setBase(s * 0.9, s * 0.65, s * 1.1); }
function _v3(x, y, z) { return new THREE.Vector3(x, y, z); }

// ── Hollow rect duct ──────────────────────────
// 4 separate wall slabs, both ends open
function _hollowRect(grp, L, W, H, T) {
  const m = _mats();
  T = Math.min(T, W / 2 * 0.9, H / 2 * 0.9);
  [
    { w: L, h: T, d: W, py: H / 2 - T / 2, pz: 0 },  // top
    { w: L, h: T, d: W, py: -H / 2 + T / 2, pz: 0 },  // bottom
    { w: L, h: H - T * 2, d: T, py: 0, pz: W / 2 - T / 2 }, // front
    { w: L, h: H - T * 2, d: T, py: 0, pz: -W / 2 + T / 2 }, // back
  ].forEach(p => {
    _box(grp, p.w, p.h, p.d, m.galv, m.edge, [0, p.py, p.pz]);
  });
}

// ── Flange rect ───────────────────────────────
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

// ── Hollow round ─────────────────────────────
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

// ── Hollow reducer ────────────────────────────
function _hollowReducer(grp, W1, H1, W2, H2, L) {
  const m = _mats(); const half = L / 2;
  const T = Math.max(Math.min(W1, H1, W2, H2) * 0.08, 0.018);
  const w1i = W1 - T * 2, h1i = H1 - T * 2, w2i = W2 - T * 2, h2i = H2 - T * 2;
  // outer 4 faces + inner 4 faces
  const faces = [
    {
      vO: [-half, H1 / 2, W1 / 2, -half, H1 / 2, -W1 / 2, half, H2 / 2, -W2 / 2, half, H2 / 2, W2 / 2], // top outer
      vI: [-half, h1i / 2, w1i / 2, -half, h1i / 2, -w1i / 2, half, h2i / 2, -w2i / 2, half, h2i / 2, w2i / 2]
    },
    {
      vO: [-half, -H1 / 2, -W1 / 2, -half, -H1 / 2, W1 / 2, half, -H2 / 2, W2 / 2, half, -H2 / 2, -W2 / 2], // bot outer
      vI: [-half, -h1i / 2, -w1i / 2, -half, -h1i / 2, w1i / 2, half, -h2i / 2, w2i / 2, half, -h2i / 2, -w2i / 2]
    },
    {
      vO: [-half, -H1 / 2, W1 / 2, -half, H1 / 2, W1 / 2, half, H2 / 2, W2 / 2, half, -H2 / 2, W2 / 2],  // front outer
      vI: [-half, -h1i / 2, w1i / 2, -half, h1i / 2, w1i / 2, half, h2i / 2, w2i / 2, half, -h2i / 2, w2i / 2]
    },
    {
      vO: [-half, H1 / 2, -W1 / 2, -half, -H1 / 2, -W1 / 2, half, -H2 / 2, -W2 / 2, half, H2 / 2, -W2 / 2],  // back outer
      vI: [-half, h1i / 2, -w1i / 2, -half, -h1i / 2, -w1i / 2, half, -h2i / 2, -w2i / 2, half, h2i / 2, -w2i / 2]
    },
  ];
  faces.forEach(({ vO, vI }) => {
    const go = new THREE.BufferGeometry(); go.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vO), 3)); go.setIndex([0, 1, 2, 0, 2, 3]); go.computeVertexNormals(); _mesh(grp, go, m.galv); _edge(grp, go, m.edge);
    const gi = new THREE.BufferGeometry(); gi.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vI), 3)); gi.setIndex([0, 2, 1, 0, 3, 2]); gi.computeVertexNormals(); _mesh(grp, gi, m.inner);
  });
  // end cap rings
  [{ x: -half, W: W1, H: H1, Wi: w1i, Hi: h1i }, { x: half, W: W2, H: H2, Wi: w2i, Hi: h2i }].forEach(({ x, W, H, Wi, Hi }) => {
    const cv = new Float32Array([W / 2, H / 2, 0, Wi / 2, Hi / 2, 0, Wi / 2, -Hi / 2, 0, W / 2, -H / 2, 0, -W / 2, H / 2, 0, -Wi / 2, Hi / 2, 0, -Wi / 2, -Hi / 2, 0, -W / 2, -H / 2, 0]);
    const ci = [0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7];
    const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.BufferAttribute(cv, 3)); cg.setIndex(ci); cg.computeVertexNormals();
    const cm = new THREE.Mesh(cg, m.flange); cm.rotation.y = Math.PI / 2; cm.position.x = x; grp.add(cm);
  });
}

// ── Rect-to-round transition ──────────────────
function _rectToRound(grp, W, H, R, L) {
  const m = _mats(); const segs = 24, half = L / 2;
  for (let i = 0; i < segs; i++) {
    const t0 = i / segs * Math.PI * 2, t1 = (i + 1) / segs * Math.PI * 2, tm = (t0 + t1) / 2;
    // left end: rect corner blended, right end: circle
    const blend = t => { // returns [x,y] that morphs rect→circle
      const cx = Math.cos(t), cy = Math.sin(t);
      const rx = W / 2 * Math.sign(cx) || 0.001, ry = H / 2 * Math.sign(cy) || 0.001;
      const rectX = W / 2 * cx / (Math.abs(cy) > 1e-9 ? Math.abs(cy) * W / H + Math.abs(cx) : 1);
      return [W / 2 * cx, H / 2 * cy]; // simplified: use rect at start
    };
    const [x0, y0] = blend(t0), [x1, y1] = blend(t1);
    const cx0 = R * Math.cos(t0), cy0 = R * Math.sin(t0), cx1 = R * Math.cos(t1), cy1 = R * Math.sin(t1);
    const verts = new Float32Array([-half, y0, x0, -half, y1, x1, half, cy1, cx1, half, cy0, cx0]);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(verts, 3)); g.setIndex([0, 1, 2, 0, 2, 3]); g.computeVertexNormals(); _mesh(grp, g, m.galv);
  }
  // rect end cap ring
  const rs = new THREE.Shape(); rs.moveTo(-W / 2, -H / 2); rs.lineTo(W / 2, -H / 2); rs.lineTo(W / 2, H / 2); rs.lineTo(-W / 2, H / 2); rs.closePath();
  const rh = new THREE.Path(); const ri = 0.88; rh.moveTo(-W / 2 * ri, -H / 2 * ri); rh.lineTo(W / 2 * ri, -H / 2 * ri); rh.lineTo(W / 2 * ri, H / 2 * ri); rh.lineTo(-W / 2 * ri, H / 2 * ri); rh.closePath(); rs.holes.push(rh);
  const rcg = new THREE.ShapeGeometry(rs, 4); const rcm = new THREE.Mesh(rcg, m.flange); rcm.rotation.y = Math.PI / 2; rcm.position.x = -half; grp.add(rcm);
  // round end cap ring
  const cs = new THREE.Shape(); cs.absarc(0, 0, R, 0, Math.PI * 2, false); const ch = new THREE.Path(); ch.absarc(0, 0, R * 0.87, 0, Math.PI * 2, true); cs.holes.push(ch);
  const ccg = new THREE.ShapeGeometry(cs, 32); const ccm = new THREE.Mesh(ccg, m.flange); ccm.rotation.y = Math.PI / 2; ccm.position.x = half; grp.add(ccm);
}

// ── Hollow Y-Duct (Asymmetric Shoe Branch) ──────────
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

  // Main duct body: keep the trunk straight through, then cut the front face for the shoe branch.
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

  // Branch top and bottom follow the sample's top-view shoe shape:
  // a quarter-radius throat followed by a straight rectangular outlet.
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

  // Straight outlet wall and square crotch face, matching the front-side branch in the template.
  if (x_c - x_arc > T) {
    _box(grp, x_c - x_arc, branchH, T, m.galv, m.edge, [(x_arc + x_c) / 2, branchY, z_br_front - T / 2]);
  }
  _box(grp, T, branchH, R, m.galv, m.edge, [x_c - T / 2, branchY, z_front + R / 2]);

  // Curved outside wall at radius R.
  const arcG = new THREE.CylinderGeometry(R, R, FF, 16, 1, true, Math.PI / 2, Math.PI / 2);
  const arcM = new THREE.Mesh(arcG, m.galv);
  arcM.position.set(x_in, branchY, z_br_front);
  grp.add(arcM);
  _edge(grp, arcG, m.edge, [x_in, branchY, z_br_front]);

  // Flanges
  _flangeRect(grp, x_in, A, B, m);
  _flangeRect(grp, x_out, C, D, m);

  const f_branch = new THREE.Group();
  _flangeRect(f_branch, 0, E, FF, m);
  f_branch.rotation.y = -Math.PI / 2;
  f_branch.position.set(x_arc + E / 2, branchY, z_br_front);
  grp.add(f_branch);
}

// ══════════════════════════════════════════════
//  MAIN DISPATCHER
// ══════════════════════════════════════════════
function build3DDuct(key, f) {
  if (!_3d) return;
  const { pivot } = _3d;
  while (pivot.children.length) pivot.remove(pivot.children[0]);
  _3d.dimLines = [];
  const m = _mats();
  const S = 1 / 800;

  switch (key) {

    // ──── Rectangular Straight / Transfer Air ────
    case 'rect_straight': case 'transfer_air': {
      const W = (+f.A || 400) * S, H = (+f.B || 300) * S, L = (+f.L || 600) * S, T = Math.min(W, H) * 0.09;
      _hollowRect(pivot, L, W, H, T);
      _flangeRect(pivot, -L / 2, W, H, m); _flangeRect(pivot, L / 2, W, H, m);
      if (key === 'transfer_air') {
        // top/bottom diffuser grilles
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

    // ──── Canvas Rect ────
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

    // ──── Round Straight ────
    case 'round_straight': {
      const R = (+f.D || 400) / 2 * S, L = (+f.L || 600) * S, T = R * 0.09;
      _hollowRound(pivot, L, R, T);
      _3d.dimLines = [
        { p1: _v3(-L / 2, 0, 0), p2: _v3(L / 2, 0, 0), text: `${f.L} mm` },
        { p1: _v3(0, R + 0.07, 0), p2: _v3(0, -R - 0.07, 0), text: `Ø${f.D} mm`, color: '#D72B2B' },
      ]; _fitCam(L, R * 2, R * 2); break;
    }

    // ──── Canvas Round ────
    case 'canvas_round': {
      const R = (+f.D || 400) / 2 * S, L = (+f.L || 600) * S, T = R * 0.09;
      _hollowRound(pivot, L, R, T);
      [-L / 2, L / 2].forEach(x => { const g = new THREE.CylinderGeometry(R * 1.06, R * 1.06, 0.045, 32); const bm = new THREE.Mesh(g, m.red); bm.rotation.z = Math.PI / 2; bm.position.x = x; pivot.add(bm); });
      _3d.dimLines = [
        { p1: _v3(-L / 2, 0, 0), p2: _v3(L / 2, 0, 0), text: `${f.L} mm` },
        { p1: _v3(0, R + 0.08, 0), p2: _v3(0, -R - 0.08, 0), text: `Ø${f.D} mm`, color: '#D72B2B' },
      ]; _fitCam(L, R * 2, R * 2); break;
    }

    // ──── Rect Elbow 90° ────
    // ──── Rect Elbow 90° ────
    // ──── Rect Elbow 90° ────
    // ──── Round Elbow 90° ────
    // ──── Rect Elbow 90° ────
    case 'rect_elbow90': {
      const W = (+f.A || 300) * S, H = (+f.B || 250) * S, RL = (+f.R || 150) * S, L = (+f.L || 300) * S, T = Math.min(W, H) * 0.09;
      const SEGS = 32;
      const Ri = RL, Ro = RL + W, Rc = RL + W / 2;

      // Arc: x = r*sin(a), z = -r*cos(a), a: 0 -> PI/2
      // Start (a=0): (0, 0, -r) with tangent +X  → entry arm along -X
      // End (a=PI/2): (r, 0, 0) with tangent +Z  → exit arm along +Z
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

      // Entry arm along -X, face at x=0 aligns with bend start
      const arm1 = new THREE.Group(); _hollowRect(arm1, L, W, H, T);
      arm1.position.set(-L / 2, 0, -Rc); pivot.add(arm1);

      // Exit arm along +Z, face at z=0 aligns with bend end
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

    // ──── Rect Elbow 45° ────
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

    // ──── Round Elbow 90° ────
    // ──── Round Elbow 90° ────
    case 'round_elbow90': {
      const R = (+f.D || 250) / 2 * S, bend = (+f.R || 300) * S, L = (+f.L || 250) * S;
      // Torus with correct orientation:
      // rotateZ(-PI/2) then rotateX(PI/2) maps the arc to:
      // start: (0, 0, -bend) with tangent +X
      // end:   (bend, 0, 0) with tangent +Z
      const tg = new THREE.TorusGeometry(bend, R, 16, 32, Math.PI / 2);
      tg.rotateZ(-Math.PI / 2);
      tg.rotateX(Math.PI / 2);
      _mesh(pivot, tg, m.galv);

      // Entry arm along -X, connects to bend start at (0, 0, -bend)
      const ag = new THREE.CylinderGeometry(R, R, L, 32, 1, true);
      ag.rotateZ(Math.PI / 2); // make cylinder along X
      const am = new THREE.Mesh(ag, m.galv);
      am.position.set(-L / 2, 0, -bend);
      pivot.add(am);

      // Exit arm along +Z, connects to bend end at (bend, 0, 0)
      const ag2 = new THREE.CylinderGeometry(R, R, L, 32, 1, true);
      ag2.rotateX(Math.PI / 2); // make cylinder along Z
      const am2 = new THREE.Mesh(ag2, m.galv);
      am2.position.set(bend, 0, L / 2);
      pivot.add(am2);

      _3d.dimLines = [
        { p1: _v3(-L, -R - 0.05, -bend), p2: _v3(0, -R - 0.05, -bend), text: `${f.L} mm` },
        { p1: _v3(0, -R, -bend - 0.1), p2: _v3(0, R, -bend - 0.1), text: `Ø${f.D} mm`, color: '#D72B2B' },
        { p1: _v3(0, R + 0.1, -bend), p2: _v3(bend, R + 0.1, -bend), text: `R ${f.R} mm`, color: '#D72B2B' },
      ];
      _fitCam(L + bend, R * 2 + bend, R * 2); break;
    }

    // ──── Duct Reducer / Reducer Duct / Collar / Fan Conn ────
    // ──── Duct Reducer / Reducer Duct / Collar / Fan Conn ────
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

    // ──── Reducer with Offset R ────
    case 'reducer_duct_r': {
      const W1 = (+f.A || 500) * S, H1 = (+f.B || 400) * S, W2 = (+f.C || 300) * S, H2 = (+(f.D2 || 250)) * S, L = (+f.L || 500) * S, RL = (+f.R || 100) * S;
      _hollowReducer(pivot, W1, H1, W2, H2, L);
      // shift outlet end offset by R vertically
      pivot.children.forEach(c => { if (c.position && c.position.x > 0) c.position.y += RL; });
      _3d.dimLines = [
        { p1: _v3(-L / 2, H1 / 2 + 0.12, 0), p2: _v3(L / 2, H2 / 2 + 0.12 + RL, 0), text: `L ${f.L} mm` },
        { p1: _v3(-L / 2 - 0.13, -H1 / 2, 0), p2: _v3(-L / 2 - 0.13, H1 / 2, 0), text: `${f.B} mm` },
        { p1: _v3(0, 0, W1 / 2 + 0.12), p2: _v3(0, RL, W1 / 2 + 0.12), text: `R ${f.R} mm`, color: '#D72B2B' },
      ]; _fitCam(L, Math.max(H1, H2) + RL, Math.max(W1, W2)); break;
    }

    // ──── Rect to Round ────
    case 'rect_to_round': {
      const W = (+f.A || 500) * S, H = (+f.B || 400) * S, R = (+f.D || 300) / 2 * S, L = (+f.L || 500) * S;
      _rectToRound(pivot, W, H, R, L);
      _3d.dimLines = [
        { p1: _v3(-L / 2, H / 2 + 0.1, 0), p2: _v3(L / 2, R + 0.1, 0), text: `L ${f.L} mm` },
        { p1: _v3(-L / 2 - 0.12, -H / 2, 0), p2: _v3(-L / 2 - 0.12, H / 2, 0), text: `${f.B} mm` },
        { p1: _v3(L / 2 + 0.08, R + 0.05, 0), p2: _v3(L / 2 + 0.08, -R - 0.05, 0), text: `Ø${f.D} mm`, color: '#D72B2B' },
      ]; _fitCam(L, Math.max(H, R * 2), Math.max(W, R * 2)); break;
    }

    // ──── Offset Duct ────
    case 'offset_duct': {
      const A = (+f.A || 400) * S, B = (+f.B || 300) * S, RL = (+f.R || 200) * S, L = (+f.L || 600) * S, T = Math.min(A, B) * 0.09;
      const seg = L / 3;
      // left arm
      const g1 = new THREE.Group(); _hollowRect(g1, seg, A, B, T); g1.position.set(-seg, 0, 0); pivot.add(g1);
      // angled middle
      const mLen = Math.sqrt(seg ** 2 + RL ** 2);
      const ang = Math.atan2(RL, seg);
      const g2 = new THREE.Group(); _hollowRect(g2, mLen, A, B, T); g2.rotation.z = ang; g2.position.set(0, RL / 2, 0); pivot.add(g2);
      // right arm
      const g3 = new THREE.Group(); _hollowRect(g3, seg, A, B, T); g3.position.set(seg, RL, 0); pivot.add(g3);
      _3d.dimLines = [
        { p1: _v3(-seg * 1.5, B / 2 + 0.09, 0), p2: _v3(seg * 1.5, B / 2 + 0.09 + RL, 0), text: `${f.L} mm` },
        { p1: _v3(-seg * 1.5 - 0.12, -B / 2, 0), p2: _v3(-seg * 1.5 - 0.12, B / 2, 0), text: `${f.B} mm` },
        { p1: _v3(0, 0, A / 2 + 0.12), p2: _v3(0, RL, A / 2 + 0.12), text: `R ${f.R} mm`, color: '#D72B2B' },
      ]; _fitCam(L, B + RL, A); break;
    }

    // ──── Y-Duct ────
    case 'y_duct': {
      const A = (+f.A || 200) * S, B = (+f.B || 200) * S;
      const E = (+f.E || 200) * S, FF = (+f.F || 150) * S, L = (+f.L || 375) * S;
      const R = (+f.R || 75) * S;
    
      // pass A,B as the "outlet" C,D too — trunk stays constant, no fake taper
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

    // ──── Butterfly Rect ────
    case 'butterfly_rect': {
      const A = (+f.A || 400) * S, B = (+f.B || 300) * S, C = (+f.C || 300) * S, D = (+f.D2 || 250) * S;
      const R1 = (+f.R1 || 200) * S, E = (+f.E || 300) * S, FF = (+f.F || 250) * S, R2 = (+f.R2 || 200) * S;
      const T = Math.min(A, B) * 0.09;
      // neck (center)
      _hollowRect(pivot, A, A, B, T);
      // left branch
      const lb = new THREE.Group(); _hollowRect(lb, R1 * 1.4, C, D, Math.min(C, D) * 0.09);
      lb.rotation.y = Math.PI / 4; lb.position.set(0, 0, -(R1 * 0.8 + A / 4)); pivot.add(lb);
      // right branch
      const rb = new THREE.Group(); _hollowRect(rb, R2 * 1.4, E, FF, Math.min(E, FF) * 0.09);
      rb.rotation.y = -Math.PI / 4; rb.position.set(0, 0, R2 * 0.8 + A / 4); pivot.add(rb);
      _3d.dimLines = [
        { p1: _v3(-A / 2, B / 2 + 0.1, 0), p2: _v3(A / 2, B / 2 + 0.1, 0), text: `${f.A} mm` },
        { p1: _v3(-A / 2 - 0.12, -B / 2, 0), p2: _v3(-A / 2 - 0.12, B / 2, 0), text: `${f.B} mm` },
        { p1: _v3(0, B / 2 + 0.1, -(R1 + A / 4) + 0.1), p2: _v3(0, B / 2 + 0.1, R2 + A / 4 - 0.1), text: `R1+R2` },
      ]; _fitCam(A + R1 * 0.8, B, R1 + R2 + A); break;
    }

    // ──── R-Type Duct ────
    case 'r_type': {
      const A = (+f.A || 400) * S, B = (+f.B || 300) * S, C = (+f.C || 300) * S, D = (+f.D2 || 250) * S;
      const E = (+f.E || 250) * S, FF = (+f.F || 200) * S, RL = (+f.R || 250) * S, L = (+f.L || 600) * S;
      const T = Math.min(A, B) * 0.09;
      // main straight arm going left
      const main = new THREE.Group(); _hollowRect(main, L * 0.4, A, B, T); main.position.x = -L * 0.25; pivot.add(main);
      // elbow turning up
      const tg = new THREE.TorusGeometry(RL, Math.min(C, D) / 2, 8, 16, Math.PI / 2); tg.rotateX(Math.PI / 2);
      const tm = new THREE.Mesh(tg, m.galv); tm.position.set(L * 0.15, RL / 2, 0); pivot.add(tm);
      // outlet arm going right
      const out = new THREE.Group(); _hollowRect(out, L * 0.4, E, FF, Math.min(E, FF) * 0.09);
      out.rotation.y = Math.PI / 2; out.position.set(L * 0.15, RL, L * 0.25); pivot.add(out);
      _3d.dimLines = [
        { p1: _v3(-L / 2, B / 2 + 0.1, 0), p2: _v3(L * 0.15, B / 2 + 0.1, 0), text: `${f.L} mm` },
        { p1: _v3(-L / 2 - 0.12, -B / 2, 0), p2: _v3(-L / 2 - 0.12, B / 2, 0), text: `${f.B} mm` },
        { p1: _v3(L * 0.15 + 0.1, 0, 0), p2: _v3(L * 0.15 + 0.1, RL, 0), text: `R ${f.R} mm`, color: '#D72B2B' },
      ]; _fitCam(L, B + RL, A); break;
    }

    // ──── Plenum Box (side inlet) ────
    case 'plenum_box': {
      const A = (+f.A || 600) * S, B = (+f.B || 400) * S, H = (+f.H || 300) * S, D = (+f.D || 200) * S, H2 = (+f.H2 || 150) * S;
      const T = Math.min(A, B, H) * 0.08;
      // 5-panel box (open front)
      [
        { w: A, h: T, d: B, px: 0, py: -H / 2 + T / 2, pz: 0 },
        { w: A, h: T, d: B, px: 0, py: H / 2 - T / 2, pz: 0 },
        { w: T, h: H, d: B, px: -A / 2 + T / 2, py: 0, pz: 0 },
        { w: T, h: H, d: B, px: A / 2 - T / 2, py: 0, pz: 0 },
        { w: A, h: H, d: T, px: 0, py: 0, pz: -B / 2 + T / 2 },
      ].forEach(p => _box(pivot, p.w, p.h, p.d, m.galv, m.edge, [p.px, p.py, p.pz]));
      // Round connector on side (right face)
      const cg = new THREE.Group(); _hollowRound(cg, H2, D / 2, D / 2 * 0.09); cg.position.set(A / 2 + H2 / 2, 0, 0); pivot.add(cg);
      _3d.dimLines = [
        { p1: _v3(-A / 2, H / 2 + 0.12, 0), p2: _v3(A / 2, H / 2 + 0.12, 0), text: `${f.A} mm` },
        { p1: _v3(-A / 2 - 0.14, -H / 2, 0), p2: _v3(-A / 2 - 0.14, H / 2, 0), text: `H ${f.H} mm` },
        { p1: _v3(-A / 2 - 0.14, H / 2 + 0.1, -B / 2), p2: _v3(-A / 2 - 0.14, H / 2 + 0.1, B / 2), text: `${f.B} mm` },
        { p1: _v3(A / 2 + H2 / 2 + 0.05, D / 2 + 0.06, 0), p2: _v3(A / 2 + H2 / 2 + 0.05, -D / 2 - 0.06, 0), text: `Ø${f.D} mm`, color: '#D72B2B' },
      ]; _fitCam(A + H2, H, B); break;
    }

    // ──── Plenum Box (top connector) ────
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
      // Round connector on top
      const cg = new THREE.Group(); _hollowRound(cg, H2, D / 2, D / 2 * 0.09); cg.rotation.z = Math.PI / 2; cg.position.set(0, H / 2 + H2 / 2, 0); pivot.add(cg);
      _3d.dimLines = [
        { p1: _v3(-A / 2, H / 2 + H2 + 0.12, 0), p2: _v3(A / 2, H / 2 + H2 + 0.12, 0), text: `${f.A} mm` },
        { p1: _v3(-A / 2 - 0.14, -H / 2, 0), p2: _v3(-A / 2 - 0.14, H / 2, 0), text: `H ${f.H} mm` },
        { p1: _v3(-A / 2 - 0.14, H / 2 + 0.1, -B / 2), p2: _v3(-A / 2 - 0.14, H / 2 + 0.1, B / 2), text: `${f.B} mm` },
        { p1: _v3(A / 2 + 0.08, H / 2 + H2 / 2, 0), p2: _v3(-A / 2 - 0.08, H / 2 + H2 / 2, 0), text: `Ø${f.D} mm`, color: '#D72B2B' },
      ]; _fitCam(A, H + H2, B); break;
    }

    // ──── Wire Mesh ────
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

    // ──── 4-Ways Duct ────
    case '4ways': {
      const A = (+f.A || 400) * S, B = (+f.B || 300) * S, C = (+f.C || 200) * S, D = (+f.D2 || 150) * S, L = (+f.L || 300) * S;
      const bLen = L * 0.9, bT = Math.min(C, D) * 0.09;
      // central box
      _box(pivot, A, B, A, m.galv, m.edge);
      // 4 branches
      [[1, 0, 0, 0], [-1, 0, 0, Math.PI], [0, 0, 1, -Math.PI / 2], [0, 0, -1, Math.PI / 2]].forEach(([dx, , dz, ry]) => {
        const bg = new THREE.Group(); _hollowRect(bg, bLen, C, D, bT);
        bg.rotation.y = ry; bg.position.set(dx * (A / 2 + bLen / 2), 0, dz * (A / 2 + bLen / 2)); pivot.add(bg);
      });
      _3d.dimLines = [
        { p1: _v3(-A / 2 - 0.12, -B / 2, 0), p2: _v3(-A / 2 - 0.12, B / 2, 0), text: `${f.B} mm` },
        { p1: _v3(A / 2 + bLen + 0.1, -D / 2, 0), p2: _v3(A / 2 + bLen + 0.1, D / 2, 0), text: `${f.D2 || ''} mm`, color: '#D72B2B' },
      ]; _fitCam(A + bLen * 2, B, A + bLen * 2); break;
    }

    // ──── Fallback ────
    default: {
      const W = (+f.A || 400) * S || 0.5, H = (+f.B || 300) * S || 0.38, L = (+f.L || 600) * S || 0.75, T = Math.min(W, H) * 0.09;
      _hollowRect(pivot, L, W, H, T); _fitCam(L, H, W); break;
    }
  }
}
// ══════════════════════════════════════════════
//  ORIGINAL APP LOGIC (updated)
// ══════════════════════════════════════════════

let items = [];
let is3DModalOpen = false;

function getDisplayVals(key, t, vals) {
  const ok = t.fields.every(x => +vals[x.id] > 0);
  if (ok) return vals;
  const ph = {};
  t.fields.forEach(f => { ph[f.id] = +vals[f.id] > 0 ? +vals[f.id] : 400; });
  return ph;
}

function updateStaticModalPreview(key, f) {
  const canvasWrap = document.getElementById('duct-3d-canvas-wrap-modal');
  const img = document.getElementById('duct-static-img-modal');
  const overlay = document.getElementById('duct-static-overlay-modal');
  if (!canvasWrap || !img || !overlay) return;
  if (key !== 'y_duct') {
    canvasWrap.style.display = 'block';
    img.style.display = 'none';
    overlay.innerHTML = '';
    return;
  }

  canvasWrap.style.display = 'none';
  img.style.display = 'block';
  const labels = [
    { id: 'A', title: 'A', cls: 'y-duct-label-a' },
    { id: 'B', title: 'B', cls: 'y-duct-label-b' },
    { id: 'E', title: 'E', cls: 'y-duct-label-e' },
    { id: 'F', title: 'F', cls: 'y-duct-label-f' },
    { id: 'C', title: 'C', cls: 'y-duct-label-c' },
    { id: 'D', title: 'D', cls: 'y-duct-label-d' },
    { id: 'R', title: 'R', cls: 'y-duct-label-r' },
    { id: 'L', title: 'L', cls: 'y-duct-label-l' },
  ];
  overlay.innerHTML = labels
    .map(label => {
      const value = +f[label.id] > 0 ? `${f[label.id]} ` : '';
      return `<span class="y-duct-label ${label.cls}">${label.title} ${value}mm</span>`;
    })
    .join('');
}

function dispose3DViewer() {
  if (!_3d) return;
  _3d._dead = true;
  cancelAnimationFrame(_3d.rafId);
  try { _3d.renderer.dispose(); } catch (e) { }
  _3d.container.innerHTML = '';
  _3d = null;
}

function updateStaticPreview(key, f) {
  const wrap = document.getElementById('duct-img-wrap');
  const overlay = document.getElementById('duct-static-overlay');
  if (!wrap) return;
  if (key !== 'y_duct') {
    wrap.classList.remove('is-static-y-duct');
    if (overlay) overlay.innerHTML = '';
    return;
  }

  wrap.classList.add('is-static-y-duct');
  if (!overlay) return;

  const labels = [
    { id: 'A', title: 'A', cls: 'y-duct-label-a' },
    { id: 'B', title: 'B', cls: 'y-duct-label-b' },
    { id: 'E', title: 'E', cls: 'y-duct-label-e' },
    { id: 'F', title: 'F', cls: 'y-duct-label-f' },
    { id: 'C', title: 'C', cls: 'y-duct-label-c' },
    { id: 'D', title: 'D', cls: 'y-duct-label-d' },
    { id: 'R', title: 'R', cls: 'y-duct-label-r' },
    { id: 'L', title: 'L', cls: 'y-duct-label-l' },
  ];

  overlay.innerHTML = labels
    .map(label => {
      const value = +f[label.id] > 0 ? `${f[label.id]} ` : '';
      return `<span class="y-duct-label ${label.cls}">${label.title} ${value}mm</span>`;
    })
    .join('');
}

function getActive3DContainer() {
  return document.getElementById(is3DModalOpen ? 'duct-3d-canvas-wrap-modal' : 'duct-3d-canvas-wrap');
}

function refresh3DViewer() {
  const key = document.getElementById('duct-type').value;
  const t = DUCTS[key];
  const f = getVals();
  const typeEl = document.getElementById('duct-3d-modal-type');
  if (typeEl) typeEl.textContent = t ? t.label : '-';
  if (key === 'y_duct') {
    updateStaticModalPreview(key, f);
    return;
  }
  const container = getActive3DContainer();
  if (!container) return;
  init3DViewer(container);
  build3DDuct(key, getDisplayVals(key, t, f));
}

function buildSelect() {
  const sel = document.getElementById('duct-type');
  Object.entries(DUCTS).forEach(([k, v]) => {
    const o = document.createElement('option');
    o.value = k; o.textContent = v.label;
    sel.appendChild(o);
  });
}

function onTypeChange() {
  const key = document.getElementById('duct-type').value;
  const t = DUCTS[key];

  // Update tag
  document.getElementById('duct-type-tag').textContent = t.tag;

  // Init 3D viewer with current type
  if (key === 'y_duct') dispose3DViewer();
  else refresh3DViewer();

  const c = document.getElementById('dynamic-fields');
  c.innerHTML = '';
  t.fields.forEach((f, i) => {
    const d = document.createElement('div');
    d.className = 'field-group' + (t.fields.length % 2 !== 0 && i === t.fields.length - 1 ? ' full' : '');
    d.innerHTML = `<label class="field-label">${f.label}</label><input type="number" id="f_${f.id}" class="field-input" placeholder="mm" min="0" oninput="updatePreview()">`;
    c.appendChild(d);
  });
  updatePreview();
}

function getVals() {
  const key = document.getElementById('duct-type').value;
  const t = DUCTS[key]; const v = {};
  t.fields.forEach(f => { v[f.id] = document.getElementById('f_' + f.id)?.value || 0; });
  return v;
}

function updatePreview() {
  const key = document.getElementById('duct-type').value;
  const t = DUCTS[key]; const f = getVals();
  const ok = t.fields.every(x => +f[x.id] > 0);
  const displayVals = getDisplayVals(key, t, f);
  const p = document.getElementById('preview-area');
  if (ok) {
    const area = t.area(f);
    p.innerHTML = `<div class="preview-dim">${t.calc(f)}</div><div class="preview-area">${area.toFixed(2)} <span style="font-size:14px;font-weight:400;color:var(--text-secondary)">m²</span></div>`;
  } else {
    p.innerHTML = `<div class="preview-muted">Fill dimensions above to preview surface area</div>`;
  }
  updateStaticPreview(key, f);
  if (key !== 'y_duct') build3DDuct(key, displayVals);
}

function addItem() {
  const key = document.getElementById('duct-type').value;
  const t = DUCTS[key]; const f = getVals();
  const qty = parseInt(document.getElementById('qty').value) || 1;
  if (!t.fields.every(x => +f[x.id] > 0)) { alert('Please fill in all dimensions.'); return; }
  items.push({ key, label: t.label, tag: t.tag, dim: t.calc(f), area: t.area(f), qty, id: Date.now() });
  renderList(); clearFields();
}

function clearFields() {
  const key = document.getElementById('duct-type').value;
  DUCTS[key].fields.forEach(f => { const e = document.getElementById('f_' + f.id); if (e) e.value = ''; });
  document.getElementById('qty').value = 1;
  document.getElementById('preview-area').innerHTML = `<div class="preview-muted">Fill dimensions above to preview surface area</div>`;
}

function removeItem(id) { items = items.filter(i => i.id !== id); renderList(); }

function updateStats() {
  const count = items.length;
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.area * i.qty, 0);
  document.getElementById('stat-items').textContent = count;
  document.getElementById('stat-qty').innerHTML = `${totalQty} <span class="stat-unit">nos</span>`;
  document.getElementById('stat-area').innerHTML = `${total.toFixed(2)} <span class="stat-unit">m²</span>`;
}

function renderList() {
  const el = document.getElementById('item-list');
  const tb = document.getElementById('total-bar');
  updateStats();
  if (!items.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="#8a97b8"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg></div><p>No items yet.<br>Select a duct type and add to list.</p></div>`;
    tb.style.display = 'none'; return;
  }
  tb.style.display = 'flex';
  let html = '', total = 0;
  items.forEach((item, i) => {
    const sub = item.area * item.qty; total += sub;
    html += `<div class="item-row">
      <div class="item-num">${i + 1}</div>
      <div class="item-info">
        <div class="item-name">${item.label}</div>
        <div class="item-dim">${item.dim}</div>
        <span class="item-qty">${item.qty} nos</span>
      </div>
      <div class="item-area">${sub.toFixed(2)}<div class="item-area-unit">m²</div></div>
      <button class="btn-del" onclick="removeItem(${item.id})">✕</button>
    </div>`;
  });
  el.innerHTML = html;
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  document.getElementById('total-items-label').textContent = `${items.length} items · ${totalQty} nos`;
  document.getElementById('total-area-val').innerHTML = `${total.toFixed(2)} <span class="total-m2">m²</span>`;
}

function clearAll() {
  if (!items.length) return;
  if (confirm('Clear all items from the list?')) { items = []; renderList(); }
}

function exportCSV() {
  if (!items.length) { alert('No items to export.'); return; }
  let csv = 'No,Type,Dimensions,Qty,Area per unit (m2),Total area (m2)\n';
  items.forEach((it, i) => csv += `${i + 1},"${it.label}","${it.dim}",${it.qty},${it.area.toFixed(2)},${(it.area * it.qty).toFixed(2)}\n`);
  const tot = items.reduce((s, i) => s + i.area * i.qty, 0);
  csv += `,,,,Grand Total,${tot.toFixed(2)}\n`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'CEP_duct_fabrication.csv'; a.click();
}

function exportPrint() {
  if (!items.length) { alert('No items to export.'); return; }
  const total = items.reduce((s, i) => s + i.area * i.qty, 0);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const rows = items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.label}</td><td style="font-family:monospace">${it.dim}</td><td style="text-align:center">${it.qty}</td><td style="text-align:right">${it.area.toFixed(2)}</td><td style="text-align:right;font-weight:700">${(it.area * it.qty).toFixed(2)}</td></tr>`).join('');
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>CE&P Duct Fabrication Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    body{font-family:'Barlow',sans-serif;margin:0;color:#0d1a3a}
    .hdr{background:#0d2050;padding:16px 28px;display:flex;align-items:center;gap:16px}
    .logo{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;color:#fff}
    .logo-corp{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#fff}
    .logo-tag{font-size:11px;color:rgba(255,255,255,0.5);font-style:italic}
    .red-bar{height:4px;background:#D72B2B}
    .content{padding:24px 28px}
    h2{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;color:#1B3F8B;margin-bottom:4px}
    .meta{font-size:12px;color:#8a97b8;margin-bottom:20px}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th{background:#1B3F8B;color:#fff;padding:10px 12px;text-align:left;font-family:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:0.5px;text-transform:uppercase}
    td{border-bottom:1px solid #dde3f0;padding:9px 12px}
    tr:nth-child(even) td{background:#f4f6fb}
    tfoot td{font-weight:700;background:#1B3F8B;color:#fff;font-family:'Barlow Condensed',sans-serif}
    .sig-section{display:flex;gap:20px;margin-top:50px;justify-content:space-between}
    .sig-box{flex:1;text-align:center;font-size:12px;display:flex;flex-direction:column}
    .sig-line{border-top:2px solid #1B3F8B;height:60px;margin-bottom:12px;flex-grow:1}
    .sig-label{font-weight:600;color:#1B3F8B;font-family:'Barlow Condensed',sans-serif;letter-spacing:0.5px;padding-top:8px}
    .no-print{margin-top:20px}
    @media print{.no-print{display:none}}
  </style></head><body>
  <div class="hdr">
    <div class="logo">CE&amp;P</div>
    <div style="width:1px;height:36px;background:rgba(255,255,255,0.2);margin:0 8px"></div>
    <div><div class="logo-corp">Corporation</div><div class="logo-tag">optimize your investment</div></div>
  </div>
  <div class="red-bar"></div>
  <div class="content">
    <h2>Duct Fabrication Material Report</h2>
    <div class="meta">Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} &nbsp;·&nbsp; ${items.length} item types &nbsp;·&nbsp; ${totalQty} nos total</div>
    <table>
      <thead><tr><th>#</th><th>Duct Type</th><th>Dimensions</th><th style="text-align:center">Qty</th><th style="text-align:right">Area/unit (m²)</th><th style="text-align:right">Total (m²)</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td colspan="3">Grand Total</td><td style="text-align:center;color:#fff">${totalQty} nos</td><td></td><td style="text-align:right;color:#fff;font-size:16px">${total.toFixed(2)} m²</td></tr></tfoot>
    </table>
    <div class="sig-section">
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Prepared By</div>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Checked By</div>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Transported By</div>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Received By</div>
      </div>
    </div>
    <div class="no-print"><button onclick="window.print()" style="background:#1B3F8B;color:#fff;border:none;padding:10px 24px;font-family:'Barlow',sans-serif;font-weight:600;cursor:pointer;border-radius:6px">Print Report</button></div>
  </div></body></html>`);
  w.document.close();
}

function open3DModal() {
  const modal = document.getElementById('duct-3d-modal');
  if (!modal || is3DModalOpen) return;
  is3DModalOpen = true;
  modal.classList.add('is-open');
  refresh3DViewer();
}

function close3DModal() {
  const modal = document.getElementById('duct-3d-modal');
  if (!modal || !is3DModalOpen) return;
  is3DModalOpen = false;
  modal.classList.remove('is-open');
  refresh3DViewer();
}

function on3DModalBackdrop(event) {
  if (event.target && event.target.id === 'duct-3d-modal') close3DModal();
}

window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && is3DModalOpen) close3DModal();
});

buildSelect();
onTypeChange();
