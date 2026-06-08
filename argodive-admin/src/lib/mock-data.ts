// ── In-memory stores ──────────────────────

export const stores = {
  species: new Map<string, any>([
    ['1', { id: '1', code: 'SAL', name: 'Atlantic Salmon', scientificName: 'Salmo salar', category: 'FINFISH', growthRate: 1.2, daysToHarvest: 540, avgMarketWeight: 4.5, isActive: true, createdAt: new Date(), updatedAt: new Date() }],
    ['2', { id: '2', code: 'RBT', name: 'Rainbow Trout', scientificName: 'Oncorhynchus mykiss', category: 'FINFISH', growthRate: 1.0, daysToHarvest: 365, avgMarketWeight: 2.0, isActive: true, createdAt: new Date(), updatedAt: new Date() }],
    ['3', { id: '3', code: 'SBS', name: 'Sea Bass', scientificName: 'Dicentrarchus labrax', category: 'FINFISH', growthRate: 0.8, daysToHarvest: 730, avgMarketWeight: 1.5, isActive: true, createdAt: new Date(), updatedAt: new Date() }],
    ['4', { id: '4', code: 'TLP', name: 'Tilapia', scientificName: 'Oreochromis niloticus', category: 'FINFISH', growthRate: 1.5, daysToHarvest: 240, avgMarketWeight: 0.8, isActive: true, createdAt: new Date(), updatedAt: new Date() }],
    ['5', { id: '5', code: 'YTL', name: 'Yellowtail', scientificName: 'Seriola quinqueradiata', category: 'FINFISH', growthRate: 0.9, daysToHarvest: 600, avgMarketWeight: 3.2, isActive: false, createdAt: new Date(), updatedAt: new Date() }],
  ]),

  cages: new Map<string, any>([
    ['1', { id: '1', cageNumber: 'C-001', name: 'North Alpha', siteId: 'S-001', speciesId: '1', shape: 'CIRCULAR', depth: 15, diameter: 25, volume: 1200, maxCapacity: 60000, currentFishCount: 45000, currentBiomass: 180000, status: 'ACTIVE', installationDate: new Date('2024-03-15'), notes: null, createdAt: new Date(), updatedAt: new Date(), site: { name: 'North Farm' }, species: { name: 'Atlantic Salmon' } }],
    ['2', { id: '2', cageNumber: 'C-002', name: 'North Beta', siteId: 'S-001', speciesId: '1', shape: 'CIRCULAR', depth: 15, diameter: 25, volume: 1200, maxCapacity: 60000, currentFishCount: 42000, currentBiomass: 168000, status: 'ACTIVE', installationDate: new Date('2024-06-01'), notes: null, createdAt: new Date(), updatedAt: new Date(), site: { name: 'North Farm' }, species: { name: 'Atlantic Salmon' } }],
    ['3', { id: '3', cageNumber: 'C-003', name: 'South Alpha', siteId: 'S-002', speciesId: '2', shape: 'CIRCULAR', depth: 12, diameter: 20, volume: 800, maxCapacity: 40000, currentFishCount: 35000, currentBiomass: 70000, status: 'ACTIVE', installationDate: new Date('2024-01-20'), notes: null, createdAt: new Date(), updatedAt: new Date(), site: { name: 'South Bay' }, species: { name: 'Rainbow Trout' } }],
    ['4', { id: '4', cageNumber: 'C-004', name: 'South Beta', siteId: 'S-002', speciesId: null, shape: 'SQUARE', depth: 10, diameter: 18, volume: 600, maxCapacity: 20000, currentFishCount: 0, currentBiomass: 0, status: 'EMPTY', installationDate: new Date('2024-09-01'), notes: null, createdAt: new Date(), updatedAt: new Date(), site: { name: 'South Bay' }, species: null }],
    ['5', { id: '5', cageNumber: 'C-005', name: 'East Alpha', siteId: 'S-003', speciesId: '4', shape: 'CIRCULAR', depth: 14, diameter: 22, volume: 950, maxCapacity: 35000, currentFishCount: 28000, currentBiomass: 22400, status: 'ACTIVE', installationDate: new Date('2024-04-10'), notes: null, createdAt: new Date(), updatedAt: new Date(), site: { name: 'East Cove' }, species: { name: 'Tilapia' } }],
    ['6', { id: '6', cageNumber: 'C-006', name: 'North Gamma', siteId: 'S-001', speciesId: '1', shape: 'OCTAGONAL', depth: 18, diameter: 30, volume: 1800, maxCapacity: 80000, currentFishCount: 65000, currentBiomass: 260000, status: 'HARVESTING', installationDate: new Date('2023-11-01'), notes: null, createdAt: new Date(), updatedAt: new Date(), site: { name: 'North Farm' }, species: { name: 'Atlantic Salmon' } }],
    ['7', { id: '7', cageNumber: 'C-007', name: 'East Beta', siteId: 'S-003', speciesId: '5', shape: 'CIRCULAR', depth: 14, diameter: 24, volume: 1100, maxCapacity: 25000, currentFishCount: 15000, currentBiomass: 48000, status: 'MAINTENANCE', installationDate: new Date('2024-02-15'), notes: 'Undergoing structural repairs', createdAt: new Date(), updatedAt: new Date(), site: { name: 'East Cove' }, species: { name: 'Yellowtail' } }],
    ['8', { id: '8', cageNumber: 'C-008', name: 'South Gamma', siteId: 'S-002', speciesId: null, shape: 'SQUARE', depth: 10, diameter: 20, volume: 800, maxCapacity: 30000, currentFishCount: 0, currentBiomass: 0, status: 'FALLOW', installationDate: new Date('2024-07-01'), notes: null, createdAt: new Date(), updatedAt: new Date(), site: { name: 'South Bay' }, species: null }],
  ]),

  nets: new Map<string, any>([
    ['1', { id: '1', netNumber: 'N-001', cageId: '1', meshSize: 22, material: 'NYLON', depth: 15, circumference: 78.5, condition: 'GOOD', installationDate: new Date('2025-08-15'), notes: null, createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-001' } }],
    ['2', { id: '2', netNumber: 'N-002', cageId: '1', meshSize: 18, material: 'POLYETHYLENE', depth: 15, circumference: 78.5, condition: 'EXCELLENT', installationDate: new Date('2026-03-01'), notes: null, createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-001' } }],
    ['3', { id: '3', netNumber: 'N-003', cageId: '2', meshSize: 22, material: 'NYLON', depth: 15, circumference: 78.5, condition: 'FAIR', installationDate: new Date('2025-06-20'), notes: null, createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-002' } }],
    ['4', { id: '4', netNumber: 'N-004', cageId: '3', meshSize: 16, material: 'POLYESTER', depth: 12, circumference: 62.8, condition: 'GOOD', installationDate: new Date('2025-11-10'), notes: null, createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-003' } }],
    ['5', { id: '5', netNumber: 'N-005', cageId: '5', meshSize: 20, material: 'NYLON', depth: 14, circumference: 69.1, condition: 'DAMAGED', installationDate: new Date('2025-04-05'), notes: 'Tear detected in section B3', createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-005' } }],
    ['6', { id: '6', netNumber: 'N-006', cageId: '6', meshSize: 25, material: 'GALVANIZED_STEEL', depth: 18, circumference: 94.2, condition: 'GOOD', installationDate: new Date('2025-09-20'), notes: null, createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-006' } }],
    ['7', { id: '7', netNumber: 'N-007', cageId: '7', meshSize: 22, material: 'COPPER_ALLOY', depth: 14, circumference: 75.4, condition: 'EXCELLENT', installationDate: new Date('2026-01-15'), notes: null, createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-007' } }],
    ['8', { id: '8', netNumber: 'N-008', cageId: '3', meshSize: 16, material: 'POLYETHYLENE', depth: 12, circumference: 62.8, condition: 'POOR', installationDate: new Date('2025-05-01'), notes: null, createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-003' } }],
  ]),

  inspections: new Map<string, any>([
    ['1', { id: '1', title: 'Monthly Routine Check', cageId: '1', inspectionType: 'ROUTINE', description: null, scheduledDate: new Date('2026-06-01'), completedDate: new Date('2026-06-01'), healthScore: 92, findings: 'Cage integrity good. Biofouling minimal.', recommendations: null, status: 'COMPLETED', createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-001' }, conductedBy: { name: 'Sarah M.' } }],
    ['2', { id: '2', title: 'Post-Storm Assessment', cageId: '2', inspectionType: 'POST_STORM', description: null, scheduledDate: new Date('2026-05-15'), completedDate: new Date('2026-05-15'), healthScore: 88, findings: 'Minor net deformation observed.', recommendations: 'Monitor net N-003 closely', status: 'COMPLETED', createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-002' }, conductedBy: { name: 'John D.' } }],
    ['3', { id: '3', title: 'Bi-monthly Health Check', cageId: '1', inspectionType: 'HEALTH', description: null, scheduledDate: new Date('2026-05-01'), completedDate: new Date('2026-05-01'), healthScore: 90, findings: 'All parameters within range.', recommendations: null, status: 'COMPLETED', createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-001' }, conductedBy: { name: 'Sarah M.' } }],
    ['4', { id: '4', title: 'Structural Integrity Check', cageId: '6', inspectionType: 'STRUCTURAL', description: null, scheduledDate: new Date('2026-04-10'), completedDate: new Date('2026-04-10'), healthScore: 85, findings: 'Net N-006 shows wear at connection points.', recommendations: 'Schedule net reinforcement', status: 'COMPLETED', createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-006' }, conductedBy: { name: 'Mike T.' } }],
    ['5', { id: '5', title: 'Environmental Monitoring', cageId: '5', inspectionType: 'ENVIRONMENTAL', description: null, scheduledDate: new Date('2026-03-20'), completedDate: new Date('2026-03-20'), healthScore: 91, findings: 'Water quality excellent.', recommendations: null, status: 'COMPLETED', createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-005' }, conductedBy: { name: 'John D.' } }],
    ['6', { id: '6', title: 'Emergency Net Inspection', cageId: '5', inspectionType: 'EMERGENCY', description: 'Net N-005 tear reported', scheduledDate: new Date('2026-06-05'), completedDate: null, healthScore: null, findings: null, recommendations: null, status: 'SCHEDULED', createdAt: new Date(), updatedAt: new Date(), cage: { cageNumber: 'C-005' }, conductedBy: null }],
  ]),

  transfers: new Map<string, any>([
    ['1', { id: '1', fromCageId: '1', toCageId: '2', speciesId: '1', fishCount: 5000, avgWeight: 4.0, reason: 'SPLITTING', status: 'COMPLETED', scheduledDate: new Date('2026-06-01'), completedDate: new Date('2026-06-01'), notes: null, createdAt: new Date(), updatedAt: new Date(), fromCage: { cageNumber: 'C-001' }, toCage: { cageNumber: 'C-002' }, species: { name: 'Atlantic Salmon' }, performedBy: { name: 'John D.' } }],
    ['2', { id: '2', fromCageId: '1', toCageId: '7', speciesId: '1', fishCount: 4000, avgWeight: 3.8, reason: 'MEDICAL_TREATMENT', status: 'PLANNED', scheduledDate: new Date('2026-06-10'), completedDate: null, notes: 'Fish showing signs of stress', createdAt: new Date(), updatedAt: new Date(), fromCage: { cageNumber: 'C-001' }, toCage: { cageNumber: 'C-007' }, species: { name: 'Atlantic Salmon' }, performedBy: null }],
    ['3', { id: '3', fromCageId: '3', toCageId: '1', speciesId: '2', fishCount: 8000, avgWeight: 2.0, reason: 'STOCKING', status: 'COMPLETED', scheduledDate: new Date('2025-09-01'), completedDate: new Date('2025-09-01'), notes: null, createdAt: new Date(), updatedAt: new Date(), fromCage: { cageNumber: 'C-003' }, toCage: { cageNumber: 'C-001' }, species: { name: 'Rainbow Trout' }, performedBy: { name: 'Mike T.' } }],
    ['4', { id: '4', fromCageId: '1', toCageId: '5', speciesId: '1', fishCount: 2000, avgWeight: 4.2, reason: 'GRADING', status: 'COMPLETED', scheduledDate: new Date('2025-07-15'), completedDate: new Date('2025-07-15'), notes: null, createdAt: new Date(), updatedAt: new Date(), fromCage: { cageNumber: 'C-001' }, toCage: { cageNumber: 'C-005' }, species: { name: 'Atlantic Salmon' }, performedBy: { name: 'John D.' } }],
    ['5', { id: '5', fromCageId: '2', toCageId: '4', speciesId: '1', fishCount: 6000, avgWeight: 3.5, reason: 'SPLITTING', status: 'IN_PROGRESS', scheduledDate: new Date('2026-06-08'), completedDate: null, notes: null, createdAt: new Date(), updatedAt: new Date(), fromCage: { cageNumber: 'C-002' }, toCage: { cageNumber: 'C-004' }, species: { name: 'Atlantic Salmon' }, performedBy: null }],
  ]),
};

// ── ID generators ─────────────────────────

const counters: Record<string, number> = {
  species: 10,
  cages: 10,
  nets: 10,
  inspections: 10,
  transfers: 10,
};

function nextId(store: keyof typeof stores): string {
  return String(++counters[store]);
}

// ── CRUD helpers ──────────────────────────

export function mockList<T>(store: keyof typeof stores): T[] {
  return Array.from(stores[store].values());
}

export function mockCreate<T>(store: keyof typeof stores, data: any): T {
  const id = nextId(store);
  const record = {
    id,
    ...data,
    site: data.siteId ? { name: 'Demo Site' } : undefined,
    species: data.speciesId ? { name: 'Demo Species' } : undefined,
    cage: data.cageId ? { cageNumber: `C-${data.cageId}` } : undefined,
    conductedBy: null,
    performedBy: null,
    fromCage: data.fromCageId ? { cageNumber: `C-${data.fromCageId}` } : undefined,
    toCage: data.toCageId ? { cageNumber: `C-${data.toCageId}` } : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  stores[store].set(id, record);
  return record as T;
}

export function mockUpdate<T>(store: keyof typeof stores, id: string, data: any): T | null {
  const existing = stores[store].get(id);
  if (!existing) return null;
  const updated = { ...existing, ...data, updatedAt: new Date() };
  stores[store].set(id, updated);
  return updated as T;
}

export function mockDelete(store: keyof typeof stores, id: string): boolean {
  return stores[store].delete(id);
}

// ── Utility ───────────────────────────────

export function toPlainObject(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}
