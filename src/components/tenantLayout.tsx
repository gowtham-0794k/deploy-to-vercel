"use client";

import useConfig from "hooks/useConfig";
import { useSession } from "next-auth/react";
import React, { createContext, useState, useContext, useEffect } from "react";
import { postAxios } from "shared";
import { USER_ROLES } from "shared/constants/routerUrls";

// Context Type
interface TenantContextType {
  tenant: any | null;
  loading: boolean;
  error: Error | null;
  rolesResponse: any;
}

// Create Context
const TenantContext = createContext<TenantContextType>({
  tenant: null,
  loading: true,
  error: null,
  rolesResponse: [],
});

// Tenant Provider Component
export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tenant, setTenant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [rolesResponse, setRolesResponse] = useState<any>([]);
  const { data: session } = useSession(),
    { rolesAndPermissionsChange } = useConfig();
  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const location = window.location.host;
        const response = await fetch(`/api/tenants?domain=${location}`);
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

  useEffect(() => {
    if (session?.user?.id) {
      const fetchUserRoles = async () => {
        try {
          const userRolesPayload = {
            id: session?.user?.id,
          };
          const userRolesResponse = await postAxios({
            url: USER_ROLES,
            values: userRolesPayload,
          });
          if (!userRolesResponse) {
            throw new Error("Couldn't fetch roles and permissions!");
          }
          const rolesResponse = userRolesResponse?.data?.role;
          rolesAndPermissionsChange(rolesResponse);
          setRolesResponse(rolesResponse);
        } catch (roleError) {
          console.error("Auth Role error:", roleError);
        }
      };
      fetchUserRoles();
    }
  }, [session]);

  return (
    <TenantContext.Provider value={{ tenant, loading, error, rolesResponse }}>
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
