// Photo-based 1960s Grundig Majestic tabletop radio. Millimetres; +Y up, front +Z.
// The acrylic museum card visible on top in the references is intentionally omitted.
export const meta = {
  name: 'Grundig Majestic radio',
  order: 0,
  description: 'A procedural interpretation of the photographed 1960s Grundig Majestic tabletop radio: dark veneered cabinet, cream fascia, woven speaker grille, illuminated multi-band scale, piano-key selectors, concentric-look controls, side speakers and ventilated rear cover. Dimensions and fine calibration are estimated from the photographs.',
}

const modes = [
  { value: 'off', label: 'Off' },
  { value: 'phono', label: 'PU · Phono pickup' },
  { value: 'am', label: 'BC · Broadcast AM' },
  { value: 'shortwave', label: 'SW · Shortwave' },
  { value: 'fm', label: 'FM' },
]
export const params = [
  { id: 'mode', label: 'Piano-key function', group: 'Radio controls', type: 'select', default: 'fm', options: modes, help: 'Depresses the corresponding mechanical selector key. OFF extinguishes the scale lamps; PU selects the period phono input.' },
  { id: 'tuning', label: 'Tuning', group: 'Radio controls', type: 'number', min: 0, max: 100, step: 1, default: 58, unit: '%', help: 'Turns the right tuning knob and moves the mechanical pointer. The displayed frequency depends on the selected band.' },
  { id: 'volume', label: 'Volume', group: 'Radio controls', type: 'number', min: 0, max: 100, step: 1, default: 42, unit: '%', help: 'Turns the left volume control. No audio is generated.' },
  { id: 'tone', label: 'Tone key', group: 'Radio controls', type: 'select', default: 'neutral', options: [
    { value: 'warm', label: 'Warm · bass emphasis' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'bright', label: 'Bright · treble emphasis' },
  ], help: 'Poses the flanking tone keys, following the photographed TONE controls.' },
]

export const presets = [
  { name: 'Museum display', params: { mode: 'off', tuning: 58, volume: 42, tone: 'neutral' } },
  { name: 'Evening FM', params: { mode: 'fm', tuning: 68, volume: 32, tone: 'warm' } },
  { name: 'Shortwave listening', params: { mode: 'shortwave', tuning: 37, volume: 55, tone: 'bright' } },
]

function get(p, id) { return p[id] ?? params.find(spec => spec.id === id)?.default }
function amount(p, id) { const n=Number(get(p,id)); return Math.max(0,Math.min(100,Number.isFinite(n)?n:0))/100 }
function station(mode, t) {
  if (mode === 'fm') return (88 + t * 20).toFixed(1) + ' MHz';
  if (mode === 'am') return Math.round(510 + t * 1090) + ' kHz';
  if (mode === 'shortwave') return (5.9 + t * 12.1).toFixed(1) + ' MHz';
  if (mode === 'phono') return 'Pickup input';
  return 'Power off';
}
export function metrics(p) {
  const mode=String(get(p,'mode')), tune=amount(p,'tuning');
  return [
    { label: 'Function', value: modes.find(x=>x.value===mode)?.label || 'FM' },
    { label: 'Dial indication', value: station(mode,tune), note: 'Illustrative interpolation over the photographed scale, not service-manual calibration.' },
    { label: 'Cabinet (estimated)', value: '650 × 410 × 285 mm', note: 'Estimated from proportions in the supplied photographs; not a manufacturing drawing.' },
    { label: 'Period', value: '1960s', note: 'All modeled user-facing technology is appropriate to the photographed pre-1970 valve-era set.' },
  ]
}

export function build(p) {
  const mode=String(get(p,'mode')), tune=amount(p,'tuning'), volume=amount(p,'volume'), tone=String(get(p,'tone'));
  const on=mode!=='off', parts=[], groups=new Map();
  const C={wood:0x241713, woodEdge:0x120d0b, woodHi:0x3c2820, cream:0xd8c7a4, ivory:0xe7d4a9, cloth:0xb7a581, clothDark:0x635747, dial:0x30241f, dialLit:0x7b4f20, ink:0x2b2420, gold:0xb58a3d, brass:0xc19b54, glass:0x6b5c4b, rear:0x31231f, shadow:0x100d0b};
  function add(name,g,color,props={}) { const key=name+':'+color; if(!groups.has(key))groups.set(key,{name,color,gs:[],props}); groups.get(key).gs.push(g) }
  function block(name,x,y,z,w,h,d,color,r=0,props={}) {
    let g;
    if(r){const s=new THREE.Shape(),a=-w/2,b=-h/2;s.moveTo(a+r,b);s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r);s.lineTo(a+w,b+h-r);s.quadraticCurveTo(a+w,b+h,a+w-r,b+h);s.lineTo(a+r,b+h);s.quadraticCurveTo(a,b+h,a,b+h-r);s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b);g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSize:Math.min(1.4,r*.15),bevelThickness:1,bevelSegments:2,steps:1,curveSegments:5});g.translate(x,y,z-d/2)}
    else {g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z)} add(name,g,color,props)
  }
  function disc(name,x,y,z,r,d,color,r2=r,props={}) {const g=new THREE.CylinderGeometry(r2,r,d,32);g.rotateX(Math.PI/2);g.translate(x,y,z);add(name,g,color,props)}
  function torus(name,x,y,z,r,t,color,props={}) {const g=new THREE.TorusGeometry(r,t,8,40);g.translate(x,y,z);add(name,g,color,props)}
  function line(name,a,b,r,color) {const v=new THREE.Vector3(...a),w=new THREE.Vector3(...b),delta=w.clone().sub(v),g=new THREE.CylinderGeometry(r,r,delta.length(),6);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize()));g.translate(...v.add(w).multiplyScalar(.5).toArray());add(name,g,color)}
  // Side fittings use `w` as their fore-aft span and `d` as case-wall thickness.
  // Keeping their centres in cabinet coordinates avoids rotating their Z offset
  // into X, which would make the left and right grille patterns asymmetric.
  function sideBlock(name,side,y,z,w,h,d,color,r=0) {block(name,side*325,y,z,d,h,w,color,r)}
  function transformSince(start,angle,pivotY,pivotZ,zShift) {
    for(const [key,group] of groups)for(let i=start.get(key)||0;i<group.gs.length;i++)
      group.gs[i].translate(0,0,zShift).translate(0,-pivotY,-pivotZ).rotateX(angle).translate(0,pivotY,pivotZ);
  }
  // Compact single-stroke alphabet for exportable cabinet and control legends.
  const F={
    A:[[0,0,0,4,2,6,4,4,4,0],[0,3,4,3]],B:[[0,0,0,6,3,6,4,5,4,4,3,3,0,3],[3,3,4,2,4,1,3,0,0,0]],C:[[4,5,3,6,1,6,0,5,0,1,1,0,3,0,4,1]],D:[[0,0,0,6,2.5,6,4,4.5,4,1.5,2.5,0,0,0]],E:[[4,6,0,6,0,0,4,0],[0,3,3,3]],F:[[0,0,0,6,4,6],[0,3,3,3]],G:[[4,5,3,6,1,6,0,5,0,1,1,0,3,0,4,1,4,3,2.5,3]],H:[[0,0,0,6],[4,0,4,6],[0,3,4,3]],I:[[0,6,4,6],[2,6,2,0],[0,0,4,0]],J:[[0,6,4,6,4,1,3,0,1,0,0,1]],K:[[0,0,0,6],[0,3,4,6],[0,3,4,0]],L:[[0,6,0,0,4,0]],M:[[0,0,0,6,2,3,4,6,4,0]],N:[[0,0,0,6,4,0,4,6]],O:[[1,0,0,1,0,5,1,6,3,6,4,5,4,1,3,0,1,0]],P:[[0,0,0,6,3,6,4,5,4,4,3,3,0,3]],Q:[[1,0,0,1,0,5,1,6,3,6,4,5,4,1,3,0,1,0],[2.5,1.5,4.5,-.5]],R:[[0,0,0,6,3,6,4,5,4,4,3,3,0,3],[2.5,3,4,0]],S:[[4,5,3,6,1,6,0,5,0,4,1,3,3,3,4,2,4,1,3,0,1,0,0,1]],T:[[0,6,4,6],[2,6,2,0]],U:[[0,6,0,1,1,0,3,0,4,1,4,6]],V:[[0,6,2,0,4,6]],W:[[0,6,1,0,2,3,3,0,4,6]],X:[[0,6,4,0],[0,0,4,6]],Y:[[0,6,2,3,4,6],[2,3,2,0]],Z:[[0,6,4,6,0,0,4,0]],
    '0':[[1,0,0,1,0,5,1,6,3,6,4,5,4,1,3,0,1,0],[.7,.8,3.3,5.2]],'1':[[1,5,2,6,2,0],[.5,0,3.5,0]],'2':[[0,5,1,6,3,6,4,5,4,4,0,0,4,0]],'3':[[0,6,4,6,2.5,3,4,3,4,1,3,0,0,0]],'4':[[0,6,0,3,4,3],[4,6,4,0]],'5':[[4,6,0,6,0,3,3,3,4,2,4,1,3,0,0,0]],'6':[[4,5,3,6,1,6,0,5,0,1,1,0,3,0,4,1,4,2,3,3,0,3]],'7':[[0,6,4,6,1,0]],'8':[[1,3,0,4,0,5,1,6,3,6,4,5,4,4,3,3,1,3,0,2,0,1,1,0,3,0,4,1,4,2,3,3]],'9':[[4,3,1,3,0,4,0,5,1,6,3,6,4,5,4,1,3,0,1,0]],'-':[[0,3,4,3]],'.':[[2,0,2.1,0]],'/':[[0,0,4,6]]
  };
  function text(name,str,x,y,size,z,color,spacing=.45){let width=0;for(const ch of str)width+=(ch===' '?2.7:4.5);width*=size/6;let cx=x-width/2;for(const ch of str){if(ch===' '){cx+=2.7*size/6;continue}const paths=F[ch]||[];for(const path of paths)for(let i=0;i<path.length-2;i+=2)line(name,[cx+path[i]*size/6,y+path[i+1]*size/6,z],[cx+path[i+2]*size/6,y+path[i+3]*size/6,z],Math.max(.18,size*.035),color);cx+=(4.5+spacing)*size/6}}
  // Hollow cabinet envelope. Full-depth top, bottom and side walls meet the
  // separate front-edge trim, keeping the inset front physically joined to the
  // body while leaving an unobstructed bay behind the raked speaker grille.
  block('Dark walnut cabinet top',0,397,-136,650,26,285,C.wood,11,{roughness:.43});
  block('Dark walnut cabinet bottom',0,20,-136,650,40,285,C.wood,10,{roughness:.43});
  for(const x of [-315,315])block('Dark walnut cabinet sides',x,210,-136,20,380,285,C.wood,8,{roughness:.43});
  block('Speaker cavity shadow',0,294,-24,570,170,4,C.shadow,5);
  block('Top veneer highlight',0,405,-133,620,6,264,C.woodHi,2);
  for(const x of [-298,298])block('Cabinet front edge trim',x,210,9,16,366,13,C.woodEdge,5);
  for(const x of [-244,244])block('Rubber feet',x,5,-137,68,10,210,C.shadow,3);
  // Recessed cream fascia with a real speaker opening. This must be an aperture,
  // not a solid slab behind the cloth: the strongly raked grille passes behind
  // the fascia at its lower edge and would otherwise be visually clipped.
  const fascia=new THREE.Shape();
  fascia.moveTo(-291,-177);fascia.lineTo(291,-177);fascia.quadraticCurveTo(302,-177,302,-166);
  fascia.lineTo(302,166);fascia.quadraticCurveTo(302,177,291,177);fascia.lineTo(-291,177);
  fascia.quadraticCurveTo(-302,177,-302,166);fascia.lineTo(-302,-166);fascia.quadraticCurveTo(-302,-177,-291,-177);
  const frontOpening=new THREE.Path();
  // One continuous aperture exposes both folded planes: the raked speaker
  // grille and the dial below it. Its lower edge ends at the control-shelf seam.
  frontOpening.moveTo(-286,-114);frontOpening.lineTo(-286,166);frontOpening.lineTo(286,166);
  frontOpening.lineTo(286,-114);frontOpening.closePath();fascia.holes.push(frontOpening);
  const fasciaGeometry=new THREE.ExtrudeGeometry(fascia,{depth:9,bevelEnabled:true,bevelSize:1,bevelThickness:1,bevelSegments:2,steps:1,curveSegments:6});
  fasciaGeometry.translate(0,216,5.5);add('Cream front fascia',fasciaGeometry,C.cream);
  const grilleStart=new Map([...groups].map(([key,group])=>[key,group.gs.length]));
  block('Speaker cloth field',0,294,17,570,160,3,C.cloth,5,{roughness:.95});
  // Woven vertical warp and subtle horizontal weft visible in the photos.
  for(let x=-278;x<=278;x+=8){block('Speaker grille vertical weave',x,294,20.3,2,152,1.2,(Math.round(x/8)%3===0)?C.ivory:C.clothDark,.5)}
  for(let y=222;y<=366;y+=9)block('Speaker grille horizontal weave',0,y,21,560,.7,.7,C.clothDark,.2);
  block('Speaker grille lower brass rail',0,209,24,568,6,5,C.brass,2,{metalness:.65,roughness:.25});
  // Small period crest and model badge, geometrically simplified from the photo.
  block('Grundig crest shield',202,296,24.5,22,31,2,C.gold,3,{metalness:.6});
  block('Grundig crest inset',202,296,26,15,22,1,C.cream,2);
  for(let a=0;a<4;a++){const q=a*Math.PI/2+.78;line('Grundig clover emblem',[202,296,27],[202+Math.cos(q)*5,296+Math.sin(q)*5,27],2.1,C.ink)}
  block('Model badge',218,270,25,58,14,2,C.gold,2,{metalness:.6});text('Model badge legend','2120',218,267.5,8,27.2,C.ink);
  // The photographed side view shows a pronounced rake: the lower edge sits
  // a little over an inch deeper than the top. Hinge the complete assembly
  // about its top edge so cloth, weave, badges and rail keep relative depth.
  for(const [key,group] of groups)for(let i=grilleStart.get(key)||0;i<group.gs.length;i++)
    group.gs[i].translate(0,-374,-20).rotateX(.19).translate(0,374,20);
  // Multi-band dial glass, four printed scales and a moving pointer. Its top
  // edge meets the recessed lower edge of the speaker grille, then the panel
  // slopes outward toward the piano-key shelf.
  const dialStart=new Map([...groups].map(([key,group])=>[key,group.gs.length]));
  block('Dark tuning scale',0,151,23,566,91,5,on?C.dialLit:C.dial,2,{roughness:.3});
  block('Tuning scale glass',0,151,27,566,91,1,C.glass,2,{roughness:.12});
  const tracks=[181,160,139,118];
  for(const y of tracks){line('Dial scale rules',[-250,y,28],[250,y,28],.45,on?0xe4c986:C.gold);for(let i=0;i<=20;i++){const x=-250+i*25;line('Dial calibration ticks',[x,y-2,28.2],[x,y+(i%5===0?5:3),28.2],i%5===0?.55:.32,on?0xf0d7a5:C.brass)}}
  text('Band legends','BC',-266,177,7,28.5,on?0xf2dfb4:C.brass);text('Band legends','SW',-266,156,7,28.5,on?0xf2dfb4:C.brass);text('Band legends','FM',-266,122,7,28.5,on?0xf2dfb4:C.brass);
  for(const [label,x,y] of [['160',-215,177],['120',-85,177],['80',65,177],['55',215,177],['16',-220,156],['12',-55,156],['8',120,156],['300',-200,122],['260',-40,122],['220',115,122],['200',220,122]])text('Dial numerals',label,x,y,5.2,28.5,on?0xe9d4a7:C.brass);
  for(const [label,x,y] of [['PARIS',-185,145],['LONDON',-102,145],['ROME',-25,145],['BERLIN',58,145],['MADRID',145,145]])text('Station city names',label,x,y,3.1,28.5,on?0xdcc392:C.brass);
  const pointerX=-248+tune*496;block('Mechanical tuning pointer',pointerX,151,29.2,2.2,86,1.4,on?0xffe2a1:C.gold,.4);
  transformSince(dialStart,-.22,197,-10,-39.5);
  // Control shelf and piano keys. Key assignment mirrors the photographed legends.
  const shelfStart=new Map([...groups].map(([key,group])=>[key,group.gs.length]));
  block('Cream control shelf',0,72,22,575,65,31,C.cream,5);
  const keys=[['warm','TONE'],['off','OFF'],['phono','PU'],['am','BC'],['shortwave','SW'],['fm','FM'],['bright','TONE']];
  const keyW=46,gap=3,total=keys.length*(keyW+gap)-gap,start=-total/2+keyW/2;
  for(let i=0;i<keys.length;i++){
    const [id,label]=keys[i],selected=id===mode||(id==='warm'&&tone==='warm')||(id==='bright'&&tone==='bright'),x=start+i*(keyW+gap),drop=selected?-4:0;
    block('Ivory piano keys',x,72+drop,39+(selected?-3:0),keyW,57,19,C.ivory,3,{roughness:.55});
    text('Piano key legends',label,x,96+drop,4.5,49+(selected?-3:0),C.ink);
  }
  // Outer paddles seen at either end of the control shelf.
  for(const x of [-265,265]){block('End rocker slots',x,72,40,17,46,4,C.ink,2);block('End rocker switches',x,72+(x<0&&tone==='warm'||x>0&&tone==='bright'?-3:0),44,10,32,7,C.ivory,2)}
  transformSince(shelfStart,-.28,105,12,-25.5);
  // Deep fluted control knobs with brass rings and moving index marks.
  function knob(name,x,y,a){
    disc(name+' shadow',x,y,31,35,12,C.shadow);
    disc(name+' brass bezel',x,y,42,31,8,C.brass,31,{metalness:.7,roughness:.22});
    disc(name,x,y,50,27,17,C.woodEdge,24,{roughness:.35});
    torus(name+' face ring',x,y,59,22,1.2,C.gold,{metalness:.65});
    // Axial ribs are embedded into the outer cylinder, not laid diagonally in
    // front of it. Their inner halves overlap the knob and form tactile bumps.
    for(let i=0;i<28;i++){
      const q=i*Math.PI/14,gripR=25.7;
      disc(name+' grip ribs',x+Math.cos(q)*gripR,y+Math.sin(q)*gripR,50,1.5,14,C.woodHi);
    }
    line(name+' index',[x+Math.sin(a)*15,y+Math.cos(a)*15,60],[x+Math.sin(a)*22,y+Math.cos(a)*22,60],1.1,C.ivory);
  }
  const knobStart=new Map([...groups].map(([key,group])=>[key,group.gs.length]));
  knob('Volume knob',-246,145,-2.25+volume*4.5);knob('Tuning knob',246,145,-2.25+tune*4.5);
  text('Control legends','VOLUME',-246,190,4.3,30,C.gold);text('Control legends','TUNING',246,190,4.3,30,C.gold);
  transformSince(knobStart,-.22,197,-10,-39.5);
  text('Cabinet wordmark','GRUNDIG MAJESTIC',0,34,7.2,27,C.gold);
  // Side speaker apertures: raised frame, dark recess, and eleven vertical bars.
  for(const side of [-1,1]){
    sideBlock('Side speaker recess',side,210,-135,155,224,3,C.shadow,4);
    sideBlock('Side speaker grille frame',side,210,-135,166,235,5,C.woodHi,5);
    sideBlock('Side speaker inner field',side,210,-135,149,218,7,C.shadow,3);
    for(let z=-198;z<=-72;z+=13)sideBlock('Side speaker grille bars',side,210,z,7,207,7,C.woodHi,2);
  }
  // Rear hardboard cover, screws, ventilation perforations and period connectors.
  block('Rear hardboard cover',0,210,-282,620,360,4,C.rear,8,{roughness:.85});
  for(const x of [-288,288])for(const y of [50,370]){disc('Rear cover screws',x,y,-285,4,2,C.brass);line('Rear screw slots',[x-2.5,y,-286.2],[x+2.5,y,-286.2],.45,C.shadow)}
  for(const y of [80,96,112,128,292,308,324,340])for(let x=-248;x<=248;x+=18)disc('Rear ventilation holes',x,y,-285.2,3.8,1,C.shadow);
  block('Rear connection panel',0,199,-286,210,73,2,C.shadow,4);
  for(const x of [-70,-24,24,70]){torus('Rear sockets',x,198,-288,9,2,C.brass);disc('Rear socket wells',x,198,-289,6,1,C.shadow)}
  text('Rear connection legends','ANT   TAPE   PU',0,226,4.3,-289,C.gold);
  // Simple internal shadow behind ventilation holes gives the rear some depth.
  block('Rear internal shadow',0,210,-275,570,320,5,C.shadow,5);
  for(const {name,color,gs,props} of groups.values())parts.push({name,color,geometry:merge(gs),...props,...(name.includes('legend')||name.includes('numeral')||name.includes('names')?{lod:{surface:'z'}}:{})});
  return parts;
}
