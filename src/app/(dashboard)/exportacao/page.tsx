import { prisma } from "@/lib/db";

export default async function ExportacaoPage() {
  const clients = await prisma.client.findMany({ select: { id: true, corporateName: true } });
  return <div className="space-y-3"><h1 className="text-2xl font-bold">Exportação em PDF</h1>
  <div className="card space-y-2">{clients.map(c=><a key={c.id} className="block text-brand-700" href={`/api/pdf/client/${c.id}`} target="_blank">Exportar relatório técnico de {c.corporateName}</a>)}</div></div>;
}
