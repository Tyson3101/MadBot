import { commandInterFace } from "../../interfaces/Command";
import { guildDataBase } from "../../structures/DataBase";
import { GuildDataBaseInterface } from "../../interfaces/GuildDataBase";
import { getGuildDB } from "../../functions/GetGuildDB";
import { prefixEmbed } from "../../structures/Embeds"; // Import Syntax

export const command: commandInterFace = {
  name: "prefix",
  description: "Gets or changes prefix for a server",
  usage: ["prefix (prefix)"],
  example: ["prefix ?", "prefix Orange"],
  args: [
    {
      name: "Prefix",
      type: ["Prefix"],
      description: "Prefix to change.",
      example: ["$", "z!"],
      required: false,
      order: 1,
    },
  ],
  aliases: [],
  guildOnly: true,
  devOnly: false,
  permission: "MANAGE_GUILD",
  async run(client, message, args) {
    let guildDB = await getGuildDB(client, message.guild, guildDataBase);
    const [, prefix, ..._] = message.content
      .trim()
      .slice(guildDB.prefix.length)
      .split(/ +/g);
    if (prefix) {
      guildDB.prefix = prefix;
      let newDBGUILD: GuildDataBaseInterface = {
        ...guildDB,
      };
      await guildDataBase.set(message.guild.id, newDBGUILD);
      message.channel.send({
        embed: prefixEmbed(
          client,
          message.member,
          await getGuildDB(client, message.guild, guildDataBase),
          guildDB.prefix
        ),
      });
    } else {
      message.channel.send({
        embed: prefixEmbed(
          client,
          message.member,
          await getGuildDB(client, message.guild, guildDataBase)
        ),
      });
    }
  },
};
