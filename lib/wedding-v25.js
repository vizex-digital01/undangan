/** VIZEX v25 wedding art: 6 independent designs with motion-ready layers. */
export const weddingV25Templates = [
 {id:"vizex-61",name:"Ivory Floral Gold",theme:"v25-ivory",tier:"luxury",description:"Bunga blush, pita chiffon, dan cahaya emas",category:"floral",eventType:"wedding",price:39000},
 {id:"vizex-62",name:"Blue Javanese Royal",theme:"v25-batik",tier:"exclusive",description:"Batik biru, gerbang keraton, dan motif emas",category:"batik",eventType:"wedding",price:59000},
 {id:"vizex-63",name:"Sage Garden Serenity",theme:"v25-sage",tier:"premium",description:"Taman sage, dedaunan melayang, dan floral lembut",category:"floral",eventType:"wedding",price:29000},
 {id:"vizex-64",name:"Dusty Rose Classic",theme:"v25-rose",tier:"premium",description:"Bunga dusty rose, renda, dan pita romantis",category:"floral",eventType:"wedding",price:29000},
 {id:"vizex-65",name:"Navy Celestial Luxe",theme:"v25-celestial",tier:"exclusive",description:"Bulan sabit, lentera bercahaya, dan bintang malam",category:"cinematic",eventType:"wedding",price:59000},
 {id:"vizex-66",name:"Terracotta Rustic Modern",theme:"v25-terracotta",tier:"luxury",description:"Bunga kering, pampas, dan lengkungan tanah liat",category:"modern",eventType:"wedding",price:39000},
];
export const WEDDING_V25_SLUGS = ['ivory','batik','sage','rose','celestial','terracotta'];
export const weddingArtSlug = t => {const m=/^v25-([a-z-]+)$/.exec(String(t?.theme||''));return m && WEDDING_V25_SLUGS.includes(m[1])?m[1]:'';};
