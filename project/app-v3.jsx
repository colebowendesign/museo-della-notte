// Museo della Notte v3 — full-bleed video, nocturnal palette
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "ivory-gold",
  "fontPair": "cinzel-cormorant-inter",
  "cursorTrail": true,
  "ornaments": true,
  "videoDim": 0.55,
  "glassBlur": 14
}/*EDITMODE-END*/;

const PALETTES = {
  "ivory-gold":     { paper:"#f3ead4", gold:"#d6a544", goldBright:"#f1c66a", goldDeep:"#9a7224", oxblood:"#9b1f24" },
  "moonlit-silver": { paper:"#e8e6dc", gold:"#bfb37a", goldBright:"#d8cb8a", goldDeep:"#7a724a", oxblood:"#5e6a82" },
  "ember-rose":     { paper:"#f4e4d4", gold:"#e08a4a", goldBright:"#f4a766", goldDeep:"#9a4a1a", oxblood:"#7a1a2a" },
  "cathedral":      { paper:"#ecdfb8", gold:"#c8924a", goldBright:"#dca858", goldDeep:"#8a5a1a", oxblood:"#3a2a6a" },
};

const FONT_PAIRS = {
  "cinzel-cormorant-inter": { display:"'Cinzel', serif", serif:"'Cormorant Garamond', serif", sans:"'Inter', system-ui, sans-serif" },
  "playfair-eb-inter":      { display:"'Playfair Display', serif", serif:"'EB Garamond', serif", sans:"'Inter', system-ui, sans-serif" },
  "cormorant-only":         { display:"'Cormorant Garamond', serif", serif:"'Cormorant Garamond', serif", sans:"'Inter', system-ui, sans-serif" },
};

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

function useFirefly(enabled) {
  useEffect(() => {
    const el = document.getElementById('firefly');
    if (!el) return;
    if (!enabled) { el.style.opacity = '0'; return; }
    let x=0,y=0,tx=0,ty=0,raf;
    const move = (e) => { tx = e.clientX; ty = e.clientY; el.style.opacity = '1'; };
    const leave = () => { el.style.opacity = '0'; };
    const loop = () => {
      x += (tx - x) * 0.14; y += (ty - y) * 0.14;
      el.style.left = x + 'px'; el.style.top  = y + 'px';
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    loop();
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', leave); cancelAnimationFrame(raf); };
  }, [enabled]);
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV — floating glass strip
function Nav({ onReserve }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav style={{
      position:'fixed', top:18, left:'50%', transform:'translateX(-50%)', zIndex:100,
      width:'min(1480px, calc(100% - 36px))',
      transition:'all .4s ease',
    }}>
      <div className={scrolled ? 'glass-strong' : 'glass'} style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px 24px', borderRadius:999,
      }}>
        <a href="#top" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none', color:'var(--paper)' }}>
          <Or.Crescent size={20} color="var(--gold-bright)"/>
          <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
            <span className="display legible" style={{ fontSize:13, fontWeight:600, letterSpacing:'0.18em' }}>MUSEO</span>
            <span className="serif legible" style={{ fontSize:13, fontStyle:'italic', color:'var(--gold-bright)', letterSpacing:'0.04em', marginTop:2 }}>della Notte</span>
          </div>
        </a>
        <div className="hide-sm" style={{ display:'flex', gap:32, alignItems:'center' }}>
          {['Exhibitions','Collections','Programme','Membership','Visit'].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="display legible" style={{
              color:'var(--paper)', textDecoration:'none',
              fontSize:11, letterSpacing:'0.22em', fontWeight:500,
              borderBottom: '1px solid transparent',
              paddingBottom:2, transition:'border-color .3s, color .3s',
            }} onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold-bright)'; e.currentTarget.style.color='var(--gold-bright)';}}
               onMouseLeave={e=>{e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.color='var(--paper)';}}>
              {l.toUpperCase()}
            </a>
          ))}
        </div>
        <button className="btn btn-gold btn-sm" onClick={onReserve}>RESERVE</button>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO — full-bleed, content centered/left, video already behind body
function Hero({ onReserve, ornaments }) {
  return (
    <section id="top" style={{
      position:'relative', minHeight:'100vh',
      padding:'140px 48px 80px',
      display:'flex', flexDirection:'column', justifyContent:'center',
    }}>
      {/* moonbeam rays */}
      {ornaments && <div className="rays"/>}

      {/* compass top-left */}
      {ornaments && (
        <div style={{ position:'absolute', top:120, left:48, opacity:0.5 }}>
          <Or.CompassRose size={120} color="var(--gold-bright)"/>
        </div>
      )}

      <div style={{ maxWidth:1200, margin:'0 auto', width:'100%', position:'relative' }}>
        <div className="reveal in" style={{ display:'flex', alignItems:'center', gap:14, marginBottom:36, justifyContent:'center' }}>
          <hr className="line-gold" style={{ width:80 }}/>
          <span className="label legible">EST · MMXXIV — VENEZIA</span>
          <hr className="line-gold" style={{ width:80 }}/>
        </div>

        <div className="reveal in" style={{ position:'relative', textAlign:'center', marginBottom:36 }}>
          <h1 className="display legible-strong" style={{
            fontSize:'clamp(72px, 13vw, 200px)', lineHeight:0.86, fontWeight:600,
            margin:0, letterSpacing:'-0.02em',
            color:'var(--paper)',
            textTransform:'uppercase',
          }}>
            MVSEO
          </h1>
          {/* "della" italic across */}
          <div className="serif" style={{
            fontStyle:'italic', fontSize:'clamp(40px, 6.5vw, 96px)',
            color:'var(--gold-bright)', fontWeight:400,
            lineHeight:1, margin:'-0.18em 0 -0.05em',
            textShadow:'0 0 40px rgba(241,198,106,0.5), 0 2px 30px rgba(0,0,0,0.7)',
          }}>
            della
          </div>
          <h1 className="display legible-strong" style={{
            fontSize:'clamp(72px, 13vw, 200px)', lineHeight:0.86, fontWeight:600,
            margin:0, letterSpacing:'-0.02em',
            background: 'linear-gradient(180deg, #f1c66a 0%, #d6a544 60%, #9a7224 100%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform:'uppercase',
            filter: 'drop-shadow(0 4px 30px rgba(0,0,0,0.7))',
          }}>
            NOTTE
          </h1>
        </div>

        <div className="reveal in" style={{ textAlign:'center', marginBottom:44 }}>
          <p className="serif legible-strong" style={{ fontSize:'clamp(20px, 2.2vw, 26px)', lineHeight:1.45, fontStyle:'italic', color:'var(--paper-soft)', margin:'0 auto', maxWidth:680, fontWeight:400 }}>
            Where the night keeps its treasures —<br/>
            <span style={{ color:'var(--gold-bright)' }}>a Renaissance, viewed by candlelight.</span>
          </p>
        </div>

        <div className="reveal in" style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center', marginBottom:80 }}>
          <button className="btn btn-gold" onClick={onReserve}>Plan an Evening Visit</button>
          <button className="btn" onClick={() => document.getElementById('exhibitions')?.scrollIntoView({behavior:'smooth'})}>
            Current Exhibitions
          </button>
        </div>
      </div>

      {/* lower meta strip */}
      <div className="reveal in" style={{
        position:'absolute', bottom:36, left:48, right:48,
        display:'flex', justifyContent:'space-between', gap:24, alignItems:'flex-end',
      }}>
        <div className="legible">
          <div className="label" style={{ marginBottom:6 }}>OPEN AT DUSK</div>
          <div className="serif" style={{ fontSize:15, fontStyle:'italic', color:'var(--paper-soft)' }}>18:00 — 02:00 · Cannaregio</div>
        </div>
        <div className="flicker" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <Or.Candle size={32} color="var(--gold-bright)"/>
          <div className="label legible" style={{ fontSize:9 }}>SCROLL</div>
        </div>
        <div className="legible" style={{ textAlign:'right' }}>
          <div className="label" style={{ marginBottom:6 }}>NOW ON VIEW</div>
          <div className="serif" style={{ fontSize:15, fontStyle:'italic', color:'var(--paper-soft)' }}>Nocturnes in Oil · Halls III–VII</div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MARQUEE
function Marquee() {
  const items = ['NOX TEGIT, LUX REVELAT', '✦', 'EST · MMXXIV', '✦', 'VENEZIA · CANNAREGIO', '✦', 'APERTI A LUME DI CANDELA', '✦', 'OPEN AT DUSK · CLOSED MONDAYS', '✦'];
  return (
    <div className="glass-faint" style={{
      borderLeft:0, borderRight:0, borderRadius:0,
      padding:'14px 0', overflow:'hidden',
    }}>
      <div style={{ display:'flex', gap:48, whiteSpace:'nowrap', animation:'mq 50s linear infinite' }}>
        {Array.from({length:4}).flatMap((_,i)=>items.map((t,j)=>(
          <span key={`${i}-${j}`} className="display legible" style={{ fontSize:12, letterSpacing:'0.3em', fontWeight:500, color: t==='✦' ? 'var(--gold-bright)' : 'var(--paper-soft)' }}>{t}</span>
        )))}
      </div>
      <style>{`@keyframes mq { from{ transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED — large image left, glass copy panel right
const FEATURED = {
  kicker: "ORA IN MOSTRA — NOW ON VIEW",
  dates: "12 OCT — 04 FEB",
  curator: "Curated by Lucia Marchetti & Tomás Aragón",
  hours: "Galleries open 19:00 · Last entry 23:30",
  rooms: "Halls III–VII",
  body: "From Caravaggio's late students to the candlelit sacristies of Genoese workshops, Nocturnes in Oil follows the painters who worked the dimmest hours — and asks what survives when the only witness is a single flame. The exhibition is presented in five movements, each room darker than the last."
};

function Featured({ onReserve, ornaments }) {
  return (
    <section id="exhibitions" style={{ padding:'140px 48px 100px', position:'relative' }}>
      <div style={{ maxWidth:1480, margin:'0 auto' }}>
        <div className="reveal" style={{ display:'flex', alignItems:'baseline', gap:24, marginBottom:48 }}>
          <Or.RomanNumeral size={64} color="var(--gold-bright)" style={{ lineHeight:0.9, textShadow:'0 0 30px rgba(241,198,106,0.4)' }}>I</Or.RomanNumeral>
          <hr className="line-gold" style={{ flex:1 }}/>
          <span className="label legible">{FEATURED.kicker}</span>
          <hr className="line-gold" style={{ width:60 }}/>
          <span className="label legible">{FEATURED.dates}</span>
        </div>

        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:48, alignItems:'stretch' }}>
          <div style={{ position:'relative', minHeight:560 }}>
            <div className="ph ph-frame" data-label="[ MARQUEE — Caravaggio-school nocturne, candlelit canvas, deep umber ]"
                 style={{ position:'absolute', inset:0 }}/>
            {/* tag overlay */}
            <div className="glass-strong" style={{
              position:'absolute', bottom:24, left:24,
              padding:'14px 20px', display:'flex', gap:14, alignItems:'center',
              borderRadius:8,
            }}>
              <Or.Star8 size={20} color="var(--gold-bright)"/>
              <div>
                <div className="label" style={{ marginBottom:2 }}>23 WORKS · {FEATURED.rooms}</div>
                <div className="serif" style={{ fontSize:14, fontStyle:'italic', color:'var(--paper-soft)' }}>{FEATURED.curator}</div>
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding:'48px 44px', borderRadius:8, display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h2 className="display legible-strong" style={{
              fontSize:'clamp(36px, 4.5vw, 64px)', lineHeight:1.05, margin:'0 0 4px',
              fontWeight:600, color:'var(--paper)', letterSpacing:'-0.01em', textTransform:'uppercase',
            }}>
              Nocturnes
            </h2>
            <div className="serif legible-strong" style={{
              fontSize:'clamp(28px, 3vw, 48px)', fontStyle:'italic', fontWeight:400,
              color:'var(--gold-bright)', marginBottom:24, lineHeight:1.05, letterSpacing:'-0.005em',
              paddingBottom:'0.15em',
            }}>
              in Oil.
            </div>
            <p className="serif legible" style={{ fontSize:20, lineHeight:1.45, fontStyle:'italic', color:'var(--paper-soft)', margin:'0 0 24px', fontWeight:400 }}>
              Twenty-three Baroque canvases, lit only by the flame their painters worked beside.
            </p>
            <p className="dropcap legible" style={{ fontSize:15, lineHeight:1.7, color:'var(--paper-mute)', margin:'0 0 32px' }}>
              {FEATURED.body}
            </p>
            <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
              <button className="btn btn-gold" onClick={onReserve}>Reserve Tickets</button>
              <span className="label legible">{FEATURED.hours}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTIONS — glass cards with warm glow on hover
const COLLECTIONS = [
  { name:"The Hall of Saints",       it:"Sala dei Santi",         count:"127 works",    desc:"Devotional panels, reliquaries, and gilt altarpieces from the Counter-Reformation south.", ph:"[ Gilded altarpiece, candle-glow, gold leaf ]" },
  { name:"The Moonlit Atrium",       it:"Atrio della Luna",       count:"42 sculptures",desc:"Marble figures arranged beneath an oculus open to the night sky.",                          ph:"[ Marble in shadowed alcove, single shaft of light ]" },
  { name:"Chamber of Masks",         it:"Camera delle Maschere",  count:"89 artifacts", desc:"Venetian carnival masks, opera costumes, theatrical props.",                                ph:"[ Bauta mask, low-key, gilt detail ]" },
  { name:"The Nocturne Gallery",     it:"Galleria Notturna",      count:"54 paintings", desc:"Night scenes from Genoa, Naples, and the Spanish low countries.",                          ph:"[ Dutch nocturne, lantern-lit, deep umber ]" },
  { name:"Sculptures by Candlelight",it:"Sculture a Lume",        count:"31 works",     desc:"A single chamber. A single candle. Marble, hourly relit.",                                  ph:"[ Bust on plinth, candle in foreground ]" },
  { name:"The Gilded Cabinet",       it:"Stanza Dorata",          count:"206 objects",  desc:"Reliquaries, automata, the museum's smallest treasures.",                                  ph:"[ Cabinet of curiosities, gold objects ]" },
];

function Collections({ ornaments }) {
  return (
    <section id="collections" style={{ padding:'140px 48px', position:'relative' }}>
      {ornaments && (
        <>
          <div style={{ position:'absolute', top:60, left:60, opacity:0.45 }}><Or.Star8 size={32} color="var(--gold)"/></div>
          <div style={{ position:'absolute', top:80, right:80, opacity:0.4 }}><Or.Wreath size={140} color="var(--gold)"/></div>
        </>
      )}

      <div style={{ maxWidth:1480, margin:'0 auto' }}>
        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:60, marginBottom:80, alignItems:'flex-end' }}>
          <div>
            <div className="label legible" style={{ marginBottom:24 }}>II — LE COLLEZIONI PERMANENTI</div>
            <h2 className="display legible-strong" style={{
              fontSize:'clamp(48px, 7vw, 112px)', lineHeight:0.95, margin:0,
              fontWeight:600, color:'var(--paper)', letterSpacing:'-0.015em', textTransform:'uppercase',
            }}>
              SIX ROOMS,
            </h2>
            <div className="serif legible-strong" style={{
              fontSize:'clamp(48px, 7vw, 112px)', fontStyle:'italic', fontWeight:400,
              color:'var(--gold-bright)', lineHeight:1.05, letterSpacing:'-0.01em', paddingBottom:'0.15em',
            }}>
              kept dark.
            </div>
          </div>
          <p className="serif legible" style={{ fontSize:20, lineHeight:1.5, fontStyle:'italic', color:'var(--paper-soft)', margin:0, paddingBottom:16, fontWeight:400, maxWidth:500, justifySelf:'flex-end' }}>
            The permanent collection is housed in six wings, each with its own temperament & its own hour. Wander them in any order — the museum has no preferred path.
          </p>
        </div>

        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:24 }}>
          {COLLECTIONS.map((c, i) => <CollectionCard key={i} index={i} {...c} />)}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({ name, it, count, desc, ph, index }) {
  const [hover, setHover] = useState(false);
  return (
    <article
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className="glass"
      style={{
        borderRadius:8, overflow:'hidden',
        transform: hover ? 'translateY(-6px)' : 'translateY(0)',
        transition:'transform .5s cubic-bezier(.2,.8,.2,1), box-shadow .5s, border-color .5s',
        boxShadow: hover
          ? '0 0 0 1px rgba(241,198,106,0.5), 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(241,198,106,0.2)'
          : '0 30px 60px rgba(0,0,0,0.45)',
        borderColor: hover ? 'rgba(241,198,106,0.5)' : 'rgba(214,165,68,0.22)',
        cursor:'default',
      }}>
      <div className="ph" data-label={ph} style={{ aspectRatio:'4/3' }}/>
      <div style={{ padding:'22px 24px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
          <span className="label">{String(index+1).padStart(2,'0')} · {count}</span>
          <Or.Star4 size={12} color="var(--gold-bright)"/>
        </div>
        <h3 className="display legible" style={{ fontSize:18, fontWeight:600, margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.02em', lineHeight:1.1, color:'var(--paper)' }}>
          {name}
        </h3>
        <div className="serif" style={{ fontSize:14, fontStyle:'italic', color:'var(--gold-bright)', marginBottom:10 }}>
          {it}
        </div>
        <p style={{ fontSize:13, color:'var(--paper-mute)', lineHeight:1.5, margin:0 }}>
          {desc}
        </p>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMME — glass event rows
const EVENTS = [
  { date:"24",  mo:"OCT", day:"FRI", time:"21:00 — 02:00", title:"Masquerade in the Hall of Saints",      kind:"GALA",       blurb:"Black tie, gold leaf, and a string sextet from La Fenice. Masks compulsory after the third hour.",     price:"From €280" },
  { date:"28",  mo:"OCT", day:"TUE", time:"19:30",          title:"Vespers for a Painted Ceiling",          kind:"CONCERT",    blurb:"Choral works by Allegri and Lotti beneath the Atrium oculus.",                                          price:"€65" },
  { date:"02",  mo:"NOV", day:"SUN", time:"23:00",          title:"After Hours — Caravaggio's Doubt",       kind:"LECTURE",    blurb:"A midnight reading by candlelight, accompanied by a single cello.",                                     price:"€40" },
  { date:"09",  mo:"NOV", day:"SUN", time:"04:30 — 06:30",  title:"Dawn Watch in the Nocturne Gallery",     kind:"VIEWING",    blurb:"For early risers. The collection seen as the first light arrives — without any spoken word.",            price:"€55" },
  { date:"14",  mo:"NOV", day:"FRI", time:"22:00",          title:"L'Incoronazione di Poppea (in concert)", kind:"OPERA",      blurb:"Monteverdi's late opera, staged among the marble of the Atrium. Two hundred candles. One cellist.",     price:"From €120" },
];

function Programme({ ornaments }) {
  const [filter, setFilter] = useState("ALL");
  const kinds = ["ALL", ...Array.from(new Set(EVENTS.map(e => e.kind)))];
  const filtered = filter === "ALL" ? EVENTS : EVENTS.filter(e => e.kind === filter);
  return (
    <section id="programme" style={{ padding:'140px 48px', position:'relative' }}>
      <div style={{ maxWidth:1480, margin:'0 auto' }}>
        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', gap:32, alignItems:'flex-end', marginBottom:64 }}>
          <Or.RomanNumeral size={120} color="var(--gold-bright)" style={{ lineHeight:0.85, textShadow:'0 0 40px rgba(241,198,106,0.4)' }}>III</Or.RomanNumeral>
          <div>
            <div className="label legible" style={{ marginBottom:14 }}>IL PROGRAMMA SERALE</div>
            <h2 className="display legible-strong" style={{ fontSize:'clamp(40px, 5.5vw, 84px)', lineHeight:0.95, margin:0, fontWeight:600, textTransform:'uppercase', letterSpacing:'-0.01em', color:'var(--paper)' }}>
              The Evening
            </h2>
            <div className="serif legible-strong" style={{ fontSize:'clamp(40px, 5.5vw, 84px)', fontStyle:'italic', color:'var(--gold-bright)', lineHeight:1.05, letterSpacing:'-0.01em', paddingBottom:'0.15em' }}>
              Programme.
            </div>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', justifyContent:'flex-end', maxWidth:240 }}>
            {kinds.map(k => (
              <button key={k} onClick={() => setFilter(k)} className="btn btn-sm" style={{
                background: filter === k ? 'var(--gold-bright)' : 'rgba(8,9,16,0.42)',
                color: filter === k ? '#1a1208' : 'var(--paper)',
                borderColor: filter === k ? 'var(--gold-bright)' : 'rgba(243,234,212,0.45)',
                padding:'6px 12px', fontSize:9,
              }}>{k}</button>
            ))}
          </div>
        </div>

        <div className="reveal glass" style={{ borderRadius:8, overflow:'hidden' }}>
          {filtered.map((ev, i) => <EventRow key={ev.title} ev={ev} last={i === filtered.length - 1}/>)}
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
        display:'grid', gridTemplateColumns:'130px 80px 1fr 180px 140px',
        alignItems:'center', gap:32, padding:'28px 28px',
        borderBottom: last ? 'none' : '1px solid rgba(243,234,212,0.12)',
        background: hover ? 'rgba(241,198,106,0.06)' : 'transparent',
        transition:'background .3s',
      }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:8, color:'var(--paper)' }}>
        <div className="display legible" style={{ fontSize:54, fontWeight:600, lineHeight:1 }}>{ev.date}</div>
        <div>
          <div className="display legible" style={{ fontSize:14, fontWeight:500, letterSpacing:'0.18em' }}>{ev.mo}</div>
          <div className="serif" style={{ fontSize:13, fontStyle:'italic', color:'var(--gold-bright)' }}>{ev.day}</div>
        </div>
      </div>
      <div className="label" style={{ color: hover ? 'var(--gold-bright)' : 'var(--gold)' }}>{ev.kind}</div>
      <div>
        <h3 className="display legible" style={{ fontSize:22, fontWeight:600, margin:'0 0 6px', textTransform:'uppercase', letterSpacing:'0.005em', lineHeight:1.1, color:'var(--paper)' }}>
          {ev.title}
        </h3>
        <p style={{ fontSize:13, lineHeight:1.5, margin:0, color:'var(--paper-mute)' }}>{ev.blurb}</p>
      </div>
      <div className="serif" style={{ fontSize:18, fontStyle:'italic', color:'var(--paper-soft)' }}>
        {ev.time}<br/>
        <span style={{ fontSize:14, color:'var(--gold-bright)' }}>{ev.price}</span>
      </div>
      <div style={{ textAlign:'right' }}>
        <button className="btn btn-sm" style={{
          background: hover ? 'var(--gold-bright)' : 'rgba(8,9,16,0.42)',
          borderColor: hover ? 'var(--gold-bright)' : 'rgba(243,234,212,0.45)',
          color: hover ? '#1a1208' : 'var(--paper)',
        }}>Reserve →</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MEMBERSHIP — glass tier cards
const TIERS = [
  { name:"Patron",            it:"Patrono",      price:"€180",          cadence:"per anno",     pitch:"An invitation to the Order.",
    perks:["Unlimited evening admission","Member's preview of new exhibitions","10% at the museum atelier","The Nocturne, monthly"], },
  { name:"Nocturne",          it:"Notturno",     price:"€480",          cadence:"per anno", featured:true, pitch:"For those who keep our hours.",
    perks:["Everything in Patron","Two seats at every opening","Quarterly candlelit private tour","Reserve before public release","The Order's wax seal & member's sigil"], },
  { name:"Benefactor",        it:"Benefattore",  price:"€2,400",        cadence:"per anno",     pitch:"Your name, on the wall.",
    perks:["Everything in Nocturne","Curator's salon, twice yearly","Two gala invitations","Acquisitions committee briefing","Recognition in the Atrium"], },
  { name:"Keeper of the Flame",it:"Custode",     price:"By invitation", cadence:"",             pitch:"The museum's closest circle.",
    perks:["Everything in Benefactor","Private after-hours, by appointment","Attend any acquisition","A key — not metaphorical."], },
];

function Membership({ ornaments }) {
  return (
    <section id="membership" style={{ padding:'140px 48px', position:'relative' }}>
      {ornaments && (
        <>
          <div style={{ position:'absolute', top:60, left:'45%', opacity:0.4 }}><Or.Wreath size={160} color="var(--gold)"/></div>
        </>
      )}
      <div style={{ maxWidth:1480, margin:'0 auto' }}>
        <div className="reveal" style={{ textAlign:'center', marginBottom:80, position:'relative' }}>
          <div className="label legible" style={{ marginBottom:22 }}>IV — MEMBERSHIP</div>
          <h2 className="display legible-strong" style={{ fontSize:'clamp(48px, 7vw, 104px)', lineHeight:0.95, margin:0, fontWeight:600, textTransform:'uppercase', letterSpacing:'-0.01em', color:'var(--paper)' }}>
            THE ORDER
          </h2>
          <div className="serif legible-strong" style={{ fontSize:'clamp(48px, 7vw, 104px)', fontStyle:'italic', color:'var(--gold-bright)', lineHeight:1.05, letterSpacing:'-0.01em', paddingBottom:'0.15em', margin:'4px 0 16px' }}>
            of the Night.
          </div>
          <p className="serif legible" style={{ fontSize:19, lineHeight:1.5, fontStyle:'italic', color:'var(--paper-soft)', maxWidth:560, margin:'0 auto', fontWeight:400 }}>
            Four tiers of patronage, each with its own particular silence.
          </p>
          {ornaments && <div style={{ display:'flex', justifyContent:'center', marginTop:24 }}><Or.Ornate width={260} color="var(--gold-bright)"/></div>}
        </div>

        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20, alignItems:'flex-start' }}>
          {TIERS.map((t, i) => <TierCard key={t.name} tier={t} index={i}/>)}
        </div>
      </div>
    </section>
  );
}

function TierCard({ tier, index }) {
  const [hover, setHover] = useState(false);
  const offsets = [0, -16, 0, -8];
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className={tier.featured ? 'glass-strong' : 'glass'}
      style={{
        padding:'30px 26px 28px',
        borderRadius:10,
        position:'relative',
        transform: hover ? `translateY(${offsets[index] - 6}px)` : `translateY(${offsets[index]}px)`,
        transition:'transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s, border-color .4s',
        boxShadow: tier.featured
          ? '0 0 0 1px rgba(241,198,106,0.5), 0 40px 90px rgba(0,0,0,0.65), 0 0 60px rgba(241,198,106,0.2)'
          : (hover ? '0 0 0 1px rgba(241,198,106,0.4), 0 30px 80px rgba(0,0,0,0.55)' : '0 30px 60px rgba(0,0,0,0.45)'),
        borderColor: tier.featured ? 'rgba(241,198,106,0.5)' : (hover ? 'rgba(241,198,106,0.4)' : 'rgba(214,165,68,0.22)'),
        minHeight:520,
        display:'flex', flexDirection:'column',
      }}>
      {tier.featured && (
        <div style={{
          position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)',
          background: 'linear-gradient(180deg, #f1c66a, #d6a544)', color:'#1a1208',
          fontFamily:'var(--display)', fontSize:9, letterSpacing:'0.3em', fontWeight:600,
          padding:'5px 12px', borderRadius:999,
        }}>MOST CHOSEN</div>
      )}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
        <Or.RomanNumeral size={36} color="var(--gold-bright)" style={{ textShadow: tier.featured ? '0 0 20px rgba(241,198,106,0.5)' : 'none' }}>
          {['I','II','III','IV'][index]}
        </Or.RomanNumeral>
        <Or.Star8 size={18} color="var(--gold-bright)"/>
      </div>
      <div className="serif" style={{ fontSize:14, fontStyle:'italic', color:'var(--gold-bright)', marginBottom:4 }}>
        {tier.it}
      </div>
      <h3 className="display legible" style={{ fontSize:24, fontWeight:600, margin:'0 0 10px', textTransform:'uppercase', letterSpacing:'0.005em', lineHeight:1.1, color:'var(--paper)' }}>
        {tier.name}
      </h3>
      <p className="serif" style={{ fontSize:15, fontStyle:'italic', color:'var(--paper-soft)', margin:'0 0 18px', minHeight:42 }}>
        {tier.pitch}
      </p>
      <hr className="line" style={{ marginBottom:18 }}/>
      <div style={{ marginBottom:22 }}>
        <div className="display legible" style={{ fontSize:32, fontWeight:600, color:'var(--paper)' }}>{tier.price}</div>
        {tier.cadence && <div className="serif" style={{ fontSize:13, fontStyle:'italic', color:'var(--paper-mute)' }}>{tier.cadence}</div>}
      </div>
      <ul style={{ listStyle:'none', padding:0, margin:'0 0 22px', display:'flex', flexDirection:'column', gap:8, flex:1 }}>
        {tier.perks.map(p => (
          <li key={p} style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:13, lineHeight:1.45, color:'var(--paper-soft)' }}>
            <span style={{ flex:'0 0 10px', marginTop:6 }}>
              <Or.Star4 size={8} color="var(--gold-bright)"/>
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <button className={tier.featured ? 'btn btn-gold' : 'btn'}>
        {tier.price.startsWith("By") ? "Request Invitation" : "Become a Member"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VISIT
function Visit({ ornaments }) {
  return (
    <section id="visit" style={{ padding:'140px 48px', position:'relative' }}>
      <div style={{ maxWidth:1480, margin:'0 auto' }}>
        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:48, alignItems:'flex-end', marginBottom:64 }}>
          <Or.RomanNumeral size={120} color="var(--gold-bright)" style={{ lineHeight:0.85, textShadow:'0 0 40px rgba(241,198,106,0.4)' }}>V</Or.RomanNumeral>
          <div>
            <div className="label legible" style={{ marginBottom:14 }}>PIANIFICA LA SERA — PLAN YOUR EVENING</div>
            <h2 className="display legible-strong" style={{ fontSize:'clamp(48px, 7vw, 96px)', lineHeight:0.95, margin:0, fontWeight:600, textTransform:'uppercase', letterSpacing:'-0.01em', color:'var(--paper)' }}>
              UNTIL
            </h2>
            <div className="serif legible-strong" style={{ fontSize:'clamp(48px, 7vw, 96px)', fontStyle:'italic', color:'var(--gold-bright)', lineHeight:1.05, letterSpacing:'-0.01em', paddingBottom:'0.15em' }}>
              Dawn.
            </div>
          </div>
        </div>

        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:32, alignItems:'flex-start' }}>
          <div className="glass" style={{ padding:'40px 44px', borderRadius:8 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:36 }}>
              <InfoBlock label="ORE — HOURS">
                Tuesday–Sunday<br/>18:00 — 00:00<br/><br/>
                Friday & Saturday<br/>18:00 — 02:00<br/><br/>
                <em>Closed Mondays, except by candlelight reservation.</em>
              </InfoBlock>
              <InfoBlock label="INDIRIZZO — ADDRESS">
                Calle dei Lampioni 14<br/>
                Cannaregio<br/>
                Venezia · 30121<br/><br/>
                <em>Vaporetto — Madonna dell'Orto</em>
              </InfoBlock>
              <InfoBlock label="BIGLIETTI — ADMISSION">
                Standard · €28<br/>
                Evening · €34<br/>
                Late (after 22:00) · €42<br/>
                By Candlelight · €96<br/><br/>
                <em>Members of the Order — always free.</em>
              </InfoBlock>
              <InfoBlock label="ACCESSIBILITÀ">
                Step-free entry from Fondamenta Misericordia.<br/><br/>
                Quiet hours Tuesday 18:00 — 20:00.<br/><br/>
                Audio descriptions in EN, IT, FR.
              </InfoBlock>
            </div>
            <div style={{ display:'flex', gap:14, paddingTop:32, marginTop:24, borderTop:'1px solid rgba(243,234,212,0.18)', flexWrap:'wrap' }}>
              <button className="btn btn-gold">Reserve Tickets</button>
              <button className="btn">Get Directions</button>
            </div>
          </div>

          <div style={{ position:'relative' }}>
            <div className="ph ph-frame" data-label="[ Atmospheric night exterior — palazzo facade with lit windows reflected in canal ]"
                 style={{ aspectRatio:'4/5', minHeight:520 }}/>
            {ornaments && (
              <div className="glass-strong" style={{ position:'absolute', bottom:-32, left:'50%', transform:'translateX(-50%)', padding:14, borderRadius:'50%' }}>
                <Or.CompassRose size={88} color="var(--gold-bright)"/>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoBlock({ label, children }) {
  return (
    <div>
      <div className="label" style={{ marginBottom:12 }}>{label}</div>
      <div className="serif legible" style={{ fontSize:16, lineHeight:1.55, color:'var(--paper-soft)' }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWSLETTER + FOOTER
function Newsletter({ ornaments }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <section style={{ padding:'140px 48px', position:'relative' }}>
      <div className="glass-strong" style={{ maxWidth:900, margin:'0 auto', textAlign:'center', padding:'72px 48px', borderRadius:12, position:'relative' }}>
        {ornaments && (
          <div style={{ display:'flex', justifyContent:'center', marginBottom:32 }}>
            <Or.Crescent size={32} color="var(--gold-bright)"/>
          </div>
        )}
        <div className="label" style={{ marginBottom:20 }}>VI — ISCRIVETEVI</div>
        <h2 className="display legible-strong" style={{ fontSize:'clamp(44px, 6vw, 92px)', lineHeight:0.95, margin:'0 0 8px', fontWeight:600, textTransform:'uppercase', letterSpacing:'-0.01em', color:'var(--paper)' }}>
          The
        </h2>
        <div className="serif legible-strong" style={{ fontSize:'clamp(44px, 6vw, 92px)', fontStyle:'italic', color:'var(--gold-bright)', lineHeight:1.05, letterSpacing:'-0.01em', paddingBottom:'0.15em', marginBottom:24 }}>
          Nocturne.
        </div>
        <p className="serif legible" style={{ fontSize:19, fontStyle:'italic', color:'var(--paper-soft)', maxWidth:520, margin:'0 auto 40px', fontWeight:400, lineHeight:1.5 }}>
          A monthly missive — exhibitions, late openings, the occasional poem — delivered at the stroke of midnight.
        </p>
        {submitted ? (
          <div className="serif legible" style={{ fontSize:24, fontStyle:'italic', color:'var(--gold-bright)' }}>
            Until midnight, then. ✦
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }} style={{
            display:'flex', gap:12, maxWidth:560, margin:'0 auto', alignItems:'flex-end',
          }}>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="your@correspondence.it"
              className="field"
              style={{ flex:1, fontSize:20, textAlign:'center' }}
            />
            <button className="btn btn-gold" type="submit">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer({ ornaments }) {
  return (
    <footer style={{ padding:'72px 48px 40px', borderTop:'1px solid rgba(243,234,212,0.12)', background:'rgba(6,7,13,0.65)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)' }}>
      <div style={{ maxWidth:1480, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:40, marginBottom:60, alignItems:'flex-start' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <Or.Crescent size={26} color="var(--gold-bright)"/>
              <div>
                <div className="display legible" style={{ fontSize:18, fontWeight:600, letterSpacing:'0.16em', color:'var(--paper)' }}>MUSEO</div>
                <div className="serif" style={{ fontSize:16, fontStyle:'italic', color:'var(--gold-bright)' }}>della Notte</div>
              </div>
            </div>
            <p className="serif legible" style={{ fontSize:15, fontStyle:'italic', color:'var(--paper-soft)', maxWidth:340, lineHeight:1.5 }}>
              A sanctuary for art seen by candlelight, moonlight, and the slow burn of gilt.
            </p>
            {ornaments && <div style={{ marginTop:18 }}><Or.Ornate width={220} color="var(--gold)"/></div>}
          </div>
          <FooterCol title="VISIT" items={["Hours","Admission","Accessibility","Group Visits"]}/>
          <FooterCol title="DISCOVER" items={["Exhibitions","Collections","Programme","Editions"]}/>
          <FooterCol title="THE ORDER" items={["Membership","Patronage","Galas","Press"]}/>
          <FooterCol title="SOCIAL" items={["Instagram","Newsletter","Privacy","Terms"]}/>
        </div>
        <hr className="line"/>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:24, flexWrap:'wrap', gap:18 }}>
          <div className="label">© MMXXVI · CALLE DEI LAMPIONI 14 · VENEZIA</div>
          <div className="serif legible" style={{ fontStyle:'italic', fontSize:16, color:'var(--gold-bright)' }}>
            Nox tegit, lux revelat.
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div className="label" style={{ marginBottom:14 }}>{title}</div>
      <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:8 }}>
        {items.map(i => <li key={i}><a href="#" className="serif legible" style={{ color:'var(--paper-soft)', textDecoration:'none', fontSize:15 }}>{i}</a></li>)}
      </ul>
    </div>
  );
}

Object.assign(window, { Nav, Hero, Marquee, Featured, Collections, Programme, Membership, Visit, Newsletter, Footer, PALETTES, FONT_PAIRS, TWEAK_DEFAULTS, useReveal, useFirefly });
