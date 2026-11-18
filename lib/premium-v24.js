/** Curated image-based visual themes. Static local files, no remote links. */
export const premiumTemplates = [
 {id:'vizex-52',name:"Celestial Blue Heritage",theme:'v24-celestial',tier:'exclusive',description:"Wedding Batik navy emas dengan ilustrasi premium",category:'batik',eventType:'wedding',price:59000},
 {id:'vizex-53',name:"Little Moon",theme:'v24-little-moon',tier:'premium',description:"Aqiqah sage dan bulan sabit yang lembut",category:'islamic',eventType:'aqiqah',price:29000},
 {id:'vizex-54',name:"Nusantara Indigo",theme:'v24-indigo',tier:'premium',description:"Khitanan dengan batik indigo modern",category:'batik',eventType:'khitan',price:29000},
 {id:'vizex-55',name:"Safari Wonderland",theme:'v24-safari',tier:'premium',description:"Ulang tahun anak bertema safari watercolor",category:'playful',eventType:'birthday',price:29000},
 {id:'vizex-56',name:"Academic Night",theme:'v24-academic',tier:'luxury',description:"Wisuda akademik navy dan gold",category:'royal',eventType:'graduation',price:39000},
 {id:'vizex-57',name:"Future Spectrum",theme:'v24-future',tier:'premium',description:"Seminar profesional midnight navy electric blue",category:'modern',eventType:'seminar',price:29000},
 {id:'vizex-58',name:"Earth & Gratitude",theme:'v24-earth',tier:'premium',description:"Syukuran warna terracotta olive",category:'islamic',eventType:'syukuran',price:29000},
 {id:'vizex-59',name:"Velvet Night",theme:'v24-velvet',tier:'luxury',description:"Gala Dinner beludru burgundy gold",category:'royal',eventType:'party',price:39000},
 {id:'vizex-60',name:"Midnight Countdown",theme:'v24-midnight',tier:'luxury',description:"Perayaan tahun baru dengan kilau emas",category:'cinematic',eventType:'christmas',price:39000}
];
export const premiumThemeSlugs = ["celestial", "little-moon", "indigo", "safari", "academic", "future", "earth", "velvet", "midnight"];
export function premiumArtSlug(t){const s=String(t?.theme||'');return premiumThemeSlugs.includes(s.slice(4))&&s.startsWith('v24-')?s.slice(4):'';}
export function premiumArtwork(t,kind='art'){const slug=premiumArtSlug(t);return slug?`/themes/v24/${slug}-${kind}.webp`:'';}
