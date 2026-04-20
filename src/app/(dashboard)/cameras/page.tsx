import { prisma } from "@/lib/db";
import { SimpleForm } from "@/components/ui/simple-form";

export default async function CamerasPage() {
  const list = await prisma.cameraConfig.findMany({ include: { client: true }, orderBy: { createdAt: "desc" } });
  return <div className="space-y-3"><h1 className="text-2xl font-bold">Câmeras/CFTV</h1>
    <SimpleForm endpoint="/api/cameras" label="Salvar equipamento" fields={["clientId","branchId","cameraCount","brand","model","equipmentType","internalIp","externalIp","tcpPort","httpPort","rtspPort","accessUser","accessPassword","serialNumber","installLocation","technicalNotes"]} />
    <div className="card overflow-auto"><table className="table"><thead><tr><th>Cliente</th><th>Equipamento</th><th>IP</th><th>Série</th></tr></thead><tbody>{list.map(c=><tr key={c.id}><td>{c.client.corporateName}</td><td>{c.equipmentType} {c.brand}</td><td>{c.internalIp}/{c.externalIp}</td><td>{c.serialNumber}</td></tr>)}</tbody></table></div></div>;
}
