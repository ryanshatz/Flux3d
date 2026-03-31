(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Ud=["incomingCall","skillTransfer","case","hangup","play","startOnHangup","input","menu","setVariable","queryModule","ifElse","voiceInput","getUserInfo","conferenceTransfer","getDigits","record","voiceMailTransfer","thirdPartyTransfer","lookupCRMRecord","crmUpdate","agentTransfer"];function Nd(n){const e=new DOMParser().parseFromString(n,"text/xml"),i=e.querySelector("parsererror");if(i)throw new Error("Invalid XML: "+i.textContent);const s=e.querySelector("ivrScript");if(!s)throw new Error("Not a valid Five9 IVR file: missing <ivrScript>");const r=Dt(s,"domainId"),a=s.querySelector(":scope > modules"),o=s.querySelector(":scope > modulesOnHangup"),c=[],l=[],h={};a&&$l(a,c,l,h,"main"),o&&$l(o,c,l,h,"onHangup");const u=zd(s),d=Bd(c,l);return{domainId:r,modules:c,edges:l,moduleMap:h,prompts:u,stats:d}}function $l(n,t,e,i,s){for(const r of n.children){const a=r.tagName;if(!Ud.includes(a))continue;const o=Fd(r,a,s);t.push(o),i[o.moduleId]=o;const c=Dt(r,"singleDescendant");c&&e.push({from:o.moduleId,to:c,type:"primary"});const l=Dt(r,"exceptionalDescendant");if(l&&l!==c&&e.push({from:o.moduleId,to:l,type:"exceptional"}),(a==="case"||a==="ifElse")&&o.data.branches)for(const h of o.data.branches)h.descendantId&&(e.find(d=>d.from===o.moduleId&&d.to===h.descendantId)||e.push({from:o.moduleId,to:h.descendantId,type:"branch",label:h.name}))}}function Fd(n,t,e){const i={moduleType:t,moduleId:Dt(n,"moduleId"),moduleName:Dt(n,"moduleName"),locationX:parseInt(Dt(n,"locationX")||"0"),locationY:parseInt(Dt(n,"locationY")||"0"),flow:e,ascendants:kd(n,"ascendants"),singleDescendant:Dt(n,"singleDescendant"),exceptionalDescendant:Dt(n,"exceptionalDescendant"),data:{}},s=n.querySelector(":scope > data");return s&&(i.data=Od(s,t)),i}function Od(n,t){const e={};switch(t){case"skillTransfer":e.maxQueueTime=bs(n,"maxQueueTime"),e.maxRingTime=bs(n,"maxRingTime"),e.placeOnBreakIfNoAnswer=Dt(n,"placeOnBreakIfNoAnswer")==="true",e.queueIfOnCall=Dt(n,"queueIfOnCall")==="true",e.onCallQueueTime=bs(n,"onCallQueueTime"),e.enableMusicOnHold=Dt(n,"enableMusicOnHold")==="true",e.vmTransferOnQueueTimeout=Dt(n,"vmTransferOnQueueTimeout")==="true",e.pauseBeforeTransfer=bs(n,"pauseBeforeTransfer"),e.clearDigitBuffer=Dt(n,"clearDigitBuffer")==="true";const i=n.querySelector(":scope > dispo");i&&(e.disposition={id:Dt(i,"id"),name:Dt(i,"name")});const s=n.querySelector("listOfSkillsEx");if(s){const d=s.querySelector("extrnalObj");d&&(e.skillName=Dt(d,"name"),e.skillId=Dt(d,"id"))}const r=n.querySelector("transferAlgorithm");r&&(e.algorithmType=Dt(r,"algorithmType"),e.statAlgorithmTimeWindow=Dt(r,"statAlgorithmTimeWindow")),e.priorityChangeType=Dt(n,"priorityChangeType");const a=n.querySelector("priorityChangeValue");if(a){const d=a.querySelector("integerValue");d&&(e.priorityChangeValue=bs(d,"value"))}break;case"case":e.branches=[];const o=n.querySelector("branches");if(o)for(const d of o.querySelectorAll(":scope > entry")){const f=Dt(d,"key"),_=d.querySelector("value");if(_){const g={name:f,descendantId:Dt(_,"desc"),conditions:[]},m=_.querySelector("conditions");if(m&&m.children.length>0){g.comparisonType=Dt(m,"comparisonType");const p=m.querySelector("leftOperand");p&&(g.leftOperand=Dt(p,"variableName")||"value");const b=m.querySelector("rightOperand");if(b){const y=b.querySelector("stringValue");y&&(g.rightValue=Dt(y,"value"))}}e.branches.push(g)}}break;case"hangup":const c=n.querySelector(":scope > dispo");c&&(e.disposition={id:Dt(c,"id"),name:Dt(c,"name")}),e.returnToCallingModule=Dt(n,"returnToCallingModule")==="true",e.overwriteDisposition=Dt(n,"overwriteDisposition")==="true";break;case"play":const l=n.querySelector(":scope > prompt");if(l){const d=l.querySelector("ttsPrompt");d&&(e.ttsXml=Dt(d,"xml"),e.promptTTSEnumed=Dt(d,"promptTTSEnumed")==="true"),e.interruptible=Dt(l,"interruptible")==="true"}const h=n.querySelector(":scope > dispo");h&&(e.disposition={id:Dt(h,"id"),name:Dt(h,"name")});break;case"ifElse":e.branches=[];const u=n.querySelector("branches");if(u)for(const d of u.querySelectorAll(":scope > entry")){const f=Dt(d,"key"),_=d.querySelector("value");if(_){const g={name:f,descendantId:Dt(_,"desc"),conditions:[]};e.branches.push(g)}}break}return e}function zd(n){const t={},e=n.querySelector("multiLanguagesPrompts");if(!e)return t;for(const i of e.querySelectorAll(":scope > entry")){const s=Dt(i,"key"),r=i.querySelector("value");r&&(t[s]={promptId:Dt(r,"promptId"),name:Dt(r,"name"),description:Dt(r,"description"),type:Dt(r,"type")})}return t}function Bd(n,t){const e=n.filter(s=>s.moduleType==="case").reduce((s,r)=>{const a=r.data.branches||[];return s+a.filter(o=>o.name!=="No Match").length},0),i=new Set;return n.forEach(s=>{s.data.skillName&&i.add(s.data.skillName)}),{totalModules:n.length,totalConnections:t.length,blockedANIs:e,skills:i.size,skillNames:[...i]}}function Dt(n,t){const e=n.querySelector(":scope > "+t);return e?e.textContent.trim():""}function kd(n,t){const e=n.querySelectorAll(":scope > "+t);return Array.from(e).map(i=>i.textContent.trim())}function bs(n,t){const e=Dt(n,t);return e?parseInt(e,10):0}function Hd(n){const t=n.split(`
`).filter(s=>s.trim());if(t.length<2)return{records:[],pathVolumes:{},moduleVolumes:{}};const e=Kl(t[0]),i=[];for(let s=1;s<t.length;s++){const r=Kl(t[s]),a={};e.forEach((o,c)=>{var l;a[o.trim()]=((l=r[c])==null?void 0:l.trim())||""}),i.push(a)}return Gd(i)}function Kl(n){const t=[];let e="",i=!1;for(let s=0;s<n.length;s++){const r=n[s];r==='"'?i=!i:r===","&&!i?(t.push(e),e=""):e+=r}return t.push(e),t}function Gd(n){const t={},e={},i={},s={};return n.forEach(r=>{const a=r.DISPOSITION||r.Disposition||r.disposition||"";a&&(s[a]=(s[a]||0)+1);const o=r.IVR_PATH||r["IVR Path"]||r.ivr_path||"";o&&(t[o]=(t[o]||0)+1);const c=r.SKILL||r.Skill||r.skill||"";if(c&&(e[c]=(e[c]||0)+1),a.toLowerCase().includes("abandon")){const l=parseFloat(r.QUEUE_TIME||r["Queue Time"]||"0");i[c]||(i[c]=[]),i[c].push(l)}}),{records:n,pathVolumes:t,moduleVolumes:e,dispositions:s,abandonData:i,totalCalls:n.length}}function Vd(n,t){const e={},i={},s=new Set,r=new Set;return n.forEach(a=>{switch(a.moduleType){case"incomingCall":e[a.moduleId]=1e4;break;case"case":e[a.moduleId]=9500;break;case"skillTransfer":e[a.moduleId]=8200,a.data.maxQueueTime>300&&s.add(a.moduleId);break;case"play":e[a.moduleId]=7500,r.add(a.moduleId);break;case"hangup":e[a.moduleId]=a.flow==="main"?500:7e3;break;default:e[a.moduleId]=5e3}}),t.forEach(a=>{const o=e[a.from]||1e3,c=e[a.to]||1e3,l=Math.min(o,c);i[`${a.from}->${a.to}`]=l}),{moduleVolumes:e,edgeVolumes:i,frictionModules:[...s],successModules:[...r],maxVolume:1e4}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const xl="172",In={ROTATE:0,DOLLY:1,PAN:2},ts={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Wd=0,jl=1,Xd=2,iu=1,Yd=2,Cn=3,ni=0,Ge=1,xe=2,Un=0,is=1,Si=2,Jl=3,Ql=4,qd=5,fi=100,Zd=101,$d=102,Kd=103,jd=104,Jd=200,Qd=201,tf=202,ef=203,yo=204,Mo=205,nf=206,sf=207,rf=208,af=209,of=210,lf=211,cf=212,hf=213,uf=214,So=0,bo=1,Eo=2,os=3,wo=4,To=5,Ao=6,Co=7,su=0,df=1,ff=2,Kn=0,ru=1,au=2,ou=3,yl=4,pf=5,lu=6,cu=7,hu=300,ls=301,cs=302,Ro=303,Po=304,da=306,Vs=1e3,_i=1001,Do=1002,un=1003,mf=1004,ur=1005,gn=1006,Sa=1007,gi=1008,On=1009,uu=1010,du=1011,Ws=1012,Ml=1013,bi=1014,Dn=1015,Nn=1016,Sl=1017,bl=1018,hs=1020,fu=35902,pu=1021,mu=1022,cn=1023,_u=1024,gu=1025,ss=1026,us=1027,vu=1028,El=1029,xu=1030,wl=1031,Tl=1033,Yr=33776,qr=33777,Zr=33778,$r=33779,Lo=35840,Io=35841,Uo=35842,No=35843,Fo=36196,Oo=37492,zo=37496,Bo=37808,ko=37809,Ho=37810,Go=37811,Vo=37812,Wo=37813,Xo=37814,Yo=37815,qo=37816,Zo=37817,$o=37818,Ko=37819,jo=37820,Jo=37821,Kr=36492,Qo=36494,tl=36495,yu=36283,el=36284,nl=36285,il=36286,_f=3200,gf=3201,Mu=0,vf=1,Yn="",Qe="srgb",ds="srgb-linear",ta="linear",te="srgb",Li=7680,tc=519,xf=512,yf=513,Mf=514,Su=515,Sf=516,bf=517,Ef=518,wf=519,sl=35044,ec="300 es",Ln=2e3,ea=2001;class Ri{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const De=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],jr=Math.PI/180,rl=180/Math.PI;function jn(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(De[n&255]+De[n>>8&255]+De[n>>16&255]+De[n>>24&255]+"-"+De[t&255]+De[t>>8&255]+"-"+De[t>>16&15|64]+De[t>>24&255]+"-"+De[e&63|128]+De[e>>8&255]+"-"+De[e>>16&255]+De[e>>24&255]+De[i&255]+De[i>>8&255]+De[i>>16&255]+De[i>>24&255]).toLowerCase()}function Ft(n,t,e){return Math.max(t,Math.min(e,n))}function Tf(n,t){return(n%t+t)%t}function ba(n,t,e){return(1-e)*n+e*t}function mn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ee(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Af={DEG2RAD:jr};class tt{constructor(t=0,e=0){tt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Ft(this.x,t.x,e.x),this.y=Ft(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Ft(this.x,t,e),this.y=Ft(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ft(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Ft(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class It{constructor(t,e,i,s,r,a,o,c,l){It.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l)}set(t,e,i,s,r,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],h=i[4],u=i[7],d=i[2],f=i[5],_=i[8],g=s[0],m=s[3],p=s[6],b=s[1],y=s[4],v=s[7],C=s[2],T=s[5],w=s[8];return r[0]=a*g+o*b+c*C,r[3]=a*m+o*y+c*T,r[6]=a*p+o*v+c*w,r[1]=l*g+h*b+u*C,r[4]=l*m+h*y+u*T,r[7]=l*p+h*v+u*w,r[2]=d*g+f*b+_*C,r[5]=d*m+f*y+_*T,r[8]=d*p+f*v+_*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-i*r*h+i*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,_=e*u+i*d+s*f;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return t[0]=u*g,t[1]=(s*l-h*i)*g,t[2]=(o*i-s*a)*g,t[3]=d*g,t[4]=(h*e-s*c)*g,t[5]=(s*r-o*e)*g,t[6]=f*g,t[7]=(i*c-l*e)*g,t[8]=(a*e-i*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Ea.makeScale(t,e)),this}rotate(t){return this.premultiply(Ea.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ea.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ea=new It;function bu(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function na(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Cf(){const n=na("canvas");return n.style.display="block",n}const nc={};function Qi(n){n in nc||(nc[n]=!0,console.warn(n))}function Rf(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}function Pf(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Df(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ic=new It().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),sc=new It().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Lf(){const n={enabled:!0,workingColorSpace:ds,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===te&&(s.r=Fn(s.r),s.g=Fn(s.g),s.b=Fn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===te&&(s.r=rs(s.r),s.g=rs(s.g),s.b=rs(s.b))),s},fromWorkingColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},toWorkingColorSpace:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Yn?ta:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ds]:{primaries:t,whitePoint:i,transfer:ta,toXYZ:ic,fromXYZ:sc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Qe},outputColorSpaceConfig:{drawingBufferColorSpace:Qe}},[Qe]:{primaries:t,whitePoint:i,transfer:te,toXYZ:ic,fromXYZ:sc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Qe}}}),n}const qt=Lf();function Fn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function rs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ii;class If{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ii===void 0&&(Ii=na("canvas")),Ii.width=t.width,Ii.height=t.height;const i=Ii.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Ii}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=na("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Fn(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Fn(e[i]/255)*255):e[i]=Fn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Uf=0;class Eu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Uf++}),this.uuid=jn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(wa(s[a].image)):r.push(wa(s[a]))}else r=wa(s);i.url=r}return e||(t.images[this.uuid]=i),i}}function wa(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?If.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Nf=0;class ze extends Ri{constructor(t=ze.DEFAULT_IMAGE,e=ze.DEFAULT_MAPPING,i=_i,s=_i,r=gn,a=gi,o=cn,c=On,l=ze.DEFAULT_ANISOTROPY,h=Yn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Nf++}),this.uuid=jn(),this.name="",this.source=new Eu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new It,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==hu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Vs:t.x=t.x-Math.floor(t.x);break;case _i:t.x=t.x<0?0:1;break;case Do:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Vs:t.y=t.y-Math.floor(t.y);break;case _i:t.y=t.y<0?0:1;break;case Do:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ze.DEFAULT_IMAGE=null;ze.DEFAULT_MAPPING=hu;ze.DEFAULT_ANISOTROPY=1;class ie{constructor(t=0,e=0,i=0,s=1){ie.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],_=c[9],g=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-g)<.01&&Math.abs(_-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+g)<.1&&Math.abs(_+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(l+1)/2,v=(f+1)/2,C=(p+1)/2,T=(h+d)/4,w=(u+g)/4,P=(_+m)/4;return y>v&&y>C?y<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(y),s=T/i,r=w/i):v>C?v<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),i=T/s,r=P/s):C<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),i=w/r,s=P/r),this.set(i,s,r,e),this}let b=Math.sqrt((m-_)*(m-_)+(u-g)*(u-g)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-_)/b,this.y=(u-g)/b,this.z=(d-h)/b,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Ft(this.x,t.x,e.x),this.y=Ft(this.y,t.y,e.y),this.z=Ft(this.z,t.z,e.z),this.w=Ft(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Ft(this.x,t,e),this.y=Ft(this.y,t,e),this.z=Ft(this.z,t,e),this.w=Ft(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ft(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ff extends Ri{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ie(0,0,t,e),this.scissorTest=!1,this.viewport=new ie(0,0,t,e);const s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const r=new ze(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const e=Object.assign({},t.texture.image);return this.texture.source=new Eu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class dn extends Ff{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class wu extends ze{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=un,this.minFilter=un,this.wrapR=_i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Of extends ze{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=un,this.minFilter=un,this.wrapR=_i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ei{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3];const d=r[a+0],f=r[a+1],_=r[a+2],g=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=_,t[e+3]=g;return}if(u!==g||c!==d||l!==f||h!==_){let m=1-o;const p=c*d+l*f+h*_+u*g,b=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const C=Math.sqrt(y),T=Math.atan2(C,p*b);m=Math.sin(m*T)/C,o=Math.sin(o*T)/C}const v=o*b;if(c=c*m+d*v,l=l*m+f*v,h=h*m+_*v,u=u*m+g*v,m===1-o){const C=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=C,l*=C,h*=C,u*=C}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,a){const o=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=r[a],d=r[a+1],f=r[a+2],_=r[a+3];return t[e]=o*_+h*u+c*f-l*d,t[e+1]=c*_+h*d+l*u-o*f,t[e+2]=l*_+h*f+o*d-c*u,t[e+3]=h*_-o*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(s/2),u=o(r/2),d=c(i/2),f=c(s/2),_=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*_,this._y=l*f*u-d*h*_,this._z=l*h*_+d*f*u,this._w=l*h*u-d*f*_;break;case"YXZ":this._x=d*h*u+l*f*_,this._y=l*f*u-d*h*_,this._z=l*h*_-d*f*u,this._w=l*h*u+d*f*_;break;case"ZXY":this._x=d*h*u-l*f*_,this._y=l*f*u+d*h*_,this._z=l*h*_+d*f*u,this._w=l*h*u-d*f*_;break;case"ZYX":this._x=d*h*u-l*f*_,this._y=l*f*u+d*h*_,this._z=l*h*_-d*f*u,this._w=l*h*u+d*f*_;break;case"YZX":this._x=d*h*u+l*f*_,this._y=l*f*u+d*h*_,this._z=l*h*_-d*f*u,this._w=l*h*u-d*f*_;break;case"XZY":this._x=d*h*u-l*f*_,this._y=l*f*u-d*h*_,this._z=l*h*_+d*f*u,this._w=l*h*u+d*f*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=i+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(i>o&&i>u){const f=2*Math.sqrt(1+i-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-i-u);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-i-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ft(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-i*l,this._z=r*h+a*l+i*c-s*o,this._w=a*h-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+i*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*i+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,i=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(rc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(rc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*i),h=2*(o*e-r*s),u=2*(r*i-a*e);return this.x=e+c*l+a*u-o*h,this.y=i+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Ft(this.x,t.x,e.x),this.y=Ft(this.y,t.y,e.y),this.z=Ft(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Ft(this.x,t,e),this.y=Ft(this.y,t,e),this.z=Ft(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ft(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Ta.copy(this).projectOnVector(t),this.sub(Ta)}reflect(t){return this.sub(Ta.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Ft(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ta=new R,rc=new Ei;class er{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(an.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(an.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=an.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,an):an.fromBufferAttribute(r,a),an.applyMatrix4(t.matrixWorld),this.expandByPoint(an);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),dr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),dr.copy(i.boundingBox)),dr.applyMatrix4(t.matrixWorld),this.union(dr)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,an),an.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Es),fr.subVectors(this.max,Es),Ui.subVectors(t.a,Es),Ni.subVectors(t.b,Es),Fi.subVectors(t.c,Es),Bn.subVectors(Ni,Ui),kn.subVectors(Fi,Ni),ai.subVectors(Ui,Fi);let e=[0,-Bn.z,Bn.y,0,-kn.z,kn.y,0,-ai.z,ai.y,Bn.z,0,-Bn.x,kn.z,0,-kn.x,ai.z,0,-ai.x,-Bn.y,Bn.x,0,-kn.y,kn.x,0,-ai.y,ai.x,0];return!Aa(e,Ui,Ni,Fi,fr)||(e=[1,0,0,0,1,0,0,0,1],!Aa(e,Ui,Ni,Fi,fr))?!1:(pr.crossVectors(Bn,kn),e=[pr.x,pr.y,pr.z],Aa(e,Ui,Ni,Fi,fr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,an).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(an).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Sn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Sn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Sn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Sn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Sn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Sn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Sn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Sn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Sn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Sn=[new R,new R,new R,new R,new R,new R,new R,new R],an=new R,dr=new er,Ui=new R,Ni=new R,Fi=new R,Bn=new R,kn=new R,ai=new R,Es=new R,fr=new R,pr=new R,oi=new R;function Aa(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){oi.fromArray(n,r);const o=s.x*Math.abs(oi.x)+s.y*Math.abs(oi.y)+s.z*Math.abs(oi.z),c=t.dot(oi),l=e.dot(oi),h=i.dot(oi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const zf=new er,ws=new R,Ca=new R;class nr{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):zf.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ws.subVectors(t,this.center);const e=ws.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(ws,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ca.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ws.copy(t.center).add(Ca)),this.expandByPoint(ws.copy(t.center).sub(Ca))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const bn=new R,Ra=new R,mr=new R,Hn=new R,Pa=new R,_r=new R,Da=new R;class ir{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,bn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=bn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(bn.copy(this.origin).addScaledVector(this.direction,e),bn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Ra.copy(t).add(e).multiplyScalar(.5),mr.copy(e).sub(t).normalize(),Hn.copy(this.origin).sub(Ra);const r=t.distanceTo(e)*.5,a=-this.direction.dot(mr),o=Hn.dot(this.direction),c=-Hn.dot(mr),l=Hn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,_;if(h>0)if(u=a*c-o,d=a*o-c,_=r*h,u>=0)if(d>=-_)if(d<=_){const g=1/h;u*=g,d*=g,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-_?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=_?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ra).addScaledVector(mr,d),f}intersectSphere(t,e){bn.subVectors(t.center,this.origin);const i=bn.dot(this.direction),s=bn.dot(bn)-i*i,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,bn)!==null}intersectTriangle(t,e,i,s,r){Pa.subVectors(e,t),_r.subVectors(i,t),Da.crossVectors(Pa,_r);let a=this.direction.dot(Da),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Hn.subVectors(this.origin,t);const c=o*this.direction.dot(_r.crossVectors(Hn,_r));if(c<0)return null;const l=o*this.direction.dot(Pa.cross(Hn));if(l<0||c+l>a)return null;const h=-o*Hn.dot(Da);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Jt{constructor(t,e,i,s,r,a,o,c,l,h,u,d,f,_,g,m){Jt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l,h,u,d,f,_,g,m)}set(t,e,i,s,r,a,o,c,l,h,u,d,f,_,g,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=_,p[11]=g,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Jt().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Oi.setFromMatrixColumn(t,0).length(),r=1/Oi.setFromMatrixColumn(t,1).length(),a=1/Oi.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=a*h,f=a*u,_=o*h,g=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+_*l,e[5]=d-g*l,e[9]=-o*c,e[2]=g-d*l,e[6]=_+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,_=l*h,g=l*u;e[0]=d+g*o,e[4]=_*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-_,e[6]=g+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,_=l*h,g=l*u;e[0]=d-g*o,e[4]=-a*u,e[8]=_+f*o,e[1]=f+_*o,e[5]=a*h,e[9]=g-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,_=o*h,g=o*u;e[0]=c*h,e[4]=_*l-f,e[8]=d*l+g,e[1]=c*u,e[5]=g*l+d,e[9]=f*l-_,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,_=o*c,g=o*l;e[0]=c*h,e[4]=g-d*u,e[8]=_*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*u+_,e[10]=d-g*u}else if(t.order==="XZY"){const d=a*c,f=a*l,_=o*c,g=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+g,e[5]=a*h,e[9]=f*u-_,e[2]=_*u-f,e[6]=o*h,e[10]=g*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Bf,t,kf)}lookAt(t,e,i){const s=this.elements;return We.subVectors(t,e),We.lengthSq()===0&&(We.z=1),We.normalize(),Gn.crossVectors(i,We),Gn.lengthSq()===0&&(Math.abs(i.z)===1?We.x+=1e-4:We.z+=1e-4,We.normalize(),Gn.crossVectors(i,We)),Gn.normalize(),gr.crossVectors(We,Gn),s[0]=Gn.x,s[4]=gr.x,s[8]=We.x,s[1]=Gn.y,s[5]=gr.y,s[9]=We.y,s[2]=Gn.z,s[6]=gr.z,s[10]=We.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],h=i[1],u=i[5],d=i[9],f=i[13],_=i[2],g=i[6],m=i[10],p=i[14],b=i[3],y=i[7],v=i[11],C=i[15],T=s[0],w=s[4],P=s[8],M=s[12],x=s[1],D=s[5],F=s[9],O=s[13],H=s[2],X=s[6],W=s[10],K=s[14],V=s[3],rt=s[7],ft=s[11],Mt=s[15];return r[0]=a*T+o*x+c*H+l*V,r[4]=a*w+o*D+c*X+l*rt,r[8]=a*P+o*F+c*W+l*ft,r[12]=a*M+o*O+c*K+l*Mt,r[1]=h*T+u*x+d*H+f*V,r[5]=h*w+u*D+d*X+f*rt,r[9]=h*P+u*F+d*W+f*ft,r[13]=h*M+u*O+d*K+f*Mt,r[2]=_*T+g*x+m*H+p*V,r[6]=_*w+g*D+m*X+p*rt,r[10]=_*P+g*F+m*W+p*ft,r[14]=_*M+g*O+m*K+p*Mt,r[3]=b*T+y*x+v*H+C*V,r[7]=b*w+y*D+v*X+C*rt,r[11]=b*P+y*F+v*W+C*ft,r[15]=b*M+y*O+v*K+C*Mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],_=t[3],g=t[7],m=t[11],p=t[15];return _*(+r*c*u-s*l*u-r*o*d+i*l*d+s*o*f-i*c*f)+g*(+e*c*f-e*l*d+r*a*d-s*a*f+s*l*h-r*c*h)+m*(+e*l*u-e*o*f-r*a*u+i*a*f+r*o*h-i*l*h)+p*(-s*o*h-e*c*u+e*o*d+s*a*u-i*a*d+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],_=t[12],g=t[13],m=t[14],p=t[15],b=u*m*l-g*d*l+g*c*f-o*m*f-u*c*p+o*d*p,y=_*d*l-h*m*l-_*c*f+a*m*f+h*c*p-a*d*p,v=h*g*l-_*u*l+_*o*f-a*g*f-h*o*p+a*u*p,C=_*u*c-h*g*c-_*o*d+a*g*d+h*o*m-a*u*m,T=e*b+i*y+s*v+r*C;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/T;return t[0]=b*w,t[1]=(g*d*r-u*m*r-g*s*f+i*m*f+u*s*p-i*d*p)*w,t[2]=(o*m*r-g*c*r+g*s*l-i*m*l-o*s*p+i*c*p)*w,t[3]=(u*c*r-o*d*r-u*s*l+i*d*l+o*s*f-i*c*f)*w,t[4]=y*w,t[5]=(h*m*r-_*d*r+_*s*f-e*m*f-h*s*p+e*d*p)*w,t[6]=(_*c*r-a*m*r-_*s*l+e*m*l+a*s*p-e*c*p)*w,t[7]=(a*d*r-h*c*r+h*s*l-e*d*l-a*s*f+e*c*f)*w,t[8]=v*w,t[9]=(_*u*r-h*g*r-_*i*f+e*g*f+h*i*p-e*u*p)*w,t[10]=(a*g*r-_*o*r+_*i*l-e*g*l-a*i*p+e*o*p)*w,t[11]=(h*o*r-a*u*r-h*i*l+e*u*l+a*i*f-e*o*f)*w,t[12]=C*w,t[13]=(h*g*s-_*u*s+_*i*d-e*g*d-h*i*m+e*u*m)*w,t[14]=(_*o*s-a*g*s-_*i*c+e*g*c+a*i*m-e*o*m)*w,t[15]=(a*u*s-h*o*s+h*i*c-e*u*c-a*i*d+e*o*d)*w,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+i,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,_=r*u,g=a*h,m=a*u,p=o*u,b=c*l,y=c*h,v=c*u,C=i.x,T=i.y,w=i.z;return s[0]=(1-(g+p))*C,s[1]=(f+v)*C,s[2]=(_-y)*C,s[3]=0,s[4]=(f-v)*T,s[5]=(1-(d+p))*T,s[6]=(m+b)*T,s[7]=0,s[8]=(_+y)*w,s[9]=(m-b)*w,s[10]=(1-(d+g))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let r=Oi.set(s[0],s[1],s[2]).length();const a=Oi.set(s[4],s[5],s[6]).length(),o=Oi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],on.copy(this);const l=1/r,h=1/a,u=1/o;return on.elements[0]*=l,on.elements[1]*=l,on.elements[2]*=l,on.elements[4]*=h,on.elements[5]*=h,on.elements[6]*=h,on.elements[8]*=u,on.elements[9]*=u,on.elements[10]*=u,e.setFromRotationMatrix(on),i.x=r,i.y=a,i.z=o,this}makePerspective(t,e,i,s,r,a,o=Ln){const c=this.elements,l=2*r/(e-t),h=2*r/(i-s),u=(e+t)/(e-t),d=(i+s)/(i-s);let f,_;if(o===Ln)f=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===ea)f=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=Ln){const c=this.elements,l=1/(e-t),h=1/(i-s),u=1/(a-r),d=(e+t)*l,f=(i+s)*h;let _,g;if(o===Ln)_=(a+r)*u,g=-2*u;else if(o===ea)_=r*u,g=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=g,c[14]=-_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Oi=new R,on=new Jt,Bf=new R(0,0,0),kf=new R(1,1,1),Gn=new R,gr=new R,We=new R,ac=new Jt,oc=new Ei;class yn{constructor(t=0,e=0,i=0,s=yn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ft(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ft(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ft(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Ft(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return ac.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ac,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return oc.setFromEuler(this),this.setFromQuaternion(oc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yn.DEFAULT_ORDER="XYZ";class Al{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Hf=0;const lc=new R,zi=new Ei,En=new Jt,vr=new R,Ts=new R,Gf=new R,Vf=new Ei,cc=new R(1,0,0),hc=new R(0,1,0),uc=new R(0,0,1),dc={type:"added"},Wf={type:"removed"},Bi={type:"childadded",child:null},La={type:"childremoved",child:null};class pe extends Ri{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hf++}),this.uuid=jn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=pe.DEFAULT_UP.clone();const t=new R,e=new yn,i=new Ei,s=new R(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Jt},normalMatrix:{value:new It}}),this.matrix=new Jt,this.matrixWorld=new Jt,this.matrixAutoUpdate=pe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Al,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return zi.setFromAxisAngle(t,e),this.quaternion.multiply(zi),this}rotateOnWorldAxis(t,e){return zi.setFromAxisAngle(t,e),this.quaternion.premultiply(zi),this}rotateX(t){return this.rotateOnAxis(cc,t)}rotateY(t){return this.rotateOnAxis(hc,t)}rotateZ(t){return this.rotateOnAxis(uc,t)}translateOnAxis(t,e){return lc.copy(t).applyQuaternion(this.quaternion),this.position.add(lc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(cc,t)}translateY(t){return this.translateOnAxis(hc,t)}translateZ(t){return this.translateOnAxis(uc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(En.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?vr.copy(t):vr.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Ts.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?En.lookAt(Ts,vr,this.up):En.lookAt(vr,Ts,this.up),this.quaternion.setFromRotationMatrix(En),s&&(En.extractRotation(s.matrixWorld),zi.setFromRotationMatrix(En),this.quaternion.premultiply(zi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(dc),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Wf),La.child=t,this.dispatchEvent(La),La.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),En.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),En.multiply(t.parent.matrixWorld)),t.applyMatrix4(En),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(dc),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ts,t,Gf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ts,Vf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),_=a(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),_.length>0&&(i.nodes=_)}return i.object=s,i;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}pe.DEFAULT_UP=new R(0,1,0);pe.DEFAULT_MATRIX_AUTO_UPDATE=!0;pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ln=new R,wn=new R,Ia=new R,Tn=new R,ki=new R,Hi=new R,fc=new R,Ua=new R,Na=new R,Fa=new R,Oa=new ie,za=new ie,Ba=new ie;class tn{constructor(t=new R,e=new R,i=new R){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),ln.subVectors(t,e),s.cross(ln);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){ln.subVectors(s,e),wn.subVectors(i,e),Ia.subVectors(t,e);const a=ln.dot(ln),o=ln.dot(wn),c=ln.dot(Ia),l=wn.dot(wn),h=wn.dot(Ia),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,_=(a*h-o*c)*d;return r.set(1-f-_,_,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Tn)===null?!1:Tn.x>=0&&Tn.y>=0&&Tn.x+Tn.y<=1}static getInterpolation(t,e,i,s,r,a,o,c){return this.getBarycoord(t,e,i,s,Tn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Tn.x),c.addScaledVector(a,Tn.y),c.addScaledVector(o,Tn.z),c)}static getInterpolatedAttribute(t,e,i,s,r,a){return Oa.setScalar(0),za.setScalar(0),Ba.setScalar(0),Oa.fromBufferAttribute(t,e),za.fromBufferAttribute(t,i),Ba.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Oa,r.x),a.addScaledVector(za,r.y),a.addScaledVector(Ba,r.z),a}static isFrontFacing(t,e,i,s){return ln.subVectors(i,e),wn.subVectors(t,e),ln.cross(wn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ln.subVectors(this.c,this.b),wn.subVectors(this.a,this.b),ln.cross(wn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return tn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return tn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return tn.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return tn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return tn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,r=this.c;let a,o;ki.subVectors(s,i),Hi.subVectors(r,i),Ua.subVectors(t,i);const c=ki.dot(Ua),l=Hi.dot(Ua);if(c<=0&&l<=0)return e.copy(i);Na.subVectors(t,s);const h=ki.dot(Na),u=Hi.dot(Na);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(i).addScaledVector(ki,a);Fa.subVectors(t,r);const f=ki.dot(Fa),_=Hi.dot(Fa);if(_>=0&&f<=_)return e.copy(r);const g=f*l-c*_;if(g<=0&&l>=0&&_<=0)return o=l/(l-_),e.copy(i).addScaledVector(Hi,o);const m=h*_-f*u;if(m<=0&&u-h>=0&&f-_>=0)return fc.subVectors(r,s),o=(u-h)/(u-h+(f-_)),e.copy(s).addScaledVector(fc,o);const p=1/(m+g+d);return a=g*p,o=d*p,e.copy(i).addScaledVector(ki,a).addScaledVector(Hi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Tu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vn={h:0,s:0,l:0},xr={h:0,s:0,l:0};function ka(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ut{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,qt.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=qt.workingColorSpace){return this.r=t,this.g=e,this.b=i,qt.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=qt.workingColorSpace){if(t=Tf(t,1),e=Ft(e,0,1),i=Ft(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=ka(a,r,t+1/3),this.g=ka(a,r,t),this.b=ka(a,r,t-1/3)}return qt.toWorkingColorSpace(this,s),this}setStyle(t,e=Qe){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Qe){const i=Tu[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Fn(t.r),this.g=Fn(t.g),this.b=Fn(t.b),this}copyLinearToSRGB(t){return this.r=rs(t.r),this.g=rs(t.g),this.b=rs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Qe){return qt.fromWorkingColorSpace(Le.copy(this),t),Math.round(Ft(Le.r*255,0,255))*65536+Math.round(Ft(Le.g*255,0,255))*256+Math.round(Ft(Le.b*255,0,255))}getHexString(t=Qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=qt.workingColorSpace){qt.fromWorkingColorSpace(Le.copy(this),e);const i=Le.r,s=Le.g,r=Le.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=qt.workingColorSpace){return qt.fromWorkingColorSpace(Le.copy(this),e),t.r=Le.r,t.g=Le.g,t.b=Le.b,t}getStyle(t=Qe){qt.fromWorkingColorSpace(Le.copy(this),t);const e=Le.r,i=Le.g,s=Le.b;return t!==Qe?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Vn),this.setHSL(Vn.h+t,Vn.s+e,Vn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Vn),t.getHSL(xr);const i=ba(Vn.h,xr.h,e),s=ba(Vn.s,xr.s,e),r=ba(Vn.l,xr.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Le=new ut;ut.NAMES=Tu;let Xf=0;class ii extends Ri{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=jn(),this.name="",this.type="Material",this.blending=is,this.side=ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=yo,this.blendDst=Mo,this.blendEquation=fi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ut(0,0,0),this.blendAlpha=0,this.depthFunc=os,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Li,this.stencilZFail=Li,this.stencilZPass=Li,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==is&&(i.blending=this.blending),this.side!==ni&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==yo&&(i.blendSrc=this.blendSrc),this.blendDst!==Mo&&(i.blendDst=this.blendDst),this.blendEquation!==fi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==os&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==tc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Li&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Li&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Li&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class we extends ii{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ut(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.combine=su,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const _e=new R,yr=new tt;class Te{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=sl,this.updateRanges=[],this.gpuType=Dn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)yr.fromBufferAttribute(this,e),yr.applyMatrix3(t),this.setXY(e,yr.x,yr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)_e.fromBufferAttribute(this,e),_e.applyMatrix3(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)_e.fromBufferAttribute(this,e),_e.applyMatrix4(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)_e.fromBufferAttribute(this,e),_e.applyNormalMatrix(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)_e.fromBufferAttribute(this,e),_e.transformDirection(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=mn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ee(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=mn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=mn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=mn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=mn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array),s=ee(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array),s=ee(s,this.array),r=ee(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==sl&&(t.usage=this.usage),t}}class Au extends Te{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Cu extends Te{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Vt extends Te{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Yf=0;const Je=new Jt,Ha=new pe,Gi=new R,Xe=new er,As=new er,Se=new R;class he extends Ri{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Yf++}),this.uuid=jn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(bu(t)?Cu:Au)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new It().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Je.makeRotationFromQuaternion(t),this.applyMatrix4(Je),this}rotateX(t){return Je.makeRotationX(t),this.applyMatrix4(Je),this}rotateY(t){return Je.makeRotationY(t),this.applyMatrix4(Je),this}rotateZ(t){return Je.makeRotationZ(t),this.applyMatrix4(Je),this}translate(t,e,i){return Je.makeTranslation(t,e,i),this.applyMatrix4(Je),this}scale(t,e,i){return Je.makeScale(t,e,i),this.applyMatrix4(Je),this}lookAt(t){return Ha.lookAt(t),Ha.updateMatrix(),this.applyMatrix4(Ha.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Gi).negate(),this.translate(Gi.x,Gi.y,Gi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Vt(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new er);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const r=e[i];Xe.setFromBufferAttribute(r),this.morphTargetsRelative?(Se.addVectors(this.boundingBox.min,Xe.min),this.boundingBox.expandByPoint(Se),Se.addVectors(this.boundingBox.max,Xe.max),this.boundingBox.expandByPoint(Se)):(this.boundingBox.expandByPoint(Xe.min),this.boundingBox.expandByPoint(Xe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new nr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const i=this.boundingSphere.center;if(Xe.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];As.setFromBufferAttribute(o),this.morphTargetsRelative?(Se.addVectors(Xe.min,As.min),Xe.expandByPoint(Se),Se.addVectors(Xe.max,As.max),Xe.expandByPoint(Se)):(Xe.expandByPoint(As.min),Xe.expandByPoint(As.max))}Xe.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)Se.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Se));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Se.fromBufferAttribute(o,l),c&&(Gi.fromBufferAttribute(t,l),Se.add(Gi)),s=Math.max(s,i.distanceToSquared(Se))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Te(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let P=0;P<i.count;P++)o[P]=new R,c[P]=new R;const l=new R,h=new R,u=new R,d=new tt,f=new tt,_=new tt,g=new R,m=new R;function p(P,M,x){l.fromBufferAttribute(i,P),h.fromBufferAttribute(i,M),u.fromBufferAttribute(i,x),d.fromBufferAttribute(r,P),f.fromBufferAttribute(r,M),_.fromBufferAttribute(r,x),h.sub(l),u.sub(l),f.sub(d),_.sub(d);const D=1/(f.x*_.y-_.x*f.y);isFinite(D)&&(g.copy(h).multiplyScalar(_.y).addScaledVector(u,-f.y).multiplyScalar(D),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-_.x).multiplyScalar(D),o[P].add(g),o[M].add(g),o[x].add(g),c[P].add(m),c[M].add(m),c[x].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let P=0,M=b.length;P<M;++P){const x=b[P],D=x.start,F=x.count;for(let O=D,H=D+F;O<H;O+=3)p(t.getX(O+0),t.getX(O+1),t.getX(O+2))}const y=new R,v=new R,C=new R,T=new R;function w(P){C.fromBufferAttribute(s,P),T.copy(C);const M=o[P];y.copy(M),y.sub(C.multiplyScalar(C.dot(M))).normalize(),v.crossVectors(T,M);const D=v.dot(c[P])<0?-1:1;a.setXYZW(P,y.x,y.y,y.z,D)}for(let P=0,M=b.length;P<M;++P){const x=b[P],D=x.start,F=x.count;for(let O=D,H=D+F;O<H;O+=3)w(t.getX(O+0)),w(t.getX(O+1)),w(t.getX(O+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Te(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new R,r=new R,a=new R,o=new R,c=new R,l=new R,h=new R,u=new R;if(t)for(let d=0,f=t.count;d<f;d+=3){const _=t.getX(d+0),g=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,_),r.fromBufferAttribute(e,g),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),l.fromBufferAttribute(i,m),o.add(h),c.add(h),l.add(h),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(g,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Se.fromBufferAttribute(t,e),Se.normalize(),t.setXYZ(e,Se.x,Se.y,Se.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,_=0;for(let g=0,m=c.length;g<m;g++){o.isInterleavedBufferAttribute?f=c[g]*o.data.stride+o.offset:f=c[g]*h;for(let p=0;p<h;p++)d[_++]=l[f++]}return new Te(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new he,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,i);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,i);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const pc=new Jt,li=new ir,Mr=new nr,mc=new R,Sr=new R,br=new R,Er=new R,Ga=new R,wr=new R,_c=new R,Tr=new R;class ht extends pe{constructor(t=new he,e=new we){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){wr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&(Ga.fromBufferAttribute(u,t),a?wr.addScaledVector(Ga,h):wr.addScaledVector(Ga.sub(e),h))}e.add(wr)}return e}raycast(t,e){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Mr.copy(i.boundingSphere),Mr.applyMatrix4(r),li.copy(t.ray).recast(t.near),!(Mr.containsPoint(li.origin)===!1&&(li.intersectSphere(Mr,mc)===null||li.origin.distanceToSquared(mc)>(t.far-t.near)**2))&&(pc.copy(r).invert(),li.copy(t.ray).applyMatrix4(pc),!(i.boundingBox!==null&&li.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,li)))}_computeIntersections(t,e,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,g=d.length;_<g;_++){const m=d[_],p=a[m.materialIndex],b=Math.max(m.start,f.start),y=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let v=b,C=y;v<C;v+=3){const T=o.getX(v),w=o.getX(v+1),P=o.getX(v+2);s=Ar(this,p,t,i,l,h,u,T,w,P),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const _=Math.max(0,f.start),g=Math.min(o.count,f.start+f.count);for(let m=_,p=g;m<p;m+=3){const b=o.getX(m),y=o.getX(m+1),v=o.getX(m+2);s=Ar(this,a,t,i,l,h,u,b,y,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let _=0,g=d.length;_<g;_++){const m=d[_],p=a[m.materialIndex],b=Math.max(m.start,f.start),y=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let v=b,C=y;v<C;v+=3){const T=v,w=v+1,P=v+2;s=Ar(this,p,t,i,l,h,u,T,w,P),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const _=Math.max(0,f.start),g=Math.min(c.count,f.start+f.count);for(let m=_,p=g;m<p;m+=3){const b=m,y=m+1,v=m+2;s=Ar(this,a,t,i,l,h,u,b,y,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function qf(n,t,e,i,s,r,a,o){let c;if(t.side===Ge?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,t.side===ni,o),c===null)return null;Tr.copy(o),Tr.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Tr);return l<e.near||l>e.far?null:{distance:l,point:Tr.clone(),object:n}}function Ar(n,t,e,i,s,r,a,o,c,l){n.getVertexPosition(o,Sr),n.getVertexPosition(c,br),n.getVertexPosition(l,Er);const h=qf(n,t,e,i,Sr,br,Er,_c);if(h){const u=new R;tn.getBarycoord(_c,Sr,br,Er,u),s&&(h.uv=tn.getInterpolatedAttribute(s,o,c,l,u,new tt)),r&&(h.uv1=tn.getInterpolatedAttribute(r,o,c,l,u,new tt)),a&&(h.normal=tn.getInterpolatedAttribute(a,o,c,l,u,new R),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new R,materialIndex:0};tn.getNormal(Sr,br,Er,d.normal),h.face=d,h.barycoord=u}return h}class hn extends he{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;_("z","y","x",-1,-1,i,e,t,a,r,0),_("z","y","x",1,-1,i,e,-t,a,r,1),_("x","z","y",1,1,t,i,e,s,a,2),_("x","z","y",1,-1,t,i,-e,s,a,3),_("x","y","z",1,-1,t,e,i,s,r,4),_("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new Vt(l,3)),this.setAttribute("normal",new Vt(h,3)),this.setAttribute("uv",new Vt(u,2));function _(g,m,p,b,y,v,C,T,w,P,M){const x=v/w,D=C/P,F=v/2,O=C/2,H=T/2,X=w+1,W=P+1;let K=0,V=0;const rt=new R;for(let ft=0;ft<W;ft++){const Mt=ft*D-O;for(let Ot=0;Ot<X;Ot++){const se=Ot*x-F;rt[g]=se*b,rt[m]=Mt*y,rt[p]=H,l.push(rt.x,rt.y,rt.z),rt[g]=0,rt[m]=0,rt[p]=T>0?1:-1,h.push(rt.x,rt.y,rt.z),u.push(Ot/w),u.push(1-ft/P),K+=1}}for(let ft=0;ft<P;ft++)for(let Mt=0;Mt<w;Mt++){const Ot=d+Mt+X*ft,se=d+Mt+X*(ft+1),q=d+(Mt+1)+X*(ft+1),et=d+(Mt+1)+X*ft;c.push(Ot,se,et),c.push(se,q,et),V+=6}o.addGroup(f,V,M),f+=V,d+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function fs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Ne(n){const t={};for(let e=0;e<n.length;e++){const i=fs(n[e]);for(const s in i)t[s]=i[s]}return t}function Zf(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Ru(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:qt.workingColorSpace}const Xs={clone:fs,merge:Ne};var $f=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Kf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Fe extends ii{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$f,this.fragmentShader=Kf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=fs(t.uniforms),this.uniformsGroups=Zf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Pu extends pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Jt,this.projectionMatrix=new Jt,this.projectionMatrixInverse=new Jt,this.coordinateSystem=Ln}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Wn=new R,gc=new tt,vc=new tt;class qe extends Pu{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=rl*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(jr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return rl*2*Math.atan(Math.tan(jr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Wn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Wn.x,Wn.y).multiplyScalar(-t/Wn.z),Wn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Wn.x,Wn.y).multiplyScalar(-t/Wn.z)}getViewSize(t,e){return this.getViewBounds(t,gc,vc),e.subVectors(vc,gc)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(jr*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Vi=-90,Wi=1;class jf extends pe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new qe(Vi,Wi,t,e);s.layers=this.layers,this.add(s);const r=new qe(Vi,Wi,t,e);r.layers=this.layers,this.add(r);const a=new qe(Vi,Wi,t,e);a.layers=this.layers,this.add(a);const o=new qe(Vi,Wi,t,e);o.layers=this.layers,this.add(o);const c=new qe(Vi,Wi,t,e);c.layers=this.layers,this.add(c);const l=new qe(Vi,Wi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===Ln)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ea)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const g=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=g,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class Du extends ze{constructor(t,e,i,s,r,a,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:ls,super(t,e,i,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Jf extends dn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Du(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:gn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new hn(5,5,5),r=new Fe({name:"CubemapFromEquirect",uniforms:fs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ge,blending:Un});r.uniforms.tEquirect.value=e;const a=new ht(s,r),o=e.minFilter;return e.minFilter===gi&&(e.minFilter=gn),new jf(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}}class Qf extends pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yn,this.environmentIntensity=1,this.environmentRotation=new yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class tp{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=sl,this.updateRanges=[],this.version=0,this.uuid=jn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ue=new R;class ia{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix4(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ue.fromBufferAttribute(this,e),Ue.applyNormalMatrix(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ue.fromBufferAttribute(this,e),Ue.transformDirection(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=mn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ee(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=mn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=mn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=mn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=mn(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array),s=ee(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array),s=ee(s,this.array),r=ee(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Te(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ia(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class al extends ii{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ut(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Xi;const Cs=new R,Yi=new R,qi=new R,Zi=new tt,Rs=new tt,Lu=new Jt,Cr=new R,Ps=new R,Rr=new R,xc=new tt,Va=new tt,yc=new tt;class Mc extends pe{constructor(t=new al){if(super(),this.isSprite=!0,this.type="Sprite",Xi===void 0){Xi=new he;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new tp(e,5);Xi.setIndex([0,1,2,0,2,3]),Xi.setAttribute("position",new ia(i,3,0,!1)),Xi.setAttribute("uv",new ia(i,2,3,!1))}this.geometry=Xi,this.material=t,this.center=new tt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Yi.setFromMatrixScale(this.matrixWorld),Lu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),qi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Yi.multiplyScalar(-qi.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const a=this.center;Pr(Cr.set(-.5,-.5,0),qi,a,Yi,s,r),Pr(Ps.set(.5,-.5,0),qi,a,Yi,s,r),Pr(Rr.set(.5,.5,0),qi,a,Yi,s,r),xc.set(0,0),Va.set(1,0),yc.set(1,1);let o=t.ray.intersectTriangle(Cr,Ps,Rr,!1,Cs);if(o===null&&(Pr(Ps.set(-.5,.5,0),qi,a,Yi,s,r),Va.set(0,1),o=t.ray.intersectTriangle(Cr,Rr,Ps,!1,Cs),o===null))return;const c=t.ray.origin.distanceTo(Cs);c<t.near||c>t.far||e.push({distance:c,point:Cs.clone(),uv:tn.getInterpolation(Cs,Cr,Ps,Rr,xc,Va,yc,new tt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Pr(n,t,e,i,s,r){Zi.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(Rs.x=r*Zi.x-s*Zi.y,Rs.y=s*Zi.x+r*Zi.y):Rs.copy(Zi),n.copy(t),n.x+=Rs.x,n.y+=Rs.y,n.applyMatrix4(Lu)}const Wa=new R,ep=new R,np=new It;class Xn{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=Wa.subVectors(i,e).cross(ep.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Wa),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||np.getNormalMatrix(t),s=this.coplanarPoint(Wa).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ci=new nr,Dr=new R;class Cl{constructor(t=new Xn,e=new Xn,i=new Xn,s=new Xn,r=new Xn,a=new Xn){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Ln){const i=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],f=s[8],_=s[9],g=s[10],m=s[11],p=s[12],b=s[13],y=s[14],v=s[15];if(i[0].setComponents(c-r,d-l,m-f,v-p).normalize(),i[1].setComponents(c+r,d+l,m+f,v+p).normalize(),i[2].setComponents(c+a,d+h,m+_,v+b).normalize(),i[3].setComponents(c-a,d-h,m-_,v-b).normalize(),i[4].setComponents(c-o,d-u,m-g,v-y).normalize(),e===Ln)i[5].setComponents(c+o,d+u,m+g,v+y).normalize();else if(e===ea)i[5].setComponents(o,u,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ci.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ci.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ci)}intersectsSprite(t){return ci.center.set(0,0,0),ci.radius=.7071067811865476,ci.applyMatrix4(t.matrixWorld),this.intersectsSphere(ci)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Dr.x=s.normal.x>0?t.max.x:t.min.x,Dr.y=s.normal.y>0?t.max.y:t.min.y,Dr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Dr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Iu extends ii{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ut(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const sa=new R,ra=new R,Sc=new Jt,Ds=new ir,Lr=new nr,Xa=new R,bc=new R;class ip extends pe{constructor(t=new he,e=new Iu){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,r=e.count;s<r;s++)sa.fromBufferAttribute(e,s-1),ra.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=sa.distanceTo(ra);t.setAttribute("lineDistance",new Vt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Lr.copy(i.boundingSphere),Lr.applyMatrix4(s),Lr.radius+=r,t.ray.intersectsSphere(Lr)===!1)return;Sc.copy(s).invert(),Ds.copy(t.ray).applyMatrix4(Sc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const f=Math.max(0,a.start),_=Math.min(h.count,a.start+a.count);for(let g=f,m=_-1;g<m;g+=l){const p=h.getX(g),b=h.getX(g+1),y=Ir(this,t,Ds,c,p,b);y&&e.push(y)}if(this.isLineLoop){const g=h.getX(_-1),m=h.getX(f),p=Ir(this,t,Ds,c,g,m);p&&e.push(p)}}else{const f=Math.max(0,a.start),_=Math.min(d.count,a.start+a.count);for(let g=f,m=_-1;g<m;g+=l){const p=Ir(this,t,Ds,c,g,g+1);p&&e.push(p)}if(this.isLineLoop){const g=Ir(this,t,Ds,c,_-1,f);g&&e.push(g)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ir(n,t,e,i,s,r){const a=n.geometry.attributes.position;if(sa.fromBufferAttribute(a,s),ra.fromBufferAttribute(a,r),e.distanceSqToSegment(sa,ra,Xa,bc)>i)return;Xa.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Xa);if(!(c<t.near||c>t.far))return{distance:c,point:bc.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}const Ec=new R,wc=new R;class sp extends ip{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,r=e.count;s<r;s+=2)Ec.fromBufferAttribute(e,s),wc.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Ec.distanceTo(wc);t.setAttribute("lineDistance",new Vt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ys extends ii{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ut(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Tc=new Jt,ol=new ir,Ur=new nr,Nr=new R;class aa extends pe{constructor(t=new he,e=new Ys){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ur.copy(i.boundingSphere),Ur.applyMatrix4(s),Ur.radius+=r,t.ray.intersectsSphere(Ur)===!1)return;Tc.copy(s).invert(),ol.copy(t.ray).applyMatrix4(Tc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,u=i.attributes.position;if(l!==null){const d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let _=d,g=f;_<g;_++){const m=l.getX(_);Nr.fromBufferAttribute(u,m),Ac(Nr,m,c,s,t,e,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let _=d,g=f;_<g;_++)Nr.fromBufferAttribute(u,_),Ac(Nr,_,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ac(n,t,e,i,s,r,a){const o=ol.distanceSqToPoint(n);if(o<e){const c=new R;ol.closestPointToPoint(n,c),c.applyMatrix4(i);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Re extends pe{constructor(){super(),this.isGroup=!0,this.type="Group"}}class es extends ze{constructor(t,e,i,s,r,a,o,c,l){super(t,e,i,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Uu extends ze{constructor(t,e,i,s,r,a,o,c,l,h=ss){if(h!==ss&&h!==us)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===ss&&(i=bi),i===void 0&&h===us&&(i=hs),super(null,s,r,a,o,c,h,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:un,this.minFilter=c!==void 0?c:un,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class zn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let s=0;const r=i.length;let a;e?a=e:a=t*i[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=i[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(r-1);const h=i[s],d=i[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new tt:new R);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new R,s=[],r=[],a=[],o=new R,c=new Jt;for(let f=0;f<=t;f++){const _=f/t;s[f]=this.getTangentAt(_,new R)}r[0]=new R,a[0]=new R;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),d<=l&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const _=Math.acos(Ft(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,_))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Ft(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let _=1;_<=t;_++)r[_].applyMatrix4(c.makeRotationAxis(s[_],f*_)),a[_].crossVectors(s[_],r[_])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Nu extends zn{constructor(t=0,e=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new tt){const i=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class rp extends Nu{constructor(t,e,i,s,r,a){super(t,e,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Rl(){let n=0,t=0,e=0,i=0;function s(r,a,o,c){n=r,t=o,e=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let d=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return n+t*r+e*a+i*o}}}const Fr=new R,Ya=new Rl,qa=new Rl,Za=new Rl;class Fu extends zn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new R){const i=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(Fr.subVectors(s[0],s[1]).add(s[0]),l=Fr);const u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Fr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Fr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let _=Math.pow(l.distanceToSquared(u),f),g=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);g<1e-4&&(g=1),_<1e-4&&(_=g),m<1e-4&&(m=g),Ya.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,_,g,m),qa.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,_,g,m),Za.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,_,g,m)}else this.curveType==="catmullrom"&&(Ya.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),qa.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Za.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return i.set(Ya.calc(c),qa.calc(c),Za.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new R().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Cc(n,t,e,i,s){const r=(i-t)*.5,a=(s-e)*.5,o=n*n,c=n*o;return(2*e-2*i+r+a)*c+(-3*e+3*i-2*r-a)*o+r*n+e}function ap(n,t){const e=1-n;return e*e*t}function op(n,t){return 2*(1-n)*n*t}function lp(n,t){return n*n*t}function Os(n,t,e,i){return ap(n,t)+op(n,e)+lp(n,i)}function cp(n,t){const e=1-n;return e*e*e*t}function hp(n,t){const e=1-n;return 3*e*e*n*t}function up(n,t){return 3*(1-n)*n*n*t}function dp(n,t){return n*n*n*t}function zs(n,t,e,i,s){return cp(n,t)+hp(n,e)+up(n,i)+dp(n,s)}class fp extends zn{constructor(t=new tt,e=new tt,i=new tt,s=new tt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new tt){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(zs(t,s.x,r.x,a.x,o.x),zs(t,s.y,r.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class pp extends zn{constructor(t=new R,e=new R,i=new R,s=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new R){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(zs(t,s.x,r.x,a.x,o.x),zs(t,s.y,r.y,a.y,o.y),zs(t,s.z,r.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class mp extends zn{constructor(t=new tt,e=new tt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new tt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new tt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class _p extends zn{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class gp extends zn{constructor(t=new tt,e=new tt,i=new tt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new tt){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(Os(t,s.x,r.x,a.x),Os(t,s.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ou extends zn{constructor(t=new R,e=new R,i=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new R){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(Os(t,s.x,r.x,a.x),Os(t,s.y,r.y,a.y),Os(t,s.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class vp extends zn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new tt){const i=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(Cc(o,c.x,l.x,h.x,u.x),Cc(o,c.y,l.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new tt().fromArray(s))}return this}}var xp=Object.freeze({__proto__:null,ArcCurve:rp,CatmullRomCurve3:Fu,CubicBezierCurve:fp,CubicBezierCurve3:pp,EllipseCurve:Nu,LineCurve:mp,LineCurve3:_p,QuadraticBezierCurve:gp,QuadraticBezierCurve3:Ou,SplineCurve:vp});class Pl extends he{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],c=[],l=new R,h=new tt;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=i+u/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Vt(a,3)),this.setAttribute("normal",new Vt(o,3)),this.setAttribute("uv",new Vt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pl(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ee extends he{constructor(t=1,e=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let _=0;const g=[],m=i/2;let p=0;b(),a===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new Vt(u,3)),this.setAttribute("normal",new Vt(d,3)),this.setAttribute("uv",new Vt(f,2));function b(){const v=new R,C=new R;let T=0;const w=(e-t)/i;for(let P=0;P<=r;P++){const M=[],x=P/r,D=x*(e-t)+t;for(let F=0;F<=s;F++){const O=F/s,H=O*c+o,X=Math.sin(H),W=Math.cos(H);C.x=D*X,C.y=-x*i+m,C.z=D*W,u.push(C.x,C.y,C.z),v.set(X,w,W).normalize(),d.push(v.x,v.y,v.z),f.push(O,1-x),M.push(_++)}g.push(M)}for(let P=0;P<s;P++)for(let M=0;M<r;M++){const x=g[M][P],D=g[M+1][P],F=g[M+1][P+1],O=g[M][P+1];(t>0||M!==0)&&(h.push(x,D,O),T+=3),(e>0||M!==r-1)&&(h.push(D,F,O),T+=3)}l.addGroup(p,T,0),p+=T}function y(v){const C=_,T=new tt,w=new R;let P=0;const M=v===!0?t:e,x=v===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,m*x,0),d.push(0,x,0),f.push(.5,.5),_++;const D=_;for(let F=0;F<=s;F++){const H=F/s*c+o,X=Math.cos(H),W=Math.sin(H);w.x=M*W,w.y=m*x,w.z=M*X,u.push(w.x,w.y,w.z),d.push(0,x,0),T.x=X*.5+.5,T.y=W*.5*x+.5,f.push(T.x,T.y),_++}for(let F=0;F<s;F++){const O=C+F,H=D+F;v===!0?h.push(H,H+1,O):h.push(H+1,H,O),P+=3}l.addGroup(p,P,v===!0?1:2),p+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ee(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Bs extends Ee{constructor(t=1,e=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Bs(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class fa extends he{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const r=[],a=[];o(s),l(i),h(),this.setAttribute("position",new Vt(r,3)),this.setAttribute("normal",new Vt(r.slice(),3)),this.setAttribute("uv",new Vt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(b){const y=new R,v=new R,C=new R;for(let T=0;T<e.length;T+=3)f(e[T+0],y),f(e[T+1],v),f(e[T+2],C),c(y,v,C,b)}function c(b,y,v,C){const T=C+1,w=[];for(let P=0;P<=T;P++){w[P]=[];const M=b.clone().lerp(v,P/T),x=y.clone().lerp(v,P/T),D=T-P;for(let F=0;F<=D;F++)F===0&&P===T?w[P][F]=M:w[P][F]=M.clone().lerp(x,F/D)}for(let P=0;P<T;P++)for(let M=0;M<2*(T-P)-1;M++){const x=Math.floor(M/2);M%2===0?(d(w[P][x+1]),d(w[P+1][x]),d(w[P][x])):(d(w[P][x+1]),d(w[P+1][x+1]),d(w[P+1][x]))}}function l(b){const y=new R;for(let v=0;v<r.length;v+=3)y.x=r[v+0],y.y=r[v+1],y.z=r[v+2],y.normalize().multiplyScalar(b),r[v+0]=y.x,r[v+1]=y.y,r[v+2]=y.z}function h(){const b=new R;for(let y=0;y<r.length;y+=3){b.x=r[y+0],b.y=r[y+1],b.z=r[y+2];const v=m(b)/2/Math.PI+.5,C=p(b)/Math.PI+.5;a.push(v,1-C)}_(),u()}function u(){for(let b=0;b<a.length;b+=6){const y=a[b+0],v=a[b+2],C=a[b+4],T=Math.max(y,v,C),w=Math.min(y,v,C);T>.9&&w<.1&&(y<.2&&(a[b+0]+=1),v<.2&&(a[b+2]+=1),C<.2&&(a[b+4]+=1))}}function d(b){r.push(b.x,b.y,b.z)}function f(b,y){const v=b*3;y.x=t[v+0],y.y=t[v+1],y.z=t[v+2]}function _(){const b=new R,y=new R,v=new R,C=new R,T=new tt,w=new tt,P=new tt;for(let M=0,x=0;M<r.length;M+=9,x+=6){b.set(r[M+0],r[M+1],r[M+2]),y.set(r[M+3],r[M+4],r[M+5]),v.set(r[M+6],r[M+7],r[M+8]),T.set(a[x+0],a[x+1]),w.set(a[x+2],a[x+3]),P.set(a[x+4],a[x+5]),C.copy(b).add(y).add(v).divideScalar(3);const D=m(C);g(T,x+0,b,D),g(w,x+2,y,D),g(P,x+4,v,D)}}function g(b,y,v,C){C<0&&b.x===1&&(a[y]=b.x-1),v.x===0&&v.z===0&&(a[y]=C/2/Math.PI+.5)}function m(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fa(t.vertices,t.indices,t.radius,t.details)}}class pa extends fa{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new pa(t.radius,t.detail)}}class oa extends fa{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new oa(t.radius,t.detail)}}class wi extends he{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(i),c=Math.floor(s),l=o+1,h=c+1,u=t/o,d=e/c,f=[],_=[],g=[],m=[];for(let p=0;p<h;p++){const b=p*d-a;for(let y=0;y<l;y++){const v=y*u-r;_.push(v,-b,0),g.push(0,0,1),m.push(y/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let b=0;b<o;b++){const y=b+l*p,v=b+l*(p+1),C=b+1+l*(p+1),T=b+1+l*p;f.push(y,v,T),f.push(v,C,T)}this.setIndex(f),this.setAttribute("position",new Vt(_,3)),this.setAttribute("normal",new Vt(g,3)),this.setAttribute("uv",new Vt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wi(t.width,t.height,t.widthSegments,t.heightSegments)}}class qn extends he{constructor(t=.5,e=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let u=t;const d=(e-t)/s,f=new R,_=new tt;for(let g=0;g<=s;g++){for(let m=0;m<=i;m++){const p=r+m/i*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),_.x=(f.x/e+1)/2,_.y=(f.y/e+1)/2,h.push(_.x,_.y)}u+=d}for(let g=0;g<s;g++){const m=g*(i+1);for(let p=0;p<i;p++){const b=p+m,y=b,v=b+i+1,C=b+i+2,T=b+1;o.push(y,v,T),o.push(v,C,T)}}this.setIndex(o),this.setAttribute("position",new Vt(c,3)),this.setAttribute("normal",new Vt(l,3)),this.setAttribute("uv",new Vt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qn(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Jn extends he{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new R,d=new R,f=[],_=[],g=[],m=[];for(let p=0;p<=i;p++){const b=[],y=p/i;let v=0;p===0&&a===0?v=.5/e:p===i&&c===Math.PI&&(v=-.5/e);for(let C=0;C<=e;C++){const T=C/e;u.x=-t*Math.cos(s+T*r)*Math.sin(a+y*o),u.y=t*Math.cos(a+y*o),u.z=t*Math.sin(s+T*r)*Math.sin(a+y*o),_.push(u.x,u.y,u.z),d.copy(u).normalize(),g.push(d.x,d.y,d.z),m.push(T+v,1-y),b.push(l++)}h.push(b)}for(let p=0;p<i;p++)for(let b=0;b<e;b++){const y=h[p][b+1],v=h[p][b],C=h[p+1][b],T=h[p+1][b+1];(p!==0||a>0)&&f.push(y,v,T),(p!==i-1||c<Math.PI)&&f.push(v,C,T)}this.setIndex(f),this.setAttribute("position",new Vt(_,3)),this.setAttribute("normal",new Vt(g,3)),this.setAttribute("uv",new Vt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Jn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class pi extends he{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const a=[],o=[],c=[],l=[],h=new R,u=new R,d=new R;for(let f=0;f<=i;f++)for(let _=0;_<=s;_++){const g=_/s*r,m=f/i*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(g),u.y=(t+e*Math.cos(m))*Math.sin(g),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(g),h.y=t*Math.sin(g),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(_/s),l.push(f/i)}for(let f=1;f<=i;f++)for(let _=1;_<=s;_++){const g=(s+1)*f+_-1,m=(s+1)*(f-1)+_-1,p=(s+1)*(f-1)+_,b=(s+1)*f+_;a.push(g,m,b),a.push(m,p,b)}this.setIndex(a),this.setAttribute("position",new Vt(o,3)),this.setAttribute("normal",new Vt(c,3)),this.setAttribute("uv",new Vt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pi(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class la extends he{constructor(t=new Ou(new R(-1,-1,0),new R(-1,1,0),new R(1,1,0)),e=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:i,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new R,c=new R,l=new tt;let h=new R;const u=[],d=[],f=[],_=[];g(),this.setIndex(_),this.setAttribute("position",new Vt(u,3)),this.setAttribute("normal",new Vt(d,3)),this.setAttribute("uv",new Vt(f,2));function g(){for(let y=0;y<e;y++)m(y);m(r===!1?e:0),b(),p()}function m(y){h=t.getPointAt(y/e,h);const v=a.normals[y],C=a.binormals[y];for(let T=0;T<=s;T++){const w=T/s*Math.PI*2,P=Math.sin(w),M=-Math.cos(w);c.x=M*v.x+P*C.x,c.y=M*v.y+P*C.y,c.z=M*v.z+P*C.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+i*c.x,o.y=h.y+i*c.y,o.z=h.z+i*c.z,u.push(o.x,o.y,o.z)}}function p(){for(let y=1;y<=e;y++)for(let v=1;v<=s;v++){const C=(s+1)*(y-1)+(v-1),T=(s+1)*y+(v-1),w=(s+1)*y+v,P=(s+1)*(y-1)+v;_.push(C,T,P),_.push(T,w,P)}}function b(){for(let y=0;y<=e;y++)for(let v=0;v<=s;v++)l.x=y/e,l.y=v/s,f.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new la(new xp[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class yp extends Fe{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ve extends ii{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ut(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ut(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mu,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Mp extends ii{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_f,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Sp extends ii{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class ma extends pe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ut(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class bp extends ma{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(pe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ut(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const $a=new Jt,Rc=new R,Pc=new R;class zu{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new tt(512,512),this.map=null,this.mapPass=null,this.matrix=new Jt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Cl,this._frameExtents=new tt(1,1),this._viewportCount=1,this._viewports=[new ie(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Rc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Rc),Pc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Pc),e.updateMatrixWorld(),$a.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix($a),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply($a)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Dc=new Jt,Ls=new R,Ka=new R;class Ep extends zu{constructor(){super(new qe(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new tt(4,2),this._viewportCount=6,this._viewports=[new ie(2,1,1,1),new ie(0,1,1,1),new ie(3,1,1,1),new ie(1,1,1,1),new ie(3,0,1,1),new ie(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){const i=this.camera,s=this.matrix,r=t.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Ls.setFromMatrixPosition(t.matrixWorld),i.position.copy(Ls),Ka.copy(i.position),Ka.add(this._cubeDirections[e]),i.up.copy(this._cubeUps[e]),i.lookAt(Ka),i.updateMatrixWorld(),s.makeTranslation(-Ls.x,-Ls.y,-Ls.z),Dc.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Dc)}}class vi extends ma{constructor(t,e,i=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Ep}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Dl extends Pu{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class wp extends zu{constructor(){super(new Dl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Lc extends ma{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(pe.DEFAULT_UP),this.updateMatrix(),this.target=new pe,this.shadow=new wp}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Tp extends ma{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class Ap extends qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Bu{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Ic(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Ic();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Ic(){return performance.now()}const Uc=new Jt;class Cp{constructor(t,e,i=0,s=1/0){this.ray=new ir(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new Al,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Uc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Uc),this}intersectObject(t,e=!0,i=[]){return ll(t,this,i,e),i.sort(Nc),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)ll(t[s],this,i,e);return i.sort(Nc),i}}function Nc(n,t){return n.distance-t.distance}function ll(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)ll(r[a],t,e,!0)}}class Fc{constructor(t=1,e=0,i=0){return this.radius=t,this.phi=e,this.theta=i,this}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Ft(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(Ft(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Rp extends sp{constructor(t=10,e=10,i=4473924,s=8947848){i=new ut(i),s=new ut(s);const r=e/2,a=t/e,o=t/2,c=[],l=[];for(let d=0,f=0,_=-o;d<=e;d++,_+=a){c.push(-o,0,_,o,0,_),c.push(_,0,-o,_,0,o);const g=d===r?i:s;g.toArray(l,f),f+=3,g.toArray(l,f),f+=3,g.toArray(l,f),f+=3,g.toArray(l,f),f+=3}const h=new he;h.setAttribute("position",new Vt(c,3)),h.setAttribute("color",new Vt(l,3));const u=new Iu({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class Pp extends Ri{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}function Oc(n,t,e,i){const s=Dp(i);switch(e){case pu:return n*t;case _u:return n*t;case gu:return n*t*2;case vu:return n*t/s.components*s.byteLength;case El:return n*t/s.components*s.byteLength;case xu:return n*t*2/s.components*s.byteLength;case wl:return n*t*2/s.components*s.byteLength;case mu:return n*t*3/s.components*s.byteLength;case cn:return n*t*4/s.components*s.byteLength;case Tl:return n*t*4/s.components*s.byteLength;case Yr:case qr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Zr:case $r:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Io:case No:return Math.max(n,16)*Math.max(t,8)/4;case Lo:case Uo:return Math.max(n,8)*Math.max(t,8)/2;case Fo:case Oo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case zo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Bo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case ko:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Ho:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Go:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Vo:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Wo:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Xo:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Yo:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case qo:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Zo:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case $o:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Ko:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case jo:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Jo:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Kr:case Qo:case tl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case yu:case el:return Math.ceil(n/4)*Math.ceil(t/4)*8;case nl:case il:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Dp(n){switch(n){case On:case uu:return{byteLength:1,components:1};case Ws:case du:case Nn:return{byteLength:2,components:1};case Sl:case bl:return{byteLength:2,components:4};case bi:case Ml:case Dn:return{byteLength:4,components:1};case fu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:xl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=xl);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function ku(){let n=null,t=!1,e=null,i=null;function s(r,a){e(r,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function Lp(n){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,l){const h=c.array,u=c.updateRanges;if(n.bindBuffer(l,o),u.length===0)n.bufferSubData(l,0,h);else{u.sort((f,_)=>f.start-_.start);let d=0;for(let f=1;f<u.length;f++){const _=u[d],g=u[f];g.start<=_.start+_.count+1?_.count=Math.max(_.count,g.start+g.count-_.start):(++d,u[d]=g)}u.length=d+1;for(let f=0,_=u.length;f<_;f++){const g=u[f];n.bufferSubData(l,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(n.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var Ip=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Up=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Np=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Fp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Op=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,zp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Bp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,kp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Hp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Gp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Vp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Wp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Xp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Yp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,qp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Zp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,$p=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Kp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,jp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Jp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Qp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,tm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,em=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,nm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,im=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,sm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,rm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,am=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,om=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,lm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,cm="gl_FragColor = linearToOutputTexel( gl_FragColor );",hm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,um=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,dm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,fm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,pm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,mm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,_m=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,vm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,xm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ym=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Mm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Sm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,bm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Em=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,wm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Tm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Am=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Cm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Rm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Pm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Dm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Lm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Im=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Um=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Nm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Fm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Om=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Bm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,km=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Hm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Gm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Wm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Xm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ym=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,$m=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Km=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,jm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Jm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,t_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,e_=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,n_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,i_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,s_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,r_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,a_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,o_=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,l_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,c_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,h_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,u_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,d_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,f_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,p_=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,m_=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,__=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,g_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,v_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,x_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,y_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,M_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,S_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,b_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,E_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,w_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,T_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,A_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,C_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,R_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,P_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,D_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const L_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,I_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,U_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,N_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,F_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,O_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,z_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,B_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,k_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,H_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,G_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,V_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,W_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,X_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Y_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,q_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Z_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,K_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,j_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,J_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Q_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,tg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,eg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ng=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ig=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ag=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,og=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,lg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,hg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ug=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Nt={alphahash_fragment:Ip,alphahash_pars_fragment:Up,alphamap_fragment:Np,alphamap_pars_fragment:Fp,alphatest_fragment:Op,alphatest_pars_fragment:zp,aomap_fragment:Bp,aomap_pars_fragment:kp,batching_pars_vertex:Hp,batching_vertex:Gp,begin_vertex:Vp,beginnormal_vertex:Wp,bsdfs:Xp,iridescence_fragment:Yp,bumpmap_pars_fragment:qp,clipping_planes_fragment:Zp,clipping_planes_pars_fragment:$p,clipping_planes_pars_vertex:Kp,clipping_planes_vertex:jp,color_fragment:Jp,color_pars_fragment:Qp,color_pars_vertex:tm,color_vertex:em,common:nm,cube_uv_reflection_fragment:im,defaultnormal_vertex:sm,displacementmap_pars_vertex:rm,displacementmap_vertex:am,emissivemap_fragment:om,emissivemap_pars_fragment:lm,colorspace_fragment:cm,colorspace_pars_fragment:hm,envmap_fragment:um,envmap_common_pars_fragment:dm,envmap_pars_fragment:fm,envmap_pars_vertex:pm,envmap_physical_pars_fragment:wm,envmap_vertex:mm,fog_vertex:_m,fog_pars_vertex:gm,fog_fragment:vm,fog_pars_fragment:xm,gradientmap_pars_fragment:ym,lightmap_pars_fragment:Mm,lights_lambert_fragment:Sm,lights_lambert_pars_fragment:bm,lights_pars_begin:Em,lights_toon_fragment:Tm,lights_toon_pars_fragment:Am,lights_phong_fragment:Cm,lights_phong_pars_fragment:Rm,lights_physical_fragment:Pm,lights_physical_pars_fragment:Dm,lights_fragment_begin:Lm,lights_fragment_maps:Im,lights_fragment_end:Um,logdepthbuf_fragment:Nm,logdepthbuf_pars_fragment:Fm,logdepthbuf_pars_vertex:Om,logdepthbuf_vertex:zm,map_fragment:Bm,map_pars_fragment:km,map_particle_fragment:Hm,map_particle_pars_fragment:Gm,metalnessmap_fragment:Vm,metalnessmap_pars_fragment:Wm,morphinstance_vertex:Xm,morphcolor_vertex:Ym,morphnormal_vertex:qm,morphtarget_pars_vertex:Zm,morphtarget_vertex:$m,normal_fragment_begin:Km,normal_fragment_maps:jm,normal_pars_fragment:Jm,normal_pars_vertex:Qm,normal_vertex:t_,normalmap_pars_fragment:e_,clearcoat_normal_fragment_begin:n_,clearcoat_normal_fragment_maps:i_,clearcoat_pars_fragment:s_,iridescence_pars_fragment:r_,opaque_fragment:a_,packing:o_,premultiplied_alpha_fragment:l_,project_vertex:c_,dithering_fragment:h_,dithering_pars_fragment:u_,roughnessmap_fragment:d_,roughnessmap_pars_fragment:f_,shadowmap_pars_fragment:p_,shadowmap_pars_vertex:m_,shadowmap_vertex:__,shadowmask_pars_fragment:g_,skinbase_vertex:v_,skinning_pars_vertex:x_,skinning_vertex:y_,skinnormal_vertex:M_,specularmap_fragment:S_,specularmap_pars_fragment:b_,tonemapping_fragment:E_,tonemapping_pars_fragment:w_,transmission_fragment:T_,transmission_pars_fragment:A_,uv_pars_fragment:C_,uv_pars_vertex:R_,uv_vertex:P_,worldpos_vertex:D_,background_vert:L_,background_frag:I_,backgroundCube_vert:U_,backgroundCube_frag:N_,cube_vert:F_,cube_frag:O_,depth_vert:z_,depth_frag:B_,distanceRGBA_vert:k_,distanceRGBA_frag:H_,equirect_vert:G_,equirect_frag:V_,linedashed_vert:W_,linedashed_frag:X_,meshbasic_vert:Y_,meshbasic_frag:q_,meshlambert_vert:Z_,meshlambert_frag:$_,meshmatcap_vert:K_,meshmatcap_frag:j_,meshnormal_vert:J_,meshnormal_frag:Q_,meshphong_vert:tg,meshphong_frag:eg,meshphysical_vert:ng,meshphysical_frag:ig,meshtoon_vert:sg,meshtoon_frag:rg,points_vert:ag,points_frag:og,shadow_vert:lg,shadow_frag:cg,sprite_vert:hg,sprite_frag:ug},nt={common:{diffuse:{value:new ut(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new It}},envmap:{envMap:{value:null},envMapRotation:{value:new It},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new It}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new It}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new It},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new It},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new It},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new It}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new It}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new It}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ut(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ut(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0},uvTransform:{value:new It}},sprite:{diffuse:{value:new ut(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}}},pn={basic:{uniforms:Ne([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.fog]),vertexShader:Nt.meshbasic_vert,fragmentShader:Nt.meshbasic_frag},lambert:{uniforms:Ne([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new ut(0)}}]),vertexShader:Nt.meshlambert_vert,fragmentShader:Nt.meshlambert_frag},phong:{uniforms:Ne([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new ut(0)},specular:{value:new ut(1118481)},shininess:{value:30}}]),vertexShader:Nt.meshphong_vert,fragmentShader:Nt.meshphong_frag},standard:{uniforms:Ne([nt.common,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.roughnessmap,nt.metalnessmap,nt.fog,nt.lights,{emissive:{value:new ut(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag},toon:{uniforms:Ne([nt.common,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.gradientmap,nt.fog,nt.lights,{emissive:{value:new ut(0)}}]),vertexShader:Nt.meshtoon_vert,fragmentShader:Nt.meshtoon_frag},matcap:{uniforms:Ne([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,{matcap:{value:null}}]),vertexShader:Nt.meshmatcap_vert,fragmentShader:Nt.meshmatcap_frag},points:{uniforms:Ne([nt.points,nt.fog]),vertexShader:Nt.points_vert,fragmentShader:Nt.points_frag},dashed:{uniforms:Ne([nt.common,nt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Nt.linedashed_vert,fragmentShader:Nt.linedashed_frag},depth:{uniforms:Ne([nt.common,nt.displacementmap]),vertexShader:Nt.depth_vert,fragmentShader:Nt.depth_frag},normal:{uniforms:Ne([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,{opacity:{value:1}}]),vertexShader:Nt.meshnormal_vert,fragmentShader:Nt.meshnormal_frag},sprite:{uniforms:Ne([nt.sprite,nt.fog]),vertexShader:Nt.sprite_vert,fragmentShader:Nt.sprite_frag},background:{uniforms:{uvTransform:{value:new It},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Nt.background_vert,fragmentShader:Nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new It}},vertexShader:Nt.backgroundCube_vert,fragmentShader:Nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Nt.cube_vert,fragmentShader:Nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Nt.equirect_vert,fragmentShader:Nt.equirect_frag},distanceRGBA:{uniforms:Ne([nt.common,nt.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Nt.distanceRGBA_vert,fragmentShader:Nt.distanceRGBA_frag},shadow:{uniforms:Ne([nt.lights,nt.fog,{color:{value:new ut(0)},opacity:{value:1}}]),vertexShader:Nt.shadow_vert,fragmentShader:Nt.shadow_frag}};pn.physical={uniforms:Ne([pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new It},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new It},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new It},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new It},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new It},sheen:{value:0},sheenColor:{value:new ut(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new It},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new It},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new It},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new It},attenuationDistance:{value:0},attenuationColor:{value:new ut(0)},specularColor:{value:new ut(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new It},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new It},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new It}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag};const Or={r:0,b:0,g:0},hi=new yn,dg=new Jt;function fg(n,t,e,i,s,r,a){const o=new ut(0);let c=r===!0?0:1,l,h,u=null,d=0,f=null;function _(y){let v=y.isScene===!0?y.background:null;return v&&v.isTexture&&(v=(y.backgroundBlurriness>0?e:t).get(v)),v}function g(y){let v=!1;const C=_(y);C===null?p(o,c):C&&C.isColor&&(p(C,1),v=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,v){const C=_(v);C&&(C.isCubeTexture||C.mapping===da)?(h===void 0&&(h=new ht(new hn(1,1,1),new Fe({name:"BackgroundCubeMaterial",uniforms:fs(pn.backgroundCube.uniforms),vertexShader:pn.backgroundCube.vertexShader,fragmentShader:pn.backgroundCube.fragmentShader,side:Ge,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,w,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),hi.copy(v.backgroundRotation),hi.x*=-1,hi.y*=-1,hi.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),h.material.uniforms.envMap.value=C,h.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(dg.makeRotationFromEuler(hi)),h.material.toneMapped=qt.getTransfer(C.colorSpace)!==te,(u!==C||d!==C.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=C,d=C.version,f=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):C&&C.isTexture&&(l===void 0&&(l=new ht(new wi(2,2),new Fe({name:"BackgroundMaterial",uniforms:fs(pn.background.uniforms),vertexShader:pn.background.vertexShader,fragmentShader:pn.background.fragmentShader,side:ni,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=C,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=qt.getTransfer(C.colorSpace)!==te,C.matrixAutoUpdate===!0&&C.updateMatrix(),l.material.uniforms.uvTransform.value.copy(C.matrix),(u!==C||d!==C.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=C,d=C.version,f=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function p(y,v){y.getRGB(Or,Ru(n)),i.buffers.color.setClear(Or.r,Or.g,Or.b,v,a)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose()),l!==void 0&&(l.geometry.dispose(),l.material.dispose())}return{getClearColor:function(){return o},setClearColor:function(y,v=1){o.set(y),c=v,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,p(o,c)},render:g,addToRenderList:m,dispose:b}}function pg(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(x,D,F,O,H){let X=!1;const W=u(O,F,D);r!==W&&(r=W,l(r.object)),X=f(x,O,F,H),X&&_(x,O,F,H),H!==null&&t.update(H,n.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,v(x,D,F,O),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function c(){return n.createVertexArray()}function l(x){return n.bindVertexArray(x)}function h(x){return n.deleteVertexArray(x)}function u(x,D,F){const O=F.wireframe===!0;let H=i[x.id];H===void 0&&(H={},i[x.id]=H);let X=H[D.id];X===void 0&&(X={},H[D.id]=X);let W=X[O];return W===void 0&&(W=d(c()),X[O]=W),W}function d(x){const D=[],F=[],O=[];for(let H=0;H<e;H++)D[H]=0,F[H]=0,O[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:F,attributeDivisors:O,object:x,attributes:{},index:null}}function f(x,D,F,O){const H=r.attributes,X=D.attributes;let W=0;const K=F.getAttributes();for(const V in K)if(K[V].location>=0){const ft=H[V];let Mt=X[V];if(Mt===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(Mt=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(Mt=x.instanceColor)),ft===void 0||ft.attribute!==Mt||Mt&&ft.data!==Mt.data)return!0;W++}return r.attributesNum!==W||r.index!==O}function _(x,D,F,O){const H={},X=D.attributes;let W=0;const K=F.getAttributes();for(const V in K)if(K[V].location>=0){let ft=X[V];ft===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(ft=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(ft=x.instanceColor));const Mt={};Mt.attribute=ft,ft&&ft.data&&(Mt.data=ft.data),H[V]=Mt,W++}r.attributes=H,r.attributesNum=W,r.index=O}function g(){const x=r.newAttributes;for(let D=0,F=x.length;D<F;D++)x[D]=0}function m(x){p(x,0)}function p(x,D){const F=r.newAttributes,O=r.enabledAttributes,H=r.attributeDivisors;F[x]=1,O[x]===0&&(n.enableVertexAttribArray(x),O[x]=1),H[x]!==D&&(n.vertexAttribDivisor(x,D),H[x]=D)}function b(){const x=r.newAttributes,D=r.enabledAttributes;for(let F=0,O=D.length;F<O;F++)D[F]!==x[F]&&(n.disableVertexAttribArray(F),D[F]=0)}function y(x,D,F,O,H,X,W){W===!0?n.vertexAttribIPointer(x,D,F,H,X):n.vertexAttribPointer(x,D,F,O,H,X)}function v(x,D,F,O){g();const H=O.attributes,X=F.getAttributes(),W=D.defaultAttributeValues;for(const K in X){const V=X[K];if(V.location>=0){let rt=H[K];if(rt===void 0&&(K==="instanceMatrix"&&x.instanceMatrix&&(rt=x.instanceMatrix),K==="instanceColor"&&x.instanceColor&&(rt=x.instanceColor)),rt!==void 0){const ft=rt.normalized,Mt=rt.itemSize,Ot=t.get(rt);if(Ot===void 0)continue;const se=Ot.buffer,q=Ot.type,et=Ot.bytesPerElement,vt=q===n.INT||q===n.UNSIGNED_INT||rt.gpuType===Ml;if(rt.isInterleavedBufferAttribute){const at=rt.data,Tt=at.stride,Rt=rt.offset;if(at.isInstancedInterleavedBuffer){for(let zt=0;zt<V.locationSize;zt++)p(V.location+zt,at.meshPerAttribute);x.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let zt=0;zt<V.locationSize;zt++)m(V.location+zt);n.bindBuffer(n.ARRAY_BUFFER,se);for(let zt=0;zt<V.locationSize;zt++)y(V.location+zt,Mt/V.locationSize,q,ft,Tt*et,(Rt+Mt/V.locationSize*zt)*et,vt)}else{if(rt.isInstancedBufferAttribute){for(let at=0;at<V.locationSize;at++)p(V.location+at,rt.meshPerAttribute);x.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let at=0;at<V.locationSize;at++)m(V.location+at);n.bindBuffer(n.ARRAY_BUFFER,se);for(let at=0;at<V.locationSize;at++)y(V.location+at,Mt/V.locationSize,q,ft,Mt*et,Mt/V.locationSize*at*et,vt)}}else if(W!==void 0){const ft=W[K];if(ft!==void 0)switch(ft.length){case 2:n.vertexAttrib2fv(V.location,ft);break;case 3:n.vertexAttrib3fv(V.location,ft);break;case 4:n.vertexAttrib4fv(V.location,ft);break;default:n.vertexAttrib1fv(V.location,ft)}}}}b()}function C(){P();for(const x in i){const D=i[x];for(const F in D){const O=D[F];for(const H in O)h(O[H].object),delete O[H];delete D[F]}delete i[x]}}function T(x){if(i[x.id]===void 0)return;const D=i[x.id];for(const F in D){const O=D[F];for(const H in O)h(O[H].object),delete O[H];delete D[F]}delete i[x.id]}function w(x){for(const D in i){const F=i[D];if(F[x.id]===void 0)continue;const O=F[x.id];for(const H in O)h(O[H].object),delete O[H];delete F[x.id]}}function P(){M(),a=!0,r!==s&&(r=s,l(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:P,resetDefaultState:M,dispose:C,releaseStatesOfGeometry:T,releaseStatesOfProgram:w,initAttributes:g,enableAttribute:m,disableUnusedAttributes:b}}function mg(n,t,e){let i;function s(l){i=l}function r(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function a(l,h,u){u!==0&&(n.drawArraysInstanced(i,l,h,u),e.update(h,i,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,u);let f=0;for(let _=0;_<u;_++)f+=h[_];e.update(f,i,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let _=0;_<l.length;_++)a(l[_],h[_],d[_]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,h,0,d,0,u);let _=0;for(let g=0;g<u;g++)_+=h[g]*d[g];e.update(_,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function _g(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(w){return!(w!==cn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const P=w===Nn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==On&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==Dn&&!P)}function c(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),y=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),C=_>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:_,maxTextureSize:g,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:y,maxFragmentUniforms:v,vertexTextures:C,maxSamples:T}}function gg(n){const t=this;let e=null,i=0,s=!1,r=!1;const a=new Xn,o=new It,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const _=u.clippingPlanes,g=u.clipIntersection,m=u.clipShadows,p=n.get(u);if(!s||_===null||_.length===0||r&&!m)r?h(null):l();else{const b=r?0:i,y=b*4;let v=p.clippingState||null;c.value=v,v=h(_,d,y,f);for(let C=0;C!==y;++C)v[C]=e[C];p.clippingState=v,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,_){const g=u!==null?u.length:0;let m=null;if(g!==0){if(m=c.value,_!==!0||m===null){const p=f+g*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,v=f;y!==g;++y,v+=4)a.copy(u[y]).applyMatrix4(b,o),a.normal.toArray(m,v),m[v+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}function vg(n){let t=new WeakMap;function e(a,o){return o===Ro?a.mapping=ls:o===Po&&(a.mapping=cs),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ro||o===Po)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Jf(c.height);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}const ns=4,zc=[.125,.215,.35,.446,.526,.582],mi=20,ja=new Dl,Bc=new ut;let Ja=null,Qa=0,to=0,eo=!1;const di=(1+Math.sqrt(5))/2,$i=1/di,kc=[new R(-di,$i,0),new R(di,$i,0),new R(-$i,0,di),new R($i,0,di),new R(0,di,-$i),new R(0,di,$i),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)];class Hc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){Ja=this._renderer.getRenderTarget(),Qa=this._renderer.getActiveCubeFace(),to=this._renderer.getActiveMipmapLevel(),eo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,i,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Wc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ja,Qa,to),this._renderer.xr.enabled=eo,t.scissorTest=!1,zr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ls||t.mapping===cs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ja=this._renderer.getRenderTarget(),Qa=this._renderer.getActiveCubeFace(),to=this._renderer.getActiveMipmapLevel(),eo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:gn,minFilter:gn,generateMipmaps:!1,type:Nn,format:cn,colorSpace:ds,depthBuffer:!1},s=Gc(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gc(t,e,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=xg(r)),this._blurMaterial=yg(r,t,e)}return s}_compileMaterial(t){const e=new ht(this._lodPlanes[0],t);this._renderer.compile(e,ja)}_sceneToCubeUV(t,e,i,s){const o=new qe(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Bc),h.toneMapping=Kn,h.autoClear=!1;const f=new we({name:"PMREM.Background",side:Ge,depthWrite:!1,depthTest:!1}),_=new ht(new hn,f);let g=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,g=!0):(f.color.copy(Bc),g=!0);for(let p=0;p<6;p++){const b=p%3;b===0?(o.up.set(0,c[p],0),o.lookAt(l[p],0,0)):b===1?(o.up.set(0,0,c[p]),o.lookAt(0,l[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,l[p]));const y=this._cubeSize;zr(s,b*y,p>2?y:0,y,y),h.setRenderTarget(s),g&&h.render(_,o),h.render(t,o)}_.geometry.dispose(),_.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===ls||t.mapping===cs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Wc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new ht(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;zr(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,ja)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=kc[(s-r-1)%kc.length];this._blur(t,r-1,r,a,o)}e.autoClear=i}_blur(t,e,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ht(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[i]-1,_=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*mi-1),g=r/_,m=isFinite(r)?1+Math.floor(h*g):mi;m>mi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${mi}`);const p=[];let b=0;for(let w=0;w<mi;++w){const P=w/g,M=Math.exp(-P*P/2);p.push(M),w===0?b+=M:w<m&&(b+=2*M)}for(let w=0;w<p.length;w++)p[w]=p[w]/b;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:y}=this;d.dTheta.value=_,d.mipInt.value=y-i;const v=this._sizeLods[s],C=3*v*(s>y-ns?s-y+ns:0),T=4*(this._cubeSize-v);zr(e,C,T,3*v,2*v),c.setRenderTarget(e),c.render(u,ja)}}function xg(n){const t=[],e=[],i=[];let s=n;const r=n-ns+1+zc.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>n-ns?c=zc[a-n+ns-1]:a===0&&(c=0),i.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,_=6,g=3,m=2,p=1,b=new Float32Array(g*_*f),y=new Float32Array(m*_*f),v=new Float32Array(p*_*f);for(let T=0;T<f;T++){const w=T%3*2/3-1,P=T>2?0:-1,M=[w,P,0,w+2/3,P,0,w+2/3,P+1,0,w,P,0,w+2/3,P+1,0,w,P+1,0];b.set(M,g*_*T),y.set(d,m*_*T);const x=[T,T,T,T,T,T];v.set(x,p*_*T)}const C=new he;C.setAttribute("position",new Te(b,g)),C.setAttribute("uv",new Te(y,m)),C.setAttribute("faceIndex",new Te(v,p)),t.push(C),s>ns&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Gc(n,t,e){const i=new dn(n,t,e);return i.texture.mapping=da,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function zr(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function yg(n,t,e){const i=new Float32Array(mi),s=new R(0,1,0);return new Fe({name:"SphericalGaussianBlur",defines:{n:mi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function Vc(){return new Fe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function Wc(){return new Fe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function Ll(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Mg(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===Ro||c===Po,h=c===ls||c===cs;if(l||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Hc(n)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new Hc(n)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function Sg(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&Qi("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function bg(n,t,e,i){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const _ in d.attributes)t.remove(d.attributes[_]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)t.update(d[f],n.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,_=u.attributes.position;let g=0;if(f!==null){const b=f.array;g=f.version;for(let y=0,v=b.length;y<v;y+=3){const C=b[y+0],T=b[y+1],w=b[y+2];d.push(C,T,T,w,w,C)}}else if(_!==void 0){const b=_.array;g=_.version;for(let y=0,v=b.length/3-1;y<v;y+=3){const C=y+0,T=y+1,w=y+2;d.push(C,T,T,w,w,C)}}else return;const m=new(bu(d)?Cu:Au)(d,1);m.version=g;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Eg(n,t,e){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,f){n.drawElements(i,f,r,d*a),e.update(f,i,1)}function l(d,f,_){_!==0&&(n.drawElementsInstanced(i,f,r,d*a,_),e.update(f,i,_))}function h(d,f,_){if(_===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,d,0,_);let m=0;for(let p=0;p<_;p++)m+=f[p];e.update(m,i,1)}function u(d,f,_,g){if(_===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],g[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,r,d,0,g,0,_);let p=0;for(let b=0;b<_;b++)p+=f[b]*g[b];e.update(p,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function wg(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Tg(n,t,e){const i=new WeakMap,s=new ie;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==u){let x=function(){P.dispose(),i.delete(o),o.removeEventListener("dispose",x)};var f=x;d!==void 0&&d.texture.dispose();const _=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let v=0;_===!0&&(v=1),g===!0&&(v=2),m===!0&&(v=3);let C=o.attributes.position.count*v,T=1;C>t.maxTextureSize&&(T=Math.ceil(C/t.maxTextureSize),C=t.maxTextureSize);const w=new Float32Array(C*T*4*u),P=new wu(w,C,T,u);P.type=Dn,P.needsUpdate=!0;const M=v*4;for(let D=0;D<u;D++){const F=p[D],O=b[D],H=y[D],X=C*T*4*D;for(let W=0;W<F.count;W++){const K=W*M;_===!0&&(s.fromBufferAttribute(F,W),w[X+K+0]=s.x,w[X+K+1]=s.y,w[X+K+2]=s.z,w[X+K+3]=0),g===!0&&(s.fromBufferAttribute(O,W),w[X+K+4]=s.x,w[X+K+5]=s.y,w[X+K+6]=s.z,w[X+K+7]=0),m===!0&&(s.fromBufferAttribute(H,W),w[X+K+8]=s.x,w[X+K+9]=s.y,w[X+K+10]=s.z,w[X+K+11]=H.itemSize===4?s.w:1)}}d={count:u,texture:P,size:new tt(C,T)},i.set(o,d),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let _=0;for(let m=0;m<l.length;m++)_+=l[m];const g=o.morphTargetsRelative?1:1-_;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function Ag(n,t,e,i){let s=new WeakMap;function r(c){const l=i.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}const Hu=new ze,Xc=new Uu(1,1),Gu=new wu,Vu=new Of,Wu=new Du,Yc=[],qc=[],Zc=new Float32Array(16),$c=new Float32Array(9),Kc=new Float32Array(4);function gs(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let r=Yc[s];if(r===void 0&&(r=new Float32Array(s),Yc[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function ye(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Me(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function _a(n,t){let e=qc[t];e===void 0&&(e=new Int32Array(t),qc[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Cg(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Rg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;n.uniform2fv(this.addr,t),Me(e,t)}}function Pg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ye(e,t))return;n.uniform3fv(this.addr,t),Me(e,t)}}function Dg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;n.uniform4fv(this.addr,t),Me(e,t)}}function Lg(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(ye(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Me(e,t)}else{if(ye(e,i))return;Kc.set(i),n.uniformMatrix2fv(this.addr,!1,Kc),Me(e,i)}}function Ig(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(ye(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Me(e,t)}else{if(ye(e,i))return;$c.set(i),n.uniformMatrix3fv(this.addr,!1,$c),Me(e,i)}}function Ug(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(ye(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Me(e,t)}else{if(ye(e,i))return;Zc.set(i),n.uniformMatrix4fv(this.addr,!1,Zc),Me(e,i)}}function Ng(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Fg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;n.uniform2iv(this.addr,t),Me(e,t)}}function Og(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;n.uniform3iv(this.addr,t),Me(e,t)}}function zg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;n.uniform4iv(this.addr,t),Me(e,t)}}function Bg(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function kg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;n.uniform2uiv(this.addr,t),Me(e,t)}}function Hg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;n.uniform3uiv(this.addr,t),Me(e,t)}}function Gg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;n.uniform4uiv(this.addr,t),Me(e,t)}}function Vg(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Xc.compareFunction=Su,r=Xc):r=Hu,e.setTexture2D(t||r,s)}function Wg(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Vu,s)}function Xg(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Wu,s)}function Yg(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Gu,s)}function qg(n){switch(n){case 5126:return Cg;case 35664:return Rg;case 35665:return Pg;case 35666:return Dg;case 35674:return Lg;case 35675:return Ig;case 35676:return Ug;case 5124:case 35670:return Ng;case 35667:case 35671:return Fg;case 35668:case 35672:return Og;case 35669:case 35673:return zg;case 5125:return Bg;case 36294:return kg;case 36295:return Hg;case 36296:return Gg;case 35678:case 36198:case 36298:case 36306:case 35682:return Vg;case 35679:case 36299:case 36307:return Wg;case 35680:case 36300:case 36308:case 36293:return Xg;case 36289:case 36303:case 36311:case 36292:return Yg}}function Zg(n,t){n.uniform1fv(this.addr,t)}function $g(n,t){const e=gs(t,this.size,2);n.uniform2fv(this.addr,e)}function Kg(n,t){const e=gs(t,this.size,3);n.uniform3fv(this.addr,e)}function jg(n,t){const e=gs(t,this.size,4);n.uniform4fv(this.addr,e)}function Jg(n,t){const e=gs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function Qg(n,t){const e=gs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function t0(n,t){const e=gs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function e0(n,t){n.uniform1iv(this.addr,t)}function n0(n,t){n.uniform2iv(this.addr,t)}function i0(n,t){n.uniform3iv(this.addr,t)}function s0(n,t){n.uniform4iv(this.addr,t)}function r0(n,t){n.uniform1uiv(this.addr,t)}function a0(n,t){n.uniform2uiv(this.addr,t)}function o0(n,t){n.uniform3uiv(this.addr,t)}function l0(n,t){n.uniform4uiv(this.addr,t)}function c0(n,t,e){const i=this.cache,s=t.length,r=_a(e,s);ye(i,r)||(n.uniform1iv(this.addr,r),Me(i,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Hu,r[a])}function h0(n,t,e){const i=this.cache,s=t.length,r=_a(e,s);ye(i,r)||(n.uniform1iv(this.addr,r),Me(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Vu,r[a])}function u0(n,t,e){const i=this.cache,s=t.length,r=_a(e,s);ye(i,r)||(n.uniform1iv(this.addr,r),Me(i,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Wu,r[a])}function d0(n,t,e){const i=this.cache,s=t.length,r=_a(e,s);ye(i,r)||(n.uniform1iv(this.addr,r),Me(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Gu,r[a])}function f0(n){switch(n){case 5126:return Zg;case 35664:return $g;case 35665:return Kg;case 35666:return jg;case 35674:return Jg;case 35675:return Qg;case 35676:return t0;case 5124:case 35670:return e0;case 35667:case 35671:return n0;case 35668:case 35672:return i0;case 35669:case 35673:return s0;case 5125:return r0;case 36294:return a0;case 36295:return o0;case 36296:return l0;case 35678:case 36198:case 36298:case 36306:case 35682:return c0;case 35679:case 36299:case 36307:return h0;case 35680:case 36300:case 36308:case 36293:return u0;case 36289:case 36303:case 36311:case 36292:return d0}}class p0{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=qg(e.type)}}class m0{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=f0(e.type)}}class _0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],i)}}}const no=/(\w+)(\])?(\[|\.)?/g;function jc(n,t){n.seq.push(t),n.map[t.id]=t}function g0(n,t,e){const i=n.name,s=i.length;for(no.lastIndex=0;;){const r=no.exec(i),a=no.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){jc(e,l===void 0?new p0(o,n,t):new m0(o,n,t));break}else{let u=e.map[o];u===void 0&&(u=new _0(o),jc(e,u)),e=u}}}class Jr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);g0(r,a,this)}}setValue(t,e,i,s){const r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function Jc(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const v0=37297;let x0=0;function y0(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const Qc=new It;function M0(n){qt._getMatrix(Qc,qt.workingColorSpace,n);const t=`mat3( ${Qc.elements.map(e=>e.toFixed(4))} )`;switch(qt.getTransfer(n)){case ta:return[t,"LinearTransferOETF"];case te:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function th(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+y0(n.getShaderSource(t),a)}else return s}function S0(n,t){const e=M0(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function b0(n,t){let e;switch(t){case ru:e="Linear";break;case au:e="Reinhard";break;case ou:e="Cineon";break;case yl:e="ACESFilmic";break;case lu:e="AgX";break;case cu:e="Neutral";break;case pf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Br=new R;function E0(){qt.getLuminanceCoefficients(Br);const n=Br.x.toFixed(4),t=Br.y.toFixed(4),e=Br.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function w0(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Us).join(`
`)}function T0(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function A0(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(t,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function Us(n){return n!==""}function eh(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function nh(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const C0=/^[ \t]*#include +<([\w\d./]+)>/gm;function cl(n){return n.replace(C0,P0)}const R0=new Map;function P0(n,t){let e=Nt[t];if(e===void 0){const i=R0.get(t);if(i!==void 0)e=Nt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return cl(e)}const D0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ih(n){return n.replace(D0,L0)}function L0(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function sh(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function I0(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===iu?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Yd?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Cn&&(t="SHADOWMAP_TYPE_VSM"),t}function U0(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ls:case cs:t="ENVMAP_TYPE_CUBE";break;case da:t="ENVMAP_TYPE_CUBE_UV";break}return t}function N0(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case cs:t="ENVMAP_MODE_REFRACTION";break}return t}function F0(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case su:t="ENVMAP_BLENDING_MULTIPLY";break;case df:t="ENVMAP_BLENDING_MIX";break;case ff:t="ENVMAP_BLENDING_ADD";break}return t}function O0(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function z0(n,t,e,i){const s=n.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=I0(e),l=U0(e),h=N0(e),u=F0(e),d=O0(e),f=w0(e),_=T0(r),g=s.createProgram();let m,p,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Us).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Us).join(`
`),p.length>0&&(p+=`
`)):(m=[sh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Us).join(`
`),p=[sh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Kn?"#define TONE_MAPPING":"",e.toneMapping!==Kn?Nt.tonemapping_pars_fragment:"",e.toneMapping!==Kn?b0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Nt.colorspace_pars_fragment,S0("linearToOutputTexel",e.outputColorSpace),E0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Us).join(`
`)),a=cl(a),a=eh(a,e),a=nh(a,e),o=cl(o),o=eh(o,e),o=nh(o,e),a=ih(a),o=ih(o),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===ec?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ec?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=b+m+a,v=b+p+o,C=Jc(s,s.VERTEX_SHADER,y),T=Jc(s,s.FRAGMENT_SHADER,v);s.attachShader(g,C),s.attachShader(g,T),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function w(D){if(n.debug.checkShaderErrors){const F=s.getProgramInfoLog(g).trim(),O=s.getShaderInfoLog(C).trim(),H=s.getShaderInfoLog(T).trim();let X=!0,W=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(X=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,g,C,T);else{const K=th(s,C,"vertex"),V=th(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+F+`
`+K+`
`+V)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(O===""||H==="")&&(W=!1);W&&(D.diagnostics={runnable:X,programLog:F,vertexShader:{log:O,prefix:m},fragmentShader:{log:H,prefix:p}})}s.deleteShader(C),s.deleteShader(T),P=new Jr(s,g),M=A0(s,g)}let P;this.getUniforms=function(){return P===void 0&&w(this),P};let M;this.getAttributes=function(){return M===void 0&&w(this),M};let x=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(g,v0)),x},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=x0++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=C,this.fragmentShader=T,this}let B0=0;class k0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new H0(t),e.set(t,i)),i}}class H0{constructor(t){this.id=B0++,this.code=t,this.usedTimes=0}}function G0(n,t,e,i,s,r,a){const o=new Al,c=new k0,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(M){return l.add(M),M===0?"uv":`uv${M}`}function m(M,x,D,F,O){const H=F.fog,X=O.geometry,W=M.isMeshStandardMaterial?F.environment:null,K=(M.isMeshStandardMaterial?e:t).get(M.envMap||W),V=K&&K.mapping===da?K.image.height:null,rt=_[M.type];M.precision!==null&&(f=s.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const ft=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Mt=ft!==void 0?ft.length:0;let Ot=0;X.morphAttributes.position!==void 0&&(Ot=1),X.morphAttributes.normal!==void 0&&(Ot=2),X.morphAttributes.color!==void 0&&(Ot=3);let se,q,et,vt;if(rt){const Qt=pn[rt];se=Qt.vertexShader,q=Qt.fragmentShader}else se=M.vertexShader,q=M.fragmentShader,c.update(M),et=c.getVertexShaderID(M),vt=c.getFragmentShaderID(M);const at=n.getRenderTarget(),Tt=n.state.buffers.depth.getReversed(),Rt=O.isInstancedMesh===!0,zt=O.isBatchedMesh===!0,ce=!!M.map,Wt=!!M.matcap,fe=!!K,L=!!M.aoMap,$e=!!M.lightMap,kt=!!M.bumpMap,Ht=!!M.normalMap,St=!!M.displacementMap,ae=!!M.emissiveMap,yt=!!M.metalnessMap,A=!!M.roughnessMap,S=M.anisotropy>0,z=M.clearcoat>0,Z=M.dispersion>0,j=M.iridescence>0,Y=M.sheen>0,xt=M.transmission>0,ot=S&&!!M.anisotropyMap,pt=z&&!!M.clearcoatMap,Xt=z&&!!M.clearcoatNormalMap,Q=z&&!!M.clearcoatRoughnessMap,mt=j&&!!M.iridescenceMap,wt=j&&!!M.iridescenceThicknessMap,At=Y&&!!M.sheenColorMap,_t=Y&&!!M.sheenRoughnessMap,Gt=!!M.specularMap,Ut=!!M.specularColorMap,re=!!M.specularIntensityMap,I=xt&&!!M.transmissionMap,it=xt&&!!M.thicknessMap,G=!!M.gradientMap,$=!!M.alphaMap,ct=M.alphaTest>0,lt=!!M.alphaHash,Lt=!!M.extensions;let ue=Kn;M.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(ue=n.toneMapping);const Pe={shaderID:rt,shaderType:M.type,shaderName:M.name,vertexShader:se,fragmentShader:q,defines:M.defines,customVertexShaderID:et,customFragmentShaderID:vt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:zt,batchingColor:zt&&O._colorsTexture!==null,instancing:Rt,instancingColor:Rt&&O.instanceColor!==null,instancingMorph:Rt&&O.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:at===null?n.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:ds,alphaToCoverage:!!M.alphaToCoverage,map:ce,matcap:Wt,envMap:fe,envMapMode:fe&&K.mapping,envMapCubeUVHeight:V,aoMap:L,lightMap:$e,bumpMap:kt,normalMap:Ht,displacementMap:d&&St,emissiveMap:ae,normalMapObjectSpace:Ht&&M.normalMapType===vf,normalMapTangentSpace:Ht&&M.normalMapType===Mu,metalnessMap:yt,roughnessMap:A,anisotropy:S,anisotropyMap:ot,clearcoat:z,clearcoatMap:pt,clearcoatNormalMap:Xt,clearcoatRoughnessMap:Q,dispersion:Z,iridescence:j,iridescenceMap:mt,iridescenceThicknessMap:wt,sheen:Y,sheenColorMap:At,sheenRoughnessMap:_t,specularMap:Gt,specularColorMap:Ut,specularIntensityMap:re,transmission:xt,transmissionMap:I,thicknessMap:it,gradientMap:G,opaque:M.transparent===!1&&M.blending===is&&M.alphaToCoverage===!1,alphaMap:$,alphaTest:ct,alphaHash:lt,combine:M.combine,mapUv:ce&&g(M.map.channel),aoMapUv:L&&g(M.aoMap.channel),lightMapUv:$e&&g(M.lightMap.channel),bumpMapUv:kt&&g(M.bumpMap.channel),normalMapUv:Ht&&g(M.normalMap.channel),displacementMapUv:St&&g(M.displacementMap.channel),emissiveMapUv:ae&&g(M.emissiveMap.channel),metalnessMapUv:yt&&g(M.metalnessMap.channel),roughnessMapUv:A&&g(M.roughnessMap.channel),anisotropyMapUv:ot&&g(M.anisotropyMap.channel),clearcoatMapUv:pt&&g(M.clearcoatMap.channel),clearcoatNormalMapUv:Xt&&g(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Q&&g(M.clearcoatRoughnessMap.channel),iridescenceMapUv:mt&&g(M.iridescenceMap.channel),iridescenceThicknessMapUv:wt&&g(M.iridescenceThicknessMap.channel),sheenColorMapUv:At&&g(M.sheenColorMap.channel),sheenRoughnessMapUv:_t&&g(M.sheenRoughnessMap.channel),specularMapUv:Gt&&g(M.specularMap.channel),specularColorMapUv:Ut&&g(M.specularColorMap.channel),specularIntensityMapUv:re&&g(M.specularIntensityMap.channel),transmissionMapUv:I&&g(M.transmissionMap.channel),thicknessMapUv:it&&g(M.thicknessMap.channel),alphaMapUv:$&&g(M.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(Ht||S),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!X.attributes.uv&&(ce||$),fog:!!H,useFog:M.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Tt,skinning:O.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:Mt,morphTextureStride:Ot,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:ue,decodeVideoTexture:ce&&M.map.isVideoTexture===!0&&qt.getTransfer(M.map.colorSpace)===te,decodeVideoTextureEmissive:ae&&M.emissiveMap.isVideoTexture===!0&&qt.getTransfer(M.emissiveMap.colorSpace)===te,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===xe,flipSided:M.side===Ge,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Lt&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Lt&&M.extensions.multiDraw===!0||zt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Pe.vertexUv1s=l.has(1),Pe.vertexUv2s=l.has(2),Pe.vertexUv3s=l.has(3),l.clear(),Pe}function p(M){const x=[];if(M.shaderID?x.push(M.shaderID):(x.push(M.customVertexShaderID),x.push(M.customFragmentShaderID)),M.defines!==void 0)for(const D in M.defines)x.push(D),x.push(M.defines[D]);return M.isRawShaderMaterial===!1&&(b(x,M),y(x,M),x.push(n.outputColorSpace)),x.push(M.customProgramCacheKey),x.join()}function b(M,x){M.push(x.precision),M.push(x.outputColorSpace),M.push(x.envMapMode),M.push(x.envMapCubeUVHeight),M.push(x.mapUv),M.push(x.alphaMapUv),M.push(x.lightMapUv),M.push(x.aoMapUv),M.push(x.bumpMapUv),M.push(x.normalMapUv),M.push(x.displacementMapUv),M.push(x.emissiveMapUv),M.push(x.metalnessMapUv),M.push(x.roughnessMapUv),M.push(x.anisotropyMapUv),M.push(x.clearcoatMapUv),M.push(x.clearcoatNormalMapUv),M.push(x.clearcoatRoughnessMapUv),M.push(x.iridescenceMapUv),M.push(x.iridescenceThicknessMapUv),M.push(x.sheenColorMapUv),M.push(x.sheenRoughnessMapUv),M.push(x.specularMapUv),M.push(x.specularColorMapUv),M.push(x.specularIntensityMapUv),M.push(x.transmissionMapUv),M.push(x.thicknessMapUv),M.push(x.combine),M.push(x.fogExp2),M.push(x.sizeAttenuation),M.push(x.morphTargetsCount),M.push(x.morphAttributeCount),M.push(x.numDirLights),M.push(x.numPointLights),M.push(x.numSpotLights),M.push(x.numSpotLightMaps),M.push(x.numHemiLights),M.push(x.numRectAreaLights),M.push(x.numDirLightShadows),M.push(x.numPointLightShadows),M.push(x.numSpotLightShadows),M.push(x.numSpotLightShadowsWithMaps),M.push(x.numLightProbes),M.push(x.shadowMapType),M.push(x.toneMapping),M.push(x.numClippingPlanes),M.push(x.numClipIntersection),M.push(x.depthPacking)}function y(M,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),M.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reverseDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),M.push(o.mask)}function v(M){const x=_[M.type];let D;if(x){const F=pn[x];D=Xs.clone(F.uniforms)}else D=M.uniforms;return D}function C(M,x){let D;for(let F=0,O=h.length;F<O;F++){const H=h[F];if(H.cacheKey===x){D=H,++D.usedTimes;break}}return D===void 0&&(D=new z0(n,x,M,r),h.push(D)),D}function T(M){if(--M.usedTimes===0){const x=h.indexOf(M);h[x]=h[h.length-1],h.pop(),M.destroy()}}function w(M){c.remove(M)}function P(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:C,releaseProgram:T,releaseShaderCache:w,programs:h,dispose:P}}function V0(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function W0(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function rh(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function ah(){const n=[];let t=0;const e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(u,d,f,_,g,m){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:_,renderOrder:u.renderOrder,z:g,group:m},n[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=_,p.renderOrder=u.renderOrder,p.z=g,p.group=m),t++,p}function o(u,d,f,_,g,m){const p=a(u,d,f,_,g,m);f.transmission>0?i.push(p):f.transparent===!0?s.push(p):e.push(p)}function c(u,d,f,_,g,m){const p=a(u,d,f,_,g,m);f.transmission>0?i.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||W0),i.length>1&&i.sort(d||rh),s.length>1&&s.sort(d||rh)}function h(){for(let u=t,d=n.length;u<d;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function X0(){let n=new WeakMap;function t(i,s){const r=n.get(i);let a;return r===void 0?(a=new ah,n.set(i,[a])):s>=r.length?(a=new ah,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function Y0(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new ut};break;case"SpotLight":e={position:new R,direction:new R,color:new ut,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new ut,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new ut,groundColor:new ut};break;case"RectAreaLight":e={color:new ut,position:new R,halfWidth:new R,halfHeight:new R};break}return n[t.id]=e,e}}}function q0(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Z0=0;function $0(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function K0(n){const t=new Y0,e=q0(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new R);const s=new R,r=new Jt,a=new Jt;function o(l){let h=0,u=0,d=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let f=0,_=0,g=0,m=0,p=0,b=0,y=0,v=0,C=0,T=0,w=0;l.sort($0);for(let M=0,x=l.length;M<x;M++){const D=l[M],F=D.color,O=D.intensity,H=D.distance,X=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=F.r*O,u+=F.g*O,d+=F.b*O;else if(D.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(D.sh.coefficients[W],O);w++}else if(D.isDirectionalLight){const W=t.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const K=D.shadow,V=e.get(D);V.shadowIntensity=K.intensity,V.shadowBias=K.bias,V.shadowNormalBias=K.normalBias,V.shadowRadius=K.radius,V.shadowMapSize=K.mapSize,i.directionalShadow[f]=V,i.directionalShadowMap[f]=X,i.directionalShadowMatrix[f]=D.shadow.matrix,b++}i.directional[f]=W,f++}else if(D.isSpotLight){const W=t.get(D);W.position.setFromMatrixPosition(D.matrixWorld),W.color.copy(F).multiplyScalar(O),W.distance=H,W.coneCos=Math.cos(D.angle),W.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),W.decay=D.decay,i.spot[g]=W;const K=D.shadow;if(D.map&&(i.spotLightMap[C]=D.map,C++,K.updateMatrices(D),D.castShadow&&T++),i.spotLightMatrix[g]=K.matrix,D.castShadow){const V=e.get(D);V.shadowIntensity=K.intensity,V.shadowBias=K.bias,V.shadowNormalBias=K.normalBias,V.shadowRadius=K.radius,V.shadowMapSize=K.mapSize,i.spotShadow[g]=V,i.spotShadowMap[g]=X,v++}g++}else if(D.isRectAreaLight){const W=t.get(D);W.color.copy(F).multiplyScalar(O),W.halfWidth.set(D.width*.5,0,0),W.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=W,m++}else if(D.isPointLight){const W=t.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),W.distance=D.distance,W.decay=D.decay,D.castShadow){const K=D.shadow,V=e.get(D);V.shadowIntensity=K.intensity,V.shadowBias=K.bias,V.shadowNormalBias=K.normalBias,V.shadowRadius=K.radius,V.shadowMapSize=K.mapSize,V.shadowCameraNear=K.camera.near,V.shadowCameraFar=K.camera.far,i.pointShadow[_]=V,i.pointShadowMap[_]=X,i.pointShadowMatrix[_]=D.shadow.matrix,y++}i.point[_]=W,_++}else if(D.isHemisphereLight){const W=t.get(D);W.skyColor.copy(D.color).multiplyScalar(O),W.groundColor.copy(D.groundColor).multiplyScalar(O),i.hemi[p]=W,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=nt.LTC_FLOAT_1,i.rectAreaLTC2=nt.LTC_FLOAT_2):(i.rectAreaLTC1=nt.LTC_HALF_1,i.rectAreaLTC2=nt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const P=i.hash;(P.directionalLength!==f||P.pointLength!==_||P.spotLength!==g||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==b||P.numPointShadows!==y||P.numSpotShadows!==v||P.numSpotMaps!==C||P.numLightProbes!==w)&&(i.directional.length=f,i.spot.length=g,i.rectArea.length=m,i.point.length=_,i.hemi.length=p,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=v+C-T,i.spotLightMap.length=C,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=w,P.directionalLength=f,P.pointLength=_,P.spotLength=g,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=b,P.numPointShadows=y,P.numSpotShadows=v,P.numSpotMaps=C,P.numLightProbes=w,i.version=Z0++)}function c(l,h){let u=0,d=0,f=0,_=0,g=0;const m=h.matrixWorldInverse;for(let p=0,b=l.length;p<b;p++){const y=l[p];if(y.isDirectionalLight){const v=i.directional[u];v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),u++}else if(y.isSpotLight){const v=i.spot[f];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(y.isRectAreaLight){const v=i.rectArea[_];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),a.identity(),r.copy(y.matrixWorld),r.premultiply(m),a.extractRotation(r),v.halfWidth.set(y.width*.5,0,0),v.halfHeight.set(0,y.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),_++}else if(y.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),d++}else if(y.isHemisphereLight){const v=i.hemi[g];v.direction.setFromMatrixPosition(y.matrixWorld),v.direction.transformDirection(m),g++}}}return{setup:o,setupView:c,state:i}}function oh(n){const t=new K0(n),e=[],i=[];function s(h){l.camera=h,e.length=0,i.length=0}function r(h){e.push(h)}function a(h){i.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function j0(n){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new oh(n),t.set(s,[o])):r>=a.length?(o=new oh(n),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}const J0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Q0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function tv(n,t,e){let i=new Cl;const s=new tt,r=new tt,a=new ie,o=new Mp({depthPacking:gf}),c=new Sp,l={},h=e.maxTextureSize,u={[ni]:Ge,[Ge]:ni,[xe]:xe},d=new Fe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:J0,fragmentShader:Q0}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const _=new he;_.setAttribute("position",new Te(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new ht(_,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=iu;let p=this.type;this.render=function(T,w,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const M=n.getRenderTarget(),x=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Un),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const O=p!==Cn&&this.type===Cn,H=p===Cn&&this.type!==Cn;for(let X=0,W=T.length;X<W;X++){const K=T[X],V=K.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const rt=V.getFrameExtents();if(s.multiply(rt),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/rt.x),s.x=r.x*rt.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/rt.y),s.y=r.y*rt.y,V.mapSize.y=r.y)),V.map===null||O===!0||H===!0){const Mt=this.type!==Cn?{minFilter:un,magFilter:un}:{};V.map!==null&&V.map.dispose(),V.map=new dn(s.x,s.y,Mt),V.map.texture.name=K.name+".shadowMap",V.camera.updateProjectionMatrix()}n.setRenderTarget(V.map),n.clear();const ft=V.getViewportCount();for(let Mt=0;Mt<ft;Mt++){const Ot=V.getViewport(Mt);a.set(r.x*Ot.x,r.y*Ot.y,r.x*Ot.z,r.y*Ot.w),F.viewport(a),V.updateMatrices(K,Mt),i=V.getFrustum(),v(w,P,V.camera,K,this.type)}V.isPointLightShadow!==!0&&this.type===Cn&&b(V,P),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(M,x,D)};function b(T,w){const P=t.update(g);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new dn(s.x,s.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(w,null,P,d,g,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(w,null,P,f,g,null)}function y(T,w,P,M){let x=null;const D=P.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)x=D;else if(x=P.isPointLight===!0?c:o,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const F=x.uuid,O=w.uuid;let H=l[F];H===void 0&&(H={},l[F]=H);let X=H[O];X===void 0&&(X=x.clone(),H[O]=X,w.addEventListener("dispose",C)),x=X}if(x.visible=w.visible,x.wireframe=w.wireframe,M===Cn?x.side=w.shadowSide!==null?w.shadowSide:w.side:x.side=w.shadowSide!==null?w.shadowSide:u[w.side],x.alphaMap=w.alphaMap,x.alphaTest=w.alphaTest,x.map=w.map,x.clipShadows=w.clipShadows,x.clippingPlanes=w.clippingPlanes,x.clipIntersection=w.clipIntersection,x.displacementMap=w.displacementMap,x.displacementScale=w.displacementScale,x.displacementBias=w.displacementBias,x.wireframeLinewidth=w.wireframeLinewidth,x.linewidth=w.linewidth,P.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const F=n.properties.get(x);F.light=P}return x}function v(T,w,P,M,x){if(T.visible===!1)return;if(T.layers.test(w.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&x===Cn)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,T.matrixWorld);const O=t.update(T),H=T.material;if(Array.isArray(H)){const X=O.groups;for(let W=0,K=X.length;W<K;W++){const V=X[W],rt=H[V.materialIndex];if(rt&&rt.visible){const ft=y(T,rt,M,x);T.onBeforeShadow(n,T,w,P,O,ft,V),n.renderBufferDirect(P,null,O,ft,T,V),T.onAfterShadow(n,T,w,P,O,ft,V)}}}else if(H.visible){const X=y(T,H,M,x);T.onBeforeShadow(n,T,w,P,O,X,null),n.renderBufferDirect(P,null,O,X,T,null),T.onAfterShadow(n,T,w,P,O,X,null)}}const F=T.children;for(let O=0,H=F.length;O<H;O++)v(F[O],w,P,M,x)}function C(T){T.target.removeEventListener("dispose",C);for(const P in l){const M=l[P],x=T.target.uuid;x in M&&(M[x].dispose(),delete M[x])}}}const ev={[So]:bo,[Eo]:Ao,[wo]:Co,[os]:To,[bo]:So,[Ao]:Eo,[Co]:wo,[To]:os};function nv(n,t){function e(){let I=!1;const it=new ie;let G=null;const $=new ie(0,0,0,0);return{setMask:function(ct){G!==ct&&!I&&(n.colorMask(ct,ct,ct,ct),G=ct)},setLocked:function(ct){I=ct},setClear:function(ct,lt,Lt,ue,Pe){Pe===!0&&(ct*=ue,lt*=ue,Lt*=ue),it.set(ct,lt,Lt,ue),$.equals(it)===!1&&(n.clearColor(ct,lt,Lt,ue),$.copy(it))},reset:function(){I=!1,G=null,$.set(-1,0,0,0)}}}function i(){let I=!1,it=!1,G=null,$=null,ct=null;return{setReversed:function(lt){if(it!==lt){const Lt=t.get("EXT_clip_control");it?Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.ZERO_TO_ONE_EXT):Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.NEGATIVE_ONE_TO_ONE_EXT);const ue=ct;ct=null,this.setClear(ue)}it=lt},getReversed:function(){return it},setTest:function(lt){lt?at(n.DEPTH_TEST):Tt(n.DEPTH_TEST)},setMask:function(lt){G!==lt&&!I&&(n.depthMask(lt),G=lt)},setFunc:function(lt){if(it&&(lt=ev[lt]),$!==lt){switch(lt){case So:n.depthFunc(n.NEVER);break;case bo:n.depthFunc(n.ALWAYS);break;case Eo:n.depthFunc(n.LESS);break;case os:n.depthFunc(n.LEQUAL);break;case wo:n.depthFunc(n.EQUAL);break;case To:n.depthFunc(n.GEQUAL);break;case Ao:n.depthFunc(n.GREATER);break;case Co:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}$=lt}},setLocked:function(lt){I=lt},setClear:function(lt){ct!==lt&&(it&&(lt=1-lt),n.clearDepth(lt),ct=lt)},reset:function(){I=!1,G=null,$=null,ct=null,it=!1}}}function s(){let I=!1,it=null,G=null,$=null,ct=null,lt=null,Lt=null,ue=null,Pe=null;return{setTest:function(Qt){I||(Qt?at(n.STENCIL_TEST):Tt(n.STENCIL_TEST))},setMask:function(Qt){it!==Qt&&!I&&(n.stencilMask(Qt),it=Qt)},setFunc:function(Qt,sn,Mn){(G!==Qt||$!==sn||ct!==Mn)&&(n.stencilFunc(Qt,sn,Mn),G=Qt,$=sn,ct=Mn)},setOp:function(Qt,sn,Mn){(lt!==Qt||Lt!==sn||ue!==Mn)&&(n.stencilOp(Qt,sn,Mn),lt=Qt,Lt=sn,ue=Mn)},setLocked:function(Qt){I=Qt},setClear:function(Qt){Pe!==Qt&&(n.clearStencil(Qt),Pe=Qt)},reset:function(){I=!1,it=null,G=null,$=null,ct=null,lt=null,Lt=null,ue=null,Pe=null}}}const r=new e,a=new i,o=new s,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],_=null,g=!1,m=null,p=null,b=null,y=null,v=null,C=null,T=null,w=new ut(0,0,0),P=0,M=!1,x=null,D=null,F=null,O=null,H=null;const X=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,K=0;const V=n.getParameter(n.VERSION);V.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(V)[1]),W=K>=1):V.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),W=K>=2);let rt=null,ft={};const Mt=n.getParameter(n.SCISSOR_BOX),Ot=n.getParameter(n.VIEWPORT),se=new ie().fromArray(Mt),q=new ie().fromArray(Ot);function et(I,it,G,$){const ct=new Uint8Array(4),lt=n.createTexture();n.bindTexture(I,lt),n.texParameteri(I,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(I,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Lt=0;Lt<G;Lt++)I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY?n.texImage3D(it,0,n.RGBA,1,1,$,0,n.RGBA,n.UNSIGNED_BYTE,ct):n.texImage2D(it+Lt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ct);return lt}const vt={};vt[n.TEXTURE_2D]=et(n.TEXTURE_2D,n.TEXTURE_2D,1),vt[n.TEXTURE_CUBE_MAP]=et(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),vt[n.TEXTURE_2D_ARRAY]=et(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),vt[n.TEXTURE_3D]=et(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),at(n.DEPTH_TEST),a.setFunc(os),kt(!1),Ht(jl),at(n.CULL_FACE),L(Un);function at(I){h[I]!==!0&&(n.enable(I),h[I]=!0)}function Tt(I){h[I]!==!1&&(n.disable(I),h[I]=!1)}function Rt(I,it){return u[I]!==it?(n.bindFramebuffer(I,it),u[I]=it,I===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=it),I===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=it),!0):!1}function zt(I,it){let G=f,$=!1;if(I){G=d.get(it),G===void 0&&(G=[],d.set(it,G));const ct=I.textures;if(G.length!==ct.length||G[0]!==n.COLOR_ATTACHMENT0){for(let lt=0,Lt=ct.length;lt<Lt;lt++)G[lt]=n.COLOR_ATTACHMENT0+lt;G.length=ct.length,$=!0}}else G[0]!==n.BACK&&(G[0]=n.BACK,$=!0);$&&n.drawBuffers(G)}function ce(I){return _!==I?(n.useProgram(I),_=I,!0):!1}const Wt={[fi]:n.FUNC_ADD,[Zd]:n.FUNC_SUBTRACT,[$d]:n.FUNC_REVERSE_SUBTRACT};Wt[Kd]=n.MIN,Wt[jd]=n.MAX;const fe={[Jd]:n.ZERO,[Qd]:n.ONE,[tf]:n.SRC_COLOR,[yo]:n.SRC_ALPHA,[of]:n.SRC_ALPHA_SATURATE,[rf]:n.DST_COLOR,[nf]:n.DST_ALPHA,[ef]:n.ONE_MINUS_SRC_COLOR,[Mo]:n.ONE_MINUS_SRC_ALPHA,[af]:n.ONE_MINUS_DST_COLOR,[sf]:n.ONE_MINUS_DST_ALPHA,[lf]:n.CONSTANT_COLOR,[cf]:n.ONE_MINUS_CONSTANT_COLOR,[hf]:n.CONSTANT_ALPHA,[uf]:n.ONE_MINUS_CONSTANT_ALPHA};function L(I,it,G,$,ct,lt,Lt,ue,Pe,Qt){if(I===Un){g===!0&&(Tt(n.BLEND),g=!1);return}if(g===!1&&(at(n.BLEND),g=!0),I!==qd){if(I!==m||Qt!==M){if((p!==fi||v!==fi)&&(n.blendEquation(n.FUNC_ADD),p=fi,v=fi),Qt)switch(I){case is:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Si:n.blendFunc(n.ONE,n.ONE);break;case Jl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ql:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case is:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Si:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Jl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ql:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}b=null,y=null,C=null,T=null,w.set(0,0,0),P=0,m=I,M=Qt}return}ct=ct||it,lt=lt||G,Lt=Lt||$,(it!==p||ct!==v)&&(n.blendEquationSeparate(Wt[it],Wt[ct]),p=it,v=ct),(G!==b||$!==y||lt!==C||Lt!==T)&&(n.blendFuncSeparate(fe[G],fe[$],fe[lt],fe[Lt]),b=G,y=$,C=lt,T=Lt),(ue.equals(w)===!1||Pe!==P)&&(n.blendColor(ue.r,ue.g,ue.b,Pe),w.copy(ue),P=Pe),m=I,M=!1}function $e(I,it){I.side===xe?Tt(n.CULL_FACE):at(n.CULL_FACE);let G=I.side===Ge;it&&(G=!G),kt(G),I.blending===is&&I.transparent===!1?L(Un):L(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);const $=I.stencilWrite;o.setTest($),$&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ae(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?at(n.SAMPLE_ALPHA_TO_COVERAGE):Tt(n.SAMPLE_ALPHA_TO_COVERAGE)}function kt(I){x!==I&&(I?n.frontFace(n.CW):n.frontFace(n.CCW),x=I)}function Ht(I){I!==Wd?(at(n.CULL_FACE),I!==D&&(I===jl?n.cullFace(n.BACK):I===Xd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Tt(n.CULL_FACE),D=I}function St(I){I!==F&&(W&&n.lineWidth(I),F=I)}function ae(I,it,G){I?(at(n.POLYGON_OFFSET_FILL),(O!==it||H!==G)&&(n.polygonOffset(it,G),O=it,H=G)):Tt(n.POLYGON_OFFSET_FILL)}function yt(I){I?at(n.SCISSOR_TEST):Tt(n.SCISSOR_TEST)}function A(I){I===void 0&&(I=n.TEXTURE0+X-1),rt!==I&&(n.activeTexture(I),rt=I)}function S(I,it,G){G===void 0&&(rt===null?G=n.TEXTURE0+X-1:G=rt);let $=ft[G];$===void 0&&($={type:void 0,texture:void 0},ft[G]=$),($.type!==I||$.texture!==it)&&(rt!==G&&(n.activeTexture(G),rt=G),n.bindTexture(I,it||vt[I]),$.type=I,$.texture=it)}function z(){const I=ft[rt];I!==void 0&&I.type!==void 0&&(n.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function Z(){try{n.compressedTexImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function j(){try{n.compressedTexImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Y(){try{n.texSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function xt(){try{n.texSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ot(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function pt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Xt(){try{n.texStorage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Q(){try{n.texStorage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function mt(){try{n.texImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function wt(){try{n.texImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function At(I){se.equals(I)===!1&&(n.scissor(I.x,I.y,I.z,I.w),se.copy(I))}function _t(I){q.equals(I)===!1&&(n.viewport(I.x,I.y,I.z,I.w),q.copy(I))}function Gt(I,it){let G=l.get(it);G===void 0&&(G=new WeakMap,l.set(it,G));let $=G.get(I);$===void 0&&($=n.getUniformBlockIndex(it,I.name),G.set(I,$))}function Ut(I,it){const $=l.get(it).get(I);c.get(it)!==$&&(n.uniformBlockBinding(it,$,I.__bindingPointIndex),c.set(it,$))}function re(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},rt=null,ft={},u={},d=new WeakMap,f=[],_=null,g=!1,m=null,p=null,b=null,y=null,v=null,C=null,T=null,w=new ut(0,0,0),P=0,M=!1,x=null,D=null,F=null,O=null,H=null,se.set(0,0,n.canvas.width,n.canvas.height),q.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:at,disable:Tt,bindFramebuffer:Rt,drawBuffers:zt,useProgram:ce,setBlending:L,setMaterial:$e,setFlipSided:kt,setCullFace:Ht,setLineWidth:St,setPolygonOffset:ae,setScissorTest:yt,activeTexture:A,bindTexture:S,unbindTexture:z,compressedTexImage2D:Z,compressedTexImage3D:j,texImage2D:mt,texImage3D:wt,updateUBOMapping:Gt,uniformBlockBinding:Ut,texStorage2D:Xt,texStorage3D:Q,texSubImage2D:Y,texSubImage3D:xt,compressedTexSubImage2D:ot,compressedTexSubImage3D:pt,scissor:At,viewport:_t,reset:re}}function iv(n,t,e,i,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new tt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(A,S){return f?new OffscreenCanvas(A,S):na("canvas")}function g(A,S,z){let Z=1;const j=yt(A);if((j.width>z||j.height>z)&&(Z=z/Math.max(j.width,j.height)),Z<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const Y=Math.floor(Z*j.width),xt=Math.floor(Z*j.height);u===void 0&&(u=_(Y,xt));const ot=S?_(Y,xt):u;return ot.width=Y,ot.height=xt,ot.getContext("2d").drawImage(A,0,0,Y,xt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+Y+"x"+xt+")."),ot}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),A;return A}function m(A){return A.generateMipmaps}function p(A){n.generateMipmap(A)}function b(A){return A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?n.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(A,S,z,Z,j=!1){if(A!==null){if(n[A]!==void 0)return n[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let Y=S;if(S===n.RED&&(z===n.FLOAT&&(Y=n.R32F),z===n.HALF_FLOAT&&(Y=n.R16F),z===n.UNSIGNED_BYTE&&(Y=n.R8)),S===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&(Y=n.R8UI),z===n.UNSIGNED_SHORT&&(Y=n.R16UI),z===n.UNSIGNED_INT&&(Y=n.R32UI),z===n.BYTE&&(Y=n.R8I),z===n.SHORT&&(Y=n.R16I),z===n.INT&&(Y=n.R32I)),S===n.RG&&(z===n.FLOAT&&(Y=n.RG32F),z===n.HALF_FLOAT&&(Y=n.RG16F),z===n.UNSIGNED_BYTE&&(Y=n.RG8)),S===n.RG_INTEGER&&(z===n.UNSIGNED_BYTE&&(Y=n.RG8UI),z===n.UNSIGNED_SHORT&&(Y=n.RG16UI),z===n.UNSIGNED_INT&&(Y=n.RG32UI),z===n.BYTE&&(Y=n.RG8I),z===n.SHORT&&(Y=n.RG16I),z===n.INT&&(Y=n.RG32I)),S===n.RGB_INTEGER&&(z===n.UNSIGNED_BYTE&&(Y=n.RGB8UI),z===n.UNSIGNED_SHORT&&(Y=n.RGB16UI),z===n.UNSIGNED_INT&&(Y=n.RGB32UI),z===n.BYTE&&(Y=n.RGB8I),z===n.SHORT&&(Y=n.RGB16I),z===n.INT&&(Y=n.RGB32I)),S===n.RGBA_INTEGER&&(z===n.UNSIGNED_BYTE&&(Y=n.RGBA8UI),z===n.UNSIGNED_SHORT&&(Y=n.RGBA16UI),z===n.UNSIGNED_INT&&(Y=n.RGBA32UI),z===n.BYTE&&(Y=n.RGBA8I),z===n.SHORT&&(Y=n.RGBA16I),z===n.INT&&(Y=n.RGBA32I)),S===n.RGB&&z===n.UNSIGNED_INT_5_9_9_9_REV&&(Y=n.RGB9_E5),S===n.RGBA){const xt=j?ta:qt.getTransfer(Z);z===n.FLOAT&&(Y=n.RGBA32F),z===n.HALF_FLOAT&&(Y=n.RGBA16F),z===n.UNSIGNED_BYTE&&(Y=xt===te?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT_4_4_4_4&&(Y=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&(Y=n.RGB5_A1)}return(Y===n.R16F||Y===n.R32F||Y===n.RG16F||Y===n.RG32F||Y===n.RGBA16F||Y===n.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function v(A,S){let z;return A?S===null||S===bi||S===hs?z=n.DEPTH24_STENCIL8:S===Dn?z=n.DEPTH32F_STENCIL8:S===Ws&&(z=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===bi||S===hs?z=n.DEPTH_COMPONENT24:S===Dn?z=n.DEPTH_COMPONENT32F:S===Ws&&(z=n.DEPTH_COMPONENT16),z}function C(A,S){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==un&&A.minFilter!==gn?Math.log2(Math.max(S.width,S.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?S.mipmaps.length:1}function T(A){const S=A.target;S.removeEventListener("dispose",T),P(S),S.isVideoTexture&&h.delete(S)}function w(A){const S=A.target;S.removeEventListener("dispose",w),x(S)}function P(A){const S=i.get(A);if(S.__webglInit===void 0)return;const z=A.source,Z=d.get(z);if(Z){const j=Z[S.__cacheKey];j.usedTimes--,j.usedTimes===0&&M(A),Object.keys(Z).length===0&&d.delete(z)}i.remove(A)}function M(A){const S=i.get(A);n.deleteTexture(S.__webglTexture);const z=A.source,Z=d.get(z);delete Z[S.__cacheKey],a.memory.textures--}function x(A){const S=i.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),i.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(S.__webglFramebuffer[Z]))for(let j=0;j<S.__webglFramebuffer[Z].length;j++)n.deleteFramebuffer(S.__webglFramebuffer[Z][j]);else n.deleteFramebuffer(S.__webglFramebuffer[Z]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[Z])}else{if(Array.isArray(S.__webglFramebuffer))for(let Z=0;Z<S.__webglFramebuffer.length;Z++)n.deleteFramebuffer(S.__webglFramebuffer[Z]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Z=0;Z<S.__webglColorRenderbuffer.length;Z++)S.__webglColorRenderbuffer[Z]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[Z]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const z=A.textures;for(let Z=0,j=z.length;Z<j;Z++){const Y=i.get(z[Z]);Y.__webglTexture&&(n.deleteTexture(Y.__webglTexture),a.memory.textures--),i.remove(z[Z])}i.remove(A)}let D=0;function F(){D=0}function O(){const A=D;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),D+=1,A}function H(A){const S=[];return S.push(A.wrapS),S.push(A.wrapT),S.push(A.wrapR||0),S.push(A.magFilter),S.push(A.minFilter),S.push(A.anisotropy),S.push(A.internalFormat),S.push(A.format),S.push(A.type),S.push(A.generateMipmaps),S.push(A.premultiplyAlpha),S.push(A.flipY),S.push(A.unpackAlignment),S.push(A.colorSpace),S.join()}function X(A,S){const z=i.get(A);if(A.isVideoTexture&&St(A),A.isRenderTargetTexture===!1&&A.version>0&&z.__version!==A.version){const Z=A.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(z,A,S);return}}e.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+S)}function W(A,S){const z=i.get(A);if(A.version>0&&z.__version!==A.version){q(z,A,S);return}e.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+S)}function K(A,S){const z=i.get(A);if(A.version>0&&z.__version!==A.version){q(z,A,S);return}e.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+S)}function V(A,S){const z=i.get(A);if(A.version>0&&z.__version!==A.version){et(z,A,S);return}e.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+S)}const rt={[Vs]:n.REPEAT,[_i]:n.CLAMP_TO_EDGE,[Do]:n.MIRRORED_REPEAT},ft={[un]:n.NEAREST,[mf]:n.NEAREST_MIPMAP_NEAREST,[ur]:n.NEAREST_MIPMAP_LINEAR,[gn]:n.LINEAR,[Sa]:n.LINEAR_MIPMAP_NEAREST,[gi]:n.LINEAR_MIPMAP_LINEAR},Mt={[xf]:n.NEVER,[wf]:n.ALWAYS,[yf]:n.LESS,[Su]:n.LEQUAL,[Mf]:n.EQUAL,[Ef]:n.GEQUAL,[Sf]:n.GREATER,[bf]:n.NOTEQUAL};function Ot(A,S){if(S.type===Dn&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===gn||S.magFilter===Sa||S.magFilter===ur||S.magFilter===gi||S.minFilter===gn||S.minFilter===Sa||S.minFilter===ur||S.minFilter===gi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(A,n.TEXTURE_WRAP_S,rt[S.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,rt[S.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,rt[S.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,ft[S.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,ft[S.minFilter]),S.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,Mt[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===un||S.minFilter!==ur&&S.minFilter!==gi||S.type===Dn&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");n.texParameterf(A,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function se(A,S){let z=!1;A.__webglInit===void 0&&(A.__webglInit=!0,S.addEventListener("dispose",T));const Z=S.source;let j=d.get(Z);j===void 0&&(j={},d.set(Z,j));const Y=H(S);if(Y!==A.__cacheKey){j[Y]===void 0&&(j[Y]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,z=!0),j[Y].usedTimes++;const xt=j[A.__cacheKey];xt!==void 0&&(j[A.__cacheKey].usedTimes--,xt.usedTimes===0&&M(S)),A.__cacheKey=Y,A.__webglTexture=j[Y].texture}return z}function q(A,S,z){let Z=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Z=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Z=n.TEXTURE_3D);const j=se(A,S),Y=S.source;e.bindTexture(Z,A.__webglTexture,n.TEXTURE0+z);const xt=i.get(Y);if(Y.version!==xt.__version||j===!0){e.activeTexture(n.TEXTURE0+z);const ot=qt.getPrimaries(qt.workingColorSpace),pt=S.colorSpace===Yn?null:qt.getPrimaries(S.colorSpace),Xt=S.colorSpace===Yn||ot===pt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt);let Q=g(S.image,!1,s.maxTextureSize);Q=ae(S,Q);const mt=r.convert(S.format,S.colorSpace),wt=r.convert(S.type);let At=y(S.internalFormat,mt,wt,S.colorSpace,S.isVideoTexture);Ot(Z,S);let _t;const Gt=S.mipmaps,Ut=S.isVideoTexture!==!0,re=xt.__version===void 0||j===!0,I=Y.dataReady,it=C(S,Q);if(S.isDepthTexture)At=v(S.format===us,S.type),re&&(Ut?e.texStorage2D(n.TEXTURE_2D,1,At,Q.width,Q.height):e.texImage2D(n.TEXTURE_2D,0,At,Q.width,Q.height,0,mt,wt,null));else if(S.isDataTexture)if(Gt.length>0){Ut&&re&&e.texStorage2D(n.TEXTURE_2D,it,At,Gt[0].width,Gt[0].height);for(let G=0,$=Gt.length;G<$;G++)_t=Gt[G],Ut?I&&e.texSubImage2D(n.TEXTURE_2D,G,0,0,_t.width,_t.height,mt,wt,_t.data):e.texImage2D(n.TEXTURE_2D,G,At,_t.width,_t.height,0,mt,wt,_t.data);S.generateMipmaps=!1}else Ut?(re&&e.texStorage2D(n.TEXTURE_2D,it,At,Q.width,Q.height),I&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Q.width,Q.height,mt,wt,Q.data)):e.texImage2D(n.TEXTURE_2D,0,At,Q.width,Q.height,0,mt,wt,Q.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ut&&re&&e.texStorage3D(n.TEXTURE_2D_ARRAY,it,At,Gt[0].width,Gt[0].height,Q.depth);for(let G=0,$=Gt.length;G<$;G++)if(_t=Gt[G],S.format!==cn)if(mt!==null)if(Ut){if(I)if(S.layerUpdates.size>0){const ct=Oc(_t.width,_t.height,S.format,S.type);for(const lt of S.layerUpdates){const Lt=_t.data.subarray(lt*ct/_t.data.BYTES_PER_ELEMENT,(lt+1)*ct/_t.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,G,0,0,lt,_t.width,_t.height,1,mt,Lt)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,G,0,0,0,_t.width,_t.height,Q.depth,mt,_t.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,G,At,_t.width,_t.height,Q.depth,0,_t.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ut?I&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,G,0,0,0,_t.width,_t.height,Q.depth,mt,wt,_t.data):e.texImage3D(n.TEXTURE_2D_ARRAY,G,At,_t.width,_t.height,Q.depth,0,mt,wt,_t.data)}else{Ut&&re&&e.texStorage2D(n.TEXTURE_2D,it,At,Gt[0].width,Gt[0].height);for(let G=0,$=Gt.length;G<$;G++)_t=Gt[G],S.format!==cn?mt!==null?Ut?I&&e.compressedTexSubImage2D(n.TEXTURE_2D,G,0,0,_t.width,_t.height,mt,_t.data):e.compressedTexImage2D(n.TEXTURE_2D,G,At,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ut?I&&e.texSubImage2D(n.TEXTURE_2D,G,0,0,_t.width,_t.height,mt,wt,_t.data):e.texImage2D(n.TEXTURE_2D,G,At,_t.width,_t.height,0,mt,wt,_t.data)}else if(S.isDataArrayTexture)if(Ut){if(re&&e.texStorage3D(n.TEXTURE_2D_ARRAY,it,At,Q.width,Q.height,Q.depth),I)if(S.layerUpdates.size>0){const G=Oc(Q.width,Q.height,S.format,S.type);for(const $ of S.layerUpdates){const ct=Q.data.subarray($*G/Q.data.BYTES_PER_ELEMENT,($+1)*G/Q.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,$,Q.width,Q.height,1,mt,wt,ct)}S.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,mt,wt,Q.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,At,Q.width,Q.height,Q.depth,0,mt,wt,Q.data);else if(S.isData3DTexture)Ut?(re&&e.texStorage3D(n.TEXTURE_3D,it,At,Q.width,Q.height,Q.depth),I&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,mt,wt,Q.data)):e.texImage3D(n.TEXTURE_3D,0,At,Q.width,Q.height,Q.depth,0,mt,wt,Q.data);else if(S.isFramebufferTexture){if(re)if(Ut)e.texStorage2D(n.TEXTURE_2D,it,At,Q.width,Q.height);else{let G=Q.width,$=Q.height;for(let ct=0;ct<it;ct++)e.texImage2D(n.TEXTURE_2D,ct,At,G,$,0,mt,wt,null),G>>=1,$>>=1}}else if(Gt.length>0){if(Ut&&re){const G=yt(Gt[0]);e.texStorage2D(n.TEXTURE_2D,it,At,G.width,G.height)}for(let G=0,$=Gt.length;G<$;G++)_t=Gt[G],Ut?I&&e.texSubImage2D(n.TEXTURE_2D,G,0,0,mt,wt,_t):e.texImage2D(n.TEXTURE_2D,G,At,mt,wt,_t);S.generateMipmaps=!1}else if(Ut){if(re){const G=yt(Q);e.texStorage2D(n.TEXTURE_2D,it,At,G.width,G.height)}I&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,mt,wt,Q)}else e.texImage2D(n.TEXTURE_2D,0,At,mt,wt,Q);m(S)&&p(Z),xt.__version=Y.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function et(A,S,z){if(S.image.length!==6)return;const Z=se(A,S),j=S.source;e.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+z);const Y=i.get(j);if(j.version!==Y.__version||Z===!0){e.activeTexture(n.TEXTURE0+z);const xt=qt.getPrimaries(qt.workingColorSpace),ot=S.colorSpace===Yn?null:qt.getPrimaries(S.colorSpace),pt=S.colorSpace===Yn||xt===ot?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt);const Xt=S.isCompressedTexture||S.image[0].isCompressedTexture,Q=S.image[0]&&S.image[0].isDataTexture,mt=[];for(let $=0;$<6;$++)!Xt&&!Q?mt[$]=g(S.image[$],!0,s.maxCubemapSize):mt[$]=Q?S.image[$].image:S.image[$],mt[$]=ae(S,mt[$]);const wt=mt[0],At=r.convert(S.format,S.colorSpace),_t=r.convert(S.type),Gt=y(S.internalFormat,At,_t,S.colorSpace),Ut=S.isVideoTexture!==!0,re=Y.__version===void 0||Z===!0,I=j.dataReady;let it=C(S,wt);Ot(n.TEXTURE_CUBE_MAP,S);let G;if(Xt){Ut&&re&&e.texStorage2D(n.TEXTURE_CUBE_MAP,it,Gt,wt.width,wt.height);for(let $=0;$<6;$++){G=mt[$].mipmaps;for(let ct=0;ct<G.length;ct++){const lt=G[ct];S.format!==cn?At!==null?Ut?I&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct,0,0,lt.width,lt.height,At,lt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct,Gt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ut?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct,0,0,lt.width,lt.height,At,_t,lt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct,Gt,lt.width,lt.height,0,At,_t,lt.data)}}}else{if(G=S.mipmaps,Ut&&re){G.length>0&&it++;const $=yt(mt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,it,Gt,$.width,$.height)}for(let $=0;$<6;$++)if(Q){Ut?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,mt[$].width,mt[$].height,At,_t,mt[$].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Gt,mt[$].width,mt[$].height,0,At,_t,mt[$].data);for(let ct=0;ct<G.length;ct++){const Lt=G[ct].image[$].image;Ut?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct+1,0,0,Lt.width,Lt.height,At,_t,Lt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct+1,Gt,Lt.width,Lt.height,0,At,_t,Lt.data)}}else{Ut?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,At,_t,mt[$]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Gt,At,_t,mt[$]);for(let ct=0;ct<G.length;ct++){const lt=G[ct];Ut?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct+1,0,0,At,_t,lt.image[$]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct+1,Gt,At,_t,lt.image[$])}}}m(S)&&p(n.TEXTURE_CUBE_MAP),Y.__version=j.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function vt(A,S,z,Z,j,Y){const xt=r.convert(z.format,z.colorSpace),ot=r.convert(z.type),pt=y(z.internalFormat,xt,ot,z.colorSpace),Xt=i.get(S),Q=i.get(z);if(Q.__renderTarget=S,!Xt.__hasExternalTextures){const mt=Math.max(1,S.width>>Y),wt=Math.max(1,S.height>>Y);j===n.TEXTURE_3D||j===n.TEXTURE_2D_ARRAY?e.texImage3D(j,Y,pt,mt,wt,S.depth,0,xt,ot,null):e.texImage2D(j,Y,pt,mt,wt,0,xt,ot,null)}e.bindFramebuffer(n.FRAMEBUFFER,A),Ht(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,j,Q.__webglTexture,0,kt(S)):(j===n.TEXTURE_2D||j>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Z,j,Q.__webglTexture,Y),e.bindFramebuffer(n.FRAMEBUFFER,null)}function at(A,S,z){if(n.bindRenderbuffer(n.RENDERBUFFER,A),S.depthBuffer){const Z=S.depthTexture,j=Z&&Z.isDepthTexture?Z.type:null,Y=v(S.stencilBuffer,j),xt=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ot=kt(S);Ht(S)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ot,Y,S.width,S.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,ot,Y,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,Y,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,xt,n.RENDERBUFFER,A)}else{const Z=S.textures;for(let j=0;j<Z.length;j++){const Y=Z[j],xt=r.convert(Y.format,Y.colorSpace),ot=r.convert(Y.type),pt=y(Y.internalFormat,xt,ot,Y.colorSpace),Xt=kt(S);z&&Ht(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Xt,pt,S.width,S.height):Ht(S)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Xt,pt,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,pt,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Tt(A,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,A),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=i.get(S.depthTexture);Z.__renderTarget=S,(!Z.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),X(S.depthTexture,0);const j=Z.__webglTexture,Y=kt(S);if(S.depthTexture.format===ss)Ht(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,j,0,Y):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,j,0);else if(S.depthTexture.format===us)Ht(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,j,0,Y):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Rt(A){const S=i.get(A),z=A.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==A.depthTexture){const Z=A.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Z){const j=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Z.removeEventListener("dispose",j)};Z.addEventListener("dispose",j),S.__depthDisposeCallback=j}S.__boundDepthTexture=Z}if(A.depthTexture&&!S.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Tt(S.__webglFramebuffer,A)}else if(z){S.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[Z]),S.__webglDepthbuffer[Z]===void 0)S.__webglDepthbuffer[Z]=n.createRenderbuffer(),at(S.__webglDepthbuffer[Z],A,!1);else{const j=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Y=S.__webglDepthbuffer[Z];n.bindRenderbuffer(n.RENDERBUFFER,Y),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,Y)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),at(S.__webglDepthbuffer,A,!1);else{const Z=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,j=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,j),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,j)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function zt(A,S,z){const Z=i.get(A);S!==void 0&&vt(Z.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&Rt(A)}function ce(A){const S=A.texture,z=i.get(A),Z=i.get(S);A.addEventListener("dispose",w);const j=A.textures,Y=A.isWebGLCubeRenderTarget===!0,xt=j.length>1;if(xt||(Z.__webglTexture===void 0&&(Z.__webglTexture=n.createTexture()),Z.__version=S.version,a.memory.textures++),Y){z.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer[ot]=[];for(let pt=0;pt<S.mipmaps.length;pt++)z.__webglFramebuffer[ot][pt]=n.createFramebuffer()}else z.__webglFramebuffer[ot]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer=[];for(let ot=0;ot<S.mipmaps.length;ot++)z.__webglFramebuffer[ot]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(xt)for(let ot=0,pt=j.length;ot<pt;ot++){const Xt=i.get(j[ot]);Xt.__webglTexture===void 0&&(Xt.__webglTexture=n.createTexture(),a.memory.textures++)}if(A.samples>0&&Ht(A)===!1){z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ot=0;ot<j.length;ot++){const pt=j[ot];z.__webglColorRenderbuffer[ot]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[ot]);const Xt=r.convert(pt.format,pt.colorSpace),Q=r.convert(pt.type),mt=y(pt.internalFormat,Xt,Q,pt.colorSpace,A.isXRRenderTarget===!0),wt=kt(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,wt,mt,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ot,n.RENDERBUFFER,z.__webglColorRenderbuffer[ot])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),at(z.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Y){e.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),Ot(n.TEXTURE_CUBE_MAP,S);for(let ot=0;ot<6;ot++)if(S.mipmaps&&S.mipmaps.length>0)for(let pt=0;pt<S.mipmaps.length;pt++)vt(z.__webglFramebuffer[ot][pt],A,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,pt);else vt(z.__webglFramebuffer[ot],A,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);m(S)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(xt){for(let ot=0,pt=j.length;ot<pt;ot++){const Xt=j[ot],Q=i.get(Xt);e.bindTexture(n.TEXTURE_2D,Q.__webglTexture),Ot(n.TEXTURE_2D,Xt),vt(z.__webglFramebuffer,A,Xt,n.COLOR_ATTACHMENT0+ot,n.TEXTURE_2D,0),m(Xt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let ot=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ot=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(ot,Z.__webglTexture),Ot(ot,S),S.mipmaps&&S.mipmaps.length>0)for(let pt=0;pt<S.mipmaps.length;pt++)vt(z.__webglFramebuffer[pt],A,S,n.COLOR_ATTACHMENT0,ot,pt);else vt(z.__webglFramebuffer,A,S,n.COLOR_ATTACHMENT0,ot,0);m(S)&&p(ot),e.unbindTexture()}A.depthBuffer&&Rt(A)}function Wt(A){const S=A.textures;for(let z=0,Z=S.length;z<Z;z++){const j=S[z];if(m(j)){const Y=b(A),xt=i.get(j).__webglTexture;e.bindTexture(Y,xt),p(Y),e.unbindTexture()}}}const fe=[],L=[];function $e(A){if(A.samples>0){if(Ht(A)===!1){const S=A.textures,z=A.width,Z=A.height;let j=n.COLOR_BUFFER_BIT;const Y=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,xt=i.get(A),ot=S.length>1;if(ot)for(let pt=0;pt<S.length;pt++)e.bindFramebuffer(n.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,xt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,xt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,xt.__webglFramebuffer);for(let pt=0;pt<S.length;pt++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(j|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(j|=n.STENCIL_BUFFER_BIT)),ot){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,xt.__webglColorRenderbuffer[pt]);const Xt=i.get(S[pt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Xt,0)}n.blitFramebuffer(0,0,z,Z,0,0,z,Z,j,n.NEAREST),c===!0&&(fe.length=0,L.length=0,fe.push(n.COLOR_ATTACHMENT0+pt),A.depthBuffer&&A.resolveDepthBuffer===!1&&(fe.push(Y),L.push(Y),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,L)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,fe))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ot)for(let pt=0;pt<S.length;pt++){e.bindFramebuffer(n.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.RENDERBUFFER,xt.__webglColorRenderbuffer[pt]);const Xt=i.get(S[pt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,xt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.TEXTURE_2D,Xt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,xt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const S=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function kt(A){return Math.min(s.maxSamples,A.samples)}function Ht(A){const S=i.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function St(A){const S=a.render.frame;h.get(A)!==S&&(h.set(A,S),A.update())}function ae(A,S){const z=A.colorSpace,Z=A.format,j=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||z!==ds&&z!==Yn&&(qt.getTransfer(z)===te?(Z!==cn||j!==On)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),S}function yt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=O,this.resetTextureUnits=F,this.setTexture2D=X,this.setTexture2DArray=W,this.setTexture3D=K,this.setTextureCube=V,this.rebindTextures=zt,this.setupRenderTarget=ce,this.updateRenderTargetMipmap=Wt,this.updateMultisampleRenderTarget=$e,this.setupDepthRenderbuffer=Rt,this.setupFrameBufferTexture=vt,this.useMultisampledRTT=Ht}function sv(n,t){function e(i,s=Yn){let r;const a=qt.getTransfer(s);if(i===On)return n.UNSIGNED_BYTE;if(i===Sl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===bl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===fu)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===uu)return n.BYTE;if(i===du)return n.SHORT;if(i===Ws)return n.UNSIGNED_SHORT;if(i===Ml)return n.INT;if(i===bi)return n.UNSIGNED_INT;if(i===Dn)return n.FLOAT;if(i===Nn)return n.HALF_FLOAT;if(i===pu)return n.ALPHA;if(i===mu)return n.RGB;if(i===cn)return n.RGBA;if(i===_u)return n.LUMINANCE;if(i===gu)return n.LUMINANCE_ALPHA;if(i===ss)return n.DEPTH_COMPONENT;if(i===us)return n.DEPTH_STENCIL;if(i===vu)return n.RED;if(i===El)return n.RED_INTEGER;if(i===xu)return n.RG;if(i===wl)return n.RG_INTEGER;if(i===Tl)return n.RGBA_INTEGER;if(i===Yr||i===qr||i===Zr||i===$r)if(a===te)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Yr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===qr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===$r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Yr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===qr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Zr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===$r)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Lo||i===Io||i===Uo||i===No)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Lo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Io)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Uo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===No)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Fo||i===Oo||i===zo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Fo||i===Oo)return a===te?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===zo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Bo||i===ko||i===Ho||i===Go||i===Vo||i===Wo||i===Xo||i===Yo||i===qo||i===Zo||i===$o||i===Ko||i===jo||i===Jo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Bo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===ko)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ho)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Go)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Vo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Wo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Xo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Yo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===qo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Zo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===$o)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ko)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===jo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Jo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Kr||i===Qo||i===tl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Kr)return a===te?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Qo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===tl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===yu||i===el||i===nl||i===il)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Kr)return r.COMPRESSED_RED_RGTC1_EXT;if(i===el)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===nl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===il)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===hs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const rv={type:"move"};class io{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Re,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Re,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Re,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const g of t.hand.values()){const m=e.getJointPose(g,i),p=this._getHandJoint(l,g);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,_=.005;l.inputState.pinching&&d>f+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(rv)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Re;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const av=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ov=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class lv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const s=new ze,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!==i.depthNear||e.depthFar!==i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Fe({vertexShader:av,fragmentShader:ov,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ht(new wi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class cv extends Ri{constructor(t,e){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,_=null;const g=new lv,m=e.getContextAttributes();let p=null,b=null;const y=[],v=[],C=new tt;let T=null;const w=new qe;w.viewport=new ie;const P=new qe;P.viewport=new ie;const M=[w,P],x=new Ap;let D=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let et=y[q];return et===void 0&&(et=new io,y[q]=et),et.getTargetRaySpace()},this.getControllerGrip=function(q){let et=y[q];return et===void 0&&(et=new io,y[q]=et),et.getGripSpace()},this.getHand=function(q){let et=y[q];return et===void 0&&(et=new io,y[q]=et),et.getHandSpace()};function O(q){const et=v.indexOf(q.inputSource);if(et===-1)return;const vt=y[et];vt!==void 0&&(vt.update(q.inputSource,q.frame,l||a),vt.dispatchEvent({type:q.type,data:q.inputSource}))}function H(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",X);for(let q=0;q<y.length;q++){const et=v[q];et!==null&&(v[q]=null,y[q].disconnect(et))}D=null,F=null,g.reset(),t.setRenderTarget(p),f=null,d=null,u=null,s=null,b=null,se.stop(),i.isPresenting=!1,t.setPixelRatio(T),t.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",H),s.addEventListener("inputsourceschange",X),m.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(C),s.enabledFeatures!==void 0&&s.enabledFeatures.includes("layers")){let vt=null,at=null,Tt=null;m.depth&&(Tt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,vt=m.stencil?us:ss,at=m.stencil?hs:bi);const Rt={colorFormat:e.RGBA8,depthFormat:Tt,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Rt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),b=new dn(d.textureWidth,d.textureHeight,{format:cn,type:On,depthTexture:new Uu(d.textureWidth,d.textureHeight,at,void 0,void 0,void 0,void 0,void 0,void 0,vt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}else{const vt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,vt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new dn(f.framebufferWidth,f.framebufferHeight,{format:cn,type:On,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),se.setContext(s),se.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function X(q){for(let et=0;et<q.removed.length;et++){const vt=q.removed[et],at=v.indexOf(vt);at>=0&&(v[at]=null,y[at].disconnect(vt))}for(let et=0;et<q.added.length;et++){const vt=q.added[et];let at=v.indexOf(vt);if(at===-1){for(let Rt=0;Rt<y.length;Rt++)if(Rt>=v.length){v.push(vt),at=Rt;break}else if(v[Rt]===null){v[Rt]=vt,at=Rt;break}if(at===-1)break}const Tt=y[at];Tt&&Tt.connect(vt)}}const W=new R,K=new R;function V(q,et,vt){W.setFromMatrixPosition(et.matrixWorld),K.setFromMatrixPosition(vt.matrixWorld);const at=W.distanceTo(K),Tt=et.projectionMatrix.elements,Rt=vt.projectionMatrix.elements,zt=Tt[14]/(Tt[10]-1),ce=Tt[14]/(Tt[10]+1),Wt=(Tt[9]+1)/Tt[5],fe=(Tt[9]-1)/Tt[5],L=(Tt[8]-1)/Tt[0],$e=(Rt[8]+1)/Rt[0],kt=zt*L,Ht=zt*$e,St=at/(-L+$e),ae=St*-L;if(et.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(ae),q.translateZ(St),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Tt[10]===-1)q.projectionMatrix.copy(et.projectionMatrix),q.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const yt=zt+St,A=ce+St,S=kt-ae,z=Ht+(at-ae),Z=Wt*ce/A*yt,j=fe*ce/A*yt;q.projectionMatrix.makePerspective(S,z,Z,j,yt,A),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function rt(q,et){et===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(et.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let et=q.near,vt=q.far;g.texture!==null&&(g.depthNear>0&&(et=g.depthNear),g.depthFar>0&&(vt=g.depthFar)),x.near=P.near=w.near=et,x.far=P.far=w.far=vt,(D!==x.near||F!==x.far)&&(s.updateRenderState({depthNear:x.near,depthFar:x.far}),D=x.near,F=x.far),w.layers.mask=q.layers.mask|2,P.layers.mask=q.layers.mask|4,x.layers.mask=w.layers.mask|P.layers.mask;const at=q.parent,Tt=x.cameras;rt(x,at);for(let Rt=0;Rt<Tt.length;Rt++)rt(Tt[Rt],at);Tt.length===2?V(x,w,P):x.projectionMatrix.copy(w.projectionMatrix),ft(q,x,at)};function ft(q,et,vt){vt===null?q.matrix.copy(et.matrixWorld):(q.matrix.copy(vt.matrixWorld),q.matrix.invert(),q.matrix.multiply(et.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(et.projectionMatrix),q.projectionMatrixInverse.copy(et.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=rl*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(q){c=q,d!==null&&(d.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(x)};let Mt=null;function Ot(q,et){if(h=et.getViewerPose(l||a),_=et,h!==null){const vt=h.views;f!==null&&(t.setRenderTargetFramebuffer(b,f.framebuffer),t.setRenderTarget(b));let at=!1;vt.length!==x.cameras.length&&(x.cameras.length=0,at=!0);for(let Rt=0;Rt<vt.length;Rt++){const zt=vt[Rt];let ce=null;if(f!==null)ce=f.getViewport(zt);else{const fe=u.getViewSubImage(d,zt);ce=fe.viewport,Rt===0&&(t.setRenderTargetTextures(b,fe.colorTexture,d.ignoreDepthValues?void 0:fe.depthStencilTexture),t.setRenderTarget(b))}let Wt=M[Rt];Wt===void 0&&(Wt=new qe,Wt.layers.enable(Rt),Wt.viewport=new ie,M[Rt]=Wt),Wt.matrix.fromArray(zt.transform.matrix),Wt.matrix.decompose(Wt.position,Wt.quaternion,Wt.scale),Wt.projectionMatrix.fromArray(zt.projectionMatrix),Wt.projectionMatrixInverse.copy(Wt.projectionMatrix).invert(),Wt.viewport.set(ce.x,ce.y,ce.width,ce.height),Rt===0&&(x.matrix.copy(Wt.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),at===!0&&x.cameras.push(Wt)}const Tt=s.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")){const Rt=u.getDepthInformation(vt[0]);Rt&&Rt.isValid&&Rt.texture&&g.init(t,Rt,s.renderState)}}for(let vt=0;vt<y.length;vt++){const at=v[vt],Tt=y[vt];at!==null&&Tt!==void 0&&Tt.update(at,et,l||a)}Mt&&Mt(q,et),et.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:et}),_=null}const se=new ku;se.setAnimationLoop(Ot),this.setAnimationLoop=function(q){Mt=q},this.dispose=function(){}}}const ui=new yn,hv=new Jt;function uv(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Ru(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,b,y,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),_(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),g(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,b,y):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ge&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ge&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const b=t.get(p),y=b.envMap,v=b.envMapRotation;y&&(m.envMap.value=y,ui.copy(v),ui.x*=-1,ui.y*=-1,ui.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ui.y*=-1,ui.z*=-1),m.envMapRotation.value.setFromMatrix4(hv.makeRotationFromEuler(ui)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,b,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=y*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ge&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,p){p.matcap&&(m.matcap.value=p.matcap)}function g(m,p){const b=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function dv(n,t,e,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(b,y){const v=y.program;i.uniformBlockBinding(b,v)}function l(b,y){let v=s[b.id];v===void 0&&(_(b),v=h(b),s[b.id]=v,b.addEventListener("dispose",m));const C=y.program;i.updateUBOMapping(b,C);const T=t.render.frame;r[b.id]!==T&&(d(b),r[b.id]=T)}function h(b){const y=u();b.__bindingPointIndex=y;const v=n.createBuffer(),C=b.__size,T=b.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,C,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,v),v}function u(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){const y=s[b.id],v=b.uniforms,C=b.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let T=0,w=v.length;T<w;T++){const P=Array.isArray(v[T])?v[T]:[v[T]];for(let M=0,x=P.length;M<x;M++){const D=P[M];if(f(D,T,M,C)===!0){const F=D.__offset,O=Array.isArray(D.value)?D.value:[D.value];let H=0;for(let X=0;X<O.length;X++){const W=O[X],K=g(W);typeof W=="number"||typeof W=="boolean"?(D.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,F+H,D.__data)):W.isMatrix3?(D.__data[0]=W.elements[0],D.__data[1]=W.elements[1],D.__data[2]=W.elements[2],D.__data[3]=0,D.__data[4]=W.elements[3],D.__data[5]=W.elements[4],D.__data[6]=W.elements[5],D.__data[7]=0,D.__data[8]=W.elements[6],D.__data[9]=W.elements[7],D.__data[10]=W.elements[8],D.__data[11]=0):(W.toArray(D.__data,H),H+=K.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(b,y,v,C){const T=b.value,w=y+"_"+v;if(C[w]===void 0)return typeof T=="number"||typeof T=="boolean"?C[w]=T:C[w]=T.clone(),!0;{const P=C[w];if(typeof T=="number"||typeof T=="boolean"){if(P!==T)return C[w]=T,!0}else if(P.equals(T)===!1)return P.copy(T),!0}return!1}function _(b){const y=b.uniforms;let v=0;const C=16;for(let w=0,P=y.length;w<P;w++){const M=Array.isArray(y[w])?y[w]:[y[w]];for(let x=0,D=M.length;x<D;x++){const F=M[x],O=Array.isArray(F.value)?F.value:[F.value];for(let H=0,X=O.length;H<X;H++){const W=O[H],K=g(W),V=v%C,rt=V%K.boundary,ft=V+rt;v+=rt,ft!==0&&C-ft<K.storage&&(v+=C-ft),F.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=v,v+=K.storage}}}const T=v%C;return T>0&&(v+=C-T),b.__size=v,b.__cache={},this}function g(b){const y={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(y.boundary=4,y.storage=4):b.isVector2?(y.boundary=8,y.storage=8):b.isVector3||b.isColor?(y.boundary=16,y.storage=12):b.isVector4?(y.boundary=16,y.storage=16):b.isMatrix3?(y.boundary=48,y.storage=48):b.isMatrix4?(y.boundary=64,y.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),y}function m(b){const y=b.target;y.removeEventListener("dispose",m);const v=a.indexOf(y.__bindingPointIndex);a.splice(v,1),n.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function p(){for(const b in s)n.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:c,update:l,dispose:p}}class fv{constructor(t={}){const{canvas:e=Cf(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=a;const _=new Uint32Array(4),g=new Int32Array(4);let m=null,p=null;const b=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Qe,this.toneMapping=Kn,this.toneMappingExposure=1;const v=this;let C=!1,T=0,w=0,P=null,M=-1,x=null;const D=new ie,F=new ie;let O=null;const H=new ut(0);let X=0,W=e.width,K=e.height,V=1,rt=null,ft=null;const Mt=new ie(0,0,W,K),Ot=new ie(0,0,W,K);let se=!1;const q=new Cl;let et=!1,vt=!1;this.transmissionResolutionScale=1;const at=new Jt,Tt=new Jt,Rt=new R,zt=new ie,ce={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Wt=!1;function fe(){return P===null?V:1}let L=i;function $e(E,U){return e.getContext(E,U)}try{const E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${xl}`),e.addEventListener("webglcontextlost",$,!1),e.addEventListener("webglcontextrestored",ct,!1),e.addEventListener("webglcontextcreationerror",lt,!1),L===null){const U="webgl2";if(L=$e(U,E),L===null)throw $e(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let kt,Ht,St,ae,yt,A,S,z,Z,j,Y,xt,ot,pt,Xt,Q,mt,wt,At,_t,Gt,Ut,re,I;function it(){kt=new Sg(L),kt.init(),Ut=new sv(L,kt),Ht=new _g(L,kt,t,Ut),St=new nv(L,kt),Ht.reverseDepthBuffer&&d&&St.buffers.depth.setReversed(!0),ae=new wg(L),yt=new V0,A=new iv(L,kt,St,yt,Ht,Ut,ae),S=new vg(v),z=new Mg(v),Z=new Lp(L),re=new pg(L,Z),j=new bg(L,Z,ae,re),Y=new Ag(L,j,Z,ae),At=new Tg(L,Ht,A),Q=new gg(yt),xt=new G0(v,S,z,kt,Ht,re,Q),ot=new uv(v,yt),pt=new X0,Xt=new j0(kt),wt=new fg(v,S,z,St,Y,f,c),mt=new tv(v,Y,Ht),I=new dv(L,ae,Ht,St),_t=new mg(L,kt,ae),Gt=new Eg(L,kt,ae),ae.programs=xt.programs,v.capabilities=Ht,v.extensions=kt,v.properties=yt,v.renderLists=pt,v.shadowMap=mt,v.state=St,v.info=ae}it();const G=new cv(v,L);this.xr=G,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const E=kt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=kt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(E){E!==void 0&&(V=E,this.setSize(W,K,!1))},this.getSize=function(E){return E.set(W,K)},this.setSize=function(E,U,B=!0){if(G.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=E,K=U,e.width=Math.floor(E*V),e.height=Math.floor(U*V),B===!0&&(e.style.width=E+"px",e.style.height=U+"px"),this.setViewport(0,0,E,U)},this.getDrawingBufferSize=function(E){return E.set(W*V,K*V).floor()},this.setDrawingBufferSize=function(E,U,B){W=E,K=U,V=B,e.width=Math.floor(E*B),e.height=Math.floor(U*B),this.setViewport(0,0,E,U)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(Mt)},this.setViewport=function(E,U,B,k){E.isVector4?Mt.set(E.x,E.y,E.z,E.w):Mt.set(E,U,B,k),St.viewport(D.copy(Mt).multiplyScalar(V).round())},this.getScissor=function(E){return E.copy(Ot)},this.setScissor=function(E,U,B,k){E.isVector4?Ot.set(E.x,E.y,E.z,E.w):Ot.set(E,U,B,k),St.scissor(F.copy(Ot).multiplyScalar(V).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(E){St.setScissorTest(se=E)},this.setOpaqueSort=function(E){rt=E},this.setTransparentSort=function(E){ft=E},this.getClearColor=function(E){return E.copy(wt.getClearColor())},this.setClearColor=function(){wt.setClearColor.apply(wt,arguments)},this.getClearAlpha=function(){return wt.getClearAlpha()},this.setClearAlpha=function(){wt.setClearAlpha.apply(wt,arguments)},this.clear=function(E=!0,U=!0,B=!0){let k=0;if(E){let N=!1;if(P!==null){const J=P.texture.format;N=J===Tl||J===wl||J===El}if(N){const J=P.texture.type,st=J===On||J===bi||J===Ws||J===hs||J===Sl||J===bl,dt=wt.getClearColor(),gt=wt.getClearAlpha(),Ct=dt.r,Pt=dt.g,bt=dt.b;st?(_[0]=Ct,_[1]=Pt,_[2]=bt,_[3]=gt,L.clearBufferuiv(L.COLOR,0,_)):(g[0]=Ct,g[1]=Pt,g[2]=bt,g[3]=gt,L.clearBufferiv(L.COLOR,0,g))}else k|=L.COLOR_BUFFER_BIT}U&&(k|=L.DEPTH_BUFFER_BIT),B&&(k|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",$,!1),e.removeEventListener("webglcontextrestored",ct,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),wt.dispose(),pt.dispose(),Xt.dispose(),yt.dispose(),S.dispose(),z.dispose(),Y.dispose(),re.dispose(),I.dispose(),xt.dispose(),G.dispose(),G.removeEventListener("sessionstart",Gl),G.removeEventListener("sessionend",Vl),si.stop()};function $(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function ct(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const E=ae.autoReset,U=mt.enabled,B=mt.autoUpdate,k=mt.needsUpdate,N=mt.type;it(),ae.autoReset=E,mt.enabled=U,mt.autoUpdate=B,mt.needsUpdate=k,mt.type=N}function lt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Lt(E){const U=E.target;U.removeEventListener("dispose",Lt),ue(U)}function ue(E){Pe(E),yt.remove(E)}function Pe(E){const U=yt.get(E).programs;U!==void 0&&(U.forEach(function(B){xt.releaseProgram(B)}),E.isShaderMaterial&&xt.releaseShaderCache(E))}this.renderBufferDirect=function(E,U,B,k,N,J){U===null&&(U=ce);const st=N.isMesh&&N.matrixWorld.determinant()<0,dt=Cd(E,U,B,k,N);St.setMaterial(k,st);let gt=B.index,Ct=1;if(k.wireframe===!0){if(gt=j.getWireframeAttribute(B),gt===void 0)return;Ct=2}const Pt=B.drawRange,bt=B.attributes.position;let Yt=Pt.start*Ct,Kt=(Pt.start+Pt.count)*Ct;J!==null&&(Yt=Math.max(Yt,J.start*Ct),Kt=Math.min(Kt,(J.start+J.count)*Ct)),gt!==null?(Yt=Math.max(Yt,0),Kt=Math.min(Kt,gt.count)):bt!=null&&(Yt=Math.max(Yt,0),Kt=Math.min(Kt,bt.count));const me=Kt-Yt;if(me<0||me===1/0)return;re.setup(N,k,dt,B,gt);let de,Zt=_t;if(gt!==null&&(de=Z.get(gt),Zt=Gt,Zt.setIndex(de)),N.isMesh)k.wireframe===!0?(St.setLineWidth(k.wireframeLinewidth*fe()),Zt.setMode(L.LINES)):Zt.setMode(L.TRIANGLES);else if(N.isLine){let Et=k.linewidth;Et===void 0&&(Et=1),St.setLineWidth(Et*fe()),N.isLineSegments?Zt.setMode(L.LINES):N.isLineLoop?Zt.setMode(L.LINE_LOOP):Zt.setMode(L.LINE_STRIP)}else N.isPoints?Zt.setMode(L.POINTS):N.isSprite&&Zt.setMode(L.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Zt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(kt.get("WEBGL_multi_draw"))Zt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Et=N._multiDrawStarts,Ae=N._multiDrawCounts,jt=N._multiDrawCount,rn=gt?Z.get(gt).bytesPerElement:1,Di=yt.get(k).currentProgram.getUniforms();for(let Ve=0;Ve<jt;Ve++)Di.setValue(L,"_gl_DrawID",Ve),Zt.render(Et[Ve]/rn,Ae[Ve])}else if(N.isInstancedMesh)Zt.renderInstances(Yt,me,N.count);else if(B.isInstancedBufferGeometry){const Et=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,Ae=Math.min(B.instanceCount,Et);Zt.renderInstances(Yt,me,Ae)}else Zt.render(Yt,me)};function Qt(E,U,B){E.transparent===!0&&E.side===xe&&E.forceSinglePass===!1?(E.side=Ge,E.needsUpdate=!0,hr(E,U,B),E.side=ni,E.needsUpdate=!0,hr(E,U,B),E.side=xe):hr(E,U,B)}this.compile=function(E,U,B=null){B===null&&(B=E),p=Xt.get(B),p.init(U),y.push(p),B.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),E!==B&&E.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();const k=new Set;return E.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const J=N.material;if(J)if(Array.isArray(J))for(let st=0;st<J.length;st++){const dt=J[st];Qt(dt,B,N),k.add(dt)}else Qt(J,B,N),k.add(J)}),y.pop(),p=null,k},this.compileAsync=function(E,U,B=null){const k=this.compile(E,U,B);return new Promise(N=>{function J(){if(k.forEach(function(st){yt.get(st).currentProgram.isReady()&&k.delete(st)}),k.size===0){N(E);return}setTimeout(J,10)}kt.get("KHR_parallel_shader_compile")!==null?J():setTimeout(J,10)})};let sn=null;function Mn(E){sn&&sn(E)}function Gl(){si.stop()}function Vl(){si.start()}const si=new ku;si.setAnimationLoop(Mn),typeof self<"u"&&si.setContext(self),this.setAnimationLoop=function(E){sn=E,G.setAnimationLoop(E),E===null?si.stop():si.start()},G.addEventListener("sessionstart",Gl),G.addEventListener("sessionend",Vl),this.render=function(E,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),G.enabled===!0&&G.isPresenting===!0&&(G.cameraAutoUpdate===!0&&G.updateCamera(U),U=G.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,U,P),p=Xt.get(E,y.length),p.init(U),y.push(p),Tt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),q.setFromProjectionMatrix(Tt),vt=this.localClippingEnabled,et=Q.init(this.clippingPlanes,vt),m=pt.get(E,b.length),m.init(),b.push(m),G.enabled===!0&&G.isPresenting===!0){const J=v.xr.getDepthSensingMesh();J!==null&&ya(J,U,-1/0,v.sortObjects)}ya(E,U,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(rt,ft),Wt=G.enabled===!1||G.isPresenting===!1||G.hasDepthSensing()===!1,Wt&&wt.addToRenderList(m,E),this.info.render.frame++,et===!0&&Q.beginShadows();const B=p.state.shadowsArray;mt.render(B,E,U),et===!0&&Q.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=m.opaque,N=m.transmissive;if(p.setupLights(),U.isArrayCamera){const J=U.cameras;if(N.length>0)for(let st=0,dt=J.length;st<dt;st++){const gt=J[st];Xl(k,N,E,gt)}Wt&&wt.render(E);for(let st=0,dt=J.length;st<dt;st++){const gt=J[st];Wl(m,E,gt,gt.viewport)}}else N.length>0&&Xl(k,N,E,U),Wt&&wt.render(E),Wl(m,E,U);P!==null&&w===0&&(A.updateMultisampleRenderTarget(P),A.updateRenderTargetMipmap(P)),E.isScene===!0&&E.onAfterRender(v,E,U),re.resetDefaultState(),M=-1,x=null,y.pop(),y.length>0?(p=y[y.length-1],et===!0&&Q.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function ya(E,U,B,k){if(E.visible===!1)return;if(E.layers.test(U.layers)){if(E.isGroup)B=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(U);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||q.intersectsSprite(E)){k&&zt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Tt);const st=Y.update(E),dt=E.material;dt.visible&&m.push(E,st,dt,B,zt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||q.intersectsObject(E))){const st=Y.update(E),dt=E.material;if(k&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),zt.copy(E.boundingSphere.center)):(st.boundingSphere===null&&st.computeBoundingSphere(),zt.copy(st.boundingSphere.center)),zt.applyMatrix4(E.matrixWorld).applyMatrix4(Tt)),Array.isArray(dt)){const gt=st.groups;for(let Ct=0,Pt=gt.length;Ct<Pt;Ct++){const bt=gt[Ct],Yt=dt[bt.materialIndex];Yt&&Yt.visible&&m.push(E,st,Yt,B,zt.z,bt)}}else dt.visible&&m.push(E,st,dt,B,zt.z,null)}}const J=E.children;for(let st=0,dt=J.length;st<dt;st++)ya(J[st],U,B,k)}function Wl(E,U,B,k){const N=E.opaque,J=E.transmissive,st=E.transparent;p.setupLightsView(B),et===!0&&Q.setGlobalState(v.clippingPlanes,B),k&&St.viewport(D.copy(k)),N.length>0&&cr(N,U,B),J.length>0&&cr(J,U,B),st.length>0&&cr(st,U,B),St.buffers.depth.setTest(!0),St.buffers.depth.setMask(!0),St.buffers.color.setMask(!0),St.setPolygonOffset(!1)}function Xl(E,U,B,k){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[k.id]===void 0&&(p.state.transmissionRenderTarget[k.id]=new dn(1,1,{generateMipmaps:!0,type:kt.has("EXT_color_buffer_half_float")||kt.has("EXT_color_buffer_float")?Nn:On,minFilter:gi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:qt.workingColorSpace}));const J=p.state.transmissionRenderTarget[k.id],st=k.viewport||D;J.setSize(st.z*v.transmissionResolutionScale,st.w*v.transmissionResolutionScale);const dt=v.getRenderTarget();v.setRenderTarget(J),v.getClearColor(H),X=v.getClearAlpha(),X<1&&v.setClearColor(16777215,.5),v.clear(),Wt&&wt.render(B);const gt=v.toneMapping;v.toneMapping=Kn;const Ct=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),p.setupLightsView(k),et===!0&&Q.setGlobalState(v.clippingPlanes,k),cr(E,B,k),A.updateMultisampleRenderTarget(J),A.updateRenderTargetMipmap(J),kt.has("WEBGL_multisampled_render_to_texture")===!1){let Pt=!1;for(let bt=0,Yt=U.length;bt<Yt;bt++){const Kt=U[bt],me=Kt.object,de=Kt.geometry,Zt=Kt.material,Et=Kt.group;if(Zt.side===xe&&me.layers.test(k.layers)){const Ae=Zt.side;Zt.side=Ge,Zt.needsUpdate=!0,Yl(me,B,k,de,Zt,Et),Zt.side=Ae,Zt.needsUpdate=!0,Pt=!0}}Pt===!0&&(A.updateMultisampleRenderTarget(J),A.updateRenderTargetMipmap(J))}v.setRenderTarget(dt),v.setClearColor(H,X),Ct!==void 0&&(k.viewport=Ct),v.toneMapping=gt}function cr(E,U,B){const k=U.isScene===!0?U.overrideMaterial:null;for(let N=0,J=E.length;N<J;N++){const st=E[N],dt=st.object,gt=st.geometry,Ct=k===null?st.material:k,Pt=st.group;dt.layers.test(B.layers)&&Yl(dt,U,B,gt,Ct,Pt)}}function Yl(E,U,B,k,N,J){E.onBeforeRender(v,U,B,k,N,J),E.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),N.onBeforeRender(v,U,B,k,E,J),N.transparent===!0&&N.side===xe&&N.forceSinglePass===!1?(N.side=Ge,N.needsUpdate=!0,v.renderBufferDirect(B,U,k,N,E,J),N.side=ni,N.needsUpdate=!0,v.renderBufferDirect(B,U,k,N,E,J),N.side=xe):v.renderBufferDirect(B,U,k,N,E,J),E.onAfterRender(v,U,B,k,N,J)}function hr(E,U,B){U.isScene!==!0&&(U=ce);const k=yt.get(E),N=p.state.lights,J=p.state.shadowsArray,st=N.state.version,dt=xt.getParameters(E,N.state,J,U,B),gt=xt.getProgramCacheKey(dt);let Ct=k.programs;k.environment=E.isMeshStandardMaterial?U.environment:null,k.fog=U.fog,k.envMap=(E.isMeshStandardMaterial?z:S).get(E.envMap||k.environment),k.envMapRotation=k.environment!==null&&E.envMap===null?U.environmentRotation:E.envMapRotation,Ct===void 0&&(E.addEventListener("dispose",Lt),Ct=new Map,k.programs=Ct);let Pt=Ct.get(gt);if(Pt!==void 0){if(k.currentProgram===Pt&&k.lightsStateVersion===st)return Zl(E,dt),Pt}else dt.uniforms=xt.getUniforms(E),E.onBeforeCompile(dt,v),Pt=xt.acquireProgram(dt,gt),Ct.set(gt,Pt),k.uniforms=dt.uniforms;const bt=k.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(bt.clippingPlanes=Q.uniform),Zl(E,dt),k.needsLights=Pd(E),k.lightsStateVersion=st,k.needsLights&&(bt.ambientLightColor.value=N.state.ambient,bt.lightProbe.value=N.state.probe,bt.directionalLights.value=N.state.directional,bt.directionalLightShadows.value=N.state.directionalShadow,bt.spotLights.value=N.state.spot,bt.spotLightShadows.value=N.state.spotShadow,bt.rectAreaLights.value=N.state.rectArea,bt.ltc_1.value=N.state.rectAreaLTC1,bt.ltc_2.value=N.state.rectAreaLTC2,bt.pointLights.value=N.state.point,bt.pointLightShadows.value=N.state.pointShadow,bt.hemisphereLights.value=N.state.hemi,bt.directionalShadowMap.value=N.state.directionalShadowMap,bt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,bt.spotShadowMap.value=N.state.spotShadowMap,bt.spotLightMatrix.value=N.state.spotLightMatrix,bt.spotLightMap.value=N.state.spotLightMap,bt.pointShadowMap.value=N.state.pointShadowMap,bt.pointShadowMatrix.value=N.state.pointShadowMatrix),k.currentProgram=Pt,k.uniformsList=null,Pt}function ql(E){if(E.uniformsList===null){const U=E.currentProgram.getUniforms();E.uniformsList=Jr.seqWithValue(U.seq,E.uniforms)}return E.uniformsList}function Zl(E,U){const B=yt.get(E);B.outputColorSpace=U.outputColorSpace,B.batching=U.batching,B.batchingColor=U.batchingColor,B.instancing=U.instancing,B.instancingColor=U.instancingColor,B.instancingMorph=U.instancingMorph,B.skinning=U.skinning,B.morphTargets=U.morphTargets,B.morphNormals=U.morphNormals,B.morphColors=U.morphColors,B.morphTargetsCount=U.morphTargetsCount,B.numClippingPlanes=U.numClippingPlanes,B.numIntersection=U.numClipIntersection,B.vertexAlphas=U.vertexAlphas,B.vertexTangents=U.vertexTangents,B.toneMapping=U.toneMapping}function Cd(E,U,B,k,N){U.isScene!==!0&&(U=ce),A.resetTextureUnits();const J=U.fog,st=k.isMeshStandardMaterial?U.environment:null,dt=P===null?v.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:ds,gt=(k.isMeshStandardMaterial?z:S).get(k.envMap||st),Ct=k.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Pt=!!B.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),bt=!!B.morphAttributes.position,Yt=!!B.morphAttributes.normal,Kt=!!B.morphAttributes.color;let me=Kn;k.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(me=v.toneMapping);const de=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Zt=de!==void 0?de.length:0,Et=yt.get(k),Ae=p.state.lights;if(et===!0&&(vt===!0||E!==x)){const Ie=E===x&&k.id===M;Q.setState(k,E,Ie)}let jt=!1;k.version===Et.__version?(Et.needsLights&&Et.lightsStateVersion!==Ae.state.version||Et.outputColorSpace!==dt||N.isBatchedMesh&&Et.batching===!1||!N.isBatchedMesh&&Et.batching===!0||N.isBatchedMesh&&Et.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Et.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Et.instancing===!1||!N.isInstancedMesh&&Et.instancing===!0||N.isSkinnedMesh&&Et.skinning===!1||!N.isSkinnedMesh&&Et.skinning===!0||N.isInstancedMesh&&Et.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Et.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Et.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Et.instancingMorph===!1&&N.morphTexture!==null||Et.envMap!==gt||k.fog===!0&&Et.fog!==J||Et.numClippingPlanes!==void 0&&(Et.numClippingPlanes!==Q.numPlanes||Et.numIntersection!==Q.numIntersection)||Et.vertexAlphas!==Ct||Et.vertexTangents!==Pt||Et.morphTargets!==bt||Et.morphNormals!==Yt||Et.morphColors!==Kt||Et.toneMapping!==me||Et.morphTargetsCount!==Zt)&&(jt=!0):(jt=!0,Et.__version=k.version);let rn=Et.currentProgram;jt===!0&&(rn=hr(k,U,N));let Di=!1,Ve=!1,Ss=!1;const oe=rn.getUniforms(),Ke=Et.uniforms;if(St.useProgram(rn.program)&&(Di=!0,Ve=!0,Ss=!0),k.id!==M&&(M=k.id,Ve=!0),Di||x!==E){St.buffers.depth.getReversed()?(at.copy(E.projectionMatrix),Pf(at),Df(at),oe.setValue(L,"projectionMatrix",at)):oe.setValue(L,"projectionMatrix",E.projectionMatrix),oe.setValue(L,"viewMatrix",E.matrixWorldInverse);const Be=oe.map.cameraPosition;Be!==void 0&&Be.setValue(L,Rt.setFromMatrixPosition(E.matrixWorld)),Ht.logarithmicDepthBuffer&&oe.setValue(L,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&oe.setValue(L,"isOrthographic",E.isOrthographicCamera===!0),x!==E&&(x=E,Ve=!0,Ss=!0)}if(N.isSkinnedMesh){oe.setOptional(L,N,"bindMatrix"),oe.setOptional(L,N,"bindMatrixInverse");const Ie=N.skeleton;Ie&&(Ie.boneTexture===null&&Ie.computeBoneTexture(),oe.setValue(L,"boneTexture",Ie.boneTexture,A))}N.isBatchedMesh&&(oe.setOptional(L,N,"batchingTexture"),oe.setValue(L,"batchingTexture",N._matricesTexture,A),oe.setOptional(L,N,"batchingIdTexture"),oe.setValue(L,"batchingIdTexture",N._indirectTexture,A),oe.setOptional(L,N,"batchingColorTexture"),N._colorsTexture!==null&&oe.setValue(L,"batchingColorTexture",N._colorsTexture,A));const je=B.morphAttributes;if((je.position!==void 0||je.normal!==void 0||je.color!==void 0)&&At.update(N,B,rn),(Ve||Et.receiveShadow!==N.receiveShadow)&&(Et.receiveShadow=N.receiveShadow,oe.setValue(L,"receiveShadow",N.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(Ke.envMap.value=gt,Ke.flipEnvMap.value=gt.isCubeTexture&&gt.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&U.environment!==null&&(Ke.envMapIntensity.value=U.environmentIntensity),Ve&&(oe.setValue(L,"toneMappingExposure",v.toneMappingExposure),Et.needsLights&&Rd(Ke,Ss),J&&k.fog===!0&&ot.refreshFogUniforms(Ke,J),ot.refreshMaterialUniforms(Ke,k,V,K,p.state.transmissionRenderTarget[E.id]),Jr.upload(L,ql(Et),Ke,A)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Jr.upload(L,ql(Et),Ke,A),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&oe.setValue(L,"center",N.center),oe.setValue(L,"modelViewMatrix",N.modelViewMatrix),oe.setValue(L,"normalMatrix",N.normalMatrix),oe.setValue(L,"modelMatrix",N.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const Ie=k.uniformsGroups;for(let Be=0,Ma=Ie.length;Be<Ma;Be++){const ri=Ie[Be];I.update(ri,rn),I.bind(ri,rn)}}return rn}function Rd(E,U){E.ambientLightColor.needsUpdate=U,E.lightProbe.needsUpdate=U,E.directionalLights.needsUpdate=U,E.directionalLightShadows.needsUpdate=U,E.pointLights.needsUpdate=U,E.pointLightShadows.needsUpdate=U,E.spotLights.needsUpdate=U,E.spotLightShadows.needsUpdate=U,E.rectAreaLights.needsUpdate=U,E.hemisphereLights.needsUpdate=U}function Pd(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(E,U,B){yt.get(E.texture).__webglTexture=U,yt.get(E.depthTexture).__webglTexture=B;const k=yt.get(E);k.__hasExternalTextures=!0,k.__autoAllocateDepthBuffer=B===void 0,k.__autoAllocateDepthBuffer||kt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,U){const B=yt.get(E);B.__webglFramebuffer=U,B.__useDefaultFramebuffer=U===void 0};const Dd=L.createFramebuffer();this.setRenderTarget=function(E,U=0,B=0){P=E,T=U,w=B;let k=!0,N=null,J=!1,st=!1;if(E){const gt=yt.get(E);if(gt.__useDefaultFramebuffer!==void 0)St.bindFramebuffer(L.FRAMEBUFFER,null),k=!1;else if(gt.__webglFramebuffer===void 0)A.setupRenderTarget(E);else if(gt.__hasExternalTextures)A.rebindTextures(E,yt.get(E.texture).__webglTexture,yt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const bt=E.depthTexture;if(gt.__boundDepthTexture!==bt){if(bt!==null&&yt.has(bt)&&(E.width!==bt.image.width||E.height!==bt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(E)}}const Ct=E.texture;(Ct.isData3DTexture||Ct.isDataArrayTexture||Ct.isCompressedArrayTexture)&&(st=!0);const Pt=yt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Pt[U])?N=Pt[U][B]:N=Pt[U],J=!0):E.samples>0&&A.useMultisampledRTT(E)===!1?N=yt.get(E).__webglMultisampledFramebuffer:Array.isArray(Pt)?N=Pt[B]:N=Pt,D.copy(E.viewport),F.copy(E.scissor),O=E.scissorTest}else D.copy(Mt).multiplyScalar(V).floor(),F.copy(Ot).multiplyScalar(V).floor(),O=se;if(B!==0&&(N=Dd),St.bindFramebuffer(L.FRAMEBUFFER,N)&&k&&St.drawBuffers(E,N),St.viewport(D),St.scissor(F),St.setScissorTest(O),J){const gt=yt.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+U,gt.__webglTexture,B)}else if(st){const gt=yt.get(E.texture),Ct=U;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,gt.__webglTexture,B,Ct)}else if(E!==null&&B!==0){const gt=yt.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,gt.__webglTexture,B)}M=-1},this.readRenderTargetPixels=function(E,U,B,k,N,J,st){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let dt=yt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&st!==void 0&&(dt=dt[st]),dt){St.bindFramebuffer(L.FRAMEBUFFER,dt);try{const gt=E.texture,Ct=gt.format,Pt=gt.type;if(!Ht.textureFormatReadable(Ct)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ht.textureTypeReadable(Pt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=E.width-k&&B>=0&&B<=E.height-N&&L.readPixels(U,B,k,N,Ut.convert(Ct),Ut.convert(Pt),J)}finally{const gt=P!==null?yt.get(P).__webglFramebuffer:null;St.bindFramebuffer(L.FRAMEBUFFER,gt)}}},this.readRenderTargetPixelsAsync=async function(E,U,B,k,N,J,st){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let dt=yt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&st!==void 0&&(dt=dt[st]),dt){const gt=E.texture,Ct=gt.format,Pt=gt.type;if(!Ht.textureFormatReadable(Ct))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ht.textureTypeReadable(Pt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=E.width-k&&B>=0&&B<=E.height-N){St.bindFramebuffer(L.FRAMEBUFFER,dt);const bt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,bt),L.bufferData(L.PIXEL_PACK_BUFFER,J.byteLength,L.STREAM_READ),L.readPixels(U,B,k,N,Ut.convert(Ct),Ut.convert(Pt),0);const Yt=P!==null?yt.get(P).__webglFramebuffer:null;St.bindFramebuffer(L.FRAMEBUFFER,Yt);const Kt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Rf(L,Kt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,bt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,J),L.deleteBuffer(bt),L.deleteSync(Kt),J}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,U=null,B=0){E.isTexture!==!0&&(Qi("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,E=arguments[1]);const k=Math.pow(2,-B),N=Math.floor(E.image.width*k),J=Math.floor(E.image.height*k),st=U!==null?U.x:0,dt=U!==null?U.y:0;A.setTexture2D(E,0),L.copyTexSubImage2D(L.TEXTURE_2D,B,0,0,st,dt,N,J),St.unbindTexture()};const Ld=L.createFramebuffer(),Id=L.createFramebuffer();this.copyTextureToTexture=function(E,U,B=null,k=null,N=0,J=null){E.isTexture!==!0&&(Qi("WebGLRenderer: copyTextureToTexture function signature has changed."),k=arguments[0]||null,E=arguments[1],U=arguments[2],J=arguments[3]||0,B=null),J===null&&(N!==0?(Qi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),J=N,N=0):J=0);let st,dt,gt,Ct,Pt,bt,Yt,Kt,me;const de=E.isCompressedTexture?E.mipmaps[J]:E.image;if(B!==null)st=B.max.x-B.min.x,dt=B.max.y-B.min.y,gt=B.isBox3?B.max.z-B.min.z:1,Ct=B.min.x,Pt=B.min.y,bt=B.isBox3?B.min.z:0;else{const je=Math.pow(2,-N);st=Math.floor(de.width*je),dt=Math.floor(de.height*je),E.isDataArrayTexture?gt=de.depth:E.isData3DTexture?gt=Math.floor(de.depth*je):gt=1,Ct=0,Pt=0,bt=0}k!==null?(Yt=k.x,Kt=k.y,me=k.z):(Yt=0,Kt=0,me=0);const Zt=Ut.convert(U.format),Et=Ut.convert(U.type);let Ae;U.isData3DTexture?(A.setTexture3D(U,0),Ae=L.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(A.setTexture2DArray(U,0),Ae=L.TEXTURE_2D_ARRAY):(A.setTexture2D(U,0),Ae=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,U.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,U.unpackAlignment);const jt=L.getParameter(L.UNPACK_ROW_LENGTH),rn=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Di=L.getParameter(L.UNPACK_SKIP_PIXELS),Ve=L.getParameter(L.UNPACK_SKIP_ROWS),Ss=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,de.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,de.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ct),L.pixelStorei(L.UNPACK_SKIP_ROWS,Pt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,bt);const oe=E.isDataArrayTexture||E.isData3DTexture,Ke=U.isDataArrayTexture||U.isData3DTexture;if(E.isDepthTexture){const je=yt.get(E),Ie=yt.get(U),Be=yt.get(je.__renderTarget),Ma=yt.get(Ie.__renderTarget);St.bindFramebuffer(L.READ_FRAMEBUFFER,Be.__webglFramebuffer),St.bindFramebuffer(L.DRAW_FRAMEBUFFER,Ma.__webglFramebuffer);for(let ri=0;ri<gt;ri++)oe&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,yt.get(E).__webglTexture,N,bt+ri),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,yt.get(U).__webglTexture,J,me+ri)),L.blitFramebuffer(Ct,Pt,st,dt,Yt,Kt,st,dt,L.DEPTH_BUFFER_BIT,L.NEAREST);St.bindFramebuffer(L.READ_FRAMEBUFFER,null),St.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(N!==0||E.isRenderTargetTexture||yt.has(E)){const je=yt.get(E),Ie=yt.get(U);St.bindFramebuffer(L.READ_FRAMEBUFFER,Ld),St.bindFramebuffer(L.DRAW_FRAMEBUFFER,Id);for(let Be=0;Be<gt;Be++)oe?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,je.__webglTexture,N,bt+Be):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,je.__webglTexture,N),Ke?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ie.__webglTexture,J,me+Be):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Ie.__webglTexture,J),N!==0?L.blitFramebuffer(Ct,Pt,st,dt,Yt,Kt,st,dt,L.COLOR_BUFFER_BIT,L.NEAREST):Ke?L.copyTexSubImage3D(Ae,J,Yt,Kt,me+Be,Ct,Pt,st,dt):L.copyTexSubImage2D(Ae,J,Yt,Kt,Ct,Pt,st,dt);St.bindFramebuffer(L.READ_FRAMEBUFFER,null),St.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Ke?E.isDataTexture||E.isData3DTexture?L.texSubImage3D(Ae,J,Yt,Kt,me,st,dt,gt,Zt,Et,de.data):U.isCompressedArrayTexture?L.compressedTexSubImage3D(Ae,J,Yt,Kt,me,st,dt,gt,Zt,de.data):L.texSubImage3D(Ae,J,Yt,Kt,me,st,dt,gt,Zt,Et,de):E.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,J,Yt,Kt,st,dt,Zt,Et,de.data):E.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,J,Yt,Kt,de.width,de.height,Zt,de.data):L.texSubImage2D(L.TEXTURE_2D,J,Yt,Kt,st,dt,Zt,Et,de);L.pixelStorei(L.UNPACK_ROW_LENGTH,jt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,rn),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Di),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ve),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ss),J===0&&U.generateMipmaps&&L.generateMipmap(Ae),St.unbindTexture()},this.copyTextureToTexture3D=function(E,U,B=null,k=null,N=0){return E.isTexture!==!0&&(Qi("WebGLRenderer: copyTextureToTexture3D function signature has changed."),B=arguments[0]||null,k=arguments[1]||null,E=arguments[2],U=arguments[3],N=arguments[4]||0),Qi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,U,B,k,N)},this.initRenderTarget=function(E){yt.get(E).__webglFramebuffer===void 0&&A.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?A.setTextureCube(E,0):E.isData3DTexture?A.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?A.setTexture2DArray(E,0):A.setTexture2D(E,0),St.unbindTexture()},this.resetState=function(){T=0,w=0,P=null,St.reset(),re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ln}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=qt._getUnpackColorSpace()}}const lh={type:"change"},Il={type:"start"},Xu={type:"end"},kr=new ir,ch=new Xn,pv=Math.cos(70*Af.DEG2RAD),ge=new R,ke=2*Math.PI,ne={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},so=1e-6;class mv extends Pp{constructor(t,e=null){super(t,e),this.state=ne.NONE,this.enabled=!0,this.target=new R,this.cursor=new R,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:In.ROTATE,MIDDLE:In.DOLLY,RIGHT:In.PAN},this.touches={ONE:ts.ROTATE,TWO:ts.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new R,this._lastQuaternion=new Ei,this._lastTargetPosition=new R,this._quat=new Ei().setFromUnitVectors(t.up,new R(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Fc,this._sphericalDelta=new Fc,this._scale=1,this._panOffset=new R,this._rotateStart=new tt,this._rotateEnd=new tt,this._rotateDelta=new tt,this._panStart=new tt,this._panEnd=new tt,this._panDelta=new tt,this._dollyStart=new tt,this._dollyEnd=new tt,this._dollyDelta=new tt,this._dollyDirection=new R,this._mouse=new tt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=gv.bind(this),this._onPointerDown=_v.bind(this),this._onPointerUp=vv.bind(this),this._onContextMenu=wv.bind(this),this._onMouseWheel=Mv.bind(this),this._onKeyDown=Sv.bind(this),this._onTouchStart=bv.bind(this),this._onTouchMove=Ev.bind(this),this._onMouseDown=xv.bind(this),this._onMouseMove=yv.bind(this),this._interceptControlDown=Tv.bind(this),this._interceptControlUp=Av.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(lh),this.update(),this.state=ne.NONE}update(t=null){const e=this.object.position;ge.copy(e).sub(this.target),ge.applyQuaternion(this._quat),this._spherical.setFromVector3(ge),this.autoRotate&&this.state===ne.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=ke:i>Math.PI&&(i-=ke),s<-Math.PI?s+=ke:s>Math.PI&&(s-=ke),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(ge.setFromSpherical(this._spherical),ge.applyQuaternion(this._quatInverse),e.copy(this.target).add(ge),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=ge.length();a=this._clampDistance(o*this._scale);const c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const o=new R(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new R(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=ge.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(kr.origin.copy(this.object.position),kr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(kr.direction))<pv?this.object.lookAt(this.target):(ch.setFromNormalAndCoplanarPoint(this.object.up,this.target),kr.intersectPlane(ch,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>so||8*(1-this._lastQuaternion.dot(this.object.quaternion))>so||this._lastTargetPosition.distanceToSquared(this.target)>so?(this.dispatchEvent(lh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?ke/60*this.autoRotateSpeed*t:ke/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){ge.setFromMatrixColumn(e,0),ge.multiplyScalar(-t),this._panOffset.add(ge)}_panUp(t,e){this.screenSpacePanning===!0?ge.setFromMatrixColumn(e,1):(ge.setFromMatrixColumn(e,0),ge.crossVectors(this.object.up,ge)),ge.multiplyScalar(t),this._panOffset.add(ge)}_pan(t,e){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;ge.copy(s).sub(this.target);let r=ge.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/i.clientHeight,this.object.matrix),this._panUp(2*e*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=t-i.left,r=e-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(ke*this._rotateDelta.x/e.clientHeight),this._rotateUp(ke*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(ke*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-ke*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(ke*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-ke*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),r=.5*(t.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(ke*this._rotateDelta.x/e.clientHeight),this._rotateUp(ke*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new tt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function _v(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function gv(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function vv(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Xu),this.state=ne.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function xv(n){let t;switch(n.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case In.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=ne.DOLLY;break;case In.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ne.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ne.ROTATE}break;case In.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ne.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ne.PAN}break;default:this.state=ne.NONE}this.state!==ne.NONE&&this.dispatchEvent(Il)}function yv(n){switch(this.state){case ne.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case ne.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case ne.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Mv(n){this.enabled===!1||this.enableZoom===!1||this.state!==ne.NONE||(n.preventDefault(),this.dispatchEvent(Il),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Xu))}function Sv(n){this.enabled!==!1&&this._handleKeyDown(n)}function bv(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case ts.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=ne.TOUCH_ROTATE;break;case ts.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=ne.TOUCH_PAN;break;default:this.state=ne.NONE}break;case 2:switch(this.touches.TWO){case ts.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=ne.TOUCH_DOLLY_PAN;break;case ts.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=ne.TOUCH_DOLLY_ROTATE;break;default:this.state=ne.NONE}break;default:this.state=ne.NONE}this.state!==ne.NONE&&this.dispatchEvent(Il)}function Ev(n){switch(this._trackPointer(n),this.state){case ne.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case ne.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case ne.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case ne.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=ne.NONE}}function wv(n){this.enabled!==!1&&n.preventDefault()}function Tv(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Av(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Yu={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class vs{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Cv=new Dl(-1,1,1,-1,0,1);class Rv extends he{constructor(){super(),this.setAttribute("position",new Vt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Vt([0,2,0,0,2,0],2))}}const Pv=new Rv;class Ul{constructor(t){this._mesh=new ht(Pv,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Cv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Dv extends vs{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof Fe?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Xs.clone(t.uniforms),this.material=new Fe({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Ul(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class hh extends vs{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Lv extends vs{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Iv{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const i=t.getSize(new tt);this._width=i.width,this._height=i.height,e=new dn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Nn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Dv(Yu),this.copyPass.material.blending=Un,this.clock=new Bu}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let i=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),a.needsSwap){if(i){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}hh!==void 0&&(a instanceof hh?i=!0:a instanceof Lv&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new tt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Uv extends vs{constructor(t,e,i=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new ut}render(t,e,i){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}const Nv={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ut(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class ps extends vs{constructor(t,e,i,s){super(),this.strength=e!==void 0?e:1,this.radius=i,this.threshold=s,this.resolution=t!==void 0?new tt(t.x,t.y):new tt(256,256),this.clearColor=new ut(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new dn(r,a,{type:Nn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const d=new dn(r,a,{type:Nn});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const f=new dn(r,a,{type:Nn});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=Nv;this.highPassUniforms=Xs.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Fe({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeparableBlurMaterial(c[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new tt(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Yu;this.copyUniforms=Xs.clone(h.uniforms),this.blendMaterial=new Fe({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:Si,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new ut,this.oldClearAlpha=1,this.basic=new we,this.fsQuad=new Ul(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new tt(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(t,e,i,s,r){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=ps.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=ps.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this.fsQuad.render(t),o=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(i),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=a}getSeparableBlurMaterial(t){const e=[];for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(t*t))/t);return new Fe({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new tt(.5,.5)},direction:{value:new tt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new Fe({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}ps.BlurDirectionX=new tt(1,0);ps.BlurDirectionY=new tt(0,1);const Fv={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Ov extends vs{constructor(){super();const t=Fv;this.uniforms=Xs.clone(t.uniforms),this.material=new yp({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new Ul(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},qt.getTransfer(this._outputColorSpace)===te&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ru?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===au?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ou?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===yl?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===lu?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===cu&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class uh extends pe{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new tt(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof e.element.ownerDocument.defaultView.Element&&e.element.parentNode!==null&&e.element.remove()})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this}}const Ki=new R,dh=new Jt,fh=new Jt,ph=new R,mh=new R;class zv{constructor(t={}){const e=this;let i,s,r,a;const o={objects:new WeakMap},c=t.element!==void 0?t.element:document.createElement("div");c.style.overflow="hidden",this.domElement=c,this.getSize=function(){return{width:i,height:s}},this.render=function(_,g){_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),g.parent===null&&g.matrixWorldAutoUpdate===!0&&g.updateMatrixWorld(),dh.copy(g.matrixWorldInverse),fh.multiplyMatrices(g.projectionMatrix,dh),h(_,_,g),f(_)},this.setSize=function(_,g){i=_,s=g,r=i/2,a=s/2,c.style.width=_+"px",c.style.height=g+"px"};function l(_){_.isCSS2DObject&&(_.element.style.display="none");for(let g=0,m=_.children.length;g<m;g++)l(_.children[g])}function h(_,g,m){if(_.visible===!1){l(_);return}if(_.isCSS2DObject){Ki.setFromMatrixPosition(_.matrixWorld),Ki.applyMatrix4(fh);const p=Ki.z>=-1&&Ki.z<=1&&_.layers.test(m.layers)===!0,b=_.element;b.style.display=p===!0?"":"none",p===!0&&(_.onBeforeRender(e,g,m),b.style.transform="translate("+-100*_.center.x+"%,"+-100*_.center.y+"%)translate("+(Ki.x*r+r)+"px,"+(-Ki.y*a+a)+"px)",b.parentNode!==c&&c.appendChild(b),_.onAfterRender(e,g,m));const y={distanceToCameraSquared:u(m,_)};o.objects.set(_,y)}for(let p=0,b=_.children.length;p<b;p++)h(_.children[p],g,m)}function u(_,g){return ph.setFromMatrixPosition(_.matrixWorld),mh.setFromMatrixPosition(g.matrixWorld),ph.distanceToSquared(mh)}function d(_){const g=[];return _.traverseVisible(function(m){m.isCSS2DObject&&g.push(m)}),g}function f(_){const g=d(_).sort(function(p,b){if(p.renderOrder!==b.renderOrder)return b.renderOrder-p.renderOrder;const y=o.objects.get(p).distanceToCameraSquared,v=o.objects.get(b).distanceToCameraSquared;return y-v}),m=g.length;for(let p=0,b=g.length;p<b;p++)g[p].element.style.zIndex=m-p}}}const _h={incomingCall:{main:39389,emissive:35020,accent:52479},skillTransfer:{main:14518272,emissive:13399808,accent:16755251},case:{main:13412864,emissive:12294400,accent:16768324},hangup:{main:13378116,emissive:12259635,accent:16729190},play:{main:8930508,emissive:7812027,accent:12285951},startOnHangup:{main:6715272,emissive:5596791,accent:8952234},voiceMailTransfer:{main:3381708,emissive:2263227,accent:5618670},thirdPartyTransfer:{main:13391240,emissive:12272759,accent:15628202},lookupCRMRecord:{main:3385975,emissive:2267494,accent:5622937},crmUpdate:{main:5618517,emissive:4500036,accent:7855479},agentTransfer:{main:13404194,emissive:12285713,accent:15641156},ifElse:{main:12298803,emissive:11180322,accent:14535765},setVariable:{main:5601194,emissive:4482713,accent:7838156},menu:{main:11163050,emissive:10044569,accent:13400012},input:{main:6724010,emissive:5605529,accent:8960972},blockedCallerList:{main:13386854,emissive:12268373,accent:15623816}};class Bv{create(t,e){var h,u;const i=new Re;i.userData={moduleId:t.moduleId,moduleType:t.moduleType,floatOffset:Math.random()*Math.PI*2};const s=_h[t.moduleType]||_h.startOnHangup,r=(h=e==null?void 0:e.frictionModules)==null?void 0:h.includes(t.moduleId),a=(u=e==null?void 0:e.successModules)==null?void 0:u.includes(t.moduleId);let o=s.main,c=s.emissive,l=s.accent;switch(r?(o=14487859,c=13369378,l=16724821):a&&(o=52326,c=47957,l=3403400),this._createPlatform(i,o,c),t.moduleType){case"incomingCall":this._createPortal(i,o,c,l);break;case"skillTransfer":case"agentTransfer":this._createTransferNode(i,o,c,l,r);break;case"case":case"ifElse":this._createDecisionNode(i,o,c,l);break;case"hangup":this._createTerminal(i,o,c,l);break;case"play":this._createSpeaker(i,o,c,l);break;case"startOnHangup":this._createMiniPortal(i,o,c);break;case"voiceMailTransfer":case"thirdPartyTransfer":this._createExternalNode(i,o,c,l);break;case"lookupCRMRecord":case"crmUpdate":this._createDatabase(i,o,c,l);break;case"setVariable":this._createGear(i,o,c,l);break;case"blockedCallerList":this._createShield(i,o,c,l);break;default:this._createDefault(i,o,c,l)}return i}_createPlatform(t,e,i){const s=new Ee(5.5,6,.4,32),r=new ve({color:16777215,emissive:new ut(i),emissiveIntensity:.15,metalness:.3,roughness:.7,transparent:!0,opacity:.4}),a=new ht(s,r);a.position.y=-.2,t.add(a);const o=new pi(5.7,.12,8,48),c=new we({color:new ut(e),transparent:!0,opacity:.35}),l=new ht(o,c);l.rotation.x=Math.PI/2,l.position.y=0,t.add(l)}_makeMaterial(t,e,i=.35){return new ve({color:t,emissive:e,emissiveIntensity:i,metalness:.4,roughness:.35,transparent:!0,opacity:.92})}_createPortal(t,e,i,s){const r=new pi(4.5,.7,20,48),a=this._makeMaterial(e,i,.5),o=new ht(r,a);o.rotation.x=Math.PI/2,o.position.y=4,o.userData.isMainMesh=!0,o.userData.baseEmissive=.5,t.add(o);const c=new Jn(2.5,32,32),l=new ve({color:16777215,emissive:s,emissiveIntensity:1,transparent:!0,opacity:.45}),h=new ht(c,l);h.position.y=4,t.add(h);const u=new Ee(.3,.5,3.5,8),d=this._makeMaterial(e,i,.2),f=new ht(u,d);f.position.y=1.8,t.add(f);const _=new vi(s,1.5,30);_.position.y=4,t.add(_)}_createTransferNode(t,e,i,s,r){const a=new Ee(2.5,2.5,7,20),o=this._makeMaterial(e,i,r?.7:.35),c=new ht(a,o);c.position.y=4,c.userData.isMainMesh=!0,c.userData.baseEmissive=r?.7:.35,t.add(c);const l=new pi(3,.25,8,24),h=new ve({color:15658751,metalness:.8,roughness:.15,transparent:!0,opacity:.7});[1.5,4,6.5].forEach(_=>{const g=new ht(l,h);g.position.y=_,g.rotation.x=Math.PI/2,t.add(g)});const u=new Bs(2,2.5,12),d=this._makeMaterial(s,i,.6),f=new ht(u,d);if(f.position.y=8.5,t.add(f),r){const _=new vi(16716083,2,35);_.position.y=4,t.add(_)}}_createDecisionNode(t,e,i,s){const r=new oa(4,1),a=this._makeMaterial(e,i,.4),o=new ht(r,a);o.position.y=5,o.userData.isMainMesh=!0,o.userData.baseEmissive=.4,t.add(o);const c=new oa(4.4,1),l=new we({color:s,wireframe:!0,transparent:!0,opacity:.2}),h=new ht(c,l);h.position.y=5,h.userData.isWireframe=!0,t.add(h);const u=new Ee(.25,.4,2.5,8),d=this._makeMaterial(e,i,.2),f=new ht(u,d);f.position.y=1.5,t.add(f);const _=new vi(s,1,25);_.position.y=5,t.add(_)}_createTerminal(t,e,i,s){const r=new hn(5,3,5,2,2,2),a=this._makeMaterial(e,i,.3),o=new ht(r,a);o.position.y=2,o.userData.isMainMesh=!0,o.userData.baseEmissive=.3,t.add(o);const c=new hn(.25,3,.25),l=new ve({color:16777215,emissive:s,emissiveIntensity:.8,transparent:!0,opacity:.7}),h=new ht(c,l);h.rotation.z=Math.PI/4,h.position.y=4.5,t.add(h);const u=new ht(c,l);u.rotation.z=-Math.PI/4,u.position.y=4.5,t.add(u)}_createSpeaker(t,e,i,s){const r=new Bs(3.5,5,20),a=this._makeMaterial(e,i,.4),o=new ht(r,a);o.rotation.z=Math.PI,o.position.y=3,o.userData.isMainMesh=!0,o.userData.baseEmissive=.4,t.add(o);for(let c=0;c<3;c++){const l=new qn(1.8+c*1.2,2+c*1.2,32),h=new we({color:s,transparent:!0,opacity:.15-c*.04,side:xe}),u=new ht(l,h);u.position.y=6+c*1.2,t.add(u)}}_createMiniPortal(t,e,i){const s=new pi(2.5,.45,12,32),r=this._makeMaterial(e,i,.2),a=new ht(s,r);a.rotation.x=Math.PI/2,a.position.y=3,a.userData.isMainMesh=!0,a.userData.baseEmissive=.2,t.add(a)}_createExternalNode(t,e,i,s){const r=new Jn(3.5,24,24),a=this._makeMaterial(e,i,.45),o=new ht(r,a);o.position.y=4.5,o.userData.isMainMesh=!0,o.userData.baseEmissive=.45,t.add(o);const c=new Bs(1.2,3,8),l=new ve({color:16777215,emissive:s,emissiveIntensity:.8,transparent:!0,opacity:.7}),h=new ht(c,l);h.position.y=8.5,t.add(h);const u=new vi(s,.8,20);u.position.y=4.5,t.add(u)}_createDatabase(t,e,i,s){const r=new Ee(3.5,3.5,1.2,24),a=this._makeMaterial(e,i,.35);for(let h=0;h<3;h++){const u=new ht(r,a.clone());u.position.y=1+h*1.8,h===0&&(u.userData.isMainMesh=!0,u.userData.baseEmissive=.35),t.add(u)}const o=new Ee(.15,.15,3.6,8),c=new we({color:s,transparent:!0,opacity:.3}),l=new ht(o,c);l.position.y=2.8,t.add(l)}_createGear(t,e,i,s){const r=new pi(3,.8,8,6),a=this._makeMaterial(e,i,.3),o=new ht(r,a);o.rotation.x=Math.PI/2,o.position.y=3,o.userData.isMainMesh=!0,o.userData.baseEmissive=.3,t.add(o);const c=new Jn(1.3,12,12),l=this._makeMaterial(s,i,.5),h=new ht(c,l);h.position.y=3,t.add(h)}_createShield(t,e,i,s){const r=new hn(5,5,1.5,2,2,1),a=this._makeMaterial(e,i,.4),o=new ht(r,a);o.position.y=3.5,o.userData.isMainMesh=!0,o.userData.baseEmissive=.4,t.add(o);const c=new hn(.2,3.5,.5),l=new ve({color:16777215,emissive:s,emissiveIntensity:.9,transparent:!0,opacity:.7}),h=new ht(c,l);h.rotation.z=Math.PI/4,h.position.y=3.5,h.position.z=.8,t.add(h);const u=new ht(c,l);u.rotation.z=-Math.PI/4,u.position.y=3.5,u.position.z=.8,t.add(u)}_createDefault(t,e,i,s){const r=new pa(3.5,1),a=this._makeMaterial(e,i,.3),o=new ht(r,a);o.position.y=4,o.userData.isMainMesh=!0,o.userData.baseEmissive=.3,t.add(o)}}class kv{constructor(){this._flowTexture=this._createFlowTexture()}_createFlowTexture(){const t=document.createElement("canvas");t.width=32,t.height=32;const e=t.getContext("2d"),i=e.createRadialGradient(16,16,0,16,16,16);i.addColorStop(0,"rgba(255, 255, 255, 1.0)"),i.addColorStop(.3,"rgba(255, 255, 255, 0.6)"),i.addColorStop(1,"rgba(255, 255, 255, 0.0)"),e.fillStyle=i,e.fillRect(0,0,32,32);const s=new es(t);return s.needsUpdate=!0,s}create(t,e,i={}){const{type:s="primary",volume:r=.5,isFriction:a=!1,isSuccess:o=!1,dimMode:c=!1,edgeIndex:l=0,totalEdges:h=1}=i,u=new Re,d=this._buildOrthogonalPath(t,e,l,h),f=new Fu(d,!1,"catmullrom",.35),_=c?.15:.25+r*.35;let g,m;c?(g=new ut(4478310),m=new ut(3359829)):a?(g=new ut(14492228),m=new ut(13373747)):o?(g=new ut(43605),m=new ut(39236)):s==="branch"?(g=new ut(13404160),m=new ut(11167232)):s==="exceptional"?(g=new ut(14505267),m=new ut(12268305)):(g=new ut(2254523),m=new ut(1131656));const p=new la(f,64,_,8,!1),b=new ve({color:g,emissive:m,emissiveIntensity:c?.2:.5+r*.4,metalness:.5,roughness:.35,transparent:!0,opacity:c?.5:.85+r*.15});b._baseOpacity=b.opacity;const y=new ht(p,b);if(u.add(y),!c){const w=new la(f,32,_*2.5,6,!1),P=new we({color:g,transparent:!0,opacity:.04+r*.04});P._baseOpacity=P.opacity;const M=new ht(w,P);u.add(M)}c||this._createFlowParticles(u,f,g,r);const v=.3+r*.4,C=c?.2:.5+r*.4,T=b.opacity;return u.userData.startPos=t.clone(),u.userData.endPos=e.clone(),u.userData.baseEmissive=C,u.userData.update=w=>{const P=Math.sin(w*(1.5+r*2))*.12;b.emissiveIntensity=C+P,a&&(b.emissiveIntensity=.6+Math.sin(w*5)*.3);const M=w*v%1,x=Math.exp(-50*Math.pow(M-.5,2))*.15;b.opacity=T+x,u.userData._flowParticles&&this._updateFlowParticles(u.userData._flowParticles,f,w,r)},u}_createFlowParticles(t,e,i,s){const r=Math.max(3,Math.min(12,Math.floor(e.getLength()/8))),a=new he,o=new Float32Array(r*3),c=new Float32Array(r);for(let u=0;u<r;u++){c[u]=u/r;const d=e.getPointAt(c[u]);o[u*3]=d.x,o[u*3+1]=d.y,o[u*3+2]=d.z}a.setAttribute("position",new Te(o,3));const l=new Ys({color:i,size:1.2+s*1.5,map:this._flowTexture,transparent:!0,opacity:.5+s*.3,blending:Si,depthWrite:!1,sizeAttenuation:!0}),h=new aa(a,l);t.add(h),t.userData._flowParticles={particles:h,phases:c,particleCount:r,speed:.15+s*.25}}_updateFlowParticles(t,e,i,s){const{particles:r,phases:a,particleCount:o,speed:c}=t,l=r.geometry.attributes.position.array;for(let h=0;h<o;h++){const u=(a[h]+i*c)%1,d=e.getPointAt(Math.max(.001,Math.min(.999,u)));l[h*3]=d.x,l[h*3+1]=d.y,l[h*3+2]=d.z}r.geometry.attributes.position.needsUpdate=!0,r.material.size=1+s*1.5+Math.sin(i*3)*.3}_buildOrthogonalPath(t,e,i=0,s=1){const a=12+i*3,o=5,c=Math.max(t.y,e.y)+a,l=Math.max(s-1,0)*3,h=s>1?(i/(s-1)-.5)*l:0,u=e.x-t.x,d=e.z-t.z,f=Math.abs(u)>=Math.abs(d)?"x":"z",_=[];_.push(t.clone());const g=new R(t.x,c,t.z);this._addRoundedCorner(_,t.clone(),g,4,o);let m,p;f==="x"?(m=new R(t.x,c,t.z+h),p=new R(e.x,c,e.z+h)):(m=new R(t.x+h,c,t.z),p=new R(e.x+h,c,e.z)),this._addRoundedCorner(_,g,m,4,o),_.push(m.clone()),_.push(p.clone());const b=new R(e.x,c,e.z);return this._addRoundedCorner(_,p,b,4,o),this._addRoundedCorner(_,b,e.clone(),4,o),_.push(e.clone()),_}_addRoundedCorner(t,e,i,s,r){const a=e.distanceTo(i);if(Math.min(s,a*.4)<.5||a<1){t.push(i.clone());return}t.push(i.clone())}}class Hv{constructor(t){this.scene=t,this._init()}_init(){this._glowTexture=this._createGlowTexture(),this._createDustLayer(),this._createFireflyLayer()}_createGlowTexture(){const t=document.createElement("canvas");t.width=64,t.height=64;const e=t.getContext("2d"),i=e.createRadialGradient(32,32,0,32,32,32);i.addColorStop(0,"rgba(255, 255, 255, 1.0)"),i.addColorStop(.15,"rgba(255, 255, 255, 0.8)"),i.addColorStop(.4,"rgba(255, 255, 255, 0.3)"),i.addColorStop(1,"rgba(255, 255, 255, 0.0)"),e.fillStyle=i,e.fillRect(0,0,64,64);const s=new es(t);return s.needsUpdate=!0,s}_createDustLayer(){const i=new he,s=new Float32Array(600*3),r=new Float32Array(600*3),a=new Float32Array(600),o=new Float32Array(600),c=[new ut(4491468),new ut(7825083),new ut(13404245),new ut(5609949),new ut(5618585),new ut(8952251),new ut(48127),new ut(10053341)];for(let h=0;h<600;h++){s[h*3]=(Math.random()-.5)*350,s[h*3+1]=Math.random()*100+1,s[h*3+2]=(Math.random()-.5)*350;const u=c[Math.floor(Math.random()*c.length)];r[h*3]=u.r,r[h*3+1]=u.g,r[h*3+2]=u.b,a[h]=.3+Math.random()*.9,o[h]=.1+Math.random()*.4}i.setAttribute("position",new Te(s,3)),i.setAttribute("color",new Te(r,3)),i.setAttribute("size",new Te(a,1));const l=new Ys({size:.8,map:this._glowTexture,vertexColors:!0,transparent:!0,opacity:.22,blending:Si,depthWrite:!1,sizeAttenuation:!0});this.dustParticles=new aa(i,l),this.dustSpeeds=o,this.scene.add(this.dustParticles)}_createFireflyLayer(){const i=new he,s=new Float32Array(60),r=new Float32Array(60),a=new Float32Array(20),o=[new ut(61183),new ut(11171839),new ut(16746564),new ut(4521898)];for(let l=0;l<20;l++){s[l*3]=(Math.random()-.5)*250,s[l*3+1]=Math.random()*60+5,s[l*3+2]=(Math.random()-.5)*250;const h=o[Math.floor(Math.random()*o.length)];r[l*3]=h.r,r[l*3+1]=h.g,r[l*3+2]=h.b,a[l]=Math.random()*Math.PI*2}i.setAttribute("position",new Te(s,3)),i.setAttribute("color",new Te(r,3));const c=new Ys({size:1.8,map:this._glowTexture,vertexColors:!0,transparent:!0,opacity:.3,blending:Si,depthWrite:!1,sizeAttenuation:!0});this.fireflyParticles=new aa(i,c),this.fireflyPhases=a,this.scene.add(this.fireflyParticles)}update(t,e){const i=this.dustParticles.geometry.attributes.position.array,s=i.length/3;for(let o=0;o<s;o++)i[o*3+1]+=this.dustSpeeds[o]*e*1.5,i[o*3]+=Math.sin(t*.15+o*.7)*e*.25,i[o*3+2]+=Math.cos(t*.12+o*.5)*e*.18,i[o*3+1]>110&&(i[o*3+1]=1,i[o*3]=(Math.random()-.5)*350,i[o*3+2]=(Math.random()-.5)*350);this.dustParticles.geometry.attributes.position.needsUpdate=!0,this.dustParticles.material.opacity=.18+Math.sin(t*.5)*.04;const r=this.fireflyParticles.geometry.attributes.position.array,a=r.length/3;for(let o=0;o<a;o++){const c=this.fireflyPhases[o];r[o*3]+=Math.sin(t*.08+c)*e*.6,r[o*3+1]+=Math.sin(t*.12+c*2)*e*.3,r[o*3+2]+=Math.cos(t*.1+c)*e*.5,Math.abs(r[o*3])>150&&(r[o*3]*=.95),(r[o*3+1]>70||r[o*3+1]<3)&&(r[o*3+1]=5+Math.random()*55),Math.abs(r[o*3+2])>150&&(r[o*3+2]*=.95)}this.fireflyParticles.geometry.attributes.position.needsUpdate=!0,this.fireflyParticles.material.opacity=.15+Math.sin(t*.8)*.12,this.fireflyParticles.material.size=1.5+Math.sin(t*.6)*.4}}class Gv{constructor(t,e){this.scene=t,this.camera=e,this.position=new R(0,0,80),this.velocity=new R,this.rotation=0,this.moveSpeed=40,this.currentSpeed=0,this.rotSpeed=2.2,this.isMoving=!1,this.cameraOffset=new R(0,14,28),this.cameraLookAhead=8,this.cameraSmoothness=5,this.bobEnabled=!0,this.bobTime=0,this.bobFrequency=7,this.bobAmplitudeY=.35,this.bobAmplitudeX=.12,this.idleBobFreq=1.2,this.idleBobAmp=.08,this.keys={forward:!1,backward:!1,left:!1,right:!1,sprint:!1},this._baseFov=60,this._sprintFov=72,this._currentFov=60,this._zoomLevel=1,this._zoomMin=.35,this._zoomMax=2.2,this._lastStepSign=1,this._dustPuffs=[],this.avatarGroup=new Re,this._buildAvatar(),this.avatarGroup.position.copy(this.position),t.add(this.avatarGroup),this.walkTime=0,this._bindControls();const i=this.cameraOffset.clone().applyAxisAngle(new R(0,1,0),this.rotation);this.camera.position.copy(this.position.clone().add(i)),this._currentLookTarget=this.position.clone().add(new R(-Math.sin(this.rotation),3,-Math.cos(this.rotation)).multiplyScalar(this.cameraLookAhead)),this._currentLookTarget.y=this.position.y+4,this.camera.lookAt(this._currentLookTarget)}_buildAvatar(){this._meshWrapper=new Re,this._meshWrapper.rotation.y=Math.PI,this.avatarGroup.add(this._meshWrapper);const t=new Ee(.9,.7,2.2,8),e=new ve({color:54510,emissive:39355,emissiveIntensity:.5,metalness:.85,roughness:.15,transparent:!0,opacity:.75});this.torso=new ht(t,e),this.torso.position.y=4.5,this._meshWrapper.add(this.torso);const i=new Ee(1.1,.9,.8,8),s=e.clone();s.emissiveIntensity=.6,this.shoulders=new ht(i,s),this.shoulders.position.y=5.9,this._meshWrapper.add(this.shoulders);const r=new Ee(1,.8,2.4,8),a=new we({color:58879,wireframe:!0,transparent:!0,opacity:.15}),o=new ht(r,a);o.position.y=4.5,this._meshWrapper.add(o);const c=new pa(.85,1),l=new ve({color:65484,emissive:56763,emissiveIntensity:.7,metalness:.7,roughness:.15,transparent:!0,opacity:.85});this.head=new ht(c,l),this.head.position.y=7.2,this._meshWrapper.add(this.head);const h=new hn(1.6,.22,.45),u=new ve({color:16777215,emissive:58879,emissiveIntensity:2.5,transparent:!0,opacity:.9});this.visor=new ht(h,u),this.visor.position.set(0,7.2,.6),this._meshWrapper.add(this.visor);const d=new Ee(.04,.04,.8,4),f=new ve({color:58879,emissive:58879,emissiveIntensity:1}),_=new ht(d,f);_.position.set(0,8.2,0),this._meshWrapper.add(_);const g=new Jn(.12,8,8),m=new ve({color:65450,emissive:65450,emissiveIntensity:2});this.antennaTip=new ht(g,m),this.antennaTip.position.set(0,8.7,0),this._meshWrapper.add(this.antennaTip);const p=new Ee(.18,.15,1.4,6),b=new ve({color:48093,emissive:34986,emissiveIntensity:.4,transparent:!0,opacity:.65});this.leftArmPivot=new Re,this.leftArmPivot.position.set(-1.2,5.8,0),this._meshWrapper.add(this.leftArmPivot),this.leftUpperArm=new ht(p,b),this.leftUpperArm.position.y=-.7,this.leftArmPivot.add(this.leftUpperArm);const y=new Ee(.14,.1,1.2,6);this.leftForearmPivot=new Re,this.leftForearmPivot.position.y=-1.4,this.leftArmPivot.add(this.leftForearmPivot),this.leftForearm=new ht(y,b.clone()),this.leftForearm.position.y=-.6,this.leftForearmPivot.add(this.leftForearm);const v=new Jn(.14,6,6),C=new ve({color:56831,emissive:48093,emissiveIntensity:.5});this.leftHand=new ht(v,C),this.leftHand.position.y=-1.2,this.leftForearmPivot.add(this.leftHand),this.rightArmPivot=new Re,this.rightArmPivot.position.set(1.2,5.8,0),this._meshWrapper.add(this.rightArmPivot),this.rightUpperArm=new ht(p,b.clone()),this.rightUpperArm.position.y=-.7,this.rightArmPivot.add(this.rightUpperArm),this.rightForearmPivot=new Re,this.rightForearmPivot.position.y=-1.4,this.rightArmPivot.add(this.rightForearmPivot),this.rightForearm=new ht(y,b.clone()),this.rightForearm.position.y=-.6,this.rightForearmPivot.add(this.rightForearm),this.rightHand=new ht(v,C.clone()),this.rightHand.position.y=-1.2,this.rightForearmPivot.add(this.rightHand);const T=new Ee(.24,.2,1.5,6),w=new ve({color:39372,emissive:26248,emissiveIntensity:.35,transparent:!0,opacity:.65});this.leftLegPivot=new Re,this.leftLegPivot.position.set(-.35,3.3,0),this._meshWrapper.add(this.leftLegPivot),this.leftUpperLeg=new ht(T,w),this.leftUpperLeg.position.y=-.75,this.leftLegPivot.add(this.leftUpperLeg);const P=new Ee(.18,.12,1.5,6);this.leftKneePivot=new Re,this.leftKneePivot.position.y=-1.5,this.leftLegPivot.add(this.leftKneePivot),this.leftLowerLeg=new ht(P,w.clone()),this.leftLowerLeg.position.y=-.75,this.leftKneePivot.add(this.leftLowerLeg);const M=new hn(.22,.12,.5),x=new ve({color:35003,emissive:26265,emissiveIntensity:.3});this.leftFoot=new ht(M,x),this.leftFoot.position.set(0,-1.55,.1),this.leftKneePivot.add(this.leftFoot),this.rightLegPivot=new Re,this.rightLegPivot.position.set(.35,3.3,0),this._meshWrapper.add(this.rightLegPivot),this.rightUpperLeg=new ht(T,w.clone()),this.rightUpperLeg.position.y=-.75,this.rightLegPivot.add(this.rightUpperLeg),this.rightKneePivot=new Re,this.rightKneePivot.position.y=-1.5,this.rightLegPivot.add(this.rightKneePivot),this.rightLowerLeg=new ht(P,w.clone()),this.rightLowerLeg.position.y=-.75,this.rightKneePivot.add(this.rightLowerLeg),this.rightFoot=new ht(M,x.clone()),this.rightFoot.position.set(0,-1.55,.1),this.rightKneePivot.add(this.rightFoot);const D=new Pl(2,24),F=new we({color:58879,transparent:!0,opacity:.06,side:xe});this.groundDisc=new ht(D,F),this.groundDisc.rotation.x=-Math.PI/2,this.groundDisc.position.y=.05,this._meshWrapper.add(this.groundDisc),this.avatarLight=new vi(54510,1.5,25),this.avatarLight.position.y=5,this._meshWrapper.add(this.avatarLight),this._buildTrailParticles()}_buildTrailParticles(){const e=new he,i=new Float32Array(60);for(let r=0;r<20;r++)i[r*3]=0,i[r*3+1]=Math.random()*7,i[r*3+2]=0;e.setAttribute("position",new Te(i,3));const s=new Ys({color:58879,size:.5,transparent:!0,opacity:.25,blending:Si,depthWrite:!1,sizeAttenuation:!0});this.trailParticles=new aa(e,s),this.avatarGroup.add(this.trailParticles),this._trailData={positions:i,count:20}}_bindControls(){this._onKeyDown=t=>{const e=t.key.toLowerCase();(e==="w"||e==="arrowup")&&(this.keys.forward=!0,t.preventDefault()),(e==="s"||e==="arrowdown")&&(this.keys.backward=!0,t.preventDefault()),(e==="a"||e==="arrowleft")&&(this.keys.left=!0,t.preventDefault()),(e==="d"||e==="arrowright")&&(this.keys.right=!0,t.preventDefault()),e==="shift"&&(this.keys.sprint=!0)},this._onKeyUp=t=>{const e=t.key.toLowerCase();(e==="w"||e==="arrowup")&&(this.keys.forward=!1),(e==="s"||e==="arrowdown")&&(this.keys.backward=!1),(e==="a"||e==="arrowleft")&&(this.keys.left=!1),(e==="d"||e==="arrowright")&&(this.keys.right=!1),e==="shift"&&(this.keys.sprint=!1)},window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),this._onWheel=t=>{this._zoomLevel+=t.deltaY*.001,this._zoomLevel=Math.max(this._zoomMin,Math.min(this._zoomMax,this._zoomLevel))},window.addEventListener("wheel",this._onWheel,{passive:!0})}enable(){this.avatarGroup.visible=!0,window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp)}disable(){this.keys={forward:!1,backward:!1,left:!1,right:!1,sprint:!1}}update(t,e){const i=this.keys.sprint?this.moveSpeed*1.8:this.moveSpeed,s=new R(0,0,0);if(this._navTarget){const o=new R(this._navTarget.x-this.position.x,0,this._navTarget.z-this.position.z);o.length()<8?this._navTarget=null:(o.normalize(),s.copy(o))}if(this.keys.forward||this.keys.backward||this.keys.left||this.keys.right){this._navTarget=null;const o=new R;this.camera.getWorldDirection(o),o.y=0,o.normalize();const c=new R;c.crossVectors(o,new R(0,1,0)).normalize(),this.keys.forward&&s.add(o),this.keys.backward&&s.sub(o),this.keys.left&&s.sub(c),this.keys.right&&s.add(c)}this.isMoving=s.lengthSq()>0;const r=this.isMoving?i:0,a=this.isMoving?8:12;if(this.currentSpeed+=(r-this.currentSpeed)*Math.min(a*t,1),this.isMoving){s.normalize(),this.velocity.copy(s).multiplyScalar(this.currentSpeed*t),this.position.add(this.velocity);let c=Math.atan2(-s.x,-s.z)-this.rotation;for(;c>Math.PI;)c-=Math.PI*2;for(;c<-Math.PI;)c+=Math.PI*2;this.rotation+=c*Math.min(10*t,1)}else this.currentSpeed>.5?this.position.add(this.velocity.clone().multiplyScalar(this.currentSpeed/i*.5)):this.velocity.set(0,0,0);this.position.y=0,this.avatarGroup.position.copy(this.position),this.avatarGroup.rotation.y=this.rotation,this.isMoving?(this.walkTime+=t*(this.keys.sprint?14:10),this._animateWalk(this.walkTime),this._checkFootstep()):(this.walkTime=0,this._animateIdle(e)),this._updateDustPuffs(t),this._updateTrail(t,e),this._updateCamera(t,e)}_animateWalk(t){const e=Math.sin(t)*.55,i=Math.max(0,Math.sin(t+.5))*.5;this.leftLegPivot.rotation.x=e,this.leftKneePivot.rotation.x=i,this.rightLegPivot.rotation.x=-e,this.rightKneePivot.rotation.x=Math.max(0,Math.sin(-t+.5))*.5,this.leftArmPivot.rotation.x=-e*.6,this.leftForearmPivot.rotation.x=-Math.max(0,Math.sin(-t+.3))*.4,this.rightArmPivot.rotation.x=e*.6,this.rightForearmPivot.rotation.x=-Math.max(0,Math.sin(t+.3))*.4;const s=Math.abs(Math.sin(t*2))*.15;this.torso.position.y=4.5+s,this.shoulders.position.y=5.9+s,this.head.position.y=7.2+s*.8,this.visor.position.y=7.2+s*.8,this.torso.rotation.z=Math.sin(t*.5)*.03,this.head.rotation.z=Math.sin(t*.5)*.04,this.head.rotation.y=0,this.visor.material.emissiveIntensity=2.5+Math.sin(t*3)*.5,this.antennaTip.material.emissiveIntensity=1.5+Math.sin(t*5)*1}_animateIdle(t){const e=Math.sin(t*this.idleBobFreq)*this.idleBobAmp;this.torso.position.y=4.5+e,this.shoulders.position.y=5.9+e*.9,this.head.position.y=7.2+e*.7,this.visor.position.y=7.2+e*.7,this.leftLegPivot.rotation.x*=.92,this.rightLegPivot.rotation.x*=.92,this.leftKneePivot.rotation.x*=.92,this.rightKneePivot.rotation.x*=.92,this.leftArmPivot.rotation.x*=.92,this.rightArmPivot.rotation.x*=.92,this.leftForearmPivot.rotation.x*=.92,this.rightForearmPivot.rotation.x*=.92,this.head.rotation.y=Math.sin(t*.3)*.08,this.head.rotation.z=0,this.torso.rotation.z=0,this.visor.material.emissiveIntensity=1.8+Math.sin(t*2)*.4,this.antennaTip.material.emissiveIntensity=1+Math.sin(t*1.5)*.5,this.groundDisc.material.opacity=.04+Math.sin(t*2)*.025}_updateTrail(t,e){if(!this._trailData)return;const{positions:i,count:s}=this._trailData;for(let r=0;r<s;r++)i[r*3+1]+=t*(.8+Math.random()*.5),i[r*3]+=Math.sin(e+r)*t*.3,i[r*3+2]+=Math.cos(e+r)*t*.2,i[r*3+1]>10&&(i[r*3]=(Math.random()-.5)*1.5,i[r*3+1]=Math.random(),i[r*3+2]=(Math.random()-.5)*1.5);this.trailParticles.geometry.attributes.position.needsUpdate=!0,this.trailParticles.material.opacity=this.isMoving?.4:.12}_updateCamera(t,e){const i=this.cameraOffset.clone().applyAxisAngle(new R(0,1,0),this.rotation),s=this.position.clone().add(i);let r=new R(0,0,0);this.isMoving&&this.bobEnabled?(this.bobTime+=t*this.bobFrequency*(this.keys.sprint?1.3:1),r.y=Math.sin(this.bobTime)*this.bobAmplitudeY,r.x=Math.sin(this.bobTime*.5)*this.bobAmplitudeX):(r.y=Math.sin(e*this.idleBobFreq)*this.idleBobAmp*.3,this.bobTime=0);const a=this.cameraSmoothness*t;this.camera.position.lerp(s.add(r),Math.min(a,1)),this.isMoving&&this.keys.sprint&&(this.camera.position.x+=(Math.random()-.5)*.08,this.camera.position.y+=(Math.random()-.5)*.08*.5);const o=this.isMoving&&this.keys.sprint?this._sprintFov:this._baseFov;this._currentFov+=(o-this._currentFov)*Math.min(4*t,1),this.camera.fov=this._currentFov;const c=8+this._zoomLevel*8,l=12+this._zoomLevel*16;this.cameraOffset.y+=(c-this.cameraOffset.y)*Math.min(5*t,1),this.cameraOffset.z+=(l-this.cameraOffset.z)*Math.min(5*t,1),this.camera.updateProjectionMatrix();const h=this.position.clone().add(new R(-Math.sin(this.rotation),3,-Math.cos(this.rotation)).multiplyScalar(this.cameraLookAhead));h.y=this.position.y+4,this._currentLookTarget||(this._currentLookTarget=h.clone()),this._currentLookTarget.lerp(h,Math.min(a*1.2,1)),this.camera.lookAt(this._currentLookTarget)}navigateTo(t,e){this._navTarget=new R(t,0,e)}_checkFootstep(){const e=Math.sin(this.walkTime)>=0?1:-1;e!==this._lastStepSign&&(this._lastStepSign=e,this._spawnDustPuff())}_spawnDustPuff(){const e={particles:[],age:0,maxAge:.6};for(let i=0;i<5;i++){const s=new wi(.3,.3),r=new we({color:4500172,transparent:!0,opacity:.4,side:xe,depthWrite:!1}),a=new ht(s,r);a.position.set(this.position.x+(Math.random()-.5)*1.2,.1+Math.random()*.3,this.position.z+(Math.random()-.5)*1.2),a.rotation.x=-Math.PI/2,a.userData.vx=(Math.random()-.5)*2,a.userData.vz=(Math.random()-.5)*2,a.userData.vy=.5+Math.random()*1,this.scene.add(a),e.particles.push(a)}this._dustPuffs.push(e)}_updateDustPuffs(t){for(let e=this._dustPuffs.length-1;e>=0;e--){const i=this._dustPuffs[e];i.age+=t;const s=i.age/i.maxAge;if(s>=1){i.particles.forEach(r=>{this.scene.remove(r),r.geometry.dispose(),r.material.dispose()}),this._dustPuffs.splice(e,1);continue}i.particles.forEach(r=>{r.position.x+=r.userData.vx*t,r.position.y+=r.userData.vy*t,r.position.z+=r.userData.vz*t,r.material.opacity=.4*(1-s);const a=1+s*2;r.scale.set(a,a,a)})}}disable(){this.enabled=!1}enable(){this.enabled=!0}setPosition(t,e,i){this.position.set(t,e,i),this.avatarGroup.position.copy(this.position)}dispose(){window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp),this._onWheel&&window.removeEventListener("wheel",this._onWheel),this._dustPuffs.forEach(t=>{t.particles.forEach(e=>{this.scene.remove(e),e.geometry.dispose(),e.material.dispose()})}),this._dustPuffs=[],this.avatarGroup.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(e=>e.dispose()):t.material.dispose())}),this.scene.remove(this.avatarGroup)}}class Vv{constructor(t){this.container=t,this.modules=[],this.playerPos={x:0,z:0},this.visible=!0,this._createCanvas()}_createCanvas(){const t=document.createElement("div");t.className="minimap-wrapper";const e=document.createElement("canvas");e.className="minimap-canvas",e.width=180,e.height=180,t.appendChild(e);const i=document.createElement("div");i.className="minimap-title",i.textContent="MAP",t.appendChild(i),this.container.appendChild(t),this.canvas=e,this.ctx=e.getContext("2d"),this.wrapper=t}setModules(t,e){var a;this.modules=[];const i=[];for(const[o,c]of Object.entries(t)){i.push({x:c.position.x,z:c.position.z});const l=e[o]||{};this.modules.push({x:c.position.x,z:c.position.z,type:l.moduleType||((a=c.userData)==null?void 0:a.moduleType)||"unknown",name:l.moduleName||o})}if(i.length===0)return;const s=i.map(o=>o.x),r=i.map(o=>o.z);this.bounds={minX:Math.min(...s)-20,maxX:Math.max(...s)+20,minZ:Math.min(...r)-20,maxZ:Math.max(...r)+20}}updatePlayerPosition(t,e){this.playerPos.x=t,this.playerPos.z=e}render(){if(!this.visible||!this.bounds)return;const{ctx:t,canvas:e}=this,i=e.width,s=e.height,r=14;t.clearRect(0,0,i,s),t.fillStyle="rgba(13, 17, 23, 0.9)",t.beginPath(),t.roundRect(0,0,i,s,10),t.fill(),t.strokeStyle="rgba(240, 246, 252, 0.1)",t.lineWidth=1,t.stroke();const a=d=>r+(d-this.bounds.minX)/(this.bounds.maxX-this.bounds.minX)*(i-r*2),o=d=>r+(d-this.bounds.minZ)/(this.bounds.maxZ-this.bounds.minZ)*(s-r*2),c={incomingCall:"#0088cc",skillTransfer:"#cc7700",case:"#ccaa00",ifElse:"#ccaa00",hangup:"#cc2244",play:"#8844cc",setVariable:"#5577aa",blockedCallerList:"#cc4466",thirdPartyTransfer:"#cc5588",voiceMailTransfer:"#cc5588",agentTransfer:"#cc7700"};this.modules.forEach(d=>{const f=a(d.x),_=o(d.z),g=c[d.type]||"#7788aa";t.fillStyle=g,t.beginPath(),t.arc(f,_,4,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(0,0,0,0.5)",t.lineWidth=1.5,t.stroke()});const l=a(this.playerPos.x),h=o(this.playerPos.z),u=1+Math.sin(performance.now()*.005)*.2;t.save(),t.translate(l,h),t.scale(u,u),t.fillStyle="#0055dd",t.beginPath(),t.moveTo(0,-5),t.lineTo(4,3),t.lineTo(-4,3),t.closePath(),t.fill(),t.strokeStyle="#fff",t.lineWidth=1.5,t.stroke(),t.restore()}toggle(){this.visible=!this.visible,this.wrapper.style.display=this.visible?"block":"none"}dispose(){this.wrapper&&this.wrapper.parentNode&&this.wrapper.parentNode.removeChild(this.wrapper)}}class Wv{constructor(t){this.container=t,this.modules3D={},this.moduleData={},this.cables=[],this.aniNodes=[],this.aniCables=[],this.labelsVisible=!0,this.heatMapActive=!0,this.aniExpansionEnabled=!1,this.onModuleClick=null,this.controlMode="thirdPerson",this.avatar=null,this._heatTransition={active:!1,progress:0,direction:1,duration:.6},this._currentParsedData=null,this._currentHeatData=null,this._hoverTargets={},this._hoverCurrent={},this._hoveredModule=null,this._selectedModule=null,this._tooltip=null,this._tracedPath=new Set,this._pulseRings=[],this._proximityRange=25,this._tour={active:!1,path:[],index:0,timer:0,dwellTime:2.5,transitTime:1.5},this._init()}_init(){this.scene=new Qf,this.scene.background=new ut(856343);const t=this.container.clientWidth/this.container.clientHeight;this.camera=new qe(60,t,.1,5e3),this.camera.position.set(0,30,120),this.renderer=new fv({antialias:!0,alpha:!1,preserveDrawingBuffer:!0}),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.toneMapping=yl,this.renderer.toneMappingExposure=1.2,this.container.appendChild(this.renderer.domElement),this.labelRenderer=new zv,this.labelRenderer.setSize(this.container.clientWidth,this.container.clientHeight),this.labelRenderer.domElement.style.position="absolute",this.labelRenderer.domElement.style.top="0",this.labelRenderer.domElement.style.left="0",this.labelRenderer.domElement.style.pointerEvents="none",this.container.appendChild(this.labelRenderer.domElement),this.controls=new mv(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.06,this.controls.minDistance=15,this.controls.maxDistance=1500,this.controls.maxPolarAngle=Math.PI*.85,this.controls.mouseButtons={LEFT:In.ROTATE,MIDDLE:In.DOLLY,RIGHT:In.PAN},this.controls.enabled=!1,this.composer=new Iv(this.renderer);const e=new Uv(this.scene,this.camera);this.composer.addPass(e),this.bloomPass=new ps(new tt(this.container.clientWidth,this.container.clientHeight),.45,.4,.85),this.composer.addPass(this.bloomPass);const i=new Ov;this.composer.addPass(i),this._setupLights(),this._createGrid(),this.raycaster=new Cp,this.mouse=new tt,this.renderer.domElement.addEventListener("click",s=>this._onMouseClick(s)),this.renderer.domElement.addEventListener("mousemove",s=>this._onMouseMove(s)),this.renderer.domElement.addEventListener("dblclick",s=>this._onDoubleClick(s)),this._tooltip=document.createElement("div"),this._tooltip.className="module-tooltip",this._tooltip.style.display="none",document.body.appendChild(this._tooltip),window.addEventListener("keydown",s=>{s.key==="Tab"&&(s.preventDefault(),this.toggleControlMode())}),this.renderer.domElement.addEventListener("wheel",s=>{this.controlMode==="thirdPerson"&&this.avatar&&(this.avatar.cameraOffset.z=Math.max(15,Math.min(150,this.avatar.cameraOffset.z+s.deltaY*.05*2)),this.avatar.cameraOffset.y=Math.max(8,Math.min(80,this.avatar.cameraOffset.y+s.deltaY*.02*2)))}),window.addEventListener("resize",()=>this._onResize()),this.moduleFactory=new Bv,this.cableRenderer=new kv,this.particleSystem=new Hv(this.scene),this.miniMap=new Vv(this.container),this.clock=new Bu,this.avatar=new Gv(this.scene,this.camera),this._animate()}toggleControlMode(){this._tour.active&&this.stopTour(),this.controlMode==="thirdPerson"?(this.controlMode="orbit",this.controls.enabled=!0,this.controls.target.copy(this.avatar.position),this.controls.target.y=5,this.avatar&&(this.avatar.disable(),this.avatar.avatarGroup.visible=!0),this._updateModeBadge("orbit")):(this.controlMode="thirdPerson",this.controls.enabled=!1,this.avatar&&(this.avatar.enable(),this.avatar.avatarGroup.visible=!0),this._updateModeBadge("thirdPerson"))}_setupLights(){const t=new Tp(3359846,.6);this.scene.add(t);const e=new Lc(8952268,1);e.position.set(50,120,50),e.castShadow=!0,this.scene.add(e);const i=new Lc(5588019,.3);i.position.set(-50,60,-30),this.scene.add(i);const s=new vi(35071,1.2,400);s.position.set(-80,30,0),this.scene.add(s);const r=new vi(6702284,.8,350);r.position.set(80,50,-40),this.scene.add(r);const a=new bp(2241365,1118498,.5);this.scene.add(a)}_createGrid(){const e=document.createElement("canvas");e.width=2,e.height=512;const i=e.getContext("2d"),s=i.createLinearGradient(0,0,0,512);s.addColorStop(0,"#0a0e1a"),s.addColorStop(.3,"#0f1525"),s.addColorStop(.6,"#141a2a"),s.addColorStop(1,"#1a1e2e"),i.fillStyle=s,i.fillRect(0,0,2,512);const r=new es(e);r.needsUpdate=!0,this.scene.background=r;const a=50,o=new Rp(800,a,1712691,1383464);o.position.y=-2,o.material.opacity=.5,o.material.transparent=!0,this.scene.add(o);const c=document.createElement("canvas");c.width=1024,c.height=1024;const l=c.getContext("2d");l.fillStyle="#111820",l.fillRect(0,0,1024,1024),l.strokeStyle="rgba(0, 136, 204, 0.12)",l.lineWidth=1;const h=30,u=h*Math.sqrt(3);for(let y=-1;y<1024/u+1;y++)for(let v=-1;v<1024/(h*1.5)+1;v++){const C=v*h*1.5,T=y*u+(v%2?u/2:0);l.beginPath();for(let w=0;w<6;w++){const P=Math.PI/3*w-Math.PI/6,M=C+h*.9*Math.cos(P),x=T+h*.9*Math.sin(P);w===0?l.moveTo(M,x):l.lineTo(M,x)}l.closePath(),l.stroke()}l.fillStyle="rgba(0, 136, 204, 0.08)";for(let y=-1;y<1024/u+1;y++)for(let v=-1;v<1024/(h*1.5)+1;v++){const C=v*h*1.5,T=y*u+(v%2?u/2:0);l.beginPath(),l.arc(C,T,1.5,0,Math.PI*2),l.fill()}const d=new es(c);d.wrapS=Vs,d.wrapT=Vs,d.repeat.set(12,12),d.needsUpdate=!0;const f=new wi(800,800),_=new ve({map:d,roughness:.85,metalness:.1,side:xe}),g=new ht(f,_);g.rotation.x=-Math.PI/2,g.position.y=-2.1,g.receiveShadow=!0,this.scene.add(g);const m=new qn(800*.35,800*.55,64),p=new we({color:856343,transparent:!0,opacity:.7,side:xe}),b=new ht(m,p);b.rotation.x=-Math.PI/2,b.position.y=-1.9,this.scene.add(b),this._pulseRings=[];for(let y=0;y<3;y++){const v=new qn(15+y*25,16+y*25,64),C=new we({color:35020,transparent:!0,opacity:0,side:xe}),T=new ht(v,C);T.rotation.x=-Math.PI/2,T.position.y=-1.85,T.userData.pulsePhase=y*(Math.PI*2/3),T.userData.baseRadius=15+y*25,this.scene.add(T),this._pulseRings.push(T)}}buildGraph(t,e){this._clearScene(),this._currentParsedData=t,this._currentHeatData=e;const{modules:i,edges:s,moduleMap:r}=t;this.moduleData=r;const a=i.map(m=>({x:m.locationX,y:m.locationY})),o=Math.min(...a.map(m=>m.x)),c=Math.max(...a.map(m=>m.x)),l=Math.min(...a.map(m=>m.y)),h=Math.max(...a.map(m=>m.y)),u=c-o||1,d=h-l||1,f=140;i.forEach((m,p)=>{const b=((m.locationX-o)/u-.5)*f,y=((m.locationY-l)/d-.5)*f;let v=5;m.flow==="onHangup"&&(v=12);const C=this.moduleFactory.create(m,e);C.position.set(b,v,y),C.userData={moduleId:m.moduleId,moduleType:m.moduleType,baseY:v,floatOffset:Math.random()*Math.PI*2,floatSpeed:.8+Math.random()*.6,floatAmp:.06+Math.random()*.06,moduleName:m.moduleName},this._addDropShadow(C,b,y),C.scale.setScalar(0),this.scene.add(C),this.modules3D[m.moduleId]=C,this._hoverTargets[m.moduleId]={scale:.65,glow:0},this._hoverCurrent[m.moduleId]={scale:0,glow:0};const T=p*40,w=.65,P=performance.now()+T,M=400,x=()=>{const D=performance.now()-P;if(D<0){requestAnimationFrame(x);return}const F=Math.min(D/M,1),O=1-Math.pow(1-F,3)*Math.cos(F*Math.PI*1.2),H=w*Math.min(O,1);C.scale.setScalar(H),this._hoverCurrent[m.moduleId].scale=H,F<1&&requestAnimationFrame(x)};requestAnimationFrame(x),this._addLabel(C,m),m.moduleType==="incomingCall"&&this._addStartHereMarker(C.position)});const _={},g={};if(s.forEach(m=>{_[m.from]=(_[m.from]||0)+1}),s.forEach(m=>{var y,v,C;const p=this.modules3D[m.from],b=this.modules3D[m.to];if(p&&b){const T=`${m.from}->${m.to}`,w=e!=null,P=w?(((y=e.edgeVolumes)==null?void 0:y[T])||1e3)/(e.maxVolume||1e4):.3,M=w&&(((v=e.frictionModules)==null?void 0:v.includes(m.to))||!1),x=w&&(((C=e.successModules)==null?void 0:C.includes(m.to))||!1),D=m.from,F=g[D]||0;g[D]=F+1;const O=_[D]||1,H=this.cableRenderer.create(p.position,b.position,{type:m.type,volume:w?P:.15,isFriction:w?M:!1,isSuccess:w?x:!1,label:m.label,dimMode:!w,edgeIndex:F,totalEdges:O});this.scene.add(H),H.userData.fromId=m.from,H.userData.toId=m.to,this.cables.push(H)}}),this.avatar&&i.length>0){const m=this.modules3D[i[0].moduleId];m&&this.avatar.setPosition(m.position.x,0,m.position.z+25)}this._flyToOverview(),this.miniMap&&this.miniMap.setModules(this.modules3D,this.moduleData)}_addLabel(t,e){const i=document.createElement("div");i.className=`module-label ${e.moduleType==="incomingCall"?"incoming-label":e.moduleType==="skillTransfer"?"skill-label":e.moduleType==="case"||e.moduleType==="ifElse"?"case-label":e.moduleType==="hangup"?"hangup-label":e.moduleType==="play"?"play-label":e.moduleType==="thirdPartyTransfer"||e.moduleType==="voiceMailTransfer"?"transfer-label":e.moduleType==="agentTransfer"?"skill-label":e.moduleType==="lookupCRMRecord"||e.moduleType==="crmUpdate"?"crm-label":e.moduleType==="setVariable"?"var-label":""}`,i.textContent=e.moduleName;const s=new uh(i);s.position.set(0,8,0),t.add(s),s.layers.set(0)}_addDropShadow(t,e,i){if(!this._shadowTexture){const l=document.createElement("canvas");l.width=128,l.height=128;const h=l.getContext("2d"),u=h.createRadialGradient(64,64,0,64,64,64);u.addColorStop(0,"rgba(0, 0, 0, 0.12)"),u.addColorStop(.5,"rgba(0, 0, 0, 0.06)"),u.addColorStop(1,"rgba(0, 0, 0, 0.0)"),h.fillStyle=u,h.fillRect(0,0,128,128),this._shadowTexture=new es(l),this._shadowTexture.needsUpdate=!0}const s=new al({map:this._shadowTexture,transparent:!0,depthTest:!0,depthWrite:!1}),r=new Mc(s);r.scale.set(12,12,1),r.position.set(e,-1.8,i),r.material.rotation=0;const a=new wi(12,12),o=new we({map:this._shadowTexture,transparent:!0,depthWrite:!1,side:xe}),c=new ht(a,o);c.rotation.x=-Math.PI/2,c.position.set(e,-1.8,i),this.scene.add(c)}_addStartHereMarker(t){const e=t.x,i=t.y,s=t.z,r=new qn(6,7.5,32),a=new we({color:35020,transparent:!0,opacity:.5,side:xe}),o=new ht(r,a);o.rotation.x=-Math.PI/2,o.position.set(e,i-4,s),this.scene.add(o);const c=new qn(8.5,9.5,32),l=new we({color:35020,transparent:!0,opacity:.25,side:xe}),h=new ht(c,l);h.rotation.x=-Math.PI/2,h.position.set(e,i-4,s),this.scene.add(h);const u=new Ee(.2,.2,16,8),d=new we({color:35020,transparent:!0,opacity:.25}),f=new ht(u,d);f.position.set(e,i+4,s),this.scene.add(f);const _=document.createElement("canvas"),g=_.getContext("2d");_.width=512,_.height=128,g.fillStyle="rgba(0, 136, 204, 0.15)",g.strokeStyle="rgba(0, 136, 204, 0.6)",g.lineWidth=4;const m=20,p=20,b=472,y=88;g.beginPath(),g.roundRect(m,p,b,y,30),g.fill(),g.stroke(),g.font="bold 42px Inter, Arial, sans-serif",g.textAlign="center",g.textBaseline="middle",g.fillStyle="#0077bb",g.fillText("▶  START HERE",_.width/2,_.height/2);const v=new es(_);v.needsUpdate=!0;const C=new al({map:v,transparent:!0,depthTest:!1,sizeAttenuation:!0}),T=new Mc(C);T.scale.set(16,4,1),T.position.set(e,i+12,s),this.scene.add(T),this._startHereObjects=[o,h,f,T];const w=()=>{const P=performance.now()*.001;o.material.opacity=.3+Math.sin(P*2)*.2,h.material.opacity=.15+Math.sin(P*2+1)*.1,o.scale.setScalar(1+Math.sin(P*1.5)*.08),h.scale.setScalar(1+Math.sin(P*1.5+.5)*.06),f.material.opacity=.15+Math.sin(P*3)*.1,T.material.opacity=.85+Math.sin(P*2)*.15,requestAnimationFrame(w)};w()}_flyToOverview(){const t=Object.values(this.modules3D).map(i=>i.position);if(t.length===0)return;const e=new R;if(t.forEach(i=>e.add(i)),e.divideScalar(t.length),this.controlMode==="thirdPerson"&&this.avatar)this.avatar.setPosition(e.x,0,e.z+50);else{const i=new R(e.x+80,e.y+100,e.z+160),s=this.camera.position.clone(),r=this.controls.target.clone(),a=2e3,o=Date.now(),c=()=>{const l=Date.now()-o,h=Math.min(l/a,1),u=1-Math.pow(1-h,4);this.camera.position.lerpVectors(s,i,u),this.controls.target.lerpVectors(r,e,u),this.controls.update(),h<1&&requestAnimationFrame(c)};c()}}_clearScene(){Object.values(this.modules3D).forEach(t=>{t.traverse(e=>{e.isCSS2DObject&&e.element&&e.element.parentNode&&e.element.parentNode.removeChild(e.element),e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(i=>i.dispose()):e.material.dispose())}),this.scene.remove(t)}),this.cables.forEach(t=>{this.scene.remove(t),t.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}),this.modules3D={},this.cables=[],this._clearANIExpansion(),this._startHereObjects&&(this._startHereObjects.forEach(t=>{t.isCSS2DObject&&t.element&&t.element.parentNode&&t.element.parentNode.removeChild(t.element),this.scene.remove(t),t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()}),this._startHereObjects=null)}_onMouseClick(t){const e=this.renderer.domElement.getBoundingClientRect();this.mouse.x=(t.clientX-e.left)/e.width*2-1,this.mouse.y=-((t.clientY-e.top)/e.height)*2+1,this.raycaster.setFromCamera(this.mouse,this.camera);const i=[];Object.values(this.modules3D).forEach(r=>{r.traverse(a=>{a.isMesh&&i.push(a)})});const s=this.raycaster.intersectObjects(i,!1);if(s.length>0){let r=s[0].object;for(;r&&!r.userData.moduleId;)r=r.parent;if(r!=null&&r.userData.moduleId){if(this._selectedModule=r.userData.moduleId,this.controlMode==="thirdPerson"&&this.avatar){const a=this.modules3D[r.userData.moduleId];a&&this.avatar.navigateTo(a.position.x,a.position.z)}this.onModuleClick&&this.onModuleClick(r.userData.moduleId),this._highlightModule(r.userData.moduleId),this._tracePath(r.userData.moduleId)}}else this._selectedModule=null,this._tracedPath.clear(),this._resetAllCableOpacity()}_onDoubleClick(t){const e=this.renderer.domElement.getBoundingClientRect();this.mouse.x=(t.clientX-e.left)/e.width*2-1,this.mouse.y=-((t.clientY-e.top)/e.height)*2+1,this.raycaster.setFromCamera(this.mouse,this.camera);const i=[];Object.values(this.modules3D).forEach(r=>{r.traverse(a=>{a.isMesh&&i.push(a)})});const s=this.raycaster.intersectObjects(i,!1);if(s.length>0){let r=s[0].object;for(;r&&!r.userData.moduleId;)r=r.parent;if(r!=null&&r.userData.moduleId){const a=this.modules3D[r.userData.moduleId];a&&(this.controlMode==="thirdPerson"&&this.avatar?this.avatar.setPosition(a.position.x,0,a.position.z+15):this._flyToModule(a.position))}}}_flyToModule(t){const e=this.camera.position.clone(),i=new R(t.x+20,t.y+25,t.z+35),s=this.controls.target.clone(),r=t.clone(),a=1200,o=Date.now(),c=()=>{const l=Date.now()-o,h=Math.min(l/a,1),u=1-Math.pow(1-h,3);this.camera.position.lerpVectors(e,i,u),this.controls.target.lerpVectors(s,r,u),this.controls.update(),h<1&&requestAnimationFrame(c)};c()}startTour(){if(!this._currentParsedData)return;const{modules:t,edges:e}=this._currentParsedData,i=t.find(u=>u.moduleType==="incomingCall");if(!i)return;const s=new Set,r=[i.moduleId],a=[],o={};for(e.forEach(u=>{o[u.from]||(o[u.from]=[]),o[u.from].push(u.to)});r.length>0;){const u=r.shift();if(s.has(u))continue;s.add(u),this.modules3D[u]&&a.push(u),(o[u]||[]).forEach(f=>{s.has(f)||r.push(f)})}if(a.length===0)return;this.controlMode==="thirdPerson"?(this._preTourMode="thirdPerson",this.controlMode="orbit",this.avatar&&(this.avatar.avatarGroup.visible=!1,this.avatar.disable()),this.controls.enabled=!0):this._preTourMode="orbit",this._tour.active=!0,this._tour.path=a,this._tour.index=0,this._tour.timer=0,this._tour._transitioning=!0,this._updateModeBadge("tour"),this._updateTourCard(a[0],0,a.length);const c=document.getElementById("tour-card");c&&c.classList.remove("hidden");const l=document.getElementById("btn-toggle-tour");l&&l.classList.add("active");const h=this.modules3D[a[0]];h&&(this._flyToModule(h.position),this._highlightModule(a[0]),this._tracePath(a[0]))}stopTour(){this._tour.active=!1,this._tour.path=[],this._tour.index=0;const t=document.getElementById("tour-card");t&&t.classList.add("hidden");const e=document.getElementById("btn-toggle-tour");e&&e.classList.remove("active"),this._preTourMode==="thirdPerson"?(this.controlMode="thirdPerson",this.avatar&&(this.avatar.avatarGroup.visible=!0,this.avatar.enable()),this.controls.enabled=!1,this._updateModeBadge("thirdPerson")):this._updateModeBadge("orbit"),this._preTourMode=null}_updateTour(t){if(!this._tour.active)return;this._tour.timer+=t;const e=this._tour.dwellTime+this._tour.transitTime;if(this._tour.timer>=e){if(this._tour.timer=0,this._tour.index++,this._tour.index>=this._tour.path.length){this.stopTour();return}const i=this._tour.path[this._tour.index];this._highlightModule(i),this._tracePath(i),this._updateTourCard(i,this._tour.index,this._tour.path.length);const s=this.modules3D[i];s&&this._flyToModule(s.position)}if(this._tour.timer>this._tour.transitTime){const s=this._tour.timer*.2,r=this._tour.path[this._tour.index],a=this.modules3D[r];if(a&&this.controls){const c=a.position.x+Math.cos(s)*30,l=a.position.z+Math.sin(s)*30;this.camera.position.lerp(new R(c,a.position.y+20,l),Math.min(2*t,1)),this.controls.target.lerp(a.position,Math.min(3*t,1)),this.controls.update()}}}_updateModeBadge(t){const e=document.getElementById("mode-badge");if(!e)return;const i={thirdPerson:"🎮 3RD PERSON",orbit:"🎥 ORBIT",tour:"🎬 TOUR"};e.textContent=i[t]||t,e.classList.toggle("tour-active",t==="tour")}_updateTourCard(t,e,i){var c;const s=document.getElementById("tour-module-name"),r=document.getElementById("tour-module-type"),a=document.getElementById("tour-progress"),o=document.getElementById("mode-badge");if(this.moduleData&&this.moduleData[t]){const l=this.moduleData[t];s&&(s.textContent=l.moduleName||t),r&&(r.textContent=l.moduleType||"unknown")}else{const l=(c=this.modules3D[t])==null?void 0:c.userData;s&&(s.textContent=(l==null?void 0:l.moduleName)||t),r&&(r.textContent=(l==null?void 0:l.moduleType)||"unknown")}a&&(a.textContent=`${e+1} / ${i}`),o&&(o.textContent=`🎬 TOUR (${e+1}/${i})`)}_updateSpeedIndicator(){const t=document.getElementById("speed-fill"),e=document.getElementById("speed-label");if(!t||!e||!this.avatar)return;const i=this.avatar.currentSpeed,s=this.avatar.moveSpeed*1.8,r=Math.min(i/s*100,100);t.style.height=`${r}%`,i<1?e.textContent="IDLE":this.avatar.keys.sprint?e.textContent="SPRINT":e.textContent="MOVE"}_tracePath(t){if(this._tracedPath.clear(),!this._currentParsedData)return;const{edges:e}=this._currentParsedData,i={},s={};e.forEach(l=>{i[l.from]||(i[l.from]=[]),i[l.from].push(l.to),s[l.to]||(s[l.to]=[]),s[l.to].push(l.from)});const r=new Set,a=[t];for(r.add(t);a.length>0;){const l=a.shift();this._tracedPath.add(l),(i[l]||[]).forEach(h=>{r.has(h)||(r.add(h),a.push(h))})}const o=new Set([t]),c=[t];for(;c.length>0;){const l=c.shift();this._tracedPath.add(l),(s[l]||[]).forEach(h=>{o.has(h)||(o.add(h),c.push(h))})}this.cables.forEach(l=>{const h=this._tracedPath.has(l.userData.fromId)&&this._tracedPath.has(l.userData.toId);l.traverse(u=>{u.isMesh&&u.material&&(u.material.opacity=h?.9:.08),u.isPoints&&u.material&&(u.material.opacity=h?.8:.02)})})}_resetAllCableOpacity(){this.cables.forEach(t=>{t.traverse(e=>{e.isMesh&&e.material&&e.material._baseOpacity!==void 0?e.material.opacity=e.material._baseOpacity:e.isMesh&&e.material&&(e.material.opacity=e.material.opacity)})})}_highlightModule(t){Object.entries(this.modules3D).forEach(([i,s])=>{s.traverse(r=>{r.isMesh&&r.userData.isMainMesh&&(r.material.emissiveIntensity=r.userData.baseEmissive||.3)})});const e=this.modules3D[t];e&&e.traverse(i=>{i.isMesh&&i.userData.isMainMesh&&(i.material.emissiveIntensity=1.5)}),this._highlightConnectedCables(t)}_highlightConnectedCables(t){this.cables.forEach(e=>{const i=e.userData.fromId===t||e.userData.toId===t;e.traverse(s=>{s.isMesh&&s.material&&(s.material.opacity=i?.9:.15),s.isPoints&&s.material&&(s.material.opacity=i?.8:.05)})})}_onMouseMove(t){const e=this.renderer.domElement.getBoundingClientRect();this.mouse.x=(t.clientX-e.left)/e.width*2-1,this.mouse.y=-((t.clientY-e.top)/e.height)*2+1,this.raycaster.setFromCamera(this.mouse,this.camera);const i=[];Object.values(this.modules3D).forEach(r=>{r.traverse(a=>{a.isMesh&&i.push(a)})});const s=this.raycaster.intersectObjects(i,!1);if(this._hoveredModule&&this._hoverTargets[this._hoveredModule]&&(this._hoverTargets[this._hoveredModule].scale=.65,this._hoverTargets[this._hoveredModule].glow=0,this._hoveredModule=null),this._tooltip&&(this._tooltip.style.display="none"),s.length>0){let r=s[0].object;for(;r&&!r.userData.moduleId;)r=r.parent;if(r!=null&&r.userData.moduleId&&(this._hoveredModule=r.userData.moduleId,this._hoverTargets[this._hoveredModule]&&(this._hoverTargets[this._hoveredModule].scale=.73,this._hoverTargets[this._hoveredModule].glow=1),this._tooltip)){const a=this.moduleData[this._hoveredModule],o=r.userData.moduleName||(a==null?void 0:a.moduleName)||this._hoveredModule,c=r.userData.moduleType||(a==null?void 0:a.moduleType)||"unknown",h={incomingCall:"📞 Incoming Call",skillTransfer:"🎯 Skill Transfer",case:"🔀 Case/Branch",ifElse:"🔀 If/Else",hangup:"📴 Hangup",play:"🔊 Play Audio",startOnHangup:"⚡ On Hangup",voiceMailTransfer:"📧 Voicemail",thirdPartyTransfer:"📱 3rd Party Transfer",lookupCRMRecord:"🗄️ CRM Lookup",crmUpdate:"📝 CRM Update",agentTransfer:"👤 Agent Transfer",setVariable:"⚙️ Set Variable",blockedCallerList:"🛡️ Blocked Callers"}[c]||`📦 ${c}`;this._tooltip.innerHTML=`<strong>${o}</strong><span class="tooltip-type">${h}</span>`,this._tooltip.style.display="flex",this._tooltip.style.left=`${t.clientX+16}px`,this._tooltip.style.top=`${t.clientY-10}px`}}this.renderer.domElement.style.cursor=s.length>0?"pointer":"default"}_onResize(){const t=this.container.clientWidth,e=this.container.clientHeight;this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e),this.labelRenderer.setSize(t,e),this.composer.setSize(t,e),this.bloomPass.setSize(t,e)}_animate(){requestAnimationFrame(()=>this._animate());const t=this.clock.getDelta(),e=this.clock.getElapsedTime();this.controlMode==="thirdPerson"&&this.avatar?(this.avatar.update(t,e),this._updateSpeedIndicator()):this.controls.update();const i=6*t;Object.entries(this.modules3D).forEach(([r,a])=>{const o=a.userData;if(o.baseY!==void 0){const h=Math.sin(e*o.floatSpeed+o.floatOffset)*o.floatAmp;a.position.y=o.baseY+h}(o.moduleType==="case"||o.moduleType==="ifElse")&&(a.rotation.y+=t*.3),a.traverse(h=>{if(h.isMesh&&h.userData.isMainMesh){const u=h.userData.baseEmissive||.3,d=Math.sin(e*1.2+(o.floatOffset||0))*.03;h.material.emissiveIntensity=u+d}h.isMesh&&h.userData.isWireframe&&(h.rotation.y+=t*.15)});const c=this._hoverTargets[r],l=this._hoverCurrent[r];if(c&&l){l.scale+=(c.scale-l.scale)*Math.min(i,1),l.glow+=(c.glow-l.glow)*Math.min(i,1);let h=0,u=0;if(this.avatar&&this.controlMode==="thirdPerson"){const d=a.position.x-this.avatar.position.x,f=a.position.z-this.avatar.position.z,_=Math.sqrt(d*d+f*f);if(_<this._proximityRange){const g=1-_/this._proximityRange;h=g*.15,u=g*.02}}a.scale.setScalar(l.scale+u),(l.glow>.01||h>0)&&a.traverse(d=>{d.isMesh&&d.userData.isMainMesh&&(d.material.emissiveIntensity+=l.glow*.5+h)})}}),this._pulseRings.forEach(r=>{const a=r.userData.pulsePhase,o=(e*.4+a)%(Math.PI*2);r.material.opacity=Math.max(0,Math.sin(o)*.03);const c=1+Math.sin(o)*.08;r.scale.set(c,c,1)});const s=this.avatar?this.avatar.position:null;if(this.cables.forEach(r=>{if(r.userData.update&&r.userData.update(e),s&&r.userData.startPos&&r.userData.endPos){const a=r.userData.startPos,o=r.userData.endPos,c=Math.sqrt((a.x-s.x)**2+(a.z-s.z)**2),l=Math.sqrt((o.x-s.x)**2+(o.z-s.z)**2),h=Math.min(c,l);if(h<this._proximityRange&&r.material){const u=1-h/this._proximityRange;r.material.emissiveIntensity=(r.userData.baseEmissive||.3)+u*.4}else r.material&&(r.material.emissiveIntensity=r.userData.baseEmissive||.3)}}),this.aniCables.forEach(r=>{r.userData.update&&r.userData.update(e)}),this._updateHeatTransition(t),this.particleSystem.update(e,t),this.miniMap){const r=this.avatar?this.avatar.position:this.camera.position;this.miniMap.updatePlayerPosition(r.x,r.z),this.miniMap.render(),this._updateTour(t,e)}this.composer.render(),this.labelRenderer.render(this.scene,this.camera)}toggleHeatMap(t,e,i){this.heatMapActive=t,this._heatTransition.active=!0,this._heatTransition.direction=t?1:-1,e&&this.buildGraph(e,t?i:null),this._showHeatOverlay(t)}_showHeatOverlay(t){let e=document.getElementById("heat-overlay");e||(e=document.createElement("div"),e.id="heat-overlay",e.className="heat-overlay",document.getElementById("app").appendChild(e));const i=t?"HEAT MAP: ACTIVE":"HEAT MAP: DISABLED",s=t?"var(--accent-green)":"var(--text-muted)";e.innerHTML=`
      <div class="heat-overlay-inner" style="border-color: ${s};">
        <div class="heat-overlay-icon" style="color: ${s};">${t?"🔥":"❄️"}</div>
        <div class="heat-overlay-text" style="color: ${s};">${i}</div>
        <div class="heat-overlay-bar" style="background: ${s};"></div>
      </div>
    `,e.classList.remove("active"),e.offsetWidth,e.classList.add("active"),setTimeout(()=>{e.classList.remove("active")},1800)}_updateHeatTransition(t){if(this._heatTransition.active)if(this._heatTransition.progress+=t/this._heatTransition.duration,this._heatTransition.progress>=1)this._heatTransition.active=!1,this._heatTransition.progress=0,this.heatMapActive?this.bloomPass.strength=.6:this.bloomPass.strength=.4;else{const e=this._heatTransition.progress,i=Math.sin(e*Math.PI);this.bloomPass.strength=.5+i*.4}}toggleLabels(t){this.labelsVisible=t,this.labelRenderer.domElement.style.display=t?"block":"none"}resetCamera(){this._flyToOverview()}screenshot(){return this.composer.render(),this.renderer.domElement.toDataURL("image/png")}toggleANIExpansion(t,e,i){this.aniExpansionEnabled=t,this._clearANIExpansion(),t&&e&&this._buildANIExpansion(e,i)}_clearANIExpansion(){this.aniNodes.forEach(t=>{t.traverse(e=>{e.isCSS2DObject&&e.element&&e.element.parentNode&&e.element.parentNode.removeChild(e.element),e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(i=>i.dispose()):e.material.dispose())}),t.parent?t.parent.remove(t):this.scene.remove(t)}),this.aniCables.forEach(t=>{t.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),t.parent?t.parent.remove(t):this.scene.remove(t)}),this.aniNodes=[],this.aniCables=[]}_buildANIExpansion(t,e){const{modules:i}=t;i.forEach(s=>{if(s.moduleType!=="case")return;const a=(s.data.branches||[]).filter(f=>f.name!=="No Match");if(a.length<2)return;const o=this.modules3D[s.moduleId];if(!o)return;const c=o.position,l=a.length,h=30+l*1.5,u=Math.PI*2/l,d={};a.forEach(f=>{const _=f.descendantId||"unknown";d[_]||(d[_]=[]),d[_].push(f)}),a.forEach((f,_)=>{const g=u*_-Math.PI/2,m=c.x+Math.cos(g)*h,p=c.z+Math.sin(g)*h,b=c.y-8,y=new Re,v=f.descendantId?this.modules3D[f.descendantId]:null,C=v!=null;let T=16727386,w=16716083;if(C){const K=this.moduleData[f.descendantId];K&&K.moduleType==="hangup"?(T=16727386,w=16716083):(T=16766784,w=13412864)}const P=new Jn(1.2,16,16),M=new ve({color:T,emissive:w,emissiveIntensity:.5,metalness:.6,roughness:.3}),x=new ht(P,M);x.userData.isMainMesh=!0,x.userData.baseEmissive=.5,y.add(x);const D=new qn(1.5,1.8,16),F=new we({color:T,transparent:!0,opacity:.2,side:xe}),O=new ht(D,F);O.rotation.x=Math.PI/2,y.add(O),y.position.set(m,b,p),y.userData={moduleId:`ani_${s.moduleId}_${_}`,moduleType:"aniNode",aniName:f.name},this.scene.add(y),this.aniNodes.push(y);const H=document.createElement("div");H.className="module-label hangup-label",H.textContent=f.name,H.style.fontSize="9px";const X=new uh(H);X.position.set(0,3,0),y.add(X);const W=this.cableRenderer.create(c,y.position,{type:"branch",volume:.05,isFriction:!0,isSuccess:!1});if(this.scene.add(W),this.aniCables.push(W),v){const K=this.cableRenderer.create(y.position,v.position,{type:v.userData.moduleType==="hangup"?"exceptional":"branch",volume:.08,isFriction:v.userData.moduleType==="hangup",isSuccess:v.userData.moduleType!=="hangup"});this.scene.add(K),this.aniCables.push(K)}})})}}/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */const Xv=4,gh=0,vh=1,Yv=2;function xs(n){let t=n.length;for(;--t>=0;)n[t]=0}const qv=0,qu=1,Zv=2,$v=3,Kv=258,Nl=29,sr=256,qs=sr+1+Nl,as=30,Fl=19,Zu=2*qs+1,xi=15,ro=16,jv=7,Ol=256,$u=16,Ku=17,ju=18,hl=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),Qr=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),Jv=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),Ju=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Qv=512,Rn=new Array((qs+2)*2);xs(Rn);const ks=new Array(as*2);xs(ks);const Zs=new Array(Qv);xs(Zs);const $s=new Array(Kv-$v+1);xs($s);const zl=new Array(Nl);xs(zl);const ca=new Array(as);xs(ca);function ao(n,t,e,i,s){this.static_tree=n,this.extra_bits=t,this.extra_base=e,this.elems=i,this.max_length=s,this.has_stree=n&&n.length}let Qu,td,ed;function oo(n,t){this.dyn_tree=n,this.max_code=0,this.stat_desc=t}const nd=n=>n<256?Zs[n]:Zs[256+(n>>>7)],Ks=(n,t)=>{n.pending_buf[n.pending++]=t&255,n.pending_buf[n.pending++]=t>>>8&255},He=(n,t,e)=>{n.bi_valid>ro-e?(n.bi_buf|=t<<n.bi_valid&65535,Ks(n,n.bi_buf),n.bi_buf=t>>ro-n.bi_valid,n.bi_valid+=e-ro):(n.bi_buf|=t<<n.bi_valid&65535,n.bi_valid+=e)},_n=(n,t,e)=>{He(n,e[t*2],e[t*2+1])},id=(n,t)=>{let e=0;do e|=n&1,n>>>=1,e<<=1;while(--t>0);return e>>>1},tx=n=>{n.bi_valid===16?(Ks(n,n.bi_buf),n.bi_buf=0,n.bi_valid=0):n.bi_valid>=8&&(n.pending_buf[n.pending++]=n.bi_buf&255,n.bi_buf>>=8,n.bi_valid-=8)},ex=(n,t)=>{const e=t.dyn_tree,i=t.max_code,s=t.stat_desc.static_tree,r=t.stat_desc.has_stree,a=t.stat_desc.extra_bits,o=t.stat_desc.extra_base,c=t.stat_desc.max_length;let l,h,u,d,f,_,g=0;for(d=0;d<=xi;d++)n.bl_count[d]=0;for(e[n.heap[n.heap_max]*2+1]=0,l=n.heap_max+1;l<Zu;l++)h=n.heap[l],d=e[e[h*2+1]*2+1]+1,d>c&&(d=c,g++),e[h*2+1]=d,!(h>i)&&(n.bl_count[d]++,f=0,h>=o&&(f=a[h-o]),_=e[h*2],n.opt_len+=_*(d+f),r&&(n.static_len+=_*(s[h*2+1]+f)));if(g!==0){do{for(d=c-1;n.bl_count[d]===0;)d--;n.bl_count[d]--,n.bl_count[d+1]+=2,n.bl_count[c]--,g-=2}while(g>0);for(d=c;d!==0;d--)for(h=n.bl_count[d];h!==0;)u=n.heap[--l],!(u>i)&&(e[u*2+1]!==d&&(n.opt_len+=(d-e[u*2+1])*e[u*2],e[u*2+1]=d),h--)}},sd=(n,t,e)=>{const i=new Array(xi+1);let s=0,r,a;for(r=1;r<=xi;r++)s=s+e[r-1]<<1,i[r]=s;for(a=0;a<=t;a++){let o=n[a*2+1];o!==0&&(n[a*2]=id(i[o]++,o))}},nx=()=>{let n,t,e,i,s;const r=new Array(xi+1);for(e=0,i=0;i<Nl-1;i++)for(zl[i]=e,n=0;n<1<<hl[i];n++)$s[e++]=i;for($s[e-1]=i,s=0,i=0;i<16;i++)for(ca[i]=s,n=0;n<1<<Qr[i];n++)Zs[s++]=i;for(s>>=7;i<as;i++)for(ca[i]=s<<7,n=0;n<1<<Qr[i]-7;n++)Zs[256+s++]=i;for(t=0;t<=xi;t++)r[t]=0;for(n=0;n<=143;)Rn[n*2+1]=8,n++,r[8]++;for(;n<=255;)Rn[n*2+1]=9,n++,r[9]++;for(;n<=279;)Rn[n*2+1]=7,n++,r[7]++;for(;n<=287;)Rn[n*2+1]=8,n++,r[8]++;for(sd(Rn,qs+1,r),n=0;n<as;n++)ks[n*2+1]=5,ks[n*2]=id(n,5);Qu=new ao(Rn,hl,sr+1,qs,xi),td=new ao(ks,Qr,0,as,xi),ed=new ao(new Array(0),Jv,0,Fl,jv)},rd=n=>{let t;for(t=0;t<qs;t++)n.dyn_ltree[t*2]=0;for(t=0;t<as;t++)n.dyn_dtree[t*2]=0;for(t=0;t<Fl;t++)n.bl_tree[t*2]=0;n.dyn_ltree[Ol*2]=1,n.opt_len=n.static_len=0,n.sym_next=n.matches=0},ad=n=>{n.bi_valid>8?Ks(n,n.bi_buf):n.bi_valid>0&&(n.pending_buf[n.pending++]=n.bi_buf),n.bi_buf=0,n.bi_valid=0},xh=(n,t,e,i)=>{const s=t*2,r=e*2;return n[s]<n[r]||n[s]===n[r]&&i[t]<=i[e]},lo=(n,t,e)=>{const i=n.heap[e];let s=e<<1;for(;s<=n.heap_len&&(s<n.heap_len&&xh(t,n.heap[s+1],n.heap[s],n.depth)&&s++,!xh(t,i,n.heap[s],n.depth));)n.heap[e]=n.heap[s],e=s,s<<=1;n.heap[e]=i},yh=(n,t,e)=>{let i,s,r=0,a,o;if(n.sym_next!==0)do i=n.pending_buf[n.sym_buf+r++]&255,i+=(n.pending_buf[n.sym_buf+r++]&255)<<8,s=n.pending_buf[n.sym_buf+r++],i===0?_n(n,s,t):(a=$s[s],_n(n,a+sr+1,t),o=hl[a],o!==0&&(s-=zl[a],He(n,s,o)),i--,a=nd(i),_n(n,a,e),o=Qr[a],o!==0&&(i-=ca[a],He(n,i,o)));while(r<n.sym_next);_n(n,Ol,t)},ul=(n,t)=>{const e=t.dyn_tree,i=t.stat_desc.static_tree,s=t.stat_desc.has_stree,r=t.stat_desc.elems;let a,o,c=-1,l;for(n.heap_len=0,n.heap_max=Zu,a=0;a<r;a++)e[a*2]!==0?(n.heap[++n.heap_len]=c=a,n.depth[a]=0):e[a*2+1]=0;for(;n.heap_len<2;)l=n.heap[++n.heap_len]=c<2?++c:0,e[l*2]=1,n.depth[l]=0,n.opt_len--,s&&(n.static_len-=i[l*2+1]);for(t.max_code=c,a=n.heap_len>>1;a>=1;a--)lo(n,e,a);l=r;do a=n.heap[1],n.heap[1]=n.heap[n.heap_len--],lo(n,e,1),o=n.heap[1],n.heap[--n.heap_max]=a,n.heap[--n.heap_max]=o,e[l*2]=e[a*2]+e[o*2],n.depth[l]=(n.depth[a]>=n.depth[o]?n.depth[a]:n.depth[o])+1,e[a*2+1]=e[o*2+1]=l,n.heap[1]=l++,lo(n,e,1);while(n.heap_len>=2);n.heap[--n.heap_max]=n.heap[1],ex(n,t),sd(e,c,n.bl_count)},Mh=(n,t,e)=>{let i,s=-1,r,a=t[1],o=0,c=7,l=4;for(a===0&&(c=138,l=3),t[(e+1)*2+1]=65535,i=0;i<=e;i++)r=a,a=t[(i+1)*2+1],!(++o<c&&r===a)&&(o<l?n.bl_tree[r*2]+=o:r!==0?(r!==s&&n.bl_tree[r*2]++,n.bl_tree[$u*2]++):o<=10?n.bl_tree[Ku*2]++:n.bl_tree[ju*2]++,o=0,s=r,a===0?(c=138,l=3):r===a?(c=6,l=3):(c=7,l=4))},Sh=(n,t,e)=>{let i,s=-1,r,a=t[1],o=0,c=7,l=4;for(a===0&&(c=138,l=3),i=0;i<=e;i++)if(r=a,a=t[(i+1)*2+1],!(++o<c&&r===a)){if(o<l)do _n(n,r,n.bl_tree);while(--o!==0);else r!==0?(r!==s&&(_n(n,r,n.bl_tree),o--),_n(n,$u,n.bl_tree),He(n,o-3,2)):o<=10?(_n(n,Ku,n.bl_tree),He(n,o-3,3)):(_n(n,ju,n.bl_tree),He(n,o-11,7));o=0,s=r,a===0?(c=138,l=3):r===a?(c=6,l=3):(c=7,l=4)}},ix=n=>{let t;for(Mh(n,n.dyn_ltree,n.l_desc.max_code),Mh(n,n.dyn_dtree,n.d_desc.max_code),ul(n,n.bl_desc),t=Fl-1;t>=3&&n.bl_tree[Ju[t]*2+1]===0;t--);return n.opt_len+=3*(t+1)+5+5+4,t},sx=(n,t,e,i)=>{let s;for(He(n,t-257,5),He(n,e-1,5),He(n,i-4,4),s=0;s<i;s++)He(n,n.bl_tree[Ju[s]*2+1],3);Sh(n,n.dyn_ltree,t-1),Sh(n,n.dyn_dtree,e-1)},rx=n=>{let t=4093624447,e;for(e=0;e<=31;e++,t>>>=1)if(t&1&&n.dyn_ltree[e*2]!==0)return gh;if(n.dyn_ltree[18]!==0||n.dyn_ltree[20]!==0||n.dyn_ltree[26]!==0)return vh;for(e=32;e<sr;e++)if(n.dyn_ltree[e*2]!==0)return vh;return gh};let bh=!1;const ax=n=>{bh||(nx(),bh=!0),n.l_desc=new oo(n.dyn_ltree,Qu),n.d_desc=new oo(n.dyn_dtree,td),n.bl_desc=new oo(n.bl_tree,ed),n.bi_buf=0,n.bi_valid=0,rd(n)},od=(n,t,e,i)=>{He(n,(qv<<1)+(i?1:0),3),ad(n),Ks(n,e),Ks(n,~e),e&&n.pending_buf.set(n.window.subarray(t,t+e),n.pending),n.pending+=e},ox=n=>{He(n,qu<<1,3),_n(n,Ol,Rn),tx(n)},lx=(n,t,e,i)=>{let s,r,a=0;n.level>0?(n.strm.data_type===Yv&&(n.strm.data_type=rx(n)),ul(n,n.l_desc),ul(n,n.d_desc),a=ix(n),s=n.opt_len+3+7>>>3,r=n.static_len+3+7>>>3,r<=s&&(s=r)):s=r=e+5,e+4<=s&&t!==-1?od(n,t,e,i):n.strategy===Xv||r===s?(He(n,(qu<<1)+(i?1:0),3),yh(n,Rn,ks)):(He(n,(Zv<<1)+(i?1:0),3),sx(n,n.l_desc.max_code+1,n.d_desc.max_code+1,a+1),yh(n,n.dyn_ltree,n.dyn_dtree)),rd(n),i&&ad(n)},cx=(n,t,e)=>(n.pending_buf[n.sym_buf+n.sym_next++]=t,n.pending_buf[n.sym_buf+n.sym_next++]=t>>8,n.pending_buf[n.sym_buf+n.sym_next++]=e,t===0?n.dyn_ltree[e*2]++:(n.matches++,t--,n.dyn_ltree[($s[e]+sr+1)*2]++,n.dyn_dtree[nd(t)*2]++),n.sym_next===n.sym_end);var hx=ax,ux=od,dx=lx,fx=cx,px=ox,mx={_tr_init:hx,_tr_stored_block:ux,_tr_flush_block:dx,_tr_tally:fx,_tr_align:px};const _x=(n,t,e,i)=>{let s=n&65535|0,r=n>>>16&65535|0,a=0;for(;e!==0;){a=e>2e3?2e3:e,e-=a;do s=s+t[i++]|0,r=r+s|0;while(--a);s%=65521,r%=65521}return s|r<<16|0};var js=_x;const gx=()=>{let n,t=[];for(var e=0;e<256;e++){n=e;for(var i=0;i<8;i++)n=n&1?3988292384^n>>>1:n>>>1;t[e]=n}return t},vx=new Uint32Array(gx()),xx=(n,t,e,i)=>{const s=vx,r=i+e;n^=-1;for(let a=i;a<r;a++)n=n>>>8^s[(n^t[a])&255];return n^-1};var be=xx,Ti={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"},rr={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};const{_tr_init:yx,_tr_stored_block:dl,_tr_flush_block:Mx,_tr_tally:Qn,_tr_align:Sx}=mx,{Z_NO_FLUSH:ti,Z_PARTIAL_FLUSH:bx,Z_FULL_FLUSH:Ex,Z_FINISH:en,Z_BLOCK:Eh,Z_OK:Ce,Z_STREAM_END:wh,Z_STREAM_ERROR:vn,Z_DATA_ERROR:wx,Z_BUF_ERROR:co,Z_DEFAULT_COMPRESSION:Tx,Z_FILTERED:Ax,Z_HUFFMAN_ONLY:Hr,Z_RLE:Cx,Z_FIXED:Rx,Z_DEFAULT_STRATEGY:Px,Z_UNKNOWN:Dx,Z_DEFLATED:ga}=rr,Lx=9,Ix=15,Ux=8,Nx=29,Fx=256,fl=Fx+1+Nx,Ox=30,zx=19,Bx=2*fl+1,kx=15,Bt=3,$n=258,xn=$n+Bt+1,Hx=32,ms=42,Bl=57,pl=69,ml=73,_l=91,gl=103,yi=113,Ns=666,Oe=1,ys=2,Ai=3,Ms=4,Gx=3,Mi=(n,t)=>(n.msg=Ti[t],t),Th=n=>n*2-(n>4?9:0),Zn=n=>{let t=n.length;for(;--t>=0;)n[t]=0},Vx=n=>{let t,e,i,s=n.w_size;t=n.hash_size,i=t;do e=n.head[--i],n.head[i]=e>=s?e-s:0;while(--t);t=s,i=t;do e=n.prev[--i],n.prev[i]=e>=s?e-s:0;while(--t)};let Wx=(n,t,e)=>(t<<n.hash_shift^e)&n.hash_mask,ei=Wx;const Ye=n=>{const t=n.state;let e=t.pending;e>n.avail_out&&(e=n.avail_out),e!==0&&(n.output.set(t.pending_buf.subarray(t.pending_out,t.pending_out+e),n.next_out),n.next_out+=e,t.pending_out+=e,n.total_out+=e,n.avail_out-=e,t.pending-=e,t.pending===0&&(t.pending_out=0))},Ze=(n,t)=>{Mx(n,n.block_start>=0?n.block_start:-1,n.strstart-n.block_start,t),n.block_start=n.strstart,Ye(n.strm)},$t=(n,t)=>{n.pending_buf[n.pending++]=t},Is=(n,t)=>{n.pending_buf[n.pending++]=t>>>8&255,n.pending_buf[n.pending++]=t&255},vl=(n,t,e,i)=>{let s=n.avail_in;return s>i&&(s=i),s===0?0:(n.avail_in-=s,t.set(n.input.subarray(n.next_in,n.next_in+s),e),n.state.wrap===1?n.adler=js(n.adler,t,s,e):n.state.wrap===2&&(n.adler=be(n.adler,t,s,e)),n.next_in+=s,n.total_in+=s,s)},ld=(n,t)=>{let e=n.max_chain_length,i=n.strstart,s,r,a=n.prev_length,o=n.nice_match;const c=n.strstart>n.w_size-xn?n.strstart-(n.w_size-xn):0,l=n.window,h=n.w_mask,u=n.prev,d=n.strstart+$n;let f=l[i+a-1],_=l[i+a];n.prev_length>=n.good_match&&(e>>=2),o>n.lookahead&&(o=n.lookahead);do if(s=t,!(l[s+a]!==_||l[s+a-1]!==f||l[s]!==l[i]||l[++s]!==l[i+1])){i+=2,s++;do;while(l[++i]===l[++s]&&l[++i]===l[++s]&&l[++i]===l[++s]&&l[++i]===l[++s]&&l[++i]===l[++s]&&l[++i]===l[++s]&&l[++i]===l[++s]&&l[++i]===l[++s]&&i<d);if(r=$n-(d-i),i=d-$n,r>a){if(n.match_start=t,a=r,r>=o)break;f=l[i+a-1],_=l[i+a]}}while((t=u[t&h])>c&&--e!==0);return a<=n.lookahead?a:n.lookahead},_s=n=>{const t=n.w_size;let e,i,s;do{if(i=n.window_size-n.lookahead-n.strstart,n.strstart>=t+(t-xn)&&(n.window.set(n.window.subarray(t,t+t-i),0),n.match_start-=t,n.strstart-=t,n.block_start-=t,n.insert>n.strstart&&(n.insert=n.strstart),Vx(n),i+=t),n.strm.avail_in===0)break;if(e=vl(n.strm,n.window,n.strstart+n.lookahead,i),n.lookahead+=e,n.lookahead+n.insert>=Bt)for(s=n.strstart-n.insert,n.ins_h=n.window[s],n.ins_h=ei(n,n.ins_h,n.window[s+1]);n.insert&&(n.ins_h=ei(n,n.ins_h,n.window[s+Bt-1]),n.prev[s&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=s,s++,n.insert--,!(n.lookahead+n.insert<Bt)););}while(n.lookahead<xn&&n.strm.avail_in!==0)},cd=(n,t)=>{let e=n.pending_buf_size-5>n.w_size?n.w_size:n.pending_buf_size-5,i,s,r,a=0,o=n.strm.avail_in;do{if(i=65535,r=n.bi_valid+42>>3,n.strm.avail_out<r||(r=n.strm.avail_out-r,s=n.strstart-n.block_start,i>s+n.strm.avail_in&&(i=s+n.strm.avail_in),i>r&&(i=r),i<e&&(i===0&&t!==en||t===ti||i!==s+n.strm.avail_in)))break;a=t===en&&i===s+n.strm.avail_in?1:0,dl(n,0,0,a),n.pending_buf[n.pending-4]=i,n.pending_buf[n.pending-3]=i>>8,n.pending_buf[n.pending-2]=~i,n.pending_buf[n.pending-1]=~i>>8,Ye(n.strm),s&&(s>i&&(s=i),n.strm.output.set(n.window.subarray(n.block_start,n.block_start+s),n.strm.next_out),n.strm.next_out+=s,n.strm.avail_out-=s,n.strm.total_out+=s,n.block_start+=s,i-=s),i&&(vl(n.strm,n.strm.output,n.strm.next_out,i),n.strm.next_out+=i,n.strm.avail_out-=i,n.strm.total_out+=i)}while(a===0);return o-=n.strm.avail_in,o&&(o>=n.w_size?(n.matches=2,n.window.set(n.strm.input.subarray(n.strm.next_in-n.w_size,n.strm.next_in),0),n.strstart=n.w_size,n.insert=n.strstart):(n.window_size-n.strstart<=o&&(n.strstart-=n.w_size,n.window.set(n.window.subarray(n.w_size,n.w_size+n.strstart),0),n.matches<2&&n.matches++,n.insert>n.strstart&&(n.insert=n.strstart)),n.window.set(n.strm.input.subarray(n.strm.next_in-o,n.strm.next_in),n.strstart),n.strstart+=o,n.insert+=o>n.w_size-n.insert?n.w_size-n.insert:o),n.block_start=n.strstart),n.high_water<n.strstart&&(n.high_water=n.strstart),a?Ms:t!==ti&&t!==en&&n.strm.avail_in===0&&n.strstart===n.block_start?ys:(r=n.window_size-n.strstart,n.strm.avail_in>r&&n.block_start>=n.w_size&&(n.block_start-=n.w_size,n.strstart-=n.w_size,n.window.set(n.window.subarray(n.w_size,n.w_size+n.strstart),0),n.matches<2&&n.matches++,r+=n.w_size,n.insert>n.strstart&&(n.insert=n.strstart)),r>n.strm.avail_in&&(r=n.strm.avail_in),r&&(vl(n.strm,n.window,n.strstart,r),n.strstart+=r,n.insert+=r>n.w_size-n.insert?n.w_size-n.insert:r),n.high_water<n.strstart&&(n.high_water=n.strstart),r=n.bi_valid+42>>3,r=n.pending_buf_size-r>65535?65535:n.pending_buf_size-r,e=r>n.w_size?n.w_size:r,s=n.strstart-n.block_start,(s>=e||(s||t===en)&&t!==ti&&n.strm.avail_in===0&&s<=r)&&(i=s>r?r:s,a=t===en&&n.strm.avail_in===0&&i===s?1:0,dl(n,n.block_start,i,a),n.block_start+=i,Ye(n.strm)),a?Ai:Oe)},ho=(n,t)=>{let e,i;for(;;){if(n.lookahead<xn){if(_s(n),n.lookahead<xn&&t===ti)return Oe;if(n.lookahead===0)break}if(e=0,n.lookahead>=Bt&&(n.ins_h=ei(n,n.ins_h,n.window[n.strstart+Bt-1]),e=n.prev[n.strstart&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=n.strstart),e!==0&&n.strstart-e<=n.w_size-xn&&(n.match_length=ld(n,e)),n.match_length>=Bt)if(i=Qn(n,n.strstart-n.match_start,n.match_length-Bt),n.lookahead-=n.match_length,n.match_length<=n.max_lazy_match&&n.lookahead>=Bt){n.match_length--;do n.strstart++,n.ins_h=ei(n,n.ins_h,n.window[n.strstart+Bt-1]),e=n.prev[n.strstart&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=n.strstart;while(--n.match_length!==0);n.strstart++}else n.strstart+=n.match_length,n.match_length=0,n.ins_h=n.window[n.strstart],n.ins_h=ei(n,n.ins_h,n.window[n.strstart+1]);else i=Qn(n,0,n.window[n.strstart]),n.lookahead--,n.strstart++;if(i&&(Ze(n,!1),n.strm.avail_out===0))return Oe}return n.insert=n.strstart<Bt-1?n.strstart:Bt-1,t===en?(Ze(n,!0),n.strm.avail_out===0?Ai:Ms):n.sym_next&&(Ze(n,!1),n.strm.avail_out===0)?Oe:ys},ji=(n,t)=>{let e,i,s;for(;;){if(n.lookahead<xn){if(_s(n),n.lookahead<xn&&t===ti)return Oe;if(n.lookahead===0)break}if(e=0,n.lookahead>=Bt&&(n.ins_h=ei(n,n.ins_h,n.window[n.strstart+Bt-1]),e=n.prev[n.strstart&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=n.strstart),n.prev_length=n.match_length,n.prev_match=n.match_start,n.match_length=Bt-1,e!==0&&n.prev_length<n.max_lazy_match&&n.strstart-e<=n.w_size-xn&&(n.match_length=ld(n,e),n.match_length<=5&&(n.strategy===Ax||n.match_length===Bt&&n.strstart-n.match_start>4096)&&(n.match_length=Bt-1)),n.prev_length>=Bt&&n.match_length<=n.prev_length){s=n.strstart+n.lookahead-Bt,i=Qn(n,n.strstart-1-n.prev_match,n.prev_length-Bt),n.lookahead-=n.prev_length-1,n.prev_length-=2;do++n.strstart<=s&&(n.ins_h=ei(n,n.ins_h,n.window[n.strstart+Bt-1]),e=n.prev[n.strstart&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=n.strstart);while(--n.prev_length!==0);if(n.match_available=0,n.match_length=Bt-1,n.strstart++,i&&(Ze(n,!1),n.strm.avail_out===0))return Oe}else if(n.match_available){if(i=Qn(n,0,n.window[n.strstart-1]),i&&Ze(n,!1),n.strstart++,n.lookahead--,n.strm.avail_out===0)return Oe}else n.match_available=1,n.strstart++,n.lookahead--}return n.match_available&&(i=Qn(n,0,n.window[n.strstart-1]),n.match_available=0),n.insert=n.strstart<Bt-1?n.strstart:Bt-1,t===en?(Ze(n,!0),n.strm.avail_out===0?Ai:Ms):n.sym_next&&(Ze(n,!1),n.strm.avail_out===0)?Oe:ys},Xx=(n,t)=>{let e,i,s,r;const a=n.window;for(;;){if(n.lookahead<=$n){if(_s(n),n.lookahead<=$n&&t===ti)return Oe;if(n.lookahead===0)break}if(n.match_length=0,n.lookahead>=Bt&&n.strstart>0&&(s=n.strstart-1,i=a[s],i===a[++s]&&i===a[++s]&&i===a[++s])){r=n.strstart+$n;do;while(i===a[++s]&&i===a[++s]&&i===a[++s]&&i===a[++s]&&i===a[++s]&&i===a[++s]&&i===a[++s]&&i===a[++s]&&s<r);n.match_length=$n-(r-s),n.match_length>n.lookahead&&(n.match_length=n.lookahead)}if(n.match_length>=Bt?(e=Qn(n,1,n.match_length-Bt),n.lookahead-=n.match_length,n.strstart+=n.match_length,n.match_length=0):(e=Qn(n,0,n.window[n.strstart]),n.lookahead--,n.strstart++),e&&(Ze(n,!1),n.strm.avail_out===0))return Oe}return n.insert=0,t===en?(Ze(n,!0),n.strm.avail_out===0?Ai:Ms):n.sym_next&&(Ze(n,!1),n.strm.avail_out===0)?Oe:ys},Yx=(n,t)=>{let e;for(;;){if(n.lookahead===0&&(_s(n),n.lookahead===0)){if(t===ti)return Oe;break}if(n.match_length=0,e=Qn(n,0,n.window[n.strstart]),n.lookahead--,n.strstart++,e&&(Ze(n,!1),n.strm.avail_out===0))return Oe}return n.insert=0,t===en?(Ze(n,!0),n.strm.avail_out===0?Ai:Ms):n.sym_next&&(Ze(n,!1),n.strm.avail_out===0)?Oe:ys};function fn(n,t,e,i,s){this.good_length=n,this.max_lazy=t,this.nice_length=e,this.max_chain=i,this.func=s}const Fs=[new fn(0,0,0,0,cd),new fn(4,4,8,4,ho),new fn(4,5,16,8,ho),new fn(4,6,32,32,ho),new fn(4,4,16,16,ji),new fn(8,16,32,32,ji),new fn(8,16,128,128,ji),new fn(8,32,128,256,ji),new fn(32,128,258,1024,ji),new fn(32,258,258,4096,ji)],qx=n=>{n.window_size=2*n.w_size,Zn(n.head),n.max_lazy_match=Fs[n.level].max_lazy,n.good_match=Fs[n.level].good_length,n.nice_match=Fs[n.level].nice_length,n.max_chain_length=Fs[n.level].max_chain,n.strstart=0,n.block_start=0,n.lookahead=0,n.insert=0,n.match_length=n.prev_length=Bt-1,n.match_available=0,n.ins_h=0};function Zx(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=ga,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Uint16Array(Bx*2),this.dyn_dtree=new Uint16Array((2*Ox+1)*2),this.bl_tree=new Uint16Array((2*zx+1)*2),Zn(this.dyn_ltree),Zn(this.dyn_dtree),Zn(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Uint16Array(kx+1),this.heap=new Uint16Array(2*fl+1),Zn(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Uint16Array(2*fl+1),Zn(this.depth),this.sym_buf=0,this.lit_bufsize=0,this.sym_next=0,this.sym_end=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}const ar=n=>{if(!n)return 1;const t=n.state;return!t||t.strm!==n||t.status!==ms&&t.status!==Bl&&t.status!==pl&&t.status!==ml&&t.status!==_l&&t.status!==gl&&t.status!==yi&&t.status!==Ns?1:0},hd=n=>{if(ar(n))return Mi(n,vn);n.total_in=n.total_out=0,n.data_type=Dx;const t=n.state;return t.pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap===2?Bl:t.wrap?ms:yi,n.adler=t.wrap===2?0:1,t.last_flush=-2,yx(t),Ce},ud=n=>{const t=hd(n);return t===Ce&&qx(n.state),t},$x=(n,t)=>ar(n)||n.state.wrap!==2?vn:(n.state.gzhead=t,Ce),dd=(n,t,e,i,s,r)=>{if(!n)return vn;let a=1;if(t===Tx&&(t=6),i<0?(a=0,i=-i):i>15&&(a=2,i-=16),s<1||s>Lx||e!==ga||i<8||i>15||t<0||t>9||r<0||r>Rx||i===8&&a!==1)return Mi(n,vn);i===8&&(i=9);const o=new Zx;return n.state=o,o.strm=n,o.status=ms,o.wrap=a,o.gzhead=null,o.w_bits=i,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=s+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+Bt-1)/Bt),o.window=new Uint8Array(o.w_size*2),o.head=new Uint16Array(o.hash_size),o.prev=new Uint16Array(o.w_size),o.lit_bufsize=1<<s+6,o.pending_buf_size=o.lit_bufsize*4,o.pending_buf=new Uint8Array(o.pending_buf_size),o.sym_buf=o.lit_bufsize,o.sym_end=(o.lit_bufsize-1)*3,o.level=t,o.strategy=r,o.method=e,ud(n)},Kx=(n,t)=>dd(n,t,ga,Ix,Ux,Px),jx=(n,t)=>{if(ar(n)||t>Eh||t<0)return n?Mi(n,vn):vn;const e=n.state;if(!n.output||n.avail_in!==0&&!n.input||e.status===Ns&&t!==en)return Mi(n,n.avail_out===0?co:vn);const i=e.last_flush;if(e.last_flush=t,e.pending!==0){if(Ye(n),n.avail_out===0)return e.last_flush=-1,Ce}else if(n.avail_in===0&&Th(t)<=Th(i)&&t!==en)return Mi(n,co);if(e.status===Ns&&n.avail_in!==0)return Mi(n,co);if(e.status===ms&&e.wrap===0&&(e.status=yi),e.status===ms){let s=ga+(e.w_bits-8<<4)<<8,r=-1;if(e.strategy>=Hr||e.level<2?r=0:e.level<6?r=1:e.level===6?r=2:r=3,s|=r<<6,e.strstart!==0&&(s|=Hx),s+=31-s%31,Is(e,s),e.strstart!==0&&(Is(e,n.adler>>>16),Is(e,n.adler&65535)),n.adler=1,e.status=yi,Ye(n),e.pending!==0)return e.last_flush=-1,Ce}if(e.status===Bl){if(n.adler=0,$t(e,31),$t(e,139),$t(e,8),e.gzhead)$t(e,(e.gzhead.text?1:0)+(e.gzhead.hcrc?2:0)+(e.gzhead.extra?4:0)+(e.gzhead.name?8:0)+(e.gzhead.comment?16:0)),$t(e,e.gzhead.time&255),$t(e,e.gzhead.time>>8&255),$t(e,e.gzhead.time>>16&255),$t(e,e.gzhead.time>>24&255),$t(e,e.level===9?2:e.strategy>=Hr||e.level<2?4:0),$t(e,e.gzhead.os&255),e.gzhead.extra&&e.gzhead.extra.length&&($t(e,e.gzhead.extra.length&255),$t(e,e.gzhead.extra.length>>8&255)),e.gzhead.hcrc&&(n.adler=be(n.adler,e.pending_buf,e.pending,0)),e.gzindex=0,e.status=pl;else if($t(e,0),$t(e,0),$t(e,0),$t(e,0),$t(e,0),$t(e,e.level===9?2:e.strategy>=Hr||e.level<2?4:0),$t(e,Gx),e.status=yi,Ye(n),e.pending!==0)return e.last_flush=-1,Ce}if(e.status===pl){if(e.gzhead.extra){let s=e.pending,r=(e.gzhead.extra.length&65535)-e.gzindex;for(;e.pending+r>e.pending_buf_size;){let o=e.pending_buf_size-e.pending;if(e.pending_buf.set(e.gzhead.extra.subarray(e.gzindex,e.gzindex+o),e.pending),e.pending=e.pending_buf_size,e.gzhead.hcrc&&e.pending>s&&(n.adler=be(n.adler,e.pending_buf,e.pending-s,s)),e.gzindex+=o,Ye(n),e.pending!==0)return e.last_flush=-1,Ce;s=0,r-=o}let a=new Uint8Array(e.gzhead.extra);e.pending_buf.set(a.subarray(e.gzindex,e.gzindex+r),e.pending),e.pending+=r,e.gzhead.hcrc&&e.pending>s&&(n.adler=be(n.adler,e.pending_buf,e.pending-s,s)),e.gzindex=0}e.status=ml}if(e.status===ml){if(e.gzhead.name){let s=e.pending,r;do{if(e.pending===e.pending_buf_size){if(e.gzhead.hcrc&&e.pending>s&&(n.adler=be(n.adler,e.pending_buf,e.pending-s,s)),Ye(n),e.pending!==0)return e.last_flush=-1,Ce;s=0}e.gzindex<e.gzhead.name.length?r=e.gzhead.name.charCodeAt(e.gzindex++)&255:r=0,$t(e,r)}while(r!==0);e.gzhead.hcrc&&e.pending>s&&(n.adler=be(n.adler,e.pending_buf,e.pending-s,s)),e.gzindex=0}e.status=_l}if(e.status===_l){if(e.gzhead.comment){let s=e.pending,r;do{if(e.pending===e.pending_buf_size){if(e.gzhead.hcrc&&e.pending>s&&(n.adler=be(n.adler,e.pending_buf,e.pending-s,s)),Ye(n),e.pending!==0)return e.last_flush=-1,Ce;s=0}e.gzindex<e.gzhead.comment.length?r=e.gzhead.comment.charCodeAt(e.gzindex++)&255:r=0,$t(e,r)}while(r!==0);e.gzhead.hcrc&&e.pending>s&&(n.adler=be(n.adler,e.pending_buf,e.pending-s,s))}e.status=gl}if(e.status===gl){if(e.gzhead.hcrc){if(e.pending+2>e.pending_buf_size&&(Ye(n),e.pending!==0))return e.last_flush=-1,Ce;$t(e,n.adler&255),$t(e,n.adler>>8&255),n.adler=0}if(e.status=yi,Ye(n),e.pending!==0)return e.last_flush=-1,Ce}if(n.avail_in!==0||e.lookahead!==0||t!==ti&&e.status!==Ns){let s=e.level===0?cd(e,t):e.strategy===Hr?Yx(e,t):e.strategy===Cx?Xx(e,t):Fs[e.level].func(e,t);if((s===Ai||s===Ms)&&(e.status=Ns),s===Oe||s===Ai)return n.avail_out===0&&(e.last_flush=-1),Ce;if(s===ys&&(t===bx?Sx(e):t!==Eh&&(dl(e,0,0,!1),t===Ex&&(Zn(e.head),e.lookahead===0&&(e.strstart=0,e.block_start=0,e.insert=0))),Ye(n),n.avail_out===0))return e.last_flush=-1,Ce}return t!==en?Ce:e.wrap<=0?wh:(e.wrap===2?($t(e,n.adler&255),$t(e,n.adler>>8&255),$t(e,n.adler>>16&255),$t(e,n.adler>>24&255),$t(e,n.total_in&255),$t(e,n.total_in>>8&255),$t(e,n.total_in>>16&255),$t(e,n.total_in>>24&255)):(Is(e,n.adler>>>16),Is(e,n.adler&65535)),Ye(n),e.wrap>0&&(e.wrap=-e.wrap),e.pending!==0?Ce:wh)},Jx=n=>{if(ar(n))return vn;const t=n.state.status;return n.state=null,t===yi?Mi(n,wx):Ce},Qx=(n,t)=>{let e=t.length;if(ar(n))return vn;const i=n.state,s=i.wrap;if(s===2||s===1&&i.status!==ms||i.lookahead)return vn;if(s===1&&(n.adler=js(n.adler,t,e,0)),i.wrap=0,e>=i.w_size){s===0&&(Zn(i.head),i.strstart=0,i.block_start=0,i.insert=0);let c=new Uint8Array(i.w_size);c.set(t.subarray(e-i.w_size,e),0),t=c,e=i.w_size}const r=n.avail_in,a=n.next_in,o=n.input;for(n.avail_in=e,n.next_in=0,n.input=t,_s(i);i.lookahead>=Bt;){let c=i.strstart,l=i.lookahead-(Bt-1);do i.ins_h=ei(i,i.ins_h,i.window[c+Bt-1]),i.prev[c&i.w_mask]=i.head[i.ins_h],i.head[i.ins_h]=c,c++;while(--l);i.strstart=c,i.lookahead=Bt-1,_s(i)}return i.strstart+=i.lookahead,i.block_start=i.strstart,i.insert=i.lookahead,i.lookahead=0,i.match_length=i.prev_length=Bt-1,i.match_available=0,n.next_in=a,n.input=o,n.avail_in=r,i.wrap=s,Ce};var ty=Kx,ey=dd,ny=ud,iy=hd,sy=$x,ry=jx,ay=Jx,oy=Qx,ly="pako deflate (from Nodeca project)",Hs={deflateInit:ty,deflateInit2:ey,deflateReset:ny,deflateResetKeep:iy,deflateSetHeader:sy,deflate:ry,deflateEnd:ay,deflateSetDictionary:oy,deflateInfo:ly};const cy=(n,t)=>Object.prototype.hasOwnProperty.call(n,t);var hy=function(n){const t=Array.prototype.slice.call(arguments,1);for(;t.length;){const e=t.shift();if(e){if(typeof e!="object")throw new TypeError(e+"must be non-object");for(const i in e)cy(e,i)&&(n[i]=e[i])}}return n},uy=n=>{let t=0;for(let i=0,s=n.length;i<s;i++)t+=n[i].length;const e=new Uint8Array(t);for(let i=0,s=0,r=n.length;i<r;i++){let a=n[i];e.set(a,s),s+=a.length}return e},va={assign:hy,flattenChunks:uy};let fd=!0;try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{fd=!1}const Js=new Uint8Array(256);for(let n=0;n<256;n++)Js[n]=n>=252?6:n>=248?5:n>=240?4:n>=224?3:n>=192?2:1;Js[254]=Js[254]=1;var dy=n=>{if(typeof TextEncoder=="function"&&TextEncoder.prototype.encode)return new TextEncoder().encode(n);let t,e,i,s,r,a=n.length,o=0;for(s=0;s<a;s++)e=n.charCodeAt(s),(e&64512)===55296&&s+1<a&&(i=n.charCodeAt(s+1),(i&64512)===56320&&(e=65536+(e-55296<<10)+(i-56320),s++)),o+=e<128?1:e<2048?2:e<65536?3:4;for(t=new Uint8Array(o),r=0,s=0;r<o;s++)e=n.charCodeAt(s),(e&64512)===55296&&s+1<a&&(i=n.charCodeAt(s+1),(i&64512)===56320&&(e=65536+(e-55296<<10)+(i-56320),s++)),e<128?t[r++]=e:e<2048?(t[r++]=192|e>>>6,t[r++]=128|e&63):e<65536?(t[r++]=224|e>>>12,t[r++]=128|e>>>6&63,t[r++]=128|e&63):(t[r++]=240|e>>>18,t[r++]=128|e>>>12&63,t[r++]=128|e>>>6&63,t[r++]=128|e&63);return t};const fy=(n,t)=>{if(t<65534&&n.subarray&&fd)return String.fromCharCode.apply(null,n.length===t?n:n.subarray(0,t));let e="";for(let i=0;i<t;i++)e+=String.fromCharCode(n[i]);return e};var py=(n,t)=>{const e=t||n.length;if(typeof TextDecoder=="function"&&TextDecoder.prototype.decode)return new TextDecoder().decode(n.subarray(0,t));let i,s;const r=new Array(e*2);for(s=0,i=0;i<e;){let a=n[i++];if(a<128){r[s++]=a;continue}let o=Js[a];if(o>4){r[s++]=65533,i+=o-1;continue}for(a&=o===2?31:o===3?15:7;o>1&&i<e;)a=a<<6|n[i++]&63,o--;if(o>1){r[s++]=65533;continue}a<65536?r[s++]=a:(a-=65536,r[s++]=55296|a>>10&1023,r[s++]=56320|a&1023)}return fy(r,s)},my=(n,t)=>{t=t||n.length,t>n.length&&(t=n.length);let e=t-1;for(;e>=0&&(n[e]&192)===128;)e--;return e<0||e===0?t:e+Js[n[e]]>t?e:t},Qs={string2buf:dy,buf2string:py,utf8border:my};function _y(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}var pd=_y;const md=Object.prototype.toString,{Z_NO_FLUSH:gy,Z_SYNC_FLUSH:vy,Z_FULL_FLUSH:xy,Z_FINISH:yy,Z_OK:ha,Z_STREAM_END:My,Z_DEFAULT_COMPRESSION:Sy,Z_DEFAULT_STRATEGY:by,Z_DEFLATED:Ey}=rr;function or(n){this.options=va.assign({level:Sy,method:Ey,chunkSize:16384,windowBits:15,memLevel:8,strategy:by},n||{});let t=this.options;t.raw&&t.windowBits>0?t.windowBits=-t.windowBits:t.gzip&&t.windowBits>0&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new pd,this.strm.avail_out=0;let e=Hs.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(e!==ha)throw new Error(Ti[e]);if(t.header&&Hs.deflateSetHeader(this.strm,t.header),t.dictionary){let i;if(typeof t.dictionary=="string"?i=Qs.string2buf(t.dictionary):md.call(t.dictionary)==="[object ArrayBuffer]"?i=new Uint8Array(t.dictionary):i=t.dictionary,e=Hs.deflateSetDictionary(this.strm,i),e!==ha)throw new Error(Ti[e]);this._dict_set=!0}}or.prototype.push=function(n,t){const e=this.strm,i=this.options.chunkSize;let s,r;if(this.ended)return!1;for(t===~~t?r=t:r=t===!0?yy:gy,typeof n=="string"?e.input=Qs.string2buf(n):md.call(n)==="[object ArrayBuffer]"?e.input=new Uint8Array(n):e.input=n,e.next_in=0,e.avail_in=e.input.length;;){if(e.avail_out===0&&(e.output=new Uint8Array(i),e.next_out=0,e.avail_out=i),(r===vy||r===xy)&&e.avail_out<=6){this.onData(e.output.subarray(0,e.next_out)),e.avail_out=0;continue}if(s=Hs.deflate(e,r),s===My)return e.next_out>0&&this.onData(e.output.subarray(0,e.next_out)),s=Hs.deflateEnd(this.strm),this.onEnd(s),this.ended=!0,s===ha;if(e.avail_out===0){this.onData(e.output);continue}if(r>0&&e.next_out>0){this.onData(e.output.subarray(0,e.next_out)),e.avail_out=0;continue}if(e.avail_in===0)break}return!0};or.prototype.onData=function(n){this.chunks.push(n)};or.prototype.onEnd=function(n){n===ha&&(this.result=va.flattenChunks(this.chunks)),this.chunks=[],this.err=n,this.msg=this.strm.msg};function kl(n,t){const e=new or(t);if(e.push(n,!0),e.err)throw e.msg||Ti[e.err];return e.result}function wy(n,t){return t=t||{},t.raw=!0,kl(n,t)}function Ty(n,t){return t=t||{},t.gzip=!0,kl(n,t)}var Ay=or,Cy=kl,Ry=wy,Py=Ty,Dy={Deflate:Ay,deflate:Cy,deflateRaw:Ry,gzip:Py};const Gr=16209,Ly=16191;var Iy=function(t,e){let i,s,r,a,o,c,l,h,u,d,f,_,g,m,p,b,y,v,C,T,w,P,M,x;const D=t.state;i=t.next_in,M=t.input,s=i+(t.avail_in-5),r=t.next_out,x=t.output,a=r-(e-t.avail_out),o=r+(t.avail_out-257),c=D.dmax,l=D.wsize,h=D.whave,u=D.wnext,d=D.window,f=D.hold,_=D.bits,g=D.lencode,m=D.distcode,p=(1<<D.lenbits)-1,b=(1<<D.distbits)-1;t:do{_<15&&(f+=M[i++]<<_,_+=8,f+=M[i++]<<_,_+=8),y=g[f&p];e:for(;;){if(v=y>>>24,f>>>=v,_-=v,v=y>>>16&255,v===0)x[r++]=y&65535;else if(v&16){C=y&65535,v&=15,v&&(_<v&&(f+=M[i++]<<_,_+=8),C+=f&(1<<v)-1,f>>>=v,_-=v),_<15&&(f+=M[i++]<<_,_+=8,f+=M[i++]<<_,_+=8),y=m[f&b];n:for(;;){if(v=y>>>24,f>>>=v,_-=v,v=y>>>16&255,v&16){if(T=y&65535,v&=15,_<v&&(f+=M[i++]<<_,_+=8,_<v&&(f+=M[i++]<<_,_+=8)),T+=f&(1<<v)-1,T>c){t.msg="invalid distance too far back",D.mode=Gr;break t}if(f>>>=v,_-=v,v=r-a,T>v){if(v=T-v,v>h&&D.sane){t.msg="invalid distance too far back",D.mode=Gr;break t}if(w=0,P=d,u===0){if(w+=l-v,v<C){C-=v;do x[r++]=d[w++];while(--v);w=r-T,P=x}}else if(u<v){if(w+=l+u-v,v-=u,v<C){C-=v;do x[r++]=d[w++];while(--v);if(w=0,u<C){v=u,C-=v;do x[r++]=d[w++];while(--v);w=r-T,P=x}}}else if(w+=u-v,v<C){C-=v;do x[r++]=d[w++];while(--v);w=r-T,P=x}for(;C>2;)x[r++]=P[w++],x[r++]=P[w++],x[r++]=P[w++],C-=3;C&&(x[r++]=P[w++],C>1&&(x[r++]=P[w++]))}else{w=r-T;do x[r++]=x[w++],x[r++]=x[w++],x[r++]=x[w++],C-=3;while(C>2);C&&(x[r++]=x[w++],C>1&&(x[r++]=x[w++]))}}else if((v&64)===0){y=m[(y&65535)+(f&(1<<v)-1)];continue n}else{t.msg="invalid distance code",D.mode=Gr;break t}break}}else if((v&64)===0){y=g[(y&65535)+(f&(1<<v)-1)];continue e}else if(v&32){D.mode=Ly;break t}else{t.msg="invalid literal/length code",D.mode=Gr;break t}break}}while(i<s&&r<o);C=_>>3,i-=C,_-=C<<3,f&=(1<<_)-1,t.next_in=i,t.next_out=r,t.avail_in=i<s?5+(s-i):5-(i-s),t.avail_out=r<o?257+(o-r):257-(r-o),D.hold=f,D.bits=_};const Ji=15,Ah=852,Ch=592,Rh=0,uo=1,Ph=2,Uy=new Uint16Array([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),Ny=new Uint8Array([16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78]),Fy=new Uint16Array([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),Oy=new Uint8Array([16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64]),zy=(n,t,e,i,s,r,a,o)=>{const c=o.bits;let l=0,h=0,u=0,d=0,f=0,_=0,g=0,m=0,p=0,b=0,y,v,C,T,w,P=null,M;const x=new Uint16Array(Ji+1),D=new Uint16Array(Ji+1);let F=null,O,H,X;for(l=0;l<=Ji;l++)x[l]=0;for(h=0;h<i;h++)x[t[e+h]]++;for(f=c,d=Ji;d>=1&&x[d]===0;d--);if(f>d&&(f=d),d===0)return s[r++]=1<<24|64<<16|0,s[r++]=1<<24|64<<16|0,o.bits=1,0;for(u=1;u<d&&x[u]===0;u++);for(f<u&&(f=u),m=1,l=1;l<=Ji;l++)if(m<<=1,m-=x[l],m<0)return-1;if(m>0&&(n===Rh||d!==1))return-1;for(D[1]=0,l=1;l<Ji;l++)D[l+1]=D[l]+x[l];for(h=0;h<i;h++)t[e+h]!==0&&(a[D[t[e+h]]++]=h);if(n===Rh?(P=F=a,M=20):n===uo?(P=Uy,F=Ny,M=257):(P=Fy,F=Oy,M=0),b=0,h=0,l=u,w=r,_=f,g=0,C=-1,p=1<<f,T=p-1,n===uo&&p>Ah||n===Ph&&p>Ch)return 1;for(;;){O=l-g,a[h]+1<M?(H=0,X=a[h]):a[h]>=M?(H=F[a[h]-M],X=P[a[h]-M]):(H=96,X=0),y=1<<l-g,v=1<<_,u=v;do v-=y,s[w+(b>>g)+v]=O<<24|H<<16|X|0;while(v!==0);for(y=1<<l-1;b&y;)y>>=1;if(y!==0?(b&=y-1,b+=y):b=0,h++,--x[l]===0){if(l===d)break;l=t[e+a[h]]}if(l>f&&(b&T)!==C){for(g===0&&(g=f),w+=u,_=l-g,m=1<<_;_+g<d&&(m-=x[_+g],!(m<=0));)_++,m<<=1;if(p+=1<<_,n===uo&&p>Ah||n===Ph&&p>Ch)return 1;C=b&T,s[C]=f<<24|_<<16|w-r|0}}return b!==0&&(s[w+b]=l-g<<24|64<<16|0),o.bits=f,0};var Gs=zy;const By=0,_d=1,gd=2,{Z_FINISH:Dh,Z_BLOCK:ky,Z_TREES:Vr,Z_OK:Ci,Z_STREAM_END:Hy,Z_NEED_DICT:Gy,Z_STREAM_ERROR:nn,Z_DATA_ERROR:vd,Z_MEM_ERROR:xd,Z_BUF_ERROR:Vy,Z_DEFLATED:Lh}=rr,xa=16180,Ih=16181,Uh=16182,Nh=16183,Fh=16184,Oh=16185,zh=16186,Bh=16187,kh=16188,Hh=16189,ua=16190,An=16191,fo=16192,Gh=16193,po=16194,Vh=16195,Wh=16196,Xh=16197,Yh=16198,Wr=16199,Xr=16200,qh=16201,Zh=16202,$h=16203,Kh=16204,jh=16205,mo=16206,Jh=16207,Qh=16208,le=16209,yd=16210,Md=16211,Wy=852,Xy=592,Yy=15,qy=Yy,tu=n=>(n>>>24&255)+(n>>>8&65280)+((n&65280)<<8)+((n&255)<<24);function Zy(){this.strm=null,this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Uint16Array(320),this.work=new Uint16Array(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}const Pi=n=>{if(!n)return 1;const t=n.state;return!t||t.strm!==n||t.mode<xa||t.mode>Md?1:0},Sd=n=>{if(Pi(n))return nn;const t=n.state;return n.total_in=n.total_out=t.total=0,n.msg="",t.wrap&&(n.adler=t.wrap&1),t.mode=xa,t.last=0,t.havedict=0,t.flags=-1,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new Int32Array(Wy),t.distcode=t.distdyn=new Int32Array(Xy),t.sane=1,t.back=-1,Ci},bd=n=>{if(Pi(n))return nn;const t=n.state;return t.wsize=0,t.whave=0,t.wnext=0,Sd(n)},Ed=(n,t)=>{let e;if(Pi(n))return nn;const i=n.state;return t<0?(e=0,t=-t):(e=(t>>4)+5,t<48&&(t&=15)),t&&(t<8||t>15)?nn:(i.window!==null&&i.wbits!==t&&(i.window=null),i.wrap=e,i.wbits=t,bd(n))},wd=(n,t)=>{if(!n)return nn;const e=new Zy;n.state=e,e.strm=n,e.window=null,e.mode=xa;const i=Ed(n,t);return i!==Ci&&(n.state=null),i},$y=n=>wd(n,qy);let eu=!0,_o,go;const Ky=n=>{if(eu){_o=new Int32Array(512),go=new Int32Array(32);let t=0;for(;t<144;)n.lens[t++]=8;for(;t<256;)n.lens[t++]=9;for(;t<280;)n.lens[t++]=7;for(;t<288;)n.lens[t++]=8;for(Gs(_d,n.lens,0,288,_o,0,n.work,{bits:9}),t=0;t<32;)n.lens[t++]=5;Gs(gd,n.lens,0,32,go,0,n.work,{bits:5}),eu=!1}n.lencode=_o,n.lenbits=9,n.distcode=go,n.distbits=5},Td=(n,t,e,i)=>{let s;const r=n.state;return r.window===null&&(r.wsize=1<<r.wbits,r.wnext=0,r.whave=0,r.window=new Uint8Array(r.wsize)),i>=r.wsize?(r.window.set(t.subarray(e-r.wsize,e),0),r.wnext=0,r.whave=r.wsize):(s=r.wsize-r.wnext,s>i&&(s=i),r.window.set(t.subarray(e-i,e-i+s),r.wnext),i-=s,i?(r.window.set(t.subarray(e-i,e),0),r.wnext=i,r.whave=r.wsize):(r.wnext+=s,r.wnext===r.wsize&&(r.wnext=0),r.whave<r.wsize&&(r.whave+=s))),0},jy=(n,t)=>{let e,i,s,r,a,o,c,l,h,u,d,f,_,g,m=0,p,b,y,v,C,T,w,P;const M=new Uint8Array(4);let x,D;const F=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);if(Pi(n)||!n.output||!n.input&&n.avail_in!==0)return nn;e=n.state,e.mode===An&&(e.mode=fo),a=n.next_out,s=n.output,c=n.avail_out,r=n.next_in,i=n.input,o=n.avail_in,l=e.hold,h=e.bits,u=o,d=c,P=Ci;t:for(;;)switch(e.mode){case xa:if(e.wrap===0){e.mode=fo;break}for(;h<16;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}if(e.wrap&2&&l===35615){e.wbits===0&&(e.wbits=15),e.check=0,M[0]=l&255,M[1]=l>>>8&255,e.check=be(e.check,M,2,0),l=0,h=0,e.mode=Ih;break}if(e.head&&(e.head.done=!1),!(e.wrap&1)||(((l&255)<<8)+(l>>8))%31){n.msg="incorrect header check",e.mode=le;break}if((l&15)!==Lh){n.msg="unknown compression method",e.mode=le;break}if(l>>>=4,h-=4,w=(l&15)+8,e.wbits===0&&(e.wbits=w),w>15||w>e.wbits){n.msg="invalid window size",e.mode=le;break}e.dmax=1<<e.wbits,e.flags=0,n.adler=e.check=1,e.mode=l&512?Hh:An,l=0,h=0;break;case Ih:for(;h<16;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}if(e.flags=l,(e.flags&255)!==Lh){n.msg="unknown compression method",e.mode=le;break}if(e.flags&57344){n.msg="unknown header flags set",e.mode=le;break}e.head&&(e.head.text=l>>8&1),e.flags&512&&e.wrap&4&&(M[0]=l&255,M[1]=l>>>8&255,e.check=be(e.check,M,2,0)),l=0,h=0,e.mode=Uh;case Uh:for(;h<32;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}e.head&&(e.head.time=l),e.flags&512&&e.wrap&4&&(M[0]=l&255,M[1]=l>>>8&255,M[2]=l>>>16&255,M[3]=l>>>24&255,e.check=be(e.check,M,4,0)),l=0,h=0,e.mode=Nh;case Nh:for(;h<16;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}e.head&&(e.head.xflags=l&255,e.head.os=l>>8),e.flags&512&&e.wrap&4&&(M[0]=l&255,M[1]=l>>>8&255,e.check=be(e.check,M,2,0)),l=0,h=0,e.mode=Fh;case Fh:if(e.flags&1024){for(;h<16;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}e.length=l,e.head&&(e.head.extra_len=l),e.flags&512&&e.wrap&4&&(M[0]=l&255,M[1]=l>>>8&255,e.check=be(e.check,M,2,0)),l=0,h=0}else e.head&&(e.head.extra=null);e.mode=Oh;case Oh:if(e.flags&1024&&(f=e.length,f>o&&(f=o),f&&(e.head&&(w=e.head.extra_len-e.length,e.head.extra||(e.head.extra=new Uint8Array(e.head.extra_len)),e.head.extra.set(i.subarray(r,r+f),w)),e.flags&512&&e.wrap&4&&(e.check=be(e.check,i,f,r)),o-=f,r+=f,e.length-=f),e.length))break t;e.length=0,e.mode=zh;case zh:if(e.flags&2048){if(o===0)break t;f=0;do w=i[r+f++],e.head&&w&&e.length<65536&&(e.head.name+=String.fromCharCode(w));while(w&&f<o);if(e.flags&512&&e.wrap&4&&(e.check=be(e.check,i,f,r)),o-=f,r+=f,w)break t}else e.head&&(e.head.name=null);e.length=0,e.mode=Bh;case Bh:if(e.flags&4096){if(o===0)break t;f=0;do w=i[r+f++],e.head&&w&&e.length<65536&&(e.head.comment+=String.fromCharCode(w));while(w&&f<o);if(e.flags&512&&e.wrap&4&&(e.check=be(e.check,i,f,r)),o-=f,r+=f,w)break t}else e.head&&(e.head.comment=null);e.mode=kh;case kh:if(e.flags&512){for(;h<16;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}if(e.wrap&4&&l!==(e.check&65535)){n.msg="header crc mismatch",e.mode=le;break}l=0,h=0}e.head&&(e.head.hcrc=e.flags>>9&1,e.head.done=!0),n.adler=e.check=0,e.mode=An;break;case Hh:for(;h<32;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}n.adler=e.check=tu(l),l=0,h=0,e.mode=ua;case ua:if(e.havedict===0)return n.next_out=a,n.avail_out=c,n.next_in=r,n.avail_in=o,e.hold=l,e.bits=h,Gy;n.adler=e.check=1,e.mode=An;case An:if(t===ky||t===Vr)break t;case fo:if(e.last){l>>>=h&7,h-=h&7,e.mode=mo;break}for(;h<3;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}switch(e.last=l&1,l>>>=1,h-=1,l&3){case 0:e.mode=Gh;break;case 1:if(Ky(e),e.mode=Wr,t===Vr){l>>>=2,h-=2;break t}break;case 2:e.mode=Wh;break;case 3:n.msg="invalid block type",e.mode=le}l>>>=2,h-=2;break;case Gh:for(l>>>=h&7,h-=h&7;h<32;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}if((l&65535)!==(l>>>16^65535)){n.msg="invalid stored block lengths",e.mode=le;break}if(e.length=l&65535,l=0,h=0,e.mode=po,t===Vr)break t;case po:e.mode=Vh;case Vh:if(f=e.length,f){if(f>o&&(f=o),f>c&&(f=c),f===0)break t;s.set(i.subarray(r,r+f),a),o-=f,r+=f,c-=f,a+=f,e.length-=f;break}e.mode=An;break;case Wh:for(;h<14;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}if(e.nlen=(l&31)+257,l>>>=5,h-=5,e.ndist=(l&31)+1,l>>>=5,h-=5,e.ncode=(l&15)+4,l>>>=4,h-=4,e.nlen>286||e.ndist>30){n.msg="too many length or distance symbols",e.mode=le;break}e.have=0,e.mode=Xh;case Xh:for(;e.have<e.ncode;){for(;h<3;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}e.lens[F[e.have++]]=l&7,l>>>=3,h-=3}for(;e.have<19;)e.lens[F[e.have++]]=0;if(e.lencode=e.lendyn,e.lenbits=7,x={bits:e.lenbits},P=Gs(By,e.lens,0,19,e.lencode,0,e.work,x),e.lenbits=x.bits,P){n.msg="invalid code lengths set",e.mode=le;break}e.have=0,e.mode=Yh;case Yh:for(;e.have<e.nlen+e.ndist;){for(;m=e.lencode[l&(1<<e.lenbits)-1],p=m>>>24,b=m>>>16&255,y=m&65535,!(p<=h);){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}if(y<16)l>>>=p,h-=p,e.lens[e.have++]=y;else{if(y===16){for(D=p+2;h<D;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}if(l>>>=p,h-=p,e.have===0){n.msg="invalid bit length repeat",e.mode=le;break}w=e.lens[e.have-1],f=3+(l&3),l>>>=2,h-=2}else if(y===17){for(D=p+3;h<D;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}l>>>=p,h-=p,w=0,f=3+(l&7),l>>>=3,h-=3}else{for(D=p+7;h<D;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}l>>>=p,h-=p,w=0,f=11+(l&127),l>>>=7,h-=7}if(e.have+f>e.nlen+e.ndist){n.msg="invalid bit length repeat",e.mode=le;break}for(;f--;)e.lens[e.have++]=w}}if(e.mode===le)break;if(e.lens[256]===0){n.msg="invalid code -- missing end-of-block",e.mode=le;break}if(e.lenbits=9,x={bits:e.lenbits},P=Gs(_d,e.lens,0,e.nlen,e.lencode,0,e.work,x),e.lenbits=x.bits,P){n.msg="invalid literal/lengths set",e.mode=le;break}if(e.distbits=6,e.distcode=e.distdyn,x={bits:e.distbits},P=Gs(gd,e.lens,e.nlen,e.ndist,e.distcode,0,e.work,x),e.distbits=x.bits,P){n.msg="invalid distances set",e.mode=le;break}if(e.mode=Wr,t===Vr)break t;case Wr:e.mode=Xr;case Xr:if(o>=6&&c>=258){n.next_out=a,n.avail_out=c,n.next_in=r,n.avail_in=o,e.hold=l,e.bits=h,Iy(n,d),a=n.next_out,s=n.output,c=n.avail_out,r=n.next_in,i=n.input,o=n.avail_in,l=e.hold,h=e.bits,e.mode===An&&(e.back=-1);break}for(e.back=0;m=e.lencode[l&(1<<e.lenbits)-1],p=m>>>24,b=m>>>16&255,y=m&65535,!(p<=h);){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}if(b&&(b&240)===0){for(v=p,C=b,T=y;m=e.lencode[T+((l&(1<<v+C)-1)>>v)],p=m>>>24,b=m>>>16&255,y=m&65535,!(v+p<=h);){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}l>>>=v,h-=v,e.back+=v}if(l>>>=p,h-=p,e.back+=p,e.length=y,b===0){e.mode=jh;break}if(b&32){e.back=-1,e.mode=An;break}if(b&64){n.msg="invalid literal/length code",e.mode=le;break}e.extra=b&15,e.mode=qh;case qh:if(e.extra){for(D=e.extra;h<D;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}e.length+=l&(1<<e.extra)-1,l>>>=e.extra,h-=e.extra,e.back+=e.extra}e.was=e.length,e.mode=Zh;case Zh:for(;m=e.distcode[l&(1<<e.distbits)-1],p=m>>>24,b=m>>>16&255,y=m&65535,!(p<=h);){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}if((b&240)===0){for(v=p,C=b,T=y;m=e.distcode[T+((l&(1<<v+C)-1)>>v)],p=m>>>24,b=m>>>16&255,y=m&65535,!(v+p<=h);){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}l>>>=v,h-=v,e.back+=v}if(l>>>=p,h-=p,e.back+=p,b&64){n.msg="invalid distance code",e.mode=le;break}e.offset=y,e.extra=b&15,e.mode=$h;case $h:if(e.extra){for(D=e.extra;h<D;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}e.offset+=l&(1<<e.extra)-1,l>>>=e.extra,h-=e.extra,e.back+=e.extra}if(e.offset>e.dmax){n.msg="invalid distance too far back",e.mode=le;break}e.mode=Kh;case Kh:if(c===0)break t;if(f=d-c,e.offset>f){if(f=e.offset-f,f>e.whave&&e.sane){n.msg="invalid distance too far back",e.mode=le;break}f>e.wnext?(f-=e.wnext,_=e.wsize-f):_=e.wnext-f,f>e.length&&(f=e.length),g=e.window}else g=s,_=a-e.offset,f=e.length;f>c&&(f=c),c-=f,e.length-=f;do s[a++]=g[_++];while(--f);e.length===0&&(e.mode=Xr);break;case jh:if(c===0)break t;s[a++]=e.length,c--,e.mode=Xr;break;case mo:if(e.wrap){for(;h<32;){if(o===0)break t;o--,l|=i[r++]<<h,h+=8}if(d-=c,n.total_out+=d,e.total+=d,e.wrap&4&&d&&(n.adler=e.check=e.flags?be(e.check,s,d,a-d):js(e.check,s,d,a-d)),d=c,e.wrap&4&&(e.flags?l:tu(l))!==e.check){n.msg="incorrect data check",e.mode=le;break}l=0,h=0}e.mode=Jh;case Jh:if(e.wrap&&e.flags){for(;h<32;){if(o===0)break t;o--,l+=i[r++]<<h,h+=8}if(e.wrap&4&&l!==(e.total&4294967295)){n.msg="incorrect length check",e.mode=le;break}l=0,h=0}e.mode=Qh;case Qh:P=Hy;break t;case le:P=vd;break t;case yd:return xd;case Md:default:return nn}return n.next_out=a,n.avail_out=c,n.next_in=r,n.avail_in=o,e.hold=l,e.bits=h,(e.wsize||d!==n.avail_out&&e.mode<le&&(e.mode<mo||t!==Dh))&&Td(n,n.output,n.next_out,d-n.avail_out),u-=n.avail_in,d-=n.avail_out,n.total_in+=u,n.total_out+=d,e.total+=d,e.wrap&4&&d&&(n.adler=e.check=e.flags?be(e.check,s,d,n.next_out-d):js(e.check,s,d,n.next_out-d)),n.data_type=e.bits+(e.last?64:0)+(e.mode===An?128:0)+(e.mode===Wr||e.mode===po?256:0),(u===0&&d===0||t===Dh)&&P===Ci&&(P=Vy),P},Jy=n=>{if(Pi(n))return nn;let t=n.state;return t.window&&(t.window=null),n.state=null,Ci},Qy=(n,t)=>{if(Pi(n))return nn;const e=n.state;return(e.wrap&2)===0?nn:(e.head=t,t.done=!1,Ci)},tM=(n,t)=>{const e=t.length;let i,s,r;return Pi(n)||(i=n.state,i.wrap!==0&&i.mode!==ua)?nn:i.mode===ua&&(s=1,s=js(s,t,e,0),s!==i.check)?vd:(r=Td(n,t,e,e),r?(i.mode=yd,xd):(i.havedict=1,Ci))};var eM=bd,nM=Ed,iM=Sd,sM=$y,rM=wd,aM=jy,oM=Jy,lM=Qy,cM=tM,hM="pako inflate (from Nodeca project)",Pn={inflateReset:eM,inflateReset2:nM,inflateResetKeep:iM,inflateInit:sM,inflateInit2:rM,inflate:aM,inflateEnd:oM,inflateGetHeader:lM,inflateSetDictionary:cM,inflateInfo:hM};function uM(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}var dM=uM;const Ad=Object.prototype.toString,{Z_NO_FLUSH:fM,Z_FINISH:pM,Z_OK:tr,Z_STREAM_END:vo,Z_NEED_DICT:xo,Z_STREAM_ERROR:mM,Z_DATA_ERROR:nu,Z_MEM_ERROR:_M}=rr;function lr(n){this.options=va.assign({chunkSize:1024*64,windowBits:15,to:""},n||{});const t=this.options;t.raw&&t.windowBits>=0&&t.windowBits<16&&(t.windowBits=-t.windowBits,t.windowBits===0&&(t.windowBits=-15)),t.windowBits>=0&&t.windowBits<16&&!(n&&n.windowBits)&&(t.windowBits+=32),t.windowBits>15&&t.windowBits<48&&(t.windowBits&15)===0&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new pd,this.strm.avail_out=0;let e=Pn.inflateInit2(this.strm,t.windowBits);if(e!==tr)throw new Error(Ti[e]);if(this.header=new dM,Pn.inflateGetHeader(this.strm,this.header),t.dictionary&&(typeof t.dictionary=="string"?t.dictionary=Qs.string2buf(t.dictionary):Ad.call(t.dictionary)==="[object ArrayBuffer]"&&(t.dictionary=new Uint8Array(t.dictionary)),t.raw&&(e=Pn.inflateSetDictionary(this.strm,t.dictionary),e!==tr)))throw new Error(Ti[e])}lr.prototype.push=function(n,t){const e=this.strm,i=this.options.chunkSize,s=this.options.dictionary;let r,a,o;if(this.ended)return!1;for(t===~~t?a=t:a=t===!0?pM:fM,Ad.call(n)==="[object ArrayBuffer]"?e.input=new Uint8Array(n):e.input=n,e.next_in=0,e.avail_in=e.input.length;;){for(e.avail_out===0&&(e.output=new Uint8Array(i),e.next_out=0,e.avail_out=i),r=Pn.inflate(e,a),r===xo&&s&&(r=Pn.inflateSetDictionary(e,s),r===tr?r=Pn.inflate(e,a):r===nu&&(r=xo));e.avail_in>0&&r===vo&&e.state.wrap>0&&n[e.next_in]!==0;)Pn.inflateReset(e),r=Pn.inflate(e,a);switch(r){case mM:case nu:case xo:case _M:return this.onEnd(r),this.ended=!0,!1}if(o=e.avail_out,e.next_out&&(e.avail_out===0||r===vo))if(this.options.to==="string"){let c=Qs.utf8border(e.output,e.next_out),l=e.next_out-c,h=Qs.buf2string(e.output,c);e.next_out=l,e.avail_out=i-l,l&&e.output.set(e.output.subarray(c,c+l),0),this.onData(h)}else this.onData(e.output.length===e.next_out?e.output:e.output.subarray(0,e.next_out));if(!(r===tr&&o===0)){if(r===vo)return r=Pn.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,!0;if(e.avail_in===0)break}}return!0};lr.prototype.onData=function(n){this.chunks.push(n)};lr.prototype.onEnd=function(n){n===tr&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=va.flattenChunks(this.chunks)),this.chunks=[],this.err=n,this.msg=this.strm.msg};function Hl(n,t){const e=new lr(t);if(e.push(n),e.err)throw e.msg||Ti[e.err];return e.result}function gM(n,t){return t=t||{},t.raw=!0,Hl(n,t)}var vM=lr,xM=Hl,yM=gM,MM=Hl,SM={Inflate:vM,inflate:xM,inflateRaw:yM,ungzip:MM};const{Deflate:bM,deflate:EM,deflateRaw:wM,gzip:TM}=Dy,{Inflate:AM,inflate:CM,inflateRaw:RM,ungzip:PM}=SM;var DM=bM,LM=EM,IM=wM,UM=TM,NM=AM,FM=CM,OM=RM,zM=PM,BM=rr,kM={Deflate:DM,deflate:LM,deflateRaw:IM,gzip:UM,Inflate:NM,inflate:FM,inflateRaw:OM,ungzip:zM,constants:BM};function HM(n){if(!n||n.trim()==="")return null;try{const t=atob(n.trim()),e=new Uint8Array(t.length);for(let s=0;s<t.length;s++)e[s]=t.charCodeAt(s);const i=kM.inflate(e,{to:"string"});return GM(i)}catch(t){return console.warn("Failed to decode TTS prompt:",t),{raw:n,text:"[Unable to decode prompt]",xml:""}}}function GM(n){const e=new DOMParser().parseFromString(n,"text/xml"),i={xml:n,segments:[],text:""},s=e.querySelector("speak");if(s)return i.text=s.textContent.trim(),i.segments.push({type:"speak",content:i.text}),i;const r=e.querySelectorAll("prompt");for(const a of r){const o=a.textContent.trim();o&&i.segments.push({type:"prompt",content:o})}if(i.segments.length===0){const a=e.querySelectorAll("file, audio");for(const l of a){const h=l.getAttribute("src")||l.textContent.trim();h&&i.segments.push({type:"audio",content:h})}const o=e.createTreeWalker(e,NodeFilter.SHOW_TEXT,null);let c;for(;c=o.nextNode();){const l=c.textContent.trim();l&&l.length>2&&i.segments.push({type:"text",content:l})}}return i.text=i.segments.map(a=>a.content).join(" "),i.text||(i.text=n),i}class VM{constructor(){this.panel=document.getElementById("inspector-panel"),this.title=document.getElementById("inspector-title"),this.type=document.getElementById("inspector-type"),this.icon=document.getElementById("inspector-icon"),this.body=document.getElementById("inspector-body"),this.closeBtn=document.getElementById("inspector-close"),this.closeBtn.addEventListener("click",()=>this.close()),this.isOpen=!1}open(t){if(!t)return;this.title.textContent=t.moduleName,this.type.textContent=t.moduleType,this.icon.className="inspector-icon";const i={incomingCall:{class:"incoming",emoji:"📡"},skillTransfer:{class:"skill",emoji:"🔧"},case:{class:"case",emoji:"🔀"},hangup:{class:"hangup",emoji:"📴"},play:{class:"play",emoji:"🔊"},startOnHangup:{class:"start",emoji:"⚡"}}[t.moduleType]||{class:"start",emoji:"◆"};this.icon.classList.add(i.class),this.icon.textContent=i.emoji,this.body.innerHTML=this._buildContent(t),this.panel.classList.remove("hidden"),requestAnimationFrame(()=>{this.panel.classList.add("visible")}),this.isOpen=!0}close(){this.panel.classList.remove("visible"),this.panel.classList.add("hidden"),this.isOpen=!1}_buildContent(t){let e="";switch(e+=this._section("Module Identity",`
      ${this._kv("Module ID",t.moduleId,"info")}
      ${this._kv("Flow",t.flow==="main"?"Main IVR":"On-Hangup","info")}
      ${this._kv("Position",`X: ${t.locationX}  Y: ${t.locationY}`)}
      ${t.singleDescendant?this._kv("Next Module",t.singleDescendant.substring(0,12)+"…","info"):""}
      ${t.ascendants.length?this._kv("Ascendants",t.ascendants.length+" module(s)"):""}
    `),t.moduleType){case"skillTransfer":e+=this._buildSkillTransferView(t);break;case"case":e+=this._buildCaseView(t);break;case"play":e+=this._buildPlayView(t);break;case"hangup":e+=this._buildHangupView(t);break;case"incomingCall":e+=this._buildIncomingCallView(t);break}return e}_buildSkillTransferView(t){const e=t.data;let i="";i+=this._section("⚠️ Audit View",`
      ${this._kv("Skill",e.skillName||"N/A","info")}
      ${this._kv("Max Queue Time",e.maxQueueTime?e.maxQueueTime+"s":"N/A",e.maxQueueTime>300?"warn":"ok")}
      ${this._kv("Max Ring Time",e.maxRingTime?e.maxRingTime+"s":"N/A",e.maxRingTime<20?"warn":"ok")}
      ${this._kv("Place on Break if No Answer",e.placeOnBreakIfNoAnswer?"YES":"NO",e.placeOnBreakIfNoAnswer?"warn":"ok")}
      ${this._kv("Queue if On Call",e.queueIfOnCall?"YES":"NO")}
      ${this._kv("On-Call Queue Time",e.onCallQueueTime?e.onCallQueueTime+"s":"N/A")}
      ${this._kv("Music on Hold",e.enableMusicOnHold?"Enabled":"Disabled","ok")}
      ${this._kv("VM on Queue Timeout",e.vmTransferOnQueueTimeout?"YES":"NO")}
      ${this._kv("Pause Before Transfer",e.pauseBeforeTransfer?e.pauseBeforeTransfer+"s":"0s")}
    `),i+=this._section("Transfer Algorithm",`
      ${this._kv("Algorithm",e.algorithmType||"N/A","info")}
      ${this._kv("Time Window",e.statAlgorithmTimeWindow||"N/A")}
      ${this._kv("Priority Change",e.priorityChangeType||"N/A")}
      ${e.priorityChangeValue?this._kv("Priority Value","+"+e.priorityChangeValue):""}
    `),e.disposition&&(i+=this._section("Disposition",`
        ${this._kv("Name",e.disposition.name,e.disposition.name==="Abandon"?"warn":"")}
        ${this._kv("ID",e.disposition.id)}
      `));const s=[];return e.maxQueueTime>300&&s.push(`<strong>Long Queue:</strong> Max queue time is ${e.maxQueueTime}s (${Math.round(e.maxQueueTime/60)} min). Callers may abandon before reaching an agent.`),e.maxRingTime&&e.maxRingTime<20&&s.push(`<strong>Short Ring:</strong> Max ring time is only ${e.maxRingTime}s. Agents have limited time to pick up.`),e.placeOnBreakIfNoAnswer&&s.push(`<strong>Auto-Break:</strong> Agents go "Not Ready" if they don't answer within ${e.maxRingTime}s. This is why agents may show as unavailable.`),s.length&&(i+=`<div class="inspector-section">
        <div class="inspector-section-title">🚨 Diagnostic Alerts</div>
        ${s.map(r=>`<div class="kv-row" style="flex-direction:column;align-items:flex-start;gap:4px;padding:12px;background:rgba(255,61,90,0.05);border:1px solid rgba(255,61,90,0.1);border-radius:8px;margin-bottom:8px;">
          <span style="font-size:0.78rem;color:var(--accent-red);line-height:1.5;">${r}</span>
        </div>`).join("")}
      </div>`),i}_buildCaseView(t){var s,r;const e=t.data;let i="";if(e.branches&&e.branches.length>0){const a=e.branches.filter(c=>c.name!=="No Match"),o=e.branches.find(c=>c.name==="No Match");i+=this._section("🔀 Decision Logic",`
        ${this._kv("Variable Tested",((s=a[0])==null?void 0:s.leftOperand)||"Call.ANI","info")}
        ${this._kv("Comparison",((r=a[0])==null?void 0:r.comparisonType)||"EQUALS","info")}
        ${this._kv("Blocked Entries",a.length.toString(),"warn")}
        ${o?this._kv("Default Path","Passes through","ok"):""}
      `),i+=`<div class="inspector-section">
        <div class="inspector-section-title">Decision Tree</div>
        <div class="decision-tree">`,o&&(i+=`<div class="decision-branch">
          <div class="branch-indicator pass"></div>
          <span class="branch-name">No Match (pass-through)</span>
          <span class="branch-target">→ Continue</span>
        </div>`),i+="</div></div>",i+=`<div class="inspector-section">
        <div class="inspector-section-title">🚫 Blocked Callers (${a.length})</div>
        <div class="blocked-list">`,a.forEach(c=>{i+=`<div class="blocked-item" title="${c.comparisonType} ${c.rightValue||c.name}">${c.name}</div>`}),i+="</div></div>"}return i}_buildPlayView(t){const e=t.data;let i="";if(i+=`<div class="inspector-section">
      <div class="inspector-section-title">🔊 Prompt Playback</div>`,e.ttsXml){const s=HM(e.ttsXml);s?(i+=`<div class="tts-display">${this._escapeHtml(s.text||s.xml||"[No text content]")}</div>`,s.segments&&s.segments.length>0&&(i+='<div style="margin-top:12px;">',s.segments.forEach(r=>{i+=`<div class="kv-row">
              <span class="kv-key">${r.type}</span>
              <span class="kv-value" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;">${this._escapeHtml(r.content.substring(0,80))}</span>
            </div>`}),i+="</div>")):i+='<div class="tts-display">[Unable to decode TTS prompt]</div>'}else i+='<div class="tts-display">[No TTS prompt data]</div>';return i+="</div>",i+=this._section("Settings",`
      ${this._kv("Interruptible",e.interruptible?"YES":"NO")}
      ${e.disposition?this._kv("Disposition",e.disposition.name):""}
    `),i}_buildHangupView(t){const e=t.data;let i="";return i+=this._section("Hangup Configuration",`
      ${e.disposition?this._kv("Disposition",e.disposition.name,e.disposition.name.includes("Disconnect")?"warn":""):""}
      ${e.disposition?this._kv("Disposition ID",e.disposition.id):""}
      ${this._kv("Return to Caller",e.returnToCallingModule?"YES":"NO")}
      ${this._kv("Overwrite Disposition",e.overwriteDisposition?"YES":"NO")}
    `),i}_buildIncomingCallView(t){let e="";return e+=this._section("Entry Point",`
      ${this._kv("Type","Incoming Call Entry Portal","info")}
      ${this._kv("Next Module",t.singleDescendant?t.singleDescendant.substring(0,16)+"…":"None","info")}
    `),e}_section(t,e){return`<div class="inspector-section">
      <div class="inspector-section-title">${t}</div>
      ${e}
    </div>`}_kv(t,e,i=""){return`<div class="kv-row">
      <span class="kv-key">${t}</span>
      <span class="kv-value ${i}">${e}</span>
    </div>`}_escapeHtml(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}}class WM{constructor(){this.parsedData=null,this.heatData=null,this.sceneManager=null,this.inspector=null,this._init()}async _init(){const t=document.getElementById("canvas-container");this.sceneManager=new Wv(t),this.inspector=new VM,this.sceneManager.onModuleClick=e=>{var s;const i=(s=this.parsedData)==null?void 0:s.moduleMap[e];i&&this.inspector.open(i)},this._setupToolbar(),this._setupDropZone(),await this._loadBundledDemo(),setTimeout(()=>{const e=document.getElementById("loading-overlay");e.classList.add("fade-out"),setTimeout(()=>e.remove(),800),this._showOnboarding()},1500)}async _loadBundledDemo(){try{const e=await fetch("/Flux3D/INBOUND OPEN.five9ivr");if(e.ok){const i=await e.text();this._processIVRFile(i,"INBOUND OPEN.five9ivr")}}catch{console.log("No bundled demo file found, waiting for user upload.")}}_processIVRFile(t,e){try{this.parsedData=Nd(t),this.heatData=Vd(this.parsedData.modules,this.parsedData.edges),this.sceneManager.buildGraph(this.parsedData,this.heatData),document.getElementById("script-name").textContent=e,this._updateStats(),console.log("Parsed IVR:",this.parsedData)}catch(i){console.error("Failed to parse IVR file:",i),alert("Failed to parse IVR file: "+i.message)}}_processCSVFile(t,e){try{const i=Hd(t);console.log("Parsed CSV:",i),alert(`Loaded ${i.totalCalls} call records from ${e}`)}catch(i){console.error("Failed to parse CSV:",i),alert("Failed to parse CSV file: "+i.message)}}_updateStats(){if(!this.parsedData)return;const{stats:t}=this.parsedData;document.getElementById("stat-modules").textContent=`${t.totalModules} modules`,document.getElementById("stat-connections").textContent=`${t.totalConnections} connections`,document.getElementById("stat-blocked").textContent=`${t.blockedANIs} ANIs`,document.getElementById("stat-skills").textContent=`${t.skills} skills`,document.getElementById("stats-inline").classList.remove("hidden")}_setupToolbar(){const t=document.getElementById("btn-upload-ivr"),e=document.getElementById("file-input-ivr");t.addEventListener("click",()=>e.click()),e.addEventListener("change",d=>{const f=d.target.files[0];if(f){const _=new FileReader;_.onload=g=>this._processIVRFile(g.target.result,f.name),_.readAsText(f)}});const i=document.getElementById("btn-upload-csv"),s=document.getElementById("file-input-csv");i.addEventListener("click",()=>s.click()),s.addEventListener("change",d=>{const f=d.target.files[0];if(f){const _=new FileReader;_.onload=g=>this._processCSVFile(g.target.result,f.name),_.readAsText(f)}});const r=document.getElementById("btn-toggle-labels");r.addEventListener("click",()=>{r.classList.toggle("active"),this.sceneManager.toggleLabels(r.classList.contains("active"))});const a=document.getElementById("btn-toggle-heat");a.addEventListener("click",()=>{a.classList.toggle("active");const d=a.classList.contains("active");if(this.sceneManager.toggleHeatMap(d,this.parsedData,this.heatData),document.getElementById("btn-toggle-ani").classList.contains("active")&&this.parsedData){const _=d?this.heatData:null;this.sceneManager.toggleANIExpansion(!0,this.parsedData,_)}});const o=document.getElementById("btn-toggle-ani");o.addEventListener("click",()=>{o.classList.toggle("active");const d=o.classList.contains("active");if(this.parsedData){const f=document.getElementById("btn-toggle-heat").classList.contains("active")?this.heatData:null;this.sceneManager.toggleANIExpansion(d,this.parsedData,f)}}),document.getElementById("btn-toggle-tour").addEventListener("click",()=>{var d;(d=this.sceneManager._tour)!=null&&d.active?this.sceneManager.stopTour():this.sceneManager.startTour()}),document.getElementById("btn-reset-camera").addEventListener("click",()=>{this.sceneManager.resetCamera()}),document.getElementById("btn-screenshot").addEventListener("click",()=>{this._takeScreenshot()});const u=document.getElementById("btn-fullscreen");u&&u.addEventListener("click",()=>this._toggleFullscreen()),this._setupKeyboardShortcuts()}_takeScreenshot(){const t=this.sceneManager.screenshot(),e=new Image;e.onload=()=>{const i=document.createElement("canvas");i.width=e.width,i.height=e.height;const s=i.getContext("2d");s.drawImage(e,0,0),s.fillStyle="rgba(0, 0, 0, 0.5)",s.fillRect(i.width-220,i.height-36,220,36),s.font="bold 14px Inter, sans-serif",s.fillStyle="#ffffff",s.textAlign="right",s.fillText("◆ FLUX3D",i.width-12,i.height-16),s.font="10px JetBrains Mono, monospace",s.fillStyle="rgba(255,255,255,0.6)";const r=new Date().toLocaleString();s.fillText(r,i.width-12,i.height-4);const a=document.createElement("a");a.href=i.toDataURL("image/png"),a.download=`flux3d-${Date.now()}.png`,a.click()},e.src=t}_toggleFullscreen(){document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})}_setupKeyboardShortcuts(){const t=document.getElementById("search-overlay"),e=document.getElementById("search-input"),i=document.getElementById("search-results"),s=document.getElementById("shortcuts-overlay"),r=document.getElementById("shortcuts-close");r&&r.addEventListener("click",()=>{s.classList.add("hidden")}),t==null||t.addEventListener("click",a=>{a.target===t&&(t.classList.add("hidden"),e.value="",i.innerHTML="")}),s==null||s.addEventListener("click",a=>{a.target===s&&s.classList.add("hidden")}),e==null||e.addEventListener("input",()=>{const a=e.value.toLowerCase().trim();if(i.innerHTML="",!a||!this.parsedData)return;this.parsedData.modules.filter(c=>c.moduleName.toLowerCase().includes(a)||c.moduleType.toLowerCase().includes(a)).slice(0,10).forEach(c=>{const l=document.createElement("div");l.className="search-result-item",l.innerHTML=`
          <span class="search-result-type">${c.moduleType}</span>
          <span class="search-result-name">${c.moduleName}</span>
        `,l.addEventListener("click",()=>{t.classList.add("hidden"),e.value="",i.innerHTML="";const h=this.sceneManager.modules3D[c.moduleId];h&&(this.sceneManager.controlMode==="thirdPerson"&&this.sceneManager.avatar&&this.sceneManager.avatar.navigateTo(h.position.x,h.position.z),this.sceneManager._highlightModule(c.moduleId),this.sceneManager.onModuleClick&&this.sceneManager.onModuleClick(c.moduleId))}),i.appendChild(l)})}),window.addEventListener("keydown",a=>{var o,c,l;if((a.ctrlKey||a.metaKey)&&a.key==="f"){a.preventDefault(),t.classList.remove("hidden"),setTimeout(()=>e==null?void 0:e.focus(),50);return}if(a.key==="Escape"){t==null||t.classList.add("hidden"),s==null||s.classList.add("hidden"),e&&(e.value="",i.innerHTML="");return}if(a.key==="?"&&!a.ctrlKey&&!a.metaKey){((o=document.activeElement)==null?void 0:o.tagName)!=="INPUT"&&(s==null||s.classList.toggle("hidden"));return}if(a.key==="F11"){a.preventDefault(),this._toggleFullscreen();return}if(a.key.toLowerCase()==="t"&&!a.ctrlKey&&!a.metaKey){((c=document.activeElement)==null?void 0:c.tagName)!=="INPUT"&&((l=this.sceneManager._tour)!=null&&l.active?this.sceneManager.stopTour():this.sceneManager.startTour());return}})}_detectDeadEnds(){if(!this.parsedData)return;const{modules:t,edges:e}=this.parsedData,i=new Set(e.map(s=>s.from));t.forEach(s=>{!i.has(s.moduleId)&&s.moduleType!=="hangup"&&console.warn(`⚠️ Dead-end detected: ${s.moduleName} (${s.moduleType})`)})}_setupDropZone(){const t=document.getElementById("drop-zone"),e=document.body;let i=0;e.addEventListener("dragenter",s=>{s.preventDefault(),i++,t.classList.remove("hidden")}),e.addEventListener("dragleave",s=>{s.preventDefault(),i--,i<=0&&(t.classList.add("hidden"),i=0)}),e.addEventListener("dragover",s=>{s.preventDefault()}),e.addEventListener("drop",s=>{s.preventDefault(),i=0,t.classList.add("hidden");const r=s.dataTransfer.files[0];if(!r)return;const a=new FileReader;a.onload=o=>{r.name.endsWith(".five9ivr")||r.name.endsWith(".xml")?this._processIVRFile(o.target.result,r.name):r.name.endsWith(".csv")?this._processCSVFile(o.target.result,r.name):alert("Unsupported file type. Please drop a .five9ivr or .csv file.")},a.readAsText(r)})}_showOnboarding(){if(localStorage.getItem("flux3d-onboarded"))return;const t=document.getElementById("onboarding-toast");if(!t)return;t.classList.remove("hidden"),localStorage.setItem("flux3d-onboarded","1");const e=document.getElementById("toast-dismiss");e&&e.addEventListener("click",()=>t.classList.add("hidden")),setTimeout(()=>t.classList.add("hidden"),6e3)}}window.addEventListener("DOMContentLoaded",()=>{new WM});
