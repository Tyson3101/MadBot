import { ReadyEvent } from "../interfaces/Events";
import { Infringement } from "../interfaces/GuildDataBase";
import { DiscordBot } from "../structures/Client";

export const event: ReadyEvent = {
  event: "ready",
  async run(client) {
    const Mutes = (await client.handleMutes(client)) as Infringement[][];
    client.developers.set("397737988915724310", {
      id: "397737988915724310", // Sets the botdevs user id
      position: 0,
    });

    await client.user.setActivity({
      name: `${DiscordBot.DEFUALT_PREFIX()}help`,
      type: "COMPETING",
    });
    console.log(`-----------------  Ready  ----------------
${client.user.tag} is Ready!
Loggen in with the token ${client.token.slice(0, 34)}${"x".repeat(
      client.token.slice(34).length
    )}
-----------------  Stats  ----------------
Developers: ${client.developers.size}
Guilds: ${client.guilds.cache.size}
Users: ${client.guilds.cache.reduce(
      (arr: number, { memberCount }) => arr + memberCount,
      0
    )}
Commands: ${client.commands.size}
Events: ${client.events.size}
Mutes: ${Mutes.reduce((acc, ele) => acc + ele.length, 0)}
-----------------  Log  ----------------`);

    Mutes.forEach((MuteGuild: Infringement[]) => {
      MuteGuild.forEach((Case: Infringement) => {
        const guild = client.guilds.cache.get(Case.guildID);
        if (guild && Case?.active && Case?.endDate) {
          setTimeout(async () => {
            client.handleEndMute(
              await guild.members.fetch(Case.victim),
              Case.muteRoleID,
              Case.oldRolesID,
              await client.guildDB.get(guild.id),
              Case.caseCount
            );
          }, new Date(Case.endDate).getTime() - Date.now());
        }
      });
    });
  },
};
