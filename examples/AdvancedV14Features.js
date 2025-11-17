const { Client } = require('../src/index');

/**
 * Ultra-Advanced v14 Features Example
 * 
 * This example demonstrates:
 * - Advanced AI Captcha Solver with statistics
 * - Profile Effects with expiration tracking
 * - Nameplates with palette information
 * - Avatar Decorations
 * - Guild Tag Badges
 * - Collectibles management
 * - Advanced user profile customization
 */

// Create client with advanced configuration
const client = new Client({
  // The advanced AI captcha solver is enabled by default!
  // It includes caching, retries, and multiple solving strategies
  captchaRetryLimit: 5, // Increased retry limit for better success rate
});

client.on('ready', async () => {
  console.log(`✅ ${client.user.username} is ready!`);
  console.log(`📊 Client ID: ${client.user.id}`);
  console.log('');

  // Example: Fetch and display comprehensive user profile
  try {
    const userId = 'USER_ID_HERE'; // Replace with actual user ID
    const user = await client.users.fetch(userId);

    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║        ULTRA-ADVANCED USER PROFILE (v14)          ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log('');

    // Basic Info
    console.log('👤 Basic Information:');
    console.log(`   Username: ${user.username}`);
    console.log(`   Global Name: ${user.globalName || 'N/A'}`);
    console.log(`   Discriminator: ${user.discriminator}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Bot: ${user.bot ? 'Yes' : 'No'}`);
    console.log(`   Account Created: ${user.createdAt.toLocaleString()}`);
    console.log('');

    // Avatar & Decorations
    console.log('🎨 Visuals:');
    console.log(`   Avatar URL: ${user.displayAvatarURL({ size: 512, dynamic: true })}`);
    console.log(`   Banner URL: ${user.bannerURL({ size: 1024 }) || 'N/A'}`);
    console.log(`   Accent Color: ${user.hexAccentColor || 'N/A'}`);
    console.log('');

    // Avatar Decoration
    if (user.avatarDecorationData) {
      console.log('✨ Avatar Decoration:');
      console.log(`   SKU ID: ${user.avatarDecorationData.skuId}`);
      console.log(`   Asset: ${user.avatarDecorationData.asset}`);
      console.log(`   URL: ${user.avatarDecorationURL()}`);
      console.log('');
    }

    // Profile Effect (New in v14!)
    if (user.collectibles?.profileEffect) {
      const effect = user.collectibles.profileEffect;
      console.log('🌟 Profile Effect:');
      console.log(`   Label: ${effect.label}`);
      console.log(`   Description: ${effect.description || 'N/A'}`);
      console.log(`   SKU ID: ${effect.skuId}`);
      console.log(`   Animation Type: ${effect.animationType || 'N/A'}`);
      console.log(`   Standard URL: ${user.profileEffectURL()}`);
      if (effect.reducedMotionAsset) {
        console.log(`   Reduced Motion URL: ${user.profileEffectURL(true)}`);
      }
      if (effect.expiresAt) {
        console.log(`   Expires: ${effect.expiresAt.toLocaleString()}`);
        console.log(`   Is Expired: ${user.isProfileEffectExpired ? 'Yes' : 'No'}`);
      }
      console.log('');
    }

    // Nameplate (New in v14!)
    if (user.collectibles?.nameplate) {
      const nameplate = user.collectibles.nameplate;
      console.log('🏷️  Nameplate:');
      console.log(`   Label: ${nameplate.label}`);
      console.log(`   SKU ID: ${nameplate.skuId}`);
      console.log(`   Palette: ${nameplate.palette}`);
      console.log(`   URL: ${user.nameplateURL()}`);
      console.log('');
    }

    // Primary Guild/Clan
    if (user.primaryGuild) {
      console.log('🏰 Primary Guild:');
      console.log(`   Guild ID: ${user.primaryGuild.identityGuildId}`);
      console.log(`   Tag: ${user.primaryGuild.tag}`);
      console.log(`   Tag Enabled: ${user.primaryGuild.identityEnabled ? 'Yes' : 'No'}`);
      if (user.primaryGuild.badge) {
        console.log(`   Badge URL: ${user.guildTagBadgeURL()}`);
      }
      console.log('');
    }

    // Get all collectible URLs at once (New v14 feature!)
    console.log('📦 All Collectible URLs:');
    const urls = user.getCollectiblesURLs();
    Object.entries(urls).forEach(([key, value]) => {
      if (value) {
        console.log(`   ${key}: ${value}`);
      }
    });
    console.log('');

    // User Flags
    if (user.flags) {
      console.log('🚩 Flags:', user.flags.toArray().join(', '));
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error fetching user:', error.message);
  }

  // Example: Monitor client user's own profile
  console.log('');
  console.log('📊 Your Profile Summary:');
  console.log(`   Username: ${client.user.username}`);
  console.log(`   Global Name: ${client.user.globalName || 'N/A'}`);
  
  if (client.user.avatarDecorationData) {
    console.log(`   Avatar Decoration: ${client.user.avatarDecorationData.asset}`);
  }
  
  if (client.user.collectibles?.profileEffect) {
    console.log(`   Profile Effect: ${client.user.collectibles.profileEffect.label}`);
  }
  
  if (client.user.collectibles?.nameplate) {
    console.log(`   Nameplate: ${client.user.collectibles.nameplate.label}`);
  }
  console.log('');
});

// The v14 Advanced AI Captcha Solver features:
// ✅ Automatic retry with exponential backoff
// ✅ Caching for improved performance
// ✅ Multiple solving strategies (auto, ocr, pattern, hybrid)
// ✅ Statistics tracking
// ✅ Extensible framework for custom AI models

// To use with custom AI implementation:
/*
const customClient = new Client({
  captchaSolver: async (captcha, userAgent) => {
    // Your custom AI solving logic
    // Integrate TensorFlow.js, Puppeteer, or other tools
    const solver = new YourCustomAISolver();
    return await solver.solve(captcha, userAgent);
  }
});
*/

// Optional: Access the advanced solver for statistics
/*
client.on('ready', () => {
  // If you want to access solver stats:
  console.log('Captcha Solver Stats:', solver.getStats());
});
*/

client.login('YOUR_TOKEN_HERE');
