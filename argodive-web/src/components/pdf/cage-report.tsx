import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

// ---------- Types ----------

type CageInfo = {
  cageNumber: string;
  name: string;
  site: string;
  species: string;
  shape: string;
  diameter: number;
  volume: number;
  maxCapacity: number;
  currentFishCount: number;
  currentBiomass: number;
  avgWeight: number;
  stockingDensity: number;
  healthScore: number;
  status: string;
  installationDate: string;
  lastCleaningDate: string;
  lastStockingDate: string;
  lastHarvestDate: string;
  notes: string;
};

type NetInfo = {
  netNumber: string;
  meshSize: number;
  material: string;
  depth: number;
  circumference: number;
  condition: string;
  conditionColor: string;
  installationDate: string;
  lastCleaning: string;
  lastRepair: string | null;
  ageDays: number;
};

type InspectionInfo = {
  title: string;
  type: string;
  date: string;
  inspector: string;
  healthScore: number;
  findings: string;
  status: string;
};

type PhotoInfo = {
  caption: string;
  date: string;
  photographer: string;
};

// ---------- Styles ----------

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#1a1a2e',
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#0a7e8c',
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0a7e8c',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0a7e8c',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  label: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: '#1a1a2e',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  col3: {
    width: '33%',
  },
  col4: {
    width: '25%',
  },
  col6: {
    width: '50%',
  },
  col12: {
    width: '100%',
  },
  table: {
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0a7e8c',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    fontSize: 9,
    color: '#1a1a2e',
  },
  cellCondition: {
    fontSize: 8,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  conditionGreen: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  conditionYellow: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  conditionRed: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  inspectionCard: {
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
  },
  inspectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  inspectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  scoreBadge: {
    fontSize: 9,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  scoreHigh: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  scoreMedium: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  scoreLow: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  inspectionMeta: {
    fontSize: 8,
    color: '#9ca3af',
    marginBottom: 3,
  },
  inspectionFindings: {
    fontSize: 9,
    color: '#4b5563',
  },
  photoItem: {
    marginBottom: 4,
    paddingVertical: 3,
    paddingHorizontal: 6,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  photoCaption: {
    fontSize: 9,
    color: '#1a1a2e',
  },
  photoMeta: {
    fontSize: 8,
    color: '#9ca3af',
  },
  remarksBox: {
    padding: 10,
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#14b8a6',
    borderRadius: 4,
    marginTop: 4,
  },
  remarksText: {
    fontSize: 10,
    color: '#1a1a2e',
    lineHeight: 1.6,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  spacer: {
    height: 12,
  },
  col1: { width: '8%' },
  col2: { width: '16%' },
  col5: { width: '42%' },
});

// ---------- Condition helpers ----------

const conditionBadge = (color: string, label: string) => {
  const badgeStyle = color === 'green' ? styles.conditionGreen : color === 'yellow' ? styles.conditionYellow : styles.conditionRed;
  return <Text style={[styles.cellCondition, badgeStyle]}>{label}</Text>;
};

const scoreStyle = (score: number) => {
  if (score >= 85) return styles.scoreHigh;
  if (score >= 70) return styles.scoreMedium;
  return styles.scoreLow;
};

// ---------- PDF Document ----------

export function CageReportPDF({
  cage,
  nets,
  inspections,
  photos,
}: {
  cage: CageInfo;
  nets: NetInfo[];
  inspections: InspectionInfo[];
  photos: PhotoInfo[];
}) {
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Cage Report — {cage.cageNumber}</Text>
          <Text style={styles.subtitle}>
            {cage.site} &middot; {cage.name} &middot; {cage.species}
            {'   '}|{'   '}Generated: {generatedDate}
          </Text>
        </View>

        {/* 1. Cage Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Cage Information</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: '#f9fafb' }]}>
              <Text style={[styles.tableCell, { width: '25%', fontWeight: 'bold' }]}>Property</Text>
              <Text style={[styles.tableCell, { width: '25%', fontWeight: 'bold' }]}>Value</Text>
              <Text style={[styles.tableCell, { width: '25%', fontWeight: 'bold' }]}>Property</Text>
              <Text style={[styles.tableCell, { width: '25%', fontWeight: 'bold' }]}>Value</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Status</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{cage.status}</Text>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Shape</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{cage.shape}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Diameter</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{cage.diameter} m</Text>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Volume</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{cage.volume.toLocaleString()} m³</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Max Capacity</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{cage.maxCapacity.toLocaleString()}</Text>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Current Fish</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{cage.currentFishCount.toLocaleString()}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Biomass</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{(cage.currentBiomass / 1000).toFixed(1)} t</Text>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Avg Weight</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{cage.avgWeight} kg</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Stocking Density</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{cage.stockingDensity} kg/m³</Text>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Health Score</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{cage.healthScore}/100</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Installed</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{cage.installationDate}</Text>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Last Cleaned</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{cage.lastCleaningDate}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Last Stocked</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{cage.lastStockingDate}</Text>
              <Text style={[styles.tableCell, styles.label, { width: '25%' }]}>Last Harvest</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{cage.lastHarvestDate || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* 2. Net Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Net Information</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '12%' }]}>Net</Text>
              <Text style={[styles.tableHeaderCell, { width: '14%' }]}>Mesh</Text>
              <Text style={[styles.tableHeaderCell, { width: '16%' }]}>Material</Text>
              <Text style={[styles.tableHeaderCell, { width: '12%' }]}>Depth</Text>
              <Text style={[styles.tableHeaderCell, { width: '14%' }]}>Age</Text>
              <Text style={[styles.tableHeaderCell, { width: '16%' }]}>Last Clean</Text>
              <Text style={[styles.tableHeaderCell, { width: '16%' }]}>Condition</Text>
            </View>
            {nets.map((net, i) => (
              <View key={net.netNumber} style={[styles.tableRow, ...(i % 2 === 1 ? [styles.tableRowAlt] : [])]}>
                <Text style={[styles.tableCell, { width: '12%', fontWeight: 'bold' }]}>{net.netNumber}</Text>
                <Text style={[styles.tableCell, { width: '14%' }]}>{net.meshSize}mm</Text>
                <Text style={[styles.tableCell, { width: '16%' }]}>{net.material}</Text>
                <Text style={[styles.tableCell, { width: '12%' }]}>{net.depth}m</Text>
                <Text style={[styles.tableCell, { width: '14%' }]}>{net.ageDays}d</Text>
                <Text style={[styles.tableCell, { width: '16%' }]}>{net.lastCleaning}</Text>
                <View style={{ width: '16%' }}>{conditionBadge(net.conditionColor, net.condition)}</View>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' }} />
              <Text style={{ fontSize: 8, color: '#6b7280' }}>OK</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b' }} />
              <Text style={{ fontSize: 8, color: '#6b7280' }}>Repair Needed</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' }} />
              <Text style={{ fontSize: 8, color: '#6b7280' }}>Replace</Text>
            </View>
          </View>
        </View>

        {/* 3. Inspection History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Inspection History</Text>
          {inspections.map((ins) => (
            <View key={ins.title} style={styles.inspectionCard}>
              <View style={styles.inspectionHeader}>
                <Text style={styles.inspectionTitle}>{ins.title}</Text>
                <Text style={[styles.scoreBadge, scoreStyle(ins.healthScore)]}>
                  {ins.healthScore}
                </Text>
              </View>
              <Text style={styles.inspectionMeta}>
                {ins.type} &middot; {ins.date} &middot; {ins.inspector} &middot; {ins.status}
              </Text>
              <Text style={styles.inspectionFindings}>{ins.findings}</Text>
            </View>
          ))}
        </View>

        {/* 4. Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Photo Gallery</Text>
          {photos.map((photo, i) => (
            <View key={i} style={styles.photoItem}>
              <Text style={styles.photoCaption}>{photo.caption}</Text>
              <Text style={styles.photoMeta}>{photo.date} &middot; {photo.photographer}</Text>
            </View>
          ))}
          <Text style={{ fontSize: 8, color: '#9ca3af', marginTop: 4, fontStyle: 'italic' }}>
            * Photos are referenced by caption. Full-resolution images available in the ArgoDive system.
          </Text>
        </View>

        {/* 5. Remarks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Remarks</Text>
          <View style={styles.remarksBox}>
            <Text style={styles.remarksText}>{cage.notes}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          ArgoDive — Aquaculture Diving Management System | Cage Report for {cage.cageNumber} | Page 1
        </Text>
      </Page>
    </Document>
  );
}
