import {weddingV26Templates} from './wedding-v26';
import {weddingV25Templates} from './wedding-v25';
import {premiumTemplates} from './premium-v24';
export const packages={basic:{name:'Basic Elegant',price:19000},premium:{name:'Premium',price:29000},luxury:{name:'Luxury',price:39000},exclusive:{name:'Exclusive',price:59000}};
const variants=[
 ['Valley of Blue','blue','luxury','Lanskap biru watercolor','cinematic'],
 ['Ivory Palace','ivory','exclusive','Istana ivory dan emas','royal'],
 ['Emerald Grace','emerald','luxury','Taman emerald elegan','floral'],
 ['Midnight Royale','midnight','exclusive','Nuansa malam nan megah','royal'],
 ['Blush Romance','blush','premium','Taman mawar pastel','floral'],
 ['Golden Vows','gold','exclusive','Emas klasik megah','royal'],
 ['Sage Serenity','sage','premium','Botanical sage modern','floral'],
 ['Sakura Dream','sakura','premium','Sakura yang berjatuhan','floral'],
 ['Moonlight Story','moon','luxury','Langit malam berbintang','cinematic'],
 ['Maroon Velvet','maroon','luxury','Beludru marun klasik','royal'],
 ['Azure Bloom','azure','basic','Langit biru dan bunga','floral'],
 ['Minimal Muse','minimal','basic','Editorial putih bersih','modern'],
 ['Batik Kawung','batik-kawung','premium','Geometri kawung Jawa','batik'],
 ['Mega Mendung','mega-mendung','luxury','Batik Cirebon biru','batik'],
 ['Parang Kencana','parang','luxury','Batik parang emas','batik'],
 ['Java Heritage','jawa','exclusive','Warisan budaya Jawa','adat'],
 ['Minang Pusaka','minang','exclusive','Ornamen songket Minang','adat'],
 ['Sunda Sekar','sunda','premium','Bunga dan pesona Sunda','adat'],
 ['Melayu Songket','melayu','luxury','Songket Melayu klasik','adat'],
 ['Islamic Majesty','islamic','premium','Lengkung arsitektur islami','islamic'],
 ['Andalusian Arch','andalus','luxury','Arabesque Andalusia','islamic'],
 ['Royal Peacock','peacock','exclusive','Biru merak dan emas','royal'],
 ['Autumn Promise','autumn','basic','Daun musim gugur','cinematic'],
 ['Ocean Whisper','ocean','basic','Ombak laut yang tenang','cinematic'],
 ['Biru Keraton','javanese-blue','exclusive','Batik biru dan emas dengan animasi gerbang','batik'],
 ['Cream Peony','cream-flowers','premium','Floral klasik pastel yang menari','floral'],
 ['Green Horizon','green-motion','luxury','Pegunungan watercolor dan daun bergerak','cinematic']
];
// ``category`` stays the visual animation style for compatibility with v14-v17.
// ``eventType`` controls which invitation fields and sections are presented.
const otherEvents=[
 ['Birthday Confetti','birthday-confetti','premium','Pesta ulang tahun ceria, balon dan konfeti','birthday','playful'],
 ['Pastel Dream Party','birthday-pastel','basic','Undangan ulang tahun pastel lembut','birthday','floral'],
 ['Golden Birthday','birthday-gold','luxury','Perayaan usia dengan ornamen emas','birthday','royal'],
 ['Kids Safari','birthday-safari','premium','Tema hewan safari yang ceria','birthday','playful'],
 ['Aqiqah Emerald','aqiqah-emerald','premium','Syukuran aqiqah dengan arch hijau','aqiqah','islamic'],
 ['Little Blessing','aqiqah-cream','basic','Tasyakuran kelahiran bernuansa cream','aqiqah','floral'],
 ['Tasmiyah Moon','aqiqah-moon','luxury','Bulan sabit dan ornamen lembut','aqiqah','islamic'],
 ['Khitan Heritage','khitan-batik','premium','Khitan bernuansa batik Jawa','khitan','batik'],
 ['Khitan Blue Star','khitan-blue','basic','Biru modern untuk tasyakuran khitan','khitan','modern'],
 ['Khitan Gold','khitan-gold','luxury','Tasyakuran elegan dan gold','khitan','royal'],
 ['Graduation Night','grad-night','luxury','Wisuda navy gold eksklusif','graduation','royal'],
 ['Graduation Bloom','grad-blush','premium','Wisuda floral dan modern','graduation','floral'],
 ['School Memories','grad-sage','basic','Kelulusan hijau sage yang hangat','graduation','modern'],
 ['Seminar Executive','seminar-navy','premium','Seminar formal navy dan ivory','seminar','modern'],
 ['Conference Black Gold','seminar-black','exclusive','Konferensi hitam emas profesional','seminar','royal'],
 ['Workshop Creative','seminar-coral','basic','Workshop kreatif yang energik','seminar','playful'],
 ['Syukuran Senja','syukuran-sage','basic','Syukuran keluarga dalam hijau sage','syukuran','islamic'],
 ['Doa Bersama','syukuran-mosque','premium','Majelis doa dan syukuran bernuansa islami','syukuran','islamic'],
 ['Housewarming Warmth','syukuran-terracotta','premium','Syukuran rumah baru yang hangat','syukuran','modern'],
 ['Dinner Gala','dinner-maroon','luxury','Malam gala berkelas marun emas','party','royal'],
 ['Garden Party','party-garden','premium','Pesta kebun bernuansa segar','party','floral'],
 ['Sweet Seventeen','party-lavender','premium','Perayaan sweet seventeen lavender','party','playful'],
 ['Christmas Evergreen','xmas-evergreen','premium','Undangan perayaan Natal klasik','christmas','floral'],
 ['New Year Spark','newyear-midnight','luxury','Malam pergantian tahun penuh cahaya','christmas','cinematic']
];
export const eventCategories=[
 {id:'all',label:'Semua Acara',icon:'✦',description:'Semua momen spesial'},
 {id:'wedding',label:'Wedding',icon:'♡',description:'Pernikahan & lamaran'},
 {id:'birthday',label:'Ulang Tahun',icon:'🎂',description:'Anak dan dewasa'},
 {id:'aqiqah',label:'Aqiqah & Tasmiyah',icon:'☾',description:'Kelahiran buah hati'},
 {id:'khitan',label:'Khitanan',icon:'❖',description:'Tasyakuran khitan'},
 {id:'graduation',label:'Wisuda',icon:'🎓',description:'Kelulusan & sekolah'},
 {id:'seminar',label:'Seminar & Event',icon:'◈',description:'Acara resmi'},
 {id:'syukuran',label:'Syukuran & Islami',icon:'✧',description:'Doa & kajian'},
 {id:'party',label:'Party & Dinner',icon:'✳',description:'Acara dan perayaan'},
 {id:'christmas',label:'Natal & Tahun Baru',icon:'✶',description:'Perayaan akhir tahun'}
];
export const templates=[
 ...variants.map(([name,theme,tier,description,category],i)=>({id:`vizex-${i+1}`,name,theme,tier,description,category,eventType:'wedding',price:packages[tier].price})),
 ...otherEvents.map(([name,theme,tier,description,eventType,category],i)=>({id:`vizex-${i+28}`,name,theme,tier,description,category,eventType,price:packages[tier].price})),
 ...premiumTemplates,
 ...weddingV25Templates,
 ...weddingV26Templates
];
export const templateById=id=>templates.find(x=>x.id===id);
export const starterData={couple1:'Raka',couple2:'Naira',guest:'Tamu Undangan',date:'2027-06-20',time:'09:00',receptionTime:'11:00',place:'The Grand Ballroom',address:'Jakarta, Indonesia',maps:'',quote:'Dua hati, satu kisah, selamanya.',story:'Setiap perjalanan indah dimulai dengan satu pertemuan.',accountName:'',accountNumber:'',rsvpPhone:'',musicTrack:'auto',musicUrl:'',photos:[],eventTitle:'',celebrant:'',organizer:'',eventSubtitle:'',dressCode:'',agenda:''};

export const eventInfo={
 wedding:{label:'Wedding',defaultTitle:'The Wedding Of',celebrant:'Raka & Naira',subtitle:'Merayakan kisah cinta'},
 birthday:{label:'Ulang Tahun',defaultTitle:'Birthday Celebration',celebrant:'Aira',subtitle:'Rayakan hari bahagia bersama'},
 aqiqah:{label:'Aqiqah & Tasmiyah',defaultTitle:'Aqiqah & Tasmiyah',celebrant:'Muhammad Zaid',subtitle:'Syukuran kelahiran buah hati'},
 khitan:{label:'Khitanan',defaultTitle:'Tasyakuran Khitan',celebrant:'Rayyan',subtitle:'Doa dan syukur bersama keluarga'},
 graduation:{label:'Wisuda',defaultTitle:'Graduation Celebration',celebrant:'Nadia Putri',subtitle:'Akhir perjalanan, awal mimpi baru'},
 seminar:{label:'Seminar & Event',defaultTitle:'Seminar Inspirasi',celebrant:'Creative Future 2027',subtitle:'Bersama merancang masa depan'},
 syukuran:{label:'Syukuran & Islami',defaultTitle:'Tasyakuran & Doa Bersama',celebrant:'Keluarga Bahagia',subtitle:'Dengan penuh rasa syukur'},
 party:{label:'Party & Dinner',defaultTitle:'An Evening To Remember',celebrant:'Gala Night',subtitle:'An unforgettable evening'},
 christmas:{label:'Natal & Tahun Baru',defaultTitle:'Holiday Celebration',celebrant:'New Year Gathering',subtitle:'Celebrate the season together'}
};
export function starterForTemplate(template){
 if(template?.theme==='v24-midnight')return {...starterData,couple1:'',couple2:'',eventTitle:'Undangan Tahun Baru',celebrant:'New Year Gathering 2027',date:'2026-12-31',organizer:'Panitia Acara',eventSubtitle:'Malam pergantian tahun',place:'Lokasi perayaan',address:'Jakarta, Indonesia'};
 if(template?.theme==='v24-velvet')return {...starterData,couple1:'',couple2:'',eventTitle:'Gala Dinner',celebrant:'An Evening to Remember',organizer:'Panitia Acara',eventSubtitle:'Malam penuh kenangan'};
 if(template?.theme==='v24-future')return {...starterData,couple1:'',couple2:'',eventTitle:'Undangan Seminar',celebrant:'Creative Future 2027',organizer:'Panitia Seminar',eventSubtitle:'Bersama membangun masa depan'};
 const type=template?.eventType||'wedding';if(type==='wedding')return {...starterData};
 const e=eventInfo[type]||eventInfo.party;
 return {...starterData,couple1:'',couple2:'',eventTitle:e.defaultTitle,celebrant:e.celebrant,organizer:'Keluarga & Sahabat',eventSubtitle:e.subtitle,place:'Aula Serbaguna',address:'Jakarta, Indonesia',quote:'Kehadiran dan doa Anda akan melengkapi kebahagiaan kami.',story:'Mari berbagi kebahagiaan bersama pada momen spesial ini.',agenda:'Pembukaan, acara inti, ramah tamah',dressCode:'Bebas rapi',accountNumber:''};
}
