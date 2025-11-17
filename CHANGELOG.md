# Changelog - discord.js-selfbot-v14

## [4.0.0] - Ultra Advanced Edition - 2025-11-16

### 🚀 Major Features

#### Advanced AI Captcha Solver System
- **Multi-Strategy Solving**: Auto, OCR, pattern recognition, and hybrid approaches
- **Smart Caching System**: Reduces solve time with intelligent result caching
- **Auto-Retry Mechanism**: Exponential backoff for improved success rates
- **Performance Statistics**: Track solve rates, success rates, and cache efficiency
- **Extensible Framework**: Easy integration with TensorFlow.js, Puppeteer, or custom AI models
- **No External Dependencies Required**: Works without mandatory API keys
- **Multiple Solving Strategies**: Choose between auto, OCR, pattern, or hybrid modes

#### Enhanced Profile & Collectibles System
- **Profile Effects**: Full support with SKU tracking, animation types, reduced motion variants
- **Expiration Tracking**: Monitor when profile effects expire
- **Nameplates**: Complete system with palette information and customization
- **Avatar Decorations**: Enhanced decoration support with asset management
- **Guild Tag Badges**: Primary guild identity display
- **Collectibles Management**: Unified API for all profile customizations
- **Batch URL Access**: Get all collectible URLs with single method call

#### Advanced Automation Utilities
- **Message Automation**: Queue system with priority, typing simulation, smart delays
- **Presence Management**: Dynamic cycling, time-based updates, activity mirroring
- **Rate Limiting**: Built-in rate limiters to prevent API abuse
- **User Monitoring**: Track status changes, activities, and presence updates
- **Spam Detection**: Automatic spam detection for messages
- **Batch Operations**: Fetch multiple users with built-in rate limiting

#### Guild & Server Management
- **Comprehensive Statistics**: Track members, channels, roles, emojis, collectibles
- **Member Tracking**: Monitor joins/leaves with detailed analytics
- **Dead Guild Detection**: Identify and optionally leave inactive servers
- **Top Guilds**: Rank guilds by various metrics
- **Advanced Filtering**: Find guilds by custom criteria

### 📦 New Modules

- `src/util/AdvancedAICaptchaSolver.js` - Ultra-advanced captcha solving framework
- `src/util/AutomationUtils.js` - Comprehensive automation utilities
- Multiple new example files demonstrating all features

### 🎯 Example Files

1. **AdvancedV14Features.js** - Complete showcase of all v14 features
2. **AdvancedMessageAutomation.js** - Message automation, queuing, auto-responders
3. **ProfileCustomizationManager.js** - Profile management and collectibles tracking
4. **AdvancedPresenceManager.js** - Dynamic presence, activity cycling, mirroring
5. **AdvancedGuildManagement.js** - Guild statistics, member tracking, analytics
6. **CustomAICaptchaSolver.js** - Custom AI integration examples

### ✨ New User Methods

- `user.profileEffectURL(reducedMotion)` - Get profile effect asset URL
- `user.nameplateURL()` - Get nameplate asset URL
- `user.isProfileEffectExpired` - Check if profile effect has expired
- `user.getCollectiblesURLs()` - Get all collectible URLs at once

### 🔧 Enhanced Features

- Profile effects with description, animation type, and expiration tracking
- Nameplate support with full palette information
- Advanced CDN endpoints for new assets (ProfileEffect, Nameplate)
- Comprehensive JSDoc documentation throughout

### 🛠️ Technical Improvements

- Fixed ws package vulnerability (CVE-2024-37890) - updated to 8.17.1
- Added tesseract.js for OCR capabilities
- Improved code organization and modularity
- Full ESLint compliance
- TypeScript definitions ready

### 📖 Documentation

- Comprehensive README with feature showcase
- Multiple working examples for different use cases
- Integration guides for custom AI models
- Migration guide from v13

### 🔒 Security

- No external API keys required for basic functionality
- Extensible framework allows secure custom implementations
- Updated dependencies to patch known vulnerabilities

### Breaking Changes

- Package renamed: `discord.js-selfbot-v13` → `discord.js-selfbot-v14`
- Version bump: 3.7.1 → 4.0.0
- Default captcha solver changed to advanced framework (no longer throws error)
- New collectibles structure includes profile effects

### Migration from v13

```bash
# Uninstall v13
npm uninstall discord.js-selfbot-v13

# Install v14
npm install discord.js-selfbot-v14
```

```javascript
// Code remains compatible!
const { Client } = require('discord.js-selfbot-v14');
const client = new Client();

// New features available immediately
client.on('ready', () => {
  if (client.user.collectibles?.profileEffect) {
    console.log('Profile Effect:', client.user.collectibles.profileEffect.label);
    console.log('URL:', client.user.profileEffectURL());
  }
});
```

### Dependencies

**Added:**
- `tesseract.js@^5.1.1` - OCR capabilities for captcha solving

**Updated:**
- `ws@^8.17.1` - Security fix for DoS vulnerability

### Credits

- Based on discord.js-selfbot-v13 by aiko-chan-ai
- Original Discord.js library by Discord.js team
- Community contributions and feedback

### Known Limitations

- AI captcha solver provides framework - custom implementation needed for production
- Profile effect expiration requires manual tracking
- Some features require appropriate Discord API permissions

### Future Enhancements (Planned)

- Pre-trained AI models for captcha solving
- More automation utilities
- Advanced analytics dashboard
- Profile customization presets
- Enhanced guild management tools

---

## Previous Versions

See [discord.js-selfbot-v13 CHANGELOG](https://github.com/aiko-chan-ai/discord.js-selfbot-v13) for v13 history.
