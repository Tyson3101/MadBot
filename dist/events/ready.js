"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
exports.event = {
    event: "ready",
    async run(client) {
        let botDev = await client.users.fetch("397737988915724310");
        client.developers.set(botDev.id, {
            User: botDev,
            position: 0,
        });
        let collection = new discord_js_1.Collection([
            [1, "2"],
            [2, "3"],
        ]);
        console.log(collection);
        console.log(`-----------------  Ready  ----------------
${client.user.tag} is Ready!
-----------------  Stats  ----------------
Developers: ${client.developers.size}
Guilds: ${client.guilds.cache.size}
Users: ${client.guilds.cache.reduce((arr, { memberCount }) => arr + memberCount, 0)}
Commands: ${client.commands.size}
Events: ${client.events.size}
-----------------  Log  ----------------`);
    },
};
