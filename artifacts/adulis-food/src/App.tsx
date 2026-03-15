import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Products from "./pages/Products";
import ContactUs from "./pages/ContactUs";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

function RouteWrapper({ component: Component }: { component: React.ComponentType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-grow flex flex-col"
    >
      <Component />
    </motion.div>
  );
}

const PAGES_WITHOUT_FOOTER = ["/admin"];
const PAGES_WITHOUT_NAV = ["/admin"];

function AnimatedRoutes() {
  const [location] = useLocation();
  const hideFooter = PAGES_WITHOUT_FOOTER.includes(location);
  const hideNav = PAGES_WITHOUT_NAV.includes(location);

  return (
    <>
      {!hideNav && <Navigation />}
      <main className={`flex-grow flex flex-col relative z-10 ${!hideNav ? "pt-20" : ""}`}>
        <AnimatePresence mode="wait">
          <Switch location={location} key={location}>
            <Route path="/" component={() => <RouteWrapper component={Home} />} />
            <Route path="/about" component={() => <RouteWrapper component={AboutUs} />} />
            <Route path="/products" component={() => <RouteWrapper component={Products} />} />
            <Route path="/contact" component={() => <RouteWrapper component={ContactUs} />} />
            <Route path="/shop" component={() => <RouteWrapper component={Shop} />} />
            <Route path="/cart" component={() => <RouteWrapper component={Cart} />} />
            <Route path="/orders" component={() => <RouteWrapper component={Orders} />} />
            <Route path="/login" component={() => <RouteWrapper component={Login} />} />
            <Route path="/register" component={() => <RouteWrapper component={Register} />} />
            <Route path="/admin" component={() => <RouteWrapper component={Admin} />} />
            <Route component={() => <RouteWrapper component={NotFound} />} />
          </Switch>
        </AnimatePresence>
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen bg-grain">
                <AnimatedRoutes />
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
