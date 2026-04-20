"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const initial = { corporateName:"", responsibleName:"", document:"", phone:"", whatsapp:"", email:"", address:"", number:"", complement:"", district:"", city:"", state:"", zipCode:"", notes:"", status:"ATIVO" };

export function ClientForm({ data = initial, id }: { data?: any; id?: string }) {
  const [form, setForm] = useState(data); const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(id ? `/api/clients/${id}` : "/api/clients", { method: id ? "PUT" : "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(form) });
    if (res.ok) router.push("/clientes"); else alert("Erro ao salvar cliente");
  }
  return <form onSubmit={submit} className="card grid grid-cols-1 md:grid-cols-2 gap-3">{Object.keys(initial).map((k)=><input key={k} className="input" placeholder={k} value={(form as any)[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})} />)}<button className="btn-primary md:col-span-2">Salvar Cliente</button></form>;
}
