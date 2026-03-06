import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, ArrowUpRight, Calendar, MapPin, Users, MessageCircle, BookOpen, Mic, Play, Quote, ChevronDown } from 'lucide-react';

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 100);
    
    return () => observer.disconnect();
  }, []);
}

function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches) {
        setIsMobile(true);
        document.body.style.cursor = 'auto';
      } else {
        setIsMobile(false);
        document.body.style.cursor = 'none';
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (isMobile) return;
    
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let cursorText = '';
    
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      
      const target = e.target as HTMLElement;
      const cursorElement = target.closest('[data-cursor]');
      
      if (cursorElement) {
        cursorText = cursorElement.getAttribute('data-cursor') || '';
        if (ringRef.current) {
          ringRef.current.classList.add('scale-[3]', 'bg-forest/5', 'border-transparent', 'backdrop-blur-[2px]');
          ringRef.current.classList.remove('border-gold');
        }
        if (textRef.current) {
          textRef.current.innerText = cursorText;
          textRef.current.style.opacity = '1';
        }
      } else {
        if (ringRef.current) {
          ringRef.current.classList.remove('scale-[3]', 'bg-forest/5', 'border-transparent', 'backdrop-blur-[2px]');
          ringRef.current.classList.add('border-gold');
        }
        if (textRef.current) {
          textRef.current.style.opacity = '0';
        }
      }
    };
    
    let animationFrameId: number;
    
    const render = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    window.addEventListener('mousemove', onMouseMove);
    animationFrameId = requestAnimationFrame(render);
    
    const onScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);
    };
    
    window.addEventListener('scroll', onScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = 'auto';
    };
  }, [isMobile]);
  
  if (isMobile) return null;
  
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;
  
  return (
    <>
      <div 
        ref={dotRef} 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-gold rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2"
      />
      <div 
        ref={ringRef} 
        className="fixed top-0 left-0 w-12 h-12 border border-gold rounded-full pointer-events-none z-[99] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center justify-center"
      >
        <div ref={textRef} className="text-[3px] font-sans font-bold uppercase tracking-wider text-forest opacity-0 transition-opacity duration-300"></div>
        {scrollProgress > 5 && (
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="1"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-100 ease-out opacity-50"
            />
          </svg>
        )}
      </div>
    </>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-cream/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className={`font-serif text-2xl font-medium tracking-wide ${scrolled ? 'text-forest' : 'text-cream'}`} data-cursor="Home">
          Tobi Yusuf
        </a>
        <div className="hidden md:flex items-center space-x-8">
          {['About', 'The Work', 'Experiences', 'Reflections', 'Speaking'].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className={`text-sm font-medium tracking-wide hover:text-gold transition-colors ${scrolled ? 'text-forest' : 'text-cream/80'}`} data-cursor="View">
              {link}
            </a>
          ))}
          <a href="#speaking" className={`px-6 py-2.5 rounded-none text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 ${scrolled ? 'bg-forest text-cream hover:bg-forest/90' : 'bg-cream text-forest hover:bg-white'}`} data-cursor="Book">
            Book Tobi
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-forest text-cream overflow-hidden pt-20">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gold/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="max-w-4xl">
          <p className="text-gold font-sans tracking-[0.2em] uppercase text-sm mb-6 opacity-0 animate-[slideUp_1s_ease-out_0.2s_forwards]">
            Speaker · Facilitator · Conversation Host
          </p>
          <h1 className="font-serif text-7xl md:text-9xl leading-none mb-8">
            <span className="block opacity-0 animate-[slideUp_1s_ease-out_0.4s_forwards]">Tobi</span>
            <span className="block italic text-gold opacity-0 animate-[slideUp_1s_ease-out_0.6s_forwards]">Yusuf</span>
          </h1>
          <p className="text-xl md:text-3xl font-serif text-cream/90 max-w-2xl leading-relaxed mb-12 opacity-0 animate-[slideUp_1s_ease-out_0.8s_forwards]">
            "Helping people understand the patterns that shape relationships — from the bedroom to the boardroom."
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 opacity-0 animate-[slideUp_1s_ease-out_1s_forwards]">
            <a href="#experiences" className="px-8 py-4 bg-gold text-forest font-medium rounded-none text-center hover:bg-gold-light transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(184,151,74,0.5)]" data-cursor="Explore">
              Explore Experiences
            </a>
            <a href="#speaking" className="px-8 py-4 border border-cream/30 text-cream font-medium rounded-none text-center hover:bg-cream/10 transition-all hover:-translate-y-1" data-cursor="Book">
              Book Tobi to Speak
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-6 md:left-12 flex items-center gap-4 opacity-0 animate-[slideUp_1s_ease-out_1.2s_forwards]">
        <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/50 animate-[shimmer_2s_infinite]"></div>
        </div>
        <span className="text-xs tracking-widest uppercase text-cream/50 rotate-180" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
      </div>
    </section>
  );
}

function EmotionalRecognition() {
  return (
    <section className="py-32 bg-forest text-cream relative">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-serif text-4xl md:text-5xl mb-16 text-gold italic reveal">If This Feels Familiar</h2>
        
        <div className="space-y-10 text-lg md:text-xl font-serif leading-relaxed text-cream/80">
          <p className="reveal reveal-delay-1">"You love your spouse, but conversations often turn into misunderstandings."</p>
          <p className="reveal reveal-delay-2">"You find yourself repeating the same concerns, yet nothing seems to change."</p>
          <p className="reveal reveal-delay-3">"Sometimes you wonder if you're asking for too much — or if you've simply stopped saying certain things altogether."</p>
          <p className="reveal reveal-delay-4">"You may still care deeply about your marriage, but the emotional connection feels different from how it once was."</p>
        </div>
        
        <div className="w-px h-24 bg-gold/30 mx-auto my-16 reveal"></div>
        
        <p className="text-xl md:text-2xl font-serif leading-relaxed mb-16 reveal">
          "If any of this feels familiar, you're not alone. My work creates space to understand the patterns behind these moments — and to begin more intentional conversations about them."
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 reveal">
          <a href="#reflections" className="px-6 py-3 border border-cream/20 rounded-none text-sm font-medium hover:bg-cream/5 transition-colors" data-cursor="Read">Read Reflections</a>
          <a href="#experiences" className="px-6 py-3 border border-cream/20 rounded-none text-sm font-medium hover:bg-cream/5 transition-colors" data-cursor="Explore">Explore Experiences</a>
          <a href="#speaking" className="px-6 py-3 border border-gold text-gold rounded-none text-sm font-medium hover:bg-gold/10 transition-colors" data-cursor="Book">Book Tobi to Speak</a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-32 bg-cream text-forest">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        <div className="relative reveal">
          <div className="absolute inset-0 bg-gold translate-x-4 translate-y-4 rounded-lg"></div>
          <div className="relative aspect-[3/4] bg-gradient-to-br from-forest to-forest/80 rounded-lg overflow-hidden flex items-center justify-center p-8">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
            <span className="text-gold font-serif text-3xl italic relative z-10 opacity-50">Portrait Placeholder</span>
            <div className="absolute bottom-6 left-6 bg-cream text-forest px-4 py-2 text-sm font-medium tracking-wider uppercase rounded-sm shadow-lg">
              Tobi Yusuf
            </div>
          </div>
        </div>
        
        <div>
          <span className="text-gold font-sans tracking-[0.2em] uppercase text-xs font-bold mb-4 block reveal">About</span>
          <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight reveal reveal-delay-1">Relational & Cultural Intelligence Advisor</h2>
          
          <div className="space-y-6 text-neutral-600 text-lg reveal reveal-delay-2">
            <p>
              For over a decade, I have dedicated my life to understanding the invisible threads that connect us. The patterns we inherit, the communication styles we adopt, and the cultural nuances that shape our expectations.
            </p>
            <p>
              Whether I am facilitating a corporate workshop on team dynamics or hosting an intimate dinner for couples, my goal remains the same: to create a safe, intentional space where real conversations can happen.
            </p>
            <p>
              I believe that when we understand the "why" behind our interactions, we can transform any relationship — from the bedroom to the boardroom.
            </p>
          </div>
          
          <a href="#" className="inline-flex items-center gap-2 mt-10 text-forest font-medium border-b border-forest pb-1 hover:text-gold hover:border-gold transition-colors reveal reveal-delay-3" data-cursor="Read">
            Learn More About Tobi <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

function TheWork() {
  const cards = [
    { num: "01", title: "Relational Intelligence", desc: "Understanding the emotional and psychological patterns that govern how we connect, communicate, and resolve conflict." },
    { num: "02", title: "Cultural Intelligence", desc: "Navigating the unspoken cultural expectations and inherited beliefs that influence our personal and professional relationships." },
    { num: "03", title: "Intentional Experiences", desc: "Curated spaces designed to bypass small talk and foster deep, meaningful dialogue among participants." }
  ];

  return (
    <section id="the-work" className="py-32 bg-cream text-forest border-t border-forest/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 reveal">
          <span className="text-gold font-sans tracking-[0.2em] uppercase text-xs font-bold mb-4 block">The Work</span>
          <h2 className="font-serif text-4xl md:text-5xl">Core Pillars</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className={`group relative bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 reveal reveal-delay-${idx + 1}`} data-cursor="Explore">
              <span className="absolute top-6 right-8 font-serif text-6xl text-forest/5 font-bold italic transition-colors group-hover:text-gold/10">{card.num}</span>
              <h3 className="font-serif text-2xl mb-4 relative z-10 mt-12">{card.title}</h3>
              <p className="text-neutral-600 relative z-10">{card.desc}</p>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gold transition-all duration-500 group-hover:w-full rounded-b-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experiences() {
  const events = [
    { badge: "Workshop", title: "Intentional Space", desc: "A guided workshop for couples looking to break negative communication cycles and rebuild emotional intimacy." },
    { badge: "Retreat", title: "Forever and a Day Experience", desc: "An immersive weekend retreat focused on relational intelligence, cultural understanding, and deep connection." },
    { badge: "Dinner", title: "Forever Table", desc: "An intimate, curated dining experience where couples engage in guided conversations that go beyond the surface." }
  ];

  return (
    <section id="experiences" className="py-32 bg-forest text-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 reveal">
          <div>
            <span className="text-gold font-sans tracking-[0.2em] uppercase text-xs font-bold mb-4 block">Experiences</span>
            <h2 className="font-serif text-4xl md:text-5xl">Curated Spaces</h2>
          </div>
          <a href="#" className="hidden md:inline-flex items-center gap-2 text-cream/70 hover:text-gold transition-colors" data-cursor="View">
            View All Experiences <ArrowRight size={16} />
          </a>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <div key={idx} className={`group border border-cream/10 bg-cream/5 p-8 rounded-2xl hover:bg-cream/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-2 reveal reveal-delay-${idx + 1}`} data-cursor="View">
              <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider rounded-full mb-6">{event.badge}</span>
              <h3 className="font-serif text-2xl mb-4">{event.title}</h3>
              <p className="text-cream/70 mb-8 min-h-[80px]">{event.desc}</p>
              <div className="flex flex-col gap-3">
                <button className="w-full py-3 bg-gold text-forest font-medium rounded-none hover:bg-gold-light transition-colors" data-cursor="Book">Book Ticket</button>
                <button className="w-full py-3 border border-cream/20 text-cream font-medium rounded-none hover:bg-cream/10 transition-colors" data-cursor="Explore">Join Waitlist</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reflections() {
  const articles = [
    { tag: "Marriage", title: "Why Some Women Stop Talking in Marriage", excerpt: "The silence isn't always a lack of care. Often, it's the result of feeling unheard for too long." },
    { tag: "Communication", title: "When Timing Matters More Than Being Right", excerpt: "You can have the right message, but if delivered at the wrong time, it will never be received." },
    { tag: "Patterns", title: "The Pattern Couples Don't Notice Until It's Too Late", excerpt: "How small, seemingly insignificant daily interactions build the foundation for major disconnects." }
  ];

  return (
    <section id="reflections" className="py-32 bg-cream text-forest">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 reveal">
          <div>
            <span className="text-gold font-sans tracking-[0.2em] uppercase text-xs font-bold mb-4 block">Reflections</span>
            <h2 className="font-serif text-4xl md:text-5xl">Thoughts & Insights</h2>
          </div>
          <a href="#" className="hidden md:inline-flex items-center gap-2 text-forest/70 hover:text-gold transition-colors" data-cursor="Read">
            Read More Reflections <ArrowRight size={16} />
          </a>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <div key={idx} className={`group cursor-pointer reveal reveal-delay-${idx + 1}`} data-cursor="Read">
              <div className="aspect-[4/3] bg-neutral-200 rounded-xl mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-forest/5 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <span className="text-gold text-xs font-bold uppercase tracking-wider mb-3 block">{article.tag}</span>
              <h3 className="font-serif text-2xl mb-3 group-hover:text-gold transition-colors">{article.title}</h3>
              <p className="text-neutral-600 mb-4">{article.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-forest group-hover:text-gold transition-colors">
                Read Reflection <ArrowUpRight size={14} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Speaking() {
  const topics = [
    "The ROI of Relational Intelligence",
    "Navigating Cultural Nuance in Leadership",
    "Breaking Patterns in High-Stakes Environments",
    "The Art of the Difficult Conversation"
  ];

  return (
    <section id="speaking" className="py-32 bg-white text-forest border-t border-forest/10">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24">
        <div className="lg:sticky lg:top-32 self-start reveal">
          <span className="text-gold font-sans tracking-[0.2em] uppercase text-xs font-bold mb-4 block">Speaking</span>
          <h2 className="font-serif text-4xl md:text-5xl mb-8">Invite Tobi to Speak</h2>
          <p className="text-neutral-600 text-lg mb-10">
            Whether addressing a corporate leadership team or a room full of couples, Tobi brings a unique blend of insight, empathy, and actionable wisdom. Her talks are designed to shift perspectives and equip audiences with the tools to build healthier, more resilient relationships.
          </p>
          
          <div className="space-y-4 mb-12">
            <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-forest/50 mb-6">Signature Topics</h4>
            {topics.map((topic, idx) => (
              <div key={idx} className="group flex items-center gap-4 py-3 border-b border-forest/10 hover:border-gold transition-colors cursor-pointer" data-cursor="Explore">
                <ArrowRight size={16} className="text-forest/30 group-hover:text-gold group-hover:translate-x-2 transition-all" />
                <span className="font-serif text-xl group-hover:text-gold transition-colors">{topic}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-cream rounded-xl italic font-serif text-lg text-forest/80">
            <Quote className="text-gold shrink-0" size={24} />
            <p>"From the bedroom to the boardroom, the quality of our lives is determined by the quality of our relationships."</p>
          </div>
        </div>
        
        <div className="bg-cream p-8 md:p-12 rounded-2xl reveal reveal-delay-2">
          <h3 className="font-serif text-3xl mb-8">Speaking Enquiry</h3>
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative">
                <input type="text" id="name" className="w-full bg-transparent border-b border-forest/20 py-3 focus:outline-none focus:border-gold transition-colors peer placeholder-transparent" placeholder="Name" />
                <label htmlFor="name" className="absolute left-0 top-3 text-forest/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-gold peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs">Full Name</label>
              </div>
              <div className="relative">
                <input type="text" id="org" className="w-full bg-transparent border-b border-forest/20 py-3 focus:outline-none focus:border-gold transition-colors peer placeholder-transparent" placeholder="Organization" />
                <label htmlFor="org" className="absolute left-0 top-3 text-forest/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-gold peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs">Organization</label>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative">
                <input type="email" id="email" className="w-full bg-transparent border-b border-forest/20 py-3 focus:outline-none focus:border-gold transition-colors peer placeholder-transparent" placeholder="Email" />
                <label htmlFor="email" className="absolute left-0 top-3 text-forest/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-gold peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs">Email Address</label>
              </div>
              <div className="relative">
                <input type="tel" id="phone" className="w-full bg-transparent border-b border-forest/20 py-3 focus:outline-none focus:border-gold transition-colors peer placeholder-transparent" placeholder="Phone" />
                <label htmlFor="phone" className="absolute left-0 top-3 text-forest/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-gold peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs">Phone Number</label>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative">
                <select defaultValue="" className="w-full bg-transparent border-b border-forest/20 py-3 focus:outline-none focus:border-gold transition-colors text-forest appearance-none">
                  <option value="" disabled>Event Type</option>
                  <option value="keynote">Keynote</option>
                  <option value="workshop">Workshop</option>
                  <option value="panel">Panel Discussion</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown size={16} className="absolute right-0 top-4 text-forest/50 pointer-events-none" />
              </div>
              <div className="relative">
                <select defaultValue="" className="w-full bg-transparent border-b border-forest/20 py-3 focus:outline-none focus:border-gold transition-colors text-forest appearance-none">
                  <option value="" disabled>Audience Size</option>
                  <option value="small">Under 50</option>
                  <option value="medium">50 - 200</option>
                  <option value="large">200+</option>
                </select>
                <ChevronDown size={16} className="absolute right-0 top-4 text-forest/50 pointer-events-none" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative">
                <input type="text" id="date" className="w-full bg-transparent border-b border-forest/20 py-3 focus:outline-none focus:border-gold transition-colors peer placeholder-transparent" placeholder="Date" />
                <label htmlFor="date" className="absolute left-0 top-3 text-forest/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-gold peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs">Event Date</label>
              </div>
              <div className="relative">
                <input type="text" id="location" className="w-full bg-transparent border-b border-forest/20 py-3 focus:outline-none focus:border-gold transition-colors peer placeholder-transparent" placeholder="Location" />
                <label htmlFor="location" className="absolute left-0 top-3 text-forest/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-gold peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs">Location</label>
              </div>
            </div>
            
            <div className="relative pt-4">
              <textarea id="message" rows={4} className="w-full bg-transparent border-b border-forest/20 py-3 focus:outline-none focus:border-gold transition-colors peer placeholder-transparent resize-none" placeholder="Message"></textarea>
              <label htmlFor="message" className="absolute left-0 top-7 text-forest/50 text-sm transition-all peer-focus:top-0 peer-focus:text-xs peer-focus:text-gold peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs">Tell us about your event</label>
            </div>
            
            <button className="w-full py-4 bg-forest text-cream font-medium rounded-none hover:bg-forest/90 transition-all hover:-translate-y-1 hover:shadow-lg mt-4" data-cursor="Submit">
              Submit Speaking Enquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function JourneyInvitation() {
  const journeys = [
    { icon: <BookOpen size={24} />, title: "Start with a Reflection", desc: "Read Tobi's latest thoughts on relational intelligence.", cta: "Read Articles" },
    { icon: <Users size={24} />, title: "Join an Experience", desc: "Attend a curated event designed for deep connection.", cta: "View Events" },
    { icon: <Mic size={24} />, title: "Invite Tobi to Speak", desc: "Bring Tobi's insights to your organization or event.", cta: "Book Tobi" }
  ];

  return (
    <>
      <section className="py-32 bg-cream text-forest">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 className="font-serif text-4xl">Your Next Step</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {journeys.map((item, idx) => (
              <div key={idx} className={`group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-t-4 border-transparent hover:border-gold reveal reveal-delay-${idx + 1}`} data-cursor="Explore">
                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-serif text-2xl mb-3">{item.title}</h3>
                <p className="text-neutral-600 mb-8">{item.desc}</p>
                <button className="text-sm font-bold uppercase tracking-wider text-forest group-hover:text-gold transition-colors inline-flex items-center gap-2">
                  {item.cta} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-forest text-cream text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-serif text-cream/5 leading-none pointer-events-none">"</div>
        <div className="max-w-3xl mx-auto px-6 relative z-10 reveal">
          <h2 className="font-serif text-5xl md:text-6xl mb-8 italic text-gold">Conversations Change Things</h2>
          <p className="text-xl font-serif text-cream/80 mb-12 leading-relaxed">
            "The quality of our relationships determines the quality of our lives. It's time to stop having the same arguments and start having the right conversations."
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#experiences" className="px-8 py-4 bg-gold text-forest font-medium rounded-none hover:bg-gold-light transition-all hover:-translate-y-1" data-cursor="Explore">Explore Experiences</a>
            <a href="#speaking" className="px-8 py-4 border border-cream/30 text-cream font-medium rounded-none hover:bg-cream/10 transition-all hover:-translate-y-1" data-cursor="Book">Book Tobi to Speak</a>
          </div>
        </div>
      </section>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-[#111C12] text-cream/70 py-20 border-t border-cream/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="font-serif text-2xl text-cream block mb-6">Tobi Yusuf</a>
            <p className="text-sm mb-6">Relational & Cultural Intelligence Advisor.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gold transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-gold transition-colors">Instagram</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-cream font-bold uppercase tracking-wider text-xs mb-6">Navigate</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#about" className="hover:text-gold transition-colors">About Tobi</a></li>
              <li><a href="#the-work" className="hover:text-gold transition-colors">The Work</a></li>
              <li><a href="#reflections" className="hover:text-gold transition-colors">Reflections</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-cream font-bold uppercase tracking-wider text-xs mb-6">Experiences</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-gold transition-colors">Intentional Space</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Forever and a Day</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Forever Table</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-cream font-bold uppercase tracking-wider text-xs mb-6">Connect</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#speaking" className="hover:text-gold transition-colors">Speaking Enquiry</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Newsletter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="italic text-cream/50 max-w-2xl text-center md:text-left">
            "Because many of these conversations are deeply personal, we protect the privacy of those who attend our experiences. What is shared in the room, stays in the room."
          </p>
          <p>&copy; {new Date().getFullYear()} Tobi Yusuf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  useReveal();
  
  return (
    <div className="bg-cream min-h-screen font-sans text-forest selection:bg-gold/30 selection:text-forest">
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <EmotionalRecognition />
        <About />
        <TheWork />
        <Experiences />
        <Reflections />
        <Speaking />
        <JourneyInvitation />
      </main>
      <Footer />
    </div>
  );
}
