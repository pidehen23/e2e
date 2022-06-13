import { Browser } from "puppeteer";
import pageScraper from "./pageScraper";

async function scrapeAll(browserInstance: Promise<Browser>) {
  let browser;
  try {
    browser = await browserInstance;
    await pageScraper.scraper(browser);
  } catch (err) {
    console.error("Could not resolve the browser instance => ", err);
  }
}

export default (browserInstance: Promise<Browser>) =>
  scrapeAll(browserInstance);
