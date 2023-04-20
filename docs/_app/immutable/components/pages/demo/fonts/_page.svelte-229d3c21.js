import{S as te,i as se,s as le,k as b,a as x,q as I,J as ve,l as k,h as y,c as A,m as S,r as M,n as E,p as Y,D as i,b as O,ad as ge,Q as Z,u as Q,ae as Ee,C as ee,R as ce,o as be,a5 as X,f as U,g as ue,d as de,t as G,K as pe,a6 as ke,x as he,y as me,z as ye,A as _e}from"../../../../chunks/index-43a8497b.js";import{I as ze,d as Ce}from"../../../../chunks/transform-f56d011b.js";import{b as Se}from"../../../../chunks/paths-7a13a862.js";function Te(s){return s}function we(s,...e){return De(s,Array.from,Te,e)}function De(s,e,n,t){return function f(r,_){if(_>=t.length)return n(r);const h=new ze,v=t[_++];let l=-1;for(const c of r){const o=v(c,++l,r),a=h.get(o);a?a.push(c):h.set(o,[c])}for(const[c,o]of h)h.set(c,f(o,_));return e(h)}(s,0)}const Le=async s=>{if("clipboard"in navigator)await navigator.clipboard.writeText(s);else{const e=document.createElement("input");e.type="text",e.disabled=!0,e.style.setProperty("position","fixed"),e.style.setProperty("z-index","-100"),e.style.setProperty("pointer-events","none"),e.style.setProperty("opacity","0"),e.value=s,document.body.appendChild(e),e.click(),e.select(),document.execCommand("copy"),document.body.removeChild(e)}},Pe=(s,e)=>{async function n(){if(f)try{await Le(f),s.dispatchEvent(new CustomEvent("svelte-copy",{detail:f}))}catch(r){s.dispatchEvent(new CustomEvent("svelte-copy:error",{detail:r}))}}let t=typeof e=="string"?["click"]:[e.events].flat(1),f=typeof e=="string"?e:e.text;return t.forEach(r=>{s.addEventListener(r,n,!0)}),{update:r=>{const _=typeof r=="string"?["click"]:[r.events].flat(1),h=typeof r=="string"?r:r.text,v=_.filter(c=>!t.includes(c)),l=t.filter(c=>!_.includes(c));v.forEach(c=>{s.addEventListener(c,n,!0)}),l.forEach(c=>{s.removeEventListener(c,n,!0)}),t=_,f=h},destroy:()=>{t.forEach(r=>{s.removeEventListener(r,n,!0)})}}};function xe(s){let e,n,t,f,r,_,h,v,l,c,o,a,p,T,w,j,L,B,q,D,F,P,R,K;return{c(){e=b("link"),n=x(),t=b("div"),f=b("h3"),r=I(s[0]),_=x(),h=b("p"),v=I(s[1]),l=x(),c=b("details"),o=b("summary"),a=I("CSS Snippet"),p=x(),T=b("code"),w=I(s[2]),j=x(),L=b("p"),B=b("button"),q=I("Copy CSS to Clipboard"),F=b("span"),P=I(s[3]),this.h()},l(C){const z=ve("svelte-1uevrx3",document.head);e=k(z,"LINK",{rel:!0,href:!0}),z.forEach(y),n=A(C),t=k(C,"DIV",{style:!0,class:!0});var d=S(t);f=k(d,"H3",{class:!0});var W=S(f);r=M(W,s[0]),W.forEach(y),_=A(d),h=k(d,"P",{});var u=S(h);v=M(u,s[1]),u.forEach(y),l=A(d),c=k(d,"DETAILS",{class:!0});var m=S(c);o=k(m,"SUMMARY",{class:!0});var g=S(o);a=M(g,"CSS Snippet"),g.forEach(y),p=A(m),T=k(m,"CODE",{class:!0});var H=S(T);w=M(H,s[2]),H.forEach(y),m.forEach(y),j=A(d),L=k(d,"P",{});var V=S(L);B=k(V,"BUTTON",{class:!0});var N=S(B);q=M(N,"Copy CSS to Clipboard"),N.forEach(y),F=k(V,"SPAN",{class:!0});var J=S(F);P=M(J,s[3]),J.forEach(y),V.forEach(y),d.forEach(y),this.h()},h(){E(e,"rel","external stylesheet"),E(e,"href",s[5]),E(f,"class","svelte-19ry7n"),Y(h,"font-size",s[4]),E(o,"class","svelte-19ry7n"),E(T,"class","svelte-19ry7n"),E(c,"class","svelte-19ry7n"),E(B,"class","svelte-19ry7n"),E(F,"class","svelte-19ry7n"),Y(t,"font-family","'"+s[0]+"'"),E(t,"class","svelte-19ry7n")},m(C,z){i(document.head,e),O(C,n,z),O(C,t,z),i(t,f),i(f,r),i(t,_),i(t,h),i(h,v),i(t,l),i(t,c),i(c,o),i(o,a),i(c,p),i(c,T),i(T,w),i(t,j),i(t,L),i(L,B),i(B,q),i(L,F),i(F,P),R||(K=[ge(D=Pe.call(null,B,s[2])),Z(B,"svelte-copy",s[6])],R=!0)},p(C,[z]){z&1&&Q(r,C[0]),z&2&&Q(v,C[1]),z&16&&Y(h,"font-size",C[4]),z&4&&Q(w,C[2]),D&&Ee(D.update)&&z&4&&D.update.call(null,C[2]),z&8&&Q(P,C[3]),z&1&&Y(t,"font-family","'"+C[0]+"'")},i:ee,o:ee,d(C){y(e),C&&y(n),C&&y(t),R=!1,ce(K)}}}function Ie(s,e,n){let t,{id:f=""}=e,{family:r=""}=e,{size:_=16}=e,{text:h}=e,v="",l="";const c=`${Se}/assets/demo/fonts/${f}.css`,o=()=>{n(3,l="Copied!"),setTimeout(()=>{n(3,l="")},1e3)};return be(async()=>{const a=await fetch(c);n(2,v=await a.text())}),s.$$set=a=>{"id"in a&&n(7,f=a.id),"family"in a&&n(0,r=a.family),"size"in a&&n(8,_=a.size),"text"in a&&n(1,h=a.text)},s.$$.update=()=>{s.$$.dirty&256&&n(4,t=`${_}px`)},[r,h,v,l,t,c,o,f,_]}class Ae extends te{constructor(e){super(),se(this,e,Ie,xe,le,{id:7,family:0,size:8,text:1})}}const Me=[{id:"atkinson",family:"Atkinson",type:"sans-serif"},{id:"atlas",family:"Atlas Grotesk",type:"sans-serif"},{id:"baloo-bhai",family:"Baloo Bhai",type:"sans-serif"},{id:"canela",family:"Canela",type:"serif"},{id:"computer-modern",family:"Computer Modern",type:"serif"},{id:"cozette",family:"Cozette",type:"other"},{id:"inter",family:"Inter",type:"sans-serif"},{id:"jamboree",family:"Jamboree",type:"other"},{id:"jersey",family:"Jersey M54",type:"other"},{id:"lyon",family:"Lyon Display",type:"serif"},{id:"metropolis",family:"Metropolis",type:"sans-serif"},{id:"national",family:"National 2 Web",type:"sans-serif"},{id:"publico",family:"Publico Text",type:"serif"},{id:"recoleta",family:"Recoleta",type:"serif"},{id:"rubik",family:"Rubik",type:"sans-serif"},{id:"spacemono",family:"Space Mono",type:"mono"},{id:"tiempos",family:"Tiempos Text",type:"serif"}];function re(s,e,n){const t=s.slice();return t[5]=e[n][0],t[6]=e[n][1],t}function ae(s,e,n){const t=s.slice();return t[9]=e[n].family,t[10]=e[n].id,t}function ie(s){let e,n;return e=new Ae({props:{id:s[10],family:s[9],size:s[0],text:s[1]}}),{c(){he(e.$$.fragment)},l(t){me(e.$$.fragment,t)},m(t,f){ye(e,t,f),n=!0},p(t,f){const r={};f&1&&(r.size=t[0]),f&2&&(r.text=t[1]),e.$set(r)},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){G(e.$$.fragment,t),n=!1},d(t){_e(e,t)}}}function fe(s){let e,n=s[5]+"",t,f,r,_,h,v=s[6],l=[];for(let o=0;o<v.length;o+=1)l[o]=ie(ae(s,v,o));const c=o=>G(l[o],1,1,()=>{l[o]=null});return{c(){e=b("h2"),t=I(n),f=x(),r=b("section");for(let o=0;o<l.length;o+=1)l[o].c();_=x(),this.h()},l(o){e=k(o,"H2",{});var a=S(e);t=M(a,n),a.forEach(y),f=A(o),r=k(o,"SECTION",{class:!0});var p=S(r);for(let T=0;T<l.length;T+=1)l[T].l(p);_=A(p),p.forEach(y),this.h()},h(){E(r,"class","svelte-1lzc8ku")},m(o,a){O(o,e,a),i(e,t),O(o,f,a),O(o,r,a);for(let p=0;p<l.length;p+=1)l[p].m(r,null);i(r,_),h=!0},p(o,a){if(a&7){v=o[6];let p;for(p=0;p<v.length;p+=1){const T=ae(o,v,p);l[p]?(l[p].p(T,a),U(l[p],1)):(l[p]=ie(T),l[p].c(),U(l[p],1),l[p].m(r,_))}for(ue(),p=v.length;p<l.length;p+=1)c(p);de()}},i(o){if(!h){for(let a=0;a<v.length;a+=1)U(l[a]);h=!0}},o(o){l=l.filter(Boolean);for(let a=0;a<l.length;a+=1)G(l[a]);h=!1},d(o){o&&y(e),o&&y(f),o&&y(r),pe(l,o)}}}function Be(s){let e,n,t,f,r,_,h,v,l,c,o,a,p,T,w,j,L,B,q,D,F,P,R,K,C,z=s[2],d=[];for(let u=0;u<z.length;u+=1)d[u]=fe(re(s,z,u));const W=u=>G(d[u],1,1,()=>{d[u]=null});return{c(){e=b("div"),n=b("h1"),t=I("Hosted Fonts on The Pudding"),f=x(),r=b("p"),_=b("em"),h=I("Do not use fonts hosted by The Pudding without written permission."),v=x(),l=b("form"),c=b("label"),o=I("font-size: "),a=I(s[0]),p=I("px"),T=x(),w=b("input"),j=x(),L=b("label"),B=I("text sample"),q=x(),D=b("input"),F=x(),P=b("article");for(let u=0;u<d.length;u+=1)d[u].c();this.h()},l(u){e=k(u,"DIV",{id:!0,class:!0});var m=S(e);n=k(m,"H1",{});var g=S(n);t=M(g,"Hosted Fonts on The Pudding"),g.forEach(y),f=A(m),r=k(m,"P",{});var H=S(r);_=k(H,"EM",{});var V=S(_);h=M(V,"Do not use fonts hosted by The Pudding without written permission."),V.forEach(y),H.forEach(y),v=A(m),l=k(m,"FORM",{});var N=S(l);c=k(N,"LABEL",{for:!0,class:!0});var J=S(c);o=M(J,"font-size: "),a=M(J,s[0]),p=M(J,"px"),J.forEach(y),T=A(N),w=k(N,"INPUT",{id:!0,type:!0,min:!0,max:!0}),j=A(N),L=k(N,"LABEL",{for:!0,class:!0});var ne=S(L);B=M(ne,"text sample"),ne.forEach(y),q=A(N),D=k(N,"INPUT",{id:!0,type:!0,maxlength:!0}),N.forEach(y),m.forEach(y),F=A(u),P=k(u,"ARTICLE",{class:!0});var oe=S(P);for(let $=0;$<d.length;$+=1)d[$].l(oe);oe.forEach(y),this.h()},h(){E(c,"for","size"),E(c,"class","svelte-1lzc8ku"),E(w,"id","size"),E(w,"type","range"),E(w,"min","12"),E(w,"max","48"),E(L,"for","text"),E(L,"class","svelte-1lzc8ku"),E(D,"id","text"),E(D,"type","text"),E(D,"maxlength","100"),E(e,"id","info"),E(e,"class","svelte-1lzc8ku"),E(P,"class","svelte-1lzc8ku")},m(u,m){O(u,e,m),i(e,n),i(n,t),i(e,f),i(e,r),i(r,_),i(_,h),i(e,v),i(e,l),i(l,c),i(c,o),i(c,a),i(c,p),i(l,T),i(l,w),X(w,s[0]),i(l,j),i(l,L),i(L,B),i(l,q),i(l,D),X(D,s[1]),O(u,F,m),O(u,P,m);for(let g=0;g<d.length;g+=1)d[g].m(P,null);R=!0,K||(C=[Z(w,"change",s[3]),Z(w,"input",s[3]),Z(D,"input",s[4])],K=!0)},p(u,[m]){if((!R||m&1)&&Q(a,u[0]),m&1&&X(w,u[0]),m&2&&D.value!==u[1]&&X(D,u[1]),m&7){z=u[2];let g;for(g=0;g<z.length;g+=1){const H=re(u,z,g);d[g]?(d[g].p(H,m),U(d[g],1)):(d[g]=fe(H),d[g].c(),U(d[g],1),d[g].m(P,null))}for(ue(),g=z.length;g<d.length;g+=1)W(g);de()}},i(u){if(!R){for(let m=0;m<z.length;m+=1)U(d[m]);R=!0}},o(u){d=d.filter(Boolean);for(let m=0;m<d.length;m+=1)G(d[m]);R=!1},d(u){u&&y(e),u&&y(F),u&&y(P),pe(d,u),K=!1,ce(C)}}}function Fe(s,e,n){let t=18,f="The quick brown fox jumps over the lazy dog.";const r=we(Me,v=>v.type);r.sort((v,l)=>Ce(v[1].length,l[1].length));function _(){t=ke(this.value),n(0,t)}function h(){f=this.value,n(1,f)}return[t,f,r,_,h]}class Ne extends te{constructor(e){super(),se(this,e,Fe,Be,le,{})}}function Re(s){let e,n;return e=new Ne({}),{c(){he(e.$$.fragment)},l(t){me(e.$$.fragment,t)},m(t,f){ye(e,t,f),n=!0},p:ee,i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){G(e.$$.fragment,t),n=!1},d(t){_e(e,t)}}}class je extends te{constructor(e){super(),se(this,e,null,Re,le,{})}}export{je as default};
