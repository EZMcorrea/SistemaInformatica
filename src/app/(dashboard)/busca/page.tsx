"use client";
import { useState } from "react";

export default function BuscaPage() {
  const [q, setQ] = useState(""); const [result, setResult] = useState<any>(null);
  async function search(e: React.FormEvent){ e.preventDefault(); const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`); setResult(await r.json()); }
  return <div className="space-y-3"><h1 className="text-2xl font-bold">Busca Global</h1>
  <form onSubmit={search} className="flex gap-2"><input className="input max-w-md" value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por cliente, IP, técnico, série..."/><button className="btn-primary">Buscar</button></form>
  {result && <div className="grid md:grid-cols-3 gap-3">{Object.entries(result).map(([k,v]: any)=><div className="card" key={k}><h2 className="font-semibold mb-1">{k}</h2><p>{v.length} registros</p></div>)}</div>}</div>;
}
