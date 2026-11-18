/** Curated, locally bundled transparent SVG ornaments. No expiring external URLs. */
export const ORNAMENT_LIBRARY = [
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
 const event=template.eventType||'wedding',style=template.category||'floral';
 let ids;
 if(event==='christmas') ids=['evergreen','gold-spark'];
 else if(event==='birthday') ids=['birthday','ribbon'];
 else if(event==='graduation') ids=['graduation','gold-spark'];
 else if(['aqiqah','syukuran'].includes(event)) ids=['emerald-arch','lantern'];
 else if(event==='khitan') ids=['batik-keraton','lantern'];
 else if(event==='seminar') ids=['gold-spark','ribbon'];
 else if(style==='batik') ids=['batik-keraton','songket-minang'];
 else if(style==='adat') ids=['songket-minang','batik-keraton'];
 else if(style==='islamic') ids=['emerald-arch','lantern'];
 else if(style==='floral') ids=['peony-blush','sage-vines'];
 else if(style==='cinematic') ids=['blue-mist','sage-vines'];
 else if(style==='royal') ids=['gold-spark','ribbon'];
 else if(style==='playful') ids=['birthday','gold-spark'];
 else ids=['sage-vines','gold-spark'];
 const first=ids[0]==='blue-mist'?{x:50,y:88,size:345,scope:'cover',effect:'float',opacity:56}:ids[0]==='graduation'?{x:50,y:13,size:145,scope:'cover',effect:'sway',opacity:74}:{x:10,y:12,size:120,scope:'cover',effect:'sway',opacity:82};
 const second={x:91,y:83,size:106,scope:'cover',effect:'float',opacity:73};
 const third=ids[0]==='blue-mist'?{x:50,y:90,size:350,scope:'content',effect:'float',opacity:37}:{x:10,y:14,size:91,scope:'content',effect:'float',opacity:43};
 return [makeLayer(ids[0],first,0),makeLayer(ids[1],second,1),makeLayer(ids[0],third,2)];
}
export function isLocalOrnament(path){return ORNAMENT_LIBRARY.some(o=>o.src===path)}
