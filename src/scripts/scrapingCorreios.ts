import { firefox } from 'playwright';
import { Browser, BrowserContext, Page } from 'playwright-core';

class Scraping {
  private browser: Browser;
  private context: BrowserContext;
  private page: Page;

  public async search(cep: string): Promise<string | Error> {
    this.browser = await firefox.launch();
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();

    await this.page.goto('https://www.correios.com.br/');
    await this.page.fill('//*[@id="relaxation"]', cep);

    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      await this.page.press('//*[@id="relaxation"]', 'Enter'),
    ]);
    await newPage.waitForLoadState();

    const resultNotFound = await newPage.$$('.esconde #resultado-DNEC');
    if (resultNotFound.length) throw new Error('NotFound');

    const results = await newPage.innerText('//*[@id="resultado-DNEC"]');

    await this.browser.close();

    return results;
  }
}

export default new Scraping();
