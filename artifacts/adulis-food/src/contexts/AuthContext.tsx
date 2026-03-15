import { createContext, useContext, useEffect, useState } from "react";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetMeQueryKey } from "@workspace/api-client-react";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  logout: () => void;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAdmin: false,
  logout: () => {},
  refetch: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading, refetch } = useGetMe({ query: { retry: false } });
  const logoutMutation = useLogout();

  const logout = () => {
    logoutMutation.mutate({ data: undefined } as any, {
      onSuccess: () => {
        queryClient.setQueryData(getGetMeQueryKey(), null);
        queryClient.clear();
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isAdmin: user?.role === "admin",
        logout,
        refetch: () => refetch(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
