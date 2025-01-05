import mineflayer from "mineflayer";
import MiningBot from "./MiningBot";

const bot = mineflayer.createBot({
  host: "localhost", // minecraft server ip
  username: "MiningYoOwnBizzNizz", // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: "offline", // for offline mode servers, you can set this to 'offline'
  port: 6969, // set if you need a port that isn't 25565
  // version: false,           // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
  // password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
});

const miningBot = new MiningBot(bot);
miningBot.run().catch(console.error);

bot.on("chat", (username, message) => {
  if (username === bot.username) return;
  bot.chat(message);
});

// Log errors and kick reasons:
bot.on("kicked", console.log);
bot.on("error", console.log);
