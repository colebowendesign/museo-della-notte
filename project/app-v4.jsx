// v4 — chaotic asymmetric over full-bleed video, solid surfaces (no glass)
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "ivory-gold",
  "fontPair": "cinzel-cormorant-inter",
  "cursorTrail": true,
  "ornaments": true,
  "videoDim": 0.55
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

// NAV — solid, no glass, tilted lockup
function Nav({ onReserve }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      background: scrolled ? 'rgba(6,7,13,0.88)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--paper)' : '1px solid transparent',
      transition:'all .4s ease',
      padding:'18px 32px',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', maxWidth:1480, margin:'0 auto' }}>
        <a href="#top" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none', color:'var(--paper)' }}>
          <Or.Crescent size={20} color="var(--gold-bright)"/>
          <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
            <span className="display legible" style={{ fontSize:14, fontWeight:600, letterSpacing:'0.18em' }}>MUSEO</span>
            <span className="serif legible" style={{ fontSize:13, fontStyle:'italic', color:'var(--gold-bright)', letterSpacing:'0.04em', marginTop:2 }}>della Notte</span>
          </div>
        </a>
        <div className="hide-sm" style={{ display:'flex', gap:36, alignItems:'center' }}>
          {['Exhibitions','Collections','Programme','Membership','Visit'].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="display legible" style={{
              color:'var(--paper)', textDecoration:'none',
              fontSize:11, letterSpacing:'0.22em', fontWeight:500,
              borderBottom: '1px solid transparent',
              paddingBottom:2, transition:'all .3s',
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

// HERO — asymmetric, headline LEFT spilling, ornaments scattered
function Hero({ onReserve, ornaments }) {
  const [parallax, setParallax] = useState(0);
  useEffect(() => {
    const onScroll = () => setParallax(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <section id="top" style={{
      position:'relative', minHeight:'100vh',
      padding:'120px 32px 140px',
      overflow:'hidden',
    }}>
      {ornaments && <div style={{ position:'absolute', top:96, left:32, opacity:0.55, transform:`rotate(${parallax * -0.05}deg)` }}><Or.CompassRose size={120} color="var(--gold-bright)"/></div>}
      {ornaments && <div style={{ position:'absolute', top:140, right:80, opacity:0.5 }}><Or.LaurelSprig width={180} color="var(--gold)" flip/></div>}

      <div style={{ display:'grid', gridTemplateColumns:'1.05fr 1fr', gap:0, alignItems:'stretch', maxWidth:1480, margin:'0 auto', minHeight:'80vh' }}>
        {/* LEFT */}
        <div style={{ position:'relative', display:'flex', flexDirection:'column', justifyContent:'center', paddingRight:40, paddingTop:60 }}>
          <div className="reveal in" style={{ display:'flex', alignItems:'center', gap:14, marginBottom:36 }}>
            <hr className="line-gold" style={{ width:80 }}/>
            <span className="label legible">EST · MMXXIV — VENEZIA</span>
          </div>

          <div className="reveal in" style={{ position:'relative', marginBottom:40 }}>
            <h1 className="display legible-strong" style={{
              fontSize:'clamp(80px, 13vw, 200px)', lineHeight:0.86, fontWeight:600,
              margin:0, letterSpacing:'-0.02em', color:'var(--paper)',
              textTransform:'uppercase',
            }}>
              MVSEO<br/>
              <span style={{
                background: 'linear-gradient(180deg, #f1c66a 0%, #d6a544 60%, #9a7224 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter:'drop-shadow(0 4px 20px rgba(0,0,0,0.7))',
              }}>NOTTE</span>
            </h1>
            <div className="serif" style={{
              position:'absolute', top:'46%', left:'-20px',
              fontStyle:'italic', fontSize:'clamp(48px, 7vw, 110px)',
              color:'var(--gold-bright)', fontWeight:400,
              transform:'rotate(-6deg)',
              pointerEvents:'none',
              textShadow:'2px 2px 0 var(--ink), 0 0 30px rgba(241,198,106,0.4)',
            }}>
              della
            </div>
          </div>

          <div className="reveal in" style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:24, alignItems:'flex-start', marginBottom:44, maxWidth:600 }}>
            {ornaments && <div style={{ marginTop:6 }}><Or.AmpersandFlourish size={60} color="var(--gold-bright)"/></div>}
            <p className="serif legible" style={{ fontSize:22, lineHeight:1.45, fontStyle:'italic', color:'var(--paper-soft)', margin:0, fontWeight:400 }}>
              Where the night keeps its treasures —<br/>
              <span style={{ color:'var(--gold-bright)' }}>a Renaissance, viewed by candlelight.</span>
            </p>
          </div>

          <div className="reveal in" style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
            <button className="btn btn-gold" onClick={onReserve}>Plan an Evening Visit</button>
            <button className="btn" onClick={() => document.getElementById('exhibitions')?.scrollIntoView({behavior:'smooth'})}>
              Current Exhibitions
            </button>
          </div>

          <div className="reveal in" style={{ display:'flex', gap:48, marginTop:56, flexWrap:'wrap' }}>
            <div className="legible">
              <div className="label" style={{ marginBottom:6 }}>OPEN AT DUSK</div>
              <div className="serif" style={{ fontSize:15, fontStyle:'italic', color:'var(--paper-soft)' }}>18:00 — 02:00 · Cannaregio</div>
            </div>
            <div className="legible">
              <div className="label" style={{ marginBottom:6 }}>NOW ON VIEW</div>
              <div className="serif" style={{ fontSize:15, fontStyle:'italic', color:'var(--paper-soft)' }}>Nocturnes in Oil · Halls III–VII</div>
            </div>
          </div>
        </div>

        {/* RIGHT — tilted Roman numeral plate, caption tag */}
        <div style={{ position:'relative', alignSelf:'stretch', minHeight:560 }}>
          <div style={{
            position:'absolute', inset:'40px 0 100px 0',
            transform:`translateY(${parallax * -0.08}px) rotate(1.5deg)`,
            border:'8px double var(--gold)',
            boxShadow:'0 0 0 2px var(--ink), 24px 24px 0 var(--oxblood), 0 30px 80px rgba(0,0,0,0.7)',
            background:'linear-gradient(135deg, rgba(6,7,13,0.55), rgba(26,18,8,0.4))',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <div style={{ textAlign:'center' }}>
              <Or.RomanNumeral size={220} color="var(--gold-bright)" style={{ textShadow:'0 0 60px rgba(241,198,106,0.5)' }}>I</Or.RomanNumeral>
              <div className="label legible" style={{ marginTop:-20 }}>HORA · NOCTIS</div>
            </div>
          </div>

          {ornaments && (
            <div className="flicker" style={{ position:'absolute', bottom:24, left:-40 }}>
              <Or.Sun size={120} color="var(--gold-bright)"/>
            </div>
          )}

          <div style={{
            position:'absolute', bottom:60, right:20,
            background:'var(--paper)', color:'var(--ink)',
            border:'2px solid var(--gold-deep)',
            padding:'14px 22px', maxWidth:240,
            transform:'rotate(-2deg)',
            boxShadow:'8px 8px 0 var(--ink)',
          }}>
            <div className="label" style={{ marginBottom:4, color:'var(--gold-deep)' }}>CAT. NO · I</div>
            <div className="serif" style={{ fontSize:14, fontStyle:'italic', lineHeight:1.3, color:'var(--ink)' }}>
              "L'ora del crepuscolo" — <br/>after dusk, before midnight.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// MARQUEE
function Marquee() {
  const items = ['NOX TEGIT, LUX REVELAT', '✦', 'EST · MMXXIV', '✦', 'VENEZIA · CANNAREGIO', '✦', 'APERTI A LUME DI CANDELA', '✦', 'OPEN AT DUSK · CLOSED MONDAYS', '✦'];
  return (
    <div style={{
      borderTop:'2px solid var(--paper)', borderBottom:'2px solid var(--paper)',
      background:'var(--paper)', color:'var(--ink)',
      padding:'14px 0', overflow:'hidden', position:'relative', zIndex:5,
    }}>
      <div style={{ display:'flex', gap:48, whiteSpace:'nowrap', animation:'mq 40s linear infinite' }}>
        {Array.from({length:4}).flatMap((_,i)=>items.map((t,j)=>(
          <span key={`${i}-${j}`} className="display" style={{ fontSize:13, letterSpacing:'0.3em', fontWeight:500, color: t==='✦'? 'var(--oxblood)' : 'var(--ink)' }}>{t}</span>
        )))}
      </div>
      <style>{`@keyframes mq { from{ transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

// FEATURED
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
    <section id="exhibitions" style={{ padding:'140px 32px 100px', position:'relative' }}>
      {ornaments && <div style={{ position:'absolute', top:60, right:60, opacity:0.5 }}><Or.LaurelSprig width={200} color="var(--gold)" flip/></div>}
      {ornaments && <div style={{ position:'absolute', bottom:80, left:60, opacity:0.4 }}><Or.Wreath size={140} color="var(--gold)"/></div>}

      <div style={{ maxWidth:1480, margin:'0 auto' }}>
        <div className="reveal" style={{ display:'flex', alignItems:'baseline', gap:24, marginBottom:48 }}>
          <Or.RomanNumeral size={64} color="var(--gold-bright)" style={{ lineHeight:0.9, textShadow:'0 0 30px rgba(241,198,106,0.4)' }}>I</Or.RomanNumeral>
          <hr className="line-gold" style={{ flex:1 }}/>
          <span className="label legible">{FEATURED.kicker}</span>
          <hr className="line-gold" style={{ width:60 }}/>
          <span className="label legible">{FEATURED.dates}</span>
        </div>

        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:60, alignItems:'flex-start' }}>
          <div style={{ position:'relative' }}>
            <div className="ph ph-frame" data-label="[ MARQUEE — Caravaggio-school nocturne, candlelit canvas, deep umber ]"
                 style={{ aspectRatio:'4/3.2', minHeight:540, transform:'rotate(-1deg)' }}/>
            <div style={{
              position:'absolute', bottom:-30, left:30,
              background:'var(--paper)', color:'var(--ink)',
              border:'2px solid var(--ink)',
              padding:'14px 22px', display:'flex', gap:18, alignItems:'center',
              boxShadow:'8px 8px 0 var(--gold-bright)',
              transform:'rotate(1.5deg)',
            }}>
              <Or.Star8 size={22} color="var(--oxblood)"/>
              <div>
                <div className="label" style={{ marginBottom:2, color:'var(--gold-deep)' }}>23 WORKS · {FEATURED.rooms}</div>
                <div className="serif" style={{ fontSize:15, fontStyle:'italic', color:'var(--ink)' }}>{FEATURED.curator}</div>
              </div>
            </div>
          </div>

          <div style={{ paddingTop:40 }}>
            <h2 className="display legible-strong" style={{
              fontSize:'clamp(36px, 4.5vw, 64px)', lineHeight:1.05, margin:'0 0 8px',
              fontWeight:600, color:'var(--paper)', letterSpacing:'-0.01em', textTransform:'uppercase',
            }}>
              Nocturnes
            </h2>
            <div className="serif legible-strong" style={{
              fontSize:'clamp(28px, 3vw, 48px)', fontStyle:'italic', fontWeight:400,
              color:'var(--gold-bright)', marginBottom:28, lineHeight:1.1, letterSpacing:'-0.005em',
              paddingBottom:'0.15em',
            }}>
              in Oil.
            </div>
            <p className="serif legible" style={{ fontSize:22, lineHeight:1.45, fontStyle:'italic', color:'var(--paper-soft)', margin:'0 0 24px', fontWeight:400 }}>
              Twenty-three Baroque canvases, lit only by the flame their painters worked beside.
            </p>
            <p className="dropcap legible" style={{ fontSize:15, lineHeight:1.7, color:'var(--paper-soft)', margin:'0 0 32px' }}>
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

// COLLECTIONS — irregular tilted masonry, on solid paper background
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
    <section id="collections" style={{ padding:'140px 32px', position:'relative', background:'rgba(6,7,13,0.65)', borderTop:'2px solid var(--paper)', borderBottom:'2px solid var(--paper)' }}>
      {ornaments && (
        <>
          <div style={{ position:'absolute', top:40, left:40, opacity:0.55 }}><Or.Star8 size={32} color="var(--gold-bright)"/></div>
          <div style={{ position:'absolute', top:80, right:80, opacity:0.5 }}><Or.Wreath size={140} color="var(--gold)"/></div>
          <div style={{ position:'absolute', bottom:60, left:'40%', opacity:0.45 }}><Or.Fleuron size={50} color="var(--gold)"/></div>
          <div style={{ position:'absolute', bottom:100, right:40, opacity:0.4 }}><Or.Sun size={100} color="var(--gold)"/></div>
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
              color:'var(--gold-bright)', lineHeight:1.1, letterSpacing:'-0.01em', paddingBottom:'0.15em',
            }}>
              kept dark.
            </div>
          </div>
          <p className="serif legible" style={{ fontSize:20, lineHeight:1.5, fontStyle:'italic', color:'var(--paper-soft)', margin:0, paddingBottom:16, fontWeight:400, maxWidth:500, justifySelf:'flex-end' }}>
            The permanent collection is housed in six wings, each with its own temperament & its own hour. Wander them in any order — the museum has no preferred path.
          </p>
        </div>

        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:24 }}>
          {COLLECTIONS.map((c, i) => <CollectionCard key={i} index={i} {...c} />)}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({ name, it, count, desc, ph, index }) {
  const [hover, setHover] = useState(false);
  const spans   = ['span 3 / auto', 'span 3 / auto', 'span 2 / auto', 'span 2 / auto', 'span 2 / auto', 'span 3 / auto'];
  const heights = [560, 420, 480, 480, 560, 420];
  const tilts   = [-1, 0.8, -0.5, 1, -0.8, 0.6];
  return (
    <article
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        gridColumn: spans[index],
        height: heights[index],
        transform: hover ? `rotate(0deg) translateY(-6px)` : `rotate(${tilts[index]}deg)`,
        transition:'transform .5s cubic-bezier(.2,.8,.2,1)',
        position:'relative', cursor:'default',
      }}>
      <div style={{
        position:'absolute', inset:0,
        border:'2px solid var(--paper)',
        background:'var(--paper)',
        boxShadow: hover ? '12px 12px 0 var(--gold-bright)' : '6px 6px 0 var(--gold)',
        transition:'box-shadow .5s',
        display:'flex', flexDirection:'column',
      }}>
        <div className="ph" data-label={ph} style={{ flex:1, borderBottom:'2px solid var(--ink)' }}/>
        <div style={{ padding:'18px 20px 20px', background:'var(--paper)', color:'var(--ink)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
            <span className="label" style={{ color:'var(--gold-deep)' }}>{String(index+1).padStart(2,'0')} · {count}</span>
            <Or.Star4 size={12} color="var(--oxblood)"/>
          </div>
          <h3 className="display" style={{ fontSize:18, fontWeight:600, margin:'0 0 2px', textTransform:'uppercase', letterSpacing:'0.02em', lineHeight:1.1 }}>
            {name}
          </h3>
          <div className="serif" style={{ fontSize:14, fontStyle:'italic', color:'var(--oxblood)', marginBottom:8 }}>{it}</div>
          <p style={{ fontSize:13, color:'rgba(6,7,13,0.7)', lineHeight:1.5, margin:0 }}>{desc}</p>
        </div>
      </div>
    </article>
  );
}

// PROGRAMME
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
    <section id="programme" style={{ padding:'140px 32px', position:'relative' }}>
      {ornaments && <div style={{ position:'absolute', top:120, right:'8%', opacity:0.5 }}><Or.Sun size={140} color="var(--gold-bright)"/></div>}
      {ornaments && <div style={{ position:'absolute', bottom:60, left:'5%', opacity:0.45 }}><Or.LaurelSprig width={180} color="var(--gold)"/></div>}
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
                background: filter === k ? 'var(--gold-bright)' : 'transparent',
                color: filter === k ? 'var(--ink)' : 'var(--paper)',
                borderColor: filter === k ? 'var(--gold-bright)' : 'var(--paper)',
                padding:'6px 12px', fontSize:9,
              }}>{k}</button>
            ))}
          </div>
        </div>

        <div className="reveal" style={{ borderTop:'2px solid var(--paper)' }}>
          {filtered.map((ev) => <EventRow key={ev.title} ev={ev}/>)}
        </div>
      </div>
    </section>
  );
}

function EventRow({ ev }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display:'grid', gridTemplateColumns:'130px 80px 1fr 180px 140px',
        alignItems:'center', gap:32, padding:'32px 12px',
        borderBottom:'1px solid rgba(243,234,212,0.3)',
        background: hover ? 'var(--paper)' : 'transparent',
        color: hover ? 'var(--ink)' : 'var(--paper)',
        transition:'all .3s',
      }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
        <div className={hover ? "display" : "display legible"} style={{ fontSize:54, fontWeight:600, lineHeight:1 }}>{ev.date}</div>
        <div>
          <div className={hover ? "display" : "display legible"} style={{ fontSize:14, fontWeight:500, letterSpacing:'0.18em' }}>{ev.mo}</div>
          <div className="serif" style={{ fontSize:13, fontStyle:'italic', color: hover ? 'var(--oxblood)' : 'var(--gold-bright)' }}>{ev.day}</div>
        </div>
      </div>
      <div className="label" style={{ color: hover ? 'var(--gold-deep)' : 'var(--gold-bright)' }}>{ev.kind}</div>
      <div>
        <h3 className={hover ? "display" : "display legible"} style={{ fontSize:24, fontWeight:600, margin:'0 0 6px', textTransform:'uppercase', letterSpacing:'0.005em', lineHeight:1.1 }}>
          {ev.title}
        </h3>
        <p style={{ fontSize:13, lineHeight:1.5, margin:0, opacity: hover ? 0.78 : 0.85 }}>{ev.blurb}</p>
      </div>
      <div className="serif" style={{ fontSize:18, fontStyle:'italic' }}>
        {ev.time}<br/>
        <span style={{ fontSize:14, color: hover ? 'var(--oxblood)' : 'var(--gold-bright)' }}>{ev.price}</span>
      </div>
      <div style={{ textAlign:'right' }}>
        <button className="btn btn-sm" style={{
          background: hover ? 'var(--ink)' : 'transparent',
          borderColor: hover ? 'var(--ink)' : 'var(--paper)',
          color: hover ? 'var(--paper)' : 'var(--paper)',
        }}>Reserve →</button>
      </div>
    </div>
  );
}

// MEMBERSHIP
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
    <section id="membership" style={{ padding:'140px 32px', position:'relative', background:'rgba(6,7,13,0.65)', borderTop:'2px solid var(--paper)', borderBottom:'2px solid var(--paper)' }}>
      {ornaments && (
        <>
          <div style={{ position:'absolute', top:60, left:'45%', opacity:0.45 }}><Or.Wreath size={160} color="var(--gold)"/></div>
          <div style={{ position:'absolute', bottom:80, right:60, opacity:0.5 }}><Or.LaurelSprig width={180} color="var(--gold)"/></div>
          <div style={{ position:'absolute', top:140, left:60, opacity:0.4 }}><Or.Star8 size={36} color="var(--gold-bright)"/></div>
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
  const tilts = [-0.6, 0, 0.5, -0.4];
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: tier.featured ? 'var(--ink)' : 'var(--paper)',
        color: tier.featured ? 'var(--paper)' : 'var(--ink)',
        border: tier.featured ? '2px solid var(--gold-bright)' : '2px solid var(--ink)',
        padding:'30px 26px 28px',
        position:'relative',
        transform: hover ? `rotate(0deg) translateY(${offsets[index] - 6}px)` : `rotate(${tilts[index]}deg) translateY(${offsets[index]}px)`,
        transition:'transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s',
        boxShadow: tier.featured ? '10px 10px 0 var(--oxblood)' : (hover ? '8px 8px 0 var(--gold-bright)' : '4px 4px 0 var(--gold)'),
        minHeight:520,
        display:'flex', flexDirection:'column',
      }}>
      {tier.featured && (
        <div style={{
          position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)',
          background:'var(--gold-bright)', color:'var(--ink)',
          fontFamily:'var(--display)', fontSize:9, letterSpacing:'0.3em', fontWeight:600,
          padding:'5px 12px', border:'1.5px solid var(--ink)',
        }}>MOST CHOSEN</div>
      )}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
        <Or.RomanNumeral size={36} color={tier.featured ? 'var(--gold-bright)' : 'var(--oxblood)'}>
          {['I','II','III','IV'][index]}
        </Or.RomanNumeral>
        <Or.Star8 size={18} color={tier.featured ? 'var(--gold-bright)' : 'var(--oxblood)'}/>
      </div>
      <div className="serif" style={{ fontSize:14, fontStyle:'italic', color: tier.featured ? 'var(--gold-bright)' : 'var(--oxblood)', marginBottom:4 }}>
        {tier.it}
      </div>
      <h3 className="display" style={{ fontSize:24, fontWeight:600, margin:'0 0 10px', textTransform:'uppercase', letterSpacing:'0.005em', lineHeight:1.1 }}>
        {tier.name}
      </h3>
      <p className="serif" style={{ fontSize:15, fontStyle:'italic', opacity:0.8, margin:'0 0 18px', minHeight:42 }}>
        {tier.pitch}
      </p>
      <hr className="line" style={{ background:tier.featured ? 'rgba(243,234,212,0.4)' : 'var(--ink)', opacity:0.5, marginBottom:18 }}/>
      <div style={{ marginBottom:22 }}>
        <div className="display" style={{ fontSize:32, fontWeight:600 }}>{tier.price}</div>
        {tier.cadence && <div className="serif" style={{ fontSize:13, fontStyle:'italic', opacity:0.6 }}>{tier.cadence}</div>}
      </div>
      <ul style={{ listStyle:'none', padding:0, margin:'0 0 22px', display:'flex', flexDirection:'column', gap:8, flex:1 }}>
        {tier.perks.map(p => (
          <li key={p} style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:13, lineHeight:1.45 }}>
            <span style={{ flex:'0 0 10px', marginTop:6 }}>
              <Or.Star4 size={8} color={tier.featured ? 'var(--gold-bright)' : 'var(--oxblood)'}/>
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <button className={tier.featured ? 'btn btn-gold' : 'btn btn-dark'} style={{
        borderColor: tier.featured ? 'var(--gold-bright)' : 'var(--ink)',
      }}>
        {tier.price.startsWith("By") ? "Request Invitation" : "Become a Member"}
      </button>
    </div>
  );
}

// VISIT
function Visit({ ornaments }) {
  return (
    <section id="visit" style={{ padding:'140px 32px', position:'relative' }}>
      {ornaments && <div style={{ position:'absolute', top:80, right:80, opacity:0.4 }}><Or.Wreath size={140} color="var(--gold)"/></div>}
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

        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:60, alignItems:'flex-start' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:36, borderTop:'2px solid var(--paper)', paddingTop:32 }}>
            <InfoBlock label="ORE — HOURS">
              Tuesday–Sunday<br/>18:00 — 00:00<br/><br/>
              Friday & Saturday<br/>18:00 — 02:00<br/><br/>
              <em>Closed Mondays, except by candlelight reservation.</em>
            </InfoBlock>
            <InfoBlock label="INDIRIZZO — ADDRESS">
              Calle dei Lampioni 14<br/>Cannaregio<br/>Venezia · 30121<br/><br/>
              <em>Vaporetto — Madonna dell'Orto</em>
            </InfoBlock>
            <InfoBlock label="BIGLIETTI — ADMISSION">
              Standard · €28<br/>Evening · €34<br/>Late (after 22:00) · €42<br/>By Candlelight · €96<br/><br/>
              <em>Members of the Order — always free.</em>
            </InfoBlock>
            <InfoBlock label="ACCESSIBILITÀ">
              Step-free entry from Fondamenta Misericordia.<br/><br/>
              Quiet hours Tuesday 18:00 — 20:00.<br/><br/>
              Audio descriptions in EN, IT, FR.
            </InfoBlock>
            <div style={{ gridColumn:'1 / -1', display:'flex', gap:14, paddingTop:24, borderTop:'1px solid var(--paper)', flexWrap:'wrap' }}>
              <button className="btn btn-gold">Reserve Tickets</button>
              <button className="btn">Get Directions</button>
            </div>
          </div>

          <div style={{ position:'relative' }}>
            <div className="ph ph-frame" data-label="[ Atmospheric night exterior — palazzo facade with lit windows reflected in canal ]"
                 style={{ aspectRatio:'4/5', minHeight:600, transform:'rotate(1.5deg)' }}/>
            {ornaments && (
              <div style={{ position:'absolute', bottom:-40, left:'50%', transform:'translateX(-50%) rotate(-3deg)', background:'var(--paper)', padding:'10px', border:'2px solid var(--ink)', boxShadow:'6px 6px 0 var(--gold-bright)' }}>
                <Or.CompassRose size={100} color="var(--ink)"/>
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

function Newsletter({ ornaments }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <section style={{ padding:'140px 32px', position:'relative', background:'var(--paper)', color:'var(--ink)', borderTop:'2px solid var(--paper)' }}>
      {ornaments && <div style={{ position:'absolute', top:40, left:60, opacity:0.5 }}><Or.LaurelSprig width={140} color="var(--gold-deep)"/></div>}
      {ornaments && <div style={{ position:'absolute', bottom:40, right:60, opacity:0.5 }}><Or.LaurelSprig width={140} color="var(--gold-deep)" flip/></div>}
      <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center', position:'relative' }}>
        {ornaments && <div style={{ display:'flex', justifyContent:'center', marginBottom:32 }}><Or.Crescent size={32} color="var(--oxblood)"/></div>}
        <div className="label" style={{ color:'var(--gold-deep)', marginBottom:20 }}>VI — ISCRIVETEVI</div>
        <h2 className="display" style={{ fontSize:'clamp(44px, 6vw, 92px)', lineHeight:0.95, margin:'0 0 8px', fontWeight:600, textTransform:'uppercase', letterSpacing:'-0.01em' }}>
          The
        </h2>
        <div className="serif" style={{ fontSize:'clamp(44px, 6vw, 92px)', fontStyle:'italic', color:'var(--oxblood)', lineHeight:1.05, letterSpacing:'-0.01em', paddingBottom:'0.15em', marginBottom:24 }}>
          Nocturne.
        </div>
        <p className="serif" style={{ fontSize:19, fontStyle:'italic', color:'rgba(6,7,13,0.7)', maxWidth:520, margin:'0 auto 40px', fontWeight:400, lineHeight:1.5 }}>
          A monthly missive — exhibitions, late openings, the occasional poem — delivered at the stroke of midnight.
        </p>
        {submitted ? (
          <div className="serif" style={{ fontSize:24, fontStyle:'italic', color:'var(--oxblood)' }}>Until midnight, then. ✦</div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }} style={{ display:'flex', gap:12, maxWidth:560, margin:'0 auto', alignItems:'flex-end' }}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@correspondence.it"
              style={{ flex:1, background:'transparent', border:0, borderBottom:'2px solid var(--ink)', color:'var(--ink)', fontFamily:'var(--serif)', fontSize:22, fontStyle:'italic', padding:'10px 4px', outline:'none', textAlign:'center' }}/>
            <button className="btn btn-dark" type="submit">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer({ ornaments }) {
  return (
    <footer style={{ padding:'72px 32px 40px', background:'rgba(6,7,13,0.85)', borderTop:'2px solid var(--paper)' }}>
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
