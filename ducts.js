/**
 * @file ducts.js
 * @description Configuration for all duct types supported by the calculator.
 * 
 * Each key in the DUCTS object represents a specific duct type with the following properties:
 * - `label`: Human-readable name for the UI dropdown.
 * - `tag`: Short tag used in the UI.
 * - `fields`: Array of objects defining the required input fields (dimensions).
 * - `calc`: Function that returns a formatted string of the dimensions.
 * - `area`: Function that calculates the surface area in square meters (m²) based on input fields.
 *           Dimensions are typically converted from mm to m (by dividing by 1000).
 */
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
    fields: [{ id: 'A', label: 'Width A' }, { id: 'B', label: 'Height B' }, { id: 'R', label: 'Inner Radius R' }],
    calc: f => `Elbow 90°: ${f.A}×${f.B}×R${f.R}`,
    // Perimeter = 2*(A+B)/1000 m, Arc at centerline Rc=(R+A/2), ArcLen = PI/2*Rc/1000
    area: f => { const a = +f.A, b = +f.B, r = +f.R; const Rc = r + a / 2; return 2 * (a + b) / 1000 * (Math.PI / 2 * Rc / 1000); },
  },
  rect_elbow45: {
    label: 'Rectangular Elbow 45°',
    tag: 'Elbow 45°',
    fields: [{ id: 'A', label: 'Width A' }, { id: 'B', label: 'Height B' }, { id: 'R', label: 'Inner Radius R' }],
    calc: f => `Elbow 45°: ${f.A}×${f.B}×R${f.R}`,
    // Perimeter = 2*(A+B)/1000 m, Arc at centerline Rc=(R+A/2), ArcLen = PI/4*Rc/1000
    area: f => { const a = +f.A, b = +f.B, r = +f.R; const Rc = r + a / 2; return 2 * (a + b) / 1000 * (Math.PI / 4 * Rc / 1000); },
  },
  round_elbow90: {
    label: 'Round Elbow 90°',
    tag: 'Round Elbow',
    fields: [{ id: 'D', label: 'Diameter Ø' }, { id: 'R', label: 'Bend Radius R' }],
    calc: f => `ELBOW90°: ∅${f.D} x R:${f.R}`,
    // Perimeter = PI*D/1000, Centerline radius Rc = R + D/2
    area: f => { const d = +f.D, r = +f.R; const Rc = r + d / 2; return Math.PI * d / 1000 * (Math.PI / 2 * Rc / 1000); },
  },
  round_elbow45: {
    label: 'Round Elbow 45°',
    tag: 'Round Elbow 45',
    fields: [{ id: 'D', label: 'Diameter Ø' }, { id: 'R', label: 'Bend Radius R' }],
    calc: f => `ELBOW45°: ∅${f.D} x R:${f.R}`,
    // Perimeter = PI*D/1000, Centerline radius Rc = R + D/2
    area: f => { const d = +f.D, r = +f.R; const Rc = r + d / 2; return Math.PI * d / 1000 * (Math.PI / 4 * Rc / 1000); },
  },
  duct_reducer: {
    label: 'Duct Reducer (Rect-Rect)',
    tag: 'Reducer',
    fields: [{ id: 'A', label: 'Start Width A' }, { id: 'B', label: 'Start Height B' }, { id: 'C', label: 'End Width C' }, { id: 'D2', label: 'End Height D' }, { id: 'L', label: 'Length L' }],
    calc: f => `Duct reducer: (${f.A}×${f.B})→(${f.C}×${f.D2})×L${f.L}`,
    // Excel: Perimeter=2*(A+B)/1000 (larger end), EqLen=L/1000*1.2
    area: f => { const a = +f.A, b = +f.B, l = +f.L; return 2 * (a + b) / 1000 * (l / 1000 * 1.2); },
  },
  rect_to_round: {
    label: 'Duct Reducer (Rect-Round)',
    tag: 'Rect to Round',
    fields: [{ id: 'A', label: 'Width A' }, { id: 'B', label: 'Height B' }, { id: 'D', label: 'Diameter Ø' }, { id: 'L', label: 'Length L' }],
    calc: f => `Rectangle to Round : ${f.A}x${f.B} -> Ø${f.D}mmxL${f.L}`,
    // Half straight rect (L/2) + half transition to round (L/2)
    area: f => {
      const pRect = 2 * (+f.A + +f.B), pRound = Math.PI * (+f.D), l = +f.L;
      return (pRect * (l / 2) + ((pRect + pRound) / 2) * (l / 2)) / 1000000;
    },
  },
  butterfly_round: {
    label: 'Butterfly Duct (One Side Round)',
    tag: 'Butterfly',
    // Main A×B, Left branch ROUND: diameter D and length L, Left radius R1, Right branch RECT: E×F and radius R2
    fields: [
      { id: 'A', label: 'Main Width A' },
      { id: 'B', label: 'Main Height B' },
      { id: 'D', label: 'Left Round Ø (D)' },
      { id: 'L', label: 'Left Length L' },
      { id: 'R1', label: 'Left Radius R1' },
      { id: 'E', label: 'Right Width E' },
      { id: 'F', label: 'Right Height F' },
      { id: 'R2', label: 'Right Radius R2' }
    ],
    calc: f => `Butterfly(OneRound): ${f.A}×${f.B} → Ø${f.D}L${f.L}R${f.R1} ↔ ${f.E}×${f.F}R${f.R2}`,
    // area: left round branch (perimeter PI*D * (elbow equiv + length)) + right rectangular branch (perimeter*elbow length) + main neck
    area: f => {
      const a = +f.A, b = +f.B, d = +f.D, l = +f.L, r1 = +f.R1, e = +f.E, ff = +f.F, r2 = +f.R2;
      const leftPerim = Math.PI * (d / 1000);
      // treat left effective length as L + R1*1.2 (bend equiv)
      const leftLen = (l / 1000) + (r1 / 1000 * 1.2);
      const leftArea = leftPerim * leftLen;
      const rightPerim = 2 * (e + ff) / 1000;
      const rightLen = Math.PI / 2 * r2 / 1000;
      const rightArea = rightPerim * rightLen;
      const neck = 2 * (a + b) / 1000 * ((r1 + r2) / 2 / 1000);
      return leftArea + rightArea + neck;
    },
  },
  butterfly_round_two: {
    label: 'Butterfly Duct (Two Side Round)',
    tag: 'Butterfly',
    // Main A×B, Left ROUND: D1,L1,R1; Right ROUND: D2,L2,R2
    fields: [
      { id: 'A', label: 'Main Width A' },
      { id: 'B', label: 'Main Height B' },
      { id: 'D1', label: 'Left Ø D1' },
      { id: 'L1', label: 'Left Length L1' },
      { id: 'R1', label: 'Left Radius R1' },
      { id: 'D2', label: 'Right Ø D2' },
      { id: 'L2', label: 'Right Length L2' },
      { id: 'R2', label: 'Right Radius R2' }
    ],
    calc: f => `Butterfly(2Round): ${f.A}×${f.B} → Ø${f.D1}L${f.L1}R${f.R1} ↔ Ø${f.D2}L${f.L2}R${f.R2}`,
    area: f => {
      const a = +f.A, b = +f.B, d1 = +f.D1, l1 = +f.L1, r1 = +f.R1, d2 = +f.D2, l2 = +f.L2, r2 = +f.R2;
      const leftPerim = Math.PI * (d1 / 1000);
      const leftLen = (l1 / 1000) + (r1 / 1000 * 1.2);
      const leftArea = leftPerim * leftLen;
      const rightPerim = Math.PI * (d2 / 1000);
      const rightLen = (l2 / 1000) + (r2 / 1000 * 1.2);
      const rightArea = rightPerim * rightLen;
      const neck = 2 * (a + b) / 1000 * ((r1 + r2) / 2 / 1000);
      return leftArea + rightArea + neck;
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
    fields: [{ id: 'A', label: 'Start Width A' }, { id: 'B', label: 'Start Height B' }, { id: 'C', label: 'End Width C' }, { id: 'D2', label: 'End Height D' }, { id: 'R', label: 'Offset Drop R' }, { id: 'L', label: 'Total Length L' }],
    calc: f => `Offset: (${f.A}×${f.B})→(${f.C}×${f.D2})×R${f.R}×L${f.L}`,
    // Mathematical area: Top/Bottom are trapezoids with heights approx hypot(L,R). Side walls are trapezoids with height L.
    // Simplifying to Average Perimeter * effective length hypot(L,R)
    area: f => {
      const a = +f.A, b = +f.B, c = +f.C, d2 = +f.D2, l = +f.L, r = +f.R;
      const avgP = (2 * (a + b) + 2 * (c + d2)) / 2;
      return avgP * Math.hypot(l, r) / 1000000;
    },
  },
  offset_duct_straight: {
    label: 'Offset Duct (With Straight Ends)',
    tag: 'Offset+Straight',
    fields: [
      { id: 'A', label: 'Width A' }, 
      { id: 'B', label: 'Height B' }, 
      { id: 'R', label: 'Offset Drop R' }, 
      { id: 'L', label: 'Middle Length L' },
      { id: 'L1', label: 'Start Straight L1' },
      { id: 'L2', label: 'End Straight L2' }
    ],
    calc: f => `Offset w/ Straight: ${f.A}×${f.B}×R${f.R}×L${f.L} (L1:${f.L1}, L2:${f.L2})`,
    area: f => { 
      const a = +f.A, b = +f.B, l = +f.L, r = +f.R, l1 = +f.L1 || 0, l2 = +f.L2 || 0; 
      const middleL = l - l1 - l2;
      const p = 2 * (a + b);
      return (p * l1 + p * l2 + 2 * b * middleL + 2 * a * Math.hypot(middleL, r)) / 1000000; 
    },
  },
  offset_duct_angular: {
    label: 'Offset Duct (With Angular Ends)',
    tag: 'Offset+Angular',
    fields: [
      { id: 'A', label: 'Width A' }, 
      { id: 'B', label: 'Height B' }, 
      { id: 'R', label: 'Offset Drop R' }, 
      { id: 'L', label: 'Total Length L' },
      { id: 'Rc', label: 'Curve Radius Rc' },
      { id: 'A1', label: 'Start Angle (deg)' },
      { id: 'A2', label: 'End Angle (deg)' }
    ],
    calc: f => `Offset w/ Ang: ${f.A}×${f.B}×R${f.R}×L${f.L} (Rc:${f.Rc}, Ang:${f.A1}°,${f.A2}°)`,
    area: f => { 
      const a = +f.A || 750, b = +f.B || 300, l = +f.L || 930, H = +f.R || 620; 
      const ang1 = Math.min(60, Math.max(-60, +f.A1 || 30)) * Math.PI / 180;
      const ang2 = Math.min(60, Math.max(-60, +f.A2 || 30)) * Math.PI / 180;
      let Rc = (+f.Rc || 150);
      const b_half = b / 2;
      const tan1 = Math.abs(Math.tan(ang1));
      const tan2 = Math.abs(Math.tan(ang2));
      const s1 = b_half * tan1 + 20;
      const s2 = b_half * tan2 + 20;
      let dx = l - 2 * b_half * (tan1 + tan2) - 40;
      if (dx < 10) dx = 10;
      let r = Rc + b_half;
      const max_r = (dx * dx + H * H) / (4 * H);
      if (r > max_r) { r = max_r * 0.99; }
      const dy = H - 2 * r;
      const D = Math.hypot(dx, dy);
      const alpha = Math.atan2(dy, dx) + Math.asin(2 * r / D);
      const tangentL = Math.sqrt(Math.max(0, D * D - 4 * r * r));
      const centerL = s1 + s2 + 2 * alpha * r + tangentL;
      const p = 2 * (a + b);
      return (p * centerL) / 1000000; 
    },
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
    // Excel: main trunk = perimeter of A×B * L, branch + side = perimeter of E×F + C×D * 90° elbow length (PI/2*R)
    area: f => {
      const a = +f.A, b = +f.B, e = +f.E, ff = +f.F, c = +f.C, d = +f.D, l = +f.L, r = +f.R;
      const mainPerim = 2 * (a + b) / 1000;
      const branchPerim = 2 * (e + ff) / 1000;
      const sidePerim = 2 * (c + d) / 1000;
      return mainPerim * (l / 1000) + (branchPerim + sidePerim) * (Math.PI / 2 * r / 1000);
    },
  },

  r_type: {
    label: 'R-Type Duct',
    tag: 'R-Type',
    fields: [{ id: 'A', label: 'Main Width A' }, { id: 'B', label: 'Main Height B' }, { id: 'C', label: 'Branch 1 C' }, { id: 'D2', label: 'Branch 1 Height D' }, { id: 'E', label: 'Branch 2 E' }, { id: 'F', label: 'Branch 2 Height F' }, { id: 'R', label: 'Radius R' }, { id: 'L', label: 'Length L' }],
    calc: f => `R-type: ${f.A}×${f.B}→${f.E}×${f.F}↔${f.C}×${f.D2}R${f.R}L${f.L}`,
    // Excel: main inlet = 2*(A+B)/1000 * (L/2/1000), branch elbow = 2*(C+D)/1000 * (PI/2*R/1000), outlet = 2*(E+F)/1000 * (L/2/1000)
    area: f => {
      const a = +f.A, b = +f.B, c = +f.C, d = +f.D2, e = +f.E, ff = +f.F, l = +f.L, r = +f.R;
      return 2 * (a + b) / 1000 * (l / 1000 * 0.5) + 2 * (c + d) / 1000 * (Math.PI / 2 * r / 1000) + 2 * (e + ff) / 1000 * (l / 1000 * 0.5);
    },
  },
  r_type_round_two: {
    label: 'R-Type Duct (Round Two Side)',
    tag: 'R-Type',
    fields: [
      { id: 'A', label: 'Main Width A' },
      { id: 'B', label: 'Main Height B' },
      { id: 'D1', label: 'Top Round Ø D1' },
      { id: 'L1', label: 'Top Branch L1' },
      { id: 'L2', label: 'Top Branch L2' },
      { id: 'D2', label: 'Side Round Ø D2' },
      { id: 'L3', label: 'Side Branch L3' },
      { id: 'R', label: 'Radius R' }
    ],
    calc: f => `R-Type Round(2Side): ${f.A}×${f.B} → Ø${f.D1}L${f.L1}+L${f.L2} + Ø${f.D2}L${f.L3}R${f.R}`,
    area: f => {
      const a = +f.A, b = +f.B, d1 = +f.D1, l1 = +f.L1, l2 = +f.L2, d2 = +f.D2, l3 = +f.L3, r = +f.R;
      const topPerim = Math.PI * (d1 / 1000);
      const topLen = (l1 / 1000) + (l2 / 1000) + (r / 1000 * 1.2);
      const topArea = topPerim * topLen;
      const sidePerim = Math.PI * (d2 / 1000);
      const sideLen = (l3 / 1000) + (r / 1000 * 1.2);
      const sideArea = sidePerim * sideLen;
      const neck = 2 * (a + b) / 1000 * (r / 1000 * 1.2);
      return topArea + sideArea + neck;
    }
  },
  plenum_box: {
    label: 'Plenum Box (Side Inlet)',
    tag: 'Plenum Side',
    fields: [
      { id: 'A', label: 'Body Width A' }, { id: 'B', label: 'Body Depth B' }, { id: 'H2', label: 'Body Height H2' },
      { id: 'C', label: 'Neck Width C' }, { id: 'D', label: 'Neck Depth D' }, { id: 'H1', label: 'Neck Height H1' },
      { id: 'D2', label: 'Connector Ø' }, { id: 'H3', label: 'Connector Height H3' },
      { id: 'F', label: 'Bottom Flange F' }
    ],
    calc: f => `Plenum Box: ${f.A}×${f.B}×H${f.H2} Neck:${f.C}×${f.D}×H${f.H1} Conn:Ø${f.D2}×H${f.H3}`,
    area: f => {
      const a = +f.A, b = +f.B, h1 = +f.H1, c = +f.C, d = +f.D, h2 = +f.H2, d2 = +f.D2, h3 = +f.H3, fl = +f.F || 0;
      const bodyTotal = 2*(a*h2 + a*b + b*h2) - Math.PI*Math.pow(d2/2, 2) - c*d;
      const neckTotal = 2*(c+d)*h1;
      const connTotal = Math.PI * d2 * h3;
      const flangeTotal = fl > 0 ? 2*(c*fl + d*fl - 2*fl*fl) : 0;
      return (bodyTotal + neckTotal + connTotal + flangeTotal) / 1000000;
    },
  },
  plenum_top: {
    label: 'Plenum Box (Top Inlet)',
    tag: 'Plenum Top',
    fields: [
      { id: 'A', label: 'Body Width A' }, { id: 'B', label: 'Body Depth B' }, { id: 'H1', label: 'Body Height H1' },
      { id: 'D', label: 'Connector Ø' }, { id: 'H2', label: 'Connector Height H2' },
      { id: 'F', label: 'Flange Width F' }
    ],
    calc: f => `Plenum Top: ${f.A}×${f.B}×H${f.H1} Conn:Ø${f.D}×H${f.H2} Flange:${f.F}`,
    area: f => {
      const a = +f.A, b = +f.B, h1 = +f.H1, d = +f.D, h2 = +f.H2, fl = +f.F || 20;
      const bodyTotal = (a*b) + 2*(a*h1) + 2*(b*h1) - Math.PI*Math.pow(d/2, 2);
      const flangeTotal = fl > 0 ? 2*(a*fl + b*fl + 2*fl*fl) : 0; // A*B to (A+2F)*(B+2F) = 2AF + 2BF + 4F^2
      return (bodyTotal + Math.PI*d*h2 + flangeTotal) / 1000000;
    },
  },
  plenum_tapered: {
    label: 'Plenum Box (Oval Top Inlet)',
    tag: 'Plenum Oval Top',
    fields: [
      { id: 'A', label: 'Body Width A' }, { id: 'B', label: 'Body Depth B' }, { id: 'H1', label: 'Body Height H1' },
      { id: 'C', label: 'Neck Width C' }, { id: 'D', label: 'Neck Depth D' }, { id: 'H2', label: 'Neck Height H2' },
      { id: 'CW', label: 'Conn Oval Width CW' }, { id: 'CD', label: 'Conn Oval Depth CD' }, { id: 'CH', label: 'Conn Height CH' },
      { id: 'F', label: 'Bottom Flange F' }
    ],
    calc: f => `Plenum Oval: ${f.A}×${f.B}×H${f.H1} Neck:${f.C}×${f.D}×H${f.H2} Conn:${f.CW}×${f.CD}`,
    area: f => {
      const a = +f.A, b = +f.B, h1 = +f.H1, c = +f.C || a, d = +f.D, h2 = +f.H2, fl = +f.F || 0;
      const cw = +f.CW, cd = +f.CD, ch = +f.CH;
      
      const ovalArea = Math.max(0, cw - cd) * cd + Math.PI * Math.pow(cd/2, 2);
      const ovalPerim = 2 * Math.max(0, cw - cd) + Math.PI * cd;
      
      const bodyTotal = 2*(a*h1 + b*h1) + (a*b);
      const neckTotal = 2*(c*h2 + d*h2);
      const botFace = (a*b) - (c*d);
      const flangeTotal = fl > 0 ? 2*(c*fl + d*fl - 2*fl*fl) : 0;
      
      const connectorArea = ovalPerim * ch;
      
      return (bodyTotal + botFace + neckTotal - ovalArea + connectorArea + flangeTotal) / 1000000;
    },
  },
  canvas_round: {
    label: 'Canvas Connection (Round)',
    tag: 'Canvas Round',
    fields: [{ id: 'D', label: 'Diameter Ø' }, { id: 'L', label: 'Canvas Length L' }, { id: 'F', label: 'Flange Width F' }],
    calc: f => `Canvas round: Ø${f.D}×L${f.L} Flange:${f.F}`,
    // Excel: Perimeter = PI*D/1000, EqLen = L/1000 (canvas, no multiplier)
    area: f => Math.PI * ((+f.D) / 1000) * ((+f.L) / 1000),
  },
  canvas_rect: {
    label: 'Canvas Connection (Rect)',
    tag: 'Canvas Rect',
    fields: [{ id: 'A', label: 'Width A' }, { id: 'B', label: 'Height B' }, { id: 'L', label: 'Canvas Length L' }, { id: 'F', label: 'Flange Width F' }],
    calc: f => `Canvas rect: ${f.A}×${f.B}×L${f.L} Flange:${f.F}`,
    // Excel: Perimeter = 2*(A+B)/1000, EqLen = L/1000 (canvas, no multiplier)
    area: f => 2 * ((+f.A) + (+f.B)) / 1000 * ((+f.L) / 1000),
  },
  fan_conn: {
    label: 'Fan Connection',
    tag: 'Fan Conn',
    fields: [
      { id: 'A', label: 'Inlet Width A' },
      { id: 'B', label: 'Inlet Height B' },
      { id: 'C', label: 'Outlet Width C' },
      { id: 'D2', label: 'Outlet Height D' },
      { id: 'L', label: 'Total Length L' },
      { id: 'F1', label: 'Top Flange F1' },
      { id: 'S', label: 'Top Step S' },
      { id: 'L1', label: 'Inlet Section L1' },
      { id: 'L2', label: 'Body Section L2' },
      { id: 'Fb', label: 'Bottom Flange Fb' },
      { id: 'Fi', label: 'Center Gap Fi' },
    ],
    calc: f => `Fan conn: ${f.A}×${f.B} → ${f.C}×${f.D2} × L${f.L}`,
    area: f => {
      const a = +f.A, b = +f.B, c = +f.C, d = +f.D2, l = +f.L;
      const f1 = +f.F1, s = +f.S, l1 = +f.L1, l2 = +f.L2, fb = +f.Fb, fi = +f.Fi;
      if (!a || !b || !c || !d || !l || !l2) return 0;
      const slantW = Math.sqrt(l2 * l2 + ((a - c) / 2) ** 2);
      const slantH = Math.sqrt(l2 * l2 + s * s);
      const topBot = (a + c) / 2 * slantW / 1e6 * 2;
      const sides = (b + d) / 2 * slantH / 1e6 * 2;
      const inletSect = 2 * (a + b) / 1000 * (l1 / 1000);
      const outFlange = 2 * (c + d) / 1000 * (fb / 1000);
      const stripF1 = (c * 2 + d * 2) * f1 / 1e6;
      return topBot + sides + inletSect + outFlange + stripF1;
    },
  },
  wire_mesh: {
    label: 'Wire Mesh',
    tag: 'Wire Mesh',
    fields: [
      { id: 'A',  label: 'Length A' },
      { id: 'B',  label: 'Width B' },
      { id: 'C',  label: 'Cell Spacing @C' },
      { id: 'OL', label: 'Overlap OL' },
    ],
    calc: f => `Wire mesh: ${f.A}×${f.B}×@C=${f.C || 150} Overlap=${f.OL || 150}mm`,
    // Total area = full sheet A×B (inner mesh + 4 border overlap strips)
    area: f => (+f.A) * (+f.B) / 1e6,
  },
  transfer_air: {
    label: 'Transfer Air Duct',
    tag: 'Transfer Air',
    fields: [
      { id: 'W1', label: 'Right Inlet W1 (inner)' },
      { id: 'D1', label: 'Duct Depth D1 (inner)' },
      { id: 'H1', label: 'Right Collar H1' },
      { id: 'H2', label: 'Right Leg Height H2' },
      { id: 'W3', label: 'Right Leg Width W3' },
      { id: 'G', label: 'Mid Connector Width G' },
      { id: 'W4', label: 'Left Leg Width W4' },
      { id: 'H4', label: 'Left Leg Height H4' },
      { id: 'H3', label: 'Left Collar H3' },
      { id: 'W2', label: 'Left Outlet W2 (inner)' },
      { id: 'FL', label: 'Flange Width FL' }
    ],
    calc: f => `Transfer air: ${f.W1}×${f.D1} Z-Shape (G=${f.G})`,
    area: f => {
      const w1 = +f.W1 || 900, d1 = +f.D1 || 500, w2 = +f.W2 || 900;
      const h1 = +f.H1 || 350, h2 = +f.H2 || 925, w3 = +f.W3 || 925;
      const g = +f.G || 450, h3 = +f.H3 || 350, h4 = +f.H4 || 925;
      const w4 = +f.W4 || 925, fl = +f.FL || 50;
      const connH = Math.max(h2, h4); // connector height auto from legs

      // Right leg (4-wall tube): perimeter × (body H2 + collar H1)
      const rightLegArea = 2 * (w3 + d1) * h2 / 1e6;
      // Right collar trapezoid panels (front/back/2 sides)
      const rightCollarArea = (2 * d1 * h1 + 2 * ((w3 + w1) / 2) * h1) / 1e6;
      // Right flange ring
      const rightFlangeArea = (2 * (w1 + 2 * fl) * fl + 2 * d1 * fl) / 1e6;

      // Connector (G section): front+back+top+bottom panels
      const connArea = (2 * g * connH + 2 * g * d1) / 1e6;

      // Left leg (4-wall tube): perimeter × body H4
      const leftLegArea = 2 * (w4 + d1) * h4 / 1e6;
      // Left collar trapezoid panels
      const leftCollarArea = (2 * d1 * h3 + 2 * ((w4 + w2) / 2) * h3) / 1e6;
      // Left flange ring
      const leftFlangeArea = (2 * (w2 + 2 * fl) * fl + 2 * d1 * fl) / 1e6;

      // Deduct open inlet/outlet holes
      const rightHole = w1 * d1 / 1e6;
      const leftHole = w2 * d1 / 1e6;

      return rightLegArea + rightCollarArea + rightFlangeArea
        + connArea
        + leftLegArea + leftCollarArea + leftFlangeArea
        - rightHole - leftHole;
    },
  },

  '4ways': {
    label: '4-Ways Duct',
    tag: '4-Ways',
    fields: [
      { id: 'A1',  label: 'Main Bottom Width A1' },
      { id: 'B1',  label: 'Main Bottom Height B1' },
      { id: 'A4',  label: 'Main Top Width A4' },
      { id: 'B4',  label: 'Main Top Height B4' },
      { id: 'A2',  label: 'Right Branch Width A2' },
      { id: 'B2',  label: 'Right Branch Height B2' },
      { id: 'A3',  label: 'Left Branch Width A3' },
      { id: 'B3',  label: 'Left Branch Height B3' },
      { id: 'R1',  label: 'Left Radius R1' },
      { id: 'R2',  label: 'Right Radius R2' },
    ],
    calc: f => `4-ways: ${f.A1}×${f.B1}/${f.A4}×${f.B4} + ${f.A2}×${f.B2}(R${f.R2}) + ${f.A3}×${f.B3}(R${f.R1})`,
    // Left branch (R1): 2*(A3+B3)/1000 * PI/2*R1/1000
    // Right branch (R2): 2*(A2+B2)/1000 * PI/2*R2/1000
    // Top branch (R1+R2 avg): 2*(A4+B4)/1000 * PI/2*((R1+R2)/2)/1000
    // Bottom branch (R1+R2 avg): 2*(A1+B1)/1000 * PI/2*((R1+R2)/2)/1000
    // Centre body: 2*((A1+B1+A4+B4)/2)/1000 * (R1+R2)/2/1000
    area: f => {
      const a1 = +f.A1, b1 = +f.B1, a4 = +f.A4, b4 = +f.B4;
      const a2 = +f.A2, b2 = +f.B2, a3 = +f.A3, b3 = +f.B3;
      const r1 = +f.R1, r2 = +f.R2;
      const rAvg = (r1 + r2) / 2;
      const leftBranch   = 2 * (a3 + b3) / 1000 * (Math.PI / 2 * r1 / 1000);
      const rightBranch  = 2 * (a2 + b2) / 1000 * (Math.PI / 2 * r2 / 1000);
      const topBranch    = 2 * (a4 + b4) / 1000 * (Math.PI / 2 * rAvg / 1000);
      const bottomBranch = 2 * (a1 + b1) / 1000 * (Math.PI / 2 * rAvg / 1000);
      const avgPerim = ((a1 + b1) + (a4 + b4)) / 2;
      const centre       = 2 * avgPerim / 1000 * (rAvg / 1000);
      return leftBranch + rightBranch + topBranch + bottomBranch + centre;
    },
  },
  angle_bar: {
    label: 'Angle Bar',
    tag: 'Angle Bar',
    category: 'Support',
    unit: 'm',
    thicknessOptions: [
      { value: '3', label: '3 mm', selected: true },
      { value: '4', label: '4 mm' },
      { value: '5', label: '5 mm' }
    ],
    fields: [
      { id: 'L', label: 'Length L' },
      { id: 'HD', label: 'Hole Diameter Ø' },
      { id: 'Dist', label: 'Distance from End' },
      { 
        id: 'Size', 
        label: 'Size (W x H)', 
        type: 'select', 
        options: [
          { value: '30', label: '30mm x 30mm' },
          { value: '40', label: '40mm x 40mm' },
          { value: '50', label: '50mm x 50mm' },
          { value: '75', label: '75mm x 75mm' }
        ]
      }
    ],
    calc: f => `Angle bar: ${f.Size || 30}×${f.Size || 30}×L${f.L} Hole:Ø${f.HD} Dist:${f.Dist}`,
    area: f => (+f.L || 0) / 1000,
  },
  angle_bar_u: {
    label: 'Angle Bar (U Shape)',
    tag: 'U-Channel',
    category: 'Support',
    unit: 'm',
    thicknessOptions: [
      { value: '4', label: '4 mm', selected: true },
      { value: '5', label: '5 mm' }
    ],
    fields: [
      { id: 'L', label: 'Length L' },
      { id: 'HD', label: 'Hole Diameter Ø' },
      { id: 'Dist', label: 'Distance from End' },
      { 
        id: 'Size', 
        label: 'Size (W x H x D)', 
        type: 'select', 
        options: [
          { value: '40', label: '40mm x 40mm x 40mm' },
          { value: '50', label: '50mm x 50mm x 50mm' },
          { value: '80', label: '80mm x 80mm x 80mm' },
          { value: '100', label: '100mm x 100mm x 100mm' },
          { value: '150', label: '150mm x 150mm x 150mm' }
        ]
      }
    ],
    calc: f => `Angle bar (U Shape): ${f.Size || 50}×${f.Size || 50}×${f.Size || 50}×L${f.L} Hole:Ø${f.HD} Dist:${f.Dist}`,
    area: f => (+f.L || 0) / 1000,
  }
};
