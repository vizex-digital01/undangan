import {admin} from '@/lib/server';
import {templateById} from '@/lib/catalog';
import Invitation from '@/components/Invitation';
export const dynamic='force-dynamic';
export default async function PublicInvite({params}){const {slug}=await params;const {data}=await admin().from('invitations').select('template_id,data,status').eq('slug',slug).eq('status','published').maybeSingle();if(!data)return <main className="empty"><h1>Undangan belum tersedia</h1><p>Link ini belum aktif atau belum ditemukan.</p><a href="/">Kembali ke VIZEX</a></main>;const files=data.data.photos||[];const {data:urls}=await admin().storage.from('invite-photos').createSignedUrls(files,3600);return <Invitation data={{...data.data,photos:(urls||[]).map(x=>x.signedUrl).filter(Boolean)}} template={templateById(data.template_id)}/>}
