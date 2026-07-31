(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,33525,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"warnOnce",{enumerable:!0,get:function(){return a}});let a=e=>{}},18967,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={DecodeError:function(){return h},MiddlewareNotFoundError:function(){return w},MissingStaticPage:function(){return x},NormalizeError:function(){return b},PageNotFoundError:function(){return v},SP:function(){return g},ST:function(){return y},WEB_VITALS:function(){return i},execOnce:function(){return s},getDisplayName:function(){return d},getLocationOrigin:function(){return u},getURL:function(){return c},isAbsoluteUrl:function(){return l},isResSent:function(){return f},loadGetInitialProps:function(){return m},normalizeRepeatedSlashes:function(){return p},stringifyError:function(){return E}};for(var o in a)Object.defineProperty(r,o,{enumerable:!0,get:a[o]});let i=["CLS","FCP","FID","INP","LCP","TTFB"];function s(e){let t,r=!1;return(...a)=>(r||(r=!0,t=e(...a)),t)}let n=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=e=>n.test(e);function u(){let{protocol:e,hostname:t,port:r}=window.location;return`${e}//${t}${r?":"+r:""}`}function c(){let{href:e}=window.location,t=u();return e.substring(t.length)}function d(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function f(e){return e.finished||e.headersSent}function p(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function m(e,t){let r=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await m(t.Component,t.ctx)}:{};let a=await e.getInitialProps(t);if(r&&f(r))return a;if(!a)throw Object.defineProperty(Error(`"${d(e)}.getInitialProps()" should resolve to an object. But found "${a}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return a}let g="u">typeof performance,y=g&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class h extends Error{}class b extends Error{}class v extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class x extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class w extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function E(e){return JSON.stringify({message:e.message,stack:e.stack})}},98183,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={assign:function(){return l},searchParamsToUrlQuery:function(){return i},urlQueryToSearchParams:function(){return n}};for(var o in a)Object.defineProperty(r,o,{enumerable:!0,get:a[o]});function i(e){let t={};for(let[r,a]of e.entries()){let e=t[r];void 0===e?t[r]=a:Array.isArray(e)?e.push(a):t[r]=[e,a]}return t}function s(e){return"string"==typeof e?e:("number"!=typeof e||isNaN(e))&&"boolean"!=typeof e?"":String(e)}function n(e){let t=new URLSearchParams;for(let[r,a]of Object.entries(e))if(Array.isArray(a))for(let e of a)t.append(r,s(e));else t.set(r,s(a));return t}function l(e,...t){for(let r of t){for(let t of r.keys())e.delete(t);for(let[t,a]of r.entries())e.append(t,a)}return e}},83494,e=>{"use strict";var t=e.i(43476),r=e.i(71645);let a=(0,r.createContext)(null);e.s(["AuthProvider",0,({children:e})=>{let[o,i]=(0,r.useState)(null),[s,n]=(0,r.useState)(!0);(0,r.useEffect)(()=>{let e=localStorage.getItem("blink_user");e&&i(JSON.parse(e)),n(!1)},[]);let l=async(e,t)=>{n(!0),await new Promise(e=>setTimeout(e,800));let r={id:"usr-1",name:"Vartika Sharma",username:"vartikasharma",email:e,bio:"Creating beautiful pixels and code.",avatar:"",stats:{friends:42,cardsCreated:12,messages:1337}};return i(r),localStorage.setItem("blink_user",JSON.stringify(r)),n(!1),r},u=async(e,t,r,a)=>{n(!0),await new Promise(e=>setTimeout(e,800));let o={id:"usr-"+Math.floor(1e3*Math.random()),name:e,username:t,email:r,bio:"Hey there! I am using Blink.",avatar:"",stats:{friends:0,cardsCreated:0,messages:0}};return i(o),localStorage.setItem("blink_user",JSON.stringify(o)),n(!1),o};return(0,t.jsx)(a.Provider,{value:{user:o,isAuthenticated:!!o,loading:s,login:l,signup:u,logout:()=>{i(null),localStorage.removeItem("blink_user")},updateUserProfile:e=>{let t={...o,...e};i(t),localStorage.setItem("blink_user",JSON.stringify(t))}},children:e})},"useAuth",0,()=>{let e=(0,r.useContext)(a);if(!e)throw Error("useAuth must be used within an AuthProvider");return e}])},5766,e=>{"use strict";let t,r;var a,o=e.i(71645);let i={data:""},s=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,u=(e,t)=>{let r="",a="",o="";for(let i in e){let s=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+s+";":a+="f"==i[1]?u(s,i):i+"{"+u(s,"k"==i[1]?"":t)+"}":"object"==typeof s?a+=u(s,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=s&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=u.p?u.p(i,s):i+":"+s+";")}return r+(t&&o?t+"{"+o+"}":o)+a},c={},d=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+d(e[r]);return t}return e};function f(e){let t,r,a=this||{},o=e.call?e(a.p):e;return((e,t,r,a,o)=>{var i;let f=d(e),p=c[f]||(c[f]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(f));if(!c[p]){let t=f!==e?e:(e=>{let t,r,a=[{}];for(;t=s.exec(e.replace(n,""));)t[4]?a.shift():t[3]?(r=t[3].replace(l," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(l," ").trim();return a[0]})(e);c[p]=u(o?{["@keyframes "+p]:t}:t,r?"":"."+p)}let m=r&&c.g;return r&&(c.g=c[p]),i=c[p],m?t.data=t.data.replace(m,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),p})(o.unshift?o.raw?(t=[].slice.call(arguments,1),r=a.p,o.reduce((e,a,o)=>{let i=t[o];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):o.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):o,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(a.target),a.g,a.o,a.k)}f.bind({g:1});let p,m,g,y=f.bind({k:1});function h(e,t){let r=this||{};return function(){let a=arguments;function o(i,s){let n=Object.assign({},i),l=n.className||o.className;r.p=Object.assign({theme:m&&m()},n),r.o=/go\d/.test(l),n.className=f.apply(r,a)+(l?" "+l:""),t&&(n.ref=s);let u=e;return e[0]&&(u=n.as||e,delete n.as),g&&u[0]&&g(n),p(u,n)}return t?t(o):o}}var b=(e,t)=>"function"==typeof e?e(t):e,v=(t=0,()=>(++t).toString()),x=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},w="default",E=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return E(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(e=>e.id===o||void 0===o?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},P=[],k={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},O={},N=(e,t=w)=>{O[t]=E(O[t]||k,e),P.forEach(([e,r])=>{e===t&&r(O[t])})},C=e=>Object.keys(O).forEach(t=>N(e,t)),S=(e=w)=>t=>{N(t,e)},I={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},$=(e={},t=w)=>{let[r,a]=(0,o.useState)(O[t]||k),i=(0,o.useRef)(O[t]);(0,o.useEffect)(()=>(i.current!==O[t]&&a(O[t]),P.push([t,a]),()=>{let e=P.findIndex(([e])=>e===t);e>-1&&P.splice(e,1)}),[t]);let s=r.toasts.map(t=>{var r,a,o;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||I[t.type],style:{...e.style,...null==(o=e[t.type])?void 0:o.style,...t.style}}});return{...r,toasts:s}},j=e=>(t,r)=>{let a,o=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||v()}))(t,e,r);return S(o.toasterId||(a=o.id,Object.keys(O).find(e=>O[e].toasts.some(e=>e.id===a))))({type:2,toast:o}),o.id},A=(e,t)=>j("blank")(e,t);A.error=j("error"),A.success=j("success"),A.loading=j("loading"),A.custom=j("custom"),A.dismiss=(e,t)=>{let r={type:3,toastId:e};t?S(t)(r):C(r)},A.dismissAll=e=>A.dismiss(void 0,e),A.remove=(e,t)=>{let r={type:4,toastId:e};t?S(t)(r):C(r)},A.removeAll=e=>A.remove(void 0,e),A.promise=(e,t,r)=>{let a=A.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?b(t.success,e):void 0;return o?A.success(o,{id:a,...r,...null==r?void 0:r.success}):A.dismiss(a),e}).catch(e=>{let o=t.error?b(t.error,e):void 0;o?A.error(o,{id:a,...r,...null==r?void 0:r.error}):A.dismiss(a)}),e};var T=1e3,_=(e,t="default")=>{let{toasts:r,pausedAt:a}=$(e,t),i=(0,o.useRef)(new Map).current,s=(0,o.useCallback)((e,t=T)=>{if(i.has(e))return;let r=setTimeout(()=>{i.delete(e),n({type:4,toastId:e})},t);i.set(e,r)},[]);(0,o.useEffect)(()=>{if(a)return;let e=Date.now(),o=r.map(r=>{if(r.duration===1/0)return;let a=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(a<0){r.visible&&A.dismiss(r.id);return}return setTimeout(()=>A.dismiss(r.id,t),a)});return()=>{o.forEach(e=>e&&clearTimeout(e))}},[r,a,t]);let n=(0,o.useCallback)(S(t),[t]),l=(0,o.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),u=(0,o.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,o.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),d=(0,o.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:o=8,defaultPosition:i}=t||{},s=r.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=s.findIndex(t=>t.id===e.id),l=s.filter((e,t)=>t<n&&e.visible).length;return s.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+o,0)},[r]);return(0,o.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)s(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[r,s]),{toasts:r,handlers:{updateHeight:u,startPause:l,endPause:c,calculateOffset:d}}},D=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,z=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,L=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,M=h("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${D} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${z} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${L} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,F=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,R=h("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${F} 1s linear infinite;
`,U=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,B=y`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,H=h("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${U} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${B} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,J=h("div")`
  position: absolute;
`,V=h("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Z=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,K=h("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Z} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Q=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?o.createElement(K,null,t):t:"blank"===r?null:o.createElement(V,null,o.createElement(R,{...a}),"loading"!==r&&o.createElement(J,null,"error"===r?o.createElement(M,{...a}):o.createElement(H,{...a})))},q=h("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,G=h("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,W=o.memo(({toast:e,position:t,style:r,children:a})=>{let i=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[a,o]=x()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},s=o.createElement(Q,{toast:e}),n=o.createElement(G,{...e.ariaProps},b(e.message,e));return o.createElement(q,{className:e.className,style:{...i,...r,...e.style}},"function"==typeof a?a({icon:s,message:n}):o.createElement(o.Fragment,null,s,n))});a=o.createElement,u.p=void 0,p=a,m=void 0,g=void 0;var X=({id:e,className:t,style:r,onHeightUpdate:a,children:i})=>{let s=o.useCallback(t=>{if(t){let r=()=>{a(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return o.createElement("div",{ref:s,className:t,style:r},i)},Y=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["CheckmarkIcon",0,H,"ErrorIcon",0,M,"LoaderIcon",0,R,"ToastBar",0,W,"ToastIcon",0,Q,"Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:i,toasterId:s,containerStyle:n,containerClassName:l})=>{let{toasts:u,handlers:c}=_(r,s);return o.createElement("div",{"data-rht-toaster":s||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},u.map(r=>{let s,n,l=r.position||t,u=c.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}),d=(s=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:x()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${u*(s?1:-1)}px)`,...s?{top:0}:{bottom:0},...n});return o.createElement(X,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?Y:"",style:d},"custom"===r.type?b(r.message,r):i?i(r):o.createElement(W,{toast:r,position:l}))}))},"default",0,A,"resolveValue",0,b,"toast",0,A,"useToaster",0,_,"useToasterStore",0,$],5766)}]);