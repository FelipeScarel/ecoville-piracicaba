import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import AdminSidebar from './AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('ecoville_admin_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar username={payload.username} />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
