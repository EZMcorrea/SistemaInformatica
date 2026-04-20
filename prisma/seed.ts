import { PrismaClient, UserRole, ServiceStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("Admin@123", 12);

  const [admin, tecnico, viewer] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@sistema.local" },
      update: {},
      create: { name: "Administrador", email: "admin@sistema.local", passwordHash: hash, role: UserRole.ADMIN }
    }),
    prisma.user.upsert({
      where: { email: "tecnico@sistema.local" },
      update: {},
      create: { name: "Técnico Exemplo", email: "tecnico@sistema.local", passwordHash: hash, role: UserRole.TECNICO }
    }),
    prisma.user.upsert({
      where: { email: "viewer@sistema.local" },
      update: {},
      create: { name: "Visualizador", email: "viewer@sistema.local", passwordHash: hash, role: UserRole.VISUALIZADOR }
    })
  ]);

  const client = await prisma.client.create({
    data: {
      corporateName: "Alfa Comércio LTDA",
      responsibleName: "João Pereira",
      document: "12.345.678/0001-99",
      phone: "(11) 3333-4444",
      whatsapp: "(11) 98888-7777",
      email: "contato@alfa.com.br",
      address: "Rua das Flores",
      number: "125",
      district: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01001-000",
      notes: "Cliente com contrato premium",
      createdById: admin.id,
      branches: {
        create: [{ name: "Matriz" }, { name: "Filial Norte" }]
      },
      routerConfigs: {
        create: {
          brand: "Mikrotik",
          model: "RB750",
          routerIp: "192.168.0.1",
          accessUser: "admin",
          accessPassword: "senhaforte",
          wifiName: "ALFA-WIFI",
          wifiPassword: "wifi123456",
          provider: "Vivo Fibra"
        }
      },
      cameraConfigs: {
        create: {
          cameraCount: 16,
          brand: "Intelbras",
          model: "MHDX 1016",
          equipmentType: "DVR",
          internalIp: "192.168.0.20",
          externalIp: "187.20.11.40",
          tcpPort: 37777,
          httpPort: 80,
          rtspPort: 554,
          accessUser: "admin",
          accessPassword: "123456",
          serialNumber: "SN-INT-001"
        }
      }
    }
  });

  await prisma.technicalService.create({
    data: {
      clientId: client.id,
      serviceType: "Configuração de roteador",
      description: "Ajuste de DHCP e redirecionamento de portas",
      technicianId: tecnico.id,
      serviceDate: new Date(),
      serviceTime: "14:00",
      status: ServiceStatus.CONCLUIDO,
      notes: "Serviço realizado com sucesso"
    }
  });

  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      entity: "seed",
      entityId: client.id,
      operation: "CREATE",
      details: "Carga inicial"
    }
  });

  console.log("Seed finalizado.");
}

main().finally(async () => prisma.$disconnect());
