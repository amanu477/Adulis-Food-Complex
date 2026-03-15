import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { HeartHandshake, ShieldCheck, Leaf, Baby, Wheat, PackageOpen, ArrowRight, Target, Eye, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  { title: "Fortified Baby Food", icon: Baby, desc: "Nutrient-rich formulas designed for healthy early childhood development across East Africa." },
  { title: "Baking Ingredients", icon: Wheat, desc: "Premium grade flours, grains, and ingredients for bakeries and families." },
  { title: "Wholesome Snacks", icon: PackageOpen, desc: "Traditional Ethiopian flavors packed with modern quality and hygiene standards." },
  { title: "Relief Products", icon: HeartHandshake, desc: "Specialized nutrition products for humanitarian organizations and relief efforts." },
  { title: "Quality Assurance", icon: ShieldCheck, desc: "Rigorous testing at every step guaranteeing the highest safety standards." },
  { title: "Sustainable Sourcing", icon: Leaf, desc: "Ethical partnerships with local farmers for a better, greener future." },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To provide authentic, hygienic, and delicious products that honor our culinary heritage while meeting modern standards of quality — nourishing families from Ethiopia to the world.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    text: "To become the leading Ethiopian food brand globally, bringing the warmth of Ethiopian tradition to every kitchen table — whether in Addis Ababa or across the diaspora.",
  },
  {
    icon: Users,
    title: "Our People",
    text: "We are a family of passionate food craftspeople, nutritionists, and community advocates united by a shared love for Ethiopian heritage and a commitment to nourishing lives.",
  },
];

export default function AboutUs() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="flex flex-col min-h-screen">

      {/* PAGE HERO */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y }}>
          <img
            src="https://superboostup.com/AdulisFarm/wp-content/uploads/2026/02/Gemini_Generated_Image_kbsd93kbsd93kbsd-2.png"
            alt="About Adulis"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/60" />
          <div className="absolute inset-0 bg-grain" />
        </motion.div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-primary font-bold tracking-widest uppercase text-sm mb-4"
            >
              Our Story
            </motion.p>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 overflow-hidden relative">
              <motion.span 
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.2, ease: [0.8, 0, 0.2, 1], delay: 0.2 }}
                className="block"
              >
                Who is Adulis Food?
              </motion.span>
            </h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-1.5 bg-primary mx-auto mb-8 rounded-full" 
            />
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-xl text-white/85 leading-relaxed max-w-2xl mx-auto"
            >
              We are dedicated to bringing the heart of Ethiopian tradition to your table — a premier food
              processing company built on heritage, quality, and community.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* MAIN ABOUT */}
      <section className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
                About Us
              </p>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                Rooted in Ethiopian<br />Tradition & Heritage
              </h2>
              <div className="w-20 h-1 bg-primary mb-8 rounded-full" />
              <div className="space-y-5 text-muted-foreground leading-relaxed text-lg">
                <p>
                  We are a premier food processing company specializing in high-quality roasted grains,
                  snacks, and pantry essentials. Our mission is simple: to provide authentic, hygienic,
                  and delicious products that honor our culinary heritage while meeting modern standards of quality.
                </p>
                <p>
                  Adulis Food Complex is a nutritional leader in fortified baby food, wholesome snacks,
                  baking ingredients, and humanitarian relief products. We provide these essentials to
                  humanitarian organizations, bakeries, retailers, and families across East Africa.
                </p>
                <p>
                  From nutritional expertise to quality assurance to sustainable sourcing — our value-added
                  services are an essential ingredient in our partners' impact on communities across the region.
                </p>
              </div>
              <Link href="/products">
                <Button size="lg" className="mt-8 rounded-full px-8 hover:-translate-y-1 transition-all group">
                  See Our Products
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative"
            >
              <div className="rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] group relative">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700" />
                <img
                  src="https://superboostup.com/AdulisFarm/wp-content/uploads/2026/02/Gemini_Generated_Image_kbsd93kbsd93kbsd-1.png"
                  alt="Adulis Food Products"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
              </div>
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute -bottom-8 -right-8 bg-primary text-white p-8 rounded-3xl shadow-[0_20px_40px_rgba(194,99,33,0.3)] z-20"
              >
                <div className="text-5xl font-display font-bold mb-1">10+</div>
                <div className="text-white/90 text-sm font-medium uppercase tracking-wider">Years of Excellence</div>
              </motion.div>
              
              {/* Decorative elements behind image */}
              <div className="absolute -z-10 -top-6 -left-6 w-full h-full border-2 border-primary/20 rounded-[2rem]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decorative Timeline Line */}
      <div className="w-full h-px bg-border relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rounded-full bg-primary" />
      </div>

      {/* MISSION / VISION / PEOPLE */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-texture-gradient opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">What Drives Us</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">Our Core Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                >
                  <Card className="h-full border-0 relative group bg-card hover:-translate-y-2 transition-all duration-500 rounded-2xl overflow-hidden shadow-lg">
                    {/* Animated Border Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10 p-[2px]">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-shimmer rounded-2xl" />
                    </div>
                    <div className="absolute inset-[2px] bg-card rounded-[14px] z-0" />
                    
                    <CardContent className="p-8 flex flex-col items-start relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <Icon strokeWidth={1.5} className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">{v.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{v.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Decorative Timeline Line */}
      <div className="w-full h-px bg-border relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rounded-full bg-secondary" />
      </div>

      {/* SERVICES */}
      <section className="py-24 bg-background relative">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-20 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">What We Do</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-5">Our Services</h2>
            <p className="text-muted-foreground text-lg">
              From nutritional expertise to quality assurance to sustainable sourcing and more, our
              value-added services are an essential ingredient in our partners' impact.
            </p>
          </motion.div>

          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
                  }}
                >
                  <Card className="group hover:-translate-y-1 transition-all duration-300 border-border/40 bg-card hover:shadow-xl hover:border-primary/30 h-full relative overflow-hidden">
                    {/* Subtle hover background highlight */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -translate-y-full translate-x-full group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                    
                    <CardContent className="p-8 flex gap-5 items-start relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-foreground shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                        <Icon strokeWidth={1.5} className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CAREERS SECTION */}
      <section className="relative py-32 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute inset-0"
        >
          <img
            src="https://superboostup.com/AdulisFarm/wp-content/uploads/2026/02/Gemini_Generated_Image_kbsd93kbsd93kbsd-3.png"
            alt="Join Our Team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/85 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-texture-gradient opacity-30 mix-blend-overlay" />
        </motion.div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Careers</p>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 drop-shadow-md">
              Come do good with us
            </h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="h-1.5 bg-primary mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(194,99,33,0.5)]" 
            />
            <p className="text-xl text-white/90 leading-relaxed mb-12 font-medium">
              For many of us, Adulis is more than just a job. It's a place we feel excited to
              come each day because we're part of a family doing good in the world.
              Ready to be part of something meaningful?
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="text-lg px-10 py-7 rounded-full bg-white text-secondary font-bold hover:bg-primary hover:text-white transition-all animate-pulse-glow hover:scale-105"
              >
                Get in Touch
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
