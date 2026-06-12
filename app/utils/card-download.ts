import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const BUSINESS_CARD_WIDTH_IN = 3.5;
const BUSINESS_CARD_HEIGHT_IN = 2;
const BUSINESS_CARD_WIDTH_MM = BUSINESS_CARD_WIDTH_IN * 25.4;
const BUSINESS_CARD_HEIGHT_MM = BUSINESS_CARD_HEIGHT_IN * 25.4;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const SHEET_MARGIN_MM = 10;
const SHEET_GUTTER_MM = 4;

type PdfOrientation = "portrait" | "landscape";

interface SheetLayout {
  orientation: PdfOrientation;
  pageWidthMm: number;
  pageHeightMm: number;
  columns: number;
  rows: number;
  offsetXMm: number;
  offsetYMm: number;
}

/** Capture the card element as a high-resolution PNG data URL. */
async function captureCard(el: HTMLElement): Promise<string> {
  await document.fonts.ready;
  // skipFonts avoids html-to-image crashing on Next.js @font-face declarations
  // ("can't access property trim, font is undefined"). Browser-loaded fonts
  // are still used when the SVG is rasterised to canvas, so output is correct.
  return toPng(el, { pixelRatio: 2, cacheBust: true, skipFonts: true });
}

function createCardFilename(name: string, suffix: string): string {
  return `${name.replace(/\s+/g, "_")}_${suffix}`;
}

function buildSheetLayout(
  orientation: PdfOrientation,
  pageWidthMm: number,
  pageHeightMm: number,
): SheetLayout {
  const usableWidthMm = pageWidthMm - (SHEET_MARGIN_MM * 2);
  const usableHeightMm = pageHeightMm - (SHEET_MARGIN_MM * 2);
  const columns = Math.floor((usableWidthMm + SHEET_GUTTER_MM) / (BUSINESS_CARD_WIDTH_MM + SHEET_GUTTER_MM));
  const rows = Math.floor((usableHeightMm + SHEET_GUTTER_MM) / (BUSINESS_CARD_HEIGHT_MM + SHEET_GUTTER_MM));
  const gridWidthMm = (columns * BUSINESS_CARD_WIDTH_MM) + (Math.max(columns - 1, 0) * SHEET_GUTTER_MM);
  const gridHeightMm = (rows * BUSINESS_CARD_HEIGHT_MM) + (Math.max(rows - 1, 0) * SHEET_GUTTER_MM);

  return {
    orientation,
    pageWidthMm,
    pageHeightMm,
    columns,
    rows,
    offsetXMm: (pageWidthMm - gridWidthMm) / 2,
    offsetYMm: (pageHeightMm - gridHeightMm) / 2,
  };
}

function getBestA4SheetLayout(): SheetLayout {
  const portrait = buildSheetLayout("portrait", A4_WIDTH_MM, A4_HEIGHT_MM);
  const landscape = buildSheetLayout("landscape", A4_HEIGHT_MM, A4_WIDTH_MM);
  const portraitCount = portrait.columns * portrait.rows;
  const landscapeCount = landscape.columns * landscape.rows;

  return portraitCount >= landscapeCount ? portrait : landscape;
}

/** Download the card as a standard 3.5" × 2" business-card PDF. */
export async function downloadCardAsPdf(el: HTMLElement, name: string): Promise<void> {
  const dataUrl = await captureCard(el);
  // jsPDF with landscape orientation and exact business-card dimensions in inches.
  const pdf = new jsPDF({ orientation: "landscape", unit: "in", format: [BUSINESS_CARD_WIDTH_IN, BUSINESS_CARD_HEIGHT_IN] });
  pdf.addImage(dataUrl, "PNG", 0, 0, BUSINESS_CARD_WIDTH_IN, BUSINESS_CARD_HEIGHT_IN);
  pdf.save(createCardFilename(name, "business_card.pdf"));
}

/** Download the card repeated across the densest safe A4 sheet layout. */
export async function downloadCardAsA4Pdf(el: HTMLElement, name: string): Promise<void> {
  const dataUrl = await captureCard(el);
  const layout = getBestA4SheetLayout();
  const pdf = new jsPDF({ orientation: layout.orientation, unit: "mm", format: "a4" });

  for (let row = 0; row < layout.rows; row += 1) {
    for (let column = 0; column < layout.columns; column += 1) {
      const x = layout.offsetXMm + (column * (BUSINESS_CARD_WIDTH_MM + SHEET_GUTTER_MM));
      const y = layout.offsetYMm + (row * (BUSINESS_CARD_HEIGHT_MM + SHEET_GUTTER_MM));
      pdf.addImage(dataUrl, "PNG", x, y, BUSINESS_CARD_WIDTH_MM, BUSINESS_CARD_HEIGHT_MM);
    }
  }

  pdf.save(createCardFilename(name, "business_card_a4_sheet.pdf"));
}

/**
 * Open the card image in a new window sized to 3.5"×2" and trigger the browser print dialog.
 * The @page rule removes all margins so the card fills the print area exactly.
 */
export async function printCard(el: HTMLElement): Promise<void> {
  const dataUrl = await captureCard(el);
  const win = window.open("", "_blank", "width=400,height=300");
  if (!win) return;
  win.document.write(`<!DOCTYPE html>
<html>
<head>
<style>
  @page { margin: 0; size: ${BUSINESS_CARD_WIDTH_IN}in ${BUSINESS_CARD_HEIGHT_IN}in; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #fff; }
  img { width: ${BUSINESS_CARD_WIDTH_IN}in; height: ${BUSINESS_CARD_HEIGHT_IN}in; display: block; }
</style>
</head>
<body>
<img src="${dataUrl}" onload="window.print(); window.close();" />
</body>
</html>`);
  win.document.close();
}
