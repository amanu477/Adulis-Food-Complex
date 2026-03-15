import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Star, ChevronRight, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const featuredProducts = [
  {
    name: "Adulis Kolo",
    image: "https://superboostup.com/AdulisFarm/wp-content/uploads/2026/02/Kolo-300x300.png",
    desc: "Authentic Ethiopian roasted barley snack. Perfect for coffee time.",
    badge: "Best Seller",
  },
  {
    name: "Adulis Dabo Kolo",
    image: "https://superboostup.com/AdulisFarm/wp-content/uploads/2026/02/Dabo-Kolo-300x300.png",
    desc: "Ethiopian baked bread bites, perfect for a satisfying treat at any time of day.",
    badge: "Fan Favorite",
  },
  {
    name: "Adulis Peanut Butter",
    image: "https://superboostup.com/AdulisFarm/wp-content/uploads/2026/02/Peanut-Butter-300x300.png",
    desc: "Premium creamy peanut butter made from freshly roasted peanuts.",
    badge: "New",
  },
  {
    name: "Adulis Roasted Peanuts",
    image: "https://superboostup.com/AdulisFarm/wp-content/uploads/2026/02/Roasted-Peanut-300x300.png",
    desc: "Freshly roasted crunchy peanuts. A healthy and delicious protein snack.",
    badge: "Popular",
  },
];

const testimonials = [
  {
    text: "As someone who lives abroad, finding the true taste of home is rare. The Beso and Shiro from Adulis Food Complex are game-changers. The packaging is world-class, but the flavor is exactly like my grandmother's kitchen in Addis.",
    author: "Selamawit T.",
    role: "Customer from Diaspora",
  },
  {
    text: "The quality of the Roasted Peanuts and Dabo Kolo is unmatched. You can tell they use premium ingredients — no dust, just perfectly roasted, crunchy perfection. It's my go-to snack for the office.",
    author: "Dawit M.",
    role: "Office Professional",
  },
  {
    text: "We use Adulis spices in our restaurant, and the feedback has been incredible. The 'export-quality' label isn't just marketing; you can see and smell the difference immediately.",
    author: "Tigist B.",
    role: "Restaurant Owner",
  },
];

const stats = [
  { value: 10, suffix: "+", label: "Years of Excellence" },
  { value: 50, suffix: "K+", label: "Families Served" },
  { value: 20, suffix: "+", label: "Premium Products" },
  { value: 15, suffix: "+", label: "Countries Reached" },
];

function CountUpNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const titleAmharic = "አዱሊስ";

  const particleVariants = {
    animate: (i: number) => ({
      y: [0, -20 - Math.random() * 50, 0],
      x: [0, (Math.random() - 0.5) * 50, 0],
      opacity: [0.2, 0.8, 0.2],
      transition: {
        duration: 3 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: i * 0.2,
      },
    }),
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: y1, opacity: opacityHero }}>
          <img
            src="https://superboostup.com/AdulisFarm/wp-content/uploads/2026/02/Gemini_Generated_Image_kbsd93kbsd93kbsd.png"
            alt="Adulis Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-grain" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={particleVariants}
            animate="animate"
            className="absolute w-2 h-2 rounded-full bg-amber-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: "blur(2px)"
            }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-2xl text-white"
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-primary font-medium tracking-widest uppercase text-sm mb-4"
            >
              Premium Ethiopian Food Products
            </motion.p>
            
            <h1 className="font-display text-6xl md:text-8xl font-bold tracking-wide mb-4 text-amber-400 drop-shadow-2xl leading-none flex gap-1">
              {titleAmharic.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 100 }}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-6 leading-tight shimmer-text">
              Nourishing Families,<br />One Meal at a Time.
            </h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-lg text-white/80 mb-10 leading-relaxed max-w-xl"
            >
              From the heart of our complex to your kitchen table. We produce premium quality food
              products crafted with care, purity, and the authentic taste your family loves.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/products">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 rounded-full shadow-[0_0_25px_rgba(194,99,33,0.5)] hover:shadow-[0_0_45px_rgba(194,99,33,0.8)] transition-all hover:-translate-y-1 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    Explore Our Products
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 rounded-full border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:-translate-y-1"
                >
                  Our Story
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-0.5 h-8 bg-white/50 rounded-full"
          />
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section className="bg-primary py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-texture-gradient opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                className="text-center text-white"
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-amber-100 drop-shadow-md">
                  <CountUpNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/90 text-sm mt-2 font-medium tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <section className="py-24 bg-background relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">
              What We Offer
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-5 relative inline-block">
              Our Popular Products
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-primary/30 w-full rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              Discover the favorites that have found a home in kitchens across East Africa.
              Crafted with care to nourish your family.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.15, duration: 0.6, type: "spring", stiffness: 50 }}
                whileHover={{ y: -10, rotateX: 5, rotateY: -5, scale: 1.02 }}
                className="h-full"
              >
                <Card className="h-full border-border/40 bg-card overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(194,99,33,0.3)] hover:border-primary/50 transition-all duration-300">
                  <div className="relative aspect-square bg-gradient-to-b from-muted/50 to-muted/20 overflow-hidden">
                    <span className="absolute top-4 left-4 z-10 text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-full shadow-md">
                      {product.badge}
                    </span>
                    <motion.div 
                      className="w-full h-full p-8"
                      whileHover={{ scale: 1.15 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain filter drop-shadow-xl animate-float-slow"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                  </div>
                  <CardContent className="p-6 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <h3 className="font-display text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{product.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/products">
              <Button variant="outline" size="lg" className="rounded-full border-primary/50 text-primary hover:bg-primary hover:text-white transition-all px-8 group shadow-sm hover:shadow-lg">
                View All Products
                <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TASTE OF HOME */}
      <section className="py-24 bg-muted/30 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative rounded-[2rem] overflow-hidden shadow-2xl group"
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8 }}
                src="https://superboostup.com/AdulisFarm/wp-content/uploads/2026/02/Gemini_Generated_Image_kbsd93kbsd93kbsd-1.png"
                alt="A Taste of Home"
                className="w-full h-full object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 border-4 border-white/20 rounded-[2rem] m-4 pointer-events-none transition-all duration-500 group-hover:scale-95" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="space-y-6"
            >
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-primary font-medium tracking-widest uppercase text-sm"
              >
                Our Heritage
              </motion.p>
              
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
                A Taste of Home
              </h2>
              
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-1 bg-primary rounded-full" 
              />
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                We bridge the gap between modern convenience and traditional taste. Our products are crafted
                to deliver the distinct, earthy flavors of Ethiopia, offering you the comfort of homemade
                snacks without the time-consuming preparation.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every product we make is a tribute to the rich culinary traditions passed down through
                generations — now available to families and communities around the world.
              </p>
              
              <motion.div
                whileHover={{ x: 5 }}
                className="inline-block pt-4"
              >
                <Link href="/about">
                  <Button variant="ghost" className="rounded-full mt-2 text-primary hover:bg-primary/10 hover:text-primary transition-all p-0 group">
                    <span className="border-b border-primary/30 pb-0.5 group-hover:border-primary transition-colors font-semibold">
                      Learn Our Story
                    </span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">
              Testimonials
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground text-lg">
              Trusted by families, businesses, and organizations worldwide.
            </p>
          </motion.div>

          <div className="flex overflow-hidden relative">
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: [0, -1000] }}
              transition={{ 
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
                <div key={idx} className="w-[350px] shrink-0">
                  <Card className="h-full bg-muted/10 border-border/40 hover:border-primary/30 transition-all hover:shadow-[0_10px_30px_rgba(194,99,33,0.1)] hover:-translate-y-2 duration-300">
                    <CardContent className="p-8 flex flex-col h-full relative">
                      <div className="absolute top-4 right-6 text-6xl text-primary/10 font-serif leading-none">"</div>
                      <div className="flex text-primary mb-6 relative z-10">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-foreground/80 italic leading-relaxed flex-grow text-sm relative z-10">
                        "{t.text}"
                      </p>
                      <div className="mt-8 pt-5 border-t border-border/50">
                        <p className="font-display font-bold text-foreground text-lg">{t.author}</p>
                        <p className="text-primary text-xs font-medium uppercase tracking-wider mt-1">{t.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </motion.div>
            
            {/* Fade gradients for edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* CAREERS CTA BANNER */}
      <section className="relative py-32 overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        >
          <img
            src="https://superboostup.com/AdulisFarm/wp-content/uploads/2026/02/Gemini_Generated_Image_kbsd93kbsd93kbsd-3.png"
            alt="Come work with us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/80 backdrop-blur-[2px]" />
          <div className="absolute inset-0 animated-border-gradient opacity-20 mix-blend-overlay" />
        </motion.div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 drop-shadow-lg">
              Come do good with us
            </h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="h-1.5 bg-primary mx-auto mb-8 rounded-full shadow-[0_0_10px_rgba(194,99,33,0.8)]" 
            />
            <p className="text-white/90 text-xl leading-relaxed mb-12 font-medium">
              For many of us, Adulis is more than just a job. It's a place we feel excited to
              come each day because we're part of a family doing good in the world.
              Ready to be part of something meaningful?
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="text-lg px-10 py-7 rounded-full bg-white text-secondary font-bold hover:bg-primary hover:text-white transition-all animate-pulse-glow hover:scale-105"
              >
                Join Our Team
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Floating Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-primary text-white shadow-xl hover:shadow-2xl hover:bg-primary/90 transition-all border-2 border-white/20"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
