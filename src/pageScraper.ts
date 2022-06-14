import { Browser } from "puppeteer";
import { IBookInfo } from "./type";

const scraperObject = {
  url: "http://books.toscrape.com",
  async scraper(browser: Browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    // Navigate to the selected page
    await page.goto(this.url);
    let scrapedData: IBookInfo[] = [];
    let CurrentBookPage = 1; // 当前分页

    // Wait for the required DOM to be rendered
    async function scrapeCurrentPage(): Promise<IBookInfo[]> {
      console.log(`正在爬取第 ${CurrentBookPage} 页的数据`);
      await page.waitForSelector(".page_inner");
      // Get the link to all the required books
      let urls = await page.$$eval("section ol > li", (links) => {
        // Make sure the book to be scraped is in stock
        links = links.filter(
          (link) =>
            link.querySelector(".instock.availability > i")?.textContent !==
            "In stock"
        );
        // Extract the links from the data
        let newLinks = links.map(
          (el) => (el.querySelector("h3 > a") as HTMLLinkElement).href
        );
        return newLinks;
      });
      // Loop through each of those links, open a new page instance and get the relevant data from them
      let pagePromise = (link: string) =>
        new Promise(async (resolve, _reject) => {
          let dataObj: IBookInfo = {};
          let newPage = await browser.newPage();
          await newPage.goto(link);
          try {
            dataObj["bookTitle"] = await newPage.$eval(
              ".product_main > h1",
              (text) => text?.textContent
            );
            dataObj["bookPrice"] = await newPage.$eval(
              ".price_color",
              (text) => text?.textContent
            );
            dataObj["noAvailable"] = await newPage.$eval(
              ".instock.availability",
              (text) => {
                // Strip new line and tab spaces
                let newText = text?.textContent.replace(
                  /(\r\n\t|\n|\r|\t)/gm,
                  ""
                );
                // Get the number of stock available
                let regexp = /^.*\((.*)\).*$/i;
                let stockAvailable = regexp.exec(newText)[1].split(" ")[0];
                return stockAvailable;
              }
            );
            dataObj["imageUrl"] = await newPage.$eval(
              "#product_gallery img",
              (img: HTMLImageElement) => img.src
            );
            dataObj["bookDescription"] = await newPage.$eval(
              "#product_description",
              (div) => div?.nextSibling?.nextSibling?.textContent
            );
            dataObj["upc"] = await newPage.$eval(
              ".table.table-striped > tbody > tr > td",
              (table) => table?.textContent
            );
            resolve(dataObj);
          } catch (error) {
            console.error(error);
            // reject(error);
          }
          await newPage.close();
        });

      for (let key in urls) {
        let currentPageData = await pagePromise(urls[key]);
        scrapedData.push(currentPageData);
        console.log(currentPageData);
      }
      // When all the data on this page is done, click the next button and start the scraping of the next page
      // You are going to check if this button exist first, so you know if there really is a next page.
      let nextButtonExist = false;
      try {
        const nextButton = await page.$eval(".next > a", (a) => a?.textContent);
        console.log(nextButton);
        nextButtonExist = true;
      } catch (err) {
        nextButtonExist = false;
      }
      if (nextButtonExist) {
        CurrentBookPage++;
        // 等待页面跳转完成，一般点击某个按钮需要跳转时，都需要等待 page.waitForNavigation() 执行完毕才表示跳转成功
        await Promise.all([
          page.click(".next > a"),
          page.waitForNavigation({ timeout: 60 * 1000 }),
        ]);
        return scrapeCurrentPage(); // Call this function recursively
      }
      await page.close();
      return scrapedData;
    }
    let data = await scrapeCurrentPage();
    await browser.close();
    console.log(`页面爬取完毕，数据总条数为 ${data.length} 条`);
    return data;
  },
};

export default scraperObject;
