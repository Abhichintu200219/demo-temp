/**
 * Cucumber Configuration for BDD Testing
 * This file configures Cucumber to work with Playwright
 */

export default {
  // Feature files location
  paths: ['e2e/tests/features/**/*.feature'],
  
  // Step definitions location
  requireModule: ['ts-node/esm'],
  import: [
    'e2e/tests/step-definitions/**/*.ts',
    'e2e/tests/support/**/*.ts'
  ],

  // World parameters - passed to World constructor
  worldParameters: {
    // Base URL for the application
    baseURL: process.env.BASE_URL || 'http://localhost:4173',
    
    // Browser options
    browserOptions: {
      headless: process.env.HEADLESS !== 'false',
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
    }
  },
  
  // Default format for output
  format: [
    'progress-bar',
    'json:reports/cucumber_report.json',
    'html:reports/cucumber_report.html',
    '@cucumber/pretty-formatter'
  ],
  
  // Publish results to cucumber reports
  publish: false,
  
  // Parallel execution
  parallel: process.env.CI ? 1 : 2,
  
  // Tags to run/skip
  tags: process.env.TAGS || 'not @skip',
  
  // Retry failed scenarios
  retry: process.env.CI ? 1 : 0,
  
  // Exit after first failure (fail fast)
  failFast: false,
  
  // Strict mode - fail if there are pending steps
  strict: true,
  
  // Dry run - check if all steps have definitions
  dryRun: false
};