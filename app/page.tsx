'use client';

import { useMemo, useState } from 'react';
import { Category, sampleSubmissions, scoreSubmission, Submission } from '@/lib/scoring';

const suggestions = ['/evaluate', '/rank', '/compare', '/why'];
const categories: Category[] = ['Builder', 'Engineer', 'Founder', 'Designer', 'Artist', 'Researcher', 'Other'];

export default function Page() {
  const [command, setCommand] = useState('');
  const [anim, setAnim] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>(sampleSubmissions);
  const [form, setForm] = useState<Submission>({ id: '', name: '', reply: '', link: '', valueAdd: '', category: 'Builder' });

  const scored = useMemo(() => submissions.map(scoreSubmission).sort((a, b) => b.total - a.total), [submissions]);

  const runEvaluate = () => {
    const steps = ['Parsing input…', 'Detecting builder signal…', 'Evaluating originality…', 'Scoring contribution…'];
    steps.forEach((step, i) => setTimeout(() => setAnim(step), i * 600));
    setTimeout(() => setAnim('Score ready.'), steps.length * 600);
  };

  const onCommand = (value: string) => {
    setCommand(value);
    if (value.trim() === '/evaluate') runEvaluate();
    if (value.trim() === '/rank') setSubmissions((s) => [...s]);
  };

  return (
    <main className="min-h-screen bg-matte text-[#f5f1ea] p-5 md:p-10">
      <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="panel p-8 md:p-12">
          <p className="uppercase tracking-[0.3em] text-xs text-[#d8c3a8]">Codex System</p>
          <h1 className="text-4xl md:text-6xl leading-tight tracking-wide mt-4">Codex Discovery Layer</h1>
          <p className="text-xl text-[#e7d9c8] mt-4">Ranking people by signal, not clout.</p>
          <p className="text-[#dccab4]/90 mt-5 max-w-2xl">A prototype system that evaluates replies based on originality, builder signal, execution, and contribution to the room.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#submit" className="px-5 py-3 rounded-full bg-gradient-to-r from-[#8f4f2d] to-[#d8c3a8] text-black font-medium">Submit your reply</a>
            <a href="#leaderboard" className="px-5 py-3 rounded-full border border-[#d8c3a8]/40">View leaderboard</a>
          </div>
          <div className="mt-8 panel p-4 rounded-2xl">
            <input value={command} onChange={(e) => onCommand(e.target.value)} placeholder='> type "/evaluate"' className="w-full bg-transparent outline-none text-[#f5f1ea] placeholder:text-[#d8c3a8]/60" />
            {command.startsWith('/') && <div className="mt-3 flex gap-2 flex-wrap text-sm text-[#d8c3a8]">{suggestions.map((s) => <button key={s} onClick={() => onCommand(s)} className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10">{s}</button>)}</div>}
            {anim && <p className="mt-3 text-sm text-[#e7d9c8] transition-all duration-500">{anim}</p>}
          </div>
        </section>

        <section className="panel p-6" id="share">
          <h2 className="text-2xl">Share block</h2>
          <p className="mt-4 text-[#e7d9c8] whitespace-pre-line">I didn’t just reply.\nI built the layer that should evaluate the thread.\n\nCodex-style ranking for:\n— originality\n— builder signal\n— execution\n— contribution to the room.</p>
        </section>
      </div>

      <section id="submit" className="mx-auto max-w-7xl mt-6 panel p-6 md:p-8">
        <h2 className="text-2xl">Submit your reply</h2>
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          {['name', 'reply', 'link', 'valueAdd'].map((f) => (
            <input key={f} placeholder={f === 'valueAdd' ? 'What do you bring to the room?' : f === 'name' ? 'Name or handle' : f === 'reply' ? 'Reply text' : 'Link (GitHub / demo / project)'} className="rounded-xl bg-white/5 border border-white/10 p-3" value={(form as any)[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
          ))}
          <select className="rounded-xl bg-white/5 border border-white/10 p-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
          <button className="rounded-xl bg-gradient-to-r from-[#8f4f2d] to-[#d8c3a8] text-black p-3 font-medium" onClick={() => setSubmissions([{ ...form, id: String(Date.now()) }, ...submissions])}>Evaluate submission</button>
        </div>
      </section>

      <section id="leaderboard" className="mx-auto max-w-7xl mt-6">
        <div className="flex items-center justify-between mb-4"><h2 className="text-2xl">Leaderboard</h2><button className="px-4 py-2 rounded-full border border-[#d8c3a8]/40" onClick={() => setSubmissions((s) => [...s].sort(() => Math.random() - 0.5))}>Rank like Codex</button></div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {scored.map((s) => (
            <article key={s.id} className="panel p-5 hover:-translate-y-0.5 transition duration-300 ease-in-out">
              <div className="flex justify-between"><h3 className="text-lg">{s.name}</h3><span className="text-3xl text-[#d8c3a8] font-semibold">{s.total}</span></div>
              <p className="text-sm text-[#c7b39d]">{s.category}</p>
              <div className="mt-3 space-y-2 text-sm">{Object.entries(s.breakdown).map(([k,v]) => <div key={k}><div className="flex justify-between"><span>{k}</span><span>{v}</span></div><div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#8f4f2d] to-[#d8c3a8]" style={{width: `${v}%`}} /></div></div>)}</div>
              <p className="mt-3 text-sm text-[#e7d9c8]">{s.explanation}</p>
              {s.link && <a className="inline-block mt-3 text-sm underline text-[#d8c3a8]" href={s.link}>Open proof link</a>}
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl mt-6 panel p-6">
        <h2 className="text-2xl">How it works</h2>
        <p className="mt-3 text-[#e7d9c8]">This prototype ranks replies by signal, not likes.</p>
        <ul className="mt-3 text-[#dccab4] list-disc ml-6"><li>Originality: specific ideas over generic hype.</li><li>Builder signal: evidence of shipping, systems, and rigor.</li><li>Execution: proof links, metrics, and concrete outputs.</li><li>Contribution: what you add to the room.</li></ul>
      </section>

      <footer className="mx-auto max-w-7xl mt-6 pb-8 text-sm text-[#c7b39d]">Built by OrbittArt — an AI-native operating system for culture and intelligent discovery.</footer>
    </main>
  );
}
