/** Curated, locally bundled transparent SVG ornaments. No expiring external URLs. */
export const ORNAMENT_LIBRARY = [
 {id:'v25-ivory',name:'V25 · Ivory Floral Petals',src:'/themes/v25/ivory-element.svg',tags:['floral','wedding','ivory']},
 {id:'v25-batik',name:'V25 · Blue Keraton Batik',src:'/themes/v25/batik-element.svg',tags:['batik','adat','wedding']},
 {id:'v25-sage',name:'V25 · Sage Garden Leaves',src:'/themes/v25/sage-element.svg',tags:['floral','wedding','sage']},
 {id:'v25-rose',name:'V25 · Dusty Rose Lace',src:'/themes/v25/rose-element.svg',tags:['floral','wedding','rose']},
 {id:'v25-celestial',name:'V25 · Celestial Moon Stars',src:'/themes/v25/celestial-element.svg',tags:['cinematic','wedding','royal']},
 {id:'v25-terracotta',name:'V25 · Terracotta Pampas',src:'/themes/v25/terracotta-element.svg',tags:['modern','wedding']},
 {id:'v25-floral-top',name:'V25 · Floral Gold Head Garland',src:'/themes/v25/floral-head.webp',tags:['floral','wedding','royal']},
 {id:'v25-floral-foot',name:'V25 · Floral Gold Foot Garland',src:'/themes/v25/floral-foot.webp',tags:['floral','wedding','royal']},
 {id:'batik-keraton',name:'Batik Keraton Gold',src:'/ornaments/batik-keraton-gold.svg',tags:['batik','adat','wedding','khitan']},
 {id:'peony-blush',name:'Cream Peony Floral',src:'/ornaments/peony-cream-blush.svg',tags:['floral','wedding','aqiqah','birthday']},
 {id:'emerald-arch',name:'Emerald Arabesque',src:'/ornaments/emerald-arabesque-arch.svg',tags:['islamic','syukuran','aqiqah','khitan']},
 {id:'sage-vines',name:'Sage Floating Vines',src:'/ornaments/sage-floating-vines.svg',tags:['floral','cinematic','birthday','party']},
 {id:'songket-minang',name:'Songket Minang Royal',src:'/ornaments/songket-minang-royal.svg',tags:['adat','batik','wedding','party']},
 {id:'blue-mist',name:'Blue Mountain Mist',src:'/ornaments/blue-mountain-mist.svg',tags:['cinematic','modern','wedding','syukuran']},
 {id:'gold-spark',name:'Golden Sparkles',src:'/ornaments/golden-sparkles.svg',tags:['royal','modern','seminar','graduation']},
 {id:'birthday',name:'Pastel Birthday Balloons',src:'/ornaments/birthday-confetti.svg',tags:['playful','birthday','party']},
 {id:'graduation',name:'Graduation Laurel',src:'/ornaments/graduation-laurel.svg',tags:['graduation','modern','royal']},
 {id:'lantern',name:'Emerald Crescent Lantern',src:'/ornaments/crescent-lantern.svg',tags:['islamic','syukuran','aqiqah','khitan']},
 {id:'evergreen',name:'Evergreen Garland',src:'/ornaments/evergreen-garland.svg',tags:['christmas','party']},
 {id:'ribbon',name:'Gala Ribbon',src:'/ornaments/ribbon-gala.svg',tags:['royal','party','birthday','seminar']}
];
const choose = (id) => ORNAMENT_LIBRARY.find(o=>o.id===id);
const makeLayer=(id,position,index)=>{
 const item=choose(id);
 return {id:'built-'+id+'-'+index,kind:'image',src:item.src,scope:position.scope||'cover',x:position.x,y:position.y,size:position.size||105,color:'#c7a46a',effect:position.effect||'sway',speed:position.speed||9,delay:index*230,opacity:position.opacity||85};
};
/** Assign event-matched defaults without touching persisted custom templates. */
export function ornamentPresetForTemplate(template={}){
 const slug=/^v25-([a-z-]+)$/.exec(String(template?.theme||''))?.[1];
 if(!slug||!['ivory','batik','sage','rose','celestial','terracotta'].includes(slug))return [];
 const src='/themes/v25/'+slug+'-element.svg';
 return [
  {id:'v25-left',kind:'image',src,scope:'cover',x:6,y:21,size:52,color:'#c7a46a',effect:'sway',speed:9,delay:0,opacity:48},
  {id:'v25-right',kind:'image',src,scope:'cover',x:94,y:77,size:52,color:'#c7a46a',effect:'float',speed:11,delay:650,opacity:48}
 ];
}

export function isLocalOrnament(path){return ORNAMENT_LIBRARY.some(o=>o.src===path)}
