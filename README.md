# 👻 phantom

A stealthy [Mineflayer](https://github.com/PrismarineJS/mineflayer) bot that haunts your Minecraft server - simulating human-like movement to prevent AFK kicks.

> Named after the Minecraft mob that punishes AFK players. Fight fire with fire.

---

## ✨ Features

- **Human-like movement** - random walking, jumping, sneaking, and head rotation
- **Multi-bot support** - run multiple bots simultaneously with staggered connections
- **Auto-reconnect** - automatically reconnects after being kicked or disconnected
- **Fully configurable** - server address, bot names, and timings via a single `.env` file
- **Version auto-detect** - works with any Minecraft server version supported by Mineflayer
- **Graceful shutdown** - cleanly disconnects all bots on `Ctrl + C`

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- A Minecraft server (offline / cracked mode for username-only auth)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mohanadtr/minecraft-bot.git
cd minecraft-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure

Copy the example environment file and edit it with your server details:

```bash
cp .env.example .env
```

Open `.env` and set your values:

```env
SERVER_HOST=your.server.ip
SERVER_PORT=25565
BOT_USERNAMES=Steve,Alex,Notch
```

### 4. Run

```bash
npm start
```

You should see output like:

```
==================================================
  👻 phantom - Minecraft Anti-AFK Bot
==================================================
  Server : your.server.ip:25565
  Bots   : Steve, Alex, Notch
==================================================
[Steve] Connecting to your.server.ip:25565...
[Steve] ✓ Logged in!
[Steve] ✓ Spawned successfully!
```

---

## ⚙️ Configuration

All configuration is handled through environment variables (`.env` file):

| Variable           | Default                                      | Description                            |
| ------------------ | -------------------------------------------- | -------------------------------------- |
| `SERVER_HOST`      | `localhost`                                  | Minecraft server address               |
| `SERVER_PORT`      | `25565`                                      | Minecraft server port                  |
| `BOT_USERNAMES`    | `DragonSlayer77,ShadowNinjaXD,EnderLegend99` | Comma-separated bot usernames          |
| `RECONNECT_DELAY`  | `30000`                                      | Delay before reconnecting (ms)         |
| `CONNECTION_DELAY` | `5000`                                       | Delay between each bot connection (ms) |

---

## 🤖 How It Works

Each bot performs a cycle of randomized actions to mimic a real player:

| Action          | Frequency | Details                                |
| --------------- | --------- | -------------------------------------- |
| **Walk**        | Every 3s  | Moves in a random direction for 0.5–2s |
| **Jump**        | Every 2s  | 30% chance to jump                     |
| **Look around** | Every 5s  | Rotates head to a random angle         |
| **Sneak**       | Every 10s | 10% chance to sneak for 2s             |

If a bot is kicked or disconnected, it waits for `RECONNECT_DELAY` ms and then reconnects automatically.

---

## 📁 Project Structure

```
phantom/
├── index.js          # Main bot logic
├── .env.example      # Environment variable template
├── .gitignore
├── package.json
├── LICENSE           # MIT License
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## ⚠️ Disclaimer

This tool is intended for personal use on servers you own or have permission to use bots on. Always respect server rules and terms of service. The authors are not responsible for any misuse.
