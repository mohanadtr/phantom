require('dotenv').config();
const mineflayer = require('mineflayer');

// ─── Configuration ──────────────────────────────────────────────────────────────
const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10) || 25565;
const RECONNECT_DELAY = parseInt(process.env.RECONNECT_DELAY, 10) || 30000;
const CONNECTION_DELAY = parseInt(process.env.CONNECTION_DELAY, 10) || 5000;

// Bot usernames - configurable via .env (comma-separated) or defaults
const BOT_USERNAMES = process.env.BOT_USERNAMES
    ? process.env.BOT_USERNAMES.split(',').map(u => u.trim())
    : ['DragonSlayer77', 'ShadowNinjaXD', 'EnderLegend99'];

const botConfigs = BOT_USERNAMES.map(username => ({ username }));

// ─── Active Bots ────────────────────────────────────────────────────────────────
const activeBots = [];

// ─── Random Movement ────────────────────────────────────────────────────────────
function startRandomMovement(bot) {
    const movements = ['forward', 'back', 'left', 'right'];

    setInterval(() => {
        // Random jump (30% chance)
        if (Math.random() < 0.3) {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 300);
        }
    }, 2000);

    setInterval(() => {
        // Stop all movements first
        movements.forEach(move => bot.setControlState(move, false));

        // Pick random movement
        const randomMove = movements[Math.floor(Math.random() * movements.length)];
        bot.setControlState(randomMove, true);

        // Random duration between 500ms and 2000ms
        const duration = Math.floor(Math.random() * 1500) + 500;

        setTimeout(() => {
            bot.setControlState(randomMove, false);
        }, duration);
    }, 3000);

    // Random looking around
    setInterval(() => {
        const yaw = (Math.random() - 0.5) * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI * 0.5;
        bot.look(yaw, pitch, false);
    }, 5000);

    // Sneak occasionally (10% chance every 10 seconds)
    setInterval(() => {
        if (Math.random() < 0.1) {
            bot.setControlState('sneak', true);
            setTimeout(() => bot.setControlState('sneak', false), 2000);
        }
    }, 10000);
}

// ─── Bot Factory ────────────────────────────────────────────────────────────────
function createBot(config, index) {
    console.log(`[${config.username}] Connecting to ${SERVER_HOST}:${SERVER_PORT}...`);

    const bot = mineflayer.createBot({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: config.username,
        version: false, // Auto-detect version
    });

    bot.on('spawn', () => {
        console.log(`[${config.username}] ✓ Spawned successfully!`);
        startRandomMovement(bot);
    });

    bot.on('login', () => {
        console.log(`[${config.username}] ✓ Logged in!`);
    });

    bot.on('error', (err) => {
        console.log(`[${config.username}] ✗ Error: ${err.message}`);
    });

    bot.on('kicked', (reason) => {
        console.log(`[${config.username}] ✗ Kicked: ${reason}`);
        // Reconnect after configured delay
        setTimeout(() => {
            console.log(`[${config.username}] Attempting to reconnect...`);
            createBot(config, index);
        }, RECONNECT_DELAY);
    });

    bot.on('end', () => {
        console.log(`[${config.username}] ✗ Disconnected`);
        // Reconnect after configured delay
        setTimeout(() => {
            console.log(`[${config.username}] Attempting to reconnect...`);
            createBot(config, index);
        }, RECONNECT_DELAY);
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        console.log(`[${config.username}] Chat: <${username}> ${message}`);
    });

    activeBots[index] = bot;
    return bot;
}

// ─── Start ──────────────────────────────────────────────────────────────────────
console.log('='.repeat(50));
console.log('  👻 phantom - Minecraft Anti-AFK Bot');
console.log('='.repeat(50));
console.log(`  Server : ${SERVER_HOST}:${SERVER_PORT}`);
console.log(`  Bots   : ${botConfigs.map(b => b.username).join(', ')}`);
console.log('='.repeat(50));

botConfigs.forEach((config, index) => {
    // Delay each bot connection to avoid rate limiting
    setTimeout(() => {
        createBot(config, index);
    }, index * CONNECTION_DELAY);
});

// ─── Graceful Shutdown ──────────────────────────────────────────────────────────
process.on('SIGINT', () => {
    console.log('\nShutting down bots...');
    activeBots.forEach(bot => {
        if (bot) bot.quit();
    });
    process.exit();
});
