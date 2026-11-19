/** Wedding VIZEX v26: 10 new independent background/ornament sets. */
export const weddingV26Templates=[
 {id:"vizex-67",name:"Emerald Keraton",theme:"v26-emerald",tier:"exclusive",description:"Wedding premium Emerald Keraton, ornamen hidup dan animasi cinematic",category:"adat",eventType:"wedding",price:59000},
 {id:"vizex-68",name:"Black Gold Royale",theme:"v26-blackgold",tier:"exclusive",description:"Wedding premium Black Gold Royale, ornamen hidup dan animasi cinematic",category:"royal",eventType:"wedding",price:59000},
 {id:"vizex-69",name:"Lavender Dream",theme:"v26-lavender",tier:"premium",description:"Wedding premium Lavender Dream, ornamen hidup dan animasi cinematic",category:"floral",eventType:"wedding",price:29000},
 {id:"vizex-70",name:"Sakura Romance",theme:"v26-sakura",tier:"luxury",description:"Wedding premium Sakura Romance, ornamen hidup dan animasi cinematic",category:"floral",eventType:"wedding",price:39000},
 {id:"vizex-71",name:"Minang Songket",theme:"v26-songket",tier:"exclusive",description:"Wedding premium Minang Songket, ornamen hidup dan animasi cinematic",category:"adat",eventType:"wedding",price:59000},
 {id:"vizex-72",name:"Ocean Pearl",theme:"v26-ocean",tier:"luxury",description:"Wedding premium Ocean Pearl, ornamen hidup dan animasi cinematic",category:"cinematic",eventType:"wedding",price:39000},
 {id:"vizex-73",name:"Sunset Garden",theme:"v26-sunset",tier:"premium",description:"Wedding premium Sunset Garden, ornamen hidup dan animasi cinematic",category:"floral",eventType:"wedding",price:29000},
 {id:"vizex-74",name:"White Botanical",theme:"v26-botanical",tier:"premium",description:"Wedding premium White Botanical, ornamen hidup dan animasi cinematic",category:"modern",eventType:"wedding",price:29000},
 {id:"vizex-75",name:"Celestial Violet",theme:"v26-violet",tier:"exclusive",description:"Wedding premium Celestial Violet, ornamen hidup dan animasi cinematic",category:"cinematic",eventType:"wedding",price:59000},
 {id:"vizex-76",name:"Tropical Ivory",theme:"v26-tropical",tier:"luxury",description:"Wedding premium Tropical Ivory, ornamen hidup dan animasi cinematic",category:"floral",eventType:"wedding",price:39000},
];
export const WEDDING_V26_SLUGS=["emerald", "blackgold", "lavender", "sakura", "songket", "ocean", "sunset", "botanical", "violet", "tropical"];
export const weddingV26Slug=t=>{const m=/^v26-([a-z]+)$/.exec(String(t?.theme||""));return m&&WEDDING_V26_SLUGS.includes(m[1])?m[1]:"";};
