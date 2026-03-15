import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Phone, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useContact, contactSchema, type ContactInput } from "@/hooks/use-contact";
import { useTranslation } from "react-i18next";

function DotsPattern() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
      backgroundImage: "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)",
      backgroundSize: "24px 24px"
    }} />
  );
}

export default function ContactUs() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const contactMutation = useContact();
  const [isSuccess, setIsSuccess] = useState(false);
  const inquiryTypes = t("contact.inquiryTypes", { returnObjects: true }) as string[];
  const [activeInquiry, setActiveInquiry] = useState(inquiryTypes[0]);

  useEffect(() => {
    setActiveInquiry(inquiryTypes[0]);
  }, [t]);

  const contactInfo = [
    {
      icon: MapPin,
      title: t("contact.ourLocation"),
      lines: t("contact.locationLines", { returnObjects: true }) as string[],
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Mail,
      title: t("contact.emailUs"),
      lines: ["hello@adulisfood.com", "sales@adulisfood.com"],
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Phone,
      title: t("contact.callUs"),
      lines: ["+251 (0) 911 000 000", t("contact.callHours")],
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Clock,
      title: t("contact.businessHours"),
      lines: t("contact.businessHoursLines", { returnObjects: true }) as string[],
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  function onSubmit(data: ContactInput) {
    const payload = {
      ...data,
      message: `[Inquiry Type: ${activeInquiry}]\n\n${data.message}`
    };

    contactMutation.mutate(payload, {
      onSuccess: () => {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          form.reset();
        }, 5000);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: t("contact.failedTitle"),
          description: t("contact.failedDesc"),
        });
      },
    });
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* PAGE HERO */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://superboostup.com/AdulisFarm/wp-content/uploads/2026/02/Gemini_Generated_Image_kbsd93kbsd93kbsd.png"
            alt="Contact Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/60" />
          <div className="absolute inset-0 bg-grain" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-primary font-bold tracking-widest uppercase text-sm mb-4 bg-primary/20 inline-block px-4 py-1.5 rounded-full border border-primary/30"
            >
              {t("contact.badge")}
            </motion.p>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 drop-shadow-md">{t("contact.heroTitle")}</h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="h-1.5 bg-primary mx-auto mb-8 rounded-full shadow-[0_0_10px_rgba(194,99,33,0.5)]" 
            />
            <p className="text-xl text-white/90 leading-relaxed font-light">
              {t("contact.heroDesc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="py-20 bg-muted/40 relative">
        <DotsPattern />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4, delay: idx * 0.1 }}
                >
                  <Card className="h-full border-0 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <CardContent className="p-8 flex flex-col items-start gap-5">
                      <div className={`w-14 h-14 rounded-2xl ${info.bg} flex items-center justify-center ${info.color} group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm`}>
                        <Icon strokeWidth={1.5} className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground mb-3">{info.title}</h3>
                        {info.lines.map((line, i) => (
                          <p key={i} className="text-muted-foreground text-sm leading-relaxed">{line}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-40 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
                {t("contact.sendMessage")}
              </p>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight"
                style={{ whiteSpace: "pre-line" }}>
                {t("contact.lovedToHear")}
              </h2>
              <div className="w-24 h-1.5 bg-primary mb-8 rounded-full" />
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>{t("contact.formDesc1")}</p>
                <p>{t("contact.formDesc2")}</p>
              </div>

              <div className="mt-10">
                <h4 className="font-display font-bold text-foreground mb-4 text-xl">{t("contact.inquiryType")}</h4>
                <div className="flex flex-wrap gap-3">
                  {inquiryTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveInquiry(type)}
                      type="button"
                      className={`px-5 py-2.5 text-sm rounded-full border transition-all duration-300 ${
                        activeInquiry === type 
                        ? "border-primary bg-primary text-white shadow-md scale-105" 
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-12 rounded-3xl overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500" />
                <img
                  src="https://superboostup.com/AdulisFarm/wp-content/uploads/2026/02/Gemini_Generated_Image_kbsd93kbsd93kbsd-1.png"
                  alt="Adulis Food"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="border-0 shadow-2xl bg-card rounded-[2rem] overflow-hidden relative">
                
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, delay: 0.1 }}
                      >
                        <CheckCircle2 className="w-24 h-24 text-primary mb-6 drop-shadow-md" />
                      </motion.div>
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-display font-bold text-foreground mb-3"
                      >
                        {t("contact.successTitle")}
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground text-lg"
                      >
                        {t("contact.successDesc")}
                      </motion.p>
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full bg-primary"
                          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                          animate={{ 
                            x: (Math.random() - 0.5) * 400, 
                            y: (Math.random() - 0.5) * 400, 
                            opacity: 0,
                            scale: Math.random() * 2 + 1
                          }}
                          transition={{ duration: 1 + Math.random(), ease: "easeOut", delay: 0.1 }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <CardContent className="p-8 md:p-12 relative z-10">
                  <h3 className="text-3xl font-display font-bold text-foreground mb-8">{t("contact.sendMessage")}</h3>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                              <FormLabel className="text-foreground font-semibold">{t("contact.fullName")}</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Input
                                    placeholder={t("contact.namePlaceholder")}
                                    {...field}
                                    className="h-14 bg-muted/50 border-transparent focus-visible:ring-0 focus-visible:border-primary/50 transition-all rounded-xl px-5 text-base peer"
                                  />
                                  <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 peer-focus:opacity-100 scale-105 peer-focus:scale-100 transition-all duration-300 pointer-events-none" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                              <FormLabel className="text-foreground font-semibold">{t("contact.emailAddress")}</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="email"
                                    placeholder={t("contact.emailPlaceholder")}
                                    {...field}
                                    className="h-14 bg-muted/50 border-transparent focus-visible:ring-0 focus-visible:border-primary/50 transition-all rounded-xl px-5 text-base peer"
                                  />
                                  <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 peer-focus:opacity-100 scale-105 peer-focus:scale-100 transition-all duration-300 pointer-events-none" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-semibold">{t("contact.yourMessage")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Textarea
                                  placeholder={t("contact.messagePlaceholder")}
                                  className="min-h-[180px] resize-y bg-muted/50 border-transparent focus-visible:ring-0 focus-visible:border-primary/50 transition-all rounded-xl p-5 text-base peer"
                                  {...field}
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 peer-focus:opacity-100 scale-[1.02] peer-focus:scale-100 transition-all duration-300 pointer-events-none" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full text-lg py-7 rounded-xl shadow-[0_4px_14px_rgba(194,99,33,0.3)] hover:shadow-[0_6px_20px_rgba(194,99,33,0.5)] transition-all hover:-translate-y-1 group overflow-hidden relative"
                        disabled={contactMutation.isPending}
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          {contactMutation.isPending ? (
                            <>
                              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                              {t("contact.sending")}
                            </>
                          ) : (
                            <>
                              <Send className="mr-3 h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              {t("contact.send")}
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      </Button>
                      <p className="text-muted-foreground text-sm text-center font-medium">
                        {t("contact.privacy")}
                      </p>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
