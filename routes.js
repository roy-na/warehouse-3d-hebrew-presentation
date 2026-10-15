export const depot=[-18,12];
export const picks=[[-11,-7],[-4,5],[3,-5],[10,6]];
export function connection(a,b){if(a[0]===b[0])return [a,b];const z=Math.abs(a[1]-12)+Math.abs(b[1]-12)<=Math.abs(a[1]+12)+Math.abs(b[1]+12)?12:-12;return [a,[a[0],z],[b[0],z],b];}
export function route(order){const stops=[depot,...order.map(i=>picks[i]),depot];return stops.slice(1).flatMap((p,i)=>connection(stops[i],p).slice(i?1:0));}
export function length(points){return points.slice(1).reduce((n,p,i)=>n+Math.abs(p[0]-points[i][0])+Math.abs(p[1]-points[i][1]),0);}
function permutations(a){return a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>i!==j)).map(p=>[v,...p])):[[]];}
export const before=route([2,0,3,1]);
export const after=permutations([0,1,2,3]).map(route).sort((a,b)=>length(a)-length(b))[0];
