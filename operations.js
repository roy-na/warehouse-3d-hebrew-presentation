import * as THREE from 'three';

import {truckState,forkliftState} from './operations-state.js';

export function createOperations(scene,box){
 const forklifts=[],workers=[],trucks=[];
 function group(parent=scene){const g=new THREE.Group();parent.add(g);return g;}
 function wheel(parent,x,y,z,r=.35){const w=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.25,12),new THREE.MeshStandardMaterial({color:0x263541}));w.rotation.z=Math.PI/2;w.position.set(x,y,z);parent.add(w);return w;}
 function person(parent=scene,color=0x079d8b){
  const g=group(parent);box(.65,.83,.4,0,1.35,0,color,g);box(.43,.43,.43,0,2.03,0,0xe5b17e,g);box(.5,.11,.5,0,2.27,0,0xffcf52,g);
  const arms=[-.45,.45].map(x=>{const a=group(g);a.position.set(x,1.65,0);box(.18,.7,.2,0,-.28,0,color,a);box(.2,.17,.21,0,-.66,0,0xe5b17e,a);return a;});
  const legs=[-.19,.19].map(x=>{const l=group(g);l.position.set(x,.96,0);box(.23,.75,.25,0,-.37,0,0x304b66,l);box(.27,.16,.4,0,-.76,.08,0x243442,l);return l;});
  return {g,arms,legs};
 }
 // Each forklift stays within its own clear aisle, with space to turn at its ends.
 [-11,3,10].forEach((x,i)=>{
  const g=group();box(1.45,.75,2.05,0,.8,-.2,0xe6a12d,g);box(1.25,.5,.7,0,1.3,-.75,0xf5b63c,g);box(.65,.5,.6,0,1.5,-.25,0x263c4b,g);
  for(const dx of [-.6,.6])for(const z of [-.8,.55])box(.09,1.9,.09,dx,2.05,z,0x304451,g);
  box(1.45,.13,1.7,0,3.04,-.15,0x344e5c,g);
  for(const dx of [-.56,.56])box(.14,2.7,.16,dx,1.45,1,0x344b59,g);
  const carriage=group(g);box(1.3,.18,.18,0,.45,1.13,0x576977,carriage);for(const dx of [-.46,.46])box(.13,.12,1.3,dx,.25,1.7,0x6f8490,carriage);
  box(1.15,.15,1.12,0,.43,1.65,0xb69a73,carriage);box(1,.8,.95,0,.92,1.65,0xceaa7a,carriage);
  const driver=person(g,0xeab934);driver.g.scale.setScalar(.65);driver.g.position.set(0,.75,-.25);driver.arms.forEach(a=>a.rotation.x=-.8);
  const wheels=[];for(const dx of [-.78,.78])for(const z of [-.8,.6])wheels.push(wheel(g,dx,.45,z));
  forklifts.push({g,x,offset:i*7,carriage,wheels});
 });
 // Packers reach for the box, close it and move it along their workstation.
 for(let i=0;i<3;i++){
  const p=person(scene,i%2?0x4776a2:0x079d8b);p.g.position.set(20.1,0,4.5+i*3);p.g.rotation.y=-Math.PI/2;
  const parcel=box(.8,.65,.95,18,2.3,4.5+i*3,0xcba675);
  workers.push({p,parcel,type:'packing',offset:i*1.8,z:4.5+i*3});
 }
 for(let i=0;i<4;i++){
  const x=-15+i*9,g=group();g.position.set(x,0,21);
  // The trailer rear is open so loading and cargo remain visible.
  box(3.4,.25,6.5,0,1,0,0x8fa5b3,g);box(3.4,.16,6.5,0,4.05,0,0xeaf0f3,g);
  for(const dx of [-1.65,1.65])box(.14,2.95,6.5,dx,2.55,0,0xf0f4f7,g);
  box(3.3,2.9,.12,0,2.55,3.2,0xe3ebef,g);box(3.2,2.7,2.2,0,1.8,4.4,i%2?0x157e7b:0x3c5d80,g);box(2.6,1,.08,0,2.3,5.55,0x294351,g);
  for(const dx of [-1.3,1.3]){box(.4,.25,.08,dx,1.2,5.6,0xfff0bc,g);box(.22,.18,.1,dx,1.2,-3.3,0xe36d49,g);}
  const wheels=[];for(const dz of [-1.7,2.3,4.8])for(const dx of [-1.7,1.7])wheels.push(wheel(g,dx,.6,dz,.57));
  const cargo=[];for(let j=0;j<6;j++)cargo.push(box(1.15,.9,1.2,j%2?-.7:.7,1.6,2.1-Math.floor(j/2)*1.5,0xcaa571,g));
  const loader=person(scene,0xe6a12d),parcel=box(.65,.6,.7,0,0,0,0xd2ae7b,loader.g);parcel.position.set(0,1.3,.5);
  const staging=group();staging.position.set(x+2.6,0,14);for(let j=0;j<3;j++)box(.8,.65,.85,0,.45+j*.65,0,0xcba675,staging);
  trucks.push({g,x,offset:i*8,cargo,wheels,loader,parcel,staging});
 }
 function update(seconds){
  forklifts.forEach(f=>{const s=forkliftState(seconds,f.offset);f.g.position.set(f.x,0,s.z);f.g.rotation.y=s.angle;f.carriage.position.y=s.lift;f.wheels.forEach(w=>w.rotation.x=s.drive*3);});
  workers.forEach(w=>{const t=(seconds+w.offset)%4,u=t/4;w.p.arms.forEach((a,i)=>a.rotation.x=-.8-Math.sin(u*Math.PI*2+i*.4)*.45);w.parcel.position.set(18,2.3+Math.max(0,Math.sin(u*Math.PI*2))*.3,w.z+Math.sin(u*Math.PI*2)*.5);w.p.g.rotation.z=Math.sin(u*Math.PI*2)*.035;});
  trucks.forEach(t=>{const s=truckState(seconds,t.offset);t.g.visible=s.phase!=='away';t.g.position.z=s.z;t.cargo.forEach((c,i)=>c.visible=s.load>(i+1)/7);t.wheels.forEach(w=>w.rotation.x=s.phase==='loading'?0:s.z*2);
   const working=s.phase==='loading',u=((seconds+t.offset)%3)/3,progress=u<.5?u*2:2-u*2;
   t.loader.g.position.set(t.x+(working?2.5*(1-progress):2.6),0,working?14.2+3.1*progress:13.8);
   t.loader.g.rotation.y=working?(u<.5?-.4:Math.PI-.4):0;
   t.loader.legs.forEach((l,i)=>l.rotation.x=working?Math.sin(u*Math.PI*4+i*Math.PI)*.55:0);
   t.loader.arms.forEach(a=>a.rotation.x=working&&u<.5?-1.15:-.2);
   t.parcel.visible=working&&u<.5;t.staging.visible=s.load<.95;
  });
 }
 update(0);return {update};
}
