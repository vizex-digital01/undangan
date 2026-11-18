// User-supplied music files. Confirm licenses/attribution before commercial publishing.
// Keep IDs stable because the editor stores musicTrack in existing invitation JSON.
export const musicTracks = [
  {id:'andriig',label:'Wedding Music — Andriig',file:'/music/andriig-wedding.mp3',duration:'2:04'},
  {id:'alex-morgan',label:'Ceremony Wedding — Alex Morgan',file:'/music/alex-morgan-ceremony.mp3',duration:'3:00'},
  {id:'vlad-annenkov',label:'Wedding Story — Vlad Annenkov',file:'/music/vlad-annenkov-wedding-story.mp3',duration:'3:22'},
  {id:'sahilmadan',label:'Wedding Invitation — Sahil Madan',file:'/music/sahilmadan-invitation.mp3',duration:'0:33'},
  {id:'leberch',label:'Invitation Wedding — Leberch',file:'/music/leberch-invitation.mp3',duration:'1:50'},
  {id:'strainsofpoise',label:'Jingle of the Night — Strains of Poise',file:'/music/strainsofpoise-jingle.mp3',duration:'1:36'},
  {id:'prettyjohn1',label:'Wedding — Prettyjohn1',file:'/music/prettyjohn1-wedding.mp3',duration:'1:00'}
];
const oldTracks={piano:'/music/piano.wav',gamelan:'/music/gamelan.wav',cinematic:'/music/cinematic.wav'};
export function suggestedMusic(template){
  const theme=template?.theme||'';
  if(['javanese-blue','mega-mendung','batik-kawung','parang','jawa','sunda','minang','melayu'].includes(theme))return 'leberch';
  if(['cream-flowers','sakura','blush','sage','azure','emerald'].includes(theme))return 'andriig';
  if(['green-motion','blue','ocean','moon','autumn'].includes(theme))return 'vlad-annenkov';
  if(['midnight','maroon','gold','peacock'].includes(theme))return 'alex-morgan';
  if(template?.category==='islamic')return 'sahilmadan';
  return 'prettyjohn1';
}
export function resolveMusic(track,template){
  const selected=(track&&track!=='auto')?track:suggestedMusic(template);
  if(selected==='none')return null;
  const known=musicTracks.find(item=>item.id===selected);
  if(known)return known;
  if(oldTracks[selected])return {id:selected,label:selected,file:oldTracks[selected],duration:''};
  return musicTracks[0];
}
