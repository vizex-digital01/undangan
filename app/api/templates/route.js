import {admin,response,fail} from '@/lib/server';
import {effectiveTemplates} from '@/lib/admin-v13';
export const dynamic='force-dynamic';
export async function GET(){try{return response({templates:(await effectiveTemplates(admin())).filter(t=>t.is_active)})}catch(e){console.error(e);return fail('Katalog sementara tidak tersedia',503)}}
