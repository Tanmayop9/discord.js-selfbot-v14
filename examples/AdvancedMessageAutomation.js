const { Client } = require('../src/index');
const AutomationUtils = require('../src/util/AutomationUtils');

/**
 * Advanced Message Automation Example
 * 
 * Features:
 * - Auto-responder with pattern matching
 * - Message queue with priority
 * - Smart typing simulation
 * - Rate limiting
 * - Spam detection
 */

const client = new Client();

// Auto-responder patterns
const autoResponderPatterns = {
  'hello|hi|hey': message => `Hey ${message.author.username}! How are you?`,
  'how are you': 'I\'m doing great, thanks for asking!',
  '\\?$': 'That\'s a good question! Let me think about that.',
  'thanks|thank you': 'You\'re welcome! 😊',
};

// Create message queue
const messageQueue = AutomationUtils.createMessageQueue();

// Create spam detector
const spamDetector = AutomationUtils.createSpamDetector(5);

client.on('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // Start auto-responder
  const stopAutoResponder = AutomationUtils.createAutoResponder(client, autoResponderPatterns);
  console.log('🤖 Auto-responder activated');

  // Example: Cycle through presences
  const presences = [
    {
      status: 'online',
      activities: [{ name: 'with discord.js-v14', type: 'PLAYING' }],
    },
    {
      status: 'idle',
      activities: [{ name: 'some music', type: 'LISTENING' }],
    },
    {
      status: 'dnd',
      activities: [{ name: 'on a project', type: 'WORKING' }],
    },
  ];

  const stopPresenceCycle = AutomationUtils.cyclePresences(client, presences, 30000);
  console.log('🔄 Presence cycling activated');

  // Cleanup on CTRL+C
  process.on('SIGINT', () => {
    stopAutoResponder();
    stopPresenceCycle();
    console.log('\n👋 Shutting down gracefully...');
    client.destroy();
    process.exit(0);
  });
});

client.on('messageCreate', async message => {
  // Ignore own messages
  if (message.author.id === client.user.id) return;

  // Spam detection
  if (spamDetector(message.author.id)) {
    console.log(`⚠️  Spam detected from ${message.author.tag}`);
    return;
  }

  // Example: Delayed response with typing
  if (message.content === '!delayedreply') {
    await AutomationUtils.simulateTyping(message.channel, 3000);
    await message.channel.send('Here is your delayed response!');
  }

  // Example: Queue messages
  if (message.content.startsWith('!queue')) {
    const msg = message.content.slice(7);
    const priority = message.content.includes('urgent') ? 10 : 0;

    messageQueue.add(msg, message.channel, priority);
    console.log(`📥 Queued message with priority ${priority}`);

    if (messageQueue.size() >= 5) {
      console.log('📤 Processing queue...');
      await messageQueue.process(2000);
    }
  }

  // Example: Batch fetch users mentioned
  if (message.mentions.users.size > 0) {
    const userIds = message.mentions.users.map(u => u.id);
    console.log(`👥 Fetching ${userIds.length} users...`);

    const users = await AutomationUtils.fetchUsersBatch(client, userIds, 3);
    console.log(`✅ Fetched ${users.length} users successfully`);

    users.forEach(user => {
      if (user.collectibles?.profileEffect) {
        console.log(`   ${user.username} has profile effect: ${user.collectibles.profileEffect.label}`);
      }
    });
  }

  // Example: Collect messages
  if (message.content === '!collect') {
    await message.channel.send('Send me 5 messages in the next 30 seconds!');

    try {
      const collected = await AutomationUtils.collectMessages(message.channel, {
        filter: m => m.author.id === message.author.id,
        max: 5,
        time: 30000,
      });

      await message.channel.send(`✅ Collected ${collected.size} messages!`);
    } catch (error) {
      await message.channel.send('⏱️  Time\'s up! Didn\'t get enough messages.');
    }
  }
});

// Monitor specific user status
client.on('ready', () => {
  const userIdToMonitor = 'USER_ID_HERE'; // Replace with actual user ID

  const stopMonitoring = AutomationUtils.monitorUserStatus(client, userIdToMonitor, statusData => {
    console.log(`📊 User status changed:`, statusData);

    if (statusData.status === 'online') {
      console.log('   User came online!');
    } else if (statusData.status === 'offline') {
      console.log('   User went offline!');
    }

    if (statusData.activities.length > 0) {
      statusData.activities.forEach(activity => {
        console.log(`   Activity: ${activity.name} (${activity.type})`);
      });
    }
  });

  // Stop monitoring after 1 hour
  require('node:timers').setTimeout(() => {
    stopMonitoring();
    console.log('⏹️  Stopped monitoring user status');
  }, 3600000);
});

client.login('YOUR_TOKEN_HERE');
