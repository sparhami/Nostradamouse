/*
 * Nostradamouse 0.1.7
 * Copyright (c) 2015 Sepand Parhami
 * Licensed under the MIT license
 */

!function(a,b){function c(a){this.storage=a}function d(a){this.storage=a}b.nmouse=a;var e=function(){var a=Array.prototype.slice;return{flatMap:function(a,b){return a.reduce(function(a,c){return a.concat(b(c))},[])},mix:function(a,b){return Object.keys(b).forEach(function(c){a[c]=b[c]}),a},extend:function(a,b,c){a.prototype=this.mix(Object.create(b.prototype),c||{}),a.prototype.constructor=a},getAncestry:function b(a){return a?[a].concat(b(a.parentNode)):[]},getDescendants:function c(b){var d=a.call(b.children||[]);return e.flatMap(d,c).concat(b)}}}(),f=function(a,b,c){this.evtName=a,this.loader=b,this.root=c,this.triggers=[]};f.prototype={setupListener:function(){var a=!!this.triggers.length;this.root[a?"addEventListener":"removeEventListener"](this.evtName,this,!0)},getTrippedTriggers:function(a){return e.getAncestry(a.target).filter(function(a){return a.matches}).map(function(a){return this.triggers.filter(function(b){return a.matches(b.selector)})}.bind(this)).reduce(function(a,b){return a.concat(b)},[])},handleEvent:function(a){a.target!==window&&(this.getTrippedTriggers(a).forEach(function(a){this.loader.load(a.src),a.tripped=!0}.bind(this)),this.triggers=this.triggers.filter(function(a){return!a.tripped}),this.setupListener())},addTrigger:function(a){this.triggers.push(a),this.setupListener()}};var g=function(a,b){f.call(this,"mousemove",a,b)};e.extend(g,f,{isNear:function(a,b,c){var d=(a.left+a.right)/2,e=(a.top+a.bottom)/2,f=Math.abs(b.x-d)-a.width/2,g=Math.abs(b.y-e)-a.height/2;return c>=f&&c>=g},getTrippedTriggers:function(a){var b={x:a.clientX,y:a.clientY};return this.triggers.filter(function(a){return this.isNear(a.el.getBoundingClientRect(),b,a.distance)}.bind(this))}});var h=function(a,b){this.loader=a,this.root=b,this.triggers={},this.observer=new MutationObserver(this.observe.bind(this))};h.prototype={setupObserver:function(){var a=!!Object.keys(this.triggers).length,b=this.observer;a?b.observe(this.root,{childList:!0,subtree:!0}):b.disconnect()},observe:function(a){var b=this.loader,c=this.triggers;a.forEach(function(a){var d=[].slice.call(a.addedNodes);e.flatMap(d,e.getDescendants).forEach(function(a){var d=c[a.tagName];d&&(b.load(d.src),delete c[a.tagName])})}),this.setupObserver()},addTrigger:function(a){this.root.getElementsByTagName(a.tagName).length?this.loader.load(a.src):(this.triggers[a.tagName.toUpperCase()]=a,this.setupObserver())}};var i=function(a,b){this.loader=a,this.root=b};i.prototype={addTrigger:function(a){var b=this.loader,c=a.el,d=a.src,e=document.createElement("div"),f=e.style;f.position="absolute",f.top=0,f.right=0,f.left=0,f.bottom=0,f.margin="-"+a.distance+"px",e.className="nmouse-tripwire",e.addEventListener("mouseover",function(){b.load(d),c.removeChild(e)}),c.appendChild(e)}};var j=function(){this.loadedDefs={}};j.prototype={get:function(a){return this.loadedDefs[a]},load:function(a){return this.loadedDefs[a]||(this.loadedDefs[a]=new Promise(function(b,c){var d=document.querySelector("head"),e=document.createElement("link");e.href=a,e.rel="import",e.onload=function(){b(e)},e.onerror=function(){console.error("Failed to load resource "+a),c()},d.appendChild(e)})),this.loadedDefs[a]}},c.prototype={importFromNode:function(a){var b=[].slice.call(a.getElementsByTagName("nmouse-dep")),c={};b.forEach(function(a){c[a.getAttribute("id")]=a}),b.map(function(a){var b=a.getAttribute("src"),d=a.getAttribute("deps"),e=d&&d.split(" ").map(function(a){return c[a]}).map(function(a){return a.getAttribute("src")});e&&this.storage.setDeps(b,e)}.bind(this))}},d.prototype={getKey:function(a){return"nmouse-"+a},getDeps:function(a){var b=this.getKey(a);return JSON.parse(this.storage.getItem(b))||[]},setDeps:function(a,b){var c=this.getKey(a);this.storage.setItem(c,JSON.stringify(b))}};var k=function(a){this.loader=new j,this.originRegExp=new RegExp("^"+location.origin),this.depsStorage=a};k.prototype={load:function(a){var b,c=this.loader;return c.get(a)?c.get(a):(b=c.load(a).then(function(b){return this.updateDeps(a,b.import),b}.bind(this)),this.loadDeps(a),b)},getNormalizedHref:function(a){return a.replace(this.originRegExp,"")},updateDeps:function(a,b){var c=[].slice.call(b.querySelectorAll('link[rel="import"]')),d=c.map(function(a){return this.getNormalizedHref(a.href)}.bind(this));this.depsStorage.setDeps(a,d),d.forEach(function(a){this.load(a)}.bind(this))},loadDeps:function(a){var b=this.depsStorage.getDeps(a);b.forEach(function(a){this.load(a)}.bind(this))}},function(){function a(a,b){var c=b||document.body;a.triggers.forEach(function(b){j(b,a,c)})}function b(a,b){switch(a){case"added":return new h(m,b);case"proximity":return new p(m,b);case"node-proximity":return new i(m,b);case"mousemove-proximity":return new g(m,b);default:return new f(a,m,b)}}function e(a,c){return o.get(c)||o.set(c,{}),o.get(c)[a]||(o.get(c)[a]=b(a,c)),o.get(c)[a]}function j(a,b,c){var d=b.el;e(a.type,c).addTrigger({el:"string"==typeof d?c.querySelector(d):d,selector:b.selector,src:b.src,tagName:a.tagName,distance:a.distance})}var l=new d(localStorage),m=new k(l),n=new c(l),o=new WeakMap,p=function(a,b){this.root=b};p.prototype.addTrigger=function(a){var b=getComputedStyle(a.el);"visible"!==b.overflow||"static"===b.position?e("mousemove-proximity",this.root).addTrigger(a):e("node-proximity",this.root).addTrigger(a)},window.nmouse={prepare:a,loader:m,importer:n}}(),document.registerElement("nmouse-rule",{prototype:e.mix(Object.create(HTMLElement.prototype),{attachedCallback:function(){var a=[].slice.call(this.querySelectorAll("nmouse-trigger")).map(function(a){return{type:a.getAttribute("type"),tagName:a.getAttribute("tagName"),distance:a.getAttribute("distance")}}),b=e.getAncestry(this);nmouse.prepare({el:this.getAttribute("el"),selector:this.getAttribute("selector"),src:this.getAttribute("src"),triggers:a},b[b.length-1])}})}),document.registerElement("nmouse-deps",{prototype:e.mix(Object.create(HTMLElement.prototype),{attachedCallback:function(){nmouse.importer.importFromNode(this)}})})}({},function(){return this}());
//# sourceMappingURL=nmouse.js.map