import puppeteer from "puppeteer";
/**
 * Convert HTML -> PDF Buffer using Puppeteer.
 * Keeps browser launch/close per call for simplicity; you can reuse a browser instance for throughput.
 */
export async function htmlToPdfBuffer(
  html: string,
  opts?: puppeteer.PDFOptions
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfData = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "16mm", bottom: "16mm", left: "12mm", right: "12mm" },
      ...opts,
    });

    return Buffer.from(pdfData);
  } finally {
    await browser.close();
  }
}
