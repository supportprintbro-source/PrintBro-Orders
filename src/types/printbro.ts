export type PrintTypeId = 'bw_single' | 'bw_double' | 'color_single';

export type OrderStatus =
  | 'received'
  | 'verified'
  | 'printing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface PrintRateOption {
  id: PrintTypeId;
  categoryLabel: string;
  title: string;
  subtitle: string;
  tier1Label: string;
  tier1Rate: number; // BDT for 1-100 pages
  tier2Label: string;
  tier2Rate: number; // BDT for 100+ pages
}

export const PRINT_RATE_OPTIONS: PrintRateOption[] = [
  {
    id: 'bw_single',
    categoryLabel: 'Black & White',
    title: 'Single Sided',
    subtitle: 'Crisp 80gsm laser print on one side per sheet',
    tier1Label: '1–100 pages',
    tier1Rate: 3.0,
    tier2Label: '100+ pages',
    tier2Rate: 2.5,
  },
  {
    id: 'bw_double',
    categoryLabel: 'Black & White',
    title: 'Both Sides',
    subtitle: 'Front & back duplex printing for thick lecture notes & books',
    tier1Label: '1–100 pages',
    tier1Rate: 4.0,
    tier2Label: '100+ pages',
    tier2Rate: 3.0,
  },
  {
    id: 'color_single',
    categoryLabel: 'Full Colour',
    title: 'Single Sided',
    subtitle: 'High-resolution full-color charts, thesis covers & lab reports',
    tier1Label: 'All pages',
    tier1Rate: 4.0,
    tier2Label: 'All pages',
    tier2Rate: 4.0,
  },
];

export const CAMPUS_HUBS = [
  'Main Campus Gate Hub',
  'Central Library Pickup Point',
  'Academic Building 1 Hub',
  'Academic Building 2 Hub',
  'Engineering Faculty Desk',
  'Business Administration Hub',
  'Student Residential Hall Gate',
  'Direct Campus Delivery (Specify in Notes)',
] as const;

export interface PriceCalculation {
  printType: PrintTypeId;
  pageCount: number;
  copies: number;
  unitPrice: number;
  isBulkDiscountApplied: boolean;
  tierAppliedLabel: string;
  singleCopySubtotal: number;
  totalAmount: number;
}

/**
 * Calculates the exact PrintBro price in BDT (৳) according to the official rate card:
 * - Black & White Single Sided: 1–100 pages = 3.00৳ | 100+ pages = 2.50৳
 * - Black & White Both Sides:   1–100 pages = 4.00৳ | 100+ pages = 3.00৳
 * - Full Colour Single Sided:   All pages   = 4.00৳
 */
export function calculatePrintCost(
  printType: PrintTypeId,
  rawPageCount: number,
  rawCopies: number
): PriceCalculation {
  const pageCount = Math.max(1, Math.min(10000, Math.floor(Number(rawPageCount) || 1)));
  const copies = Math.max(1, Math.min(500, Math.floor(Number(rawCopies) || 1)));

  let unitPrice = 3.0;
  let isBulkDiscountApplied = false;
  let tierAppliedLabel = '1–100 pages rate';

  if (printType === 'bw_single') {
    if (pageCount > 100) {
      unitPrice = 2.5;
      isBulkDiscountApplied = true;
      tierAppliedLabel = '100+ pages bulk rate (2.50৳)';
    } else {
      unitPrice = 3.0;
      tierAppliedLabel = '1–100 pages standard rate (3.00৳)';
    }
  } else if (printType === 'bw_double') {
    if (pageCount > 100) {
      unitPrice = 3.0;
      isBulkDiscountApplied = true;
      tierAppliedLabel = '100+ pages bulk rate (3.00৳)';
    } else {
      unitPrice = 4.0;
      tierAppliedLabel = '1–100 pages standard rate (4.00৳)';
    }
  } else if (printType === 'color_single') {
    unitPrice = 4.0;
    tierAppliedLabel = 'Full colour flat rate (4.00৳)';
  }

  const singleCopySubtotal = Number((pageCount * unitPrice).toFixed(2));
  const totalAmount = Number((singleCopySubtotal * copies).toFixed(2));

  return {
    printType,
    pageCount,
    copies,
    unitPrice,
    isBulkDiscountApplied,
    tierAppliedLabel,
    singleCopySubtotal,
    totalAmount,
  };
}

export interface PrintOrderRecord {
  ownerId: string;
  trackingCode: string;
  studentName: string;
  campusHub: string;
  printType: PrintTypeId;
  pageCount: number;
  copies: number;
  unitPrice: number;
  totalAmount: number;
  fileName: string;
  fileSize: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  // Optional hydrated fields when owner/admin views private subcollection or local cache
  studentPhone?: string;
  studentEmail?: string;
  deliveryNote?: string;
  fileDataUrl?: string;
  driveFileId?: string;
  driveFileUrl?: string;
}

export const ORDER_STATUS_STEPS: {
  status: OrderStatus;
  stepNumber: string;
  label: string;
  description: string;
}[] = [
  {
    status: 'received',
    stepNumber: '01',
    label: 'Order Received',
    description: 'Order summary and document logged in the PrintBro queue.',
  },
  {
    status: 'verified',
    stepNumber: '02',
    label: 'File Verified',
    description: 'Page count, margins, and print settings verified by operator.',
  },
  {
    status: 'printing',
    stepNumber: '03',
    label: 'Printing in Progress',
    description: 'Document is currently being printed and quality-checked.',
  },
  {
    status: 'ready',
    stepNumber: '04',
    label: 'Out for Campus Delivery',
    description: 'Printed stack packaged and dispatched to your campus hub.',
  },
  {
    status: 'completed',
    stepNumber: '05',
    label: 'Completed & Delivered',
    description: 'Handed over to student. Thank you for printing with PrintBro!',
  },
];

/**
 * Pure client-side PDF page detector. Scans PDF binary structure for page object markers
 * so students get an automatic page count the moment they drop a PDF file.
 */
export async function detectPdfPageCount(file: File): Promise<number | null> {
  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
    return null;
  }
  try {
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder('latin1');
    const text = decoder.decode(buffer);

    // Strategy 1: Count individual /Type /Page dictionary entries (excluding /Pages)
    const pageMatches = text.match(/\/Type\s*\/Page\b(?!s)/g);
    if (pageMatches && pageMatches.length > 0 && pageMatches.length <= 10000) {
      return pageMatches.length;
    }

    // Strategy 2: Check /Count N in root Pages tree
    const countMatches = [...text.matchAll(/\/Count\s+(\d+)/g)].map((m) => parseInt(m[1], 10));
    if (countMatches.length > 0) {
      const maxCount = Math.max(...countMatches);
      if (maxCount >= 1 && maxCount <= 10000) {
        return maxCount;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function formatPrintTypeLabel(type: PrintTypeId): string {
  switch (type) {
    case 'bw_single':
      return 'Black & White · Single Sided';
    case 'bw_double':
      return 'Black & White · Both Sides';
    case 'color_single':
      return 'Full Colour · Single Sided';
  }
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
