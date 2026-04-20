import { prisma } from "@/lib/db";
import { SimpleForm } from "@/components/ui/simple-form";

export default async function RoteadoresPage() {
  const routers = await prisma.routerConfig.findMany({ include: { client: true }, orderBy: { createdAt: "desc" }, take: 50 });
  const clients = await prisma.client.findMany({ select: { id: true, corporateName: true } });
  return <div className="space-y-3"><h1 className="text-2xl font-bold">Roteadores</h1>
    <p className="text-sm">Informe clientId usando um dos IDs: {clients.slice(0,3).map(c=>`${c.corporateName}: ${c.id}`).join(" | ")}</p>
    <SimpleForm endpoint="/api/routers" label="Salvar roteador" fields={["clientId","brand","model","routerIp","accessUser","accessPassword","wifiName","wifiPassword","provider","macAddress","installLocation","technicalNotes"]} />
    <div className="card overflow-auto"><table className="table"><thead><tr><th>Cliente</th><th>Marca/Modelo</th><th>IP</th></tr></thead><tbody>{routers.map(r=><tr key={r.id}><td>{r.client.corporateName}</td><td>{r.brand} {r.model}</td><td>{r.routerIp}</td></tr>)}</tbody></table></div></div>;
}
