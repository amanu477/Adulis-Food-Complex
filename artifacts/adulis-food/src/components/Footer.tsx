import { Link } from "wouter";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "am" : "en");
  };

  return (
    <footer className="bg-foreground text-background pt-16 pb-8 border-t-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2 space-y-5">
            <img
              src="https://superboostup.com/AdulisFarm/wp-content/uploads/2026/01/logo-removebg-preview.png"
              alt="Adulis Food Complex"
              className="h-16 w-auto brightness-0 invert"
            />
            <p className="text-background/70 max-w-sm leading-relaxed text-sm">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-3 text-sm font-medium text-background/50">
              <button
                onClick={toggleLanguage}
                className={`cursor-pointer hover:text-white transition-colors ${i18n.language === "en" ? "text-primary" : "text-background/50"}`}
              >
                English
              </button>
              <span>|</span>
              <button
                onClick={toggleLanguage}
                className={`cursor-pointer hover:text-white transition-colors ${i18n.language === "am" ? "text-primary" : "text-background/50"}`}
              >
                አማርኛ
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-5 text-white">{t("footer.quickLinks")}</h4>
            <ul className="space-y-3 text-background/70 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">{t("footer.links.home")}</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">{t("footer.links.about")}</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">{t("footer.links.products")}</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">{t("footer.links.contact")}</Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">{t("footer.sitemap")}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-5 text-white">{t("footer.contact")}</h4>
            <ul className="space-y-4 text-background/70 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span style={{ whiteSpace: "pre-line" }}>{t("footer.location")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:hello@adulisfood.com" className="hover:text-primary transition-colors">
                  hello@adulisfood.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+251 (0) 911 000 000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-sm">{t("footer.copyright")}</p>
          <div className="flex gap-6 text-background/40 text-sm">
            <a href="#" className="hover:text-primary transition-colors">{t("footer.terms")}</a>
            <a href="#" className="hover:text-primary transition-colors">{t("footer.privacy")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
