import { Browser } from "puppeteer";
import pageScraper from "./pageScraper";
import fs from "fs";
import path from "path";
import { IBookMap } from "./type";

async function scrapeAll(browserInstance: Promise<Browser>) {
  let browser: Browser;
  try {
    browser = await browserInstance;
    let scrapedData: IBookMap = {};
    scrapedData["Travel"] = await pageScraper.scraper(browser, "Travel");
    scrapedData["HistoricalFiction"] = await pageScraper.scraper(
      browser,
      "Historical Fiction"
    );
    scrapedData["Mystery"] = await pageScraper.scraper(browser, "Mystery");
    await browser?.close();
    // console.log(scrapedData);
    // 文件夹不存在，则新建
    const dir = path.join(process.cwd(), `/public`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFile(
      `${dir}/data.json`,
      JSON.stringify(scrapedData),
      "utf-8",
      function(err) {
        if (err) {
          return console.error(err);
        }
        console.log(
          `The data has been scraped and saved successfully! View it at '${`${dir}/data.json`}'`
        );
      }
    );
  } catch (err) {
    console.error("Could not resolve the browser instance => ", err);
  }
}

export default (browserInstance: Promise<Browser>) =>
  scrapeAll(browserInstance);
