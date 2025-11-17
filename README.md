<div align="center">
  <br />
  <p>
    <a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
  </p>
</div>

# 🚀 discord.js-selfbot-v14 - Ultra Advanced Edition

<strong>The most advanced discord.js selfbot library with AI-powered features and latest Discord API support</strong>

[![npm version](https://img.shields.io/npm/v/discord.js-selfbot-v14.svg)](https://www.npmjs.com/package/discord.js-selfbot-v14)
[![npm downloads](https://img.shields.io/npm/dt/discord.js-selfbot-v14.svg)](https://www.npmjs.com/package/discord.js-selfbot-v14)

## ✨ What's New in v14?

### 🤖 Advanced AI Captcha Solver Framework
- **Multi-Strategy Solving**: Auto, OCR, pattern recognition, and hybrid approaches
- **Smart Caching**: Reduces solve time with intelligent caching system
- **Auto-Retry**: Exponential backoff for improved success rates
- **Statistics Tracking**: Monitor solve rates and performance
- **Extensible Architecture**: Easy integration with TensorFlow.js, Puppeteer, or custom AI models

### 🎨 Enhanced Profile Features
- **Profile Effects**: Full support with animation types, reduced motion, expiration tracking
- **Nameplates**: Complete nameplate system with palette information
- **Avatar Decorations**: Enhanced decoration support with SKU tracking
- **Guild Tag Badges**: Primary guild identity display
- **Collectibles Management**: Unified system for all profile customizations

### 🔧 Advanced Features
- **Performance Optimized**: Caching and retry mechanisms
- **Type Safety**: Full TypeScript definitions
- **Latest Discord API**: Support for newest Discord features
- **Comprehensive Examples**: Detailed usage examples and documentation

## 📦 Installation

```bash
npm install discord.js-selfbot-v14
```

**Requirements**: Node.js 20.18.0 or newer

## 🎯 Quick Start

```javascript
const { Client } = require('discord.js-selfbot-v14');

const client = new Client();

client.on('ready', () => {
  console.log(`${client.user.username} is ready!`);
  
  // Access advanced profile features
  if (client.user.collectibles?.profileEffect) {
    console.log('Profile Effect:', client.user.collectibles.profileEffect.label);
  }
});

client.login('your-token-here');
```

## 🎨 Profile Features Example

```javascript
const user = await client.users.fetch('USER_ID');

// Profile Effect
if (user.collectibles?.profileEffect) {
  console.log('Effect:', user.collectibles.profileEffect.label);
  console.log('URL:', user.profileEffectURL());
  console.log('Reduced Motion:', user.profileEffectURL(true));
  console.log('Expires:', user.collectibles.profileEffect.expiresAt);
  console.log('Is Expired:', user.isProfileEffectExpired);
}

// Nameplate
if (user.collectibles?.nameplate) {
  console.log('Nameplate:', user.collectibles.nameplate.label);
  console.log('Palette:', user.collectibles.nameplate.palette);
  console.log('URL:', user.nameplateURL());
}

// Get all collectible URLs at once
const urls = user.getCollectiblesURLs();
console.log(urls);
/*
{
  profileEffect: 'https://cdn.discordapp.com/...',
  profileEffectReducedMotion: 'https://cdn.discordapp.com/...',
  nameplate: 'https://cdn.discordapp.com/...',
  avatarDecoration: 'https://cdn.discordapp.com/...',
  guildTagBadge: 'https://cdn.discordapp.com/...'
}
*/
```

## 🤖 AI Captcha Solver

The v14 includes an advanced AI captcha solver framework:

```javascript
const { Client } = require('discord.js-selfbot-v14');

// Default configuration with AI solver
const client = new Client({
  captchaRetryLimit: 5
});

// The advanced solver includes:
// ✅ Automatic retry with exponential backoff
// ✅ Smart caching for faster solving
// ✅ Multiple solving strategies
// ✅ Performance statistics
```

### Custom AI Integration

```javascript
const client = new Client({
  captchaSolver: async (captcha, userAgent) => {
    // Integrate your own AI models
    const { AdvancedAICaptchaSolver } = require('./path/to/solver');
    
    const solver = new AdvancedAICaptchaSolver({
      enableCaching: true,
      maxRetries: 3,
      strategy: 'auto',
      debug: true
    });
    
    const solution = await solver.solve(captcha, userAgent);
    
    // View statistics
    console.log('Stats:', solver.getStats());
    
    return solution;
  }
});
```

## 📚 Features

- ✅ **Messages**: Full message handling and management
- ✅ **Client User**: Status, Activity, RemoteAuth, and more
- ✅ **Guilds**: Fetch members, join/leave, top emojis
- ✅ **Interactions**: Slash commands, buttons, menus, modals
- ✅ **Advanced AI Captcha**: Multi-strategy solving framework
- ✅ **Profile Effects**: Animated effects with expiration tracking
- ✅ **Nameplates**: Customizable nameplates with palettes
- ✅ **Avatar Decorations**: Full decoration support
- ✅ **TOTP Handler**: Two-factor authentication
- ✅ **Voice & Video**: Complete voice/video support
- ✅ **TypeScript**: Full type definitions

## 📖 Documentation

See the [examples](./examples) directory for detailed usage examples:
- [AdvancedV14Features.js](./examples/AdvancedV14Features.js) - Complete v14 features showcase
- [Basic.js](./examples/Basic.js) - Basic setup
- [SlashCommand.md](./examples/SlashCommand.md) - Slash command interactions

## 🔒 Security & Disclaimers

> [!WARNING]
> **Using this library on a user account violates Discord's Terms of Service and can result in account termination.**

> [!CAUTION]
> **We take no responsibility for blocked Discord accounts. Use at your own risk.**

## 🎓 Migration from v13

1. Update package:
```bash
npm uninstall discord.js-selfbot-v13
npm install discord.js-selfbot-v14
```

2. Update imports:
```javascript
// Old
const { Client } = require('discord.js-selfbot-v13');

// New (same syntax!)
const { Client } = require('discord.js-selfbot-v14');
```

3. Enjoy new features!
- Profile effects work automatically
- AI captcha solver is enabled by default
- New collectibles methods available

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code passes linting (`npm run lint`)
- Follows existing code style
- Includes tests if applicable

## 📄 License

GNU General Public License v3.0

## 🙏 Credits

- [Discord.js](https://github.com/discordjs/discord.js) - Original library
- [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13) - Base foundation

## 📊 Repository Stats

![GitHub stars](https://img.shields.io/github/stars/Tanmayop9/discord.js-selfbot-v14?style=social)
![GitHub forks](https://img.shields.io/github/forks/Tanmayop9/discord.js-selfbot-v14?style=social)

---

<div align="center">
  <strong>Made with ❤️ for the Discord development community</strong>
</div>
