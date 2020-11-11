import { Collection, Snowflake, User } from "discord.js";

export type infringementType =
  | "BAN"
  | "KICK"
  | "WARN"
  | "MUTE"
  | "UNBAN"
  | "UNMUTE";

export interface ModerationUser {
  id: string;
  username: string;
  tag: string;
}
export interface infringementInterface {
  victim: ModerationUser;
  moderator: ModerationUser;
  reason: string;
  typeCaseCount: number;
  caseCount: number;
  infringementType: infringementType;
  endDate?: Date;
}

export interface moderationInterface {
  bans: { [key: string]: infringementInterface[] };
  kicks: { [key: string]: infringementInterface[] };
  warns: { [key: string]: infringementInterface[] };
  mutes: { [key: string]: infringementInterface[] };
  all: { [key: string]: infringementInterface[] };
  unbans: { [key: string]: infringementInterface[] };
  unmutes: { [key: string]: infringementInterface[] };
  caseCount: number;

  activeCases: number;
  logChannel: string;
}

export interface GuildDataBaseInterface {
  name: string;
  id: string;
  ownerID: string;
  memberCount: number;
  prefix: string;
  moderation: moderationInterface;
}
// Setup for GuildDataBase, like Mongoose Schemas (...lol)
