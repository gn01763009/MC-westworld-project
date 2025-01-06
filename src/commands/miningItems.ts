import { goals } from "mineflayer-pathfinder";
import { bot, checkStop, useIsStop } from "../MiningBot";
import { findNearestBlock, howManyOfItem } from "./findItems";

// 挖掘方塊
export function mineBlock(block: any) {
  bot.pathfinder.setGoal(
    new goals.GoalNear(block.position.x, block.position.y, block.position.z, 1)
  );

  bot.once("goal_reached", () => {
    bot.dig(block);
  });
}

// 挖掘指定數量的物品
export function mineItems(
  itemName: string,
  quantity: number,
  waitTime: number = 500
) {
  let retryCount = 0;
  let botHadItemCount = howManyOfItem(itemName);

  function mineNext() {
    const botMindItemCount = howManyOfItem(itemName);
    if (checkStop()) {
      useIsStop(true);
      return;
    }
    if (botMindItemCount - botHadItemCount >= quantity) {
      bot.chat(`已挖掘 ${quantity} 個 ${itemName}！`);
      return;
    }

    const block = findNearestBlock(itemName, 1);
    if (block) {
      bot.pathfinder.setGoal(
        new goals.GoalNear(
          block.position.x,
          block.position.y,
          block.position.z,
          1
        )
      );

      bot.once("goal_reached", () => {
        bot
          .dig(block)
          .then(() => {
            retryCount = 0;
            mineNext();
          })
          .catch((err: Error) => {
            console.log("err", err);
            if (err) {
              bot.chat(`挖掘失敗: ${err.message}`);
            } else {
              mineNext();
            }
          })
          .finally(() => {
            bot.chat(`已挖掘 ${howManyOfItem(itemName)} 個 ${itemName}！`);
          });
      });
    } else {
      bot.chat(`找不到 ${itemName}。`);
      if (retryCount >= 3) {
        bot.chat(`放棄挖掘 ${itemName}。`);
        return;
      }
      setTimeout(() => {
        retryCount++;
        mineNext();
      }, waitTime);
    }
  }

  mineNext();
}
