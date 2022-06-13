import * as browserObject from "./browser";
import scraperController from "./pageController";

//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();

// Pass the browser instance to the scraper controller
scraperController(browserInstance);
