import { toPng } from "html-to-image";
import jsPDF from "jspdf";

/** Capture the card element as a high-resolution PNG data URL. */
async function captureCard(el: HTMLElement): Promise<string> {
  await document.fonts.ready;
  // skipFonts avoids html-to-image crashing on Next.js @font-face declarations
  // ("can't access property trim, font is undefined"). Browser-loaded fonts
  // are still used when the SVG is rasterised to canvas, so output is correct.
  return toPng(el, { pixelRatio: 2, cacheBust: true, skipFonts: true });
}

/** Download the card as a 1050×600 px PNG (2× pixel ratio of the 525×300 display size). */
export async function downloadCardAsPng(el: HTMLElement, name: string): Promise<void> {
  const dataUrl = await captureCard(el);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${name.replace(/\s+/g, "_")}_business_card.png`;
  a.click();
}

/** Download the card as a standard 3.5" × 2" business-card PDF. */
export async function downloadCardAsPdf(el: HTMLElement, name: string): Promise<void> {
  const dataUrl = await captureCard(el);
  // jsPDF with landscape orientation and exact business-card dimensions in inches.
  const pdf = new jsPDF({ orientation: "landscape", unit: "in", format: [3.5, 2] });
  pdf.addImage(dataUrl, "PNG", 0, 0, 3.5, 2);
  pdf.save(`${name.replace(/\s+/g, "_")}_business_card.pdf`);
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
  @page { margin: 0; size: 3.5in 2in; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #fff; }
  img { width: 3.5in; height: 2in; display: block; }
</style>
</head>
<body>
<img src="${dataUrl}" onload="window.print(); window.close();" />
</body>
</html>`);
  win.document.close();
}
