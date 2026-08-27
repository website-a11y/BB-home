import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
  useReducedMotion,
  animate,
} from "motion/react";
import {
  ArrowUpRight,
  Phone,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Clock,
  Thermometer,
  Bug,
  FileText,
  MapPin,
  Home,
  Tag,
  HardHat,
  Droplets,
  Gauge,
  Building2,
  Sun,
  Play,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Star,
  Quote,
  Plus,
  Minus,
} from "lucide-react";
import bbiLogo from "@/assets/BBI Logo_official (1).avif";
import cmiLogo from "@/assets/cmi-logo0.avif";
import celebrating30 from "@/assets/CELEBRATING 30 YEARS IN BUSINESS.avif";
import heroHome from "@/assets/hero-image-new.jpg";
import inspectorAbout from "@/assets/inspector-about.jpg";
import reportMockup from "@/assets/report-mockup.jpg";
import svcResidential from "@/assets/svc-residential.jpg";
import svcMold from "@/assets/svc-mold.jpg";
import svcPest from "@/assets/pest.jpg";
import svcStucco from "@/assets/svc-stucco.jpg";
import svcCommercial from "@/assets/commerical.jpg";
import svcNewConstruction from "@/assets/svc-new-construction.jpg";
import svcSolar from "@/assets/svc-solar.jpg";

const PHONE = "(281) 730-5286";
const PHONE_HREF = "tel:+12817305286";

// Real Texas state outline (traced from an accurate US map), cropped to its own viewBox.
const TX_VIEWBOX = "448.6 425.2 259.2 254.4";
const TX_PATH =
  "M531.1,433.4l22.7,1.1l31.1,1.1l-2.3,23.5l-0.3,18.2l0.1,2.1l4.3,3.8l1.7,0.8l1.8,0.3l0.7-1.3l0.9,0.9l1.7,0.5l1.6-0.7l1.1,0.4l-0.3,3.4l4.3,1l2.7,0.8l4,0.5l2.2,1.8l3.2-1.6l2.8,0.4l2,2.8l1.1,0.3l-0.2,2l3.1,1.2l2.8-1.8l1.5,0.4l2.4,0.2l0.4,1.9l4.6,2l2.7-0.2l2-4.1h0.3l1.1,1.9l4.4,1l3.3,1.2l3.3,0.8l2.1-0.8l0.8-2.5h3.7l1.9,0.8l3.1-1.6h0.7l0.4,1.1h4.3l2.4-1.3l1.7,0.3l1.4,1.9l2.9,1.7l3.5,1.1l2.7,1.4l2.4,1.6l3.3-0.9l1.9,1l0.5,10.1l0.3,9.7l0.7,9.5l0.5,4l2.7,4.6l1.1,4.1l3.9,6.3l0.5,2.9l0.5,1l-0.7,7.5l-2.7,4.4l1,2.9l-0.4,2.5l-0.8,7.3l-1.4,2.7l0.6,4.4l-5.7,1.6l-9.9,4.5l-1,1.9l-2.6,1.9l-2.1,1.5l-1.3,0.8l-5.7,5.3l-2.7,2.1l-5.3,3.2l-5.7,2.4l-6.3,3.4l-1.8,1.5l-5.8,3.6l-3.4,0.6l-3.9,5.5l-4,0.3l-1,1.9l2.3,1.9l-1.5,5.5l-1.3,4.5l-1.1,3.9l-0.8,4.5l0.8,2.4l1.8,7l1,6.1l1.8,2.7l-1,1.5l-3.1,1.9l-5.7-3.9l-5.5-1.1l-1.3,0.5l-3.2-0.6l-4.2-3.1l-5.2-1.1l-7.6-3.4l-2.1-3.9l-1.3-6.5l-3.2-1.9l-0.6-2.3l0.6-0.6l0.3-3.4l-1.3-0.6l-0.6-1l1.3-4.4l-1.6-2.3l-3.2-1.3l-3.4-4.4l-3.6-6.6l-4.2-2.6l0.2-1.9l-5.3-12.3l-0.8-4.2l-1.8-1.9l-0.2-1.5l-6-5.3l-2.6-3.1v-1.1l-2.6-2.1l-6.8-1.1l-7.4-0.6l-3.1-2.3l-4.5,1.8l-3.6,1.5l-2.3,3.2l-1,3.7l-4.4,6.1l-2.4,2.4l-2.6-1l-1.8-1.1l-1.9-0.6l-3.9-2.3v-0.6l-1.8-1.9l-5.2-2.1l-7.4-7.8l-2.3-4.7v-8.1l-3.2-6.5l-0.5-2.7l-1.6-1l-1.1-2.1l-5-2.1l-1.3-1.6l-7.1-7.9l-1.3-3.2l-4.7-2.3l-1.5-4.4l-2.6-2.9l-1.9-0.5l-0.6-4.7l8,0.7l29,2.7l29,1.6l2.3-23.8l3.9-55.6l1.6-18.7l1.4,0Z";

const SERVICES_MEGA: { label: string; desc: string; icon: typeof ShieldCheck; img: string; tag?: string }[] = [
  { label: "Residential", desc: "Full-home buyer inspections", icon: Home, img: svcResidential },
  { label: "Pre-Listing", desc: "Sell with confidence", icon: Tag, img: svcResidential },
  { label: "New Construction", desc: "Phase & 11-month warranty", icon: HardHat, img: svcNewConstruction },
  { label: "Mold", desc: "Air quality & sampling", icon: Droplets, img: svcMold },
  { label: "Pest", desc: "Termite & rodent", icon: Bug, img: svcPest },
  { label: "Stucco", desc: "EIFS & moisture testing", icon: Gauge, img: svcStucco },
  { label: "Commercial", desc: "PCA reports for investors", icon: Building2, img: svcCommercial },
  { label: "Solar", desc: "Panel & system evaluation", icon: Sun, img: svcSolar },
];

const NAV = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services", mega: true },
  { label: "Sample Report", href: "#sample-report" },
  { label: "Packages", href: "#packages" },
  { label: "Careers", href: "#careers" },
];

/* ────────────────────────────────  COUNT UP  ──────────────────────────────── */
/* Splits a stat like "100K+" / "4.9★" into number + affixes and counts the
   number up every time the stat scrolls into view. */
const STAT_PARTS = /^(\D*)([\d.]+)(.*)$/;

function CountUp({
  value,
  className,
  duration = 1.6,
  delay = 0,
}: {
  value: string;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const parts = value.match(STAT_PARTS);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!parts) return;
    const [, prefix, num, suffix] = parts;
    const target = parseFloat(num);
    const decimals = (num.split(".")[1] ?? "").length;
    const render = (n: number) => setDisplay(`${prefix}${n.toFixed(decimals)}${suffix}`);

    if (reduceMotion) {
      render(target);
      return;
    }
    if (!inView) {
      render(0);
      return;
    }
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: render,
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, duration, delay]);

  if (!parts) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/* ────────────────────────────────  HEADER  ──────────────────────────────── */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-0">
      <div
        className={`${
          pastHero ? "w-[min(1270px,100%)]" : "w-[min(1220px,100%)] hover:w-[min(1270px,100%)]"
        } rounded-2xl bg-[#fbf6ee] border border-black/5 transition-[width,box-shadow] duration-500 ease-out overflow-hidden ${
          scrolled ? "shadow-xl" : "shadow-md"
        }`}
      >
      <div className="flex items-center justify-between h-16 px-6">
        <a href="#top" className="flex items-center gap-3">
          <img src={bbiLogo} alt="Bryan & Bryan Inspections" className="h-10 w-auto" />
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) =>
            item.mega ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="fixed left-1/2 -translate-x-1/2 top-20 pt-4 w-[min(960px,calc(100vw-2rem))]"
                    >
                      <div className="relative rounded-3xl bg-[#fbf6ee]/98 backdrop-blur-2xl border border-border shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] overflow-hidden">
                        {/* accent top bar */}
                        <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,transparent,var(--primary),transparent)] opacity-80" />
                        <div className="grid grid-cols-[260px_minmax(0,1fr)] items-stretch">
                          {/* LEFT — featured preview */}
                          <div className="relative p-4 border-r border-border/60 flex flex-col h-full">
                            <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden">
                              <AnimatePresence mode="wait">
                                <motion.img
                                  key={SERVICES_MEGA[hoverIdx].img}
                                  src={SERVICES_MEGA[hoverIdx].img}
                                  alt={SERVICES_MEGA[hoverIdx].label}
                                  initial={{ opacity: 0, scale: 1.06 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.4, ease: "easeOut" }}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              </AnimatePresence>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                                <div className="eyebrow text-white/70 mb-1.5">Featured</div>
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={SERVICES_MEGA[hoverIdx].label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.25 }}
                                  >
                                    <h4 className="font-display text-2xl leading-tight">
                                      {SERVICES_MEGA[hoverIdx].label}
                                    </h4>
                                    <p className="text-xs text-white/80 mt-1">
                                      {SERVICES_MEGA[hoverIdx].desc}
                                    </p>
                                  </motion.div>
                                </AnimatePresence>
                                <a
                                  href="#services"
                                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-primary transition-colors"
                                >
                                  Learn more <ArrowUpRight className="h-3.5 w-3.5" />
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* RIGHT — service list */}
                          <div className="p-5 min-w-0">
                            <div className="eyebrow text-primary mb-3 px-2">All Services</div>
                            <div className="grid grid-cols-2 gap-1.5">
                              {SERVICES_MEGA.map((s, i) => {
                                const Icon = s.icon;
                                const active = hoverIdx === i;
                                return (
                                  <a
                                    key={s.label}
                                    href="#services"
                                    onMouseEnter={() => setHoverIdx(i)}
                                    className={`group relative flex items-center gap-3 rounded-xl p-2.5 transition-all min-w-0 ${
                                      active ? "bg-primary/8" : "hover:bg-accent"
                                    }`}
                                  >
                                    <div
                                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all ${
                                        active
                                          ? "bg-primary text-primary-foreground border-primary"
                                          : "bg-background border-border text-foreground/70 group-hover:border-primary/40"
                                      }`}
                                    >
                                      <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                                          {s.label}
                                        </span>
                                        {s.tag && (
                                          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                                            {s.tag}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-muted-foreground truncate">
                                        {s.desc}
                                      </div>
                                    </div>
                                    <ArrowUpRight
                                      className={`h-3.5 w-3.5 shrink-0 transition-all ${
                                        active
                                          ? "text-primary translate-x-0.5 -translate-y-0.5"
                                          : "text-muted-foreground/50"
                                      }`}
                                    />
                                  </a>
                                );
                              })}
                            </div>



                            {/* bottom CTA bar */}
                            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-secondary/60 border border-border/60 p-3">
                              <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Phone className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div className="leading-tight">
                                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                    Talk to an inspector
                                  </div>
                                  <a href={PHONE_HREF} className="text-sm font-semibold text-foreground hover:text-primary">
                                    {PHONE}
                                  </a>
                                </div>
                              </div>
                              <a href="#schedule" className="btn-primary text-xs px-3.5 py-2">
                                Schedule <ArrowUpRight className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href={PHONE_HREF} className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            <Phone className="h-4 w-4" />
            {PHONE}
          </a>
          <a href="#schedule" className="btn-primary text-sm px-5 py-2.5">
            Schedule Now <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-accent"
          aria-label="Menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#fbf6ee] border-t border-border overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {NAV.map((n) => (
                <a key={n.label} href={n.href} onClick={() => setMenuOpen(false)} className="py-3 border-b border-border/60 font-medium">
                  {n.label}
                </a>
              ))}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {SERVICES_MEGA.map((s) => (
                  <a key={s.label} href="#services" onClick={() => setMenuOpen(false)} className="text-sm py-2 text-muted-foreground">
                    {s.label}
                  </a>
                ))}
              </div>
              <a href={PHONE_HREF} className="mt-4 btn-ghost">
                <Phone className="h-4 w-4" /> {PHONE}
              </a>
              <a href="#schedule" className="mt-2 btn-primary" onClick={() => setMenuOpen(false)}>
                Schedule Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </header>
  );
}

/* ────────────────────────────────  HERO  ──────────────────────────────── */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative isolate min-h-screen flex items-center pt-32 pb-24 overflow-hidden grain">
      {/* Background photo with scroll parallax */}
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-30">
        <img
          src={heroHome}
          alt="Bryan & Bryan Inspections — modern Texas home"
          width={1920}
          height={1200}
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Mood + legibility overlays — neutral black, no color cast */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-0 -z-20 bg-black/20" />

      {/* Decorative glow orbs */}
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-[120px] -z-10" />
      <div className="absolute bottom-0 -right-24 h-[26rem] w-[26rem] rounded-full bg-primary/15 blur-[140px] -z-10" />

      <motion.div style={{ opacity: contentOpacity }} className="container-x relative z-10 w-full">
        {/* Headline */}
        <div className="text-center mx-auto">
          <motion.h1
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] font-bold tracking-tight text-balance text-white [text-shadow:0_4px_30px_rgba(0,0,0,0.35)]"
          >
            {["Trusted", "Across", "Texas", "·"].map((w, i) => (
              <motion.span
                key={i}
                variants={{ hidden: { y: 40, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
                className="inline-block mr-3"
              >
                {w}
              </motion.span>
            ))}
            <motion.span
              variants={{ hidden: { y: 40, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              className="inline-block relative"
            >
              <span className="italic font-display font-bold text-primary">Since 1994</span>
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.2, duration: 1.2, ease: "easeInOut" }}
                viewBox="0 0 300 20"
                className="absolute -bottom-3 left-0 w-full h-4"
                fill="none"
              >
                <motion.path
                  d="M4 12 C 80 4, 160 20, 296 8"
                  stroke="var(--brand)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.svg>
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 text-base md:text-xl text-white/85 max-w-3xl mx-auto text-balance leading-relaxed"
          >
            Same-day reports, full thermal imaging, and termite checks included on every inspection.
            Move forward with clarity — never costly surprises.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
          >
            <div className="inline-flex items-center gap-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3">
              <img src={celebrating30} alt="30 Years in Business" className="h-16 w-auto" />
              <img src={cmiLogo} alt="Certified Master Inspector" className="h-16 w-auto" />
            </div>
          </motion.div>

          {/* Compact trust pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mt-10 flex justify-center"
          >
            <div className="inline-flex items-center gap-5 md:gap-8 rounded-full border border-black/5 bg-white/90 backdrop-blur-md px-6 md:px-8 py-3 shadow-[var(--shadow-soft)]">
              {[
                { k: "30+", v: "Years" },
                { k: "100K+", v: "Inspections" },
                { k: "4.9★", v: "4,000+ Reviews" },
                { k: "200%", v: "Guarantee" },
              ].map((s, i, arr) => (
                <div key={s.k} className="flex items-center gap-5 md:gap-8">
                  <div className="text-center leading-tight">
                    <CountUp
                      value={s.k}
                      delay={0.85}
                      className="block font-display font-bold text-lg md:text-xl text-ink tabular-nums"
                    />
                    <div className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-ink/60 mt-0.5">
                      {s.v}
                    </div>
                  </div>
                  {i < arr.length - 1 && <span className="h-8 w-px bg-ink/15" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
      >
        <span className="text-[10px] uppercase tracking-[0.24em]">Scroll</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}
/* ────────────────────────────────  TRUST BAR  ──────────────────────────────── */
function TrustBar() {
  const stats = [
    { k: "30+", v: "Years in Business" },
    { k: "100K+", v: "Inspections Completed" },
    { k: "4.9★", v: "4,000+ Reviews" },
    { k: "200%", v: "Guarantee" },
  ];
  return (
    <section className="relative py-16 md:py-20 bg-background">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl border border-border bg-card/80 backdrop-blur-sm shadow-[var(--shadow-soft)] overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,transparent,var(--primary),transparent)]" />
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                className="group px-6 py-10 md:px-10 md:py-14 text-center md:text-left"
              >
                <CountUp
                  value={s.k}
                  className="block font-display font-bold text-4xl md:text-6xl leading-none text-foreground transition-colors group-hover:text-primary tabular-nums"
                />
                <div className="mt-3 text-[11px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {s.v}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


/* ────────────────────────────────  MARQUEE CTA  ──────────────────────────────── */
function CallStrip() {
  const words = ["Same-day reports", "Thermal imaging", "Termite included", "200% guarantee"];
  return (
    <div className="bg-ink text-cream py-6 overflow-hidden">
      <div className="flex whitespace-nowrap marquee gap-16 text-2xl md:text-3xl font-display">
        {[...words, ...words, ...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-16">
            {w}
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────  VIDEO SECTION  ──────────────────────────────── */
function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="py-24 md:py-32 relative">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="eyebrow mb-4">See it in Action</div>
            <h2 className="text-4xl md:text-6xl font-display max-w-2xl text-balance">
              See why thousands of Texas buyers trust us.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Watch a 60-second look inside a real Bryan & Bryan inspection — from attic to slab.
          </p>
        </div>

        <div className="relative rounded-[2rem] overflow-hidden shadow-[var(--shadow-elegant)] group">
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover"
            src="https://video.wixstatic.com/video/71f139_ad9a20d889884335bf0b72943f44fdf0/1080p/mp4/file.mp4"
            playsInline
            controls
            preload="metadata"
            poster={heroHome}
            onClick={toggle}
          />
          {!playing && (
            <button
              onClick={toggle}
              className="absolute inset-0 flex items-center justify-center bg-ink/30 hover:bg-ink/40 transition-colors"
              aria-label="Play video"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[var(--shadow-elegant)]"
              >
                <Play className="h-10 w-10 ml-1" fill="currentColor" />
              </motion.div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────  SERVICES  ──────────────────────────────── */
function Services() {
  const items = [
    { title: "Residential", img: svcResidential, desc: "Comprehensive buyer inspections room-by-room." },
    { title: "Mold", img: svcMold, desc: "Air-quality sampling & moisture intrusion testing." },
    { title: "Pest", img: svcPest, desc: "Termite & wood-destroying insect assessments." },
    { title: "Stucco", img: svcStucco, desc: "EIFS & traditional stucco moisture evaluations." },
    { title: "Commercial", img: svcCommercial, desc: "Property condition assessments for investors." },
  ];

  return (
    <section id="services" className="py-24 md:py-32 bg-secondary/40 grain">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="eyebrow mb-4">What we do</div>
            <h2 className="text-4xl md:text-6xl font-display text-balance">
              Home inspections, <span className="italic text-primary">pest control</span> & more.
            </h2>
          </div>
          <a href="#all-services" className="btn-ghost self-start md:self-end">
            View all services <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((s, i) => (
            <motion.a
              key={s.title}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              className={`group relative rounded-3xl overflow-hidden bg-card border border-border ${
                i === 0 ? "lg:col-span-2 lg:row-span-1" : ""
              }`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? "aspect-[16/9]" : "aspect-[4/5]"} md:aspect-auto md:h-[380px] lg:h-[420px]`}>
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-cream">
                  <div className="eyebrow text-cream/80 mb-2">Service</div>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl">{s.title}</h3>
                      <p className="text-sm text-cream/70 mt-2 max-w-xs">{s.desc}</p>
                    </div>
                    <span className="h-11 w-11 rounded-full bg-primary flex items-center justify-center flex-shrink-0 group-hover:rotate-45 transition-transform duration-500">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────  ABOUT  ──────────────────────────────── */
function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container-x grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden shadow-[var(--shadow-soft)] group">
            <video src="https://video.wixstatic.com/video/af5cfb_2ff3d861832e4fe796e7a369d7b8aaec/1080p/mp4/file.mp4" loop muted playsInline controls className="w-full h-auto" />
            <button className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all duration-300 cursor-pointer" onClick={(e) => { e.currentTarget.closest('.group')?.querySelector('video')?.play(); e.currentTarget.style.display = 'none'; }}>
              <div className="bg-primary rounded-full p-4 hover:scale-110 transition-transform duration-300">
                <Play className="h-8 w-8 text-white fill-white" />
              </div>
            </button>
          </div>
        </motion.div>

        <div>
          <div className="eyebrow mb-4">About Bryan & Bryan</div>
          <h2 className="text-4xl md:text-5xl font-display text-balance leading-[1.05]">
            What you <span className="italic">don't</span> know about a home <span className="text-primary">can cost you.</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Since 1994, Bryan & Bryan has completed thousands of inspections, earning a reputation
            as one of the most trusted names in the industry. Our highly trained inspectors are
            known for being thorough and for explaining everything in a way that actually makes sense.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            With same-day reports, easy-to-read summaries, and tools that help you negotiate repairs,
            you can move forward with clarity and confidence — without worrying about costly
            surprises later.
          </p>

          <p className="mt-8 text-muted-foreground leading-relaxed">
            Within 24 hours after the inspection, you will receive an email with a link to your report. Inspection reports from Bryan & Bryan Inspections are intended to be easy-to-read and to the point. Each aspect of our complete home inspection gets its own page, including full color pictures and color arrows to help pinpoint defects in the photos. We provide one of the best looking reports in the industry and we're confident you'll agree!
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#schedule" className="btn-primary">Schedule Now <ArrowUpRight className="h-4 w-4" /></a>
            <a href="#more" className="btn-ghost">Learn More</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────  WHAT SETS US APART  ──────────────────────────────── */
function WhySetsApart() {
  const features = [
    { icon: Clock, title: "Reports Delivered Same Day", desc: "No waiting. Get your full report before the day ends." },
    { icon: Bug, title: "Termite Inspections Included", desc: "Every single inspection includes a termite check." },
    { icon: Thermometer, title: "Full Home Thermal Imaging", desc: "See what the eye can't — moisture, heat loss, hidden defects." },
    { icon: ShieldCheck, title: "200% Guarantee", desc: "If we miss it, we refund your fee AND pay for a re-inspection." },
  ];
  return (
    <section className="py-24 md:py-32 bg-ink text-cream relative overflow-hidden grain">
      <div className="absolute inset-0 -z-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,_var(--brand)_0%,_transparent_50%),radial-gradient(circle_at_80%_80%,_var(--brand-deep)_0%,_transparent_50%)]" />
      <div className="container-x relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="eyebrow text-primary mb-4">What sets us apart</div>
          <h2 className="text-4xl md:text-6xl font-display text-balance">
            Not all inspections are <span className="italic text-primary">created equal.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group rounded-3xl bg-white/[0.04] border border-white/10 p-8 hover:bg-white/[0.08] transition-colors backdrop-blur-sm"
            >
              <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display mb-2">{f.title}</h3>
              <p className="text-sm text-cream/70 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────  REPORT  ──────────────────────────────── */
function ReportSection() {
  return (
    <section id="report" className="py-24 md:py-32">
      <div className="container-x grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative min-h-[420px] lg:min-h-0"
        >
          <img src={reportMockup} alt="Sample inspection report" loading="lazy" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
          <div className="absolute -top-4 -left-4 rounded-2xl bg-ink text-cream px-4 py-3 shadow-[var(--shadow-soft)]">
            <FileText className="h-5 w-5 inline mr-2 text-primary" />
            <span className="text-sm font-medium">Sample Report</span>
          </div>
        </motion.div>

        <div>
          <div className="eyebrow mb-4">The Report</div>
          <h2 className="text-4xl md:text-5xl font-display text-balance leading-[1.05]">
            The best home inspection <span className="italic text-primary">report</span> in the industry.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            The most meaningful component of any home inspection is the report. Ours are easy to
            read, full color, and detailed enough to help you negotiate — or walk away.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {["Received within 24 hrs", "Detailed room-by-room", "Easy to read", "Full color images"].map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-xl bg-secondary/60 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#" className="btn-primary">View Sample Report <ArrowUpRight className="h-4 w-4" /></a>
            <a href="#schedule" className="btn-ghost">Schedule Now</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────  MORE SERVICES + TEXAS MAP  ──────────────────────────────── */
function MoreServices() {
  // Real percentage positions (derived from actual lat/long) on the accurate Texas outline above
  const locations = [
    { name: "Dallas", x: 73.5, y: 35.9, phone: "(469) 936-7025" },
    { name: "Fort Worth", x: 69.6, y: 36.0, phone: "(469) 936-7025" },
    { name: "Plano", x: 74.2, y: 33.7, phone: "(469) 936-7025" },
    { name: "Austin", x: 66.7, y: 57.9, phone: "(281) 730-5286" },
    { name: "Houston", x: 83.6, y: 62.4, phone: "(281) 484-8318" },
    { name: "Sugar Land", x: 81.8, y: 63.6, phone: "(281) 484-8318" },
    { name: "Pearland", x: 84.2, y: 64.1, phone: "(281) 484-8318" },
    { name: "San Antonio", x: 61.3, y: 65.3, phone: "(281) 730-5286" },
  ];
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % locations.length);
    }, 2600);
    return () => clearInterval(id);
  }, [isPaused, locations.length]);

  return (
    <section className="py-24 md:py-32 bg-secondary/40 relative overflow-hidden">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT — copy + services */}
          <div className="lg:col-span-6">
            <div className="eyebrow mb-4">Statewide Coverage</div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-balance leading-[1.05]">
              One team, <span className="italic text-primary font-medium">every inspection you need.</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Since 1994 we've completed 25,000+ assessments across Texas — one of the state's
              largest home and commercial inspection teams. Wherever you're buying, we're already there.
            </p>

            <div className="mt-8 space-y-1">
              {["Residential", "Mold", "Pest", "Stucco", "Commercial"].map((s, i) => (
                <motion.a
                  key={s}
                  href="#"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-center justify-between py-4 border-b border-border hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground text-xs font-mono">0{i + 1}</span>
                    <span className="font-display font-semibold text-2xl md:text-3xl group-hover:text-primary transition-all">
                      {s}
                    </span>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all" />
                </motion.a>
              ))}
            </div>

            <a href={PHONE_HREF} className="mt-8 inline-flex items-center gap-2 text-primary font-semibold hover:gap-4 transition-all">
              <Phone className="h-4 w-4" /> {PHONE}
            </a>
          </div>

          {/* RIGHT — Texas map */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl bg-card border border-border shadow-[var(--shadow-soft)] p-6 md:p-10 overflow-hidden"
            >
              <div className="absolute inset-0 -z-0 opacity-[0.04] bg-[radial-gradient(circle_at_50%_50%,var(--brand)_0%,transparent_60%)]" />

              <div className="flex items-center justify-between mb-6 relative">
                <div>
                  <div className="eyebrow text-primary">Where we inspect</div>
                  <div className="mt-1 font-display font-bold text-xl">Texas, top to bottom.</div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  {locations.length} office locations
                </div>
              </div>

              <div
                className="relative aspect-[259/254] w-full max-w-[560px] mx-auto"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Texas silhouette — real state outline, geographically accurate */}
                <svg viewBox={TX_VIEWBOX} className="absolute inset-0 w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="tx-fill" x1="0" y1="0" x2="0.6" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.16" />
                      <stop offset="55%" stopColor="var(--brand)" stopOpacity="0.07" />
                      <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.03" />
                    </linearGradient>
                    <filter id="tx-shadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="var(--brand)" floodOpacity="0.28" />
                    </filter>
                  </defs>
                  <path
                    d={TX_PATH}
                    fill="url(#tx-fill)"
                    stroke="var(--brand)"
                    strokeWidth="1.6"
                    strokeOpacity="0.6"
                    strokeLinejoin="round"
                    filter="url(#tx-shadow)"
                  />
                  {/* connecting lines sweeping from the active city to every other */}
                  {locations.map((l, i) => {
                    const from = locations[active];
                    const x1 = 448.6 + (from.x / 100) * 259.2;
                    const y1 = 425.2 + (from.y / 100) * 254.4;
                    const x2 = 448.6 + (l.x / 100) * 259.2;
                    const y2 = 425.2 + (l.y / 100) * 254.4;
                    return (
                      <line
                        key={l.name}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="var(--brand)"
                        strokeWidth="0.5"
                        strokeDasharray="1.6 1.6"
                        opacity={i === active ? 0 : 0.3}
                        className="transition-opacity duration-500"
                      />
                    );
                  })}
                </svg>

                {/* Pins */}
                {locations.map((l, i) => (
                  <button
                    key={l.name}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    style={{ left: `${l.x}%`, top: `${l.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  >
                    <span className="relative flex items-center justify-center">
                      <span
                        className={`absolute h-7 w-7 rounded-full bg-primary/30 ${
                          active === i ? "animate-ping" : ""
                        }`}
                      />
                      <span
                        className={`relative h-3.5 w-3.5 rounded-full border-2 border-card transition-all duration-300 ${
                          active === i ? "bg-primary scale-125" : "bg-foreground/70 group-hover:bg-primary"
                        }`}
                      />
                    </span>
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap text-[11px] font-semibold px-2 py-0.5 rounded-full transition-all duration-300 ${
                        active === i
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-card border border-border text-foreground/80"
                      }`}
                    >
                      {l.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active location detail */}
              <div className="mt-8 flex items-center justify-between rounded-2xl bg-secondary/60 border border-border/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={locations[active].name}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">Now serving</div>
                      <div className="font-semibold text-foreground">{locations[active].name}, TX · {locations[active].phone}</div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <a href="#schedule" className="btn-primary text-xs px-4 py-2">
                  Schedule <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────  GOOGLE ICON  ──────────────────────────────── */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.99 6.99 0 0 1 5.4 12c0-.73.13-1.43.36-2.09V7.07H2.18A11.94 11.94 0 0 0 1 12c0 1.93.46 3.76 1.18 5.35l3.66-3.26z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

/* ────────────────────────────────  REVIEWS  ──────────────────────────────── */
const REVIEWS = [
  {
    name: "Angelica Teachout",
    text: "I have always had a great experience working with Bryan and Bryan, however, the attention to detail on this most recent transaction was phenomenal! You cannot ask for a better combination of professionalism, care, and attention to detail.",
  },
  {
    name: "David De Leon",
    text: "Had a great experience with these fellas. The inspectors were great, very knowledgeable, and the service rep on the phone was incredibly helpful — went out of their way to accommodate my scheduling.",
  },
  {
    name: "Ashley Rodriguez",
    text: "Since the moment I called they were so professional and helpful. Our inspector was so patient and answered all my questions and took his time. Definitely recommend.",
  },
  {
    name: "MiShell M.",
    text: "Our inspector was fantastic! He did a very thorough inspection, and emailed a complete report the same evening.",
  },
  {
    name: "Vivian W.",
    text: "Zachary did a thorough job inspecting the new house we are buying. Thank you Zachary Hernandez from Bryan and Bryan Inspections!",
  },
  {
    name: "Kal F.",
    text: "The guy who came out to help us was super, super sweet and professional — he even caught a tiny leak in the sink!",
  },
];

function StarRow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} fill-primary text-primary`} />
      ))}
    </div>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="py-24 md:py-32 bg-secondary/40 grain">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="eyebrow mb-4 flex items-center justify-center gap-2">
            <GoogleIcon className="h-4 w-4" /> Google Reviews
          </div>
          <h2 className="text-4xl md:text-5xl font-display text-balance leading-[1.05]">
            What Homeowners Are <span className="italic text-primary">Saying</span>
          </h2>
          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            <StarRow className="h-5 w-5" />
            <span className="font-display text-lg leading-none">4.9</span>
            <span className="text-muted-foreground text-sm">out of 5 · 4,000+ Google reviews</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="relative flex flex-col rounded-3xl bg-card border border-border p-7 shadow-[var(--shadow-soft)]"
            >
              <Quote className="h-6 w-6 text-primary/25 mb-3" fill="currentColor" />
              <StarRow />
              <p className="mt-3 text-sm text-foreground/80 leading-relaxed flex-1">"{r.text}"</p>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display font-bold text-sm text-primary">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{r.name}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <GoogleIcon className="h-3 w-3" /> Verified Google Review
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a
            href="https://www.google.com/search?q=bryan+and+bryan+inspections+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Read All Reviews on Google <ArrowUpRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────  FAQ  ──────────────────────────────── */
const FAQS = [
  {
    q: "Why do I need a home inspection?",
    a: "The purchase of a home is one of the biggest investments you'll ever make. A professional inspection helps you spot costly defects before you close, so you can move forward with clarity and confidence.",
  },
  {
    q: "What does a typical inspection cover?",
    a: "Every inspection covers structural elements (foundation, roof, doors, windows) and mechanical systems (HVAC, plumbing, electrical), plus a complimentary Wood Destroying Insect Report.",
  },
  {
    q: "Do you assess the foundation during home inspections?",
    a: "Yes — we're one of the few inspection companies that actually take digital measurements of the foundation for accuracy, rather than relying on a visual check alone.",
  },
  {
    q: "How long does an inspection take?",
    a: "On average, an inspection takes about one hour per 1,000 square feet of the home.",
  },
  {
    q: "Should I be present at the inspection?",
    a: "It's not required, but we always encourage it — being there lets you see issues firsthand and ask questions as we go.",
  },
  {
    q: "When will I receive my report?",
    a: "You'll receive your full, easy-to-read report by 9am the day after your inspection.",
  },
  {
    q: "What if I'm not satisfied with my inspection?",
    a: "We back every inspection with a 200% Satisfaction Guarantee — if you're not happy, we'll refund your fee and pay for a second inspection, up to the cost of the original.",
  },
  {
    q: "Who selects the home inspector?",
    a: "You do. As the home buyer, the choice of inspector is entirely yours.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="eyebrow mb-4">Common Questions</div>
          <h2 className="text-4xl md:text-5xl font-display text-balance leading-[1.05]">
            Frequently Asked <span className="italic text-primary">Questions</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-balance">
            Straight answers about our inspections, reports, and guarantee — so you know exactly what to expect.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-6 items-start">
          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl bg-ink text-cream p-8 md:p-10 shadow-[var(--shadow-elegant)] grain lg:sticky lg:top-28"
          >
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/25 blur-[100px]" />
            <div className="relative">
              <div className="eyebrow mb-4">We're Here to Help</div>
              <h3 className="font-display text-2xl md:text-3xl leading-tight">
                Still have <span className="italic text-primary">questions?</span>
              </h3>
              <p className="mt-4 text-cream/70 text-sm leading-relaxed">
                Our team is happy to walk you through what to expect — before, during, and after your inspection.
              </p>
              <a href={PHONE_HREF} className="mt-7 btn-primary">
                <Phone className="h-4 w-4" /> Call {PHONE}
              </a>
            </div>
          </motion.div>

          {/* Accordion */}
          <div className="space-y-3">
            {FAQS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`rounded-2xl border transition-colors ${isOpen ? "border-primary/30 bg-accent/40" : "border-border bg-card"}`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-medium text-[15px] md:text-base">{item.q}</span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}
                    >
                      {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────  SCHEDULE CTA  ──────────────────────────────── */
function ScheduleCTA() {
  const stats = [
    { k: "30+", v: "Years" },
    { k: "100K+", v: "Inspections" },
    { k: "4.9★", v: "4,000+ Reviews" },
    { k: "200%", v: "Guarantee" },
  ];

  return (
    <section id="schedule" className="py-24 md:py-32 bg-background">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-primary text-primary-foreground shadow-[var(--shadow-elegant)] grain"
        >
          <div className="absolute -top-28 -right-20 h-80 w-80 rounded-full bg-white/15 blur-[110px]" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-black/15 blur-[110px]" />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center p-8 md:p-14">
            <div>
              <div className="eyebrow text-white/80 mb-4">Ready when you are</div>
              <h2 className="text-4xl md:text-6xl font-display text-balance leading-[1.05] text-white">
                Let's get your <span className="italic">inspection</span> on the calendar.
              </h2>
              <p className="mt-5 text-white/85 max-w-md leading-relaxed">
                Same-day reports, full thermal imaging, and a termite check on every visit —
                backed by our 200% satisfaction guarantee.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-8 py-4 font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:scale-[1.03]"
                >
                  <Phone className="h-4 w-4" /> Call {PHONE}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <motion.div
                  key={s.k}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="group rounded-2xl bg-white/10 border border-white/20 p-5 md:p-6 text-center backdrop-blur-sm hover:bg-white/15 transition-all"
                >
                  <CountUp
                    value={s.k}
                    className="block font-display text-2xl md:text-3xl text-white group-hover:scale-110 transition-transform tabular-nums"
                  />
                  <div className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-white/70">{s.v}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────  FOOTER  ──────────────────────────────── */
function Footer() {
  const locations = [
    { addr: "2431 S San Antonio St, Pearland, TX 77581", phone: "(281) 484-8318" },
    { addr: "1704 Meadows Dr, Plano, TX 75074", phone: "(469) 936-7025" },
    { addr: "2101 Citywest Blvd, Houston, TX 77042", phone: "(281) 484-8318" },
    { addr: "1100 NW Loop 410 Ste 700, San Antonio, TX 78213", phone: "(281) 730-5286" },
    { addr: "14090 Southwest Fwy Ste 240, Sugar Land, TX 77478", phone: "(281) 484-8318" },
    { addr: "9600 Great Hills Trl Ste 150, Austin, TX 78759", phone: "(281) 730-5286" },
  ];

  return (
    <footer className="bg-ink text-cream pt-24 pb-8 grain">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-4">
            <img src={bbiLogo} alt="Bryan & Bryan Inspections" className="h-14 w-auto brightness-0 invert mb-6" />
            <p className="text-cream/70 leading-relaxed max-w-sm">
              Trusted Texas home inspections since 1994. Same-day reports, thermal imaging, and
              termite checks included on every inspection.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <img src={celebrating30} alt="30 Years in Business" className="h-16 w-auto" />
              <img src={cmiLogo} alt="Certified Master Inspector" className="h-16 w-auto" />
            </div>
            <div className="mt-8 space-y-2">
              <a href={PHONE_HREF} className="flex items-center gap-2 text-cream/90 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" /> {PHONE}
              </a>
              <a href="mailto:office@inspectorteam.com" className="flex items-center gap-2 text-cream/90 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" /> office@inspectorteam.com
              </a>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="eyebrow text-primary mb-6">Services</div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-cream/80">
              {["Residential", "Pest Services", "Termites", "Stucco Services", "Commercial", "Mold Services", "New Construction", "Packages", "Contact Us"].map((s) => (
                <a key={s} href="#" className="hover:text-primary transition-colors">{s}</a>
              ))}
            </div>
            <div className="eyebrow text-primary mb-6 mt-10">Resources</div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-cream/80">
              {["FAQ", "DIY Videos", "Careers", "Blog", "Sample Report", "Reviews"].map((s) => (
                <a key={s} href="#" className="hover:text-primary transition-colors">{s}</a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="eyebrow text-primary mb-6">Texas Locations</div>
            <ul className="space-y-4 text-sm">
              {locations.map((l) => (
                <li key={l.addr} className="text-cream/80">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <div>
                      <div>{l.addr}</div>
                      <a href={`tel:${l.phone.replace(/[^\d]/g, "")}`} className="text-cream/60 hover:text-primary transition-colors">
                        {l.phone}
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs text-cream/60">
            © 2025 Bryan & Bryan Inspections. TPCL #759610 · TREC #3608. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            {[Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-6 text-[10px] text-cream/40 text-center">
          Privacy Notice · Terms of Service · Accessibility · Texas Real Estate Commission Consumer Protection Notice
        </div>
      </div>
    </footer>
  );
}

/* ──────────────────────────────── PAGE ──────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />

        <CallStrip />
        <VideoSection />
        <Services />
        <About />
        <WhySetsApart />
        <ReportSection />
        <MoreServices />
        <Reviews />
        <FAQSection />
        <ScheduleCTA />
      </main>
      <Footer />
    </div>
  );
}
