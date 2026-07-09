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
    // Excel: main trunk = perimeter of A×B * L, branch + side = perimeter of E×F + C×D * 90° elbow length (PI/2*R)
    area: f => {
      const a = +f.A, b = +f.B, e = +f.E, ff = +f.F, c = +f.C, d = +f.D, l = +f.L, r = +f.R;
      const mainPerim = 2 * (a + b) / 1000;
      const branchPerim = 2 * (e + ff) / 1000;
      const sidePerim = 2 * (c + d) / 1000;
      return mainPerim * (l / 1000) + (branchPerim + sidePerim) * (Math.PI / 2 * r / 1000);
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
    fields: [
      { id: 'A',  label: 'Inlet Width A'    },
      { id: 'B',  label: 'Inlet Height B'   },
      { id: 'C',  label: 'Outlet Width C'   },
      { id: 'D2', label: 'Outlet Height D'  },
      { id: 'L',  label: 'Total Length L'   },
      { id: 'F1', label: 'Top Flange F1'    },
      { id: 'S',  label: 'Top Step S'       },
      { id: 'L1', label: 'Inlet Section L1' },
      { id: 'L2', label: 'Body Section L2'  },
      { id: 'Fb', label: 'Bottom Flange Fb' },
      { id: 'Fi', label: 'Center Gap Fi'    },
    ],
    calc: f => `Fan conn: ${f.A}×${f.B} → ${f.C}×${f.D2} × L${f.L}`,
    area: f => {
      const a=+f.A, b=+f.B, c=+f.C, d=+f.D2, l=+f.L;
      const f1=+f.F1, s=+f.S, l1=+f.L1, l2=+f.L2, fb=+f.Fb, fi=+f.Fi;
      if (!a||!b||!c||!d||!l||!l2) return 0;
      const slantW = Math.sqrt(l2*l2 + ((a-c)/2)**2);
      const slantH = Math.sqrt(l2*l2 + s*s);
      const topBot     = (a+c)/2 * slantW / 1e6 * 2;
      const sides      = (b+d)/2 * slantH / 1e6 * 2;
      const inletSect  = 2*(a+b)/1000 * (l1/1000);
      const outFlange  = 2*(c+d)/1000 * (fb/1000);
      const stripF1    = (c*2+d*2) * f1 / 1e6;
      return topBot + sides + inletSect + outFlange + stripF1;
    },
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
    fields: [{ id: 'A', label: 'Main Width A' }, { id: 'B', label: 'Main Height B' }, { id: 'C', label: 'Branch Width C' }, { id: 'D2', label: 'Branch Height D' }, { id: 'R', label: 'Radius R' }, { id: 'L', label: 'Length L' }],
    calc: f => `4-ways: ${f.A}×${f.B}→4×(${f.C}×${f.D2}R${f.R})×L${f.L}`,
    // Excel: main body = 2*(A+B)/1000 * L/1000 + 4 branches = 4 * 2*(C+D)/1000 * PI/2*R/1000
    area: f => {
      const a = +f.A, b = +f.B, c = +f.C, d = +f.D2, r = +f.R, l = +f.L;
      return 2 * (a + b) / 1000 * (l / 1000) + 4 * 2 * (c + d) / 1000 * (Math.PI / 2 * r / 1000);
    },
  }
};
