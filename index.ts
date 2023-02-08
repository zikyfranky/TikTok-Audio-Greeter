import "dotenv/config";
import * as pluralize from "pluralize";
import * as say from "say";
import { WebcastPushConnection } from "tiktok-live-connector";
import { ChatData, Common, GiftData, LikeData, State, ViewData } from "./types";

const MessageEvents = {
  CHAT: "chat",
  MEMBER: "member",
  GIFT: "gift",
  ROOMUSER: "roomUser",
  SOCIAL: "social",
  LIKE: "like",
  SUBSCRIBE: "subscribe",
  FOLLOW: "follow",
  SHARE: "share",
};

let tiktokUsername = "zikyfranky";

let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername, {
  sessionId: process.env.SESSION_ID,
});

const main = async () => {
  let lastBroadcast = Date.now();

  const speak = (text: string) => {
    say.stop();
    say.speak(text, "", 1.5);
  };
  try {
    const state: State = await tiktokLiveConnection.connect();
    console.info(`Connected to roomId ${state.roomId}`);
  } catch (error: any) {
    console.error("Failed to connect");
  }

  tiktokLiveConnection.on(MessageEvents.GIFT, (data: GiftData) => {
    if (data.repeatEnd) {
      const { uniqueId, repeatCount, giftName, diamondCount } = data;
      speak(
        `${uniqueId ? uniqueId : "unknown"}, Thanks sooo much for the ${
          repeatCount > 1 ? pluralize(giftName) : giftName
        } worth ${diamondCount * repeatCount} ${
          repeatCount > 1 ? "Diamonds!" : "Diamond"
        })`
      );
    }
  });

  tiktokLiveConnection.on(MessageEvents.LIKE, (data: LikeData) => {
    const { uniqueId, likeCount } = data;
    speak(
      `${uniqueId ? uniqueId : "unknown"}, Thanks sooo much for the like${
        likeCount > 1 ? "s" : ""
      } `
    );
  });

  tiktokLiveConnection.on(MessageEvents.ROOMUSER, async (data: ViewData) => {
    const now = Date.now();
    const mins = (((now - lastBroadcast) % 86400000) % 3600000) / 60000;

    if (mins >= 1) {
      const { topViewers, viewerCount } = data;
      const lines = topViewers
        .filter((viewer) => viewer.coinCount > 0)
        .map((viewer) => {
          return `${viewer.user.uniqueId} with ${viewer.coinCount} diamond${
            viewer.coinCount > 1 ? "s" : ""
          }`;
        });
      speak(
        `Shoutout to my awesome gifters!!!\n\n${lines.join(
          "\n"
        )}\n\nAnd thanks to my awsome ${viewerCount} view${
          viewerCount > 1 ? "ers" : ""
        }`
      );
      const msg = `================================================================\n\t\t\t\t\t\t\t\t🇹​​​​​🇴​​​​​🇵​​​​​ 🇻​​​​​🇮​​​​​🇪​​​​​🇼​​​​​🇪​​​​​🇷​​​​​🇸​​​​​\t\t\t\t\t\t\t\t\n================================================================
      ${data.topViewers
        .filter((viewer) => viewer.coinCount > 0)
        .map(
          (viewer, index) =>
            `No. ${index + 1}\t\t@${viewer.user.uniqueId}\t\t\t#${
              viewer.coinCount
            }`
        )}\n\nThere are ${data.viewerCount} person(s) currently watching`;

      console.log(msg);
      lastBroadcast = Date.now();
    }
  });

  tiktokLiveConnection.on(MessageEvents.MEMBER, (data: Common) => {
    const { uniqueId } = data;
    speak(`${uniqueId ? uniqueId : "unknown"}!! Thanks for joining the LIVE!`);
  });

  tiktokLiveConnection.on(MessageEvents.CHAT, (data: ChatData) => {
    const { uniqueId, comment } = data;
    // speak(`${uniqueId?uniqueId:"unknown"}: ${comment}`);
    console.log(`${uniqueId ? uniqueId : "unknown"}: ${comment}`);
  });

  tiktokLiveConnection.on(MessageEvents.FOLLOW, (data: Common) => {
    const { uniqueId } = data;
    speak(
      `${
        uniqueId ? uniqueId : "unknown"
      }!! You are Awesome!!, Thanks for the follow!`
    );
  });

  tiktokLiveConnection.on(MessageEvents.SHARE, (data: Common) => {
    const { uniqueId } = data;
    speak(
      `${uniqueId ? uniqueId : "unknown"}!! Thanks for the sharing the LIVE`
    );
  });

  tiktokLiveConnection.on(MessageEvents.SUBSCRIBE, (data: Common) => {
    const { uniqueId } = data;
    speak(
      `${uniqueId ? uniqueId : "unknown"}!! OH! MY! GOD!, ${
        data.uniqueId
      }. Thanks for SUBSCRIBING!!`
    );
  });
};

main();
