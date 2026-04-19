import { useEffect, useState, useRef } from "react";

// ─── SVG: Islamic geometric ornament ──────────────────────────────────────
const IslamicPattern = ({ className = "", opacity = 0.08 }: { className?: string; opacity?: number }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style={{ opacity }}>
    <defs>
      <pattern id="islamic-star" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="hsl(var(--gold))" strokeWidth="0.8">
          <polygon points="60,10 70,40 100,40 76,58 86,90 60,72 34,90 44,58 20,40 50,40" />
          <circle cx="60" cy="60" r="30" />
          <circle cx="60" cy="60" r="18" />
          <path d="M60 30 L60 90 M30 60 L90 60 M40 40 L80 80 M80 40 L40 80" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamic-star)" />
  </svg>
);

// ─── SVG: Ornamental divider ──────────────────────────────────────────────
const OrnamentDivider = () => (
  <div className="ornament-divider">
    <span className="block h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-gold/60 to-gold/60" />
    <svg width="32" height="32" viewBox="0 0 32 32" className="text-gold">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <polygon points="16,2 20,12 30,12 22,18 25,28 16,22 7,28 10,18 2,12 12,12" />
        <circle cx="16" cy="16" r="3" fill="currentColor" />
      </g>
    </svg>
    <span className="block h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-gold/60 to-gold/60" />
  </div>
);

// ─── Hook: Reveal on scroll ───────────────────────────────────────────────
const useReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

// ─── Hook: Animated counter ───────────────────────────────────────────────
const useCounter = (target: number, duration = 1800) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(1)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
};

// ─── Component: Sticky Navbar ─────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#rooms", label: "Номера" },
    { href: "#features", label: "Удобства" },
    { href: "#reviews", label: "Отзывы" },
    { href: "#bukhara", label: "О Бухаре" },
    { href: "#contact", label: "Контакты" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-navy-deep/85 backdrop-blur-xl border-b border-gold/15 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#hero" className="font-serif text-xl md:text-2xl tracking-[0.2em] text-ivory">
          VAVILON <span className="text-gold-gradient">PLAZA</span>
        </a>
        <ul className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-xs uppercase tracking-[0.2em] text-ivory/70 hover:text-gold transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-500 hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="https://wa.me/998973018088?text=Здравствуйте!%20Хочу%20забронировать%20номер%20в%20Vavilon%20Plaza%20Hotel"
          target="_blank"
          rel="noreferrer"
          className="hidden lg:inline-flex btn-gold-outline"
        >
          Бронь
        </a>

        {/* Mobile burger */}
        <button
          aria-label="Меню"
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
        >
          <span className={`block h-px w-7 bg-gold transition-all duration-500 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-px w-7 bg-gold transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-px w-7 bg-gold transition-all duration-500 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-0 top-0 bg-navy-deep/98 backdrop-blur-xl transition-all duration-700 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ paddingTop: "80px" }}
      >
        <ul className="flex flex-col items-center gap-8 py-12">
          {links.map((l, i) => (
            <li
              key={l.href}
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: menuOpen ? `${i * 80}ms` : "0ms", animationFillMode: "forwards" }}
            >
              <a
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-3xl text-ivory hover:text-gold transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="mt-6">
            <a
              href="https://wa.me/998973018088"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
              className="btn-gold"
            >
              Забронировать
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

// ─── Component: Hero ──────────────────────────────────────────────────────
const Hero = () => {
  const slogans = [
    { lang: "RU", text: "Где история встречает комфорт" },
    { lang: "UZ", text: "Tarix qulaylik bilan uchrashgan joyda" },
    { lang: "EN", text: "Where history meets comfort" },
  ];
  const [idx, setIdx] = useState(0);
  const [parallax, setParallax] = useState(0);
  const rating = useCounter(4.8);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % slogans.length), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setParallax(window.scrollY * 0.4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Parallax ornament background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${parallax}px)` }}
      >
        <IslamicPattern className="absolute inset-0 w-full h-full" opacity={0.07} />
      </div>

      {/* Glowing radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.12) 0%, transparent 60%)" }}
      />

      {/* Rotating ornament accent */}
      <div className="absolute -top-40 -right-40 w-96 h-96 opacity-20 animate-ornament-spin pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full text-gold">
          <g fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="70" />
            <circle cx="100" cy="100" r="50" />
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="100" y1="100"
                x2={100 + 90 * Math.cos((i * Math.PI) / 6)}
                y2={100 + 90 * Math.sin((i * Math.PI) / 6)}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Top label */}
        <div className="animate-fade-up flex items-center justify-center gap-3 mb-8" style={{ animationDelay: "0.2s" }}>
          <span className="h-px w-12 bg-gold/50" />
          <span className="text-xs uppercase tracking-[0.4em] text-gold">4★ Heritage Hotel</span>
          <span className="h-px w-12 bg-gold/50" />
        </div>

        {/* Logo */}
        <h1
          className="animate-fade-up font-serif text-6xl md:text-8xl lg:text-9xl leading-none mb-4 text-ivory"
          style={{ animationDelay: "0.4s" }}
        >
          <span className="block">VAVILON</span>
          <span className="block text-gold-gradient italic font-light">Plaza</span>
        </h1>

        <p
          className="animate-fade-up text-sm md:text-base tracking-[0.5em] uppercase text-gold/80 mb-12"
          style={{ animationDelay: "0.7s" }}
        >
          Bukhara · Est. 2018
        </p>

        <OrnamentDivider />

        {/* Rotating slogan */}
        <div className="h-16 md:h-20 flex items-center justify-center mb-10 mt-4">
          {slogans.map((s, i) => (
            <p
              key={s.lang}
              className={`absolute font-serif italic text-2xl md:text-4xl lg:text-5xl text-ivory transition-all duration-1000 ${
                i === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="text-xs not-italic align-top text-gold mr-2 tracking-widest">{s.lang}</span>
              {s.text}
            </p>
          ))}
        </div>

        {/* Rating */}
        <div className="animate-fade-up flex items-center justify-center gap-3 mb-12" style={{ animationDelay: "1s" }}>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.075 9.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
              </svg>
            ))}
          </div>
          <span className="text-2xl font-serif text-ivory">{rating.toFixed(1)}</span>
          <span className="text-xs uppercase tracking-widest text-ivory/50">/ 5.0</span>
        </div>

        {/* CTA */}
        <a
          href="https://wa.me/998973018088?text=Здравствуйте!%20Хочу%20забронировать%20номер%20в%20Vavilon%20Plaza%20Hotel"
          target="_blank"
          rel="noreferrer"
          className="animate-fade-up btn-gold inline-flex"
          style={{ animationDelay: "1.2s" }}
        >
          <span>Забронировать</span>
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in-slow" style={{ animationDelay: "2s" }}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.4em] text-ivory/40">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
};

// ─── Component: Booking Form ──────────────────────────────────────────────
const BookingForm = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Здравствуйте! Хочу забронировать номер в Vavilon Plaza Hotel.%0AЗаезд: ${checkIn || "—"}%0AВыезд: ${checkOut || "—"}%0AГости: ${guests}`;
    window.open(`https://wa.me/998973018088?text=${msg}`, "_blank");
  };

  return (
    <section className="relative -mt-16 z-20 px-6 md:px-12 reveal">
      <form
        onSubmit={handleBook}
        className="max-w-6xl mx-auto bg-ivory text-navy-deep shadow-elegant"
        style={{ boxShadow: "var(--shadow-elegant)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gold/20">
          <div className="p-6 md:p-8">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-gold-deep mb-2 font-medium">Заезд</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent font-serif text-lg text-navy-deep focus:outline-none"
            />
          </div>
          <div className="p-6 md:p-8">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-gold-deep mb-2 font-medium">Выезд</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent font-serif text-lg text-navy-deep focus:outline-none"
            />
          </div>
          <div className="p-6 md:p-8">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-gold-deep mb-2 font-medium">Гости</label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-transparent font-serif text-lg text-navy-deep focus:outline-none"
            >
              <option value="1">1 гость</option>
              <option value="2">2 гостя</option>
              <option value="3">3 гостя</option>
              <option value="4">4 гостя</option>
            </select>
          </div>
          <button
            type="submit"
            className="relative bg-navy-deep text-ivory hover:bg-navy transition-all duration-500 group overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-gold to-gold-deep opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center justify-center h-full px-6 py-8 text-xs uppercase tracking-[0.3em] font-medium group-hover:text-navy-deep transition-colors duration-500">
              Проверить цены →
            </span>
          </button>
        </div>
      </form>
    </section>
  );
};

// ─── Component: Rooms ─────────────────────────────────────────────────────
const Rooms = () => {
  const rooms = [
    {
      name: "Стандарт",
      nameEn: "Standard",
      price: 85,
      desc: "Уютный номер с видом на старый город. Идеален для коротких визитов.",
      amenities: ["1 кровать Queen", "22 м²", "Кондиционер", "Мини-бар"],
    },
    {
      name: "Делюкс",
      nameEn: "Deluxe",
      price: 120,
      desc: "Просторный номер с восточным декором, шёлковыми тканями и панорамным окном.",
      amenities: ["1 кровать King", "32 м²", "Зона отдыха", "Премиум-туалетные принадлежности"],
      featured: true,
    },
    {
      name: "Люкс",
      nameEn: "Suite",
      price: 180,
      desc: "Двухкомнатный люкс с террасой. Завтрак подаётся в номер.",
      amenities: ["Гостиная + спальня", "55 м²", "Терраса", "Завтрак в номер"],
    },
  ];

  return (
    <section id="rooms" className="section-pad relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center reveal mb-20">
          <span className="text-xs uppercase tracking-[0.4em] text-gold mb-4 block">Наши номера</span>
          <h2 className="font-serif text-5xl md:text-7xl text-ivory mb-6">
            Каждый номер — <span className="italic text-gold-gradient">история</span>
          </h2>
          <OrnamentDivider />
          <p className="max-w-2xl mx-auto text-ivory/70 mt-6 font-light">
            Восточная роскошь, ручная работа местных мастеров и комфорт мирового класса.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rooms.map((room, i) => (
            <article
              key={room.name}
              className={`card-luxe p-8 md:p-10 reveal flex flex-col ${room.featured ? "md:-translate-y-4" : ""}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Badge */}
              <div className="absolute top-6 right-6 px-3 py-1 border border-gold/40 text-[10px] uppercase tracking-widest text-gold">
                Завтрак включён
              </div>

              {/* Room visual */}
              <div className="relative h-48 mb-8 overflow-hidden bg-navy-deep">
                <IslamicPattern className="absolute inset-0 w-full h-full" opacity={0.15} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-6xl text-gold-gradient italic">
                    {room.nameEn[0]}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>

              <span className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">{room.nameEn}</span>
              <h3 className="font-serif text-3xl text-ivory mb-3">{room.name}</h3>
              <p className="text-ivory/60 text-sm mb-6 font-light leading-relaxed">{room.desc}</p>

              <ul className="space-y-2 mb-8 flex-grow">
                {room.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-3 text-ivory/70 text-sm">
                    <span className="w-1 h-1 bg-gold rounded-full" />
                    {a}
                  </li>
                ))}
              </ul>

              <div className="flex items-end justify-between mb-6 pt-6 border-t border-gold/15">
                <div>
                  <span className="font-serif text-4xl text-ivory">${room.price}</span>
                  <span className="text-ivory/50 text-sm ml-1">/ ночь</span>
                </div>
              </div>

              <a
                href={`https://wa.me/998973018088?text=Здравствуйте!%20Интересует%20номер%20${room.name}%20($${room.price}/ночь)`}
                target="_blank"
                rel="noreferrer"
                className="btn-gold-outline w-full"
              >
                Забронировать
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Component: Features ──────────────────────────────────────────────────
const Features = () => {
  const features = [
    { icon: "🏛", title: "В центре города", desc: "Старый город в 5 минутах" },
    { icon: "🍽", title: "Завтрак включён", desc: "Восточный шведский стол" },
    { icon: "⭐", title: "Рейтинг 4.8", desc: "По отзывам гостей" },
    { icon: "📶", title: "WiFi", desc: "Бесплатный во всём отеле" },
    { icon: "🚗", title: "Парковка", desc: "Охраняемая, бесплатно" },
    { icon: "✈️", title: "Трансфер", desc: "Из аэропорта по запросу" },
  ];

  return (
    <section id="features" className="section-pad relative bg-navy-soft/50">
      <IslamicPattern className="absolute inset-0 w-full h-full pointer-events-none" opacity={0.04} />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center reveal mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-gold mb-4 block">Преимущества</span>
          <h2 className="font-serif text-4xl md:text-6xl text-ivory">Всё для вашего комфорта</h2>
          <OrnamentDivider />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="reveal text-center p-6 group cursor-default"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-gold/30 text-3xl group-hover:border-gold group-hover:bg-gold/5 transition-all duration-500 group-hover:rotate-45">
                <span className="group-hover:-rotate-45 transition-transform duration-500">{f.icon}</span>
              </div>
              <h3 className="font-serif text-lg text-ivory mb-1">{f.title}</h3>
              <p className="text-xs text-ivory/50 font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Component: Reviews ───────────────────────────────────────────────────
const Reviews = () => {
  const reviews = [
    {
      name: "Анна Соколова",
      country: "Россия 🇷🇺",
      rating: 5,
      text: "Невероятный отель! Расположение идеальное — до всех достопримечательностей пешком. Завтрак потрясающий, персонал безупречен. Вернёмся обязательно.",
    },
    {
      name: "Aziz Karimov",
      country: "O'zbekiston 🇺🇿",
      rating: 5,
      text: "Mehmonxona ajoyib! Xodimlar juda mehribon, xonalar toza va qulay. Buxoroning markazida joylashgani esa juda qulay. Tavsiya qilaman!",
    },
    {
      name: "James Whitfield",
      country: "United Kingdom 🇬🇧",
      rating: 5,
      text: "A hidden gem in ancient Bukhara. Authentic Uzbek hospitality, beautifully designed rooms, and the breakfast is a feast. The location is unbeatable.",
    },
  ];

  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % reviews.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="reviews" className="section-pad relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center reveal mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-gold mb-4 block">Отзывы гостей</span>
          <h2 className="font-serif text-4xl md:text-6xl text-ivory">Слова, которые греют</h2>
          <OrnamentDivider />
        </div>

        <div className="reveal relative h-72 md:h-64">
          {reviews.map((r, i) => (
            <div
              key={r.name}
              className={`absolute inset-0 flex flex-col items-center text-center transition-all duration-1000 ${
                i === active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
              }`}
            >
              <div className="flex gap-1 mb-6">
                {[...Array(r.rating)].map((_, idx) => (
                  <svg key={idx} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.075 9.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                  </svg>
                ))}
              </div>
              <p className="font-serif italic text-2xl md:text-3xl text-ivory leading-relaxed mb-8 max-w-3xl">
                «{r.text}»
              </p>
              <div className="flex items-center gap-3">
                <span className="h-px w-12 bg-gold/50" />
                <div>
                  <div className="font-serif text-lg text-gold">{r.name}</div>
                  <div className="text-xs uppercase tracking-widest text-ivory/50">{r.country}</div>
                </div>
                <span className="h-px w-12 bg-gold/50" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Отзыв ${i + 1}`}
              className={`h-px transition-all duration-500 ${
                i === active ? "w-12 bg-gold" : "w-6 bg-ivory/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Component: About Bukhara ─────────────────────────────────────────────
const AboutBukhara = () => {
  const places = [
    { icon: "🏛", title: "Ляби-Хауз", time: "5 мин" },
    { icon: "🏰", title: "Арк", time: "7 мин" },
    { icon: "🕌", title: "Боло-Хауз", time: "3 мин" },
  ];

  return (
    <section id="bukhara" className="section-pad relative overflow-hidden bg-navy-deep">
      <IslamicPattern className="absolute inset-0 w-full h-full pointer-events-none" opacity={0.06} />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.08) 0%, transparent 70%)" }}
      />

      <div className="max-w-5xl mx-auto relative text-center">
        <div className="reveal">
          <span className="text-xs uppercase tracking-[0.4em] text-gold mb-6 block">О Бухаре</span>
          <h2 className="font-serif text-4xl md:text-7xl text-ivory mb-8 leading-tight">
            Город, которому
            <span className="block italic text-gold-gradient">2500 лет</span>
          </h2>
          <OrnamentDivider />
          <p className="font-serif italic text-xl md:text-2xl text-ivory/80 max-w-3xl mx-auto mt-8 mb-16 leading-relaxed">
            Бухара — жемчужина Великого шёлкового пути. Минареты на закате, аромат восточных специй,
            тишина древних медресе. Мы — в самом её сердце.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal">
          {places.map((p, i) => (
            <div
              key={p.title}
              className="border border-gold/20 p-8 hover:border-gold/60 hover:bg-gold/5 transition-all duration-500"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-5xl mb-4">{p.icon}</div>
              <h3 className="font-serif text-2xl text-ivory mb-2">{p.title}</h3>
              <p className="text-gold text-sm uppercase tracking-[0.3em]">{p.time} пешком</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Component: Contact ───────────────────────────────────────────────────
const Contact = () => {
  return (
    <section id="contact" className="section-pad relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center reveal mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-gold mb-4 block">Контакты</span>
          <h2 className="font-serif text-4xl md:text-6xl text-ivory">Мы вас ждём</h2>
          <OrnamentDivider />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Info */}
          <div className="reveal space-y-8">
            <div className="border-l-2 border-gold pl-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2 block">Адрес</span>
              <p className="font-serif text-2xl text-ivory">Usto Sharif St, 49</p>
              <p className="text-ivory/60">Bukhara, Uzbekistan</p>
            </div>

            <div className="border-l-2 border-gold pl-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2 block">Телефон</span>
              <a href="tel:+998973018088" className="font-serif text-2xl text-ivory hover:text-gold transition-colors">
                +998 97 301 80 88
              </a>
            </div>

            <div className="border-l-2 border-gold pl-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2 block">Время</span>
              <p className="text-ivory/80">Заезд: <span className="text-gold font-serif text-lg">14:00</span></p>
              <p className="text-ivory/80">Выезд: <span className="text-gold font-serif text-lg">12:00</span></p>
            </div>

            <a
              href="https://wa.me/998973018088?text=Здравствуйте!%20Хочу%20узнать%20о%20Vavilon%20Plaza%20Hotel"
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp inline-flex"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Map */}
          <div className="reveal relative h-96 lg:h-auto min-h-[400px] border border-gold/20 overflow-hidden">
            <iframe
              title="Vavilon Plaza Hotel Location"
              src="https://maps.google.com/maps?q=Usto+Sharif+St+49+Bukhara&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full"
              style={{ filter: "invert(0.9) hue-rotate(180deg) contrast(0.9)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Component: Footer ────────────────────────────────────────────────────
const Footer = () => (
  <footer className="relative bg-navy-deep border-t border-gold/15 py-16 px-6 md:px-12">
    <IslamicPattern className="absolute inset-0 w-full h-full pointer-events-none" opacity={0.03} />
    <div className="max-w-7xl mx-auto relative">
      <div className="text-center mb-8">
        <h3 className="font-serif text-3xl md:text-4xl text-ivory mb-2">
          VAVILON <span className="text-gold-gradient italic">Plaza</span>
        </h3>
        <p className="text-xs uppercase tracking-[0.4em] text-gold/70">Bukhara · Uzbekistan</p>
      </div>

      <OrnamentDivider />

      {/* Socials */}
      <div className="flex justify-center gap-4 my-8">
        {[
          { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
          { label: "Facebook", path: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" },
          { label: "WhatsApp", path: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.label === "WhatsApp" ? "https://wa.me/998973018088" : "#"}
            aria-label={s.label}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 flex items-center justify-center border border-gold/30 text-ivory/70 hover:text-gold hover:border-gold transition-all duration-500 hover:bg-gold/5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d={s.path} />
            </svg>
          </a>
        ))}
      </div>

      <p className="text-center text-xs text-ivory/40 tracking-wider">
        © 2025 Vavilon Plaza Hotel · Bukhara, Uzbekistan · Все права защищены
      </p>
    </div>
  </footer>
);

// ─── Component: Floating WhatsApp (mobile) ────────────────────────────────
const FloatingWhatsApp = () => (
  <a
    href="https://wa.me/998973018088?text=Здравствуйте!%20Хочу%20забронировать%20номер"
    target="_blank"
    rel="noreferrer"
    className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-white animate-pulse-gold"
    style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
    aria-label="WhatsApp"
  >
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  </a>
);

// ─── Page ─────────────────────────────────────────────────────────────────
const Index = () => {
  useReveal();

  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <Hero />
      <BookingForm />
      <Rooms />
      <Features />
      <Reviews />
      <AboutBukhara />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
};

export default Index;
