"use strict";
exports.__esModule = true;
var mineflayer_1 = require("mineflayer");
var mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
// 創建 Bot
var bot = (0, mineflayer_1.createBot)({
    host: "localhost",
    port: 6969,
    username: "MiningBot"
});
// 加載 Pathfinder 插件
bot.loadPlugin(require("mineflayer-pathfinder").pathfinder);
// 當 Bot 連接到伺服器時觸發
bot.on("spawn", function () {
    console.log("Bot 已連接到伺服器！");
    // 設定移動規則
    var mcData = require("minecraft-data")(bot.version);
    var movements = new mineflayer_pathfinder_1.Movements(bot);
    bot.pathfinder.setMovements(movements);
    // 開始挖掘
    startMining();
});
// 挖掘指定的方塊
function startMining() {
    var targetBlockName = "stone"; // 替換為你想挖掘的方塊名稱
    bot.on("chat", function (username, message) {
        if (username === bot.username)
            return;
        if (message === "mine") {
            console.log("\u958B\u59CB\u5C0B\u627E\u4E26\u6316\u6398 ".concat(targetBlockName, "\uFF01"));
            var block = findNearestBlock(targetBlockName);
            if (block) {
                mineBlock(block);
            }
            else {
                bot.chat("\u627E\u4E0D\u5230 ".concat(targetBlockName, "\u3002"));
            }
        }
    });
}
// 尋找最近的目標方塊
function findNearestBlock(blockName) {
    var block = bot.findBlock({
        matching: function (b) { return b.name === blockName; },
        maxDistance: 32
    });
    return block;
}
// 挖掘方塊
function mineBlock(block) {
    bot.pathfinder.setGoal(new mineflayer_pathfinder_1.goals.GoalNear(block.position.x, block.position.y, block.position.z, 1));
    bot.once("goal_reached", function () {
        bot.dig(block);
    });
}
// 錯誤處理
bot.on("error", function (err) {
    console.error("\u767C\u751F\u932F\u8AA4: ".concat(err.message));
});
bot.on("end", function () {
    console.log("Bot 已斷開連接。");
});
