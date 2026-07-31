import { toPng } from "html-to-image";

/** Capture the card element as a high-resolution PNG data URL. */
async function captureCard(el: HTMLElement): Promise<string> {
  await document.fonts.ready;
  return toPng(el, { pixelRatio: 2, cacheBust: true, skipFonts: true });
}

function createCardFilename(name: string, suffix: string): string {
  return `${name.replace(/\s+/g, "_")}_${suffix}`;
}

/** Download the card as a high-resolution PNG image. */
export async function downloadCardAsImage(el: HTMLElement, name: string): Promise<void> {
  const dataUrl = await captureCard(el);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = createCardFilename(name, "business_card.png");
  a.click();
}

/**
 * Open the card image in a new window sized to 3.5"×2" and trigger the browser print dialog.
 * The @page rule removes all margins so the card fills the print area exactly.
 */
export async function printCard(el: HTMLElement): Promise<void> {
  const BUSINESS_CARD_WIDTH_IN = 3.5;
  const BUSINESS_CARD_HEIGHT_IN = 2;
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
