import { Command } from "../../interfaces/Command";
import { GuildMember, MessageEmbed, Message } from "discord.js";
import {
  errorCommandEmbed,
  invaildPermissionsCustom,
  sucessPunishEmbed,
} from "../../structures/embeds";
import { Infringement } from "../../interfaces/GuildDataBase";

export const command: Command = {
  name: "ban",
  description: "Bans a member from the server.",
  example: ["ban @Tyson Dm Advertising", "ban 53636233242246347"],
  guildOnly: true,
  args: [
    {
      name: "Member",
      required: true,
    },
    {
      name: "Reason",
      required: false,
    },
  ],
  permission: ["BAN_MEMBERS", true],
  async run(client, message) {
    let member: GuildMember = await message.getMember(message.args[0]?.value);
    if (!member) return;
    if (member.id === message.guild.ownerID)
      return message.say({
        embed: invaildPermissionsCustom(
          client,
          message.author,
          `I can't perform this action on this member.`
        ),
      });
    if (member.id === client.user.id)
      return message.say({
        embed: invaildPermissionsCustom(
          client,
          message.author,
          `I can't perform this action on this member.`
        ),
      });
    if (message.member.id !== message.guild.ownerID) {
      if (
        !message.compareRolePostion(
          message.member.roles.highest,
          member.roles.highest
        )
      )
        return;
    }
    if (
      !member.bannable ||
      !message.compareRolePostion(
        message.guild.me.roles.highest,
        member.roles.highest,
        true
      )
    )
      return message.say({
        embed: invaildPermissionsCustom(
          client,
          message.author,
          `I can't perform this action on this member.`
        ),
      });
    let reason = "No reason provided.";
    if (message.args[1].value)
      reason = message.args
        .map((x) => x.raw)
        .slice(1)
        .join(" ");
    let typeCaseCount = client.getTypeCaseCount("BAN", message.guild.DB) + 1;
    let caseCount = ++message.guild.DB.moderation.caseCount;
    let backUpDB = { ...message.guild.DB };
    const moderationDB: Infringement = {
      guildID: message.guild.id,
      victim: member.id,
      moderator: message.author.id,
      reason: reason,
      typeCaseCount: typeCaseCount,
      caseCount: caseCount,
      startDate: new Date(),
      infringementType: "BAN",
    };

    message.guild.DB.moderation.bans[member.id]
      ? message.guild.DB.moderation.bans[member.id].push(moderationDB)
      : (message.guild.DB.moderation.bans[member.id] = [moderationDB]);
    message.guild.DB.moderation.all[member.id]
      ? message.guild.DB.moderation.all[member.id].push(moderationDB)
      : (message.guild.DB.moderation.all[member.id] = [moderationDB]);
    await client.guildDB.set(message.guild.id, { ...message.guild.DB });
    member
      .send({
        embed: new MessageEmbed({
          author: {
            name: member.user.tag,
            iconURL: member.user.displayAvatarURL({
              format: "png",
              dynamic: true,
            }),
          },
          color: "DARK_VIVID_PINK",
          thumbnail: {
            url:
              message.guild.iconURL({ format: "png", dynamic: true }) ||
              client.user.displayAvatarURL({ format: "png" }),
          },
          title: `Banned from ${message.guild.name}`,
          description: `You have been banned from ${message.guild.name} for "${reason}".\nYou were banned by ${message.author.tag}.`,
          footer: {
            text: `${client.user.username} ©`,
            iconURL: client.user.displayAvatarURL({ format: "png" }),
          },
        }),
      })
      .catch((e) => e);
    try {
      await member.ban({ reason: reason });
      await message.say({
        embed: sucessPunishEmbed(client, member.user, <Message>message, {
          title: "Banned!",
          reason: reason,
          casenumber: caseCount,
        }),
      });
    } catch (e) {
      console.log(e);
      message.say({
        embed: errorCommandEmbed(client, message.author, null),
      });
      await client.guildDB.set(message.guild.id, backUpDB);
    }
  },
};
