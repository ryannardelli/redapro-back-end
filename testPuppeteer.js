const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent("<h1>Teste PDF</h1>");

  await page.pdf({ path: "teste.pdf" });

  await browser.close();
})();