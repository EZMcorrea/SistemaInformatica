import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ClientesPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q || "";
  const clients = await prisma.client.findMany({ where: q ? { corporateName: { contains: q, mode: "insensitive" } } : undefined, orderBy: { createdAt: "desc" } });
  return <div className="space-y-3"><div className="flex justify-between"><h1 className="text-2xl font-bold">Clientes</h1><Link href="/clientes/novo" className="btn-primary">Novo Cliente</Link></div>
    <form><input name="q" defaultValue={q} className="input max-w-sm" placeholder="Pesquisar cliente" /></form>
    <div className="card overflow-auto"><table className="table"><thead><tr><th>Nome</th><th>Cidade</th><th>Status</th><th>Ações</th></tr></thead><tbody>{clients.map(c=><tr key={c.id}><td>{c.corporateName}</td><td>{c.city}/{c.state}</td><td>{c.status}</td><td><Link href={`/clientes/${c.id}`} className="text-brand-700">Detalhes</Link></td></tr>)}</tbody></table></div></div>;
}
