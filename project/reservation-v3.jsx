// Reservation flow v3 — dark / glass theme over video
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
      background: open ? 'rgba(0,0,0,0.6)' : 'transparent',
      backdropFilter: open ? 'blur(8px)' : 'none',
      WebkitBackdropFilter: open ? 'blur(8px)' : 'none',
      transition:'all .3s ease',
      opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'24px',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="glass-strong" style={{
        width:'min(960px, 100%)', maxHeight:'92vh', overflow:'auto',
        color:'var(--paper)',
        borderRadius:12, position:'relative',
        boxShadow:'0 0 0 1px rgba(241,198,106,0.4), 0 60px 120px rgba(0,0,0,0.7), 0 0 80px rgba(241,198,106,0.15)',
        transform: open ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(20px)',
        transition:'transform .4s cubic-bezier(.2,.8,.2,1)',
      }}>
        {/* Header */}
        <div style={{ padding:'28px 40px 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:'1px solid rgba(243,234,212,0.15)', paddingBottom:24 }}>
          <div>
            <div className="label" style={{ marginBottom:8 }}>PIANIFICA LA SERA — PLAN AN EVENING VISIT</div>
            <h2 className="display legible" style={{ fontSize:36, fontWeight:600, margin:0, textTransform:'uppercase', letterSpacing:'-0.005em', lineHeight:1, color:'var(--paper)' }}>
              {step === 4 ? 'Until then.' : 'Reserve a Place'}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            appearance:'none', border:'1px solid rgba(243,234,212,0.4)', background:'transparent',
            width:40, height:40, color:'var(--paper)', cursor:'pointer', fontSize:20,
            display:'flex', alignItems:'center', justifyContent:'center',
            borderRadius:'50%', transition:'all .3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold-bright)'; e.currentTarget.style.color='var(--gold-bright)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(243,234,212,0.4)'; e.currentTarget.style.color='var(--paper)'; }}>×</button>
        </div>

        {/* Progress */}
        {step < 4 && (
          <div style={{ padding:'24px 40px 0', display:'flex', gap:0, borderBottom:'1px solid rgba(243,234,212,0.15)', paddingBottom:18 }}>
            {['DATE','ADMISSION','DETAILS','REVIEW'].map((l, i) => (
              <div key={l} style={{ flex:1, display:'flex', alignItems:'center', gap:10 }}>
                <div className="display" style={{
                  width:28, height:28, borderRadius:'50%', border:'1px solid var(--gold-bright)', display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11, fontWeight:600, letterSpacing:0,
                  background: i <= step ? 'var(--gold-bright)' : 'transparent',
                  color: i <= step ? '#1a1208' : 'var(--gold-bright)',
                  transition:'background .3s, color .3s',
                }}>
                  {['I','II','III','IV'][i]}
                </div>
                <div className="label" style={{ color: i <= step ? 'var(--gold-bright)' : 'rgba(243,234,212,0.4)' }}>{l}</div>
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
            padding:'20px 40px 28px', borderTop:'1px solid rgba(243,234,212,0.15)',
            display:'flex', justifyContent:'space-between', alignItems:'center', gap:18, flexWrap:'wrap',
            background:'rgba(6,7,13,0.4)',
          }}>
            <div>
              {selectedType && step >= 1 && (
                <div style={{ display:'flex', gap:24, alignItems:'baseline' }}>
                  <div>
                    <div className="label">TOTAL</div>
                    <div className="display legible" style={{ fontSize:28, fontWeight:600, color:'var(--paper)' }}>€{total}</div>
                  </div>
                  <div className="serif" style={{ fontSize:14, fontStyle:'italic', color:'var(--paper-mute)' }}>
                    {qty} × {selectedType.name} · €{subtotal} + €{fees} fees
                  </div>
                </div>
              )}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              {step > 0 && <button className="btn btn-sm" onClick={back}>Back</button>}
              {step < 3 && (
                <button className="btn btn-gold btn-sm" onClick={next}
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
      <h3 className="display legible" style={{ fontSize:20, fontWeight:600, margin:'0 0 20px', textTransform:'uppercase', letterSpacing:'0.01em', color:'var(--paper)' }}>
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
                background: sel ? 'var(--gold-bright)' : 'rgba(8,9,16,0.42)',
                color: sel ? '#1a1208' : (closed ? 'rgba(243,234,212,0.25)' : 'var(--paper)'),
                border: sel ? '1px solid var(--gold-bright)' : '1px solid rgba(243,234,212,0.18)',
                borderRadius:6,
                padding:'12px 6px',
                fontFamily:'var(--display)',
                opacity: closed ? 0.5 : 1,
                transition:'all .25s',
              }}>
              <div className="label" style={{ fontSize:9, color: sel ? '#1a1208' : (closed ? 'inherit' : 'var(--gold-bright)') }}>
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
          <h3 className="display legible" style={{ fontSize:20, fontWeight:600, margin:'0 0 20px', textTransform:'uppercase', letterSpacing:'0.01em', color:'var(--paper)' }}>
            Choose an Entry Time
          </h3>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {SHOWTIMES.map(t => {
              const sel = time === t;
              return (
                <button key={t} onClick={() => setTime(t)}
                  className="btn btn-sm"
                  style={{
                    background: sel ? 'var(--gold-bright)' : 'rgba(8,9,16,0.42)',
                    color: sel ? '#1a1208' : 'var(--paper)',
                    borderColor: sel ? 'var(--gold-bright)' : 'rgba(243,234,212,0.45)',
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

function StepTickets({ type, setType, qty, setQty }) {
  return (
    <div>
      <h3 className="display legible" style={{ fontSize:20, fontWeight:600, margin:'0 0 20px', textTransform:'uppercase', letterSpacing:'0.01em', color:'var(--paper)' }}>
        Choose your Admission
      </h3>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:28 }}>
        {TICKET_TYPES.map(t => {
          const sel = type === t.id;
          return (
            <button key={t.id} onClick={() => setType(t.id)}
              style={{
                appearance:'none', cursor:'pointer', textAlign:'left',
                background: sel ? 'rgba(241,198,106,0.12)' : 'rgba(8,9,16,0.42)',
                color: 'var(--paper)',
                border: sel ? '1px solid var(--gold-bright)' : '1px solid rgba(243,234,212,0.18)',
                borderRadius:8,
                padding:'20px 22px',
                fontFamily:'var(--sans)',
                transition:'all .25s', position:'relative',
                boxShadow: sel ? '0 0 0 1px rgba(241,198,106,0.5), 0 0 30px rgba(241,198,106,0.2)' : 'none',
              }}>
              <div className="label" style={{ marginBottom:6 }}>{t.it}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
                <div className="display" style={{ fontSize:22, fontWeight:600, textTransform:'uppercase', letterSpacing:0 }}>{t.name}</div>
                <div className="display" style={{ fontSize:22, fontWeight:600, color:'var(--gold-bright)' }}>€{t.price}</div>
              </div>
              <div className="serif" style={{ fontSize:13, fontStyle:'italic', marginBottom:8, color:'var(--paper-mute)' }}>{t.time}</div>
              <div style={{ fontSize:13, lineHeight:1.5, color:'var(--paper-soft)' }}>{t.desc}</div>
            </button>
          );
        })}
      </div>

      {type && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 22px', border:'1px solid rgba(243,234,212,0.18)', borderRadius:8, background:'rgba(8,9,16,0.42)' }}>
          <div>
            <div className="label" style={{ marginBottom:4 }}>NUMBER OF GUESTS</div>
            <div className="serif" style={{ fontSize:14, fontStyle:'italic', color:'var(--paper-mute)' }}>Maximum eight per reservation.</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button onClick={() => setQty(Math.max(1, qty-1))} style={qtyBtn}>−</button>
            <span className="display legible" style={{ fontSize:32, minWidth:32, textAlign:'center', fontWeight:600, color:'var(--paper)' }}>{qty}</span>
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
  background:'rgba(8,9,16,0.6)', border:'1px solid rgba(243,234,212,0.4)',
  color:'var(--paper)', fontSize:18, fontFamily:'var(--display)',
};

function StepDetails({ info, setInfo }) {
  return (
    <div>
      <h3 className="display legible" style={{ fontSize:20, fontWeight:600, margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.01em', color:'var(--paper)' }}>
        Your Details
      </h3>
      <p className="serif" style={{ fontSize:14, fontStyle:'italic', color:'var(--paper-mute)', margin:'0 0 28px' }}>
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
        <label style={{ display:'flex', gap:12, alignItems:'flex-start', fontSize:14, color:'var(--paper-soft)', lineHeight:1.5, cursor:'pointer', marginTop:6, fontFamily:'var(--serif)', fontStyle:'italic' }}>
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
      <div className="label" style={{ marginBottom:8 }}>{label}</div>
      {children}
    </div>
  );
}

function StepReview({ date, time, type, qty, info, subtotal, fees, total }) {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return (
    <div>
      <h3 className="display legible" style={{ fontSize:20, fontWeight:600, margin:'0 0 22px', textTransform:'uppercase', letterSpacing:'0.01em', color:'var(--paper)' }}>
        A Final Glance
      </h3>
      <div style={{ border:'1px solid rgba(243,234,212,0.18)', borderRadius:8, padding:'24px 28px', marginBottom:18, background:'rgba(8,9,16,0.42)' }}>
        <ReviewLine k="WHEN" v={`${date.toLocaleDateString('en-GB', { weekday:'long' })} · ${date.getDate()} ${months[date.getMonth()]} · ${time}`}/>
        <ReviewLine k="ADMISSION" v={`${type.name} (${type.it}) — ${type.time}`}/>
        <ReviewLine k="GUESTS" v={`${qty} ${qty === 1 ? 'visitor' : 'visitors'}`}/>
        <ReviewLine k="RESERVED BY" v={`${info.name} · ${info.email}`} last/>
      </div>
      <div style={{ border:'1px solid rgba(243,234,212,0.18)', borderRadius:8, padding:'20px 28px', background:'rgba(8,9,16,0.6)' }}>
        <CostLine k="Subtotal" v={`€${subtotal}`}/>
        <CostLine k="Booking fees" v={`€${fees}`}/>
        <hr className="line" style={{ margin:'12px 0' }}/>
        <CostLine k={<span className="display legible" style={{ fontSize:18, fontWeight:600, color:'var(--paper)' }}>TOTAL</span>} v={<span className="display legible" style={{ fontSize:24, fontWeight:600, color:'var(--gold-bright)' }}>€{total}</span>}/>
      </div>
      <p className="serif" style={{ fontSize:13, color:'var(--paper-mute)', marginTop:18, fontStyle:'italic' }}>
        On the evening of your visit, please arrive at least fifteen minutes before your entry time. We open the doors at dusk.
      </p>
    </div>
  );
}
function ReviewLine({ k, v, last }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'12px 0', borderBottom: last ? 'none' : '1px solid rgba(243,234,212,0.10)', gap:24 }}>
      <span className="label">{k}</span>
      <span className="serif" style={{ fontSize:15, color:'var(--paper)', textAlign:'right' }}>{v}</span>
    </div>
  );
}
function CostLine({ k, v }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'4px 0', color:'var(--paper-soft)' }}>
      <span style={{ fontSize:14 }}>{k}</span>
      <span style={{ fontSize:14 }}>{v}</span>
    </div>
  );
}

function StepConfirm({ confirm }) {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const { date, time, type, qty, total, code } = confirm;
  return (
    <div style={{ textAlign:'center', padding:'12px 0 8px' }}>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
        <Or.Sun size={88} color="var(--gold-bright)"/>
      </div>
      <div className="label" style={{ marginBottom:14 }}>RESERVATION CONFIRMED</div>
      <h3 className="display legible-strong" style={{ fontSize:'clamp(28px, 4vw, 44px)', fontWeight:600, margin:'0 0 6px', textTransform:'uppercase', letterSpacing:'-0.005em', lineHeight:1, color:'var(--paper)' }}>
        We will be expecting
      </h3>
      <div className="serif legible-strong" style={{ fontSize:'clamp(28px, 4vw, 44px)', fontStyle:'italic', color:'var(--gold-bright)', lineHeight:1.05, marginBottom:20, paddingBottom:'0.15em' }}>
        you.
      </div>
      <p className="serif legible" style={{ fontSize:17, fontStyle:'italic', color:'var(--paper-soft)', maxWidth:480, margin:'0 auto 30px', lineHeight:1.5 }}>
        A confirmation has been sent to your inbox. Bring it, or simply your name — the porter will know.
      </p>
      <div style={{ maxWidth:520, margin:'0 auto', padding:'24px 28px', textAlign:'left', border:'1px solid rgba(243,234,212,0.18)', borderRadius:8, background:'rgba(8,9,16,0.42)' }}>
        <ReviewLine k="CONFIRMATION" v={code}/>
        <ReviewLine k="WHEN" v={`${months[date.getMonth()]} ${date.getDate()} · ${time}`}/>
        <ReviewLine k="ADMISSION" v={`${qty} × ${type.name}`}/>
        <ReviewLine k="PAID" v={`€${total}`} last/>
      </div>
    </div>
  );
}

window.ReservationModal = ReservationModal;
