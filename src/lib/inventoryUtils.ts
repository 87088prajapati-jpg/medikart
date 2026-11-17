import type { DemoMedicine, MedicineBatch } from '../types/pharmacy';

export type BatchHealthStatus =
  | 'active'
  | 'expiring_soon'
  | 'expired'
  | 'quarantined';

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export function parseExpiryEndOfMonth(mmYyyy: string): Date {
  const [mmStr, yyyyStr] = mmYyyy.split('/');
  const month = Number.parseInt(mmStr || '1', 10);
  const year = Number.parseInt(yyyyStr || '2026', 10);
  // Last day of the expiry month at 23:59:59
  return new Date(year, month, 0, 23, 59, 59, 999);
}

export function getBatchStatus(
  batch: MedicineBatch,
  now: Date = new Date(),
): BatchHealthStatus {
  if (batch.quarantined) {
    return 'quarantined';
  }
  const expiryDate = parseExpiryEndOfMonth(batch.expiryMonthYear);
  const diff = expiryDate.getTime() - now.getTime();
  if (diff < 0) {
    return 'expired';
  }
  if (diff <= NINETY_DAYS_MS) {
    return 'expiring_soon';
  }
  return 'active';
}

export function getFefoActiveBatch(
  batches: MedicineBatch[],
  now: Date = new Date(),
): MedicineBatch | null {
  const eligible = batches
    .filter((b) => {
      if (b.quarantined || b.quantity <= 0) return false;
      const expiry = parseExpiryEndOfMonth(b.expiryMonthYear);
      return expiry.getTime() >= now.getTime();
    })
    .sort(
      (a, b) =>
        parseExpiryEndOfMonth(a.expiryMonthYear).getTime() -
        parseExpiryEndOfMonth(b.expiryMonthYear).getTime(),
    );

  return eligible[0] ?? null;
}

export function getNearestValidExpiryTimestamp(
  medicine: DemoMedicine,
  now: Date = new Date(),
): number {
  const fefo = getFefoActiveBatch(medicine.batches, now);
  if (!fefo) return Number.MAX_SAFE_INTEGER;
  return parseExpiryEndOfMonth(fefo.expiryMonthYear).getTime();
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export interface AdminInventoryKpis {
  validStockUnits: number;
  lowStockBatchCount: number;
  expiringStockUnits: number;
  expiredOrQuarantinedUnits: number;
}

export function computeInventoryKpis(
  medicines: DemoMedicine[],
  now: Date = new Date(),
): AdminInventoryKpis {
  let validStockUnits = 0;
  let lowStockBatchCount = 0;
  let expiringStockUnits = 0;
  let expiredOrQuarantinedUnits = 0;

  for (const med of medicines) {
    for (const batch of med.batches) {
      const status = getBatchStatus(batch, now);
      if (status === 'expired' || status === 'quarantined') {
        expiredOrQuarantinedUnits += batch.quantity;
      } else {
        validStockUnits += batch.quantity;
        if (batch.quantity <= 25) {
          lowStockBatchCount += 1;
        }
        if (status === 'expiring_soon') {
          expiringStockUnits += batch.quantity;
        }
      }
    }
  }

  return {
    validStockUnits,
    lowStockBatchCount,
    expiringStockUnits,
    expiredOrQuarantinedUnits,
  };
}

export function matchesProductSearch(
  medicine: DemoMedicine,
  rawQuery: string,
): boolean {
  const normalizedQuery = rawQuery.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!normalizedQuery) return true;

  const batchText = medicine.batches.map((b) => b.batchNumber).join(' ');
  const searchableText = [
    medicine.brandName,
    medicine.category,
    medicine.genericComposition,
    medicine.manufacturer,
    medicine.schedule,
    batchText,
  ]
    .join(' ')
    .toLowerCase();

  if (searchableText.includes(normalizedQuery)) {
    return true;
  }

  const tokens = normalizedQuery.split(' ');
  return tokens.every((token) => searchableText.includes(token));
}
