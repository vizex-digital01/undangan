/** Curated visual matches for each template. Static local files take precedence when installed. */
export const visualThemes = {
 batik:{label:'Royal Batik Blue',icon:'❖'},
 floral:{label:'Cream Peony Garden',icon:'❀'},
 landscape:{label:'Green Watercolor',icon:'❧'},
 islamic:{label:'Islamic Emerald Arch',icon:'☾'},
 birthday:{label:'Birthday Pastel Magic',icon:'✧'},
 graduation:{label:'Graduation Midnight Gold',icon:'✦'},
 royal:{label:'Royal Ivory Gold',icon:'❦'},
 evergreen:{label:'Evergreen Gala',icon:'✶'}
};
export function visualForTemplate(template={}){
 const t=template.theme||'',c=template.category||'',e=template.eventType||'wedding';
 if(e==='birthday'||c==='playful')return 'birthday';
 if(e==='graduation')return 'graduation';
 if(e==='christmas')return 'evergreen';
 if(['aqiqah','syukuran'].includes(e)||c==='islamic')return 'islamic';
 if(e==='khitan'||['batik','adat'].includes(c)||['javanese-blue','mega-mendung','batik-kawung','parang','jawa','minang','sunda','melayu'].includes(t))return 'batik';
 if(c==='floral')return 'floral';
 if(c==='cinematic')return 'landscape';
 if(c==='royal')return 'royal';
 if(e==='seminar')return 'graduation';
 return 'floral';
}
export function motionForVisual(key){
 return ({
 batik:{cover:{effect:'curtain',duration:1350},scroll:{effect:'fade-up',duration:1100,stagger:125},sections:{couple:'slide-left',event:'slide-right',gallery:'zoom'}},
 floral:{cover:{effect:'fade',duration:1250},scroll:{effect:'fade-up',duration:1220,stagger:160},sections:{couple:'zoom',gallery:'zoom'}},
 landscape:{cover:{effect:'zoom',duration:1400},scroll:{effect:'fade-up',duration:1120,stagger:115},sections:{about:'slide-left',gallery:'zoom'}},
 islamic:{cover:{effect:'curtain',duration:1250},scroll:{effect:'fade-up',duration:1100,stagger:120},sections:{quotes:'zoom',about:'zoom'}},
 birthday:{cover:{effect:'zoom',duration:1050},scroll:{effect:'zoom',duration:870,stagger:110},sections:{gallery:'zoom'}},
 graduation:{cover:{effect:'slide',duration:1120},scroll:{effect:'slide-right',duration:940,stagger:110},sections:{gallery:'zoom'}},
 royal:{cover:{effect:'curtain',duration:1450},scroll:{effect:'fade-up',duration:1270,stagger:135},sections:{gallery:'zoom'}},
 evergreen:{cover:{effect:'fade',duration:1180},scroll:{effect:'fade-up',duration:1150,stagger:120},sections:{gallery:'zoom'}}
 })[key]||{};
}
