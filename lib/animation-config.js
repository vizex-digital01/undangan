import {weddingV26Slug} from './wedding-v26';
import {visualForTemplate,motionForVisual} from './theme-artwork';
import {weddingArtSlug} from './wedding-v25';
import {isLocalOrnament,ornamentPresetForTemplate} from './ornament-library';
/** Shared, serializable motion presets. Only allow-listed values are persisted. */
export const ENTRANCES=['fade-up','fade-down','slide-left','slide-right','zoom','rotate','none'];
export const COVER_EFFECTS=['curtain','fade','zoom','slide','none'];
export const ORNAMENT_EFFECTS=['float','sway','spin','pulse','none'];
export const SYMBOLS=['✦','✧','❦','❧','❀','✿','❁','✺','☾','♡','◆','✶'];
export const SCOPES=['cover','content','all'];
export const SECTION_IDS=['opening','quotes','couple','event','gallery','rsvp','gift','about','agenda','location','ending'];
export const DEFAULT_ANIMATION={
 cover:{effect:'curtain',duration:1100},
 scroll:{effect:'fade-up',duration:1050,stagger:90},
 sections:{},
 ornaments:[]
};
const num=(v,min,max,def)=>{const n=Number(v);return Number.isFinite(n)?Math.min(max,Math.max(min,Math.round(n))):def};
const choose=(v,options,def)=>options.includes(v)?v:def;
const color=(v)=>typeof v==='string'&&/^#[0-9a-fA-F]{6}$/.test(v)?v:'#c7a46a';
const safeUrl=(v)=>{
 if(isLocalOrnament(v))return v;
 try{const u=new URL(String(v||''));return u.protocol==='https:'&&u.pathname.length<400&&u.href.length<900?u.href:''}catch{return ''}
};
export function normalizeAnimation(raw){
 const a=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const cover=a.cover||{},scroll=a.scroll||{};
 return {
  cover:{effect:choose(cover.effect,COVER_EFFECTS,'curtain'),duration:num(cover.duration,500,2500,1100)},
  scroll:{effect:choose(scroll.effect,ENTRANCES,'fade-up'),duration:num(scroll.duration,200,2200,1050),stagger:num(scroll.stagger,0,300,90)},
  sections:Object.fromEntries(SECTION_IDS.filter(id=>ENTRANCES.includes(a.sections?.[id])).map(id=>[id,a.sections[id]])),
  ornaments:(Array.isArray(a.ornaments)?a.ornaments:[]).slice(0,14).map((x,i)=>({
   id:typeof x?.id==='string'&&/^[a-zA-Z0-9_-]{1,40}$/.test(x.id)?x.id:'item-'+i,
   kind:x?.kind==='image'?'image':'symbol',
   symbol:choose(x?.symbol,SYMBOLS,'✦'),
   src:x?.kind==='image'?safeUrl(x?.src):'',
   scope:choose(x?.scope,SCOPES,'cover'),
   x:num(x?.x,0,100,50),y:num(x?.y,0,100,50),size:num(x?.size,12,360,36),
   color:color(x?.color),effect:choose(x?.effect,ORNAMENT_EFFECTS,'float'),
   speed:num(x?.speed,2,20,5),delay:num(x?.delay,0,2500,0),opacity:num(x?.opacity,10,100,70)
  })).filter(x=>x.kind!=='image'||x.src)
 };
}

/** Per-theme motion direction, while respecting admin-saved animation overrides. */
const WEDDING_V25_MOTION = {
 ivory:{cover:{effect:'fade',duration:1200},scroll:{effect:'fade-up',duration:1080,stagger:110}},
 batik:{cover:{effect:'curtain',duration:1450},scroll:{effect:'slide-right',duration:1130,stagger:120}},
 sage:{cover:{effect:'fade',duration:1200},scroll:{effect:'fade-up',duration:1020,stagger:115}},
 rose:{cover:{effect:'zoom',duration:1250},scroll:{effect:'zoom',duration:1030,stagger:115}},
 celestial:{cover:{effect:'zoom',duration:1450},scroll:{effect:'fade-up',duration:1250,stagger:145}},
 terracotta:{cover:{effect:'slide',duration:1200},scroll:{effect:'slide-left',duration:1020,stagger:95}}
};
const WEDDING_V26_MOTION={
 emerald:{cover:{effect:'curtain',duration:1420},scroll:{effect:'slide-right',duration:1080,stagger:120}},
 blackgold:{cover:{effect:'zoom',duration:1450},scroll:{effect:'fade-up',duration:1120,stagger:125}},
 lavender:{cover:{effect:'fade',duration:1250},scroll:{effect:'fade-up',duration:1020,stagger:90}},
 sakura:{cover:{effect:'slide',duration:1330},scroll:{effect:'slide-left',duration:1080,stagger:125}},
 songket:{cover:{effect:'curtain',duration:1530},scroll:{effect:'slide-right',duration:1120,stagger:135}},
 ocean:{cover:{effect:'fade',duration:1300},scroll:{effect:'fade-up',duration:1150,stagger:95}},
 sunset:{cover:{effect:'zoom',duration:1320},scroll:{effect:'zoom',duration:1050,stagger:110}},
 botanical:{cover:{effect:'fade',duration:1100},scroll:{effect:'fade-up',duration:1000,stagger:90}},
 violet:{cover:{effect:'zoom',duration:1550},scroll:{effect:'fade-up',duration:1220,stagger:130}},
 tropical:{cover:{effect:'slide',duration:1250},scroll:{effect:'fade-up',duration:1080,stagger:108}}
};
function curatedAnimation(template){
 const slug=weddingArtSlug(template),slug26=weddingV26Slug(template),motion=motionForVisual(visualForTemplate(template));
 return normalizeAnimation({...DEFAULT_ANIMATION,...motion,...(WEDDING_V25_MOTION[slug]||{}),...(WEDDING_V26_MOTION[slug26]||{}),ornaments:slug||slug26?[]:ornamentPresetForTemplate(template)});
}
/** A design gets curated artwork until the admin explicitly saves its own configuration. */
export function animationForTemplate(template){
 if(template?.animationConfig!=null)return normalizeAnimation(template.animationConfig);
 return curatedAnimation(template);
}
export function initialAnimationForTemplate(template){return curatedAnimation(template)}
