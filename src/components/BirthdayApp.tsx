import { useEffect, useRef, useState, type ReactNode } from "react";
import { config as C } from "@/config";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

function Confetti({ run }: { run: number }) {
  const [bits, setBits] = useState<{ id: number; l: number; d: number; e: string; t: number }[]>([]);
  useEffect(() => {
    if (!run) return;
    const em = ["🎉", "💖", "🎊", "✨", "💕", "🌸"];
    setBits(Array.from({ length: 40 }, (_, i) => ({ id: run * 100 + i, l: Math.random() * 100, d: Math.random() * 0.8, e: em[i % em.length]!, t: 2 + Math.random() * 1.5 })));
    const t = setTimeout(() => setBits([]), 4000);
    return () => clearTimeout(t);
  }, [run]);
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {bits.map((b) => (
        <span key={b.id} className="absolute -top-8 text-2xl" style={{ left: `${b.l}%`, animation: `fall ${b.t}s ${b.d}s linear forwards` }}>{b.e}</span>
      ))}
    </div>
  );
}

function Hearts() {
  const h = useRef(Array.from({ length: 12 }, (_, i) => ({ l: (i * 37) % 100, d: (i * 1.7) % 12, t: 10 + (i % 5) * 2, s: 14 + (i % 4) * 6 }))).current;
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {h.map((x, i) => (
        <span key={i} className="absolute -bottom-8 text-rose" style={{ left: `${x.l}%`, fontSize: x.s, animation: `floatUp ${x.t}s ${x.d}s linear infinite` }}>♥</span>
      ))}
    </div>
  );
}

const Photo = ({ src, cap }: { src: string; cap?: string }) => (
  <figure className="card-soft anim-pop mx-auto w-full max-w-[260px] p-3 pb-2">
    <img src={src} alt={cap || "us"} className="aspect-square w-full rounded-xl object-cover" />
    {cap && <figcaption className="py-2 text-center font-script text-xl text-deep">{cap}</figcaption>}
  </figure>
);

const H = ({ children }: { children: ReactNode }) => <h2 className="text-center font-script text-4xl text-deep">{children}</h2>;

type P = { done: () => void; boom: () => void };

function Envelope({ done }: P) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="text-lg font-semibold">{C.envelope.text}</p>
      <button onClick={() => { setOpen(true); done(); }} className="text-[110px] transition-transform active:scale-90" aria-label="Open envelope">
        {open ? "💌" : "✉️"}
      </button>
      <p className="text-sm text-muted-foreground">{open ? "It's open! 💕" : "Tap to open"}</p>
    </div>
  );
}

function Birthday({ done, boom }: P) {
  const [lit, setLit] = useState([true, true, true]);
  const blow = (i: number) => {
    const n = lit.map((v, j) => (j === i ? false : v));
    setLit(n);
    if (n.every((v) => !v)) { boom(); done(); }
  };
  const out = lit.every((v) => !v);
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <H>{C.birthday.title}</H>
      <p className="text-xl font-bold text-deep">{C.birthday.sub} 🎈</p>
      <div className="relative mt-4">
        <div className="flex justify-center gap-6">
          {lit.map((on, i) => (
            <button key={i} onClick={() => on && blow(i)} className="flex flex-col items-center" aria-label="Blow candle">
              <span className={`h-6 text-2xl ${on ? "anim-flicker" : "opacity-0"}`}>🔥</span>
              <span className="h-12 w-3 rounded bg-lavender" />
            </button>
          ))}
        </div>
        <div className="h-16 w-56 rounded-t-2xl bg-rose" />
        <div className="h-16 w-64 -translate-x-4 rounded-2xl bg-deep" />
      </div>
      <p className="text-sm text-muted-foreground">{out ? "Make a wish! ✨" : C.birthday.hint}</p>
      {out && <div className="card-soft anim-pop p-5 font-semibold">{C.birthday.note} 💕</div>}
    </div>
  );
}

function DontClick({ done }: P) {
  const [n, setN] = useState(0);
  const m = C.dontClick.messages;

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <H>Whatever you do...</H>

      <button
        onClick={() => {
          setN(n + 1);
          if (n + 1 >= 4) done();
        }}
        className="btn-rose text-lg"
      >
        {C.dontClick.button}
      </button>

      {n > 0 && (
        <p
          key={n}
          className="anim-pop text-lg font-semibold text-deep"
        >
          {m[Math.min(n - 1, m.length - 1)]}
        </p>
      )}

    {n >= 4 && (
  <Photo
    src="/couple.jpg"
    cap="Us, being us ❤️"
  />
)}
    </div>
  );
}

function Quiz({ done, boom }: P) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [yes, setYes] = useState(false);
  const total = C.quiz.length;
  if (i < total) {
    const q = C.quiz[i]!;
    const right = pick === q.answer;
    return (
      <div className="card-soft anim-fade w-full p-5" key={i}>
        <p className="text-xs font-bold text-muted-foreground">Question {i + 1} of {total}</p>
        <p className="my-3 text-lg font-bold">{q.q}</p>
        <div className="grid gap-2">
          {q.options.map((o, j) => (
            <button key={j} disabled={pick !== null} onClick={() => { setPick(j); if (j === q.answer) setScore(score + 1); }}
              className={`rounded-xl border-2 p-3 text-left font-semibold transition ${pick !== null && j === q.answer ? "border-deep bg-rose/40" : pick === j ? "border-lavender bg-lavender" : "border-lavender bg-card"}`}>{o}</button>
          ))}
        </div>
        {pick !== null && (
          <div className="anim-fade mt-4 flex items-center justify-between gap-2">
            <span className="font-semibold text-deep">{right ? C.quizRight[i % C.quizRight.length] : C.quizWrong[i % C.quizWrong.length]}</span>
            <button className="btn-rose shrink-0" onClick={() => { setPick(null); setI(i + 1); }}>Next</button>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      <p className="card-soft p-4 font-semibold">You got {score} of {total}! {score >= 4 ? "You know us best 💖" : "Doesn't matter — you're my favourite anyway 💕"}</p>
      <div className="card-soft w-full p-5">
        <p className="mb-3 font-script text-3xl text-deep">{C.proposal.q}</p>
        <div className="grid gap-2">
          {C.proposal.options.map((o) => (
            <button key={o} onClick={() => { setYes(true); boom(); done(); }} className="rounded-xl border-2 border-lavender p-3 font-semibold active:bg-rose/40">{o}</button>
          ))}
        </div>
        {yes && <p className="anim-pop mt-4 text-2xl font-bold text-deep">{C.proposal.result}</p>}
      </div>
    </div>
  );
}


function Match({ done, boom }: P) {
  const [cards] = useState(() =>
    shuffle([...C.memory.keys(), ...C.memory.keys()])
  );

  const [open, setOpen] = useState<number[]>([]);
  const [got, setGot] = useState<number[]>([]);
  const [last, setLast] = useState<number | null>(null);

  const tap = (k: number) => {
    // Prevent clicking more than two cards
    if (
      open.length === 2 ||
      open.includes(k) ||
      got.includes(cards[k]!)
    ) {
      return;
    }

    const selected = [...open, k];
    setOpen(selected);

    if (selected.length === 2) {
      const first = cards[selected[0]!]!;
      const second = cards[selected[1]!]!;

      if (first === second) {
        // Correct match
        const updated = [...got, first];

        setGot(updated);
        setLast(first);
        setOpen([]);

        // All 8 pairs completed
        if (updated.length === C.memory.length) {
          boom();
          done();
        }
      } else {
        // Incorrect match: hide cards after 800ms
        setTimeout(() => {
          setOpen([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">

      <H>Memory Match</H>

      <p className="text-sm text-muted-foreground">
        {got.length} of {C.memory.length} pairs
      </p>

      <div className="grid w-full max-w-xs grid-cols-4 gap-2">

        {cards.map((c, k) => {
          const show = open.includes(k) || got.includes(c);

          return (
            <button
              key={k}
              onClick={() => tap(k)}
              className="flip aspect-square"
              disabled={got.includes(c)}
            >
              <div
                className={`flip-inner h-full w-full ${
                  show ? "flipped" : ""
                }`}
              >

                {/* Hidden card */}
                <div className="face card-soft flex items-center justify-center bg-rose text-2xl">
                  💗
                </div>

                {/* Revealed card */}
                <div
                  className={`face face-back card-soft flex items-center justify-center text-3xl ${
                    got.includes(c) ? "bg-lavender" : ""
                  }`}
                >
                  {C.memory[c]!.emoji}
                </div>

              </div>
            </button>
          );
        })}

      </div>

      {/* Show the photograph of the matched memory */}
      {last !== null && (
        <Photo
          key={last}
          src={C.memory[last]!.photo}
          cap={C.memory[last]!.caption}
        />
      )}

    </div>
  );
}


function Gifts({ done }: P) {
  const [o, setO] = useState<number[]>([]);
  const [cur, setCur] = useState<number | null>(null);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <H>Three little gifts</H>
      <div className="flex gap-4">
        {C.gifts.map((_, i) => (
          <button key={i} onClick={() => { const n = o.includes(i) ? o : [...o, i]; setO(n); setCur(i); if (n.length === 3) done(); }}
            className={`text-6xl transition active:scale-90 ${o.includes(i) ? "opacity-60" : "anim-beat"}`}>{o.includes(i) ? "🎀" : "🎁"}</button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{o.length} of 3 opened</p>
      {cur !== null && <Photo key={cur} src={C.gifts[cur]!.photo} cap={C.gifts[cur]!.caption} />}
    </div>
  );
}

function Timeline({ done }: P) {
  useEffect(done, []);
  return (
    <div className="w-full">
      <H>Memory Lane</H>
      <div className="relative mt-6 space-y-6 border-l-2 border-rose pl-6">
        {C.timeline.map((t, i) => (
          <div key={i} className="anim-fade relative" style={{ animationDelay: `${i * 0.15}s` }}>
            <span className="absolute -left-[33px] top-2 text-lg">💗</span>
            <p className="text-sm font-bold text-deep">{t.date}</p>
            <div className="card-soft mt-2 p-2 pb-1">
              <img src={t.photo} alt={t.caption} className="aspect-[4/3] w-full rounded-xl object-cover" />
              <p className="py-2 text-center font-script text-xl text-deep">{t.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function since(d: Date) {
  const n = new Date();
  let y = n.getFullYear() - d.getFullYear(), mo = n.getMonth() - d.getMonth();
  let a = new Date(d); a.setFullYear(d.getFullYear() + y); a.setMonth(d.getMonth() + mo);
  if (a > n) { mo--; a = new Date(d); a.setFullYear(d.getFullYear() + y); a.setMonth(d.getMonth() + mo); }
  if (mo < 0) { y--; mo += 12; }
  let s = Math.floor((n.getTime() - a.getTime()) / 1000);
  const days = Math.floor(s / 86400); s %= 86400;
  return { Years: y, Months: mo, Days: days, Hours: Math.floor(s / 3600), Mins: Math.floor((s % 3600) / 60), Secs: s % 60 };
}

function Universe({ done }: P) {
  const [seen, setSeen] = useState<number[]>([]);
  const [cur, setCur] = useState<number | null>(null);
  const [t, setT] = useState(() => since(new Date(C.startDate)));
  useEffect(() => { const i = setInterval(() => setT(since(new Date(C.startDate))), 1000); return () => clearInterval(i); }, []);
  const pos = C.stars.map((_, i) => ({ x: 12 + (i % 4) * 25 + (i % 2) * 5, y: 12 + Math.floor(i / 4) * 30 + (i % 3) * 7 }));
  const s = cur !== null ? C.stars[cur] : null;
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <H>Our Little Universe</H>
      <div className="relative h-72 w-full overflow-hidden rounded-3xl bg-night shadow-lg">
        {pos.map((p, i) => (
          <button key={i} onClick={() => { const n = seen.includes(i) ? seen : [...seen, i]; setSeen(n); setCur(i); if (n.length === 12) done(); }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 text-2xl ${seen.includes(i) ? "" : "anim-twinkle"}`} style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${i * 0.2}s` }}>
            {seen.includes(i) ? "🌟" : "⭐"}
          </button>
        ))}
      </div>
      <p className="text-sm font-bold text-deep">{seen.length} of 12 stars</p>
      {s && (s.photo ? <Photo key={cur} src={s.photo} /> : <p key={cur} className="card-soft anim-pop p-4 text-center font-semibold">{s.text} ✨</p>)}
      <div className="card-soft w-full p-4 text-center">
        <p className="text-sm font-semibold text-muted-foreground">Together for</p>
        <div className="my-2 grid grid-cols-3 gap-2">
          {Object.entries(t).map(([k, v]) => (
            <div key={k} className="rounded-xl bg-lavender p-2"><p className="text-xl font-bold text-deep">{v}</p><p className="text-xs">{k}</p></div>
          ))}
        </div>
        <p className="font-script text-xl text-deep">...and I'd do every second again.</p>
      </div>
    </div>
  );
}

function Reasons({ done }: P) {
  const [f, setF] = useState<number[]>([]);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <H>10 Reasons I Love You</H>
      <p className="text-sm text-muted-foreground">{f.length} of 10 flipped</p>
      <div className="grid w-full grid-cols-2 gap-3">
        {C.reasons.map((r, i) => (
          <button key={i} className="flip h-28" onClick={() => { if (!f.includes(i)) { const n = [...f, i]; setF(n); if (n.length === 10) done(); } }}>
            <div className={`flip-inner h-full w-full ${f.includes(i) ? "flipped" : ""}`}>
              <div className="face card-soft flex items-center justify-center bg-rose font-script text-3xl text-primary-foreground">#{i + 1}</div>
              <div className="face face-back card-soft flex items-center justify-center p-2 text-sm font-semibold">{r}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Letter({ boom, done }: P) {
  const L = C.letter;
  const [open, setOpen] = useState(false);
  const [n, setN] = useState(0);
  const [hug, setHug] = useState(false);
  useEffect(() => {
    if (!open || n >= L.text.length) return;
    const t = setTimeout(() => setN(n + 1), 40);
    return () => clearTimeout(t);
  }, [open, n]);
  if (!open) return (
    <div className="flex flex-col items-center gap-6">
      <span className="text-[100px]">💌</span>
      <button className="btn-rose" onClick={() => setOpen(true)}>{L.button}</button>
    </div>
  );
  return (
    <div className="flex w-full flex-col items-center gap-5 text-center">
      <div className="card-soft w-full whitespace-pre-line p-5 text-left font-script text-2xl leading-snug">
        {L.text.slice(0, n)}<span className="animate-pulse">|</span>
      </div>
      {n >= L.text.length && !hug && <button className="btn-rose anim-pop text-lg" onClick={() => { setHug(true); boom(); done(); }}>{L.hug} 🤗</button>}
      {hug && (
        <div className="anim-fade flex flex-col items-center gap-3">
          <span className="anim-beat text-8xl text-deep">❤</span>
          <p className="font-bold text-deep">{L.hugged}</p>
          <h2 className="mt-4 font-script text-4xl text-deep">{L.finalTitle}</h2>
          <p className="font-semibold">{L.finalSub}</p>
          <button className="mt-2 text-sm text-muted-foreground underline" onClick={boom}>More confetti 🎉</button>
        </div>
      )}
    </div>
  );
}

const STAGES = [Envelope, Birthday, DontClick, Quiz, Match, Gifts, Timeline, Universe, Reasons, Letter];

export default function BirthdayApp() {
  const [s, setS] = useState(0);
  const [ok, setOk] = useState<boolean[]>([]);
  const [boom, setBoom] = useState(0);
  const [muted, setMuted] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const start = () => {
      if (audio.current) return;
      const a = new Audio(C.music); a.loop = true; a.volume = 0.5; audio.current = a;
      a.play().catch(() => {});
    };
    window.addEventListener("pointerdown", start, { once: true });
    return () => window.removeEventListener("pointerdown", start);
  }, []);
  useEffect(() => { if (audio.current) audio.current.muted = muted; }, [muted]);
  const Stage = STAGES[s]!;
  const unlocked = ok.filter(Boolean).length;
  const go = (n: number) => { setS(n); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blush to-lavender/60">
      <Hearts />
      <Confetti run={boom} />
      <header className="sticky top-0 z-40 bg-blush/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="flex-1">
            <p className="font-script text-lg leading-none text-deep">{C.title}</p>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-lavender">
              <div className="h-full rounded-full bg-deep transition-all duration-500" style={{ width: `${(unlocked / 10) * 100}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{unlocked} of 10 unlocked</p>
          </div>
          <button onClick={() => setMuted(!muted)} className="card-soft h-10 w-10 text-lg" aria-label="Toggle music">{muted ? "🔇" : "🔊"}</button>
        </div>
      </header>
      <main key={s} className="anim-fade relative mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col items-center justify-center gap-8 px-5 py-8">
        <Stage done={() => setOk((o) => { const n = [...o]; n[s] = true; return n; })} boom={() => setBoom((b) => b + 1)} />
        <div className="flex w-full items-center justify-between">
          {s > 0 ? <button className="text-sm font-semibold text-muted-foreground" onClick={() => go(s - 1)}>← Back</button> : <span />}
          {s < 9 && <button className="btn-rose" disabled={!ok[s]} onClick={() => go(s + 1)}>{s === 0 ? C.envelope.button : "Continue"} →</button>}
        </div>
      </main>
    </div>
  );
}
