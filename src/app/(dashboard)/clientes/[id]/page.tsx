import { prisma } from "@/lib/db";
import { maskSecret } from "@/lib/mask";
import { notFound } from "next/navigation";
import { ClientForm } from "@/components/ui/client-form";

export default async function ClienteDetalhe({ params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({ where: { id: params.id }, include: { routerConfigs: true, cameraConfigs: true, technicalServices: true, attachments: true } });
  if (!client) notFound();
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Detalhes do Cliente</h1><ClientForm id={client.id} data={client} />
    <div className="card"><h2 className="font-semibold">Roteadores</h2>{client.routerConfigs.map(r=><p key={r.id}>{r.brand} {r.model} | {r.routerIp} | Senha: {maskSecret(r.accessPassword)}</p>)}</div>
    <div className="card"><h2 className="font-semibold">Câmeras/CFTV</h2>{client.cameraConfigs.map(c=><p key={c.id}>{c.equipmentType} {c.brand} | Série {c.serialNumber} | Senha: {maskSecret(c.accessPassword)}</p>)}</div>
    <div className="card"><h2 className="font-semibold">Histórico de serviços</h2>{client.technicalServices.map(s=><p key={s.id}>{s.serviceType} - {new Date(s.serviceDate).toLocaleDateString("pt-BR")}</p>)}</div>
  </div>;
}
