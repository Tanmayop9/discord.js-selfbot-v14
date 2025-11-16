const { Client } = require('../src/index');

/**
 * AI Captcha Solver Custom Integration Example
 * 
 * Shows how to integrate custom AI models and services
 * with the Advanced AI Captcha Solver framework
 */

const client = new Client({
  // Option 1: Use the built-in advanced solver
  captchaRetryLimit: 5,
});

// Option 2: Custom AI solver integration
function createCustomAISolver() {
  const { AdvancedAICaptchaSolver } = require('../src/util/AdvancedAICaptchaSolver');

  const solver = new AdvancedAICaptchaSolver({
    enableCaching: true,
    maxRetries: 3,
    strategy: 'auto',
    timeout: 30000,
    debug: true,
  });

  // Extend the solver with custom methods
  solver.customSolve = async function (captchaData, userAgent) {
    console.log('🤖 Custom AI Solver activated');
    console.log(`   Service: ${captchaData.captcha_service}`);
    console.log(`   Sitekey: ${captchaData.captcha_sitekey}`);

    // Here you can integrate:
    // 1. TensorFlow.js for image recognition
    // 2. Puppeteer for browser automation
    // 3. External AI services
    // 4. Custom trained models

    // Example: Use Puppeteer (install puppeteer first)
    /*
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Navigate to captcha challenge
    await page.goto(`https://example.com/captcha?sitekey=${captchaData.captcha_sitekey}`);
    
    // Use your custom solving logic here
    // const solution = await solveCaptchaWithPuppeteer(page);
    
    await browser.close();
    return solution;
    */

    // Example: Call external AI service (placeholder)
    /*
    const response = await fetch('https://your-ai-service.com/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sitekey: captchaData.captcha_sitekey,
        service: captchaData.captcha_service,
        userAgent: userAgent
      })
    });
    
    const data = await response.json();
    return data.solution;
    */

    // For this example, we return null (placeholder)
    console.log('   ℹ️  Integrate your custom AI model here');
    return null;
  };

  return solver;
}

// Option 3: Use with external services like 2captcha (if needed)
function create2CaptchaSolver(apiKey) {
  return async (captchaData, userAgent) => {
    console.log('🔑 Using 2captcha service');

    try {
      // Example integration with 2captcha
      // const Captcha = require('2captcha');
      // const solver = new Captcha.Solver(apiKey);
      
      // const solution = await solver.hcaptcha(
      //   captchaData.captcha_sitekey,
      //   'discord.com',
      //   {
      //     invisible: 1,
      //     userAgent: userAgent,
      //     data: captchaData.captcha_rqdata
      //   }
      // );
      
      // return solution.data;

      console.log('   Install "2captcha" package for actual integration');
      return null;
    } catch (error) {
      console.error('   Error:', error.message);
      return null;
    }
  };
}

// Example: Hybrid solver (try AI first, fallback to service)
function createHybridSolver(apiKey) {
  const aiSolver = createCustomAISolver();
  const fallbackSolver = create2CaptchaSolver(apiKey);

  return async (captchaData, userAgent) => {
    console.log('🔄 Hybrid Solver: Trying AI first');

    // Try AI solver first
    let solution = await aiSolver.solve(captchaData, userAgent);

    if (solution) {
      console.log('✅ AI solver succeeded');
      return solution;
    }

    console.log('⚠️  AI solver failed, trying fallback service');

    // Fallback to external service
    solution = await fallbackSolver(captchaData, userAgent);

    if (solution) {
      console.log('✅ Fallback service succeeded');
      return solution;
    }

    console.log('❌ All solvers failed');
    return null;
  };
}

client.on('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log('');
  console.log('🤖 Advanced AI Captcha Solver Examples:');
  console.log('');
  console.log('1. Built-in Advanced Solver (Default)');
  console.log('   - OCR capabilities with Tesseract.js');
  console.log('   - Auto-retry with exponential backoff');
  console.log('   - Smart caching for performance');
  console.log('   - Multiple solving strategies');
  console.log('');
  console.log('2. Custom AI Integration');
  console.log('   - Integrate TensorFlow.js models');
  console.log('   - Use Puppeteer for browser automation');
  console.log('   - Connect to your own AI services');
  console.log('   - Train custom ML models');
  console.log('');
  console.log('3. Hybrid Approach');
  console.log('   - Try AI solving first');
  console.log('   - Fallback to external services if needed');
  console.log('   - Best success rate');
  console.log('');
  console.log('4. External Service Integration');
  console.log('   - 2captcha, Anti-Captcha, etc.');
  console.log('   - Pay-per-solve model');
  console.log('   - High success rate');
  console.log('');

  // Example: Monitor solver performance
  const solver = createCustomAISolver();

  // Simulate solver usage (for demonstration)
  setTimeout(() => {
    const stats = solver.getStats();
    console.log('📊 Solver Statistics:');
    console.log(`   Total attempts: ${stats.total}`);
    console.log(`   Successful: ${stats.successful}`);
    console.log(`   Failed: ${stats.failed}`);
    console.log(`   Cached: ${stats.cached}`);
    console.log(`   Success rate: ${stats.successRate}`);
    console.log(`   Cache hit rate: ${stats.cacheHitRate}`);
  }, 5000);
});

// Example: Manual captcha solving test
client.on('messageCreate', async message => {
  if (message.content === '!testcaptcha') {
    await message.channel.send('🧪 Testing captcha solver...');

    const solver = createCustomAISolver();

    // Simulate captcha data
    const mockCaptchaData = {
      captcha_service: 'hcaptcha',
      captcha_sitekey: 'test-sitekey-here',
      captcha_rqtoken: 'test-token-here',
    };

    const solution = await solver.solve(mockCaptchaData, 'Mozilla/5.0...');

    if (solution) {
      await message.channel.send('✅ Captcha solved: ' + solution.substring(0, 20) + '...');
    } else {
      await message.channel.send('❌ Captcha solving failed (this is expected with mock data)');
      await message.channel.send('ℹ️  Integrate your custom AI model to solve real captchas');
    }

    // Show stats
    const stats = solver.getStats();
    await message.channel.send(
      `📊 Stats: ${stats.total} attempts, ${stats.successful} successful, ${stats.successRate} success rate`,
    );
  }

  if (message.content === '!clearstats') {
    const solver = createCustomAISolver();
    solver.resetStats();
    solver.clearCache();
    await message.channel.send('🗑️  Solver stats and cache cleared');
  }
});

client.login('YOUR_TOKEN_HERE');

/*
 * INTEGRATION EXAMPLES:
 * 
 * 1. TensorFlow.js Integration:
 * 
 * const tf = require('@tensorflow/tfjs-node');
 * const model = await tf.loadLayersModel('path/to/model.json');
 * 
 * async function solveWithTensorFlow(imageBuffer) {
 *   const tensor = tf.node.decodeImage(imageBuffer);
 *   const prediction = model.predict(tensor);
 *   return prediction;
 * }
 * 
 * 2. Puppeteer Integration:
 * 
 * const puppeteer = require('puppeteer');
 * 
 * async function solveWithPuppeteer(sitekey, url) {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.goto(url);
 *   // Your solving logic
 *   await browser.close();
 * }
 * 
 * 3. Custom API Integration:
 * 
 * async function solveWithCustomAPI(captchaData) {
 *   const response = await fetch('https://api.example.com/solve', {
 *     method: 'POST',
 *     body: JSON.stringify(captchaData)
 *   });
 *   return response.json();
 * }
 */
