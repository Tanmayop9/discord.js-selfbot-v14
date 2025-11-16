const { Client } = require('../src/index');

/**
 * Profile Customization & Collectibles Manager
 * 
 * Advanced features for managing user profiles:
 * - Profile effects tracking and expiration
 * - Avatar decorations management
 * - Nameplate customization
 * - Guild tag badges
 * - Collectibles inventory system
 */

const client = new Client();

// Collectibles database
const collectiblesDB = new Map();

class ProfileManager {
  constructor(client) {
    this.client = client;
  }

  /**
   * Get complete profile information
   */
  async getFullProfile(userId) {
    const user = await this.client.users.fetch(userId);

    return {
      basic: {
        id: user.id,
        username: user.username,
        globalName: user.globalName,
        discriminator: user.discriminator,
        bot: user.bot,
        createdAt: user.createdAt,
      },
      visuals: {
        avatar: user.displayAvatarURL({ size: 1024, dynamic: true }),
        banner: user.bannerURL({ size: 1024 }) || null,
        accentColor: user.hexAccentColor,
        bannerColor: user.bannerColor,
      },
      avatarDecoration: user.avatarDecorationData
        ? {
            asset: user.avatarDecorationData.asset,
            skuId: user.avatarDecorationData.skuId,
            url: user.avatarDecorationURL(),
          }
        : null,
      profileEffect: user.collectibles?.profileEffect
        ? {
            label: user.collectibles.profileEffect.label,
            description: user.collectibles.profileEffect.description,
            skuId: user.collectibles.profileEffect.skuId,
            animationType: user.collectibles.profileEffect.animationType,
            url: user.profileEffectURL(),
            reducedMotionUrl: user.profileEffectURL(true),
            expiresAt: user.collectibles.profileEffect.expiresAt,
            isExpired: user.isProfileEffectExpired,
          }
        : null,
      nameplate: user.collectibles?.nameplate
        ? {
            label: user.collectibles.nameplate.label,
            palette: user.collectibles.nameplate.palette,
            skuId: user.collectibles.nameplate.skuId,
            url: user.nameplateURL(),
          }
        : null,
      primaryGuild: user.primaryGuild
        ? {
            guildId: user.primaryGuild.identityGuildId,
            tag: user.primaryGuild.tag,
            enabled: user.primaryGuild.identityEnabled,
            badgeUrl: user.guildTagBadgeURL(),
          }
        : null,
      flags: user.flags ? user.flags.toArray() : [],
      allUrls: user.getCollectiblesURLs(),
    };
  }

  /**
   * Track expiring profile effects
   */
  trackExpiringEffects(users) {
    const expiring = [];

    users.forEach(user => {
      if (user.collectibles?.profileEffect?.expiresAt) {
        const effect = user.collectibles.profileEffect;
        const daysUntilExpiry = Math.ceil(
          (effect.expiresAt - new Date()) / (1000 * 60 * 60 * 24),
        );

        if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
          expiring.push({
            user: user.username,
            effect: effect.label,
            expiresAt: effect.expiresAt,
            daysLeft: daysUntilExpiry,
          });
        }
      }
    });

    return expiring.sort((a, b) => a.daysLeft - b.daysLeft);
  }

  /**
   * Compare profiles
   */
  async compareProfiles(userId1, userId2) {
    const [profile1, profile2] = await Promise.all([
      this.getFullProfile(userId1),
      this.getFullProfile(userId2),
    ]);

    return {
      user1: profile1.basic.username,
      user2: profile2.basic.username,
      comparison: {
        bothHaveAvatarDecoration:
          profile1.avatarDecoration !== null && profile2.avatarDecoration !== null,
        bothHaveProfileEffect: profile1.profileEffect !== null && profile2.profileEffect !== null,
        bothHaveNameplate: profile1.nameplate !== null && profile2.nameplate !== null,
        sameAvatarDecoration:
          profile1.avatarDecoration?.asset === profile2.avatarDecoration?.asset,
        sameProfileEffect: profile1.profileEffect?.skuId === profile2.profileEffect?.skuId,
        sameNameplate: profile1.nameplate?.skuId === profile2.nameplate?.skuId,
      },
    };
  }

  /**
   * Generate profile summary
   */
  generateSummary(profile) {
    const lines = [];

    lines.push('╔═══════════════════════════════════════╗');
    lines.push('║        PROFILE SUMMARY v14            ║');
    lines.push('╚═══════════════════════════════════════╝');
    lines.push('');
    lines.push(`👤 ${profile.basic.username}#${profile.basic.discriminator}`);
    if (profile.basic.globalName) lines.push(`   Display Name: ${profile.basic.globalName}`);
    lines.push(`   ID: ${profile.basic.id}`);
    lines.push('');

    if (profile.avatarDecoration) {
      lines.push('✨ Avatar Decoration:');
      lines.push(`   ${profile.avatarDecoration.asset}`);
    }

    if (profile.profileEffect) {
      lines.push('🌟 Profile Effect:');
      lines.push(`   ${profile.profileEffect.label}`);
      if (profile.profileEffect.description) {
        lines.push(`   ${profile.profileEffect.description}`);
      }
      if (profile.profileEffect.expiresAt) {
        lines.push(`   Expires: ${profile.profileEffect.expiresAt.toLocaleDateString()}`);
        lines.push(`   Status: ${profile.profileEffect.isExpired ? '❌ EXPIRED' : '✅ Active'}`);
      }
    }

    if (profile.nameplate) {
      lines.push('🏷️  Nameplate:');
      lines.push(`   ${profile.nameplate.label} (Palette: ${profile.nameplate.palette})`);
    }

    if (profile.primaryGuild) {
      lines.push('🏰 Primary Guild:');
      lines.push(`   Tag: ${profile.primaryGuild.tag}`);
      lines.push(`   ${profile.primaryGuild.enabled ? 'Displayed' : 'Hidden'}`);
    }

    if (profile.flags.length > 0) {
      lines.push('🚩 Flags: ' + profile.flags.join(', '));
    }

    return lines.join('\n');
  }
}

client.on('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const profileManager = new ProfileManager(client);

  // Example 1: Get full profile
  console.log('\n📊 Getting full profile...');
  try {
    const myProfile = await profileManager.getFullProfile(client.user.id);
    console.log(profileManager.generateSummary(myProfile));

    // Save to database
    collectiblesDB.set(client.user.id, myProfile);
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Example 2: Check all guild members for collectibles
  console.log('\n🔍 Scanning guild members for collectibles...');
  const guild = client.guilds.cache.first();

  if (guild) {
    try {
      await guild.members.fetch();
      const users = guild.members.cache.map(m => m.user);

      const withEffects = users.filter(u => u.collectibles?.profileEffect).size;
      const withNameplates = users.filter(u => u.collectibles?.nameplate).size;
      const withDecorations = users.filter(u => u.avatarDecorationData).size;

      console.log(`   Total members: ${users.size}`);
      console.log(`   With profile effects: ${withEffects}`);
      console.log(`   With nameplates: ${withNameplates}`);
      console.log(`   With avatar decorations: ${withDecorations}`);

      // Track expiring effects
      const expiring = profileManager.trackExpiringEffects(users);
      if (expiring.length > 0) {
        console.log('\n⚠️  Expiring profile effects:');
        expiring.forEach(item => {
          console.log(
            `   ${item.user}: ${item.effect} expires in ${item.daysLeft} day(s)`,
          );
        });
      }
    } catch (error) {
      console.error('Error scanning guild:', error.message);
    }
  }
});

// Command handler
client.on('messageCreate', async message => {
  if (!message.content.startsWith('!')) return;

  const profileManager = new ProfileManager(client);
  const args = message.content.slice(1).split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'profile') {
    const userId = message.mentions.users.first()?.id || message.author.id;

    try {
      const profile = await profileManager.getFullProfile(userId);
      await message.channel.send('```\n' + profileManager.generateSummary(profile) + '\n```');

      // Send URLs
      const urls = Object.entries(profile.allUrls)
        .filter(([_, url]) => url)
        .map(([key, url]) => `${key}: ${url}`)
        .join('\n');

      if (urls) {
        await message.channel.send('🔗 **Collectible URLs:**\n' + urls);
      }
    } catch (error) {
      await message.channel.send('❌ Error: ' + error.message);
    }
  }

  if (command === 'compare') {
    const users = message.mentions.users;
    if (users.size < 2) {
      await message.channel.send('❌ Please mention 2 users to compare!');
      return;
    }

    const [user1, user2] = users.first(2);

    try {
      const comparison = await profileManager.compareProfiles(user1.id, user2.id);
      const result = [
        `Comparing **${comparison.user1}** vs **${comparison.user2}**:`,
        '',
        `Avatar Decorations: ${comparison.comparison.bothHaveAvatarDecoration ? '✅ Both have' : '❌ Not both'} ${comparison.comparison.sameAvatarDecoration ? '(Same)' : ''}`,
        `Profile Effects: ${comparison.comparison.bothHaveProfileEffect ? '✅ Both have' : '❌ Not both'} ${comparison.comparison.sameProfileEffect ? '(Same)' : ''}`,
        `Nameplates: ${comparison.comparison.bothHaveNameplate ? '✅ Both have' : '❌ Not both'} ${comparison.comparison.sameNameplate ? '(Same)' : ''}`,
      ].join('\n');

      await message.channel.send(result);
    } catch (error) {
      await message.channel.send('❌ Error: ' + error.message);
    }
  }
});

client.login('YOUR_TOKEN_HERE');
