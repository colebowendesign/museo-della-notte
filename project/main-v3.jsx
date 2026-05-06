// Main v3 — full-bleed video edition
const { useState: useStateM, useEffect: useEffectM } = React;

function applyTweaks(t) {
  const root = document.documentElement;
  const pal = PALETTES[t.palette] || PALETTES["ivory-gold"];
  root.style.setProperty('--paper', pal.paper);
  root.style.setProperty('--gold', pal.gold);
  root.style.setProperty('--gold-bright', pal.goldBright);
  root.style.setProperty('--gold-deep', pal.goldDeep);
  root.style.setProperty('--oxblood', pal.oxblood);
  const fp = FONT_PAIRS[t.fontPair] || FONT_PAIRS["cinzel-cormorant-inter"];
  root.style.setProperty('--display', fp.display);
  root.style.setProperty('--serif', fp.serif);
  root.style.setProperty('--sans', fp.sans);
  root.style.setProperty('--glass-blur', `${t.glassBlur}px`);

  // adjust the bg veil opacity via filter on video
  const v = document.querySelector('.bg-video-wrap video');
  if (v) {
    const dim = 1 - t.videoDim;
    v.style.filter = `contrast(1.05) saturate(0.85) brightness(${0.4 + dim * 0.6})`;
  }
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
            { value:'ivory-gold',     label:'Ivory + Gold' },
            { value:'moonlit-silver', label:'Moonlit Silver' },
            { value:'ember-rose',     label:'Ember Rose' },
            { value:'cathedral',      label:'Cathedral' },
          ]}
          onChange={(v) => setTweak('palette', v)} />

        <TweakSection label="Atmosphere" />
        <TweakSlider label="Video dim" value={t.videoDim} min={0} max={0.8} step={0.05}
          onChange={(v) => setTweak('videoDim', v)} />
        <TweakSlider label="Glass blur" value={t.glassBlur} min={0} max={30} unit="px"
          onChange={(v) => setTweak('glassBlur', v)} />
        <TweakToggle label="Ornaments" value={t.ornaments}
          onChange={(v) => setTweak('ornaments', v)} />
        <TweakToggle label="Firefly cursor" value={t.cursorTrail}
          onChange={(v) => setTweak('cursorTrail', v)} />

        <TweakSection label="Type" />
        <TweakRadio label="Pairing" value={t.fontPair}
          options={[
            { value:'cinzel-cormorant-inter', label:'Cinzel + Cormorant' },
            { value:'playfair-eb-inter',      label:'Playfair + EB' },
            { value:'cormorant-only',         label:'Cormorant only' },
          ]}
          onChange={(v) => setTweak('fontPair', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MuseoApp/>);
