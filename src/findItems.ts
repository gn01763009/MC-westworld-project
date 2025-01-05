import { bot } from "./MiningBot";

export function howManyOfItem(itemName: string): number {
  console.log("bot", bot);
  const items = bot.inventory.items();
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
