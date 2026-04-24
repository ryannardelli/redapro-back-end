const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const formattedText = essay.content.trim();

  const html = `
  <html>
    <head>
      <style>
        @page {
          size: A4;
          margin: 40px;
        }

        body {
          font-family: "Times New Roman", serif;
          font-size: 12px;
          color: #000;
        }

        .container {
          width: 100%;
        }

        .header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }

        .logo {
          font-size: 18px;
          font-weight: bold;
        }

        .subtitle {
          font-size: 12px;
        }

        .info {
          margin: 10px 0;
          font-size: 11px;
        }

        .info span {
          display: inline-block;
          margin-right: 20px;
        }

        .theme {
          text-align: center;
          font-weight: bold;
          margin: 10px 0 20px 0;
        }

        .sheet {
          position: relative;
          padding-left: 30px;
        }

        .line {
          position: relative;
          height: 28px;
          border-bottom: 1px solid #999;
        }

        .line-number {
          position: absolute;
          left: -30px;
          font-size: 10px;
          color: #555;
        }

        .text {
          position: absolute;
          left: 0;
          right: 0;
          white-space: pre-wrap;
        }
      </style>
    </head>

    <body>
      <div class="container">
        
        <div class="header">
          <div class="logo">RedaPro</div>
          <div class="subtitle">Plataforma de Correção de Redações</div>
          <div class="subtitle">Modelo inspirado no ENEM</div>
        </div>

        <div class="info">
          <span><strong>Nome:</strong> ____________________________</span>
          <span><strong>Data:</strong> ${new Date().toLocaleDateString()}</span>
        </div>

        <div class="theme">
          Tema: Desafios para a redução da desigualdade social no Brasil
        </div>

        <div class="sheet">
          ${Array.from({ length: 30 }).map((_, i) => `
            <div class="line">
              <div class="line-number">${i + 1}</div>
            </div>
          `).join("")}
        </div>

        <div style="margin-top: -840px; padding-left: 30px; line-height: 28px;">
          ${essayText}
        </div>

      </div>
    </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: "networkidle0" });

  await page.pdf({
    path: "teste-redacao.pdf",
    format: "A4",
    printBackground: true
  });

  await browser.close();
})();