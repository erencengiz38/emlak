import { headers } from 'next/headers';
import { logVisitor } from '@/lib/db';

async function getCityFromIp(ip: string): Promise<string> {
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.')) {
    return 'Localhost';
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}`, { cache: 'no-store' });
    const data = await res.json();
    if (data.status === 'success') {
      return `${data.city}, ${data.country}`;
    }
  } catch (e) {
    // ignore
  }
  return 'Unknown';
}

export default async function Home() {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  let ip = '127.0.0.1';
  
  if (forwardedFor) {
    ip = forwardedFor.split(',')[0].trim();
  } else {
    // Note: Next.js doesn't easily expose remoteAddress in App Router, x-forwarded-for is standard for Vercel.
    const realIp = headersList.get('x-real-ip');
    if (realIp) ip = realIp;
  }
  
  const userAgent = headersList.get('user-agent') || 'Unknown';
  const city = await getCityFromIp(ip);
  
  // Log visitor
  try {
    await logVisitor(ip, city, userAgent);
  } catch (error) {
    console.error("Failed to log visitor:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* 1 saniye sonra YouTube videosuna yönlendirecek meta etiketi */}
      <meta httpEquiv="refresh" content="1;url=https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
      
      <h1 className="text-4xl font-extrabold text-gray-800">
        Yönlendiriliyor...
      </h1>
    </div>
  );
}