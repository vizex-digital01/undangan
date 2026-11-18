import {visualForTemplate,motionForVisual} from './theme-artwork';
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

/** A design gets curated artwork until the admin explicitly saves its own configuration. */
export function animationForTemplate(template){
 if(template?.animationConfig!=null)return normalizeAnimation(template.animationConfig);
 return normalizeAnimation({...DEFAULT_ANIMATION,...motionForVisual(visualForTemplate(template)),ornaments:ornamentPresetForTemplate(template)});
}
export function initialAnimationForTemplate(template){
 return normalizeAnimation({...DEFAULT_ANIMATION,...motionForVisual(visualForTemplate(template)),ornaments:ornamentPresetForTemplate(template)});
}
