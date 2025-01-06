import { bot } from "../MiningBot";
import { Item } from "prismarine-item";

export async function tossItem(item: Item, quantity: number) {
  // 確認數量是否足夠
  if (item.count < quantity) {
    bot.chat(`我只有 ${item.count} 個 ${item.name}，無法提供 ${quantity} 個。`);
    return;
  }

  try {
    await bot.toss(item.type, null, quantity);
    bot.chat(`已成功將 ${quantity} 個 ${item.name}！`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      bot.chat(`無法丟出物品: ${err.message}`);
    } else {
      bot.chat(`無法丟出物品: 未知錯誤`);
    }
  }
}
