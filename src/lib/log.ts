import { prisma } from "@/lib/db";
export const logActivity = (userId: string, entity: string, entityId: string, operation: string, details?: string) =>
  prisma.activityLog.create({ data: { userId, entity, entityId, operation, details } });
