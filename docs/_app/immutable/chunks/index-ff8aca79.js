function g(){}const mt=t=>t;function pt(t,e){for(const n in e)t[n]=e[n];return t}function tt(t){return t()}function Q(){return Object.create(null)}function E(t){t.forEach(tt)}function L(t){return typeof t=="function"}function Kt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let S;function Qt(t,e){return S||(S=document.createElement("a")),S.href=e,t===S.href}function yt(t){return Object.keys(t).length===0}function gt(t,...e){if(t==null)return g;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Ut(t,e,n){t.$$.on_destroy.push(gt(e,n))}function Vt(t,e,n,i){if(t){const s=et(t,e,n,i);return t[0](s)}}function et(t,e,n,i){return t[1]&&i?pt(n.ctx.slice(),t[1](i(e))):n.ctx}function Xt(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const l=[],r=Math.max(e.dirty.length,s.length);for(let o=0;o<r;o+=1)l[o]=e.dirty[o]|s[o];return l}return e.dirty|s}return e.dirty}function Yt(t,e,n,i,s,l){if(s){const r=et(e,n,i,l);t.p(r,s)}}function Zt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function te(t){return t??""}function ee(t,e,n){return t.set(n),e}function ne(t){return t&&L(t.destroy)?t.destroy:g}const nt=typeof window<"u";let xt=nt?()=>window.performance.now():()=>Date.now(),J=nt?t=>requestAnimationFrame(t):g;const w=new Set;function it(t){w.forEach(e=>{e.c(t)||(w.delete(e),e.f())}),w.size!==0&&J(it)}function $t(t){let e;return w.size===0&&J(it),{promise:new Promise(n=>{w.add(e={c:t,f:n})}),abort(){w.delete(e)}}}let P=!1;function bt(){P=!0}function wt(){P=!1}function vt(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function Et(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<e.length;u++){const _=e[u];_.claim_order!==void 0&&c.push(_)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let c=0;c<e.length;c++){const u=e[c].claim_order,_=(s>0&&e[n[s]].claim_order<=u?s+1:vt(1,s,h=>e[n[h]].claim_order,u))-1;i[c]=n[_]+1;const a=_+1;n[a]=c,s=Math.max(a,s)}const l=[],r=[];let o=e.length-1;for(let c=n[s]+1;c!=0;c=i[c-1]){for(l.push(e[c-1]);o>=c;o--)r.push(e[o]);o--}for(;o>=0;o--)r.push(e[o]);l.reverse(),r.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<r.length;c++){for(;u<l.length&&r[c].claim_order>=l[u].claim_order;)u++;const _=u<l.length?l[u]:null;t.insertBefore(r[c],_)}}function st(t,e){t.appendChild(e)}function rt(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function Nt(t){const e=R("style");return At(rt(t),e),e.sheet}function At(t,e){return st(t.head||t,e),e.sheet}function Tt(t,e){if(P){for(Et(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function kt(t,e,n){t.insertBefore(e,n||null)}function Ct(t,e,n){P&&!n?Tt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function v(t){t.parentNode&&t.parentNode.removeChild(t)}function ie(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function R(t){return document.createElement(t)}function ot(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function K(t){return document.createTextNode(t)}function se(){return K(" ")}function re(){return K("")}function U(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function ct(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function oe(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set?t[i]=e[i]:ct(t,i,e[i])}function ce(t,e){Object.keys(e).forEach(n=>{St(t,n,e[n])})}function St(t,e,n){e in t?t[e]=typeof t[e]=="boolean"&&n===""?!0:n:ct(t,e,n)}function le(t){return t===""?null:+t}function Mt(t){return Array.from(t.childNodes)}function lt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function ut(t,e,n,i,s=!1){lt(t);const l=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const o=t[r];if(e(o)){const c=n(o);return c===void 0?t.splice(r,1):t[r]=c,s||(t.claim_info.last_index=r),o}}for(let r=t.claim_info.last_index-1;r>=0;r--){const o=t[r];if(e(o)){const c=n(o);return c===void 0?t.splice(r,1):t[r]=c,s?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,o}}return i()})();return l.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,l}function at(t,e,n,i){return ut(t,s=>s.nodeName===e,s=>{const l=[];for(let r=0;r<s.attributes.length;r++){const o=s.attributes[r];n[o.name]||l.push(o.name)}l.forEach(r=>s.removeAttribute(r))},()=>i(e))}function ue(t,e,n){return at(t,e,n,R)}function ae(t,e,n){return at(t,e,n,ot)}function jt(t,e){return ut(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>K(e),!0)}function fe(t){return jt(t," ")}function V(t,e,n){for(let i=n;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===e)return i}return t.length}function _e(t,e){const n=V(t,"HTML_TAG_START",0),i=V(t,"HTML_TAG_END",n);if(n===i)return new X(void 0,e);lt(t);const s=t.splice(n,i-n+1);v(s[0]),v(s[s.length-1]);const l=s.slice(1,s.length-1);for(const r of l)r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new X(l,e)}function de(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function he(t,e){t.value=e??""}function me(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}let M;function Dt(){if(M===void 0){M=!1;try{typeof window<"u"&&window.parent&&window.parent.document}catch{M=!0}}return M}function pe(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=R("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const s=Dt();let l;return s?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",l=U(window,"message",r=>{r.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{l=U(i.contentWindow,"resize",e)}),st(t,i),()=>{(s||l&&i.contentWindow)&&l(),v(i)}}function ye(t,e,n){t.classList[n?"add":"remove"](e)}function Ht(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,n,i,e),s}function ge(t,e){const n=[];let i=0;for(const s of e.childNodes)if(s.nodeType===8){const l=s.textContent.trim();l===`HEAD_${t}_END`?(i-=1,n.push(s)):l===`HEAD_${t}_START`&&(i+=1,n.push(s))}else i>0&&n.push(s);return n}class Ot{constructor(e=!1){this.is_svg=!1,this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=ot(n.nodeName):this.e=R(n.nodeName),this.t=n,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)kt(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(v)}}class X extends Ot{constructor(e,n=!1){super(n),this.e=this.n=null,this.l=e}c(e){this.l?this.n=this.l:super.c(e)}i(e){for(let n=0;n<this.n.length;n+=1)Ct(this.t,this.n[n],e)}}function xe(t,e){return new t(e)}const H=new Map;let O=0;function zt(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function Lt(t,e){const n={stylesheet:Nt(e),rules:{}};return H.set(t,n),n}function Y(t,e,n,i,s,l,r,o=0){const c=16.666/i;let u=`{
`;for(let y=0;y<=1;y+=c){const x=e+(n-e)*l(y);u+=y*100+`%{${r(x,1-x)}}
`}const _=u+`100% {${r(n,1-n)}}
}`,a=`__svelte_${zt(_)}_${o}`,h=rt(t),{stylesheet:f,rules:d}=H.get(h)||Lt(h,t);d[a]||(d[a]=!0,f.insertRule(`@keyframes ${a} ${_}`,f.cssRules.length));const m=t.style.animation||"";return t.style.animation=`${m?`${m}, `:""}${a} ${i}ms linear ${s}ms 1 both`,O+=1,a}function Pt(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?l=>l.indexOf(e)<0:l=>l.indexOf("__svelte")===-1),s=n.length-i.length;s&&(t.style.animation=i.join(", "),O-=s,O||Rt())}function Rt(){J(()=>{O||(H.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&v(e)}),H.clear())})}let T;function A(t){T=t}function k(){if(!T)throw new Error("Function called outside component initialization");return T}function $e(t){k().$$.on_mount.push(t)}function be(t){k().$$.after_update.push(t)}function we(t){k().$$.on_destroy.push(t)}function ve(t,e){return k().$$.context.set(t,e),e}function Ee(t){return k().$$.context.get(t)}const b=[],Z=[],j=[],G=[],ft=Promise.resolve();let I=!1;function _t(){I||(I=!0,ft.then(dt))}function Ne(){return _t(),ft}function z(t){j.push(t)}function Ae(t){G.push(t)}const W=new Set;let $=0;function dt(){if($!==0)return;const t=T;do{try{for(;$<b.length;){const e=b[$];$++,A(e),qt(e.$$)}}catch(e){throw b.length=0,$=0,e}for(A(null),b.length=0,$=0;Z.length;)Z.pop()();for(let e=0;e<j.length;e+=1){const n=j[e];W.has(n)||(W.add(n),n())}j.length=0}while(b.length);for(;G.length;)G.pop()();I=!1,W.clear(),A(t)}function qt(t){if(t.fragment!==null){t.update(),E(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(z)}}let N;function Bt(){return N||(N=Promise.resolve(),N.then(()=>{N=null})),N}function F(t,e,n){t.dispatchEvent(Ht(`${e?"intro":"outro"}${n}`))}const D=new Set;let p;function Te(){p={r:0,c:[],p}}function ke(){p.r||E(p.c),p=p.p}function Wt(t,e){t&&t.i&&(D.delete(t),t.i(e))}function Ce(t,e,n,i){if(t&&t.o){if(D.has(t))return;D.add(t),p.c.push(()=>{D.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const Ft={duration:0};function Se(t,e,n,i){const s={direction:"both"};let l=e(t,n,s),r=i?0:1,o=null,c=null,u=null;function _(){u&&Pt(t,u)}function a(f,d){const m=f.b-r;return d*=Math.abs(m),{a:r,b:f.b,d:m,duration:d,start:f.start,end:f.start+d,group:f.group}}function h(f){const{delay:d=0,duration:m=300,easing:y=mt,tick:x=g,css:q}=l||Ft,B={start:xt()+d,b:f};f||(B.group=p,p.r+=1),o||c?c=B:(q&&(_(),u=Y(t,r,f,m,d,y,q)),f&&x(0,1),o=a(B,m),z(()=>F(t,f,"start")),$t(C=>{if(c&&C>c.start&&(o=a(c,m),c=null,F(t,o.b,"start"),q&&(_(),u=Y(t,r,o.b,o.duration,0,y,l.css))),o){if(C>=o.end)x(r=o.b,1-r),F(t,o.b,"end"),c||(o.b?_():--o.group.r||E(o.group.c)),o=null;else if(C>=o.start){const ht=C-o.start;r=o.a+o.d*y(ht/o.duration),x(r,1-r)}}return!!(o||c)}))}return{run(f){L(l)?Bt().then(()=>{l=l(s),h(f)}):h(f)},end(){_(),o=c=null}}}function Me(t,e){const n={},i={},s={$$scope:1};let l=t.length;for(;l--;){const r=t[l],o=e[l];if(o){for(const c in r)c in o||(i[c]=1);for(const c in o)s[c]||(n[c]=o[c],s[c]=1);t[l]=o}else for(const c in r)s[c]=1}for(const r in i)r in n||(n[r]=void 0);return n}function je(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function De(t){t&&t.c()}function He(t,e){t&&t.l(e)}function Gt(t,e,n,i){const{fragment:s,after_update:l}=t.$$;s&&s.m(e,n),i||z(()=>{const r=t.$$.on_mount.map(tt).filter(L);t.$$.on_destroy?t.$$.on_destroy.push(...r):E(r),t.$$.on_mount=[]}),l.forEach(z)}function It(t,e){const n=t.$$;n.fragment!==null&&(E(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Jt(t,e){t.$$.dirty[0]===-1&&(b.push(t),_t(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Oe(t,e,n,i,s,l,r,o=[-1]){const c=T;A(t);const u=t.$$={fragment:null,ctx:[],props:l,update:g,not_equal:s,bound:Q(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:Q(),dirty:o,skip_bound:!1,root:e.target||c.$$.root};r&&r(u.root);let _=!1;if(u.ctx=n?n(t,e.props||{},(a,h,...f)=>{const d=f.length?f[0]:h;return u.ctx&&s(u.ctx[a],u.ctx[a]=d)&&(!u.skip_bound&&u.bound[a]&&u.bound[a](d),_&&Jt(t,a)),h}):[],u.update(),_=!0,E(u.before_update),u.fragment=i?i(u.ctx):!1,e.target){if(e.hydrate){bt();const a=Mt(e.target);u.fragment&&u.fragment.l(a),a.forEach(v)}else u.fragment&&u.fragment.c();e.intro&&Wt(t.$$.fragment),Gt(t,e.target,e.anchor,e.customElement),wt(),dt()}A(c)}class ze{$destroy(){It(this,1),this.$destroy=g}$on(e,n){if(!L(n))return g;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!yt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{ot as $,It as A,Ne as B,g as C,Tt as D,Vt as E,Yt as F,Zt as G,Xt as H,Ut as I,ge as J,ie as K,Qt as L,U as M,E as N,Ee as O,ee as P,ye as Q,z as R,ze as S,pe as T,J as U,L as V,ve as W,pt as X,xt as Y,$t as Z,mt as _,se as a,ae as a0,we as a1,je as a2,Ae as a3,te as a4,Se as a5,ce as a6,oe as a7,Me as a8,X as a9,_e as aa,ne as ab,he as ac,le as ad,Ct as b,fe as c,ke as d,re as e,Wt as f,Te as g,v as h,Oe as i,be as j,R as k,ue as l,Mt as m,ct as n,$e as o,me as p,K as q,jt as r,Kt as s,Ce as t,de as u,Z as v,xe as w,De as x,He as y,Gt as z};
