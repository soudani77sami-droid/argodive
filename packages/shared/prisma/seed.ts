import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@argodive.com',
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      phone: '+1-555-0100',
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@argodive.com',
      name: 'Marine Manager',
      role: 'MANAGER',
      phone: '+1-555-0101',
    },
  });

  const diver1User = await prisma.user.create({
    data: {
      email: 'diver1@argodive.com',
      name: 'Alex Waters',
      role: 'STAFF',
      phone: '+1-555-0102',
    },
  });

  const diver2User = await prisma.user.create({
    data: {
      email: 'diver2@argodive.com',
      name: 'Sam Reef',
      role: 'STAFF',
      phone: '+1-555-0103',
    },
  });

  const diver3User = await prisma.user.create({
    data: {
      email: 'diver3@argodive.com',
      name: 'Jordan Kelp',
      role: 'STAFF',
      phone: '+1-555-0104',
    },
  });

  // Divers
  const diver1 = await prisma.diver.create({
    data: {
      userId: diver1User.id,
      certification: 'Advanced Open Water',
      specialties: 'Deep dive, underwater inspection',
      maxDepth: 40,
      totalDiveHours: 1200,
      status: 'ACTIVE',
    },
  });

  const diver2 = await prisma.diver.create({
    data: {
      userId: diver2User.id,
      certification: 'Rescue Diver',
      specialties: 'Net repair, underwater welding',
      maxDepth: 35,
      totalDiveHours: 850,
      status: 'ACTIVE',
    },
  });

  const diver3 = await prisma.diver.create({
    data: {
      userId: diver3User.id,
      certification: 'Master Scuba Diver',
      specialties: 'Marine biology, fish health assessment',
      maxDepth: 45,
      totalDiveHours: 2000,
      status: 'ACTIVE',
    },
  });

  // Species
  const salmon = await prisma.species.create({
    data: {
      name: 'Atlantic Salmon',
      scientificName: 'Salmo salar',
      code: 'SAL',
      category: 'FINFISH',
      description: 'Primary farmed species for cold-water aquaculture',
      optimalTempMin: 8,
      optimalTempMax: 16,
      optimalSalinityMin: 28,
      optimalSalinityMax: 35,
      optimalDO: 7,
      growthRate: 0.8,
      maxDensity: 15,
      avgMarketWeight: 4.5,
      daysToHarvest: 540,
      isActive: true,
    },
  });

  const seabass = await prisma.species.create({
    data: {
      name: 'European Seabass',
      scientificName: 'Dicentrarchus labrax',
      code: 'SB',
      category: 'FINFISH',
      description: 'Popular Mediterranean species',
      optimalTempMin: 18,
      optimalTempMax: 26,
      optimalSalinityMin: 30,
      optimalSalinityMax: 38,
      optimalDO: 6,
      growthRate: 0.6,
      maxDensity: 20,
      avgMarketWeight: 1.5,
      daysToHarvest: 365,
      isActive: true,
    },
  });

  const oyster = await prisma.species.create({
    data: {
      name: 'Pacific Oyster',
      scientificName: 'Crassostrea gigas',
      code: 'OY',
      category: 'SHELLFISH',
      description: 'Fast-growing oyster species for coastal farming',
      optimalTempMin: 12,
      optimalTempMax: 24,
      optimalSalinityMin: 25,
      optimalSalinityMax: 35,
      optimalDO: 5,
      growthRate: 1.2,
      maxDensity: 50,
      avgMarketWeight: 0.1,
      daysToHarvest: 180,
      isActive: true,
    },
  });

  // Dive Sites
  const siteNorth = await prisma.diveSite.create({
    data: {
      name: 'North Bay Farm',
      siteType: 'CAGE',
      location: 'North Bay, Sector A',
      coordinates: '48.8566° N, 2.3522° W',
      depth: 25,
      description: 'Primary salmon farming site in the northern bay',
      isActive: true,
      createdById: admin.id,
    },
  });

  const siteSouth = await prisma.diveSite.create({
    data: {
      name: 'South Cove Facility',
      siteType: 'CAGE',
      location: 'South Cove, Sector B',
      coordinates: '48.7500° N, 2.1500° W',
      depth: 30,
      description: 'Seabass and mixed species farming area',
      isActive: true,
      createdById: admin.id,
    },
  });

  // Cages
  const cageA1 = await prisma.cage.create({
    data: {
      cageNumber: 'A1',
      name: 'North Alpha 1',
      siteId: siteNorth.id,
      speciesId: salmon.id,
      shape: 'CIRCULAR',
      depth: 20,
      circumference: 80,
      diameter: 25,
      volume: 7850,
      maxCapacity: 50000,
      currentFishCount: 42000,
      currentBiomass: 189000,
      avgWeight: 4.5,
      stockingDensity: 12.5,
      status: 'ACTIVE',
      installationDate: new Date('2025-01-15'),
      lastStockingDate: new Date('2025-03-01'),
      notes: 'Primary grow-out cage for Q1 stocking',
    },
  });

  const cageA2 = await prisma.cage.create({
    data: {
      cageNumber: 'A2',
      name: 'North Alpha 2',
      siteId: siteNorth.id,
      speciesId: salmon.id,
      shape: 'CIRCULAR',
      depth: 22,
      circumference: 80,
      diameter: 25,
      volume: 7850,
      maxCapacity: 50000,
      currentFishCount: 38000,
      currentBiomass: 152000,
      avgWeight: 4.0,
      stockingDensity: 11.2,
      status: 'ACTIVE',
      installationDate: new Date('2025-02-01'),
      lastStockingDate: new Date('2025-04-15'),
    },
  });

  const cageB1 = await prisma.cage.create({
    data: {
      cageNumber: 'B1',
      name: 'South Beta 1',
      siteId: siteSouth.id,
      speciesId: seabass.id,
      shape: 'CIRCULAR',
      depth: 18,
      circumference: 60,
      diameter: 19,
      volume: 4500,
      maxCapacity: 30000,
      currentFishCount: 25000,
      currentBiomass: 37500,
      avgWeight: 1.5,
      stockingDensity: 16.7,
      status: 'ACTIVE',
      installationDate: new Date('2025-03-01'),
      lastStockingDate: new Date('2025-05-01'),
    },
  });

  const cageB2 = await prisma.cage.create({
    data: {
      cageNumber: 'B2',
      name: 'South Beta 2',
      siteId: siteSouth.id,
      speciesId: seabass.id,
      shape: 'CIRCULAR',
      depth: 18,
      circumference: 60,
      diameter: 19,
      volume: 4500,
      maxCapacity: 30000,
      currentFishCount: 28000,
      currentBiomass: 42000,
      avgWeight: 1.5,
      stockingDensity: 18.2,
      status: 'ACTIVE',
      installationDate: new Date('2025-03-15'),
      lastStockingDate: new Date('2025-05-15'),
    },
  });

  const cageC1 = await prisma.cage.create({
    data: {
      cageNumber: 'C1',
      name: 'North Charlie 1',
      siteId: siteNorth.id,
      shape: 'SQUARE',
      depth: 15,
      circumference: 50,
      diameter: 16,
      volume: 3000,
      maxCapacity: 20000,
      currentFishCount: 0,
      currentBiomass: 0,
      status: 'FALLOW',
      installationDate: new Date('2024-06-01'),
      lastHarvestDate: new Date('2025-06-01'),
      notes: 'Currently in fallow period after harvest',
    },
  });

  // Nets for cages
  await prisma.net.create({
    data: {
      cageId: cageA1.id,
      netNumber: 'A1-N1',
      meshSize: 24,
      material: 'POLYETHYLENE',
      depth: 22,
      circumference: 82,
      condition: 'GOOD',
      installationDate: new Date('2025-01-15'),
      lastCleaningDate: new Date('2025-05-15'),
    },
  });

  await prisma.net.create({
    data: {
      cageId: cageA1.id,
      netNumber: 'A1-N2',
      meshSize: 18,
      material: 'POLYESTER',
      depth: 22,
      circumference: 82,
      condition: 'EXCELLENT',
      installationDate: new Date('2025-06-01'),
    },
  });

  await prisma.net.create({
    data: {
      cageId: cageB1.id,
      netNumber: 'B1-N1',
      meshSize: 20,
      material: 'NYLON',
      depth: 20,
      circumference: 62,
      condition: 'GOOD',
      installationDate: new Date('2025-03-01'),
      lastCleaningDate: new Date('2025-04-20'),
    },
  });

  // Inspections
  await prisma.inspection.create({
    data: {
      cageId: cageA1.id,
      inspectionType: 'ROUTINE',
      title: 'Weekly Health Check - Cage A1',
      description: 'Standard weekly health and net integrity inspection',
      scheduledDate: new Date('2026-06-01'),
      completedDate: new Date('2026-06-01'),
      conductedById: diver1User.id,
      healthScore: 92,
      mortalityRate: 0.3,
      mortalityCount: 126,
      biomass: 188000,
      avgWeight: 4.48,
      waterTemp: 12.5,
      dissolvedOxygen: 7.2,
      salinity: 32.1,
      visibility: 8,
      findings: 'All nets intact. Fish behavior normal. Minimal mortality.',
      recommendations: 'Continue routine feeding schedule. Monitor temperature changes.',
      status: 'COMPLETED',
    },
  });

  await prisma.inspection.create({
    data: {
      cageId: cageA2.id,
      inspectionType: 'ROUTINE',
      title: 'Weekly Health Check - Cage A2',
      description: 'Standard weekly health inspection',
      scheduledDate: new Date('2026-06-01'),
      completedDate: new Date('2026-06-01'),
      conductedById: diver2User.id,
      healthScore: 88,
      mortalityRate: 0.4,
      mortalityCount: 152,
      biomass: 151000,
      avgWeight: 3.97,
      waterTemp: 12.6,
      dissolvedOxygen: 7.0,
      salinity: 32.0,
      visibility: 7.5,
      findings: 'Minor net fouling observed. Fish feeding response good.',
      recommendations: 'Schedule net cleaning within 2 weeks.',
      status: 'COMPLETED',
    },
  });

  await prisma.inspection.create({
    data: {
      cageId: cageB1.id,
      inspectionType: 'ROUTINE',
      title: 'Seabass Health Assessment - Cage B1',
      description: 'Monthly health check for seabass population',
      scheduledDate: new Date('2026-06-02'),
      conductedById: diver3User.id,
      healthScore: 90,
      waterTemp: 19.8,
      dissolvedOxygen: 6.8,
      salinity: 34.5,
      visibility: 10,
      status: 'SCHEDULED',
    },
  });

  // Dive Operations
  const op1 = await prisma.diveOperation.create({
    data: {
      title: 'Cage A1 Net Inspection',
      description: 'Routine inspection of nets and cage structure',
      diveType: 'INSPECTION',
      status: 'COMPLETED',
      siteId: siteNorth.id,
      plannedDate: new Date('2026-06-01'),
      startTime: new Date('2026-06-01T08:00:00Z'),
      endTime: new Date('2026-06-01T10:30:00Z'),
      maxDepth: 22,
      bottomTime: 90,
      weatherCondition: 'Clear, light winds',
      waterTemp: 12.5,
      visibility: 8,
      notes: 'Successful inspection. All nets in good condition.',
      createdById: admin.id,
    },
  });

  await prisma.diveOperation.create({
    data: {
      title: 'Cage A2 Net Cleaning',
      description: 'Cleaning biofouling from nets',
      diveType: 'MAINTENANCE',
      status: 'PLANNED',
      siteId: siteNorth.id,
      plannedDate: new Date('2026-06-15'),
      maxDepth: 22,
      weatherCondition: 'TBD',
      createdById: admin.id,
    },
  });

  await prisma.diveOperation.create({
    data: {
      title: 'Seabass Sampling - Cage B1',
      description: 'Monthly weight and health sampling',
      diveType: 'INSPECTION',
      status: 'PLANNED',
      siteId: siteSouth.id,
      plannedDate: new Date('2026-06-10'),
      maxDepth: 18,
      weatherCondition: 'TBD',
      createdById: manager.id,
    },
  });

  // Dive Teams and Team Members
  const team1 = await prisma.diveTeam.create({
    data: {
      operationId: op1.id,
      role: 'SUPERVISOR',
      diverId: diver3.id,
    },
  });

  await prisma.diveTeam.create({
    data: {
      operationId: op1.id,
      role: 'DIVER',
      diverId: diver1.id,
    },
  });

  await prisma.diveTeam.create({
    data: {
      operationId: op1.id,
      role: 'TENDER',
      diverId: diver2.id,
    },
  });

  // Dive Team Members
  await prisma.diveTeamMember.create({
    data: {
      teamId: team1.id,
      userId: diver3User.id,
      role: 'SUPERVISOR',
    },
  });

  await prisma.diveTeamMember.create({
    data: {
      teamId: team1.id,
      userId: diver1User.id,
      role: 'DIVER',
    },
  });

  await prisma.diveTeamMember.create({
    data: {
      teamId: team1.id,
      userId: diver2User.id,
      role: 'TENDER',
    },
  });

  // Dive Logs
  await prisma.diveLog.create({
    data: {
      operationId: op1.id,
      diverId: diver3.id,
      teamId: team1.id,
      role: 'SUPERVISOR',
      diveDate: new Date('2026-06-01'),
      startTime: new Date('2026-06-01T08:00:00Z'),
      endTime: new Date('2026-06-01T10:15:00Z'),
      maxDepth: 22,
      avgDepth: 15,
      bottomTime: 90,
      waterTemp: 12.5,
      visibility: 8,
      equipment: 'Full gear + underwater camera',
      tasks: 'Supervised net inspection, documented findings',
      findings: 'Net A1-N1 in good condition. Minor fouling at 5-8m depth.',
      notes: 'Team performed well. All safety protocols followed.',
      createdById: diver3User.id,
    },
  });

  await prisma.diveLog.create({
    data: {
      operationId: op1.id,
      diverId: diver1.id,
      teamId: team1.id,
      role: 'DIVER',
      diveDate: new Date('2026-06-01'),
      startTime: new Date('2026-06-01T08:05:00Z'),
      endTime: new Date('2026-06-01T10:00:00Z'),
      maxDepth: 20,
      avgDepth: 12,
      bottomTime: 85,
      waterTemp: 12.5,
      visibility: 8,
      equipment: 'Standard dive gear',
      tasks: 'Inspected net seams and mooring lines',
      findings: 'All seams intact. Mooring lines show normal wear.',
      createdById: diver1User.id,
    },
  });

  // Incidents
  await prisma.incident.create({
    data: {
      diveLogId: (await prisma.diveLog.findFirst({ where: { diverId: diver3.id } }))!.id,
      operationId: op1.id,
      title: 'Minor equipment malfunction',
      description: 'Diver communication system had intermittent static for 2 minutes',
      severity: 'MINOR',
      actionTaken: 'Backup communication protocol activated. Equipment sent for servicing.',
      reportedById: diver3User.id,
      reportedAt: new Date('2026-06-01T10:30:00Z'),
    },
  });

  // Fish Transfers
  await prisma.fishTransfer.create({
    data: {
      fromCageId: cageA2.id,
      toCageId: cageA1.id,
      speciesId: salmon.id,
      fishCount: 5000,
      avgWeight: 4.2,
      totalWeight: 21000,
      reason: 'GRADING',
      status: 'PLANNED',
      scheduledDate: new Date('2026-06-20'),
      notes: 'Grade-out larger fish to A1 for final grow-out phase',
    },
  });

  // Equipment
  await prisma.equipment.create({
    data: {
      name: 'Underwater Camera - Unit 1',
      type: 'Camera',
      serialNumber: 'CAM-2024-001',
      brand: 'SeaLife',
      model: 'DC2000 Pro',
      purchaseDate: new Date('2024-01-15'),
      lastInspection: new Date('2026-05-01'),
      nextInspection: new Date('2026-08-01'),
      status: 'AVAILABLE',
      notes: 'High-resolution underwater photography',
    },
  });

  await prisma.equipment.create({
    data: {
      name: 'Dive Computer - Unit A',
      type: 'Dive Computer',
      serialNumber: 'DC-2024-001',
      brand: 'Shearwater',
      model: 'Perdix 2',
      purchaseDate: new Date('2024-03-01'),
      lastInspection: new Date('2026-04-15'),
      nextInspection: new Date('2026-07-15'),
      status: 'AVAILABLE',
    },
  });

  await prisma.equipment.create({
    data: {
      name: 'Underwater Scooter - Unit 1',
      type: 'Scooter',
      serialNumber: 'SCT-2024-001',
      brand: 'Dive Xtras',
      model: 'BlackTip Tech',
      purchaseDate: new Date('2024-06-01'),
      status: 'MAINTENANCE',
      notes: 'In for annual battery replacement',
    },
  });

  // Checklists
  await prisma.checklist.create({
    data: {
      operationId: op1.id,
      title: 'Pre-dive safety check',
      description: 'Verify all equipment and team readiness',
      isCompleted: true,
      completedBy: diver3User.id,
      completedAt: new Date('2026-06-01T07:30:00Z'),
      sortOrder: 1,
    },
  });

  await prisma.checklist.create({
    data: {
      operationId: op1.id,
      title: 'Emergency procedures review',
      description: 'Review emergency protocols with team',
      isCompleted: true,
      completedBy: diver3User.id,
      completedAt: new Date('2026-06-01T07:45:00Z'),
      sortOrder: 2,
    },
  });

  await prisma.checklist.create({
    data: {
      operationId: op1.id,
      title: 'Post-dive equipment cleaning',
      description: 'Rinse and store all equipment properly',
      isCompleted: true,
      completedBy: diver2User.id,
      completedAt: new Date('2026-06-01T11:00:00Z'),
      sortOrder: 3,
    },
  });

  console.log('Database seeded successfully!');
  console.log('Login emails: admin@argodive.com, manager@argodive.com, diver1@argodive.com, diver2@argodive.com, diver3@argodive.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
