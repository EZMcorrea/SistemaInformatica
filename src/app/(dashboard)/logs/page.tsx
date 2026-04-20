import { prisma } from "@/lib/db";

export default async function LogsPage() {
  const logs = await prisma.activityLog.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 100 });
  return <div className="space-y-3"><h1 className="text-2xl font-bold">Logs e Rastreabilidade</h1>
  <div className="card overflow-auto"><table className="table"><thead><tr><th>Data</th><th>Usuário</th><th>Entidade</th><th>Operação</th><th>Detalhes</th></tr></thead><tbody>{logs.map(l=><tr key={l.id}><td>{new Date(l.createdAt).toLocaleString("pt-BR")}</td><td>{l.user.name}</td><td>{l.entity}</td><td>{l.operation}</td><td>{l.details}</td></tr>)}</tbody></table></div></div>;
}
