const { Client } = require('../src/index');

/**
 * Advanced Presence & Activity Manager
 * 
 * Features:
 * - Custom rich presence
 * - Dynamic activity cycling
 * - Game detection and auto-switching
 * - Spotify integration
 * - Custom status rotation
 * - Activity-based automation
 */

const client = new Client();

class PresenceManager {
  constructor(client) {
    this.client = client;
    this.currentPresenceIndex = 0;
    this.presenceInterval = null;
  }

  /**
   * Set rich presence with custom data
   */
  async setRichPresence(options) {
    const presence = {
      status: options.status || 'online',
      activities: [],
    };

    if (options.game) {
      presence.activities.push({
        name: options.game,
        type: 'PLAYING',
        details: options.details,
        state: options.state,
        timestamps: options.timestamps,
        assets: options.assets,
        buttons: options.buttons,
      });
    }

    if (options.customStatus) {
      presence.activities.push({
        type: 'CUSTOM',
        state: options.customStatus,
        emoji: options.emoji,
      });
    }

    await this.client.user.setPresence(presence);
    console.log('✅ Presence updated:', presence);
  }

  /**
   * Cycle through multiple presences
   */
  startPresenceCycle(presenceList, intervalSeconds = 60) {
    if (this.presenceInterval) {
      clearInterval(this.presenceInterval);
    }

    const cycle = async () => {
      const presence = presenceList[this.currentPresenceIndex];
      await this.client.user.setPresence(presence);

      console.log(
        `🔄 Cycled to presence ${this.currentPresenceIndex + 1}/${presenceList.length}`,
      );

      this.currentPresenceIndex = (this.currentPresenceIndex + 1) % presenceList.length;
    };

    cycle(); // Set immediately
    this.presenceInterval = setInterval(cycle, intervalSeconds * 1000);

    console.log(`✅ Presence cycling started (${intervalSeconds}s intervals)`);
  }

  /**
   * Stop presence cycling
   */
  stopPresenceCycle() {
    if (this.presenceInterval) {
      clearInterval(this.presenceInterval);
      this.presenceInterval = null;
      console.log('⏹️  Presence cycling stopped');
    }
  }

  /**
   * Match another user's presence
   */
  async mirrorPresence(userId) {
    const user = await this.client.users.fetch(userId);
    const presence = user.presence;

    if (!presence) {
      console.log('❌ User has no presence');
      return;
    }

    await this.client.user.setPresence({
      status: presence.status,
      activities: presence.activities,
    });

    console.log(`✅ Mirroring ${user.username}'s presence`);
  }

  /**
   * Auto-detect and show what you're doing
   */
  async autoDetectActivity() {
    // This is a framework - you can extend this with actual app detection
    const detectedApps = [
      { name: 'Visual Studio Code', activity: 'Coding' },
      { name: 'Chrome', activity: 'Browsing' },
      { name: 'Discord', activity: 'Chatting' },
    ];

    const randomApp = detectedApps[Math.floor(Math.random() * detectedApps.length)];

    await this.client.user.setPresence({
      activities: [
        {
          name: randomApp.activity,
          type: 'PLAYING',
          details: `Using ${randomApp.name}`,
        },
      ],
    });

    console.log(`🔍 Auto-detected activity: ${randomApp.activity}`);
  }

  /**
   * Set Spotify-like presence
   */
  async setSpotifyPresence(song, artist, album) {
    await this.client.user.setPresence({
      activities: [
        {
          name: song,
          type: 'LISTENING',
          details: artist,
          state: album,
          assets: {
            large_image: 'spotify:ab67616d00001e02',
            large_text: album,
          },
        },
      ],
    });

    console.log(`🎵 Now playing: ${song} by ${artist}`);
  }

  /**
   * Set streaming presence
   */
  async setStreamingPresence(title, url) {
    await this.client.user.setPresence({
      activities: [
        {
          name: title,
          type: 'STREAMING',
          url: url, // Must be Twitch/YouTube URL
        },
      ],
    });

    console.log(`📺 Streaming: ${title}`);
  }

  /**
   * Time-based automatic presence
   */
  startTimeBasedPresence() {
    const updatePresence = async () => {
      const hour = new Date().getHours();
      let status, activity;

      if (hour >= 6 && hour < 12) {
        status = 'online';
        activity = { name: 'Morning Coffee ☕', type: 'CUSTOM' };
      } else if (hour >= 12 && hour < 18) {
        status = 'online';
        activity = { name: 'Working', type: 'PLAYING' };
      } else if (hour >= 18 && hour < 22) {
        status = 'idle';
        activity = { name: 'Relaxing', type: 'PLAYING' };
      } else {
        status = 'dnd';
        activity = { name: 'Sleeping 😴', type: 'CUSTOM' };
      }

      await this.client.user.setPresence({
        status,
        activities: [activity],
      });

      console.log(`🕐 Time-based presence: ${activity.name} (${status})`);
    };

    updatePresence();
    setInterval(updatePresence, 3600000); // Update every hour

    console.log('✅ Time-based presence activated');
  }
}

client.on('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}\n`);

  const presenceManager = new PresenceManager(client);

  // Example 1: Set custom rich presence
  console.log('Example 1: Custom Rich Presence');
  await presenceManager.setRichPresence({
    status: 'online',
    game: 'discord.js-selfbot-v14',
    details: 'Building something awesome',
    state: 'Using advanced features',
    customStatus: '🚀 Coding with v14',
  });

  // Wait a bit before next example
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Example 2: Presence cycling
  console.log('\nExample 2: Presence Cycling');
  const presenceCycle = [
    {
      status: 'online',
      activities: [
        {
          name: 'with discord.js-v14',
          type: 'PLAYING',
        },
      ],
    },
    {
      status: 'idle',
      activities: [
        {
          name: 'Lo-Fi Hip Hop',
          type: 'LISTENING',
        },
      ],
    },
    {
      status: 'dnd',
      activities: [
        {
          name: 'on my project',
          type: 'WORKING',
        },
      ],
    },
    {
      status: 'online',
      activities: [
        {
          type: 'CUSTOM',
          state: '💻 Coding in TypeScript',
        },
      ],
    },
  ];

  presenceManager.startPresenceCycle(presenceCycle, 30);

  // Example 3: Spotify presence (after 2 minutes)
  setTimeout(async () => {
    console.log('\nExample 3: Spotify Presence');
    await presenceManager.setSpotifyPresence(
      'Night Changes',
      'One Direction',
      'FOUR (Deluxe)',
    );
  }, 120000);

  // Example 4: Time-based presence (uncomment to enable)
  // presenceManager.startTimeBasedPresence();
});

// Monitor presence changes of others
client.on('presenceUpdate', (oldPresence, newPresence) => {
  if (!newPresence.user) return;

  console.log(`\n📊 Presence Update: ${newPresence.user.tag}`);
  console.log(`   Status: ${oldPresence?.status || 'unknown'} → ${newPresence.status}`);

  if (newPresence.activities.length > 0) {
    console.log('   Activities:');
    newPresence.activities.forEach(activity => {
      console.log(`      - ${activity.type}: ${activity.name || activity.state}`);
      if (activity.details) console.log(`        Details: ${activity.details}`);
      if (activity.state) console.log(`        State: ${activity.state}`);
    });
  }

  // Auto-mirror VIP users
  const vipUsers = ['VIP_USER_ID_HERE']; // Replace with actual IDs
  if (vipUsers.includes(newPresence.userId)) {
    const presenceManager = new PresenceManager(client);
    presenceManager.mirrorPresence(newPresence.userId);
  }
});

// Commands
client.on('messageCreate', async message => {
  if (!message.content.startsWith('!presence')) return;

  const presenceManager = new PresenceManager(client);
  const args = message.content.split(' ').slice(1);

  if (args[0] === 'game') {
    const gameName = args.slice(1).join(' ');
    await presenceManager.setRichPresence({ game: gameName });
    await message.react('✅');
  }

  if (args[0] === 'listening') {
    const song = args.slice(1).join(' ');
    await client.user.setPresence({
      activities: [{ name: song, type: 'LISTENING' }],
    });
    await message.react('🎵');
  }

  if (args[0] === 'watching') {
    const show = args.slice(1).join(' ');
    await client.user.setPresence({
      activities: [{ name: show, type: 'WATCHING' }],
    });
    await message.react('📺');
  }

  if (args[0] === 'custom') {
    const status = args.slice(1).join(' ');
    await client.user.setPresence({
      activities: [{ type: 'CUSTOM', state: status }],
    });
    await message.react('✨');
  }

  if (args[0] === 'mirror') {
    const userId = message.mentions.users.first()?.id;
    if (userId) {
      await presenceManager.mirrorPresence(userId);
      await message.react('🪞');
    }
  }

  if (args[0] === 'cycle') {
    if (args[1] === 'start') {
      const presenceCycle = [
        { status: 'online', activities: [{ name: 'Game 1', type: 'PLAYING' }] },
        { status: 'idle', activities: [{ name: 'Music', type: 'LISTENING' }] },
        { status: 'dnd', activities: [{ type: 'CUSTOM', state: '💤 Do Not Disturb' }] },
      ];
      presenceManager.startPresenceCycle(presenceCycle, 30);
      await message.react('🔄');
    } else if (args[1] === 'stop') {
      presenceManager.stopPresenceCycle();
      await message.react('⏹️');
    }
  }
});

client.login('YOUR_TOKEN_HERE');
