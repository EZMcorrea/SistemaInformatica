import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/http";
import PDFDocument from "pdfkit";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  const client = await prisma.client.findUnique({ where: { id: params.id }, include: { routerConfigs: true, cameraConfigs: true, technicalServices: { include: { technician: true } } } });
  if (!client) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });

  const chunks: Uint8Array[] = [];
  const doc = new PDFDocument({ margin: 30 });
  doc.on("data", (c) => chunks.push(c));

  doc.fontSize(18).text("TechInfo Manager - Relatório Técnico", { align: "center" });
  doc.moveDown().fontSize(12).text(`Cliente: ${client.corporateName}`);
  doc.text(`Responsável: ${client.responsibleName}`);
  doc.text(`Documento: ${client.document}`);
  doc.text(`Emitido em: ${new Date().toLocaleString("pt-BR")}`);

  doc.moveDown().fontSize(14).text("Roteadores");
  client.routerConfigs.forEach((r) => doc.fontSize(10).text(`- ${r.brand} ${r.model} | IP: ${r.routerIp} | Wi-Fi: ${r.wifiName}`));

  doc.moveDown().fontSize(14).text("Câmeras/CFTV");
  client.cameraConfigs.forEach((c) => doc.fontSize(10).text(`- ${c.equipmentType} ${c.brand} | Série: ${c.serialNumber} | IP: ${c.internalIp}/${c.externalIp}`));

  doc.moveDown().fontSize(14).text("Histórico de Serviços");
  client.technicalServices.forEach((s) => doc.fontSize(10).text(`- ${s.serviceType} (${s.status}) em ${new Date(s.serviceDate).toLocaleDateString("pt-BR")} por ${s.technician.name}`));

  doc.moveDown().fontSize(9).fillColor("gray").text("TechInfo Manager - Página 1", { align: "center" });
  doc.end();

  await new Promise<void>((resolve) => doc.on("end", () => resolve()));
  const pdf = Buffer.concat(chunks);
  return new NextResponse(pdf, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename=relatorio-${client.id}.pdf` } });
}
