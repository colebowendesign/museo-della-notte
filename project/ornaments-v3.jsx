// Ornaments — original Renaissance-inspired SVG flourishes (no copyrighted designs)
// Geometric/symbolic: stars, crescents, fleurons composed from primitives, laurel sprigs, columns, frames
// Designed to fill negative space and add visual richness without gradients or glass

const Or = {};

Or.Fleuron = ({ size=40, color='var(--gold-deep)', style }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={style}>
    <circle cx="20" cy="20" r="2.2" fill={color}/>
    <path d="M20 20 Q14 14 8 20 Q14 26 20 20" stroke={color} strokeWidth="1" fill="none"/>
    <path d="M20 20 Q26 14 32 20 Q26 26 20 20" stroke={color} strokeWidth="1" fill="none"/>
    <path d="M20 20 Q14 14 20 8 Q26 14 20 20" stroke={color} strokeWidth="1" fill="none"/>
    <path d="M20 20 Q14 26 20 32 Q26 26 20 20" stroke={color} strokeWidth="1" fill="none"/>
    <circle cx="20" cy="8" r="0.8" fill={color}/>
    <circle cx="20" cy="32" r="0.8" fill={color}/>
    <circle cx="8" cy="20" r="0.8" fill={color}/>
    <circle cx="32" cy="20" r="0.8" fill={color}/>
  </svg>
);

Or.Crescent = ({ size=24, color='var(--gold)', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path d="M19 12a8 8 0 1 1-7.5-7.98 6.5 6.5 0 0 0 7.5 7.98z" fill={color} />
  </svg>
);

Or.Sun = ({ size=80, color='var(--gold-deep)', style }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={style}>
    <circle cx="40" cy="40" r="14" stroke={color} strokeWidth="1.2" fill="none"/>
    <circle cx="40" cy="40" r="9" stroke={color} strokeWidth="0.8" fill="none"/>
    <circle cx="40" cy="40" r="2" fill={color}/>
    {Array.from({length:16}).map((_,i)=>{
      const a = (i*22.5) * Math.PI/180;
      const r1 = 17, r2 = i%2===0 ? 32 : 26;
      return <line key={i} x1={40 + Math.cos(a)*r1} y1={40 + Math.sin(a)*r1} x2={40 + Math.cos(a)*r2} y2={40 + Math.sin(a)*r2} stroke={color} strokeWidth={i%2===0 ? 1 : 0.6}/>;
    })}
    <circle cx="40" cy="40" r="38" stroke={color} strokeWidth="0.4" fill="none" strokeDasharray="2 3"/>
  </svg>
);

Or.LaurelSprig = ({ width=120, color='var(--gold-deep)', style, flip=false }) => (
  <svg width={width} height={width*0.45} viewBox="0 0 120 54" fill="none" style={{ transform: flip ? 'scaleX(-1)' : 'none', ...style }}>
    <path d="M5 27 Q 60 27 115 27" stroke={color} strokeWidth="1" fill="none"/>
    {Array.from({length:7}).map((_,i)=>{
      const x = 18 + i*14;
      return (
        <g key={i}>
          <ellipse cx={x} cy={18} rx={6} ry={2.2} fill="none" stroke={color} strokeWidth="0.7" transform={`rotate(-30 ${x} 18)`}/>
          <ellipse cx={x+3} cy={36} rx={6} ry={2.2} fill="none" stroke={color} strokeWidth="0.7" transform={`rotate(30 ${x+3} 36)`}/>
        </g>
      );
    })}
    <circle cx="115" cy="27" r="1.6" fill={color}/>
    <circle cx="5" cy="27" r="1.6" fill={color}/>
  </svg>
);

Or.Wreath = ({ size=120, color='var(--gold-deep)', style }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={style}>
    <circle cx="60" cy="60" r="44" stroke={color} strokeWidth="0.8" fill="none" strokeDasharray="1 4"/>
    {Array.from({length:18}).map((_,i)=>{
      const a = (i*20) * Math.PI/180;
      const x = 60 + Math.cos(a)*44, y = 60 + Math.sin(a)*44;
      return <ellipse key={i} cx={x} cy={y} rx={6} ry={2} fill="none" stroke={color} strokeWidth="0.7" transform={`rotate(${i*20} ${x} ${y})`}/>;
    })}
    <circle cx="60" cy="16" r="2" fill={color}/>
    <circle cx="60" cy="104" r="2" fill={color}/>
  </svg>
);

Or.CompassRose = ({ size=120, color='var(--ink)', style }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={style}>
    <circle cx="60" cy="60" r="58" stroke={color} strokeWidth="0.6" fill="none"/>
    <circle cx="60" cy="60" r="48" stroke={color} strokeWidth="0.4" fill="none"/>
    <circle cx="60" cy="60" r="32" stroke={color} strokeWidth="0.4" fill="none"/>
    <path d="M60 8 L66 60 L60 112 L54 60 Z" fill={color} opacity="0.85"/>
    <path d="M8 60 L60 54 L112 60 L60 66 Z" fill={color} opacity="0.5"/>
    <path d="M22 22 L60 56 L98 22 L62 60 L98 98 L60 64 L22 98 L58 60 Z" fill={color} opacity="0.18"/>
    <circle cx="60" cy="60" r="3" fill={color}/>
    <text x="60" y="6" textAnchor="middle" fontFamily="var(--display)" fontSize="9" fill={color} fontWeight="600">N</text>
    <text x="116" y="63" textAnchor="middle" fontFamily="var(--display)" fontSize="9" fill={color} fontWeight="600">E</text>
    <text x="60" y="119" textAnchor="middle" fontFamily="var(--display)" fontSize="9" fill={color} fontWeight="600">S</text>
    <text x="4" y="63" textAnchor="middle" fontFamily="var(--display)" fontSize="9" fill={color} fontWeight="600">O</text>
  </svg>
);

Or.Column = ({ height=200, color='var(--ink)', style }) => (
  <svg width={50} height={height} viewBox={`0 0 50 ${height}`} fill="none" style={style} preserveAspectRatio="none">
    {/* capital */}
    <rect x="2" y="0" width="46" height="6" fill={color}/>
    <rect x="6" y="6" width="38" height="4" fill={color}/>
    <rect x="10" y="10" width="30" height="14" fill="none" stroke={color} strokeWidth="0.8"/>
    {/* shaft */}
    <rect x="14" y="24" width="22" height={height-50} fill="none" stroke={color} strokeWidth="0.8"/>
    {Array.from({length:Math.floor((height-50)/12)}).map((_,i)=>(
      <line key={i} x1="14" y1={28 + i*12} x2="36" y2={28 + i*12} stroke={color} strokeWidth="0.3"/>
    ))}
    {/* base */}
    <rect x="6" y={height-26} width="38" height="6" fill={color}/>
    <rect x="2" y={height-20} width="46" height="20" fill={color}/>
  </svg>
);

Or.Star4 = ({ size=20, color='var(--gold-deep)', style }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={style}>
    <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" fill={color}/>
  </svg>
);

Or.Star8 = ({ size=24, color='var(--gold-deep)', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path d="M12 0 L13.5 9 L22.6 6 L17 12 L22.6 18 L13.5 15 L12 24 L10.5 15 L1.4 18 L7 12 L1.4 6 L10.5 9 Z" fill={color}/>
  </svg>
);

Or.Cross = ({ size=20, color='var(--ink)', style }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={style}>
    <path d="M10 1 L10 19 M1 10 L19 10" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M6 5 L14 5 M6 15 L14 15" stroke={color} strokeWidth="0.8" strokeLinecap="round"/>
  </svg>
);

Or.Arch = ({ width=200, height=240, color='var(--ink)', style }) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={style}>
    <path d={`M10 ${height-10} L10 ${width/2} A${width/2-10} ${width/2-10} 0 0 1 ${width-10} ${width/2} L${width-10} ${height-10}`} stroke={color} strokeWidth="1.2" fill="none"/>
    <path d={`M22 ${height-10} L22 ${width/2+5} A${width/2-22} ${width/2-22} 0 0 1 ${width-22} ${width/2+5} L${width-22} ${height-10}`} stroke={color} strokeWidth="0.5" fill="none"/>
    <circle cx={width/2} cy={width/2} r="3" fill={color}/>
  </svg>
);

Or.AmpersandFlourish = ({ size=80, color='var(--oxblood)', style }) => (
  <svg width={size} height={size*1.2} viewBox="0 0 80 96" fill="none" style={style}>
    <text x="40" y="72" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="84" fill={color} fontWeight="500">&amp;</text>
  </svg>
);

Or.Ornate = ({ width=300, color='var(--gold-deep)', style }) => (
  <svg width={width} height="20" viewBox="0 0 300 20" fill="none" style={style}>
    <line x1="0" y1="10" x2="120" y2="10" stroke={color} strokeWidth="0.8"/>
    <line x1="180" y1="10" x2="300" y2="10" stroke={color} strokeWidth="0.8"/>
    <circle cx="135" cy="10" r="1.4" fill={color}/>
    <circle cx="165" cy="10" r="1.4" fill={color}/>
    <path d="M150 4 L153 10 L150 16 L147 10 Z" fill={color}/>
    <path d="M125 4 Q150 -3 175 4" stroke={color} strokeWidth="0.5" fill="none"/>
    <path d="M125 16 Q150 23 175 16" stroke={color} strokeWidth="0.5" fill="none"/>
  </svg>
);

Or.Candle = ({ size=24, color='var(--gold-bright)', style }) => (
  <svg width={size} height={size*1.6} viewBox="0 0 24 38" fill="none" style={style}>
    <ellipse cx="12" cy="6" rx="2" ry="4" fill={color}/>
    <ellipse cx="12" cy="5" rx="1" ry="2.4" fill="#fff" opacity="0.7"/>
    <line x1="12" y1="10" x2="12" y2="14" stroke={color} strokeWidth="0.6"/>
    <rect x="9" y="14" width="6" height="20" fill={color} opacity="0.85"/>
    <ellipse cx="12" cy="14" rx="3" ry="0.9" fill={color}/>
  </svg>
);

Or.RomanNumeral = ({ children, size=80, color='var(--oxblood)', style }) => (
  <span className="display" style={{
    fontSize:size, lineHeight:1, color, letterSpacing:'0.05em', fontWeight:600,
    ...style,
  }}>{children}</span>
);

// Big decorative initial cap for section headers
Or.Initial = ({ letter, size=180, color='var(--oxblood)', style }) => (
  <div style={{
    fontFamily:'var(--display)', fontWeight:600,
    fontSize:size, lineHeight:0.9, color,
    letterSpacing:'-0.01em',
    ...style,
  }}>
    {letter}
  </div>
);

// Decorative frame corner
Or.Corner = ({ size=60, color='var(--gold-deep)', style, rotate=0 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform:`rotate(${rotate}deg)`, ...style }}>
    <path d="M0 0 L60 0 M0 0 L0 60" stroke={color} strokeWidth="1.5"/>
    <path d="M8 8 L52 8 M8 8 L8 52" stroke={color} strokeWidth="0.5"/>
    <circle cx="0" cy="0" r="2.5" fill={color}/>
    <path d="M0 14 L14 0" stroke={color} strokeWidth="0.5"/>
    <path d="M0 22 L22 0" stroke={color} strokeWidth="0.3"/>
    <circle cx="14" cy="14" r="1.5" fill={color}/>
  </svg>
);

window.Or = Or;
