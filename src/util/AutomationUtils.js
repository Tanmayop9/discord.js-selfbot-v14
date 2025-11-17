'use strict';

/**
 * Advanced Automation Utilities for discord.js-selfbot-v14
 *
 * Provides utility functions for:
 * - Message automation
 * - Presence management
 * - Advanced user interactions
 * - Rate limiting and queue management
 */

class AutomationUtils {
  /**
   * Create a typing simulator with random delays
   * @param {TextChannel} channel - Channel to type in
   * @param {number} duration - How long to type (ms)
   * @returns {Promise<void>}
   */
  static async simulateTyping(channel, duration = 3000) {
    const startTime = Date.now();
    while (Date.now() - startTime < duration) {
      await channel.sendTyping();
      await this.sleep(Math.random() * 5000 + 5000); // 5-10 seconds
    }
  }

  /**
   * Smart delay with jitter to avoid detection
   * @param {number} baseMs - Base delay in milliseconds
   * @param {number} jitter - Jitter percentage (0-1)
   * @returns {Promise<void>}
   */
  static async smartDelay(baseMs, jitter = 0.2) {
    const jitterMs = baseMs * jitter * (Math.random() * 2 - 1);
    const totalMs = baseMs + jitterMs;
    await this.sleep(totalMs);
  }

  /**
   * Sleep for specified milliseconds
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  static sleep(ms) {
    return new Promise(resolve => require('node:timers').setTimeout(resolve, ms));
  }

  /**
   * Rate limiter for actions
   * @param {number} maxActions - Maximum actions allowed
   * @param {number} timeWindowMs - Time window in milliseconds
   * @returns {Function} Rate limited executor function
   */
  static createRateLimiter(maxActions, timeWindowMs) {
    const queue = [];

    return async function execute(action) {
      const now = Date.now();
      const validActions = queue.filter(time => now - time < timeWindowMs);

      if (validActions.length >= maxActions) {
        const oldestAction = Math.min(...validActions);
        const waitTime = timeWindowMs - (now - oldestAction);
        await AutomationUtils.sleep(waitTime);
      }

      queue.push(Date.now());
      while (queue.length > maxActions) queue.shift();

      return action();
    };
  }

  /**
   * Advanced message queue with priority
   * @returns {Object} Message queue object
   */
  static createMessageQueue() {
    const queue = [];
    let processing = false;

    return {
      add(message, channel, priority = 0) {
        queue.push({ message, channel, priority, timestamp: Date.now() });
        queue.sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp);
      },

      async process(delayMs = 1000) {
        if (processing) return;
        processing = true;

        while (queue.length > 0) {
          const item = queue.shift();
          try {
            await item.channel.send(item.message);
            await AutomationUtils.smartDelay(delayMs);
          } catch (error) {
            console.error('Failed to send message:', error);
          }
        }

        processing = false;
      },

      clear() {
        queue.length = 0;
      },

      size() {
        return queue.length;
      },
    };
  }

  /**
   * Cycle through multiple presences
   * @param {Client} client - Discord client
   * @param {Array} presences - Array of presence objects
   * @param {number} intervalMs - Interval between changes
   * @returns {Function} Stop function
   */
  static cyclePresences(client, presences, intervalMs = 60000) {
    let index = 0;
    const interval = require('node:timers').setInterval(() => {
      client.user.setPresence(presences[index]);
      index = (index + 1) % presences.length;
    }, intervalMs);

    return () => require('node:timers').clearInterval(interval);
  }

  /**
   * Auto-responder with pattern matching
   * @param {Client} client - Discord client
   * @param {Object} patterns - Pattern-response pairs
   * @returns {Function} Stop function
   */
  static createAutoResponder(client, patterns) {
    const handler = async message => {
      if (message.author.id === client.user.id) return;

      for (const [pattern, response] of Object.entries(patterns)) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(message.content)) {
          await AutomationUtils.smartDelay(1000, 0.3);
          await message.channel.send(typeof response === 'function' ? response(message) : response);
          break;
        }
      }
    };

    client.on('messageCreate', handler);
    return () => client.off('messageCreate', handler);
  }

  /**
   * Batch user fetcher with rate limiting
   * @param {Client} client - Discord client
   * @param {Array<string>} userIds - Array of user IDs
   * @param {number} batchSize - Batch size
   * @returns {Promise<Array>} Array of users
   */
  static async fetchUsersBatch(client, userIds, batchSize = 5) {
    const users = [];
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      const batchUsers = await Promise.all(
        batch.map(id =>
          client.users.fetch(id).catch(err => {
            console.error(`Failed to fetch user ${id}:`, err.message);
            return null;
          }),
        ),
      );
      users.push(...batchUsers.filter(u => u !== null));
      await AutomationUtils.smartDelay(1000);
    }
    return users;
  }

  /**
   * Monitor user status changes
   * @param {Client} client - Discord client
   * @param {string} userId - User ID to monitor
   * @param {Function} callback - Callback function
   * @returns {Function} Stop function
   */
  static monitorUserStatus(client, userId, callback) {
    const handler = (oldPresence, newPresence) => {
      if (newPresence.userId === userId) {
        const statusData = {
          status: newPresence.status,
          activities: newPresence.activities,
          clientStatus: newPresence.clientStatus,
        };
        return callback(statusData);
      }
      return null;
    };

    client.on('presenceUpdate', handler);
    return () => client.off('presenceUpdate', handler);
  }

  /**
   * Advanced message collector with filters
   * @param {TextChannel} channel - Channel to collect from
   * @param {Object} options - Collection options
   * @returns {Promise<Collection>} Collected messages
   */
  static async collectMessages(channel, options = {}) {
    const { filter = () => true, max = 10, time = 60000, errors = ['time'] } = options;

    return channel.awaitMessages({
      filter,
      max,
      time,
      errors,
    });
  }

  /**
   * Spam detector for messages
   * @param {number} threshold - Messages per second threshold
   * @returns {Function} Check function
   */
  static createSpamDetector(threshold = 5) {
    const messageTimestamps = new Map();

    return userId => {
      const now = Date.now();
      const timestamps = messageTimestamps.get(userId) || [];
      const recentTimestamps = timestamps.filter(t => now - t < 1000);

      recentTimestamps.push(now);
      messageTimestamps.set(userId, recentTimestamps);

      return recentTimestamps.length > threshold;
    };
  }
}

module.exports = AutomationUtils;
