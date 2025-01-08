import type { Metadata } from 'next';
import './globals.css';

// Providers
import { SessionProvider } from 'next-auth/react';
import { TenantProvider } from '../components/tenantLayout';
import ProviderWrapper from 'store/ProviderWrapper';

// Dynamic Metadata Generation
export async function generateMetadata(): Promise<Metadata> {
  // Fetch tenant data server-side (you'll implement this)
  const tenant = await fetchTenantMetadata();
  
  return {
    title: tenant?.name ? `${tenant.name} - Dashboard` : 'Tenant Application',
    description: tenant?.description || 'Tenant-based application',
    icons: {
      icon: tenant?.favicon || '/default-favicon.ico'
    }
  };
}

// Server-side tenant metadata fetch (mock implementation)
async function fetchTenantMetadata() {
  // In a real-world scenario, this would be an API call or database query
  const tenantMap = {
    'localhost': {
      name: 'Demo Tenant',
      description: 'Default tenant dashboard',
      favicon: '/demo-favicon.ico'
    },
    'tenantA.localhost': {
      name: 'Tenant A',
      description: 'Tenant A specific dashboard',
      favicon: '/tenantA-favicon.ico'
    }
  };

  // Get current hostname (works in server-side context)
  const hostname = process.env.NEXT_PUBLIC_VERCEL_URL ?? 'demo.localhost';
  
  return tenantMap[hostname as keyof typeof tenantMap] || null;
}

// Root Layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <TenantProvider>
            <ProviderWrapper>
              {children}
            </ProviderWrapper>
          </TenantProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
