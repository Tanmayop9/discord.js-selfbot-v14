const { Client } = require('../src/index');

/**
 * Advanced Guild & Server Management
 * 
 * Features:
 * - Auto guild join/leave
 * - Member tracking and analytics
 * - Role management automation
 * - Channel monitoring
 * - Server insights and statistics
 */

const client = new Client();

class GuildManager {
  constructor(client) {
    this.client = client;
    this.guildStats = new Map();
  }

  /**
   * Get comprehensive guild statistics
   */
  async getGuildStats(guildId) {
    const guild = await this.client.guilds.fetch(guildId);
    await guild.members.fetch();

    const stats = {
      name: guild.name,
      id: guild.id,
      ownerId: guild.ownerId,
      createdAt: guild.createdAt,
      memberCount: guild.memberCount,
      members: {
        total: guild.memberCount,
        humans: guild.members.cache.filter(m => !m.user.bot).size,
        bots: guild.members.cache.filter(m => m.user.bot).size,
        online: guild.members.cache.filter(m => m.presence?.status === 'online').size,
        idle: guild.members.cache.filter(m => m.presence?.status === 'idle').size,
        dnd: guild.members.cache.filter(m => m.presence?.status === 'dnd').size,
        offline: guild.members.cache.filter(m => m.presence?.status === 'offline').size,
      },
      collectibles: {
        withProfileEffects: guild.members.cache.filter(m => m.user.collectibles?.profileEffect).size,
        withNameplates: guild.members.cache.filter(m => m.user.collectibles?.nameplate).size,
        withAvatarDecorations: guild.members.cache.filter(m => m.user.avatarDecorationData).size,
      },
      roles: guild.roles.cache.size,
      channels: {
        total: guild.channels.cache.size,
        text: guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size,
        voice: guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size,
        category: guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size,
        announcement: guild.channels.cache.filter(c => c.type === 'GUILD_ANNOUNCEMENT').size,
        forum: guild.channels.cache.filter(c => c.type === 'GUILD_FORUM').size,
      },
      emojis: guild.emojis.cache.size,
      stickers: guild.stickers.cache.size,
      boostLevel: guild.premiumTier,
      boostCount: guild.premiumSubscriptionCount,
    };

    this.guildStats.set(guildId, stats);
    return stats;
  }

  /**
   * Monitor member joins/leaves
   */
  startMemberTracking() {
    this.client.on('guildMemberAdd', member => {
      console.log(`\n✅ Member Joined: ${member.user.tag}`);
      console.log(`   Guild: ${member.guild.name}`);
      console.log(`   Account Created: ${member.user.createdAt.toLocaleDateString()}`);
      console.log(`   Member Count: ${member.guild.memberCount}`);

      // Check for suspicious accounts
      const accountAge = Date.now() - member.user.createdTimestamp;
      const daysOld = Math.floor(accountAge / (1000 * 60 * 60 * 24));

      if (daysOld < 7) {
        console.log(`   ⚠️  WARNING: New account (${daysOld} days old)`);
      }

      if (member.user.collectibles?.profileEffect) {
        console.log(`   ✨ Has profile effect: ${member.user.collectibles.profileEffect.label}`);
      }
    });

    this.client.on('guildMemberRemove', member => {
      console.log(`\n❌ Member Left: ${member.user.tag}`);
      console.log(`   Guild: ${member.guild.name}`);
      console.log(`   Joined At: ${member.joinedAt?.toLocaleDateString() || 'Unknown'}`);
      console.log(`   Member Count: ${member.guild.memberCount}`);
    });

    console.log('👥 Member tracking activated');
  }

  /**
   * Find guilds by criteria
   */
  findGuilds(criteria) {
    return this.client.guilds.cache.filter(guild => {
      if (criteria.minMembers && guild.memberCount < criteria.minMembers) return false;
      if (criteria.maxMembers && guild.memberCount > criteria.maxMembers) return false;
      if (criteria.hasBoosts && guild.premiumTier < 1) return false;
      if (criteria.nameIncludes && !guild.name.toLowerCase().includes(criteria.nameIncludes.toLowerCase()))
        return false;
      return true;
    });
  }

  /**
   * Get top guilds by various metrics
   */
  getTopGuilds(metric = 'members', limit = 5) {
    const sorted = this.client.guilds.cache.sort((a, b) => {
      switch (metric) {
        case 'members':
          return b.memberCount - a.memberCount;
        case 'roles':
          return b.roles.cache.size - a.roles.cache.size;
        case 'channels':
          return b.channels.cache.size - a.channels.cache.size;
        case 'emojis':
          return b.emojis.cache.size - a.emojis.cache.size;
        case 'boosts':
          return b.premiumSubscriptionCount - a.premiumSubscriptionCount;
        default:
          return b.memberCount - a.memberCount;
      }
    });

    return sorted.first(limit);
  }

  /**
   * Auto-leave dead guilds
   */
  async autoLeaveDeadGuilds(inactiveDays = 30) {
    const deadGuilds = [];

    for (const [, guild] of this.client.guilds.cache) {
      try {
        const channels = guild.channels.cache.filter(c => c.isText());
        let lastMessage = null;

        for (const [, channel] of channels) {
          try {
            const messages = await channel.messages.fetch({ limit: 1 });
            if (messages.size > 0) {
              const msg = messages.first();
              if (!lastMessage || msg.createdTimestamp > lastMessage.createdTimestamp) {
                lastMessage = msg;
              }
            }
          } catch (error) {
            // No permission or error
          }
        }

        if (lastMessage) {
          const daysSinceLastMessage = (Date.now() - lastMessage.createdTimestamp) / (1000 * 60 * 60 * 24);
          if (daysSinceLastMessage > inactiveDays) {
            deadGuilds.push({
              guild: guild.name,
              id: guild.id,
              daysSinceLastMessage: Math.floor(daysSinceLastMessage),
            });
          }
        }
      } catch (error) {
        console.error(`Error checking guild ${guild.name}:`, error.message);
      }
    }

    return deadGuilds;
  }

  /**
   * Generate guild report
   */
  generateReport(stats) {
    const lines = [];

    lines.push('╔═══════════════════════════════════════════════╗');
    lines.push('║           GUILD STATISTICS REPORT             ║');
    lines.push('╚═══════════════════════════════════════════════╝');
    lines.push('');
    lines.push(`📋 Guild: ${stats.name}`);
    lines.push(`🆔 ID: ${stats.id}`);
    lines.push(`📅 Created: ${stats.createdAt.toLocaleDateString()}`);
    lines.push('');
    lines.push(`👥 Members: ${stats.memberCount}`);
    lines.push(`   Humans: ${stats.members.humans} | Bots: ${stats.members.bots}`);
    lines.push(`   Online: ${stats.members.online} | Idle: ${stats.members.idle}`);
    lines.push(`   DND: ${stats.members.dnd} | Offline: ${stats.members.offline}`);
    lines.push('');
    lines.push('✨ Collectibles:');
    lines.push(`   Profile Effects: ${stats.collectibles.withProfileEffects}`);
    lines.push(`   Nameplates: ${stats.collectibles.withNameplates}`);
    lines.push(`   Avatar Decorations: ${stats.collectibles.withAvatarDecorations}`);
    lines.push('');
    lines.push(`🎭 Roles: ${stats.roles}`);
    lines.push(`📺 Channels: ${stats.channels.total}`);
    lines.push(`   Text: ${stats.channels.text} | Voice: ${stats.channels.voice}`);
    lines.push(`   Forums: ${stats.channels.forum} | Announcements: ${stats.channels.announcement}`);
    lines.push('');
    lines.push(`😀 Emojis: ${stats.emojis} | Stickers: ${stats.stickers}`);
    lines.push(`🚀 Boost Level: ${stats.boostLevel} (${stats.boostCount} boosts)`);
    lines.push('');
    lines.push('═══════════════════════════════════════════════');

    return lines.join('\n');
  }
}

client.on('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}\n`);

  const guildManager = new GuildManager(client);

  // Start member tracking
  guildManager.startMemberTracking();

  // Get stats for all guilds
  console.log('📊 Fetching guild statistics...\n');

  for (const [, guild] of client.guilds.cache) {
    try {
      const stats = await guildManager.getGuildStats(guild.id);
      console.log(guildManager.generateReport(stats));
      console.log('');

      // Small delay between guilds
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error getting stats for ${guild.name}:`, error.message);
    }
  }

  // Show top guilds
  console.log('\n🏆 TOP GUILDS BY MEMBERS:');
  const topGuilds = guildManager.getTopGuilds('members', 5);
  topGuilds.forEach((guild, index) => {
    console.log(`   ${index + 1}. ${guild.name} - ${guild.memberCount} members`);
  });

  // Find specific guilds
  console.log('\n🔍 LARGE GUILDS (>100 members):');
  const largeGuilds = guildManager.findGuilds({ minMembers: 100 });
  console.log(`   Found ${largeGuilds.size} large guilds`);
  largeGuilds.forEach(guild => {
    console.log(`   - ${guild.name}: ${guild.memberCount} members`);
  });

  // Check for dead guilds (optional)
  // console.log('\n💀 Checking for inactive guilds...');
  // const deadGuilds = await guildManager.autoLeaveDeadGuilds(30);
  // if (deadGuilds.length > 0) {
  //   console.log(`   Found ${deadGuilds.length} inactive guilds:`);
  //   deadGuilds.forEach(g => {
  //     console.log(`   - ${g.guild}: ${g.daysSinceLastMessage} days since last message`);
  //   });
  // }
});

// Commands
client.on('messageCreate', async message => {
  if (!message.content.startsWith('!guild')) return;

  const guildManager = new GuildManager(client);
  const args = message.content.split(' ').slice(1);

  if (args[0] === 'stats') {
    try {
      const stats = await guildManager.getGuildStats(message.guild.id);
      await message.channel.send('```\n' + guildManager.generateReport(stats) + '\n```');
    } catch (error) {
      await message.channel.send('❌ Error: ' + error.message);
    }
  }

  if (args[0] === 'top') {
    const metric = args[1] || 'members';
    const topGuilds = guildManager.getTopGuilds(metric, 5);

    const list = topGuilds
      .map((guild, i) => {
        const value =
          metric === 'members'
            ? guild.memberCount
            : metric === 'roles'
              ? guild.roles.cache.size
              : metric === 'channels'
                ? guild.channels.cache.size
                : guild.emojis.cache.size;
        return `${i + 1}. ${guild.name} - ${value}`;
      })
      .join('\n');

    await message.channel.send(`**Top Guilds by ${metric}:**\n${list}`);
  }
});

client.login('YOUR_TOKEN_HERE');
