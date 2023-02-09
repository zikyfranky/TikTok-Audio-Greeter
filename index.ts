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

let catSpeakIsOff = {};

let TTKLC = new WebcastPushConnection(tiktokUsername, {
  sessionId: process.env.SESSION_ID,
});

const main = async () => {
  let lastBroadcast = Date.now();

  const speak = (text: string) => {
    say.stop();
    say.speak(text, "", 1.5);
  };
  try {
    const state: State = await TTKLC.connect();
    console.info(`Connected to roomId ${state.roomId}`);
  } catch (error: any) {
    console.error("Failed to connect");
  }

  TTKLC.on(MessageEvents.GIFT, (data: GiftData) => {
    if (data.repeatEnd) {
      const { uniqueId, repeatCount, giftName, diamondCount } = data;
      if (!catSpeakIsOff[MessageEvents.GIFT]) {
        speak(
          `${uniqueId ? uniqueId : "unknown"}, Thanks sooo much for the ${
            repeatCount > 1 ? pluralize(giftName) : giftName
          } worth ${diamondCount * repeatCount} ${
            repeatCount > 1 ? "Diamonds!" : "Diamond"
          })`
        );
      }
    }
  });

  TTKLC.on(MessageEvents.LIKE, (data: LikeData) => {
    const { uniqueId, likeCount } = data;
    if (!catSpeakIsOff[MessageEvents.LIKE]) {
      speak(
        `${uniqueId ? uniqueId : "unknown"}, Thanks sooo much for the like${
          likeCount > 1 ? "s" : ""
        } `
      );
    }
  });

  TTKLC.on(MessageEvents.ROOMUSER, async (data: ViewData) => {
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
      if (!catSpeakIsOff[MessageEvents.ROOMUSER]) {
        speak(
          (topViewers.length > 0
            ? `Shoutout to my awesome gifters!!!\n\n${lines.join(
                "\n"
              )}\n\nAnd t`
            : "T") +
            `hanks to my awsome ${viewerCount} view${
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
    }
  });

  TTKLC.on(MessageEvents.MEMBER, (data: Common) => {
    const { uniqueId } = data;
    if (!catSpeakIsOff[MessageEvents.MEMBER]) {
      speak(
        `${uniqueId ? uniqueId : "unknown"}!! Thanks for joining the LIVE!`
      );
    }
  });

  TTKLC.on(MessageEvents.CHAT, (data: ChatData) => {
    const { uniqueId, comment } = data;
    if (uniqueId == "zikyfranky") {
      // is admin
      const [cat, value] = comment.split(",");
      catSpeakIsOff[cat] = parseInt(value);
      speak(`${cat} audio is ${catSpeakIsOff[cat] ? "off" : "on"}`);
    } else {
      const commentArr = comment.split("say@");
      if (commentArr[0] == "" && !catSpeakIsOff["viewers"]) {
        speak(`${commentArr[1]}`);
      }
    }
    console.log(`${uniqueId ? uniqueId : "unknown"}: ${comment}`);
  });

  TTKLC.on(MessageEvents.FOLLOW, (data: Common) => {
    const { uniqueId } = data;

    if (!catSpeakIsOff[MessageEvents.FOLLOW]) {
      speak(
        `${
          uniqueId ? uniqueId : "unknown"
        }!! You are Awesome!!, Thanks for the follow!`
      );
    }
  });

  TTKLC.on(MessageEvents.SHARE, (data: Common) => {
    const { uniqueId } = data;
    if (!catSpeakIsOff[MessageEvents.SHARE]) {
      speak(`${uniqueId ? uniqueId : "unknown"}!! Thanks for sharing the LIVE`);
    }
  });

  TTKLC.on(MessageEvents.SUBSCRIBE, (data: Common) => {
    const { uniqueId } = data;
    if (!catSpeakIsOff[MessageEvents.SUBSCRIBE]) {
      speak(
        `${uniqueId ? uniqueId : "unknown"}!! OH! MY! GOD!, ${
          data.uniqueId
        }. Thanks for SUBSCRIBING!!`
      );
    }
  });
};

main();
