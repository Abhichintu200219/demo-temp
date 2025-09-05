import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import { TodoPage } from '../pages/TodoPage.js';

/**
 * Custom World class that extends Cucumber's World
 * This class manages browser instances and provides them to step definitions
 */
export class CustomWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  public baseURL: string;
  public browserOptions: any;
  public todoPage!: TodoPage;

  constructor(options: IWorldOptions) {
    super(options);
    
    // Get configuration from world parameters
    this.baseURL = options.parameters?.baseURL || 'http://localhost:4173';
    this.browserOptions = options.parameters?.browserOptions || { headless: true };
  }

  /**
   * Initialize browser and create new context and page
   */
  async init(browserName: 'chromium' | 'firefox' | 'webkit' = 'chromium') {
    // Launch browser based on browserName
    switch (browserName) {
      case 'firefox':
        this.browser = await firefox.launch(this.browserOptions);
        break;
      case 'webkit':
        this.browser = await webkit.launch(this.browserOptions);
        break;
      default:
        this.browser = await chromium.launch(this.browserOptions);
    }

    // Create new browser context
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      // Add any other context options here
    });

    // Create new page
    this.page = await this.context.newPage();
    
    // Set default timeout
    this.page.setDefaultTimeout(30000);
  }

  /**
   * Navigate to a specific path
   */
  async goto(path: string = '') {
    const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
    await this.page.goto(url);
  }

  /**
   * Close browser and cleanup
   */
  async cleanup() {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string) {
    if (this.page) {
      await this.page.screenshot({ 
        path: `screenshots/${name}-${Date.now()}.png`,
        fullPage: true 
      });
    }
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }
}

// Set the custom world as the default world for Cucumber
setWorldConstructor(CustomWorld);