const mineflayer = require('mineflayer');

// Server configuration
const SERVER_HOST = 'mc.auva.dev';
const SERVER_PORT = 12345;

// Bot configurations - 3 bots with Minecraft-style names
const botConfigs = [
    { username: 'DragonSlayer77' },
    { username: 'ShadowNinjaXD' },
    { username: 'EnderLegend99' }
];

// Store active bots
const activeBots = [];

// Random movement function
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

// Create a bot
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
        // Reconnect after 30 seconds
        setTimeout(() => {
            console.log(`[${config.username}] Attempting to reconnect...`);
            createBot(config, index);
        }, 30000);
    });

    bot.on('end', () => {
        console.log(`[${config.username}] ✗ Disconnected`);
        // Reconnect after 30 seconds
        setTimeout(() => {
            console.log(`[${config.username}] Attempting to reconnect...`);
            createBot(config, index);
        }, 30000);
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        console.log(`[${config.username}] Chat: <${username}> ${message}`);
    });

    activeBots[index] = bot;
    return bot;
}

// Start all bots with delay between each
console.log('='.repeat(50));
console.log('Starting Minecraft Anti-AFK Bots');
console.log(`Server: ${SERVER_HOST}:${SERVER_PORT}`);
console.log(`Number of bots: ${botConfigs.length}`);
console.log('='.repeat(50));

botConfigs.forEach((config, index) => {
    // Delay each bot connection by 5 seconds to avoid rate limiting
    setTimeout(() => {
        createBot(config, index);
    }, index * 5000);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down bots...');
    activeBots.forEach(bot => {
        if (bot) bot.quit();
    });
    process.exit();
});
