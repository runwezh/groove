import{B as b,s as y,C as m,D as q,E as w}from"./index-e2074c99.js";const o=[];function z(n,i){return{subscribe:A(n,i).subscribe}}function A(n,i=b){let u;const t=new Set;function f(e){if(y(n,e)&&(n=e,u)){const r=!o.length;for(const s of t)s[1](),o.push(s,n);if(r){for(let s=0;s<o.length;s+=2)o[s][0](o[s+1]);o.length=0}}}function l(e){f(e(n))}function a(e,r=b){const s=[e,r];return t.add(s),t.size===1&&(u=i(f)||b),e(n),()=>{t.delete(s),t.size===0&&(u(),u=null)}}return{set:f,update:l,subscribe:a}}function B(n,i,u){const t=!Array.isArray(n),f=t?[n]:n,l=i.length<2;return z(u,a=>{let e=!1;const r=[];let s=0,d=b;const g=()=>{if(s)return;d();const c=i(t?r[0]:r,a);l?a(c):d=w(c)?c:b},_=f.map((c,p)=>m(c,h=>{r[p]=h,s&=~(1<<p),e&&g()},()=>{s|=1<<p}));return e=!0,g(),function(){q(_),d()}})}export{B as d,A as w};
