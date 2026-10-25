import fs from 'node:fs';
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
const src=fs.readFileSync(new URL('../objects/earbud-interface.js',import.meta.url),'utf8');
const obj=new Function('THREE',src.replace(/export /g,'')+'; return {build,params};')(THREE);
const p=Object.fromEntries(obj.params.map(x=>[x.id,x.default]));
const raw=obj.build(p)[0].geometry;raw.deleteAttribute('normal');
const g=mergeVertices(raw,1e-7);g.computeVertexNormals();const pos=g.attributes.position,ix=g.index,edges=new Map();let volume=0;
for(let i=0;i<ix.count;i+=3){
 const ids=[ix.getX(i),ix.getX(i+1),ix.getX(i+2)];
 const [a,b,c]=ids.map(k=>new THREE.Vector3().fromBufferAttribute(pos,k));
 if(b.clone().sub(a).cross(c.clone().sub(a)).length()<1e-10)throw Error('Degenerate triangle');
 volume+=a.dot(b.clone().cross(c))/6;
 for(let j=0;j<3;j++){
  const a=ids[j],b=ids[(j+1)%3],key=[a,b].sort((a,b)=>a-b).join(',');
  const e=edges.get(key)||{count:0,balance:0};e.count++;e.balance+=a<b?1:-1;edges.set(key,e);
 }
}
const bad=[...edges.values()].filter(e=>e.count!==2||e.balance!==0).length;
if(volume<=0||bad)throw Error(`Invalid mesh: volume ${volume}, bad edges ${bad}`);
g.rotateX(Math.PI/2);g.computeBoundingBox();
const root=new URL('../exports/earbud-interface/',import.meta.url);
const stl=new STLExporter().parse(new THREE.Mesh(g),{binary:true});
fs.writeFileSync(new URL('earbud-interface-prototype.stl',root),Buffer.from(stl.buffer));
fs.writeFileSync(new URL('parameters.json',root),JSON.stringify(p,null,2)+'\n');
console.log({volume_mm3:volume,triangles:ix.count/3,badEdges:bad,bounds:g.boundingBox});
