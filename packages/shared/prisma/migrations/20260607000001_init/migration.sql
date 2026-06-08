-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'GUEST');

-- CreateEnum
CREATE TYPE "DiverStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'RETIRED');

-- CreateEnum
CREATE TYPE "DiveRole" AS ENUM ('DIVER', 'SUPERVISOR', 'SAFETY_OFFICER', 'TENDER');

-- CreateEnum
CREATE TYPE "DiveStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DECOMPRESSION');

-- CreateEnum
CREATE TYPE "DiveType" AS ENUM ('INSPECTION', 'MAINTENANCE', 'HARVEST', 'INSTALLATION', 'EMERGENCY', 'TRAINING');

-- CreateEnum
CREATE TYPE "SiteType" AS ENUM ('CAGE', 'PEN', 'NET', 'FAD', 'OTHER');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'RETIRED', 'LOST');

-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('MINOR', 'MODERATE', 'SERIOUS', 'CRITICAL', 'FATAL');

-- CreateEnum
CREATE TYPE "SpeciesCategory" AS ENUM ('FINFISH', 'SHELLFISH', 'CRUSTACEAN', 'SEAWEED', 'OTHER');

-- CreateEnum
CREATE TYPE "GrowthStage" AS ENUM ('FRY', 'JUVENILE', 'GROW_OUT', 'ADULT', 'BROODSTOCK');

-- CreateEnum
CREATE TYPE "CageShape" AS ENUM ('CIRCULAR', 'SQUARE', 'OCTAGONAL', 'RECTANGULAR', 'OTHER');

-- CreateEnum
CREATE TYPE "CageStatus" AS ENUM ('ACTIVE', 'EMPTY', 'STOCKING', 'HARVESTING', 'FALLOW', 'MAINTENANCE', 'DECOMMISSIONED');

-- CreateEnum
CREATE TYPE "NetMaterial" AS ENUM ('NYLON', 'POLYETHYLENE', 'POLYESTER', 'GALVANIZED_STEEL', 'COPPER_ALLOY', 'OTHER');

-- CreateEnum
CREATE TYPE "NetCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DAMAGED', 'REPLACED');

-- CreateEnum
CREATE TYPE "InspectionType" AS ENUM ('ROUTINE', 'STRUCTURAL', 'PRE_HARVEST', 'POST_STORM', 'EMERGENCY', 'ENVIRONMENTAL', 'HEALTH', 'MORTALITY');

-- CreateEnum
CREATE TYPE "InspectionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "TransferReason" AS ENUM ('GRADING', 'STOCKING', 'RESTOCKING', 'HARVEST', 'SPLITTING', 'MEDICAL_TREATMENT', 'MORTALITY_REMOVAL', 'RELOCATION', 'OTHER');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STAFF',
    "phone" TEXT,
    "avatar" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "divers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "certification" TEXT,
    "specialties" TEXT,
    "maxDepth" DOUBLE PRECISION,
    "totalDiveHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "medicalCert" TEXT,
    "medicalExpiry" TIMESTAMP(3),
    "status" "DiverStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "divers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dive_sites" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siteType" "SiteType" NOT NULL DEFAULT 'CAGE',
    "location" TEXT,
    "coordinates" TEXT,
    "depth" DOUBLE PRECISION,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dive_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dive_operations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "diveType" "DiveType" NOT NULL DEFAULT 'INSPECTION',
    "status" "DiveStatus" NOT NULL DEFAULT 'PLANNED',
    "siteId" TEXT NOT NULL,
    "plannedDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "maxDepth" DOUBLE PRECISION,
    "bottomTime" INTEGER,
    "weatherCondition" TEXT,
    "waterTemp" DOUBLE PRECISION,
    "visibility" DOUBLE PRECISION,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dive_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dive_teams" (
    "id" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "role" "DiveRole" NOT NULL DEFAULT 'DIVER',
    "diverId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dive_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dive_team_members" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "DiveRole" NOT NULL DEFAULT 'DIVER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dive_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dive_logs" (
    "id" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "diverId" TEXT NOT NULL,
    "teamId" TEXT,
    "role" "DiveRole" NOT NULL DEFAULT 'DIVER',
    "diveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "maxDepth" DOUBLE PRECISION,
    "avgDepth" DOUBLE PRECISION,
    "bottomTime" INTEGER,
    "waterTemp" DOUBLE PRECISION,
    "visibility" DOUBLE PRECISION,
    "equipment" TEXT,
    "tasks" TEXT,
    "findings" TEXT,
    "incidentNotes" TEXT,
    "gasMix" TEXT,
    "tankStart" DOUBLE PRECISION,
    "tankEnd" DOUBLE PRECISION,
    "airConsumption" DOUBLE PRECISION,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dive_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklists" (
    "id" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedBy" TEXT,
    "completedAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "serialNumber" TEXT,
    "brand" TEXT,
    "model" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "lastInspection" TIMESTAMP(3),
    "nextInspection" TIMESTAMP(3),
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "diveLogId" TEXT,
    "operationId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "IncidentSeverity" NOT NULL DEFAULT 'MINOR',
    "actionTaken" TEXT,
    "reportedById" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "species" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scientificName" TEXT,
    "code" TEXT NOT NULL,
    "category" "SpeciesCategory" NOT NULL DEFAULT 'FINFISH',
    "description" TEXT,
    "optimalTempMin" DOUBLE PRECISION,
    "optimalTempMax" DOUBLE PRECISION,
    "optimalSalinityMin" DOUBLE PRECISION,
    "optimalSalinityMax" DOUBLE PRECISION,
    "optimalDO" DOUBLE PRECISION,
    "growthRate" DOUBLE PRECISION,
    "maxDensity" DOUBLE PRECISION,
    "avgMarketWeight" DOUBLE PRECISION,
    "daysToHarvest" INTEGER,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cages" (
    "id" TEXT NOT NULL,
    "cageNumber" TEXT NOT NULL,
    "name" TEXT,
    "siteId" TEXT NOT NULL,
    "speciesId" TEXT,
    "shape" "CageShape" NOT NULL DEFAULT 'CIRCULAR',
    "depth" DOUBLE PRECISION,
    "circumference" DOUBLE PRECISION,
    "diameter" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION,
    "maxCapacity" INTEGER,
    "currentFishCount" INTEGER,
    "currentBiomass" DOUBLE PRECISION,
    "avgWeight" DOUBLE PRECISION,
    "stockingDensity" DOUBLE PRECISION,
    "status" "CageStatus" NOT NULL DEFAULT 'EMPTY',
    "installationDate" TIMESTAMP(3),
    "lastCleaningDate" TIMESTAMP(3),
    "lastStockingDate" TIMESTAMP(3),
    "lastHarvestDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nets" (
    "id" TEXT NOT NULL,
    "cageId" TEXT NOT NULL,
    "netNumber" TEXT NOT NULL,
    "meshSize" DOUBLE PRECISION,
    "material" "NetMaterial" NOT NULL DEFAULT 'NYLON',
    "depth" DOUBLE PRECISION,
    "circumference" DOUBLE PRECISION,
    "condition" "NetCondition" NOT NULL DEFAULT 'GOOD',
    "installationDate" TIMESTAMP(3),
    "removalDate" TIMESTAMP(3),
    "lastCleaningDate" TIMESTAMP(3),
    "lastRepairDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspections" (
    "id" TEXT NOT NULL,
    "cageId" TEXT NOT NULL,
    "inspectionType" "InspectionType" NOT NULL DEFAULT 'ROUTINE',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "conductedById" TEXT,
    "healthScore" INTEGER,
    "mortalityRate" DOUBLE PRECISION,
    "mortalityCount" INTEGER,
    "biomass" DOUBLE PRECISION,
    "avgWeight" DOUBLE PRECISION,
    "waterTemp" DOUBLE PRECISION,
    "dissolvedOxygen" DOUBLE PRECISION,
    "salinity" DOUBLE PRECISION,
    "visibility" DOUBLE PRECISION,
    "findings" TEXT,
    "recommendations" TEXT,
    "status" "InspectionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL,
    "inspectionId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'image/jpeg',
    "size" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "caption" TEXT,
    "altText" TEXT,
    "takenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fish_transfers" (
    "id" TEXT NOT NULL,
    "fromCageId" TEXT NOT NULL,
    "toCageId" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "fishCount" INTEGER NOT NULL,
    "avgWeight" DOUBLE PRECISION,
    "totalWeight" DOUBLE PRECISION,
    "reason" "TransferReason" NOT NULL DEFAULT 'GRADING',
    "status" "TransferStatus" NOT NULL DEFAULT 'PLANNED',
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "performedById" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fish_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "divers_userId_key" ON "divers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "dive_teams_operationId_diverId_key" ON "dive_teams"("operationId", "diverId");

-- CreateIndex
CREATE UNIQUE INDEX "dive_team_members_teamId_userId_key" ON "dive_team_members"("teamId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_serialNumber_key" ON "equipment"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "species_code_key" ON "species"("code");

-- CreateIndex
CREATE UNIQUE INDEX "cages_siteId_cageNumber_key" ON "cages"("siteId", "cageNumber");

-- CreateIndex
CREATE UNIQUE INDEX "nets_cageId_netNumber_key" ON "nets"("cageId", "netNumber");

-- AddForeignKey
ALTER TABLE "divers" ADD CONSTRAINT "divers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_sites" ADD CONSTRAINT "dive_sites_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_operations" ADD CONSTRAINT "dive_operations_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "dive_sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_operations" ADD CONSTRAINT "dive_operations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_teams" ADD CONSTRAINT "dive_teams_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "dive_operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_teams" ADD CONSTRAINT "dive_teams_diverId_fkey" FOREIGN KEY ("diverId") REFERENCES "divers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_team_members" ADD CONSTRAINT "dive_team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "dive_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_team_members" ADD CONSTRAINT "dive_team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_logs" ADD CONSTRAINT "dive_logs_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "dive_operations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_logs" ADD CONSTRAINT "dive_logs_diverId_fkey" FOREIGN KEY ("diverId") REFERENCES "divers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_logs" ADD CONSTRAINT "dive_logs_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "dive_teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_logs" ADD CONSTRAINT "dive_logs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "dive_operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_diveLogId_fkey" FOREIGN KEY ("diveLogId") REFERENCES "dive_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "dive_operations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cages" ADD CONSTRAINT "cages_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "dive_sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cages" ADD CONSTRAINT "cages_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nets" ADD CONSTRAINT "nets_cageId_fkey" FOREIGN KEY ("cageId") REFERENCES "cages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_cageId_fkey" FOREIGN KEY ("cageId") REFERENCES "cages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_conductedById_fkey" FOREIGN KEY ("conductedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "inspections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fish_transfers" ADD CONSTRAINT "fish_transfers_fromCageId_fkey" FOREIGN KEY ("fromCageId") REFERENCES "cages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fish_transfers" ADD CONSTRAINT "fish_transfers_toCageId_fkey" FOREIGN KEY ("toCageId") REFERENCES "cages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fish_transfers" ADD CONSTRAINT "fish_transfers_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fish_transfers" ADD CONSTRAINT "fish_transfers_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
