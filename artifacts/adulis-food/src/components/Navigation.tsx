import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, Package } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Contact Us", href: "/contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [location] = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const { user, isAdmin, logout } = useAuth();
  const { count: cartCount } = useCart();

  const isHomePage = location === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  const transparent = isHomePage && !isScrolled;

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[60]" style={{ scaleX }} />
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          transparent
            ? "bg-transparent py-5"
            : "bg-background/90 backdrop-blur-xl shadow-sm border-b border-border/50 py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="https://superboostup.com/AdulisFarm/wp-content/uploads/2026/01/logo-removebg-preview.png"
                alt="Adulis Food Complex Logo"
                className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
              />
              <span className={`font-display text-xl font-bold hidden sm:block transition-colors duration-300 ${transparent ? "text-white drop-shadow-md" : "text-foreground"}`}>
                Adulis Food Complex
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium relative group px-1 py-2 ${
                      transparent
                        ? isActive ? "text-primary drop-shadow-md" : "text-white/90 hover:text-white drop-shadow-sm"
                        : isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavUnderline"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {!isActive && (
                      <span className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 w-0 group-hover:w-full opacity-0 group-hover:opacity-50" />
                    )}
                  </Link>
                );
              })}

              {/* Cart */}
              <Link href="/cart" className="relative">
                <button className={`p-2 rounded-full transition-colors ${transparent ? "text-white hover:bg-white/10" : "text-foreground/70 hover:bg-muted"}`}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* User menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-full transition-colors ${
                      transparent ? "text-white bg-white/10 hover:bg-white/20" : "text-foreground bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span className="max-w-[80px] truncate">{user.name?.split(" ")[0] ?? "User"}</span>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-border/50 overflow-hidden"
                      >
                        {isAdmin && (
                          <Link href="/admin">
                            <button className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition text-left">
                              <LayoutDashboard className="h-4 w-4 text-purple-500" /> Admin Panel
                            </button>
                          </Link>
                        )}
                        <Link href="/orders">
                          <button className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition text-left">
                            <Package className="h-4 w-4 text-primary" /> My Orders
                          </button>
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-red-50 text-red-600 transition text-left border-t"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <button className={`text-sm font-medium px-3 py-2 rounded-full transition-colors ${transparent ? "text-white hover:bg-white/10" : "text-foreground/70 hover:text-foreground"}`}>
                      Sign In
                    </button>
                  </Link>
                  <Link href="/shop">
                    <Button size="sm" className="rounded-full shadow-[0_4px_14px_rgba(194,99,33,0.3)] hover:shadow-[0_6px_20px_rgba(194,99,33,0.5)] transition-all duration-300 hover:-translate-y-0.5">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile buttons */}
            <div className="md:hidden flex items-center gap-2">
              <Link href="/cart" className="relative">
                <button className={`p-2 rounded-full ${transparent ? "text-white" : "text-foreground"}`}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
              <button
                className={`p-2 rounded-full backdrop-blur-md transition-colors ${transparent ? "text-white bg-black/20" : "text-foreground bg-muted"}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`block font-medium p-3 rounded-xl transition-colors ${
                        location === link.href ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t pt-2 space-y-1">
                  {user ? (
                    <>
                      {isAdmin && (
                        <Link href="/admin">
                          <button className="w-full text-left p-3 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-50 transition flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4" /> Admin Panel
                          </button>
                        </Link>
                      )}
                      <Link href="/orders">
                        <button className="w-full text-left p-3 rounded-xl text-sm font-medium hover:bg-muted transition flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" /> My Orders
                        </button>
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left p-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <button className="w-full text-left p-3 rounded-xl text-sm font-medium hover:bg-muted transition">Sign In</button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full rounded-xl">Create Account</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
