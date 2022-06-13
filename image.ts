import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 11273 });
  await page.goto("https://juejin.cn/post/6896890664726822920");
  await page.screenshot({ path: "image.png" });

  await browser.close();
})();
