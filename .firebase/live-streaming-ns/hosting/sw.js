!function(){"use strict";var e={895:function(){try{self["workbox:cacheable-response:6.5.4"]&&_()}catch(e){}},913:function(){try{self["workbox:core:6.5.4"]&&_()}catch(e){}},550:function(){try{self["workbox:expiration:6.5.4"]&&_()}catch(e){}},977:function(){try{self["workbox:precaching:6.5.4"]&&_()}catch(e){}},144:function(){try{self["workbox:recipes:6.5.4"]&&_()}catch(e){}},80:function(){try{self["workbox:routing:6.5.4"]&&_()}catch(e){}},873:function(){try{self["workbox:strategies:6.5.4"]&&_()}catch(e){}}},t={};function s(a){var i=t[a];if(void 0!==i)return i.exports;var r=t[a]={exports:{}},n=!0;try{e[a](r,r.exports,s),n=!1}finally{n&&delete t[a]}return r.exports}!function(){var e;let t,a,i,r,n;s(913);let c=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s};class o extends Error{constructor(e,t){let s=c(e,t);super(s),this.name=e,this.details=t}}function l(e){e.then(()=>{})}let h=(e,t)=>t.some(t=>e instanceof t),u=new WeakMap,d=new WeakMap,f=new WeakMap,p=new WeakMap,g=new WeakMap,w={get(e,t,s){if(e instanceof IDBTransaction){if("done"===t)return d.get(e);if("objectStoreNames"===t)return e.objectStoreNames||f.get(e);if("store"===t)return s.objectStoreNames[1]?void 0:s.objectStore(s.objectStoreNames[0])}return m(e[t])},set:(e,t,s)=>(e[t]=s,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function m(e){var s;if(e instanceof IDBRequest)return function(e){let t=new Promise((t,s)=>{let a=()=>{e.removeEventListener("success",i),e.removeEventListener("error",r)},i=()=>{t(m(e.result)),a()},r=()=>{s(e.error),a()};e.addEventListener("success",i),e.addEventListener("error",r)});return t.then(t=>{t instanceof IDBCursor&&u.set(t,e)}).catch(()=>{}),g.set(t,e),t}(e);if(p.has(e))return p.get(e);let i="function"==typeof(s=e)?s!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(a||(a=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(s)?function(...e){return s.apply(y(this),e),m(u.get(this))}:function(...e){return m(s.apply(y(this),e))}:function(e,...t){let a=s.call(y(this),e,...t);return f.set(a,e.sort?e.sort():[e]),m(a)}:(s instanceof IDBTransaction&&function(e){if(d.has(e))return;let t=new Promise((t,s)=>{let a=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",r),e.removeEventListener("abort",r)},i=()=>{t(),a()},r=()=>{s(e.error||new DOMException("AbortError","AbortError")),a()};e.addEventListener("complete",i),e.addEventListener("error",r),e.addEventListener("abort",r)});d.set(e,t)}(s),h(s,t||(t=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(s,w):s;return i!==e&&(p.set(e,i),g.set(i,e)),i}let y=e=>g.get(e),b=["get","getKey","getAll","getAllKeys","count"],R=["put","add","delete","clear"],x=new Map;function C(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(x.get(t))return x.get(t);let s=t.replace(/FromIndex$/,""),a=t!==s,i=R.includes(s);if(!(s in(a?IDBIndex:IDBObjectStore).prototype)||!(i||b.includes(s)))return;let r=async function(e,...t){let r=this.transaction(e,i?"readwrite":"readonly"),n=r.store;return a&&(n=n.index(t.shift())),(await Promise.all([n[s](...t),i&&r.done]))[0]};return x.set(t,r),r}w={...e=w,get:(t,s,a)=>C(t,s)||e.get(t,s,a),has:(t,s)=>!!C(t,s)||e.has(t,s)},s(550);let v="cache-entries",E=e=>{let t=new URL(e,location.href);return t.hash="",t.href};class L{constructor(e){this._db=null,this._cacheName=e}_upgradeDb(e){let t=e.createObjectStore(v,{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1})}_upgradeDbAndDeleteOldDbs(e){this._upgradeDb(e),this._cacheName&&function(e,{blocked:t}={}){let s=indexedDB.deleteDatabase(e);t&&s.addEventListener("blocked",e=>t(e.oldVersion,e)),m(s).then(()=>void 0)}(this._cacheName)}async setTimestamp(e,t){e=E(e);let s={url:e,timestamp:t,cacheName:this._cacheName,id:this._getId(e)},a=await this.getDb(),i=a.transaction(v,"readwrite",{durability:"relaxed"});await i.store.put(s),await i.done}async getTimestamp(e){let t=await this.getDb(),s=await t.get(v,this._getId(e));return null==s?void 0:s.timestamp}async expireEntries(e,t){let s=await this.getDb(),a=await s.transaction(v).store.index("timestamp").openCursor(null,"prev"),i=[],r=0;for(;a;){let s=a.value;s.cacheName===this._cacheName&&(e&&s.timestamp<e||t&&r>=t?i.push(a.value):r++),a=await a.continue()}let n=[];for(let e of i)await s.delete(v,e.id),n.push(e.url);return n}_getId(e){return this._cacheName+"|"+E(e)}async getDb(){return this._db||(this._db=await function(e,t,{blocked:s,upgrade:a,blocking:i,terminated:r}={}){let n=indexedDB.open(e,1),c=m(n);return a&&n.addEventListener("upgradeneeded",e=>{a(m(n.result),e.oldVersion,e.newVersion,m(n.transaction),e)}),s&&n.addEventListener("blocked",e=>s(e.oldVersion,e.newVersion,e)),c.then(e=>{r&&e.addEventListener("close",()=>r()),i&&e.addEventListener("versionchange",e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),c}("workbox-expiration",0,{upgrade:this._upgradeDbAndDeleteOldDbs.bind(this)})),this._db}}class D{constructor(e,t={}){this._isRunning=!1,this._rerunRequested=!1,this._maxEntries=t.maxEntries,this._maxAgeSeconds=t.maxAgeSeconds,this._matchOptions=t.matchOptions,this._cacheName=e,this._timestampModel=new L(e)}async expireEntries(){if(this._isRunning){this._rerunRequested=!0;return}this._isRunning=!0;let e=this._maxAgeSeconds?Date.now()-1e3*this._maxAgeSeconds:0,t=await this._timestampModel.expireEntries(e,this._maxEntries),s=await self.caches.open(this._cacheName);for(let e of t)await s.delete(e,this._matchOptions);this._isRunning=!1,this._rerunRequested&&(this._rerunRequested=!1,l(this.expireEntries()))}async updateTimestamp(e){await this._timestampModel.setTimestamp(e,Date.now())}async isURLExpired(e){if(!this._maxAgeSeconds)return!1;{let t=await this._timestampModel.getTimestamp(e),s=Date.now()-1e3*this._maxAgeSeconds;return void 0===t||t<s}}async delete(){this._rerunRequested=!1,await this._timestampModel.expireEntries(1/0)}}let k={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},T=e=>[k.prefix,e,k.suffix].filter(e=>e&&e.length>0).join("-"),U=e=>{for(let t of Object.keys(k))e(t)},N={updateDetails:e=>{U(t=>{"string"==typeof e[t]&&(k[t]=e[t])})},getGoogleAnalyticsName:e=>e||T(k.googleAnalytics),getPrecacheName:e=>e||T(k.precache),getPrefix:()=>k.prefix,getRuntimeName:e=>e||T(k.runtime),getSuffix:()=>k.suffix},P=e=>{let t=new URL(String(e),location.href);return t.href.replace(RegExp(`^${location.origin}`),"")},I=new Set;class S{constructor(e={}){this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:a})=>{if(!a)return null;let i=this._isResponseDateFresh(a),r=this._getCacheExpiration(s);l(r.expireEntries());let n=r.updateTimestamp(t.url);if(e)try{e.waitUntil(n)}catch(e){}return i?a:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{let s=this._getCacheExpiration(e);await s.updateTimestamp(t.url),await s.expireEntries()},this._config=e,this._maxAgeSeconds=e.maxAgeSeconds,this._cacheExpirations=new Map,e.purgeOnQuotaError&&I.add(()=>this.deleteCacheAndMetadata())}_getCacheExpiration(e){if(e===N.getRuntimeName())throw new o("expire-custom-caches-only");let t=this._cacheExpirations.get(e);return t||(t=new D(e,this._config),this._cacheExpirations.set(e,t)),t}_isResponseDateFresh(e){if(!this._maxAgeSeconds)return!0;let t=this._getDateHeaderTimestamp(e);if(null===t)return!0;let s=Date.now();return t>=s-1e3*this._maxAgeSeconds}_getDateHeaderTimestamp(e){if(!e.headers.has("date"))return null;let t=e.headers.get("date"),s=new Date(t),a=s.getTime();return isNaN(a)?null:a}async deleteCacheAndMetadata(){for(let[e,t]of this._cacheExpirations)await self.caches.delete(e),await t.delete();this._cacheExpirations=new Map}}function A(e,t){let s=t();return e.waitUntil(s),s}s(977);class q{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){let e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class M{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{let s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}async function K(e,t){let s=null;if(e.url){let t=new URL(e.url);s=t.origin}if(s!==self.location.origin)throw new o("cross-origin-copy-response",{origin:s});let a=e.clone(),r={headers:new Headers(a.headers),status:a.status,statusText:a.statusText},n=t?t(r):r,c=!function(){if(void 0===i){let e=new Response("");if("body"in e)try{new Response(e.body),i=!0}catch(e){i=!1}i=!1}return i}()?await a.blob():a.body;return new Response(c,n)}function O(e,t){let s=new URL(e);for(let e of t)s.searchParams.delete(e);return s.href}async function W(e,t,s,a){let i=O(t.url,s);if(t.url===i)return e.match(t,a);let r=Object.assign(Object.assign({},a),{ignoreSearch:!0}),n=await e.keys(t,r);for(let t of n){let r=O(t.url,s);if(i===r)return e.match(t,a)}}class B{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}async function j(){for(let e of I)await e()}function F(e){return"string"==typeof e?new Request(e):e}s(873);class H{constructor(e,t){for(let s of(this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new B,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map,this._plugins))this._pluginStateMap.set(s,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){let{event:t}=this,s=F(e);if("navigate"===s.mode&&t instanceof FetchEvent&&t.preloadResponse){let e=await t.preloadResponse;if(e)return e}let a=this.hasCallback("fetchDidFail")?s.clone():null;try{for(let e of this.iterateCallbacks("requestWillFetch"))s=await e({request:s.clone(),event:t})}catch(e){if(e instanceof Error)throw new o("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}let i=s.clone();try{let e;for(let a of(e=await fetch(s,"navigate"===s.mode?void 0:this._strategy.fetchOptions),this.iterateCallbacks("fetchDidSucceed")))e=await a({event:t,request:i,response:e});return e}catch(e){throw a&&await this.runCallbacks("fetchDidFail",{error:e,event:t,originalRequest:a.clone(),request:i.clone()}),e}}async fetchAndCachePut(e){let t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){let t;let s=F(e),{cacheName:a,matchOptions:i}=this._strategy,r=await this.getCacheKey(s,"read"),n=Object.assign(Object.assign({},i),{cacheName:a});for(let e of(t=await caches.match(r,n),this.iterateCallbacks("cachedResponseWillBeUsed")))t=await e({cacheName:a,matchOptions:i,cachedResponse:t,request:r,event:this.event})||void 0;return t}async cachePut(e,t){let s=F(e);await new Promise(e=>setTimeout(e,0));let a=await this.getCacheKey(s,"write");if(!t)throw new o("cache-put-with-no-response",{url:P(a.url)});let i=await this._ensureResponseSafeToCache(t);if(!i)return!1;let{cacheName:r,matchOptions:n}=this._strategy,c=await self.caches.open(r),l=this.hasCallback("cacheDidUpdate"),h=l?await W(c,a.clone(),["__WB_REVISION__"],n):null;try{await c.put(a,l?i.clone():i)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await j(),e}for(let e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:r,oldResponse:h,newResponse:i.clone(),request:a,event:this.event});return!0}async getCacheKey(e,t){let s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let a=e;for(let e of this.iterateCallbacks("cacheKeyWillBeUsed"))a=F(await e({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[s]=a}return this._cacheKeys[s]}hasCallback(e){for(let t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(let s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(let t of this._strategy.plugins)if("function"==typeof t[e]){let s=this._pluginStateMap.get(t),a=a=>{let i=Object.assign(Object.assign({},a),{state:s});return t[e](i)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(let e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return!s&&t&&200!==t.status&&(t=void 0),t}}class V{constructor(e={}){this.cacheName=N.getRuntimeName(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){let[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});let t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,i=new H(this,{event:t,request:s,params:a}),r=this._getResponse(i,s,t),n=this._awaitComplete(r,i,s,t);return[r,n]}async _getResponse(e,t,s){let a;await e.runCallbacks("handlerWillStart",{event:s,request:t});try{if(!(a=await this._handle(t,e))||"error"===a.type)throw new o("no-response",{url:t.url})}catch(i){if(i instanceof Error){for(let r of e.iterateCallbacks("handlerDidError"))if(a=await r({error:i,event:s,request:t}))break}if(a);else throw i}for(let i of e.iterateCallbacks("handlerWillRespond"))a=await i({event:s,request:t,response:a});return a}async _awaitComplete(e,t,s,a){let i,r;try{i=await e}catch(e){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:i}),await t.doneWaiting()}catch(e){e instanceof Error&&(r=e)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:i,error:r}),t.destroy(),r)throw r}}class $ extends V{constructor(e={}){e.cacheName=N.getPrecacheName(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push($.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){let s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let s;let a=t.params||{};if(this._fallbackToNetwork){let i=a.integrity,r=e.integrity;s=await t.fetch(new Request(e,{integrity:"no-cors"!==e.mode?r||i:void 0})),i&&(!r||r===i)&&"no-cors"!==e.mode&&(this._useDefaultCacheabilityPluginIfNeeded(),await t.cachePut(e,s.clone()))}else throw new o("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return s}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();let s=await t.fetch(e),a=await t.cachePut(e,s.clone());if(!a)throw new o("bad-precaching-response",{url:e.url,status:s.status});return s}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(let[s,a]of this.plugins.entries())a!==$.copyRedirectedCacheableResponsesPlugin&&(a===$.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push($.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}$.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},$.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await K(e):e};class G{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new $({cacheName:N.getPrecacheName(e),plugins:[...t,new M({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){let t=[];for(let s of e){"string"==typeof s?t.push(s):s&&void 0===s.revision&&t.push(s.url);let{cacheKey:e,url:a}=function(e){if(!e)throw new o("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){let t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}let{revision:t,url:s}=e;if(!s)throw new o("add-to-cache-list-unexpected-type",{entry:e});if(!t){let e=new URL(s,location.href);return{cacheKey:e.href,url:e.href}}let a=new URL(s,location.href),i=new URL(s,location.href);return a.searchParams.set("__WB_REVISION__",t),{cacheKey:a.href,url:i.href}}(s),i="string"!=typeof s&&s.revision?"reload":"default";if(this._urlsToCacheKeys.has(a)&&this._urlsToCacheKeys.get(a)!==e)throw new o("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(a),secondEntry:e});if("string"!=typeof s&&s.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==s.integrity)throw new o("add-to-cache-list-conflicting-integrities",{url:a});this._cacheKeysToIntegrities.set(e,s.integrity)}if(this._urlsToCacheKeys.set(a,e),this._urlsToCacheModes.set(a,i),t.length>0){let e=`Workbox is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return A(e,async()=>{let t=new q;for(let[s,a]of(this.strategy.plugins.push(t),this._urlsToCacheKeys)){let t=this._cacheKeysToIntegrities.get(a),i=this._urlsToCacheModes.get(s),r=new Request(s,{integrity:t,cache:i,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:a},request:r,event:e}))}let{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}})}activate(e){return A(e,async()=>{let e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(let i of t)s.has(i.url)||(await e.delete(i),a.push(i.url));return{deletedURLs:a}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){let t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){let t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){let e=await self.caches.open(this.strategy.cacheName);return e.match(s)}}createHandlerBoundToURL(e){let t=this.getCacheKeyForURL(e);if(!t)throw new o("non-precached-url",{url:e});return s=>(s.request=new Request(e),s.params=Object.assign({cacheKey:t},s.params),this.strategy.handle(s))}}let Q=()=>(r||(r=new G),r);s(80);let J=e=>e&&"object"==typeof e?e:{handle:e};class z{constructor(e,t,s="GET"){this.handler=J(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=J(e)}}class X extends z{constructor(e,t,s){super(({url:t})=>{let s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)},t,s)}}class Y{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",e=>{let{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){let{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(t=>{"string"==typeof t&&(t=[t]);let s=new Request(...t);return this.handleRequest({request:s,event:e})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){let s;let a=new URL(e.url,location.href);if(!a.protocol.startsWith("http"))return;let i=a.origin===location.origin,{params:r,route:n}=this.findMatchingRoute({event:t,request:e,sameOrigin:i,url:a}),c=n&&n.handler,o=e.method;if(!c&&this._defaultHandlerMap.has(o)&&(c=this._defaultHandlerMap.get(o)),!c)return;try{s=c.handle({url:a,request:e,event:t,params:r})}catch(e){s=Promise.reject(e)}let l=n&&n.catchHandler;return s instanceof Promise&&(this._catchHandler||l)&&(s=s.catch(async s=>{if(l)try{return await l.handle({url:a,request:e,event:t,params:r})}catch(e){e instanceof Error&&(s=e)}if(this._catchHandler)return this._catchHandler.handle({url:a,request:e,event:t});throw s})),s}findMatchingRoute({url:e,sameOrigin:t,request:s,event:a}){let i=this._routes.get(s.method)||[];for(let r of i){let i;let n=r.match({url:e,sameOrigin:t,request:s,event:a});if(n)return Array.isArray(i=n)&&0===i.length?i=void 0:n.constructor===Object&&0===Object.keys(n).length?i=void 0:"boolean"==typeof n&&(i=void 0),{route:r,params:i}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,J(e))}setCatchHandler(e){this._catchHandler=J(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new o("unregister-route-but-not-found-with-method",{method:e.method});let t=this._routes.get(e.method).indexOf(e);if(t>-1)this._routes.get(e.method).splice(t,1);else throw new o("unregister-route-route-not-registered")}}let Z=()=>(n||((n=new Y).addFetchListener(),n.addCacheListener()),n);function ee(e,t,s){let a;if("string"==typeof e){let i=new URL(e,location.href);a=new z(({url:e})=>e.href===i.href,t,s)}else if(e instanceof RegExp)a=new X(e,t,s);else if("function"==typeof e)a=new z(e,t,s);else if(e instanceof z)a=e;else throw new o("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});let i=Z();return i.registerRoute(a),a}class et extends z{constructor(e,t){super(({request:s})=>{let a=e.getURLsToCacheKeys();for(let i of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:a=!0,urlManipulation:i}={}){let r=new URL(e,location.href);r.hash="",yield r.href;let n=function(e,t=[]){for(let s of[...e.searchParams.keys()])t.some(e=>e.test(s))&&e.searchParams.delete(s);return e}(r,t);if(yield n.href,s&&n.pathname.endsWith("/")){let e=new URL(n.href);e.pathname+=s,yield e.href}if(a){let e=new URL(n.href);e.pathname+=".html",yield e.href}if(i){let e=i({url:r});for(let t of e)yield t.href}}(s.url,t)){let t=a.get(i);if(t){let s=e.getIntegrityForCacheKey(t);return{cacheKey:t,integrity:s}}}},e.strategy)}}let es="-precache-",ea=async(e,t=es)=>{let s=await self.caches.keys(),a=s.filter(s=>s.includes(t)&&s.includes(self.registration.scope)&&s!==e);return await Promise.all(a.map(e=>self.caches.delete(e))),a},ei={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};class er extends V{constructor(e={}){super(e),this.plugins.some(e=>"cacheWillUpdate"in e)||this.plugins.unshift(ei)}async _handle(e,t){let s;let a=t.fetchAndCachePut(e).catch(()=>{});t.waitUntil(a);let i=await t.cacheMatch(e);if(i);else try{i=await a}catch(e){e instanceof Error&&(s=e)}if(!i)throw new o("no-response",{url:e.url,error:s});return i}}class en extends V{async _handle(e,t){let s,a=await t.cacheMatch(e);if(!a)try{a=await t.fetchAndCachePut(e)}catch(e){e instanceof Error&&(s=e)}if(!a)throw new o("no-response",{url:e.url,error:s});return a}}s(895);class ec{constructor(e={}){this._statuses=e.statuses,this._headers=e.headers}isResponseCacheable(e){let t=!0;return this._statuses&&(t=this._statuses.includes(e.status)),this._headers&&t&&(t=Object.keys(this._headers).some(t=>e.headers.get(t)===this._headers[t])),t}}class eo{constructor(e){this.cacheWillUpdate=async({response:e})=>this._cacheableResponse.isResponseCacheable(e)?e:null,this._cacheableResponse=new ec(e)}}function el(e){self.addEventListener("install",t=>{let s=e.urls.map(s=>e.strategy.handleAll({event:t,request:new Request(s)})[1]);t.waitUntil(Promise.all(s))})}s(144),self.__WB_DISABLE_DEV_LOGS=!1,self.__WB_DISABLE_DEV_LOGS=!1,self.addEventListener("activate",e=>{let t=N.getPrecacheName();e.waitUntil(ea(t).then(e=>{}))}),function(e){let t=Q();t.precache(e)}([{'revision':'9fce7989bff5d35b01e177447faca50d','url':'/_next/server/next-font-manifest.js'},{'revision':'d51420cd4aa5d37d6719849cf36d0d6f','url':'/_next/server/next-font-manifest.json'},{'revision':null,'url':'/_next/static/chunks/21-0469cf585389bd5f.js'},{'revision':null,'url':'/_next/static/chunks/249.21109f309f1c06e3.js'},{'revision':null,'url':'/_next/static/chunks/478-0c96b19f5f249e72.js'},{'revision':null,'url':'/_next/static/chunks/514-065ff67888128f69.js'},{'revision':null,'url':'/_next/static/chunks/572-7197812acc30900f.js'},{'revision':null,'url':'/_next/static/chunks/664-64b389b3e10d7df4.js'},{'revision':null,'url':'/_next/static/chunks/698.1c8e7f04b1ae8dfe.js'},{'revision':null,'url':'/_next/static/chunks/729-4313952673e7b86f.js'},{'revision':null,'url':'/_next/static/chunks/747-6d71f100e8782e58.js'},{'revision':null,'url':'/_next/static/chunks/848-90b4c92ad57d7746.js'},{'revision':null,'url':'/_next/static/chunks/fde03682-7a49b66743c0eff6.js'},{'revision':null,'url':'/_next/static/chunks/fdec9a07-60f64a9b0cf0c1f1.js'},{'revision':null,'url':'/_next/static/chunks/framework-cb69c5e9cd6dd493.js'},{'revision':null,'url':'/_next/static/chunks/main-9238fe09c1b63ecf.js'},{'revision':null,'url':'/_next/static/chunks/pages/_app-16e7239f27783ba9.js'},{'revision':null,'url':'/_next/static/chunks/pages/_error-aeb702367fca4129.js'},{'revision':null,'url':'/_next/static/chunks/pages/app-1f3d9b8e2d538f0b.js'},{'revision':null,'url':'/_next/static/chunks/pages/app/modalAddLinks-a970c517f7104fed.js'},{'revision':null,'url':'/_next/static/chunks/pages/app/modalGetLinks-baf30d5fe946a073.js'},{'revision':null,'url':'/_next/static/chunks/pages/app/settings-5baa3311264b348d.js'},{'revision':null,'url':'/_next/static/chunks/pages/index-43a05ef195d3b463.js'},{'revision':null,'url':'/_next/static/chunks/pages/onboarding-5853e62fc13c12e9.js'},{'revision':null,'url':'/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js'},{'revision':null,'url':'/_next/static/chunks/webpack-b744c5b5342348f5.js'},{'revision':null,'url':'/_next/static/css/1ac4d728f4fa0643.css'},{'revision':null,'url':'/_next/static/rlZxZf5GHN9gu5LgDi9QW/_buildManifest.js'},{'revision':null,'url':'/_next/static/rlZxZf5GHN9gu5LgDi9QW/_ssgManifest.js'},{'revision':'54b43cd3bcf0eca2a903254ef23bce3c','url':'/app/profile.jpg'},{'revision':'b888159702d552729978b04c4fc0da9f','url':'/app/promotion/screen-1.png'},{'revision':'bb011efde7ef96afd3ceaf0e1b97c66e','url':'/app/promotion/screen-2.png'},{'revision':'18df6d2e688561d03da9dd2758adf9e8','url':'/app/promotion/screen-3.png'},{'revision':'073eb1b9d20d99e9004e7c2e2b5b69f1','url':'/app/pwa-icons/icon-192x192.png'},{'revision':'e1baa97c3d80ac6f7d79e753020541ae','url':'/app/pwa-icons/icon-256x256.png'},{'revision':'c1f1e36fe1121c8bb8371359190cd909','url':'/app/pwa-icons/icon-384x384.png'},{'revision':'3c331aa9e0577b36b18c7cf7a8e6dd7a','url':'/app/pwa-icons/icon-512x512.png'},{'revision':'42de39919d98d3ce202ada466e4cbd47','url':'/app/shortcuts/home-shortcut.png'},{'revision':'45d606a8fefa79b120c75d585200058b','url':'/app/shortcuts/profile-shortcut.png'},{'revision':'ae963ea31cd05d8b21e6789d962ee2ea','url':'/app/shortcuts/settings-shortcut.png'},{'revision':'875608d0dc40d89e9b48b94e82489103','url':'/apple-touch-icon.png'},{'revision':'0cbcefe245f1bdfed30f1b48f8351ce6','url':'/favicon-32x32.png'},{'revision':'300dbdc48069ccbae68e30b88bda8711','url':'/landing-page.svg'},{'revision':'1ec86601d83a3cb7904f0bd488d93637','url':'/manifest.webmanifest'},{'revision':'e33d0411a4809bf09d6735864d2f4e00','url':'/ns.png'},{'revision':'dd1dc3b64461cd4c160c407392019407','url':'/offline/offline.css'},{'revision':'bfa070e9f414f02b051128a123ad15e9','url':'/offline/offline.html'},{'revision':'622bdacf923c07e6a398dc0eb56b0010','url':'/offline/offline.js'},{'revision':'318a94e3aceceb7f635834aaec422e1e','url':'/offline/offline.svg'},{'revision':'8f1af9c921912fdf1db3fcb536e01150','url':'/slideshow/report.svg'},{'revision':'cb9ad13b10261e428fdc7ea7579df30c','url':'/slideshow/team-meeting.svg'},{'revision':'3914fe3ad327215a9f65d1acc14f1bce','url':'/slideshow/website-hosting.svg'}]),function(e){let t=Q(),s=new et(t,e);ee(s)}(void 0),function(e={}){let t=e.cacheName||"static-resources",s=e.matchCallback||(({request:e})=>"style"===e.destination||"script"===e.destination||"worker"===e.destination),a=e.plugins||[];a.push(new eo({statuses:[0,200]}));let i=new er({cacheName:t,plugins:a});ee(s,i),e.warmCache&&el({urls:e.warmCache,strategy:i})}(),function(e={}){let t=e.cacheName||"images",s=e.matchCallback||(({request:e})=>"image"===e.destination),a=e.maxAgeSeconds||2592e3,i=e.maxEntries||60,r=e.plugins||[];r.push(new eo({statuses:[0,200]})),r.push(new S({maxEntries:i,maxAgeSeconds:a}));let n=new en({cacheName:t,plugins:r});ee(s,n),e.warmCache&&el({urls:e.warmCache,strategy:n})}(),function(e={}){let t=`${e.cachePrefix||"google-fonts"}-stylesheets`,s=`${e.cachePrefix||"google-fonts"}-webfonts`,a=e.maxAgeSeconds||31536e3,i=e.maxEntries||30;ee(({url:e})=>"https://fonts.googleapis.com"===e.origin,new er({cacheName:t})),ee(({url:e})=>"https://fonts.gstatic.com"===e.origin,new en({cacheName:s,plugins:[new eo({statuses:[0,200]}),new S({maxAgeSeconds:a,maxEntries:i})]}))}(),ee(/\/_next\/data\/.+\/.+\.json$/i,new er({cacheName:"next-data",plugins:[new S({maxEntries:120,maxAgeSeconds:86400,purgeOnQuotaError:!0})]})),ee(e=>{let{request:t}=e;return"navigate"===t.mode},new class extends V{constructor(e={}){super(e),this.plugins.some(e=>"cacheWillUpdate"in e)||this.plugins.unshift(ei),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){let s;let a=[],i=[];if(this._networkTimeoutSeconds){let{id:r,promise:n}=this._getTimeoutPromise({request:e,logs:a,handler:t});s=r,i.push(n)}let r=this._getNetworkPromise({timeoutId:s,request:e,logs:a,handler:t});i.push(r);let n=await t.waitUntil((async()=>await t.waitUntil(Promise.race(i))||await r)());if(!n)throw new o("no-response",{url:e.url});return n}_getTimeoutPromise({request:e,logs:t,handler:s}){let a;let i=new Promise(t=>{let i=async()=>{t(await s.cacheMatch(e))};a=setTimeout(i,1e3*this._networkTimeoutSeconds)});return{promise:i,id:a}}async _getNetworkPromise({timeoutId:e,request:t,logs:s,handler:a}){let i,r;try{r=await a.fetchAndCachePut(t)}catch(e){e instanceof Error&&(i=e)}return e&&clearTimeout(e),(i||!r)&&(r=await a.cacheMatch(t)),r}}({plugins:[new class{constructor({fallbackURL:e,precacheController:t}){this.handlerDidError=()=>this._precacheController.matchPrecache(this._fallbackURL),this._fallbackURL=e,this._precacheController=t||Q()}}({fallbackURL:"offline/offline.html"})]})),addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})}()}();