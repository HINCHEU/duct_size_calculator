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
