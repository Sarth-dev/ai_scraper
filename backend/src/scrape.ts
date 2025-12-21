import { chromium } from "playwright";
import * as cheerio from "cheerio";

export async function scrapeWebsite(url: string): Promise<string> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url, { timeout: 30000 });
  const html = await page.content();
  await browser.close();

  const $ = cheerio.load(html);
 return $("body").text().replace(/\s+/g, " ").slice(0, 6000);

}
