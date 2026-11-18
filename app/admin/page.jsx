import {Suspense} from 'react';
import AdminCenter from '@/components/AdminCenter';
export default function AdminPage(){return <Suspense fallback={<main className="app-page">Memuat panel admin…</main>}><AdminCenter/></Suspense>}
