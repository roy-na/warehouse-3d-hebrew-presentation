export function truckState(seconds,offset=0){
 const t=((seconds+offset)%40+40)%40;
 if(t<10)return {phase:'arrival',z:43-22*t/10,load:0};
 if(t<24)return {phase:'loading',z:21,load:(t-10)/14};
 if(t<33)return {phase:'departure',z:21+22*(t-24)/9,load:1};
 return {phase:'away',z:43,load:0};
}

export function forkliftState(seconds,offset=0){
 const t=((seconds+offset)%24+24)%24;
 if(t<9)return {z:10-20*t/9,angle:Math.PI,lift:.2,drive:t};
 if(t<12)return {z:-10,angle:Math.PI+Math.PI*Math.max(0,Math.min(1,(t-10)/2)),lift:.2+Math.sin((t-9)/3*Math.PI)*1.5,drive:9};
 if(t<21)return {z:-10+20*(t-12)/9,angle:0,lift:.2,drive:t-3};
 return {z:10,angle:Math.PI*Math.max(0,Math.min(1,(t-22)/2)),lift:.2+Math.sin((t-21)/3*Math.PI)*.8,drive:18};
}

