// Museo della Notte — main app
const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "gold-oxblood",
  "glassIntensity": 18,
  "starDensity": 0.75,
  "lightRays": true,
  "fontPair": "cormorant-inter",
  "cursorTrail": true
}/*EDITMODE-END*/;

const PALETTES = {
  "gold-oxblood":  { gold:"#d4af37", glow:"#e7c970", accent:"#7a1818", indigo:"#141a36", obsidian:"#050714", ivory:"#f5ecd0" },
  "gold-ivory":    { gold:"#d4af37", glow:"#e7c970", accent:"#c9a961", indigo:"#1a1f3d", obsidian:"#070914", ivory:"#f5ecd0" },
  "antique-indigo":{ gold:"#c9a961", glow:"#dfc28a", accent:"#3a4a7a", indigo:"#0f1530", obsidian:"#04060f", ivory:"#ebe1c4" },
  "porcelain-rose":{ gold:"#d8b16a", glow:"#ecd29a", accent:"#a04848", indigo:"#1c1830", obsidian:"#080612", ivory:"#f7ecd9" },
};

const FONT_PAIRS = {
  "cormorant-inter":  { serif: "'Cormorant Garamond', Georgia, serif", sans: "'Inter', system-ui, sans-serif" },
  "playfair-inter":   { serif: "'Playfair Display', Georgia, serif",   sans: "'Inter', system-ui, sans-serif" },
  "ebgaramond-inter": { serif: "'EB Garamond', Georgia, serif",        sans: "'Inter', system-ui, sans-serif" },
};

// ─────────────────────────────────────────────────────────────────────────────
// REVEAL HOOK
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FIREFLY CURSOR
function useFirefly(enabled) {
  useEffect(() => {
    const el = document.getElementById('firefly');
    if (!el) return;
    if (!enabled) { el.style.opacity = '0'; return; }
    let x=0,y=0,tx=0,ty=0,raf;
    const move = (e) => { tx = e.clientX; ty = e.clientY; el.style.opacity = '1'; };
    const leave = () => { el.style.opacity = '0'; };
    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.left = x + 'px';
      el.style.top  = y + 'px';
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    loop();
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', leave); cancelAnimationFrame(raf); };
  }, [enabled]);
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV
function Nav({ onReserve }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav style={{
      position:'fixed', top: scrolled ? 16 : 24, left:'50%', transform:'translateX(-50%)',
      zIndex: 100, width:'min(1240px, calc(100vw - 32px))',
      transition:'top .4s ease',
    }}>
      <div className="glass" style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px 22px', borderRadius: 999,
      }}>
        <a href="#top" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', color:'inherit' }}>
          <Crescent size={18} />
          <span className="serif" style={{ fontSize: 18, letterSpacing:'0.02em' }}>Museo della Notte</span>
        </a>
        <div className="hide-sm" style={{ display:'flex', gap:28, alignItems:'center', fontSize:12, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(245,236,208,0.75)' }}>
          <a href="#exhibitions" style={navLinkStyle}>Exhibitions</a>
          <a href="#collections" style={navLinkStyle}>Collections</a>
          <a href="#programme"   style={navLinkStyle}>Programme</a>
          <a href="#order"       style={navLinkStyle}>Membership</a>
          <a href="#visit"       style={navLinkStyle}>Visit</a>
        </div>
        <button className="gbtn gbtn-sm gbtn-primary" onClick={onReserve}>Reserve</button>
      </div>
    </nav>
  );
}
const navLinkStyle = { color:'inherit', textDecoration:'none', transition:'color .3s', fontWeight:500 };

function Crescent({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="cresc" cx="0.4" cy="0.4">
          <stop offset="0%" stopColor="#e7c970" />
          <stop offset="100%" stopColor="#d4af37" />
        </radialGradient>
      </defs>
      <path d="M19 12a8 8 0 1 1-7.5-7.98 6.5 6.5 0 0 0 7.5 7.98z" fill="url(#cresc)" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
function Hero({ onReserve, onExhibitions, lightRays }) {
  const videoRef = useRef(null);
  const [vidLoaded, setVidLoaded] = useState(false);
  const [parallax, setParallax] = useState(0);
  useEffect(() => {
    const onScroll = () => setParallax(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="top" style={{
      position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column',
      justifyContent:'center', alignItems:'center', padding:'140px 24px 80px',
      overflow:'hidden',
    }}>
      {/* video */}
      <div style={{ position:'absolute', inset:0, zIndex:-1, transform:`translateY(${parallax * 0.3}px) scale(1.05)` }}>
        <video
          ref={videoRef}
          src="assets/hero-night.mp4"
          autoPlay muted loop playsInline
          onLoadedData={() => setVidLoaded(true)}
          style={{ width:'100%', height:'100%', objectFit:'cover', opacity: vidLoaded ? 0.55 : 0, transition:'opacity 1.6s ease' }}
        />
        {/* vignette */}
        <div style={{
          position:'absolute', inset:0,
          background:`
            radial-gradient(ellipse at center, transparent 30%, rgba(5,7,20,0.7) 80%),
            linear-gradient(180deg, rgba(5,7,20,0.4) 0%, transparent 30%, transparent 60%, rgba(5,7,20,0.95) 100%)
          `,
        }}/>
      </div>

      {/* moonbeams */}
      {lightRays && (
        <>
          <div className="moonbeam" style={{ left:'10%',  top:'-20vh', transform:`rotate(8deg) translateY(${-parallax * 0.15}px)` }}/>
          <div className="moonbeam" style={{ left:'55%',  top:'-10vh', opacity:0.6, transform:`rotate(-6deg) translateY(${-parallax * 0.25}px)` }}/>
          <div className="moonbeam" style={{ right:'5%',  top:'-30vh', opacity:0.5, transform:`rotate(15deg) translateY(${-parallax * 0.1}px)` }}/>
        </>
      )}

      <div className="reveal in" style={{ textAlign:'center', maxWidth: 980, position:'relative' }}>
        <div className="eyebrow" style={{ marginBottom:28, color:'var(--gold-2)' }}>
          <span style={{ display:'inline-block', width:24, height:1, background:'var(--gold-2)', verticalAlign:'middle', marginRight:14 }} />
          Est. MMXXIV · Open after dusk
          <span style={{ display:'inline-block', width:24, height:1, background:'var(--gold-2)', verticalAlign:'middle', marginLeft:14 }} />
        </div>
        <h1 className="serif" style={{
          fontSize:'clamp(52px, 8vw, 120px)', lineHeight:1.18, fontWeight:400,
          margin:'0 0 56px', letterSpacing:'-0.02em', paddingBottom:'0.15em',
          background:'linear-gradient(180deg, #fff 0%, #f5ecd0 60%, #d4af37 100%)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          backgroundClip:'text', color:'transparent',
          textShadow:'0 0 80px rgba(212,175,55,0.15)',
        }}>
          Museo<br/>
          <em style={{ fontStyle:'italic', fontWeight:300, color:'#e7c970', WebkitTextFillColor:'#e7c970' }}>della Notte</em>
        </h1>
        <p className="serif" style={{
          fontSize:'clamp(18px, 2vw, 24px)', fontStyle:'italic',
          color:'rgba(245,236,208,0.75)', maxWidth:580, margin:'0 auto 44px',
          lineHeight:1.4, fontWeight:300,
        }}>
          Where the night keeps its treasures.<br/>
          A sanctuary for art seen by candlelight, moonlight, and the slow burn of gilt.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <button className="gbtn gbtn-primary" onClick={onReserve}>Plan an Evening Visit</button>
          <button className="gbtn gbtn-ghost" onClick={onExhibitions}>View Current Exhibitions</button>
        </div>
      </div>

      {/* scroll indicator */}
      <div style={{
        position:'absolute', bottom:36, left:'50%', transform:'translateX(-50%)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:14,
        color:'rgba(245,236,208,0.5)', fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase',
      }}>
        <span>Descend</span>
        <Candle />
      </div>
    </section>
  );
}

function Candle() {
  return (
    <div style={{ position:'relative', width:14, height:50 }}>
      <div style={{ position:'absolute', left:'50%', top:0, transform:'translateX(-50%)', width:2, height:50, background:'linear-gradient(180deg, transparent, rgba(212,175,55,0.5), transparent)' }}/>
      <div style={{
        position:'absolute', left:'50%', bottom:0, transform:'translateX(-50%)',
        width:6, height:8, borderRadius:'50% 50% 30% 30%',
        background:'radial-gradient(circle at 50% 70%, #fff8d6, #e7c970 40%, #d4af37 70%, transparent 90%)',
        boxShadow:'0 0 14px rgba(231,201,112,0.8), 0 0 28px rgba(212,175,55,0.4)',
        animation:'twinkle 2.4s ease-in-out infinite',
      }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED EXHIBITION
const FEATURED = {
  number: "I.",
  kicker: "Now on view",
  title: "Nocturnes in Oil",
  subtitle: "Twenty-three Baroque canvases, lit only by the flame their painters worked beside.",
  dates: "12 October — 04 February",
  curator: "Curated by Lucia Marchetti",
  hours: "Galleries open 19:00 · Last entry 23:30",
  rooms: "Halls III–VII",
  body: "From Caravaggio's late students to the candlelit sacristies of Genoese workshops, Nocturnes in Oil follows the painters who worked the dimmest hours — and asks what survives when the only witness is a single flame."
};

function Featured({ onReserve }) {
  return (
    <section id="exhibitions" style={{ padding:'140px 24px', position:'relative' }}>
      <div style={{ maxWidth:1240, margin:'0 auto' }}>
        <div className="reveal" style={{ display:'flex', alignItems:'baseline', gap:20, marginBottom:40 }}>
          <span className="label">{FEATURED.kicker}</span>
          <hr className="gold-rule" style={{ flex:1 }}/>
          <span className="eyebrow">{FEATURED.dates}</span>
        </div>

        <div className="reveal" style={{
          display:'grid', gridTemplateColumns:'1.25fr 1fr', gap:0,
          borderRadius:18, overflow:'hidden',
        }}>
          {/* Image */}
          <div style={{ position:'relative', aspectRatio:'4/3.4', minHeight:520 }}>
            <div className="ph" data-label="[ MARQUEE — Caravaggio-school nocturne, candlelit canvas, deep shadow ]" style={{ position:'absolute', inset:0 }}/>
            <div style={{
              position:'absolute', inset:0,
              background:'linear-gradient(135deg, rgba(5,7,20,0.4), transparent 40%, rgba(5,7,20,0.7))',
            }}/>
            <div style={{ position:'absolute', top:24, left:24, fontFamily:'var(--mono)', fontSize:11, color:'var(--gold-2)', letterSpacing:'0.3em' }}>
              {FEATURED.number}
            </div>
            <div style={{ position:'absolute', bottom:24, left:24, right:24, display:'flex', justifyContent:'space-between', fontFamily:'var(--mono)', fontSize:10, color:'rgba(245,236,208,0.55)', letterSpacing:'0.22em', textTransform:'uppercase' }}>
              <span>{FEATURED.rooms}</span>
              <span>23 works</span>
            </div>
          </div>

          {/* Glass panel */}
          <div className="glass-strong shimmerable" style={{
            padding:'56px 48px', display:'flex', flexDirection:'column', justifyContent:'center',
            borderRadius:0,
            background:'linear-gradient(180deg, rgba(20,26,54,0.7), rgba(10,14,31,0.85))',
            borderLeft:'0.5px solid rgba(212,175,55,0.22)',
            borderRight:'none', borderTop:'none', borderBottom:'none',
          }}>
            <div className="eyebrow" style={{ marginBottom:18 }}>{FEATURED.curator}</div>
            <h2 className="serif" style={{
              fontSize:'clamp(38px, 4.2vw, 60px)', fontWeight:400, fontStyle:'italic',
              lineHeight:1.18, margin:'0 0 36px', letterSpacing:'-0.01em',
              color:'#f5ecd0', paddingBottom:'0.15em',
            }}>
              {FEATURED.title}
            </h2>
            <p className="serif" style={{ fontSize:20, fontStyle:'italic', color:'rgba(245,236,208,0.78)', lineHeight:1.4, margin:'0 0 20px', fontWeight:300 }}>
              {FEATURED.subtitle}
            </p>
            <p style={{ fontSize:14, color:'rgba(245,236,208,0.6)', lineHeight:1.7, margin:'0 0 36px' }}>
              {FEATURED.body}
            </p>
            <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
              <button className="gbtn gbtn-primary" onClick={onReserve}>Reserve Tickets</button>
              <span className="eyebrow">{FEATURED.hours}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTIONS GRID
const COLLECTIONS = [
  { name:"The Hall of Saints",       it:"Sala dei Santi",       count:"127 works",  desc:"Devotional panels and reliquaries from the Counter-Reformation south.", ph:"[ Gilded altarpiece detail, candle-glow, gold leaf ]" },
  { name:"The Moonlit Atrium",       it:"Atrio della Luna",     count:"42 sculptures", desc:"Marble figures arranged beneath an oculus open to the night sky.",      ph:"[ Marble sculpture in shadowed alcove, single shaft of light ]" },
  { name:"Chamber of Masks",         it:"Camera delle Maschere", count:"89 artifacts", desc:"Venetian carnival masks, opera costumes, and theatrical props.",        ph:"[ Bauta mask under low key light, gilt detail ]" },
  { name:"The Nocturne Gallery",     it:"Galleria Notturna",     count:"54 paintings", desc:"Night scenes from Genoa, Naples, and the Spanish low countries.",       ph:"[ Dutch nocturne, lantern-lit, deep umber ]" },
  { name:"Sculptures by Candlelight", it:"Sculture a Lume",       count:"31 works",     desc:"A single chamber. A single candle. Marble, hourly relit.",              ph:"[ Bust on plinth, candle in foreground ]" },
  { name:"The Gilded Cabinet",       it:"Stanza Dorata",         count:"206 objects",  desc:"Reliquaries, automata, and the museum's smallest treasures.",          ph:"[ Cabinet of curiosities, tiny gold objects ]" },
];

function Collections() {
  return (
    <section id="collections" style={{ padding:'140px 24px', position:'relative' }}>
      <div style={{ maxWidth:1240, margin:'0 auto' }}>
        <div className="reveal" style={{ marginBottom:60, textAlign:'center' }}>
          <div className="label" style={{ marginBottom:18 }}>Le Collezioni Permanenti</div>
          <h2 className="serif" style={{ fontSize:'clamp(40px, 5.5vw, 76px)', fontWeight:400, fontStyle:'italic', margin:0, letterSpacing:'-0.015em', color:'#f5ecd0', lineHeight:1.18, paddingBottom:'0.15em' }}>
            Six rooms, kept dark.
          </h2>
          <p className="serif" style={{ fontSize:18, fontStyle:'italic', color:'rgba(245,236,208,0.6)', maxWidth:560, margin:'18px auto 0', fontWeight:300 }}>
            The permanent collection is housed in six wings, each with its own temperament and its own hour.
          </p>
        </div>

        <div className="reveal" style={{
          display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:24,
        }}>
          {COLLECTIONS.map((c, i) => (
            <CollectionCard key={i} index={i} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({ name, it, count, desc, ph, index }) {
  const [hover, setHover] = useState(false);
  return (
    <article
      className="glass shimmerable"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding:0, overflow:'hidden', cursor:'default',
        transform: hover ? 'translateY(-6px)' : 'translateY(0)',
        transition:'transform .5s cubic-bezier(.2,.8,.2,1), box-shadow .5s',
        boxShadow: hover
          ? 'inset 0 1px 0 rgba(245,236,208,0.16), 0 30px 60px -20px rgba(231,201,112,0.25), 0 0 0 0.5px rgba(231,201,112,0.4)'
          : 'inset 0 1px 0 rgba(245,236,208,0.08), 0 24px 60px -20px rgba(0,0,0,0.65)',
      }}>
      <div style={{ position:'relative', aspectRatio:'4/3' }}>
        <div className="ph" data-label={ph} style={{ position:'absolute', inset:0, borderRadius:0 }}/>
        <div style={{
          position:'absolute', inset:0,
          background: hover
            ? 'radial-gradient(ellipse at 50% 100%, rgba(231,201,112,0.25), transparent 70%), linear-gradient(180deg, transparent 50%, rgba(5,7,20,0.85))'
            : 'linear-gradient(180deg, transparent 50%, rgba(5,7,20,0.85))',
          transition:'background .6s',
        }}/>
        <span className="eyebrow" style={{ position:'absolute', top:18, left:20, color:'var(--gold-2)' }}>
          {String(index+1).padStart(2,'0')} · {count}
        </span>
      </div>
      <div style={{ padding:'24px 26px 28px' }}>
        <div className="serif" style={{ fontSize:11, fontStyle:'italic', color:'var(--gold-2)', marginBottom:6, letterSpacing:'0.04em' }}>
          {it}
        </div>
        <h3 className="serif" style={{ fontSize:28, fontWeight:400, lineHeight:1.05, margin:'0 0 12px', color:'#f5ecd0' }}>
          {name}
        </h3>
        <p style={{ fontSize:13.5, color:'rgba(245,236,208,0.6)', lineHeight:1.6, margin:0 }}>
          {desc}
        </p>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENING PROGRAMME
const EVENTS = [
  { date:"OCT 24", day:"Friday",   time:"21:00 — 02:00", title:"Masquerade in the Hall of Saints",      kind:"Gala",      blurb:"Black tie, gold leaf, and a string sextet from La Fenice.",          price:"From €280" },
  { date:"OCT 28", day:"Tuesday",  time:"19:30",          title:"Vespers for a Painted Ceiling",          kind:"Concert",   blurb:"Choral works by Allegri and Lotti beneath the Atrium oculus.",        price:"€65" },
  { date:"NOV 02", day:"Sunday",   time:"23:00",          title:"After Hours: Caravaggio's Doubt",        kind:"Lecture",   blurb:"A midnight reading by candlelight, accompanied by a single cello.",   price:"€40" },
  { date:"NOV 09", day:"Sunday",   time:"04:30 — 06:30", title:"Dawn Watch in the Nocturne Gallery",     kind:"Viewing",   blurb:"For early risers. The collection seen as the first light arrives.",    price:"€55" },
  { date:"NOV 14", day:"Friday",   time:"22:00",          title:"L'Incoronazione di Poppea (in concert)", kind:"Opera",     blurb:"Monteverdi's late opera, staged among the marble of the Atrium.",      price:"From €120" },
];

function Programme() {
  const [filter, setFilter] = useState("All");
  const kinds = ["All", ...Array.from(new Set(EVENTS.map(e => e.kind)))];
  const filtered = filter === "All" ? EVENTS : EVENTS.filter(e => e.kind === filter);
  return (
    <section id="programme" style={{ padding:'140px 24px', position:'relative' }}>
      <div style={{ maxWidth:1240, margin:'0 auto' }}>
        <div className="reveal" style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:24, marginBottom:50 }}>
          <div>
            <div className="label" style={{ marginBottom:14 }}>Il Programma Serale</div>
            <h2 className="serif" style={{ fontSize:'clamp(40px, 5.5vw, 76px)', fontWeight:400, fontStyle:'italic', margin:0, letterSpacing:'-0.015em', color:'#f5ecd0', lineHeight:1.18, paddingBottom:'0.15em' }}>
              The Evening Programme
            </h2>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {kinds.map(k => (
              <button key={k} onClick={() => setFilter(k)} className="gbtn gbtn-sm" style={{
                padding:'8px 14px', fontSize:10, letterSpacing:'0.18em',
                background: filter === k ? 'rgba(212,175,55,0.18)' : 'transparent',
                borderColor: filter === k ? 'rgba(231,201,112,0.7)' : 'rgba(245,236,208,0.18)',
              }}>{k}</button>
            ))}
          </div>
        </div>

        <div className="reveal glass-strong" style={{ padding:'10px 0', borderRadius:18 }}>
          {filtered.map((ev, i) => (
            <EventRow key={ev.title} ev={ev} last={i === filtered.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EventRow({ ev, last }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display:'grid', gridTemplateColumns:'140px 1fr 200px 160px',
        alignItems:'center', gap:32, padding:'28px 36px',
        borderBottom: last ? 'none' : '0.5px solid rgba(212,175,55,0.12)',
        position:'relative',
        background: hover ? 'linear-gradient(90deg, rgba(212,175,55,0.06), transparent 60%)' : 'transparent',
        transition:'background .4s',
      }}>
      <div>
        <div className="serif" style={{ fontSize:32, fontWeight:400, color: hover ? '#e7c970' : '#f5ecd0', transition:'color .4s', letterSpacing:'-0.01em' }}>
          {ev.date}
        </div>
        <div className="eyebrow" style={{ marginTop:4 }}>{ev.day}</div>
      </div>
      <div>
        <div className="eyebrow" style={{ color:'var(--gold-2)', marginBottom:8 }}>{ev.kind} · {ev.time}</div>
        <h3 className="serif" style={{ fontSize:24, fontWeight:400, fontStyle:'italic', margin:'0 0 6px', color:'#f5ecd0', letterSpacing:'-0.005em' }}>
          {ev.title}
        </h3>
        <p style={{ fontSize:13, color:'rgba(245,236,208,0.6)', margin:0, lineHeight:1.5 }}>{ev.blurb}</p>
      </div>
      <div className="serif" style={{ fontSize:18, fontStyle:'italic', color:'rgba(245,236,208,0.7)' }}>
        {ev.price}
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <button className="gbtn gbtn-sm" style={{
          opacity: hover ? 1 : 0.7,
          borderColor: hover ? 'rgba(231,201,112,0.85)' : 'rgba(245,236,208,0.18)',
        }}>Reserve</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MEMBERSHIP — "The Order of the Night"
const TIERS = [
  {
    name:"Patron",     it:"Patrono",
    price:"€180",      cadence:"per year",
    pitch:"An invitation to the Order.",
    perks:[
      "Unlimited evening admission",
      "Member's preview of new exhibitions",
      "10% at the museum atelier",
      "The Nocturne, monthly",
    ],
  },
  {
    name:"Nocturne",   it:"Notturno",
    price:"€480",      cadence:"per year",
    featured:true,
    pitch:"For those who keep our hours.",
    perks:[
      "Everything in Patron",
      "Two seats at every opening",
      "Quarterly candlelit private tour",
      "Reserve before public release",
      "The Order's wax seal & member's sigil",
    ],
  },
  {
    name:"Benefactor", it:"Benefattore",
    price:"€2,400",    cadence:"per year",
    pitch:"Your name, on the wall.",
    perks:[
      "Everything in Nocturne",
      "Curator's salon, twice yearly",
      "Two gala invitations",
      "Acquisitions committee briefing",
      "Recognition in the Atrium",
    ],
  },
  {
    name:"Keeper of the Flame", it:"Custode",
    price:"By invitation", cadence:"",
    pitch:"The museum's closest circle.",
    perks:[
      "Everything in Benefactor",
      "Private after-hours, by appointment",
      "Attend any acquisition",
      "A key. Not metaphorical.",
    ],
  },
];

function Membership() {
  return (
    <section id="order" style={{ padding:'140px 24px', position:'relative' }}>
      <div style={{ maxWidth:1240, margin:'0 auto' }}>
        <div className="reveal" style={{ textAlign:'center', marginBottom:64 }}>
          <div className="label" style={{ marginBottom:18 }}>Membership</div>
          <h2 className="serif" style={{ fontSize:'clamp(40px, 5.5vw, 76px)', fontWeight:400, fontStyle:'italic', margin:0, letterSpacing:'-0.015em', color:'#f5ecd0', lineHeight:1.18, paddingBottom:'0.15em' }}>
            The Order of the Night
          </h2>
          <p className="serif" style={{ fontSize:18, fontStyle:'italic', color:'rgba(245,236,208,0.6)', maxWidth:560, margin:'18px auto 0', fontWeight:300 }}>
            Four tiers of patronage, each with its own particular silence.
          </p>
        </div>

        <div className="reveal" style={{
          display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:18,
        }}>
          {TIERS.map((t, i) => <TierCard key={t.name} tier={t} />)}
        </div>
      </div>
    </section>
  );
}

function TierCard({ tier }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={tier.featured ? "glass-strong shimmerable" : "glass shimmerable"}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding:'36px 32px 32px', display:'flex', flexDirection:'column',
        position:'relative', minHeight:520,
        transform: hover ? 'translateY(-6px)' : 'none',
        transition:'transform .5s, box-shadow .5s',
        boxShadow: tier.featured
          ? 'inset 0 1px 0 rgba(245,236,208,0.18), 0 0 0 0.5px rgba(231,201,112,0.55), 0 30px 80px -20px rgba(231,201,112,0.3)'
          : (hover ? 'inset 0 1px 0 rgba(245,236,208,0.12), 0 30px 60px -20px rgba(231,201,112,0.2)' : ''),
      }}>
      {tier.featured && (
        <div style={{
          position:'absolute', top:-1, left:'50%', transform:'translate(-50%, -50%)',
          background:'linear-gradient(180deg, #e7c970, #d4af37)', color:'#050714',
          fontFamily:'var(--mono)', fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase',
          padding:'6px 14px', borderRadius:999, fontWeight:600,
        }}>Most Chosen</div>
      )}
      <div className="serif" style={{ fontSize:13, fontStyle:'italic', color:'var(--gold-2)', marginBottom:6 }}>
        {tier.it}
      </div>
      <h3 className="serif" style={{ fontSize:32, fontWeight:400, margin:'0 0 8px', color:'#f5ecd0', letterSpacing:'-0.01em' }}>
        {tier.name}
      </h3>
      <p style={{ fontSize:13, fontStyle:'italic', color:'rgba(245,236,208,0.6)', margin:'0 0 24px', minHeight:38, fontFamily:'var(--serif)' }}>
        {tier.pitch}
      </p>
      <hr className="gold-rule" style={{ margin:'0 0 24px' }}/>
      <div style={{ marginBottom:28 }}>
        <div className="serif" style={{ fontSize:36, fontWeight:400, color:'#f5ecd0', lineHeight:1 }}>
          {tier.price}
        </div>
        {tier.cadence && <div className="eyebrow" style={{ marginTop:6 }}>{tier.cadence}</div>}
      </div>
      <ul style={{ listStyle:'none', padding:0, margin:'0 0 28px', display:'flex', flexDirection:'column', gap:12, flex:1 }}>
        {tier.perks.map(p => (
          <li key={p} style={{ display:'flex', gap:12, alignItems:'flex-start', fontSize:13.5, color:'rgba(245,236,208,0.78)', lineHeight:1.5 }}>
            <span style={{ flex:'0 0 14px', height:14, marginTop:3, borderRadius:'50%',
              background:'radial-gradient(circle, #e7c970 0%, rgba(212,175,55,0.4) 60%, transparent 80%)',
              boxShadow:'0 0 8px rgba(231,201,112,0.4)',
            }}/>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <button className={`gbtn ${tier.featured ? 'gbtn-primary' : 'gbtn-ghost'}`}>
        {tier.price.startsWith("By") ? "Request Invitation" : "Become a Member"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VISIT
function Visit() {
  return (
    <section id="visit" style={{ padding:'140px 24px', position:'relative' }}>
      <div style={{ maxWidth:1240, margin:'0 auto' }}>
        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, borderRadius:18, overflow:'hidden' }}>
          <div className="glass-strong" style={{
            padding:'64px 56px', borderRadius:0,
            background:'linear-gradient(180deg, rgba(20,26,54,0.7), rgba(10,14,31,0.85))',
          }}>
            <div className="label" style={{ marginBottom:18 }}>Plan your evening</div>
            <h2 className="serif" style={{ fontSize:'clamp(34px, 4vw, 56px)', fontWeight:400, fontStyle:'italic', margin:'0 0 44px', letterSpacing:'-0.01em', color:'#f5ecd0', lineHeight:1.18, paddingBottom:'0.15em' }}>
              Until Dawn
            </h2>
            <InfoRow label="Hours">
              Tuesday–Sunday · 18:00 — 00:00<br/>
              Friday & Saturday · 18:00 — 02:00<br/>
              Closed Mondays, except by candlelight reservation
            </InfoRow>
            <InfoRow label="Address">
              Calle dei Lampioni 14<br/>
              Cannaregio, Venezia · 30121
            </InfoRow>
            <InfoRow label="Admission">
              Standard · €28 · Evening · €34 · Late (after 22:00) · €42<br/>
              Members of the Order · always free
            </InfoRow>
            <InfoRow label="Accessibility">
              Step-free entry from Fondamenta Misericordia. Quiet hours Tuesday 18–20:00. Audio descriptions available.
            </InfoRow>
            <div style={{ marginTop:36, display:'flex', gap:14, flexWrap:'wrap' }}>
              <button className="gbtn gbtn-primary">Reserve Tickets</button>
              <button className="gbtn gbtn-ghost">Get Directions</button>
            </div>
          </div>
          <div style={{ position:'relative', minHeight:600 }}>
            <div className="ph" data-label="[ Atmospheric night exterior — palazzo facade with lit windows reflected in canal ]" style={{ position:'absolute', inset:0, borderRadius:0 }}/>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, rgba(5,7,20,0.5), transparent 30%, transparent 70%, rgba(5,7,20,0.5))' }}/>
            {/* compass */}
            <svg style={{ position:'absolute', bottom:24, right:24, opacity:0.6 }} width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="34" fill="none" stroke="rgba(231,201,112,0.4)" strokeWidth="0.5"/>
              <circle cx="36" cy="36" r="2" fill="#e7c970"/>
              <line x1="36" y1="6" x2="36" y2="14" stroke="#e7c970" strokeWidth="1"/>
              <text x="36" y="5" textAnchor="middle" fontFamily="DM Mono" fontSize="8" fill="#e7c970">N</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, children }) {
  return (
    <div style={{ marginBottom:24, paddingBottom:24, borderBottom:'0.5px solid rgba(212,175,55,0.12)' }}>
      <div className="eyebrow" style={{ color:'var(--gold-2)', marginBottom:10 }}>{label}</div>
      <div style={{ fontSize:14, color:'rgba(245,236,208,0.78)', lineHeight:1.7 }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWSLETTER + FOOTER
function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <section style={{ padding:'120px 24px', position:'relative' }}>
      <div className="reveal glass-strong" style={{
        maxWidth:820, margin:'0 auto', padding:'72px 56px', textAlign:'center',
        borderRadius:24, position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', top:-100, left:'50%', transform:'translateX(-50%)',
          width:300, height:300, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(231,201,112,0.25), transparent 60%)',
          pointerEvents:'none',
        }}/>
        <div className="label" style={{ marginBottom:18 }}>Iscrivetevi</div>
        <h2 className="serif" style={{ fontSize:'clamp(34px, 4.4vw, 56px)', fontWeight:400, fontStyle:'italic', margin:'0 0 26px', letterSpacing:'-0.015em', color:'#f5ecd0', lineHeight:1.18, paddingBottom:'0.15em' }}>
          The Nocturne
        </h2>
        <p className="serif" style={{ fontSize:18, fontStyle:'italic', color:'rgba(245,236,208,0.65)', maxWidth:480, margin:'0 auto 36px', fontWeight:300, lineHeight:1.5 }}>
          A monthly missive — exhibitions, late openings, the occasional poem — delivered at the stroke of midnight.
        </p>
        {submitted ? (
          <div className="serif" style={{ fontSize:22, fontStyle:'italic', color:'var(--gold-2)' }}>
            Until midnight, then. ✦
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }} style={{
            display:'flex', gap:12, maxWidth:520, margin:'0 auto', flexWrap:'wrap',
          }}>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="your@correspondence.it"
              className="field"
              style={{ flex:1, minWidth:240, textAlign:'center' }}
            />
            <button className="gbtn gbtn-primary" type="submit">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding:'80px 24px 60px', position:'relative', borderTop:'0.5px solid rgba(212,175,55,0.18)', marginTop:60 }}>
      <div style={{ maxWidth:1240, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:48, marginBottom:60 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
              <Crescent size={22} />
              <span className="serif" style={{ fontSize:24 }}>Museo della Notte</span>
            </div>
            <p className="serif" style={{ fontStyle:'italic', fontSize:15, color:'rgba(245,236,208,0.55)', maxWidth:380, lineHeight:1.5, fontWeight:300 }}>
              A sanctuary for art seen by candlelight, moonlight, and the slow burn of gilt.
            </p>
          </div>
          <FooterCol title="Visit" items={["Hours","Admission","Accessibility","Group Visits"]}/>
          <FooterCol title="Discover" items={["Exhibitions","Collections","Programme","Editions"]}/>
          <FooterCol title="Order of the Night" items={["Membership","Patronage","Galas","Press"]}/>
        </div>
        <hr className="gold-rule" />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32, flexWrap:'wrap', gap:18 }}>
          <div className="eyebrow" style={{ color:'rgba(245,236,208,0.5)' }}>
            © MMXXVI · Calle dei Lampioni 14 · Venezia
          </div>
          <div className="serif" style={{ fontStyle:'italic', fontSize:14, color:'var(--gold-2)', letterSpacing:'0.04em' }}>
            Nox tegit, lux revelat.
          </div>
          <div style={{ display:'flex', gap:18, color:'rgba(245,236,208,0.5)' }}>
            <a href="#" style={{ color:'inherit', textDecoration:'none', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase' }}>Instagram</a>
            <a href="#" style={{ color:'inherit', textDecoration:'none', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase' }}>Privacy</a>
            <a href="#" style={{ color:'inherit', textDecoration:'none', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase' }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div className="eyebrow" style={{ color:'var(--gold-2)', marginBottom:14 }}>{title}</div>
      <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:8 }}>
        {items.map(i => <li key={i}><a href="#" style={{ color:'rgba(245,236,208,0.7)', textDecoration:'none', fontSize:13.5 }}>{i}</a></li>)}
      </ul>
    </div>
  );
}

Object.assign(window, { Nav, Hero, Featured, Collections, Programme, Membership, Visit, Newsletter, Footer });
