import { goals } from "mineflayer-pathfinder";
import { bot } from "../MiningBot";

export function howManyOfItem(itemName: string): number {
  const items = bot.inventory.items();
  console.log("howManyOfItem items:", items);
  const item = items.find((i) => i.name === itemName);
  return item?.count || 0;
}

// 尋找最近的目標方塊
export function findNearestBlock(blockName: string, maxDistance = 32) {
  const block = bot.findBlock({
    matching: (b) => b.name === blockName,
    maxDistance, // 搜索範圍
  });
  return block;
}

export function findAndGoPlayer(username: string) {
  const player = bot.players[username];
  if (player && player.entity) {
    const target = player.entity;
    bot.pathfinder.setGoal(new goals.GoalFollow(target, 1));
    bot.chat("我來了！");
  } else {
    bot.chat("找不到玩家。");
  }
}
