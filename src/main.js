"use strict";
exports.__esModule = true;
var mineflayer_1 = require("mineflayer");
var MiningBot_1 = require("./MiningBot");
var bot = mineflayer_1["default"].createBot({
    host: "localhost",
    username: "MiningYoOwnBizzNizz",
    auth: "offline",
    port: 6969
});
var miningBot = new MiningBot_1["default"](bot);
miningBot.run()["catch"](console.error);
bot.on("chat", function (username, message) {
    if (username === bot.username)
        return;
    bot.chat(message);
});
// Log errors and kick reasons:
bot.on("kicked", console.log);
bot.on("error", console.log);
