import { Browser } from "puppeteer";

const scraperObject = {
  url: "http://books.toscrape.com",

  async scraper(browser: Browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    // Navigate to the selected page
    await page.goto(this.url);
    // Wait for the required DOM to be rendered
    await page.waitForSelector(".page_inner");
    // Get the link to all the required books
    let urls = await page.$$eval("section ol > li", (links) => {
      // Make sure the book to be scraped is in stock
      let newLinks = [];
      links = links.filter(
        (link) =>
          link.querySelector(".instock.availability > i").textContent !==
          "In stock"
      );
      // Extract the links from the data
      newLinks = links.map(
        (el) => (el.querySelector("h3 > a") as HTMLLinkElement).href
      );
      return newLinks;
    });
    console.log(urls);
  },
};

export default scraperObject;
