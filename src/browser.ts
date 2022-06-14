import puppeteer from "puppeteer";

async function startBrowser() {
  let browser: puppeteer.Browser;
  try {
    console.log("Opening the browser......");
    browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-setuid-sandbox", "--start-fullscreen"],
      ignoreHTTPSErrors: true,
      timeout: 120 * 1000,
      slowMo: 100, //放慢速度
    });
  } catch (err) {
    console.error("Could not create a browser instance => : ", err);
  }
  return browser!;
}

export { startBrowser };
