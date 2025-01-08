"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

// Context Type
interface TenantContextType {
  tenant: any | null;
  loading: boolean;
  error: Error | null;
}

// Create Context
const TenantContext = createContext<TenantContextType>({
  tenant: null,
  loading: true,
  error: null,
});

// Tenant Provider Component
export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tenant, setTenant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const hostname = window.location.hostname.toLowerCase();
        const response = await fetch(`/api/tenants?domain=${hostname}`);
        if (!response.ok) {
          throw new Error("Tenant not found");
        }
        const tenantData = await response.json();
        setTenant(tenantData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
};

// Custom Hook to use Tenant Context
export const useTenant = () => {
  const context = useContext(TenantContext);

  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }

  return context;
};

export default TenantProvider;
