import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world.js';
import { ensureDir } from 'fs-extra';


/**
 * Global hooks for Cucumber scenarios
 * These run before/after each scenario or the entire test suite
 */

// Create necessary directories before all tests
BeforeAll(async function () {
  // Create screenshots directory
  await ensureDir('screenshots');
  
  // Create reports directory
  await ensureDir('reports');
  
  // Create test-results directory
  await ensureDir('test-results');
  
  console.log('🚀 Starting BDD test suite...');
});

// Clean up after all tests
AfterAll(async function () {
  console.log('✅ BDD test suite completed');
});

// Before each scenario
Before(async function (this: CustomWorld, scenario) {
  console.log(`🧪 Starting scenario: ${scenario.pickle.name}`);
  
  // Get browser from tags or use default
  const browserTag = scenario.pickle.tags.find(tag => 
    ['@chromium', '@firefox', '@webkit'].includes(tag.name)
  );
  
  let browserName: 'chromium' | 'firefox' | 'webkit' = 'chromium';
  if (browserTag) {
    browserName = browserTag.name.replace('@', '') as any;
  }
  
  // Initialize browser
  await this.init(browserName);
  
  console.log(`🌐 Browser ${browserName} initialized`);
});

// After each scenario
After(async function (this: CustomWorld, scenario) {
  const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
  
  // Take screenshot if scenario failed
  if (scenario.result?.status === Status.FAILED) {
    console.log(`❌ Scenario failed: ${scenario.pickle.name}`);
    await this.takeScreenshot(`failed_${scenarioName}`);
    
    // Attach screenshot to report
    if (this.page) {
      const screenshot = await this.page.screenshot();
      this.attach(screenshot, 'image/png');
    }
  } else {
    console.log(`✅ Scenario passed: ${scenario.pickle.name}`);
  }
  
  // Always cleanup browser
  await this.cleanup();
});

// Before scenarios tagged with @slow
Before('@slow', async function () {
  // Set longer timeout for slow scenarios
  this.browserOptions = { 
    ...this.browserOptions, 
    slowMo: 1000 
  };
});

// Before scenarios tagged with @headless
Before('@headless', async function () {
  this.browserOptions = { 
    ...this.browserOptions, 
    headless: true 
  };
});

// Before scenarios tagged with @headed
Before('@headed', async function () {
  this.browserOptions = { 
    ...this.browserOptions, 
    headless: false 
  };
});

// Skip scenarios tagged with @skip
Before('@skip', async function (scenario) {
  console.log(`⏭️  Skipping scenario: ${scenario.pickle.name}`);
  return 'skipped';
});