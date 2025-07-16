-- AlterTable
ALTER TABLE "PilotProject" ADD COLUMN "endDate" DATETIME;
ALTER TABLE "PilotProject" ADD COLUMN "goals" TEXT;
ALTER TABLE "PilotProject" ADD COLUMN "kpis" JSONB;
ALTER TABLE "PilotProject" ADD COLUMN "milestones" JSONB;
ALTER TABLE "PilotProject" ADD COLUMN "startDate" DATETIME;
