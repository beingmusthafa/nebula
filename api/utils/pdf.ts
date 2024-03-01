import puppeteer from "puppeteer";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateReportPdf = async (
  report:
    | {
        type: "weekly" | "monthly" | "yearly";
        startDate: Date;
        endDate: Date;
      }
    | any,
  type: "admin" | "tutor"
): Promise<Buffer> => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    const filePath = path.resolve(
      __dirname,
      type === "admin"
        ? "../../templates/adminReport.template.ejs"
        : "../../templates/tutorReport.template.ejs"
    );
    const template = fs.readFileSync(filePath).toString();
    const displayDate = `${report.startDate.toLocaleDateString()} - ${report.endDate.toLocaleDateString()}`;
    const html = ejs.render(template, { report, date: displayDate });
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    const pdfBuffer = await page.pdf({
      format: "A3",
    });

    await browser.close();
    console.log("generated report pdf");
    return pdfBuffer;
  } catch (error) {
    console.log(error);
  }
};
