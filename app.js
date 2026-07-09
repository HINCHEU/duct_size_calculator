let items = [];
let is3DModalOpen = false;

function getDisplayVals(key, t, vals) {
  const required = t.fields.filter(x => !x.optional);
  const ok = required.every(x => +vals[x.id] > 0);
  if (ok) return vals;
  const ph = {};
  t.fields.forEach(f => { ph[f.id] = +vals[f.id] > 0 ? +vals[f.id] : 0; });
  return ph;
}

function renderStaticLabelOverlay(overlay, f, labels) {
  if (!overlay) return;
  overlay.innerHTML = labels
    .map(label => {
      let hasFieldValue = false;
      let value = '';
      if (label.id) {
        const v = f[label.id];
        if (typeof v === 'string' && v.trim().length > 0) { hasFieldValue = true; value = v.trim(); }
        else if (+v > 0) { hasFieldValue = true; value = (+v).toString() + ' mm'; }
      }
      return `<span class="y-duct-label ${label.cls}">${label.title}${hasFieldValue ? ' ' + value : ''}</span>`;
    })
    .join('');
}

function renderYLabelOverlay(overlay, f) {
  renderStaticLabelOverlay(overlay, f, [
    { id: 'A', title: 'A', cls: 'y-duct-label-a' },
    { id: 'B', title: 'B', cls: 'y-duct-label-b' },
    { id: 'E', title: 'E', cls: 'y-duct-label-e' },
    { id: 'F', title: 'F', cls: 'y-duct-label-f' },
    { id: 'C', title: 'C', cls: 'y-duct-label-c' },
    { id: 'D', title: 'D', cls: 'y-duct-label-d' },
    { id: 'R', title: 'R', cls: 'y-duct-label-r' },
    { id: 'L', title: 'L', cls: 'y-duct-label-l' },
    { title: 'Angular', cls: 'y-duct-label-angular' },
  ]);
}

function renderRTypeLabelOverlay(overlay, f) {
  renderStaticLabelOverlay(overlay, f, [
    { id: 'A', title: 'A', cls: 'r-type-label-a' },
    { id: 'B', title: 'B', cls: 'r-type-label-b' },
    { id: 'E', title: 'E', cls: 'r-type-label-e' },
    { id: 'F', title: 'F', cls: 'r-type-label-f' },
    { id: 'C', title: 'C', cls: 'r-type-label-c' },
    { id: 'D2', title: 'D', cls: 'r-type-label-d' },
    { id: 'R', title: 'R', cls: 'r-type-label-r' },
    { id: 'L', title: 'L', cls: 'r-type-label-l' },
    { title: 'Angular', cls: 'r-type-label-angle' },
  ]);
}

function renderRTypeRoundTwoLabelOverlay(overlay, f) {
  renderStaticLabelOverlay(overlay, f, [
    { id: 'A', title: 'A', cls: 'r-type-label-a' },
    { id: 'B', title: 'B', cls: 'r-type-label-b' },
    { id: 'D1', title: 'Ø1', cls: 'r-type-round-two-label-d1' },
    { id: 'L1', title: 'L1', cls: 'r-type-round-two-label-l1' },
    { id: 'L2', title: 'L2', cls: 'r-type-round-two-label-l2' },
    { id: 'D2', title: 'Ø2', cls: 'r-type-round-two-label-d2' },
    { id: 'L3', title: 'L3', cls: 'r-type-round-two-label-l3' },
    { id: 'R', title: 'R', cls: 'r-type-round-two-label-r' },
    { title: 'Angular', cls: 'r-type-round-two-label-angular-left' },
    { title: 'Angular', cls: 'r-type-round-two-label-angular-right' },
  ]);
}

function renderButterflyLabelOverlay(overlay, f) {
  renderStaticLabelOverlay(overlay, f, [
    { id: 'A', title: 'A', cls: 'butterfly-label-a' },
    { id: 'B', title: 'B', cls: 'butterfly-label-b' },
    { id: 'C', title: 'C', cls: 'butterfly-label-c' },
    { id: 'D2', title: 'D', cls: 'butterfly-label-d' },
    { id: 'R1', title: 'R1', cls: 'butterfly-label-r1' },
    { id: 'E', title: 'E', cls: 'butterfly-label-e' },
    { id: 'F', title: 'F', cls: 'butterfly-label-f' },
    { id: 'R2', title: 'R2', cls: 'butterfly-label-r2' },
    { title: 'Angular', cls: 'butterfly-label-angular-top-left' },
    { title: 'Angular', cls: 'butterfly-label-angular-top-right' },
  ]);
}

function renderFourWaysLabelOverlay(overlay, f) {
  renderStaticLabelOverlay(overlay, f, [
    { id: 'A', title: 'A1', cls: 'four-way-label-a1' },
    { id: 'C', title: 'A2', cls: 'four-way-label-a2' },
    { id: 'C', title: 'A3', cls: 'four-way-label-a3' },
    { id: 'C', title: 'A4', cls: 'four-way-label-a4' },
    { id: 'B', title: 'B1', cls: 'four-way-label-b1' },
    { id: 'D2', title: 'B2', cls: 'four-way-label-b2' },
    { id: 'D2', title: 'B3', cls: 'four-way-label-b3' },
    { id: 'D2', title: 'B4', cls: 'four-way-label-b4' },
    { title: 'Angular1', cls: 'four-way-label-angular1' },
    { title: 'Angular2', cls: 'four-way-label-angular2' },
    { id: 'R', title: 'R1', cls: 'four-way-label-r1' },
    { id: 'R', title: 'R2', cls: 'four-way-label-r2' },
  ]);
}

function renderFanConnLabelOverlay(overlay, f) {
  renderStaticLabelOverlay(overlay, f, [
    { id: 'A', title: 'A', cls: 'fan-conn-label-a' },
    { id: 'B', title: 'B', cls: 'fan-conn-label-b' },
    { id: 'C', title: 'C', cls: 'fan-conn-label-c' },
    { id: 'D2', title: 'D', cls: 'fan-conn-label-d2' },
    { id: 'L', title: 'L', cls: 'fan-conn-label-l' },
    { id: 'F1', title: 'F1', cls: 'fan-conn-label-f1' },
    { id: 'S', title: 'S', cls: 'fan-conn-label-s' },
    { id: 'L1', title: 'L1', cls: 'fan-conn-label-l1' },
    { id: 'L2', title: 'L2', cls: 'fan-conn-label-l2' },
    { id: 'Fb', title: 'Fb', cls: 'fan-conn-label-fb' },
    { id: 'Fi', title: 'Fi', cls: 'fan-conn-label-fi' },
  ]);
}

function renderButterflyRoundLabelOverlay(overlay, f) {
  // Positions tuned for the one-side-round static image (round outlet on the left)
  renderStaticLabelOverlay(overlay, f, [
    { id: 'A', title: 'A', cls: 'butterfly-round-label-a' },
    { id: 'B', title: 'B', cls: 'butterfly-round-label-b' },
    { id: 'D', title: 'Ø', cls: 'butterfly-round-label-d-left' },
    { id: 'L', title: 'L', cls: 'butterfly-round-label-l-left' },
    { id: 'R1', title: 'R1', cls: 'butterfly-round-label-r1' },
    { id: 'E', title: 'E', cls: 'butterfly-round-label-e-right' },
    { id: 'F', title: 'F', cls: 'butterfly-round-label-f' },
    { id: 'R2', title: 'R2', cls: 'butterfly-round-label-r2' },
    { title: 'Angular', cls: 'butterfly-round-label-angular-left' },
    { title: 'Angular', cls: 'butterfly-round-label-angular-right' },
  ]);
}

function renderButterflyRoundTwoLabelOverlay(overlay, f) {
  renderStaticLabelOverlay(overlay, f, [
    { id: 'A', title: 'A', cls: 'butterfly-round-label-a' },
    { id: 'B', title: 'B', cls: 'butterfly-round-label-b' },
    { id: 'D1', title: 'Ø1', cls: 'butterfly-round-two-label-d1' },
    { id: 'L1', title: 'L1', cls: 'butterfly-round-two-label-l1' },
    { id: 'R1', title: 'R1', cls: 'butterfly-round-two-label-r1' },
    { id: 'D2', title: 'Ø2', cls: 'butterfly-round-two-label-d2' },
    { id: 'L2', title: 'L2', cls: 'butterfly-round-two-label-l2' },
    { id: 'R2', title: 'R2', cls: 'butterfly-round-two-label-r2' },
    { title: 'Angular', cls: 'butterfly-round-two-label-angular-left' },
    { title: 'Angular', cls: 'butterfly-round-two-label-angular-right' }
  ]);
}

function getStaticImageSrc(key) {
  if (key === 'r_type') return 'duct/R-TYPE%20DUCT.png';
  if (key === 'r_type_round_two') return 'duct/R-Type-duct-round-two-side.png';
  if (key === '4ways') return 'duct/4-way-duct.png';
  if (key === 'fan_conn') return 'duct/FAN_CONN.png';
  if (key === 'butterfly_round') return 'duct/butterfly-duct-round-out-one-side.png';
  if (key === 'butterfly_round_two') return 'duct/Butterfly-duct-round-two-side.png';
  if (key === 'butterfly_rect') return 'duct/BUTTERFLY%20DUCT.png';
  return 'duct/y-duct.png';
}

function updateStaticModalPreview(key, f) {
  const modal = document.getElementById('duct-3d-modal');
  const canvasWrap = document.getElementById('duct-3d-canvas-wrap-modal');
  const img = document.getElementById('duct-static-img-modal');
  const overlay = document.getElementById('duct-static-overlay-modal');
  if (!modal || !canvasWrap || !img || !overlay) return;

  const isStaticType = key === 'y_duct' || key === 'r_type' || key === 'r_type_round_two' || key === '4ways' || key === 'fan_conn' || key === 'butterfly_rect' || key === 'butterfly_round' || key === 'butterfly_round_two';
  modal.classList.toggle('is-y-duct', key === 'y_duct');
  modal.classList.toggle('is-static-duct', isStaticType);
  canvasWrap.style.display = isStaticType ? 'none' : 'block';
  img.style.display = isStaticType ? 'block' : 'none';
  overlay.style.display = isStaticType ? 'block' : 'none';

  if (isStaticType) {
    img.src = getStaticImageSrc(key);
    if (key === 'y_duct') img.alt = 'Y-Duct diagram';
    else if (key === 'r_type' || key === 'r_type_round_two') img.alt = 'R-Type Duct diagram';
    else if (key === '4ways') img.alt = '4-Ways Duct diagram';
    else if (key === 'fan_conn') img.alt = 'Fan Connection Duct diagram';
    else img.alt = 'Butterfly Duct diagram';
    if (key === 'y_duct') renderYLabelOverlay(overlay, f);
    else if (key === 'r_type') renderRTypeLabelOverlay(overlay, f);
    else if (key === 'r_type_round_two') renderRTypeRoundTwoLabelOverlay(overlay, f);
    else if (key === '4ways') renderFourWaysLabelOverlay(overlay, f);
    else if (key === 'fan_conn') renderFanConnLabelOverlay(overlay, f);
    else if (key === 'butterfly_round') renderButterflyRoundLabelOverlay(overlay, f);
    else if (key === 'butterfly_round_two') renderButterflyRoundTwoLabelOverlay(overlay, f);
    else renderButterflyLabelOverlay(overlay, f);
  } else {
    overlay.innerHTML = '';
  }
}

function updateStaticPreview(key, f) {
  const wrap = document.getElementById('duct-img-wrap');
  const overlay = document.getElementById('duct-static-overlay');
  const img = document.getElementById('duct-static-img');
  if (!wrap) return;

  const isStaticType = key === 'y_duct' || key === 'r_type' || key === 'r_type_round_two' || key === '4ways' || key === 'fan_conn' || key === 'butterfly_rect' || key === 'butterfly_round' || key === 'butterfly_round_two';
  if (!isStaticType) {
    wrap.classList.remove('is-static-y-duct');
    if (overlay) overlay.innerHTML = '';
    return;
  }

  wrap.classList.add('is-static-y-duct');
  if (img) {
    img.src = getStaticImageSrc(key);
    if (key === 'y_duct') img.alt = 'Y-Duct diagram';
    else if (key === 'r_type' || key === 'r_type_round_two') img.alt = 'R-Type Duct diagram';
    else if (key === '4ways') img.alt = '4-Ways Duct diagram';
    else if (key === 'fan_conn') img.alt = 'Fan Connection Duct diagram';
    else img.alt = 'Butterfly Duct diagram';
  }
  if (!overlay) return;

  if (key === 'y_duct') renderYLabelOverlay(overlay, f);
  else if (key === 'r_type') renderRTypeLabelOverlay(overlay, f);
  else if (key === 'r_type_round_two') renderRTypeRoundTwoLabelOverlay(overlay, f);
  else if (key === '4ways') renderFourWaysLabelOverlay(overlay, f);
  else if (key === 'fan_conn') renderFanConnLabelOverlay(overlay, f);
  else if (key === 'butterfly_round') renderButterflyRoundLabelOverlay(overlay, f);
  else if (key === 'butterfly_round_two') renderButterflyRoundTwoLabelOverlay(overlay, f);
  else renderButterflyLabelOverlay(overlay, f);
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
  if (key === 'y_duct' || key === 'r_type' || key === 'r_type_round_two' || key === '4ways' || key === 'fan_conn' || key === 'butterfly_rect' || key === 'butterfly_round' || key === 'butterfly_round_two') {
    updateStaticModalPreview(key, f);
    return;
  }
  // 3D type — make sure the modal shows the 3D canvas, not the leftover 2D image
  const modal = document.getElementById('duct-3d-modal');
  const canvasWrap = document.getElementById('duct-3d-canvas-wrap-modal');
  const img = document.getElementById('duct-static-img-modal');
  const overlay = document.getElementById('duct-static-overlay-modal');
  if (modal) { modal.classList.remove('is-y-duct'); modal.classList.remove('is-static-duct'); }
  if (canvasWrap) canvasWrap.style.display = 'block';
  if (img) img.style.display = 'none';
  if (overlay) { overlay.style.display = 'none'; overlay.innerHTML = ''; }
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

  document.getElementById('duct-type-tag').textContent = t.tag;

  if (key === 'y_duct' || key === 'r_type' || key === 'r_type_round_two' || key === '4ways' || key === 'fan_conn' || key === 'butterfly_rect' || key === 'butterfly_round' || key === 'butterfly_round_two') dispose3DViewer();
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
  const t = DUCTS[key];
  const v = {};
  t.fields.forEach(f => { v[f.id] = document.getElementById('f_' + f.id)?.value || 0; });
  return v;
}

function updatePreview() {
  const key = document.getElementById('duct-type').value;
  const t = DUCTS[key];
  const f = getVals();
  const required = t.fields.filter(x => !x.optional);
  const ok = required.every(x => +f[x.id] > 0);
  const displayVals = getDisplayVals(key, t, f);
  const p = document.getElementById('preview-area');
  if (ok) {
    const area = t.area(f);
    p.innerHTML = `<div class="preview-dim">${t.calc(f)}</div><div class="preview-area">${area.toFixed(2)} <span style="font-size:14px;font-weight:400;color:var(--text-secondary)">m²</span></div>`;
  } else {
    p.innerHTML = `<div class="preview-muted">Fill dimensions above to preview surface area</div>`;
  }
  updateStaticPreview(key, f);
  if (key !== 'y_duct' && key !== 'r_type' && key !== 'r_type_round_two' && key !== '4ways' && key !== 'fan_conn' && key !== 'butterfly_rect' && key !== 'butterfly_round' && key !== 'butterfly_round_two') build3DDuct(key, displayVals);
}

function addItem() {
  const key = document.getElementById('duct-type').value;
  const t = DUCTS[key];
  const f = getVals();
  const qty = parseInt(document.getElementById('qty').value) || 1;
  const required = t.fields.filter(x => !x.optional);
  if (!required.every(x => +f[x.id] > 0)) { alert('Please fill in all required dimensions.'); return; }
  items.push({ key, label: t.label, tag: t.tag, dim: t.calc(f), area: t.area(f), qty, id: Date.now() });
  renderList();
  clearFields();
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
    tb.style.display = 'none';
    return;
  }
  tb.style.display = 'flex';
  let html = '';
  let total = 0;
  items.forEach((item, i) => {
    const sub = item.area * item.qty;
    total += sub;
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
  a.download = 'CEP_duct_fabrication.csv';
  a.click();
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
    <div class="logo">CE&P</div>
    <div style="width:1px;height:36px;background:rgba(255,255,255,0.2);margin:0 8px"></div>
    <div><div class="logo-corp">Corporation</div><div class="logo-tag">optimize your investment</div></div>
  </div>
  <div class="red-bar"></div>
  <div class="content">
    <h2>Duct Fabrication Material Report</h2>
    <div class="meta">Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} · ${items.length} item types · ${totalQty} nos total</div>
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
