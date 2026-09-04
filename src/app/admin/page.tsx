import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getLogs } from '@/lib/db';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin_auth');

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  let logs: any[] = [];
  try {
    logs = await getLogs();
  } catch (error) {
    console.error("Failed to fetch logs:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
        <div className="font-bold text-xl">Admin Paneli</div>
        {/* We can do logout simply by clearing the cookie, but for simplicity a client component can do it or just a button */}
        <div className="text-sm">Yönetici Oturumu Açık</div>
      </nav>

      <main className="container mx-auto mt-8 px-4 flex-grow">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Ziyaretçi Logları</h2>
          <p className="text-gray-500 mb-6">Siteye giren kullanıcıların IP, tarih ve şehir bilgileri.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 border-b border-gray-200">#ID</th>
                  <th className="p-3 border-b border-gray-200">Tarih / Saat</th>
                  <th className="p-3 border-b border-gray-200">IP Adresi</th>
                  <th className="p-3 border-b border-gray-200">Şehir / Konum</th>
                  <th className="p-3 border-b border-gray-200 hidden md:table-cell">Tarayıcı (User-Agent)</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 border-b border-gray-200 text-gray-600">{log.id}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-600">
                        {new Date(log.visit_time).toLocaleString('tr-TR')}
                      </td>
                      <td className="p-3 border-b border-gray-200 text-gray-600 font-mono text-sm">{log.ip_address}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-600">{log.city}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-500 text-sm hidden md:table-cell max-w-xs truncate" title={log.user_agent}>
                        {log.user_agent}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      Henüz ziyaretçi kaydı bulunmuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
