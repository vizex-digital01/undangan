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
 ['Ocean Whisper','ocean','basic','Ombak laut yang tenang','cinematic']
];
export const templates=variants.map(([name,theme,tier,description,category],i)=>({id:`vizex-${i+1}`,name,theme,tier,description,category,price:packages[tier].price}));
export const templateById=id=>templates.find(x=>x.id===id);
export const starterData={couple1:'Raka',couple2:'Naira',guest:'Tamu Undangan',date:'2027-06-20',time:'09:00',receptionTime:'11:00',place:'The Grand Ballroom',address:'Jakarta, Indonesia',maps:'',quote:'Dua hati, satu kisah, selamanya.',story:'Setiap perjalanan indah dimulai dengan satu pertemuan.',accountName:'',accountNumber:'',rsvpPhone:'',musicTrack:'auto',musicUrl:'',photos:[]};
