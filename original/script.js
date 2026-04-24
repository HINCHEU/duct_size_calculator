const DUCTS = {
  rect_straight: {
    label: 'Rectangular Straight Duct',
    tag: 'Straight',
    fields: [{id:'A',label:'Width A'},{id:'B',label:'Height B'},{id:'L',label:'Length L'}],
    calc: f => `Ducting: ${f.A}×${f.B}×L${f.L}`,
    area: f => 2*(+f.A + +f.B)*(+f.L)/1e6,
    svg: `<svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="ar" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1B3F8B"/></marker>
      <marker id="arl" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 Z" fill="#1B3F8B"/></marker></defs>
      <rect x="20" y="35" width="140" height="75" rx="2" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <polygon points="160,35 205,20 205,110 160,110" fill="#b8cff0" stroke="#1B3F8B" stroke-width="1.5"/>
      <line x1="20" y1="128" x2="160" y2="128" stroke="#1B3F8B" stroke-width="1" marker-start="url(#arl)" marker-end="url(#ar)"/>
      <text x="90" y="141" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">L</text>
      <line x1="8" y1="35" x2="8" y2="110" stroke="#1B3F8B" stroke-width="1" marker-start="url(#arl)" marker-end="url(#ar)"/>
      <text x="16" y="76" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">B</text>
      <line x1="160" y1="8" x2="205" y2="8" stroke="#1B3F8B" stroke-width="1" marker-start="url(#arl)" marker-end="url(#ar)"/>
      <text x="183" y="6" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">A</text>
    </svg>`
  },
  round_straight: {
    label: 'Round Duct',
    tag: 'Round',
    fields: [{id:'D',label:'Diameter Ø'},{id:'L',label:'Length L'}],
    calc: f => `Round duct: Ø${f.D}×L${f.L}`,
    area: f => Math.PI*(+f.D)*(+f.L)/1e6,
    svg: `<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="ag" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1B3F8B"/></marker>
      <marker id="agl" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 Z" fill="#1B3F8B"/></marker></defs>
      <ellipse cx="50" cy="65" rx="28" ry="44" fill="#c5d9f5" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="50" y="21" width="130" height="88" fill="#dde8f8" stroke="none"/>
      <ellipse cx="180" cy="65" rx="28" ry="44" fill="#b8cff0" stroke="#1B3F8B" stroke-width="1.5"/>
      <line x1="50" y1="21" x2="180" y2="21" stroke="#1B3F8B" stroke-width="1.5"/>
      <line x1="50" y1="109" x2="180" y2="109" stroke="#1B3F8B" stroke-width="1.5"/>
      <line x1="50" y1="120" x2="180" y2="120" stroke="#1B3F8B" stroke-width="1" marker-start="url(#agl)" marker-end="url(#ag)"/>
      <text x="115" y="132" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">L</text>
      <line x1="180" y1="65" x2="210" y2="65" stroke="#1B3F8B" stroke-width="1" marker-end="url(#ag)"/>
      <text x="198" y="61" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">Ø</text>
    </svg>`
  },
  rect_elbow90: {
    label: 'Rectangular Elbow 90°',
    tag: 'Elbow 90°',
    fields: [{id:'A',label:'Width A'},{id:'B',label:'Height B'},{id:'R',label:'Inner Radius R'}],
    calc: f => `Elbow 90°: ${f.A}×${f.B}×R${f.R}`,
    area: f => { const a=+f.A,b=+f.B,r=+f.R; return (Math.PI/2)*(2*b*(r+a/2)+2*a*(r+a/2))/1e6; },
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M25,170 L25,90 Q25,35 80,35 L165,35 L165,75 Q130,75 118,87 Q106,100 106,130 L106,170 Z" fill="#dde8f8" stroke="#1B3F8B" stroke-width="2"/>
      <text x="95" y="58" font-size="13" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="700">90°</text>
      <text x="58" y="128" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">B</text>
      <text x="130" y="100" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">A</text>
      <text x="72" y="100" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">R</text>
    </svg>`
  },
  rect_elbow45: {
    label: 'Rectangular Elbow 45°',
    tag: 'Elbow 45°',
    fields: [{id:'A',label:'Width A'},{id:'B',label:'Height B'},{id:'R',label:'Inner Radius R'}],
    calc: f => `Elbow 45°: ${f.A}×${f.B}×R${f.R}`,
    area: f => { const a=+f.A,b=+f.B,r=+f.R; return (Math.PI/4)*(2*b*(r+a/2)+2*a*(r+a/2))/1e6; },
    svg: `<svg viewBox="0 0 210 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M30,175 L30,105 Q30,55 80,42 L175,42 L165,78 Q128,78 115,92 Q100,108 100,140 L100,175 Z" fill="#dde8f8" stroke="#1B3F8B" stroke-width="2"/>
      <text x="98" y="64" font-size="13" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="700">45°</text>
      <text x="57" y="138" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">B</text>
      <text x="75" y="105" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">R</text>
    </svg>`
  },
  round_elbow90: {
    label: 'Round Elbow 90°',
    tag: 'Round Elbow',
    fields: [{id:'D',label:'Diameter Ø'},{id:'R',label:'Bend Radius R'}],
    calc: f => `Round elbow 90°: Ø${f.D}×R${f.R}`,
    area: f => Math.PI*Math.PI*(+f.D)*(+f.R)/2/1e6,
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M35,175 Q35,80 135,35" fill="none" stroke="#c5d9f5" stroke-width="34" stroke-linecap="round"/>
      <path d="M35,175 Q35,80 135,35" fill="none" stroke="#1B3F8B" stroke-width="2"/>
      <path d="M35,175 Q35,95 115,55" fill="none" stroke="#1B3F8B" stroke-width="2"/>
      <text x="60" y="102" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">R</text>
      <text x="122" y="82" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">Ø</text>
      <text x="45" y="165" font-size="13" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="700">90°</text>
    </svg>`
  },
  duct_reducer: {
    label: 'Duct Reducer (Rect→Rect)',
    tag: 'Reducer',
    fields: [{id:'A',label:'Start Width A'},{id:'B',label:'Start Height B'},{id:'C',label:'End Width C'},{id:'D2',label:'End Height D'},{id:'L',label:'Length L'}],
    calc: f => `Duct reducer: (${f.A}×${f.B})→(${f.C}×${f.D2})×L${f.L}`,
    area: f => { const a=+f.A,b=+f.B,c=+f.C,d=+f.D2,l=+f.L; const s1=Math.sqrt(l*l+((a-c)/2)**2),s2=Math.sqrt(l*l+((b-d)/2)**2); return((a+c)*s1+(b+d)*s2)/1e6; },
    svg: `<svg viewBox="0 0 230 140" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="ap" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1B3F8B"/></marker>
      <marker id="apl" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 Z" fill="#1B3F8B"/></marker></defs>
      <polygon points="10,20 10,120 80,100 80,40" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="80" y="40" width="130" height="60" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <text x="35" y="74" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">A×B</text>
      <text x="145" y="74" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">C×D</text>
      <line x1="80" y1="130" x2="210" y2="130" stroke="#1B3F8B" stroke-width="1" marker-start="url(#apl)" marker-end="url(#ap)"/>
      <text x="145" y="142" text-anchor="middle" font-size="10" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif">L</text>
    </svg>`
  },
  rect_to_round: {
    label: 'Rectangle to Round',
    tag: 'Rect→Round',
    fields: [{id:'A',label:'Rect Width A'},{id:'B',label:'Rect Height B'},{id:'D',label:'Round Ø'},{id:'L',label:'Length L'}],
    calc: f => `Rect→Round: ${f.A}×${f.B}→Ø${f.D}×L${f.L}`,
    area: f => (((+f.A)+(+f.B))*2+Math.PI*(+f.D))/2*(+f.L)/1e6,
    svg: `<svg viewBox="0 0 230 140" xmlns="http://www.w3.org/2000/svg">
      <polygon points="10,15 10,125 75,95 75,45" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="75" y="45" width="100" height="50" fill="#dde8f8" stroke="none"/>
      <ellipse cx="175" cy="70" rx="22" ry="25" fill="#b8cff0" stroke="#1B3F8B" stroke-width="1.5"/>
      <line x1="75" y1="45" x2="175" y2="45" stroke="#1B3F8B" stroke-width="1.5"/>
      <line x1="75" y1="95" x2="175" y2="95" stroke="#1B3F8B" stroke-width="1.5"/>
      <text x="32" y="72" text-anchor="middle" font-size="10" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">A×B</text>
      <text x="182" y="58" font-size="10" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">Ø</text>
    </svg>`
  },
  reducer_duct: {
    label: 'Reducer Duct (A×B→C×D×L)',
    tag: 'Reducer Duct',
    fields: [{id:'A',label:'Large Width A'},{id:'B',label:'Large Height B'},{id:'C',label:'Small Width C'},{id:'D2',label:'Small Height D'},{id:'L',label:'Length L'}],
    calc: f => `Reducer: ${f.A}×${f.B}→${f.C}×${f.D2}×L${f.L}`,
    area: f => { const a=+f.A,b=+f.B,c=+f.C,d=+f.D2,l=+f.L; const s1=Math.sqrt(l*l+((a-c)/2)**2),s2=Math.sqrt(l*l+((b-d)/2)**2); return((a+c)*s1+(b+d)*s2)/1e6; },
    svg: `<svg viewBox="0 0 230 140" xmlns="http://www.w3.org/2000/svg">
      <polygon points="10,10 10,130 80,105 80,35" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="80" y="35" width="130" height="70" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <text x="35" y="74" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">A×B</text>
      <text x="145" y="72" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">C×D</text>
    </svg>`
  },
  reducer_duct_r: {
    label: 'Reducer Duct with Offset R',
    tag: 'Reducer+Offset',
    fields: [{id:'A',label:'Large Width A'},{id:'B',label:'Large Height B'},{id:'C',label:'Small Width C'},{id:'D2',label:'Small Height D'},{id:'L',label:'Length L'},{id:'R',label:'Offset R'}],
    calc: f => `Reducer+offset: ${f.A}×${f.B}→${f.C}×${f.D2}×L${f.L}×R${f.R}`,
    area: f => { const a=+f.A,b=+f.B,c=+f.C,d=+f.D2,l=+f.L; const s1=Math.sqrt(l*l+((a-c)/2)**2),s2=Math.sqrt(l*l+((b-d)/2)**2); return((a+c)*s1+(b+d)*s2)/1e6; },
    svg: `<svg viewBox="0 0 230 140" xmlns="http://www.w3.org/2000/svg">
      <polygon points="10,20 10,120 80,110 80,30" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <polygon points="80,30 80,110 210,90 210,50" fill="#c5d9f5" stroke="#1B3F8B" stroke-width="1.5"/>
      <text x="35" y="72" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">A×B</text>
      <text x="155" y="72" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">C×D</text>
      <text x="155" y="110" font-size="10" fill="#D72B2B" font-family="Barlow Condensed,sans-serif">R offset</text>
    </svg>`
  },
  collar_duct: {
    label: 'Collar Duct',
    tag: 'Collar',
    fields: [{id:'A',label:'Start Width A'},{id:'B',label:'Start Height B'},{id:'C',label:'End Width C'},{id:'D2',label:'End Height D'},{id:'L',label:'Length L'}],
    calc: f => `Collar: ${f.A}×${f.B}→${f.C}×${f.D2}×L${f.L}`,
    area: f => { const a=+f.A,b=+f.B,c=+f.C,d=+f.D2,l=+f.L; return((a+c)*l+(b+d)*l)/1e6; },
    svg: `<svg viewBox="0 0 230 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="30" width="90" height="70" rx="2" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <polygon points="100,30 215,15 215,115 100,100" fill="#b8cff0" stroke="#1B3F8B" stroke-width="1.5"/>
      <text x="55" y="68" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">A×B</text>
      <text x="165" y="68" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">C×D</text>
    </svg>`
  },
  offset_duct: {
    label: 'Offset Duct',
    tag: 'Offset',
    fields: [{id:'A',label:'Width A'},{id:'B',label:'Height B'},{id:'R',label:'Offset Drop R'},{id:'L',label:'Total Length L'}],
    calc: f => `Offset: ${f.A}×${f.B}×R${f.R}×L${f.L}`,
    area: f => 2*(+f.A+(+f.B))*(+f.L)/1e6,
    svg: `<svg viewBox="0 0 250 150" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="70" height="45" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <polygon points="80,20 80,65 170,105 170,60" fill="#c5d9f5" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="170" y="60" width="65" height="45" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <line x1="80" y1="20" x2="170" y2="60" stroke="#D72B2B" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="44" y="45" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">A×B</text>
      <text x="202" y="86" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">A×B</text>
      <text x="122" y="35" font-size="10" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">R</text>
    </svg>`
  },
  y_duct: {
    label: 'Y-Ducting',
    tag: 'Y-Duct',
    fields: [{id:'A',label:'Main Width A'},{id:'B',label:'Main Height B'},{id:'C',label:'Branch 1 Width C'},{id:'D2',label:'Branch 1 Height D'},{id:'E',label:'Branch 2 Width E'},{id:'F',label:'Branch 2 Height F'},{id:'L',label:'Total Length L'}],
    calc: f => `Y-ducting: (${f.A}×${f.B})→(${f.C}×${f.D2})+(${f.E}×${f.F})×L${f.L}`,
    area: f => { const a=+f.A,b=+f.B,c=+f.C,d=+f.D2,e=+f.E,ff=+f.F,l=+f.L; return(2*(a+b)+2*(c+d)+2*(e+ff))*l/3/1e6; },
    svg: `<svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="80" y="135" width="55" height="50" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <polygon points="80,135 135,135 175,75 40,75" fill="#c5d9f5" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="10" y="25" width="42" height="52" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5" transform="rotate(-30,31,51)"/>
      <rect x="162" y="22" width="42" height="52" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5" transform="rotate(30,183,48)"/>
      <text x="107" y="162" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">A×B</text>
      <text x="22" y="52" font-size="9" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">C×D</text>
      <text x="175" y="52" font-size="9" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">E×F</text>
    </svg>`
  },
  butterfly_rect: {
    label: 'Butterfly Duct (Rect)',
    tag: 'Butterfly',
    fields: [{id:'A',label:'Main Width A'},{id:'B',label:'Main Height B'},{id:'C',label:'Left Branch C'},{id:'D2',label:'Left Height D'},{id:'R1',label:'Radius R1'},{id:'E',label:'Right Branch E'},{id:'F',label:'Right Height F'},{id:'R2',label:'Radius R2'}],
    calc: f => `Butterfly: ${f.A}×${f.B}→${f.C}×${f.D2}R${f.R1}↔${f.E}×${f.F}R${f.R2}`,
    area: f => { const c=+f.C,d=+f.D2,r1=+f.R1,e=+f.E,ff=+f.F,r2=+f.R2,a=+f.A,b=+f.B; return((c+d)*2*(Math.PI/2*r1)+(e+ff)*2*(Math.PI/2*r2)+(a+b)*2*0.4)/1e6; },
    svg: `<svg viewBox="0 0 240 170" xmlns="http://www.w3.org/2000/svg">
      <rect x="90" y="105" width="58" height="55" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <path d="M90,105 Q55,65 15,52 L15,90 Q48,105 90,135" fill="#c5d9f5" stroke="#1B3F8B" stroke-width="1.5"/>
      <path d="M148,105 Q183,65 223,52 L223,90 Q190,105 148,135" fill="#c5d9f5" stroke="#1B3F8B" stroke-width="1.5"/>
      <text x="119" y="136" text-anchor="middle" font-size="10" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">A×B</text>
      <text x="30" y="64" font-size="9" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">R1</text>
      <text x="200" y="64" font-size="9" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">R2</text>
    </svg>`
  },
  r_type: {
    label: 'R-Type Duct',
    tag: 'R-Type',
    fields: [{id:'A',label:'Main Width A'},{id:'B',label:'Main Height B'},{id:'C',label:'Branch 1 C'},{id:'D2',label:'Branch 1 Height D'},{id:'E',label:'Branch 2 E'},{id:'F',label:'Branch 2 Height F'},{id:'R',label:'Radius R'},{id:'L',label:'Length L'}],
    calc: f => `R-type: ${f.A}×${f.B}→${f.E}×${f.F}↔${f.C}×${f.D2}R${f.R}L${f.L}`,
    area: f => { const a=+f.A,b=+f.B,c=+f.C,d=+f.D2,e=+f.E,ff=+f.F,l=+f.L,r=+f.R; return(2*(a+b)*l*0.4+2*(c+d)*Math.PI/2*r/1e3+2*(e+ff)*l*0.4)/1e6; },
    svg: `<svg viewBox="0 0 250 165" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="65" width="120" height="55" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <path d="M130,65 Q160,65 172,44 L215,44 L215,84 Q192,84 180,96 L130,120" fill="#c5d9f5" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="172" y="105" width="58" height="45" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <text x="65" y="96" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">A×B</text>
      <text x="185" y="55" font-size="9" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">C×D</text>
      <text x="195" y="132" font-size="9" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">E×F</text>
    </svg>`
  },
  plenum_box: {
    label: 'Plenum Box (Side Inlet)',
    tag: 'Plenum Side',
    fields: [{id:'A',label:'Body Width A'},{id:'B',label:'Body Depth B'},{id:'H',label:'Body Height H'},{id:'D',label:'Connector Ø'},{id:'H2',label:'Connector Height H2'}],
    calc: f => `Plenum: ${f.A}×${f.B}×H${f.H} Conn:Ø${f.D}×H${f.H2}`,
    area: f => { const a=+f.A,b=+f.B,h=+f.H,d=+f.D,h2=+f.H2; return(2*a*b+2*a*h+2*b*h+Math.PI*d*h2)/1e6; },
    svg: `<svg viewBox="0 0 230 170" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="150" height="110" rx="2" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <ellipse cx="95" cy="30" rx="28" ry="11" fill="#b8cff0" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="67" y="8" width="56" height="22" fill="#c5d9f5" stroke="none"/>
      <ellipse cx="95" cy="8" rx="28" ry="11" fill="#b8cff0" stroke="#1B3F8B" stroke-width="1.5"/>
      <text x="95" y="88" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">Body A×B×H</text>
      <text x="95" y="10" text-anchor="middle" font-size="9" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">Ø Connector</text>
    </svg>`
  },
  plenum_top: {
    label: 'Plenum Box (Top Connector)',
    tag: 'Plenum Top',
    fields: [{id:'A',label:'Body Width A'},{id:'B',label:'Body Depth B'},{id:'H',label:'Body Height H'},{id:'D',label:'Connector Ø'},{id:'H2',label:'Connector Height H2'}],
    calc: f => `Plenum top: ${f.A}×${f.B}×H${f.H} Conn:Ø${f.D}×H${f.H2}`,
    area: f => { const a=+f.A,b=+f.B,h=+f.H,d=+f.D,h2=+f.H2; return(2*a*b+2*a*h+2*b*h+Math.PI*d*h2)/1e6; },
    svg: `<svg viewBox="0 0 230 170" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="55" width="170" height="100" rx="2" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <ellipse cx="105" cy="55" rx="30" ry="13" fill="#b8cff0" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="75" y="18" width="60" height="37" fill="#c5d9f5" stroke="none"/>
      <ellipse cx="105" cy="18" rx="30" ry="13" fill="#b8cff0" stroke="#1B3F8B" stroke-width="1.5"/>
      <text x="105" y="112" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">Body A×B×H</text>
      <text x="105" y="18" text-anchor="middle" font-size="9" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">Connector Ø</text>
    </svg>`
  },
  canvas_round: {
    label: 'Canvas Connection (Round)',
    tag: 'Canvas Round',
    fields: [{id:'D',label:'Diameter Ø'},{id:'L',label:'Canvas Length L'}],
    calc: f => `Canvas round: Ø${f.D}×L${f.L}`,
    area: f => Math.PI*(+f.D)*(+f.L)/1e6,
    svg: `<svg viewBox="0 0 230 130" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="65" rx="28" ry="42" fill="none" stroke="#1B3F8B" stroke-width="4"/>
      <rect x="50" y="23" width="125" height="84" fill="#dde8f8" stroke="none"/>
      <ellipse cx="175" cy="65" rx="28" ry="42" fill="none" stroke="#1B3F8B" stroke-width="4"/>
      <line x1="50" y1="23" x2="175" y2="23" stroke="#1B3F8B" stroke-width="4"/>
      <line x1="50" y1="107" x2="175" y2="107" stroke="#1B3F8B" stroke-width="4"/>
      <rect x="35" y="18" width="13" height="94" fill="#D72B2B" stroke="#b02020" stroke-width="1" opacity="0.8"/>
      <rect x="178" y="18" width="13" height="94" fill="#D72B2B" stroke="#b02020" stroke-width="1" opacity="0.8"/>
      <text x="112" y="68" text-anchor="middle" font-size="10" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">Canvas Ø×L</text>
    </svg>`
  },
  canvas_rect: {
    label: 'Canvas Connection (Rect)',
    tag: 'Canvas Rect',
    fields: [{id:'A',label:'Width A'},{id:'B',label:'Height B'},{id:'L',label:'Canvas Length L'}],
    calc: f => `Canvas rect: ${f.A}×${f.B}×L${f.L}`,
    area: f => 2*(+f.A+(+f.B))*(+f.L)/1e6,
    svg: `<svg viewBox="0 0 230 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="25" width="185" height="80" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="20" y="25" width="14" height="80" fill="#D72B2B" stroke="#b02020" stroke-width="1" opacity="0.85"/>
      <rect x="191" y="25" width="14" height="80" fill="#D72B2B" stroke="#b02020" stroke-width="1" opacity="0.85"/>
      <text x="112" y="69" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">Canvas A×B×L</text>
    </svg>`
  },
  fan_conn: {
    label: 'Fan Connection',
    tag: 'Fan Conn',
    fields: [{id:'A',label:'Inlet Width A'},{id:'B',label:'Inlet Height B'},{id:'C',label:'Outlet Width C'},{id:'D2',label:'Outlet Height D'},{id:'L',label:'Length L'}],
    calc: f => `Fan conn: ${f.A}×${f.B}→${f.C}×${f.D2}×L${f.L}`,
    area: f => { const a=+f.A,b=+f.B,c=+f.C,d=+f.D2,l=+f.L; const s1=Math.sqrt(l*l+((a-c)/2)**2),s2=Math.sqrt(l*l+((b-d)/2)**2); return((a+c)*s1+(b+d)*s2)/1e6; },
    svg: `<svg viewBox="0 0 240 165" xmlns="http://www.w3.org/2000/svg">
      <polygon points="10,30 10,135 80,105 80,60" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="80" y="60" width="60" height="45" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="140" y="35" width="80" height="90" fill="#b8cff0" stroke="#1B3F8B" stroke-width="1.5"/>
      <text x="35" y="85" text-anchor="middle" font-size="10" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">Inlet A×B</text>
      <text x="180" y="83" text-anchor="middle" font-size="10" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">Outlet C×D</text>
    </svg>`
  },
  wire_mesh: {
    label: 'Wire Mesh',
    tag: 'Wire Mesh',
    fields: [{id:'A',label:'Length A'},{id:'B',label:'Width B'}],
    calc: f => `Wire mesh: ${f.A}×${f.B}`,
    area: f => +f.A*(+f.B)/1e6,
    svg: `<svg viewBox="0 0 230 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="185" height="100" fill="#eef2fb" stroke="#1B3F8B" stroke-width="1.5" rx="2"/>
      <g stroke="#8a97b8" stroke-width="0.8">${Array.from({length:10},(_,i)=>`<line x1="${36+i*17}" y1="20" x2="${36+i*17}" y2="120"/>`).join('')}${Array.from({length:6},(_,i)=>`<line x1="20" y1="${35+i*17}" x2="205" y2="${35+i*17}"/>`).join('')}</g>
      <text x="112" y="136" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">A</text>
      <text x="6" y="72" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">B</text>
    </svg>`
  },
  transfer_air: {
    label: 'Transfer Air Duct',
    tag: 'Transfer Air',
    fields: [{id:'A',label:'Width A'},{id:'B',label:'Height B'},{id:'L',label:'Length L'}],
    calc: f => `Transfer air: ${f.A}×${f.B}×L${f.L}`,
    area: f => 2*(+f.A+(+f.B))*(+f.L)/1e6,
    svg: `<svg viewBox="0 0 250 165" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="55" width="230" height="65" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <polygon points="80,55 108,15 133,15 160,55" fill="#b8cff0" stroke="#1B3F8B" stroke-width="1.5"/>
      <polygon points="80,120 108,150 133,150 160,120" fill="#b8cff0" stroke="#1B3F8B" stroke-width="1.5"/>
      <text x="125" y="91" text-anchor="middle" font-size="10" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="600">Transfer Air A×B×L</text>
    </svg>`
  },
  '4ways': {
    label: '4-Ways Duct',
    tag: '4-Ways',
    fields: [{id:'A',label:'Main Width A'},{id:'B',label:'Main Height B'},{id:'C',label:'Branch Width C'},{id:'D2',label:'Branch Height D'},{id:'R',label:'Radius R'},{id:'L',label:'Length L'}],
    calc: f => `4-ways: ${f.A}×${f.B}→4×(${f.C}×${f.D2}R${f.R})×L${f.L}`,
    area: f => { const a=+f.A,b=+f.B,c=+f.C,d=+f.D2,l=+f.L; return(2*(a+b)*l+4*2*(c+d)*l/4)/1e6; },
    svg: `<svg viewBox="0 0 230 230" xmlns="http://www.w3.org/2000/svg">
      <rect x="82" y="82" width="66" height="66" fill="#c5d9f5" stroke="#1B3F8B" stroke-width="2"/>
      <rect x="82" y="10" width="66" height="72" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="82" y="148" width="66" height="72" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="10" y="82" width="72" height="66" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <rect x="148" y="82" width="72" height="66" fill="#dde8f8" stroke="#1B3F8B" stroke-width="1.5"/>
      <text x="115" y="119" text-anchor="middle" font-size="11" fill="#1B3F8B" font-family="Barlow Condensed,sans-serif" font-weight="700">Main</text>
      <text x="115" y="50" text-anchor="middle" font-size="9" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">C×D</text>
      <text x="115" y="190" text-anchor="middle" font-size="9" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">C×D</text>
      <text x="45" y="119" text-anchor="middle" font-size="9" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">C×D</text>
      <text x="183" y="119" text-anchor="middle" font-size="9" fill="#D72B2B" font-family="Barlow Condensed,sans-serif" font-weight="600">C×D</text>
    </svg>`
  }
};

let items = [];

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
  const wrap = document.getElementById('duct-img-wrap');
  wrap.innerHTML = t.svg + `<span class="duct-type-tag">${t.tag}</span>`;
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
  const p = document.getElementById('preview-area');
  if (ok) {
    const area = t.area(f);
    p.innerHTML = `<div class="preview-dim">${t.calc(f)}</div><div class="preview-area">${area.toFixed(4)} <span style="font-size:14px;font-weight:400;color:var(--text-secondary)">m²</span></div>`;
  } else {
    p.innerHTML = `<div class="preview-muted">Fill dimensions above to preview surface area</div>`;
  }
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
  document.getElementById('stat-area').innerHTML = `${total.toFixed(4)} <span class="stat-unit">m²</span>`;
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
      <div class="item-area">${sub.toFixed(4)}<div class="item-area-unit">m²</div></div>
      <button class="btn-del" onclick="removeItem(${item.id})">✕</button>
    </div>`;
  });
  el.innerHTML = html;
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  document.getElementById('total-items-label').textContent = `${items.length} items · ${totalQty} nos`;
  document.getElementById('total-area-val').innerHTML = `${total.toFixed(4)} <span class="total-m2">m²</span>`;
}

function clearAll() {
  if (!items.length) return;
  if (confirm('Clear all items from the list?')) { items = []; renderList(); }
}

function exportCSV() {
  if (!items.length) { alert('No items to export.'); return; }
  let csv = 'No,Type,Dimensions,Qty,Area per unit (m2),Total area (m2)\n';
  items.forEach((it, i) => csv += `${i + 1},"${it.label}","${it.dim}",${it.qty},${it.area.toFixed(4)},${(it.area * it.qty).toFixed(4)}\n`);
  const tot = items.reduce((s, i) => s + i.area * i.qty, 0);
  csv += `,,,,Grand Total,${tot.toFixed(4)}\n`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'CEP_duct_fabrication.csv'; a.click();
}

function exportPrint() {
  if (!items.length) { alert('No items to export.'); return; }
  const total = items.reduce((s, i) => s + i.area * i.qty, 0);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const rows = items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.label}</td><td style="font-family:monospace">${it.dim}</td><td style="text-align:center">${it.qty}</td><td style="text-align:right">${it.area.toFixed(4)}</td><td style="text-align:right;font-weight:700">${(it.area * it.qty).toFixed(4)}</td></tr>`).join('');
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
      <tfoot><tr><td colspan="3">Grand Total</td><td style="text-align:center;color:#fff">${totalQty} nos</td><td></td><td style="text-align:right;color:#fff;font-size:16px">${total.toFixed(4)} m²</td></tr></tfoot>
    </table>
    <div class="no-print"><button onclick="window.print()" style="background:#1B3F8B;color:#fff;border:none;padding:10px 24px;font-family:'Barlow',sans-serif;font-weight:600;cursor:pointer;border-radius:6px">Print Report</button></div>
  </div></body></html>`);
  w.document.close();
}

buildSelect();
onTypeChange();