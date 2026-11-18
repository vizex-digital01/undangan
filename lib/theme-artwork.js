/** VIZEX v23 art direction: individual design identities, not one recolored oval frame. */
export const visualThemes = {
  'heritage':{label:'Keraton Blue',icon:'✦',layout:'heritage'},
  'floral':{label:'Cream Peony',icon:'✦',layout:'botanical'},
  'landscape':{label:'Green Horizon',icon:'✦',layout:'landscape'},
  'islamic':{label:'Andalusian Arch',icon:'✦',layout:'islamic'},
  'minimal':{label:'Modern Muse',icon:'✦',layout:'minimal'},
  'sakura':{label:'Sakura Whisper',icon:'✦',layout:'botanical'},
  'ocean':{label:'Ocean Tide',icon:'✦',layout:'landscape'},
  'royal':{label:'Royal Ivory',icon:'✦',layout:'luxe'},
  'midnight':{label:'Midnight Vows',icon:'✦',layout:'luxe'},
  'birthday':{label:'Confetti Pop',icon:'✳',layout:'playful'},
  'safari':{label:'Safari Wonderland',icon:'✳',layout:'playful'},
  'birthday-gold':{label:'Golden Birthday',icon:'✳',layout:'luxe'},
  'aqiqah':{label:'Little Moon',icon:'☾',layout:'baby'},
  'aqiqah-green':{label:'Little Blessing',icon:'☾',layout:'baby'},
  'khitan':{label:'Indigo Heritage',icon:'❖',layout:'heritage'},
  'khitan-blue':{label:'Blue Star',icon:'❖',layout:'modern'},
  'graduation':{label:'Academic Night',icon:'✧',layout:'graduation'},
  'grad-floral':{label:'Graduation Bloom',icon:'✧',layout:'graduation'},
  'seminar':{label:'Future Spectrum',icon:'◈',layout:'tech'},
  'seminar-black':{label:'Summit Noir',icon:'◈',layout:'tech'},
  'seminar-creative':{label:'Creative Talks',icon:'◈',layout:'tech'},
  'syukuran':{label:'Earth & Gratitude',icon:'❧',layout:'botanical'},
  'gala':{label:'Velvet Night',icon:'✦',layout:'luxe'},
  'garden':{label:'Garden Gathering',icon:'✦',layout:'botanical'},
  'evergreen':{label:'Evergreen Holiday',icon:'✶',layout:'luxe'},
  'newyear':{label:'Midnight Countdown',icon:'✶',layout:'luxe'}
};
export function visualForTemplate(t={}){
 const e=t.eventType||'wedding',p=String(t.theme||''),c=t.category||'';
 const v24={'v24-celestial':'heritage','v24-little-moon':'aqiqah','v24-indigo':'khitan','v24-safari':'safari','v24-academic':'graduation','v24-future':'seminar','v24-earth':'syukuran','v24-velvet':'gala','v24-midnight':'newyear'};
 if(v24[p])return v24[p];
 if(e==='birthday')return /safari/.test(p)?'safari':/gold/.test(p)?'birthday-gold':'birthday';
 if(e==='aqiqah')return /emerald/.test(p)?'aqiqah-green':'aqiqah';
 if(e==='khitan')return /blue/.test(p)?'khitan-blue':/gold/.test(p)?'royal':'khitan';
 if(e==='graduation')return /blush|sage/.test(p)?'grad-floral':'graduation';
 if(e==='seminar')return /coral/.test(p)?'seminar-creative':/black/.test(p)?'seminar-black':'seminar';
 if(e==='syukuran')return /mosque/.test(p)?'islamic':'syukuran';
 if(e==='party')return /garden/.test(p)?'garden':/lavender/.test(p)?'birthday':'gala';
 if(e==='christmas')return /newyear/.test(p)?'newyear':'evergreen';
 if(/minimal/.test(p))return 'minimal';
 if(/sakura/.test(p))return 'sakura';
 if(/ocean/.test(p))return 'ocean';
 if(/valley|green-motion|autumn/.test(p))return 'landscape';
 if(/midnight|moon|maroon/.test(p))return 'midnight';
 if(/ivory|royal|gold|peacock/.test(p))return 'royal';
 if(/islamic|andalus/.test(p)||c==='islamic')return 'islamic';
 if(/batik|javanese|mendung|parang|jawa|minang|sunda|melayu/.test(p)||['batik','adat'].includes(c))return 'heritage';
 return 'floral';
}
export function layoutForTemplate(t={}){return visualThemes[visualForTemplate(t)]?.layout||'botanical'}
export function motionForVisual(key){
 const layout=visualThemes[key]?.layout||'botanical';
 const profiles={
  heritage:['curtain',1220,'slide-right',960,100],botanical:['fade',1190,'fade-up',1070,125],landscape:['zoom',1330,'fade-up',1100,140],
  islamic:['curtain',1290,'fade-up',1050,140],minimal:['fade',980,'fade-up',860,90],luxe:['curtain',1350,'fade-up',1050,130],
  playful:['zoom',930,'zoom',850,90],baby:['fade',1250,'fade-up',1030,135],modern:['slide',1050,'slide-right',850,105],
  graduation:['slide',1250,'fade-up',950,110],tech:['slide',1020,'slide-right',820,100]};
 const [effect,duration,scrollEffect,scrollDuration,stagger]=profiles[layout]||profiles.botanical;
 return {cover:{effect,duration},scroll:{effect:scrollEffect,duration:scrollDuration,stagger},sections:{about:'fade-up',quotes:'fade-up',couple:'fade-up',agenda:layout==='tech'?'slide-left':'fade-up',event:'fade-up',location:'slide-right',gallery:'zoom',rsvp:'fade-up',ending:'fade-up',gift:'fade-up'}};
}
