(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{9745:(e,t,n)=>{Promise.resolve().then(n.bind(n,4404)),Promise.resolve().then(n.bind(n,7640)),Promise.resolve().then(n.bind(n,239)),Promise.resolve().then(n.t.bind(n,4080,23)),Promise.resolve().then(n.t.bind(n,4927,23)),Promise.resolve().then(n.t.bind(n,4315,23))},239:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});let r=n(7437),a=n(2265);t.default=function(e){let{html:t,height:n=null,width:i=null,children:o,dataNtpc:l=""}=e;return(0,a.useEffect)(()=>{l&&performance.mark("mark_feature_usage",{detail:{feature:"next-third-parties-".concat(l)}})},[l]),(0,r.jsxs)(r.Fragment,{children:[o,t?(0,r.jsx)("div",{style:{height:null!=n?"".concat(n,"px"):"auto",width:null!=i?"".concat(i,"px"):"auto"},"data-ntpc":l,dangerouslySetInnerHTML:{__html:t}}):null]})}},4404:(e,t,n)=>{"use strict";let r;Object.defineProperty(t,"__esModule",{value:!0}),t.sendGAEvent=t.GoogleAnalytics=void 0;let a=n(7437),i=n(2265),o=function(e){return e&&e.__esModule?e:{default:e}}(n(1877));t.GoogleAnalytics=function(e){let{gaId:t,dataLayerName:n="dataLayer"}=e;return void 0===r&&(r=n),(0,i.useEffect)(()=>{performance.mark("mark_feature_usage",{detail:{feature:"next-third-parties-ga"}})},[]),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(o.default,{id:"_next-ga-init",dangerouslySetInnerHTML:{__html:"\n          window['".concat(n,"'] = window['").concat(n,"'] || [];\n          function gtag(){window['").concat(n,"'].push(arguments);}\n          gtag('js', new Date());\n\n          gtag('config', '").concat(t,"');")}}),(0,a.jsx)(o.default,{id:"_next-ga",src:"https://www.googletagmanager.com/gtag/js?id=".concat(t)})]})},t.sendGAEvent=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];if(void 0===r){console.warn("@next/third-parties: GA has not been initialized");return}window[r]?window[r].push(arguments):console.warn("@next/third-parties: GA dataLayer ".concat(r," does not exist"))}},7640:(e,t,n)=>{"use strict";let r;Object.defineProperty(t,"__esModule",{value:!0}),t.sendGTMEvent=t.GoogleTagManager=void 0;let a=n(7437),i=n(2265),o=function(e){return e&&e.__esModule?e:{default:e}}(n(1877));t.GoogleTagManager=function(e){let{gtmId:t,dataLayerName:n="dataLayer",auth:l,preview:s,dataLayer:d}=e;void 0===r&&(r=n);let u="dataLayer"!==n?"&l=".concat(n):"";return(0,i.useEffect)(()=>{performance.mark("mark_feature_usage",{detail:{feature:"next-third-parties-gtm"}})},[]),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(o.default,{id:"_next-gtm-init",dangerouslySetInnerHTML:{__html:"\n      (function(w,l){\n        w[l]=w[l]||[];\n        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});\n        ".concat(d?"w[l].push(".concat(JSON.stringify(d),")"):"","\n      })(window,'").concat(n,"');")}}),(0,a.jsx)(o.default,{id:"_next-gtm","data-ntpc":"GTM",src:"https://www.googletagmanager.com/gtm.js?id=".concat(t).concat(u).concat(l?"&gtm_auth=".concat(l):"").concat(s?"&gtm_preview=".concat(s,"&gtm_cookies_win=x"):"")})]})},t.sendGTMEvent=e=>{if(void 0===r){console.warn("@next/third-parties: GTM has not been initialized");return}window[r]?window[r].push(e):console.warn("@next/third-parties: GTM dataLayer ".concat(r," does not exist"))}},1877:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>a.a});var r=n(4080),a=n.n(r),i={};for(let e in r)"default"!==e&&(i[e]=()=>r[e]);n.d(t,i)},9189:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{cancelIdleCallback:function(){return r},requestIdleCallback:function(){return n}});let n="undefined"!=typeof self&&self.requestIdleCallback&&self.requestIdleCallback.bind(window)||function(e){let t=Date.now();return self.setTimeout(function(){e({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-t))}})},1)},r="undefined"!=typeof self&&self.cancelIdleCallback&&self.cancelIdleCallback.bind(window)||function(e){return clearTimeout(e)};("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},4080:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{default:function(){return m},handleClientScriptLoad:function(){return _},initScriptLoader:function(){return h}});let r=n(9920),a=n(1452),i=n(7437),o=r._(n(4887)),l=a._(n(2265)),s=n(6590),d=n(4071),u=n(9189),c=new Map,f=new Set,g=e=>{if(o.default.preinit){e.forEach(e=>{o.default.preinit(e,{as:"style"})});return}if("undefined"!=typeof window){let t=document.head;e.forEach(e=>{let n=document.createElement("link");n.type="text/css",n.rel="stylesheet",n.href=e,t.appendChild(n)})}},p=e=>{let{src:t,id:n,onLoad:r=()=>{},onReady:a=null,dangerouslySetInnerHTML:i,children:o="",strategy:l="afterInteractive",onError:s,stylesheets:u}=e,p=n||t;if(p&&f.has(p))return;if(c.has(t)){f.add(p),c.get(t).then(r,s);return}let _=()=>{a&&a(),f.add(p)},h=document.createElement("script"),y=new Promise((e,t)=>{h.addEventListener("load",function(t){e(),r&&r.call(this,t),_()}),h.addEventListener("error",function(e){t(e)})}).catch(function(e){s&&s(e)});i?(h.innerHTML=i.__html||"",_()):o?(h.textContent="string"==typeof o?o:Array.isArray(o)?o.join(""):"",_()):t&&(h.src=t,c.set(t,y)),(0,d.setAttributesFromProps)(h,e),"worker"===l&&h.setAttribute("type","text/partytown"),h.setAttribute("data-nscript",l),u&&g(u),document.body.appendChild(h)};function _(e){let{strategy:t="afterInteractive"}=e;"lazyOnload"===t?window.addEventListener("load",()=>{(0,u.requestIdleCallback)(()=>p(e))}):p(e)}function h(e){e.forEach(_),[...document.querySelectorAll('[data-nscript="beforeInteractive"]'),...document.querySelectorAll('[data-nscript="beforePageRender"]')].forEach(e=>{let t=e.id||e.getAttribute("src");f.add(t)})}function y(e){let{id:t,src:n="",onLoad:r=()=>{},onReady:a=null,strategy:d="afterInteractive",onError:c,stylesheets:g,..._}=e,{updateScripts:h,scripts:y,getIsSsr:m,appDir:w,nonce:b}=(0,l.useContext)(s.HeadManagerContext),v=(0,l.useRef)(!1);(0,l.useEffect)(()=>{let e=t||n;v.current||(a&&e&&f.has(e)&&a(),v.current=!0)},[a,t,n]);let x=(0,l.useRef)(!1);if((0,l.useEffect)(()=>{!x.current&&("afterInteractive"===d?p(e):"lazyOnload"===d&&("complete"===document.readyState?(0,u.requestIdleCallback)(()=>p(e)):window.addEventListener("load",()=>{(0,u.requestIdleCallback)(()=>p(e))})),x.current=!0)},[e,d]),("beforeInteractive"===d||"worker"===d)&&(h?(y[d]=(y[d]||[]).concat([{id:t,src:n,onLoad:r,onReady:a,onError:c,..._}]),h(y)):m&&m()?f.add(t||n):m&&!m()&&p(e)),w){if(g&&g.forEach(e=>{o.default.preinit(e,{as:"style"})}),"beforeInteractive"===d)return n?(o.default.preload(n,_.integrity?{as:"script",integrity:_.integrity,nonce:b,crossOrigin:_.crossOrigin}:{as:"script",nonce:b,crossOrigin:_.crossOrigin}),(0,i.jsx)("script",{nonce:b,dangerouslySetInnerHTML:{__html:"(self.__next_s=self.__next_s||[]).push("+JSON.stringify([n,{..._,id:t}])+")"}})):(_.dangerouslySetInnerHTML&&(_.children=_.dangerouslySetInnerHTML.__html,delete _.dangerouslySetInnerHTML),(0,i.jsx)("script",{nonce:b,dangerouslySetInnerHTML:{__html:"(self.__next_s=self.__next_s||[]).push("+JSON.stringify([0,{..._,id:t}])+")"}}));"afterInteractive"===d&&n&&o.default.preload(n,_.integrity?{as:"script",integrity:_.integrity,nonce:b,crossOrigin:_.crossOrigin}:{as:"script",nonce:b,crossOrigin:_.crossOrigin})}return null}Object.defineProperty(y,"__nextScript",{value:!0});let m=y;("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},4071:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"setAttributesFromProps",{enumerable:!0,get:function(){return i}});let n={acceptCharset:"accept-charset",className:"class",htmlFor:"for",httpEquiv:"http-equiv",noModule:"noModule"},r=["onLoad","onReady","dangerouslySetInnerHTML","children","onError","strategy","stylesheets"];function a(e){return["async","defer","noModule"].includes(e)}function i(e,t){for(let[i,o]of Object.entries(t)){if(!t.hasOwnProperty(i)||r.includes(i)||void 0===o)continue;let l=n[i]||i.toLowerCase();"SCRIPT"===e.tagName&&a(l)?e[l]=!!o:e.setAttribute(l,String(o)),(!1===o||"SCRIPT"===e.tagName&&a(l)&&(!o||"false"===o))&&(e.setAttribute(l,""),e.removeAttribute(l))}}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},4927:()=>{},4315:()=>{}},e=>{var t=t=>e(e.s=t);e.O(0,[981,130,215,744],()=>t(9745)),_N_E=e.O()}]);