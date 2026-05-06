// Ticket reservation flow v2 — paper / Renaissance theme
const { useState: useStateR, useEffect: useEffectR } = React;

const TICKET_TYPES = [
  { id:'standard', name:'Standard',           it:'Ingresso',         price:28, time:'Until 22:00',     desc:'Full evening admission to the permanent collection and current exhibitions.' },
  { id:'evening',  name:'Evening',            it:'Sera',             price:34, time:'Until 23:30',     desc:'Includes the evening programme and one curated audio descent.' },
  { id:'late',     name:'After Hours',        it:'Tarda Notte',      price:42, time:'Until closing',   desc:'After 22:00. The galleries at their stillest. Limited to 80 visitors.' },
  { id:'candle',   name:'By Candlelight',     it:'A Lume di Candela',price:96, time:'21:00 — 23:00',   desc:'A guided descent through three rooms, lit only by hand-held candles. Twelve places.' },
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
      background: open ? 'rgba(13,10,6,0.6)' : 'transparent',
      transition:'background .3s ease',
      opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'24px',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width:'min(960px, 100%)', maxHeight:'92vh', overflow:'auto',
        background:'var(--paper)', color:'var(--ink)',
        border:'2px solid var(--ink)', position:'relative',
        boxShadow:'16px 16px 0 var(--oxblood)',
        transform: open ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(20px)',
        transition:'transform .4s cubic-bezier(.2,.8,.2,1)',
      }}>
        {/* Header */}
        <div style={{ padding:'28px 40px 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:'1px solid var(--ink)', paddingBottom:24 }}>
          <div>
            <div className="label" style={{ marginBottom:8 }}>PIANIFICA LA SERA — PLAN AN EVENING VISIT</div>
            <h2 className="display" style={{ fontSize:36, fontWeight:600, margin:0, textTransform:'uppercase', letterSpacing:'-0.005em', lineHeight:1 }}>
              {step === 4 ? 'Until then.' : 'Reserve a Place'}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            appearance:'none', border:'1.5px solid var(--ink)', background:'transparent',
            width:40, height:40, color:'var(--ink)', cursor:'pointer', fontSize:20,
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'all .3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='var(--ink)'; e.currentTarget.style.color='var(--paper)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--ink)'; }}>×</button>
        </div>

        {/* Progress */}
        {step < 4 && (
          <div style={{ padding:'24px 40px 0', display:'flex', gap:0, borderBottom:'1px solid var(--ink)', paddingBottom:18 }}>
            {['DATE','ADMISSION','DETAILS','REVIEW'].map((l, i) => (
              <div key={l} style={{ flex:1, display:'flex', alignItems:'center', gap:10 }}>
                <div className="display" style={{
                  width:28, height:28, border:'1.5px solid var(--ink)', display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11, fontWeight:600, letterSpacing:0,
                  background: i <= step ? 'var(--ink)' : 'transparent',
                  color: i <= step ? 'var(--paper)' : 'var(--ink)',
                  transition:'background .3s, color .3s',
                }}>
                  {['I','II','III','IV'][i]}
                </div>
                <div className="label" style={{ color: i <= step ? 'var(--ink)' : 'rgba(13,10,6,0.4)' }}>{l}</div>
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
            padding:'20px 40px 28px', borderTop:'1px solid var(--ink)',
            display:'flex', justifyContent:'space-between', alignItems:'center', gap:18, flexWrap:'wrap',
            background:'var(--paper-2)',
          }}>
            <div>
              {selectedType && step >= 1 && (
                <div style={{ display:'flex', gap:24, alignItems:'baseline' }}>
                  <div>
                    <div className="label" style={{ color:'var(--gold-deep)' }}>TOTAL</div>
                    <div className="display" style={{ fontSize:28, fontWeight:600 }}>€{total}</div>
                  </div>
                  <div className="serif" style={{ fontSize:14, fontStyle:'italic', color:'var(--ink-soft)' }}>
                    {qty} × {selectedType.name} · €{subtotal} + €{fees} fees
                  </div>
                </div>
              )}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              {step > 0 && <button className="btn btn-sm" onClick={back}>Back</button>}
              {step < 3 && (
                <button className="btn btn-solid btn-sm" onClick={next}
                  disabled={(step===0 && !(date && time)) || (step===1 && !type) || (step===2 && !(info.name && info.email))}
                  style={{
                    opacity: ((step===0 && !(date && time)) || (step===1 && !type) || (step===2 && !(info.name && info.email))) ? 0.35 : 1,
                    cursor:  ((step===0 && !(date && time)) || (step===1 && !type) || (step===2 && !(info.name && info.email))) ? 'not-allowed' : 'pointer',
                  }}>Continue →</button>
              )}
              {step === 3 && <button className="btn btn-gold btn-sm" onClick={submit}>Confirm Reservation</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── STEP: DATE ─────────────────────────────────────────────────────────────
function StepDate({ date, time, setDate, setTime }) {
  const start = new Date(2026, 4, 6);
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(start); d.setDate(d.getDate() + i);
    return d;
  });
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div>
      <h3 className="display" style={{ fontSize:20, fontWeight:600, margin:'0 0 20px', textTransform:'uppercase', letterSpacing:'0.01em' }}>
        Choose an Evening
      </h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:6, marginBottom:32 }}>
        {days.map(d => {
          const closed = d.getDay() === 1;
          const sel = date && d.toDateString() === date.toDateString();
          return (
            <button key={d.toISOString()} disabled={closed}
              onClick={() => setDate(d)}
              style={{
                appearance:'none', cursor: closed ? 'not-allowed' : 'pointer',
                background: sel ? 'var(--ink)' : 'var(--paper-2)',
                color: sel ? 'var(--paper)' : (closed ? 'rgba(13,10,6,0.3)' : 'var(--ink)'),
                border: '1.5px solid var(--ink)',
                padding:'12px 6px',
                fontFamily:'var(--display)',
                opacity: closed ? 0.5 : 1,
                transition:'all .25s',
              }}>
              <div className="label" style={{ fontSize:9, color: sel ? 'var(--gold-bright)' : (closed ? 'inherit' : 'var(--gold-deep)') }}>
                {dayNames[d.getDay()]}
              </div>
              <div className="display" style={{ fontSize:24, lineHeight:1.1, margin:'4px 0 2px', fontWeight:600 }}>
                {d.getDate()}
              </div>
              <div className="serif" style={{ fontSize:11, fontStyle:'italic', opacity:0.7 }}>
                {closed ? 'closed' : monthNames[d.getMonth()]}
              </div>
            </button>
          );
        })}
      </div>

      {date && (
        <>
          <h3 className="display" style={{ fontSize:20, fontWeight:600, margin:'0 0 20px', textTransform:'uppercase', letterSpacing:'0.01em' }}>
            Choose an Entry Time
          </h3>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {SHOWTIMES.map(t => {
              const sel = time === t;
              return (
                <button key={t} onClick={() => setTime(t)}
                  className="btn btn-sm"
                  style={{
                    background: sel ? 'var(--ink)' : 'transparent',
                    color: sel ? 'var(--paper)' : 'var(--ink)',
                    fontFamily:'var(--serif)', fontStyle:'italic', fontSize:16, letterSpacing:0, textTransform:'none',
                    padding:'8px 16px',
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
      <h3 className="display" style={{ fontSize:20, fontWeight:600, margin:'0 0 20px', textTransform:'uppercase', letterSpacing:'0.01em' }}>
        Choose your Admission
      </h3>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:28 }}>
        {TICKET_TYPES.map(t => {
          const sel = type === t.id;
          return (
            <button key={t.id} onClick={() => setType(t.id)}
              style={{
                appearance:'none', cursor:'pointer', textAlign:'left',
                background: sel ? 'var(--ink)' : 'var(--paper)',
                color: sel ? 'var(--paper)' : 'var(--ink)',
                border:'1.5px solid var(--ink)',
                padding:'20px 22px',
                fontFamily:'var(--sans)',
                transition:'all .25s', position:'relative',
                boxShadow: sel ? '6px 6px 0 var(--oxblood)' : '3px 3px 0 var(--ink)',
              }}>
              <div className="label" style={{ color: sel ? 'var(--gold-bright)' : 'var(--gold-deep)', marginBottom:6 }}>{t.it}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
                <div className="display" style={{ fontSize:22, fontWeight:600, textTransform:'uppercase', letterSpacing:0 }}>{t.name}</div>
                <div className="display" style={{ fontSize:22, fontWeight:600, color: sel ? 'var(--gold-bright)' : 'var(--oxblood)' }}>€{t.price}</div>
              </div>
              <div className="serif" style={{ fontSize:13, fontStyle:'italic', marginBottom:8, opacity:0.75 }}>{t.time}</div>
              <div style={{ fontSize:13, lineHeight:1.5, opacity:0.85 }}>{t.desc}</div>
            </button>
          );
        })}
      </div>

      {type && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 22px', border:'1.5px solid var(--ink)', background:'var(--paper-2)' }}>
          <div>
            <div className="label" style={{ color:'var(--gold-deep)', marginBottom:4 }}>NUMBER OF GUESTS</div>
            <div className="serif" style={{ fontSize:14, fontStyle:'italic', color:'var(--ink-soft)' }}>Maximum eight per reservation.</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button onClick={() => setQty(Math.max(1, qty-1))} style={qtyBtn}>−</button>
            <span className="display" style={{ fontSize:32, minWidth:32, textAlign:'center', fontWeight:600 }}>{qty}</span>
            <button onClick={() => setQty(Math.min(8, qty+1))} style={qtyBtn}>+</button>
          </div>
        </div>
      )}
    </div>
  );
}
const qtyBtn = {
  appearance:'none', cursor:'pointer',
  width:36, height:36,
  background:'var(--paper)', border:'1.5px solid var(--ink)',
  color:'var(--ink)', fontSize:18, fontFamily:'var(--display)',
};

// ── STEP: DETAILS ──────────────────────────────────────────────────────────
function StepDetails({ info, setInfo }) {
  return (
    <div>
      <h3 className="display" style={{ fontSize:20, fontWeight:600, margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.01em' }}>
        Your Details
      </h3>
      <p className="serif" style={{ fontSize:14, fontStyle:'italic', color:'var(--ink-soft)', margin:'0 0 28px' }}>
        We'll send your reservation by email. We do not share these with anyone.
      </p>
      <div style={{ display:'grid', gap:24 }}>
        <Labeled label="NAME ON RESERVATION">
          <input className="field" placeholder="Lucia Marchetti" value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}/>
        </Labeled>
        <Labeled label="EMAIL">
          <input className="field" type="email" placeholder="lucia@correspondence.it" value={info.email}
            onChange={(e) => setInfo({ ...info, email: e.target.value })}/>
        </Labeled>
        <Labeled label="TELEPHONE (OPTIONAL)">
          <input className="field" placeholder="+39 ..." value={info.phone}
            onChange={(e) => setInfo({ ...info, phone: e.target.value })}/>
        </Labeled>
        <label style={{ display:'flex', gap:12, alignItems:'flex-start', fontSize:14, color:'var(--ink-soft)', lineHeight:1.5, cursor:'pointer', marginTop:6, fontFamily:'var(--serif)', fontStyle:'italic' }}>
          <input type="checkbox" defaultChecked style={{ accentColor:'var(--oxblood)', marginTop:3 }}/>
          <span>Send me <em>The Nocturne</em>, the museum's monthly missive, at midnight on the first Sunday.</span>
        </label>
      </div>
    </div>
  );
}
function Labeled({ label, children }) {
  return (
    <div>
      <div className="label" style={{ color:'var(--gold-deep)', marginBottom:8 }}>{label}</div>
      {children}
    </div>
  );
}

// ── STEP: REVIEW ───────────────────────────────────────────────────────────
function StepReview({ date, time, type, qty, info, subtotal, fees, total }) {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return (
    <div>
      <h3 className="display" style={{ fontSize:20, fontWeight:600, margin:'0 0 22px', textTransform:'uppercase', letterSpacing:'0.01em' }}>
        A Final Glance
      </h3>
      <div style={{ border:'1.5px solid var(--ink)', padding:'24px 28px', marginBottom:18, background:'var(--paper-2)' }}>
        <ReviewLine k="WHEN" v={`${date.toLocaleDateString('en-GB', { weekday:'long' })} · ${date.getDate()} ${months[date.getMonth()]} · ${time}`}/>
        <ReviewLine k="ADMISSION" v={`${type.name} (${type.it}) — ${type.time}`}/>
        <ReviewLine k="GUESTS" v={`${qty} ${qty === 1 ? 'visitor' : 'visitors'}`}/>
        <ReviewLine k="RESERVED BY" v={`${info.name} · ${info.email}`} last/>
      </div>
      <div style={{ border:'1.5px solid var(--ink)', padding:'20px 28px', background:'var(--paper)' }}>
        <CostLine k="Subtotal" v={`€${subtotal}`}/>
        <CostLine k="Booking fees" v={`€${fees}`}/>
        <hr className="line" style={{ margin:'12px 0' }}/>
        <CostLine k={<span className="display" style={{ fontSize:18, fontWeight:600 }}>TOTAL</span>} v={<span className="display" style={{ fontSize:24, fontWeight:600, color:'var(--oxblood)' }}>€{total}</span>}/>
      </div>
      <p className="serif" style={{ fontSize:13, color:'var(--ink-soft)', marginTop:18, fontStyle:'italic' }}>
        On the evening of your visit, please arrive at least fifteen minutes before your entry time. We open the doors at dusk.
      </p>
    </div>
  );
}
function ReviewLine({ k, v, last }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'12px 0', borderBottom: last ? 'none' : '1px solid rgba(13,10,6,0.15)', gap:24 }}>
      <span className="label" style={{ color:'var(--gold-deep)' }}>{k}</span>
      <span className="serif" style={{ fontSize:15, color:'var(--ink)', textAlign:'right' }}>{v}</span>
    </div>
  );
}
function CostLine({ k, v }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'4px 0' }}>
      <span style={{ fontSize:14 }}>{k}</span>
      <span style={{ fontSize:14 }}>{v}</span>
    </div>
  );
}

// ── STEP: CONFIRM ──────────────────────────────────────────────────────────
function StepConfirm({ confirm }) {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const { date, time, type, qty, total, code } = confirm;
  return (
    <div style={{ textAlign:'center', padding:'12px 0 8px' }}>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
        <Or.Sun size={88} color="var(--oxblood)"/>
      </div>
      <div className="label" style={{ color:'var(--gold-deep)', marginBottom:14 }}>RESERVATION CONFIRMED</div>
      <h3 className="display" style={{ fontSize:'clamp(28px, 4vw, 44px)', fontWeight:600, margin:'0 0 6px', textTransform:'uppercase', letterSpacing:'-0.005em', lineHeight:1 }}>
        We will be expecting
      </h3>
      <div className="serif" style={{ fontSize:'clamp(28px, 4vw, 44px)', fontStyle:'italic', color:'var(--oxblood)', lineHeight:1.05, marginBottom:20, paddingBottom:'0.15em' }}>
        you.
      </div>
      <p className="serif" style={{ fontSize:17, fontStyle:'italic', color:'var(--ink-soft)', maxWidth:480, margin:'0 auto 30px', lineHeight:1.5 }}>
        A confirmation has been sent to your inbox. Bring it, or simply your name — the porter will know.
      </p>
      <div style={{ maxWidth:520, margin:'0 auto', padding:'24px 28px', textAlign:'left', border:'1.5px solid var(--ink)', background:'var(--paper-2)' }}>
        <ReviewLine k="CONFIRMATION" v={code}/>
        <ReviewLine k="WHEN" v={`${months[date.getMonth()]} ${date.getDate()} · ${time}`}/>
        <ReviewLine k="ADMISSION" v={`${qty} × ${type.name}`}/>
        <ReviewLine k="PAID" v={`€${total}`} last/>
      </div>
    </div>
  );
}

window.ReservationModal = ReservationModal;
