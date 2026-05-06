// Ticket reservation flow — multi-step glass modal
const { useState: useStateR, useEffect: useEffectR } = React;

const TICKET_TYPES = [
  { id:'standard', name:'Standard',           it:'Ingresso',         price:28, time:'Until 22:00',     desc:'Full evening admission to permanent collection and current exhibitions.' },
  { id:'evening',  name:'Evening',            it:'Sera',             price:34, time:'Until 23:30',     desc:'Includes the evening programme and one curated audio descent.' },
  { id:'late',     name:'After Hours',        it:'Tarda Notte',      price:42, time:'Until closing',   desc:'After 22:00. The galleries at their stillest. Limited to 80 visitors.' },
  { id:'candle',   name:'By Candlelight',     it:'A Lume di Candela', price:96, time:'21:00 — 23:00',   desc:'A guided descent through three rooms, lit only by hand-held candles. 12 places.' },
];

const SHOWTIMES = ['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30'];

function ReservationModal({ open, onClose }) {
  const [step, setStep] = useStateR(0);
  const [date, setDate] = useStateR(null);
  const [time, setTime] = useStateR(null);
  const [type, setType] = useStateR(null);
  const [qty, setQty] = useStateR(2);
  const [info, setInfo] = useStateR({ name:'', email:'', phone:'' });
  const [confirm, setConfirm] = useStateR(null);

  useEffectR(() => {
    if (open) document.body.style.overflow = 'hidden';
    else      document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // reset on close
  useEffectR(() => {
    if (!open) {
      setTimeout(() => {
        setStep(0); setDate(null); setTime(null); setType(null); setQty(2);
        setInfo({ name:'', email:'', phone:'' }); setConfirm(null);
      }, 400);
    }
  }, [open]);

  const selectedType = TICKET_TYPES.find(t => t.id === type);
  const subtotal = (selectedType?.price || 0) * qty;
  const fees = Math.round(subtotal * 0.06);
  const total = subtotal + fees;

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => Math.max(0, s - 1));

  const submit = () => {
    setConfirm({
      code: 'MDN-' + Math.random().toString(36).slice(2,7).toUpperCase(),
      date, time, type: selectedType, qty, total,
    });
    setStep(4);
  };

  if (!open && !confirm) return null;

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9000,
      background: open ? 'rgba(5,7,20,0.78)' : 'transparent',
      backdropFilter: open ? 'blur(20px) saturate(120%)' : 'none',
      WebkitBackdropFilter: open ? 'blur(20px) saturate(120%)' : 'none',
      transition:'all .4s ease',
      opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'24px',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="glass-strong" style={{
        width:'min(960px, 100%)', maxHeight:'92vh', overflow:'auto',
        background:'linear-gradient(180deg, rgba(20,26,54,0.85), rgba(10,14,31,0.92))',
        borderRadius:24, position:'relative',
        transform: open ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(20px)',
        transition:'transform .5s cubic-bezier(.2,.8,.2,1)',
        scrollbarWidth:'thin', scrollbarColor:'rgba(212,175,55,0.3) transparent',
      }}>
        {/* Header */}
        <div style={{ padding:'28px 40px 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div className="eyebrow" style={{ color:'var(--gold-2)', marginBottom:6 }}>Plan an evening visit</div>
            <h2 className="serif" style={{ fontSize:36, fontWeight:400, fontStyle:'italic', margin:0, color:'#f5ecd0', letterSpacing:'-0.01em' }}>
              {step === 4 ? 'Until then.' : 'Reserve your place'}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            appearance:'none', border:'0.5px solid rgba(212,175,55,0.3)', background:'transparent',
            width:38, height:38, borderRadius:'50%', color:'#f5ecd0', cursor:'pointer', fontSize:18,
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'all .3s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor='rgba(231,201,112,0.85)'}
          onMouseLeave={e => e.currentTarget.style.borderColor='rgba(212,175,55,0.3)'}>×</button>
        </div>

        {/* Progress */}
        {step < 4 && (
          <div style={{ padding:'24px 40px 0', display:'flex', gap:8 }}>
            {['Date','Tickets','Details','Review'].map((l, i) => (
              <div key={l} style={{ flex:1 }}>
                <div style={{
                  height:2, borderRadius:1, marginBottom:8,
                  background: i <= step ? 'linear-gradient(90deg, var(--gold), var(--gold-glow))' : 'rgba(245,236,208,0.1)',
                  transition:'background .4s',
                }}/>
                <div className="eyebrow" style={{ fontSize:9, color: i <= step ? 'var(--gold-2)' : 'rgba(245,236,208,0.4)' }}>
                  {String(i+1).padStart(2,'0')} · {l}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div style={{ padding:'32px 40px 40px' }}>
          {step === 0 && <StepDate date={date} time={time} setDate={setDate} setTime={setTime}/>}
          {step === 1 && <StepTickets type={type} setType={setType} qty={qty} setQty={setQty}/>}
          {step === 2 && <StepDetails info={info} setInfo={setInfo}/>}
          {step === 3 && <StepReview date={date} time={time} type={selectedType} qty={qty} info={info} subtotal={subtotal} fees={fees} total={total}/>}
          {step === 4 && confirm && <StepConfirm confirm={confirm}/>}
        </div>

        {/* Footer */}
        {step < 4 && (
          <div style={{
            padding:'20px 40px 28px', borderTop:'0.5px solid rgba(212,175,55,0.15)',
            display:'flex', justifyContent:'space-between', alignItems:'center', gap:18, flexWrap:'wrap',
            background:'linear-gradient(180deg, transparent, rgba(5,7,20,0.4))',
          }}>
            <div>
              {selectedType && step >= 1 && (
                <div style={{ display:'flex', gap:24, alignItems:'baseline' }}>
                  <div>
                    <div className="eyebrow" style={{ color:'rgba(245,236,208,0.5)' }}>Total</div>
                    <div className="serif" style={{ fontSize:28, color:'#f5ecd0' }}>€{total}</div>
                  </div>
                  <div style={{ fontSize:12, color:'rgba(245,236,208,0.55)' }}>
                    {qty} × {selectedType.name} · €{subtotal} + €{fees} fees
                  </div>
                </div>
              )}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              {step > 0 && <button className="gbtn gbtn-ghost gbtn-sm" onClick={back}>Back</button>}
              {step < 3 && (
                <button className="gbtn gbtn-primary gbtn-sm" onClick={next}
                  disabled={(step===0 && !(date && time)) || (step===1 && !type) || (step===2 && !(info.name && info.email))}
                  style={{
                    opacity: ((step===0 && !(date && time)) || (step===1 && !type) || (step===2 && !(info.name && info.email))) ? 0.4 : 1,
                    cursor:  ((step===0 && !(date && time)) || (step===1 && !type) || (step===2 && !(info.name && info.email))) ? 'not-allowed' : 'pointer',
                  }}>Continue</button>
              )}
              {step === 3 && <button className="gbtn gbtn-primary gbtn-sm" onClick={submit}>Confirm Reservation</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── STEP: DATE ─────────────────────────────────────────────────────────────
function StepDate({ date, time, setDate, setTime }) {
  // build a 14-day calendar starting today (mock: starting May 6, 2026)
  const start = new Date(2026, 4, 6);
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(start); d.setDate(d.getDate() + i);
    return d;
  });
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div>
      <h3 className="serif" style={{ fontSize:22, fontWeight:400, fontStyle:'italic', margin:'0 0 20px', color:'#f5ecd0' }}>
        Choose an evening
      </h3>
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:8, marginBottom:32,
      }}>
        {days.map(d => {
          const closed = d.getDay() === 1; // Mondays
          const sel = date && d.toDateString() === date.toDateString();
          return (
            <button key={d.toISOString()} disabled={closed}
              onClick={() => setDate(d)}
              style={{
                appearance:'none', cursor: closed ? 'not-allowed' : 'pointer',
                background: sel ? 'linear-gradient(180deg, rgba(212,175,55,0.28), rgba(212,175,55,0.1))' : 'rgba(245,236,208,0.04)',
                border: sel ? '0.5px solid rgba(231,201,112,0.85)' : '0.5px solid rgba(212,175,55,0.18)',
                borderRadius:12, padding:'14px 8px', color: closed ? 'rgba(245,236,208,0.25)' : '#f5ecd0',
                fontFamily:'var(--sans)',
                opacity: closed ? 0.4 : 1,
                transition:'all .3s',
              }}>
              <div style={{ fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase', color: sel ? 'var(--gold-2)' : 'rgba(245,236,208,0.5)' }}>
                {dayNames[d.getDay()]}
              </div>
              <div className="serif" style={{ fontSize:24, lineHeight:1.1, margin:'4px 0 2px' }}>
                {d.getDate()}
              </div>
              <div style={{ fontSize:9, color:'rgba(245,236,208,0.4)', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                {closed ? 'Closed' : monthNames[d.getMonth()]}
              </div>
            </button>
          );
        })}
      </div>

      {date && (
        <>
          <h3 className="serif" style={{ fontSize:22, fontWeight:400, fontStyle:'italic', margin:'0 0 20px', color:'#f5ecd0' }}>
            Choose an entry time
          </h3>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {SHOWTIMES.map(t => {
              const sel = time === t;
              return (
                <button key={t} onClick={() => setTime(t)}
                  className="gbtn gbtn-sm"
                  style={{
                    background: sel ? 'linear-gradient(180deg, rgba(212,175,55,0.28), rgba(212,175,55,0.1))' : 'transparent',
                    borderColor: sel ? 'rgba(231,201,112,0.85)' : 'rgba(245,236,208,0.18)',
                    fontFamily:'var(--serif)', fontStyle:'italic', fontSize:16, letterSpacing:0, textTransform:'none',
                    padding:'10px 18px',
                  }}>{t}</button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── STEP: TICKETS ──────────────────────────────────────────────────────────
function StepTickets({ type, setType, qty, setQty }) {
  return (
    <div>
      <h3 className="serif" style={{ fontSize:22, fontWeight:400, fontStyle:'italic', margin:'0 0 20px', color:'#f5ecd0' }}>
        Choose your admission
      </h3>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:32 }}>
        {TICKET_TYPES.map(t => {
          const sel = type === t.id;
          return (
            <button key={t.id} onClick={() => setType(t.id)}
              style={{
                appearance:'none', cursor:'pointer', textAlign:'left',
                background: sel ? 'linear-gradient(180deg, rgba(212,175,55,0.18), rgba(212,175,55,0.04))' : 'rgba(245,236,208,0.03)',
                border: sel ? '0.5px solid rgba(231,201,112,0.85)' : '0.5px solid rgba(212,175,55,0.18)',
                borderRadius:14, padding:'22px 24px', color:'#f5ecd0',
                fontFamily:'var(--sans)',
                transition:'all .3s', position:'relative',
                boxShadow: sel ? '0 0 0 4px rgba(212,175,55,0.1)' : 'none',
              }}>
              <div className="eyebrow" style={{ color:'var(--gold-2)', marginBottom:6 }}>{t.it}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
                <div className="serif" style={{ fontSize:24, fontWeight:400, color:'#f5ecd0', letterSpacing:'-0.005em' }}>
                  {t.name}
                </div>
                <div className="serif" style={{ fontSize:22, color:'var(--gold-2)' }}>€{t.price}</div>
              </div>
              <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'rgba(245,236,208,0.55)', marginBottom:8, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                {t.time}
              </div>
              <div style={{ fontSize:13, color:'rgba(245,236,208,0.65)', lineHeight:1.5 }}>{t.desc}</div>
            </button>
          );
        })}
      </div>

      {type && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', borderRadius:12, background:'rgba(245,236,208,0.04)', border:'0.5px solid rgba(212,175,55,0.18)' }}>
          <div>
            <div className="eyebrow" style={{ color:'var(--gold-2)', marginBottom:4 }}>Number of guests</div>
            <div style={{ fontSize:13, color:'rgba(245,236,208,0.6)' }}>Maximum 8 per reservation</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button onClick={() => setQty(Math.max(1, qty-1))} style={qtyBtn}>−</button>
            <span className="serif" style={{ fontSize:32, color:'#f5ecd0', minWidth:32, textAlign:'center' }}>{qty}</span>
            <button onClick={() => setQty(Math.min(8, qty+1))} style={qtyBtn}>+</button>
          </div>
        </div>
      )}
    </div>
  );
}
const qtyBtn = {
  appearance:'none', cursor:'pointer',
  width:36, height:36, borderRadius:'50%',
  background:'rgba(245,236,208,0.06)', border:'0.5px solid rgba(212,175,55,0.3)',
  color:'#f5ecd0', fontSize:18,
};

// ── STEP: DETAILS ──────────────────────────────────────────────────────────
function StepDetails({ info, setInfo }) {
  return (
    <div>
      <h3 className="serif" style={{ fontSize:22, fontWeight:400, fontStyle:'italic', margin:'0 0 8px', color:'#f5ecd0' }}>
        Your details
      </h3>
      <p style={{ fontSize:13, color:'rgba(245,236,208,0.55)', margin:'0 0 24px' }}>
        We'll send your reservation by email. We do not share these with anyone.
      </p>
      <div style={{ display:'grid', gap:16 }}>
        <Labeled label="Name on reservation">
          <input className="field" placeholder="Lucia Marchetti" value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}/>
        </Labeled>
        <Labeled label="Email">
          <input className="field" type="email" placeholder="lucia@correspondence.it" value={info.email}
            onChange={(e) => setInfo({ ...info, email: e.target.value })}/>
        </Labeled>
        <Labeled label="Telephone (optional)">
          <input className="field" placeholder="+39 ..." value={info.phone}
            onChange={(e) => setInfo({ ...info, phone: e.target.value })}/>
        </Labeled>
        <label style={{ display:'flex', gap:12, alignItems:'flex-start', fontSize:13, color:'rgba(245,236,208,0.7)', lineHeight:1.5, cursor:'pointer', marginTop:6 }}>
          <input type="checkbox" defaultChecked style={{ accentColor:'var(--gold)', marginTop:3 }}/>
          <span>Send me <em>The Nocturne</em>, the museum's monthly missive, at midnight on the first Sunday.</span>
        </label>
      </div>
    </div>
  );
}
function Labeled({ label, children }) {
  return (
    <div>
      <div className="eyebrow" style={{ color:'var(--gold-2)', marginBottom:8 }}>{label}</div>
      {children}
    </div>
  );
}

// ── STEP: REVIEW ───────────────────────────────────────────────────────────
function StepReview({ date, time, type, qty, info, subtotal, fees, total }) {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return (
    <div>
      <h3 className="serif" style={{ fontSize:22, fontWeight:400, fontStyle:'italic', margin:'0 0 20px', color:'#f5ecd0' }}>
        A final glance
      </h3>
      <div className="glass" style={{ padding:'28px 32px', marginBottom:20, background:'rgba(245,236,208,0.03)' }}>
        <ReviewLine k="When" v={`${date.toLocaleDateString('en-GB', { weekday:'long' })} · ${date.getDate()} ${months[date.getMonth()]} · ${time}`}/>
        <ReviewLine k="Admission" v={`${type.name} (${type.it}) — ${type.time}`}/>
        <ReviewLine k="Guests" v={`${qty} ${qty === 1 ? 'visitor' : 'visitors'}`}/>
        <ReviewLine k="Reserved by" v={`${info.name} · ${info.email}`} last/>
      </div>
      <div className="glass" style={{ padding:'24px 32px', background:'rgba(245,236,208,0.03)' }}>
        <CostLine k="Subtotal" v={`€${subtotal}`}/>
        <CostLine k="Booking fees" v={`€${fees}`}/>
        <hr className="gold-rule" style={{ margin:'14px 0' }}/>
        <CostLine k={<span className="serif" style={{ fontSize:18 }}>Total</span>} v={<span className="serif" style={{ fontSize:24, color:'var(--gold-2)' }}>€{total}</span>}/>
      </div>
      <p style={{ fontSize:12, color:'rgba(245,236,208,0.45)', marginTop:18, fontStyle:'italic', fontFamily:'var(--serif)' }}>
        On the evening of your visit, please arrive at least fifteen minutes before your entry time. We open the doors at dusk.
      </p>
    </div>
  );
}
function ReviewLine({ k, v, last }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'14px 0', borderBottom: last ? 'none' : '0.5px solid rgba(212,175,55,0.12)', gap:24 }}>
      <span className="eyebrow" style={{ color:'rgba(245,236,208,0.5)' }}>{k}</span>
      <span style={{ fontSize:14.5, color:'#f5ecd0', textAlign:'right' }}>{v}</span>
    </div>
  );
}
function CostLine({ k, v }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'4px 0' }}>
      <span style={{ fontSize:13, color:'rgba(245,236,208,0.7)' }}>{k}</span>
      <span style={{ fontSize:14, color:'#f5ecd0' }}>{v}</span>
    </div>
  );
}

// ── STEP: CONFIRM ──────────────────────────────────────────────────────────
function StepConfirm({ confirm }) {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const { date, time, type, qty, total, code } = confirm;
  return (
    <div style={{ textAlign:'center', padding:'20px 0 8px' }}>
      <div style={{
        width:80, height:80, margin:'0 auto 28px', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(231,201,112,0.4), transparent 70%)',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 0 60px rgba(231,201,112,0.4)',
      }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <path d="M19 12a8 8 0 1 1-7.5-7.98 6.5 6.5 0 0 0 7.5 7.98z" fill="#e7c970" />
        </svg>
      </div>
      <div className="eyebrow" style={{ color:'var(--gold-2)', marginBottom:14 }}>Reservation confirmed</div>
      <h3 className="serif" style={{ fontSize:'clamp(28px, 4vw, 44px)', fontWeight:400, fontStyle:'italic', margin:'0 0 18px', color:'#f5ecd0', letterSpacing:'-0.01em' }}>
        We will be expecting you.
      </h3>
      <p className="serif" style={{ fontSize:18, fontStyle:'italic', color:'rgba(245,236,208,0.7)', maxWidth:480, margin:'0 auto 32px', lineHeight:1.5, fontWeight:300 }}>
        A confirmation has been sent to your inbox. Bring it, or simply your name — the porter will know.
      </p>
      <div className="glass" style={{ maxWidth:520, margin:'0 auto', padding:'28px 32px', background:'rgba(245,236,208,0.03)', textAlign:'left' }}>
        <ReviewLine k="Confirmation" v={code}/>
        <ReviewLine k="When" v={`${months[date.getMonth()]} ${date.getDate()} · ${time}`}/>
        <ReviewLine k="Admission" v={`${qty} × ${type.name}`}/>
        <ReviewLine k="Paid" v={`€${total}`} last/>
      </div>
    </div>
  );
}

window.ReservationModal = ReservationModal;
