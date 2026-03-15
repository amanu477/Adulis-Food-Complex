import { createContext, useContext } from "react";
import { useGetCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";

interface CartContextValue {
  count: number;
  invalidate: () => void;
}

const CartContext = createContext<CartContextValue>({ count: 0, invalidate: () => {} });

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: cartItems } = useGetCart({
    query: { queryKey: getGetCartQueryKey(), enabled: !!user, retry: false },
  });

  const count = cartItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });

  return (
    <CartContext.Provider value={{ count, invalidate }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
