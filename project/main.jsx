// Main app entry — wires sections, applies tweaks, mounts modal + tweaks panel
const { useState: useStateM, useEffect: useEffectM } = React;

function applyTweaks(t) {
  const root = document.documentElement;
  const pal = PALETTES[t.palette] || PALETTES["gold-oxblood"];
  root.style.setProperty('--gold', pal.gold);
  root.style.setProperty('--gold-glow', pal.glow);
  root.style.setProperty('--gold-2', pal.gold);
  root.style.setProperty('--oxblood', pal.accent);
  root.style.setProperty('--indigo', pal.indigo);
  root.style.setProperty('--obsidian', pal.obsidian);
  root.style.setProperty('--ivory', pal.ivory);
  root.style.setProperty('--glass-blur', t.glassIntensity + 'px');
  root.style.setProperty('--glass-bg', `rgba(245, 236, 208, ${0.025 + t.glassIntensity * 0.0015})`);
  root.style.setProperty('--glass-border', `rgba(212, 175, 55, ${0.15 + t.glassIntensity * 0.005})`);
  root.style.setProperty('--star-density', String(t.starDensity));
  const fp = FONT_PAIRS[t.fontPair] || FONT_PAIRS["cormorant-inter"];
  root.style.setProperty('--serif', fp.serif);
  root.style.setProperty('--sans', fp.sans);
}

function MuseoApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [resOpen, setResOpen] = useStateM(false);

  useEffectM(() => { applyTweaks(t); }, [t]);
  useReveal();
  useFirefly(t.cursorTrail);

  const exhibitionsRef = () => {
    const el = document.getElementById('exhibitions');
    if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  };

  return (
    <>
      <Nav onReserve={() => setResOpen(true)} />
      <Hero
        onReserve={() => setResOpen(true)}
        onExhibitions={exhibitionsRef}
        lightRays={t.lightRays}
      />
      <Featured onReserve={() => setResOpen(true)} />
      <Collections />
      <Programme />
      <Membership />
      <Visit />
      <Newsletter />
      <Footer />

      <ReservationModal open={resOpen} onClose={() => setResOpen(false)} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette" />
        <TweakRadio label="Accent palette" value={t.palette}
          options={[
            { value:'gold-oxblood',  label:'Gold + Oxblood' },
            { value:'gold-ivory',    label:'Gold + Ivory' },
            { value:'antique-indigo',label:'Antique + Indigo' },
            { value:'porcelain-rose',label:'Porcelain Rose' },
          ]}
          onChange={(v) => setTweak('palette', v)} />

        <TweakSection label="Glass & atmosphere" />
        <TweakSlider label="Glass blur" value={t.glassIntensity} min={4} max={40} unit="px"
          onChange={(v) => setTweak('glassIntensity', v)} />
        <TweakSlider label="Star density" value={t.starDensity} min={0} max={1.4} step={0.05}
          onChange={(v) => setTweak('starDensity', v)} />
        <TweakToggle label="Moonbeam light rays" value={t.lightRays}
          onChange={(v) => setTweak('lightRays', v)} />

        <TweakSection label="Type" />
        <TweakRadio label="Font pairing" value={t.fontPair}
          options={[
            { value:'cormorant-inter',  label:'Cormorant + Inter' },
            { value:'playfair-inter',   label:'Playfair + Inter' },
            { value:'ebgaramond-inter', label:'EB Garamond + Inter' },
          ]}
          onChange={(v) => setTweak('fontPair', v)} />

        <TweakSection label="Cursor" />
        <TweakToggle label="Firefly trail" value={t.cursorTrail}
          onChange={(v) => setTweak('cursorTrail', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MuseoApp/>);
