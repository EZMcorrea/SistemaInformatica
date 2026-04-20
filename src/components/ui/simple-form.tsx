"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SimpleForm({ endpoint, fields, data = {}, id, label }: { endpoint:string; fields:string[]; data?:any; id?:string; label:string }) {
  const [form, setForm] = useState(data); const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const url = id ? `${endpoint}/${id}` : endpoint;
    const res = await fetch(url, { method: id ? "PUT" : "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(form) });
    if (res.ok) router.refresh(); else alert("Erro no envio");
  }
  return <form onSubmit={submit} className="card grid grid-cols-1 md:grid-cols-2 gap-3">{fields.map((k)=><input key={k} className="input" placeholder={k} value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})} />)}<button className="btn-primary md:col-span-2">{label}</button></form>;
}
