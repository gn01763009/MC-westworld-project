import { createBot } from "mineflayer";
import { Movements, goals } from "mineflayer-pathfinder";
import { mineItems } from "./miningItems";

var isStop = false;

export const checkStop = () => {
  return isStop;
};

export const useIsStop = (setaVar: boolean): boolean => {
  isStop = setaVar;
  return isStop;
};

// 創建 Bot
export const bot = createBot({
  host: "localhost", // 替換為伺服器地址
  port: 6969, // 替換為伺服器端口
  username: "MiningBot", // Bot 名稱
  auth: "offline", // 設置為 "offline" 以使用離線模式
});

// 加載 Pathfinder 插件
bot.loadPlugin(require("mineflayer-pathfinder").pathfinder);

// 當 Bot 連接到伺服器時觸發
bot.on("spawn", () => {
  console.log("Bot 已連接到伺服器！");

  // 設定移動規則
  const mcData = require("minecraft-data")(bot.version);
  const movements = new Movements(bot);
  bot.pathfinder.setMovements(movements);

  // 開始挖掘
  startListening();
});

// 挖掘指定的方塊
function startListening() {
  bot.on("chat", (username, message) => {
    if (username === bot.username) return;

    const match = message.match(/^mine (\w+) (\d+)(?: (\d+))?$/);
    if (match) {
      const itemName = match[1];
      const quantity = parseInt(match[2], 10);
      const waitTime = match[3] ? parseInt(match[3], 10) : 500; // 默認等待時間為 500 毫秒
      console.log(
        `開始挖掘 ${quantity} 個 ${itemName}！每次等待 ${waitTime} 毫秒。`
      );
      mineItems(itemName, quantity, waitTime);
    }
  });

  // 新增「how many [物品名稱] you have」命令
  bot.on("chat", (username, message) => {
    if (username === bot.username) return;

    const match = message.match(/^how many (\w+) you have$/);
    if (match) {
      const itemName = match[1];
      const itemCount = bot.inventory
        .items()
        .filter((i) => i.name === itemName)
        .reduce((count, item) => count + item.count, 0);
      bot.chat(`我有 ${itemCount} 個 ${itemName}。`);
    }
  });

  bot.on("chat", (username, message) => {
    if (username === bot.username) return;

    if (message === "stop") {
      bot.pathfinder.setGoal(null);
      bot.chat("已停止。");
      isStop = true;
    }
  });

  bot.on("chat", (username, message) => {
    if (username === bot.username) return;

    if (message === "what you got") {
      bot.chat(
        `我有: ${bot.inventory
          .items()
          .map((i) => i.name)
          .join(", ")}`
      );
    }
  });

  // 新增「用 [物品名稱]」命令
  bot.on("chat", (username, message) => {
    if (username === bot.username) return;

    const match = message.match(/^use\s+(\w+)$/);
    if (match) {
      const itemName = match[1];
      const item = bot.inventory.items().find((i) => i.name === itemName);
      if (item) {
        bot
          .equip(item, "hand")
          .then(() => {
            bot.chat(`已裝備 ${itemName} 在右手。`);
          })
          .catch((err: Error) => {
            bot.chat(`無法裝備 ${itemName}: ${err.message}`);
          });
      } else {
        bot.chat(`找不到 ${itemName} 在背包中。`);
      }
    }
  });

  // 新增「過來」命令
  bot.on("chat", (username, message) => {
    if (username === bot.username) return;

    if (message === "come here") {
      const player = bot.players[username];
      if (player && player.entity) {
        const target = player.entity;
        bot.pathfinder.setGoal(new goals.GoalFollow(target, 1));
        bot.chat("我來了！");
      } else {
        bot.chat("找不到玩家。");
      }
    }
  });
}

// 錯誤處理
bot.on("error", (err) => {
  console.error(`發生錯誤: ${err.message}`);
});

bot.on("end", () => {
  console.log("Bot 已斷開連接。");
});
