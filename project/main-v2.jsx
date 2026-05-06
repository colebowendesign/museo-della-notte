// Main v2 — Renaissance modern
const { useState: useStateM, useEffect: useEffectM } = React;

function applyTweaks(t) {
  const root = document.documentElement;
  const pal = PALETTES[t.palette] || PALETTES["paper-oxblood"];
  root.style.setProperty('--paper', pal.paper);
  root.style.setProperty('--paper-2', pal.paper2);
  root.style.setProperty('--ink', pal.ink);
  root.style.setProperty('--gold', pal.gold);
  root.style.setProperty('--gold-deep', pal.goldDeep);
  root.style.setProperty('--oxblood', pal.oxblood);
  const fp = FONT_PAIRS[t.fontPair] || FONT_PAIRS["cinzel-cormorant-inter"];
  root.style.setProperty('--display', fp.display);
  root.style.setProperty('--serif', fp.serif);
  root.style.setProperty('--sans', fp.sans);
}

function MuseoApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [resOpen, setResOpen] = useStateM(false);

  useEffectM(() => { applyTweaks(t); }, [t]);
  useReveal();
  useFirefly(t.cursorTrail);

  return (
    <>
      <Nav onReserve={() => setResOpen(true)} />
      <Hero onReserve={() => setResOpen(true)} ornaments={t.ornaments}/>
      <Marquee/>
      <Featured onReserve={() => setResOpen(true)} ornaments={t.ornaments}/>
      <Collections ornaments={t.ornaments}/>
      <Programme ornaments={t.ornaments}/>
      <Membership ornaments={t.ornaments}/>
      <Visit ornaments={t.ornaments}/>
      <Newsletter ornaments={t.ornaments}/>
      <Footer ornaments={t.ornaments}/>

      <ReservationModal open={resOpen} onClose={() => setResOpen(false)} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette" />
        <TweakRadio label="Palette" value={t.palette}
          options={[
            { value:'paper-oxblood', label:'Paper + Oxblood' },
            { value:'ivory-indigo',  label:'Ivory + Indigo' },
            { value:'vellum-noir',   label:'Vellum + Noir' },
            { value:'rose-burgundy', label:'Rose + Burgundy' },
          ]}
          onChange={(v) => setTweak('palette', v)} />

        <TweakSection label="Type" />
        <TweakRadio label="Pairing" value={t.fontPair}
          options={[
            { value:'cinzel-cormorant-inter', label:'Cinzel + Cormorant' },
            { value:'playfair-eb-inter',      label:'Playfair + EB Garamond' },
            { value:'cormorant-only',         label:'Cormorant only' },
          ]}
          onChange={(v) => setTweak('fontPair', v)} />

        <TweakSection label="Atmosphere" />
        <TweakToggle label="Renaissance ornaments" value={t.ornaments}
          onChange={(v) => setTweak('ornaments', v)} />
        <TweakToggle label="Firefly cursor trail" value={t.cursorTrail}
          onChange={(v) => setTweak('cursorTrail', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MuseoApp/>);
