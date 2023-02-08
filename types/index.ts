// if (webcastObject.questionDetails) {
//   Object.assign(webcastObject, webcastObject.questionDetails);
//   delete webcastObject.questionDetails;
// }

// if (webcastObject.user) {
//   Object.assign(webcastObject, getUserAttributes(webcastObject.user));
//   delete webcastObject.user;
// }

// if (webcastObject.event) {
//   Object.assign(webcastObject, getEventAttributes(webcastObject.event));
//   delete webcastObject.event;
// }

// if (webcastObject.eventDetails) {
//   Object.assign(webcastObject, webcastObject.eventDetails);
//   delete webcastObject.eventDetails;
// }

// if (webcastObject.topViewers) {
//   webcastObject.topViewers = getTopViewerAttributes(webcastObject.topViewers);
// }

// if (webcastObject.battleUsers) {
//   let battleUsers = [];
//   webcastObject.battleUsers.forEach((user) => {
//     if (user?.battleGroup?.user) {
//       battleUsers.push(getUserAttributes(user.battleGroup.user));
//     }
//   });

//   webcastObject.battleUsers = battleUsers;
// }

// if (webcastObject.battleItems) {
//   webcastObject.battleArmies = [];
//   webcastObject.battleItems.forEach((battleItem) => {
//     battleItem.battleGroups.forEach((battleGroup) => {
//       let group = {
//         hostUserId: battleItem.hostUserId.toString(),
//         points: parseInt(battleGroup.points),
//         participants: [],
//       };

//       battleGroup.users.forEach((user) => {
//         group.participants.push(getUserAttributes(user));
//       });

//       webcastObject.battleArmies.push(group);
//     });
//   });

//   delete webcastObject.battleItems;
// }

// if (webcastObject.emote) {
//   webcastObject.emoteId = webcastObject.emote?.emoteId;
//   webcastObject.emoteImageUrl = webcastObject.emote?.image?.imageUrl;
//   delete webcastObject.emote;
// }

// if (webcastObject.treasureBoxUser) {
//   // holy crap
//   Object.assign(
//     webcastObject,
//     getUserAttributes(
//       webcastObject.treasureBoxUser?.user2?.user3[0]?.user4?.user || {}
//     )
//   );
//   delete webcastObject.treasureBoxUser;
// }

// if (webcastObject.treasureBoxData) {
//   Object.assign(webcastObject, webcastObject.treasureBoxData);
//   delete webcastObject.treasureBoxData;
//   webcastObject.timestamp = parseInt(webcastObject.timestamp);
// }

// return Object.assign({}, webcastObject);

export interface Common {
  userId: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  topGifterRank?: number;
  userBadges: UserBadge[];
  followInfo: UserFollowInfo;
  isModerator: boolean;
  isNewGifter: boolean;
  isSubscriber: boolean;
  msgId: string;
  createTime: string;
  displayType: string;
  label: string;
}
export interface UserBadge {
  badgeSceneType: number;
  type: string;
  url?: string;
  displayType?: number;
}
export interface UserFollowInfo {
  followingCount: number;
  followerCount: number;
  followStatus: number;
  pushStatus: number;
}
export interface UserFollowInfoLowerCase {
  following_count: number;
  follower_count: number;
  follow_status: number;
  push_status: number;
}
export interface Gift {
  gift_id: number;
  repeat_count: number;
  repeat_end: number;
  gift_type: number;
}
export interface GiftData extends Common {
  giftId: number;
  repeatCount: number;
  repeatEnd?: boolean;
  groupId: string;
  gift: Gift;
  describe: string;
  giftType: number;
  diamondCount: number;
  giftName: string;
  giftPictureUrl: string;
  timestamp: number;
  receiverUserId: string;
}
export interface LikeData extends Common {
  likeCount: number;
  totalLikeCount: number;
}
export interface Viewer {
  user: Common;
  coinCount: number;
}
export interface ViewData {
  topViewers: Viewer[];
  viewerCount: number;
}
export interface User {
  bio_description: string;
  display_id: string;
  follow_info: UserFollowInfo | UserFollowInfoLowerCase;
  is_follower: boolean;
  is_following: boolean;
  nickname: string;
  verified: boolean;
}
export interface Fan {
  fan_ticket: number;
  user: User;
}
export interface RoomInfo {
  share_url: string;
  title: string;
  top_fans: Fan[];
  use_filter: boolean;
  user_count: number;
}
export interface State {
  isConnected: boolean;
  upgradedToWebsocket: boolean;
  roomId: string;
  roomInfo: RoomInfo;
  availableGifts: undefined;
}
export interface ChatData extends Common {
  comment: string;
}
