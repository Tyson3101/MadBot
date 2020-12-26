import { Message, MessageEmbed, Util as DiscordUtil } from "discord.js";
import { commandInterFace } from "../../interfaces/Command";
import hastebin from "hastebin";

async function sendEvaledMessage(
  message: Message,
  timeTook: number[],
  toDisplay: string[],
  evaled: string,
  showBin: string
): Promise<Message | Message[]> {
  const { client } = message;
  let evaledHasteBin: string;
  try {
    if (showBin) {
      evaledHasteBin = await hastebin.createPaste(showBin, {
        raw: false,
        contentType: true,
        server: "https://hastebin.com",
      });
    }
  } catch (e) {
    console.log("Bin fail!", e);
  }
  let evaledEmbed = new MessageEmbed({
    author: {
      name: message.author.tag,
      iconURL: message.author.displayAvatarURL({
        format: "png",
        dynamic: true,
      }),
    },
    color: "DARK_VIVID_PINK",
    title: "Evaled Code",
    description: `**Evaled! Took ${timeTook[0] > 0 ? `${timeTook[0]}s` : ""}${
      timeTook[1] / 1e6
    }ms**\n\n**Output**\n${
      evaled.length < 2000
        ? `\`\`\`js\n${DiscordUtil.escapeMarkdown(evaled.slice(0, 2000), {
            underline: false,
            bold: false,
            italic: false,
            inlineCode: false,
          })}\`\`\`\n${evaledHasteBin ? `**${evaledHasteBin}**` : ""}`
        : evaledHasteBin
        ? evaledHasteBin
        : "No Output."
    }\n`,
    fields: [
      {
        name: "Input",
        value: `\`\`\`js\n${DiscordUtil.escapeMarkdown(
          toDisplay
            .map((str, i) => {
              if (i === toDisplay.length - 1)
                return `${str.trim().replace(/return/g, "")}`;
              else return `${str}`;
            })
            .join("\n")
            .trim(),
          { underline: false, bold: false, italic: false, inlineCode: false }
        )}\n\`\`\``,
      },
    ],

    footer: {
      text: `${client.user.username} ©`,
      iconURL: client.user.displayAvatarURL({ format: "png" }),
    },
  });
  try {
    let msg: Message = await message.channel.send(evaledEmbed);
    return msg;
  } catch (e) {
    console.log(e);
  }
}

export const command: commandInterFace = {
  name: "eval",
  aliases: ["code"],
  args: [
    {
      name: "Code To Eval",
      type: "Code",
      required: true,
    },
  ],
  devOnly: true,
  async run(client, message) {
    let toEvalFull = message.plainArgs.join(" ").replace(/```(js)?/g, "");
    let toEval: string;
    let evaled: string;
    let toEvaledSpilt: string[];
    try {
      const startTime = process.hrtime();
      toEvaledSpilt = toEvalFull.split(/\n/g);
      let filterd = toEvaledSpilt.filter((str) => str.length);
      toEval = client.getToEval(filterd);
      let aboutToEval = `(async () => {\nconst Discord = require('discord.js');\nconst { MessageEmbed, MessageAttachment } = require('discord.js');\n${toEval}\n})()`;
      evaled = await eval(aboutToEval);
      const timeTook = process.hrtime(startTime);
      let evaledMassed: string;
      if (typeof evaled !== "string") {
        evaledMassed = (await import("util")).inspect(evaled);
        evaled = (await import("util")).inspect(evaled, {
          depth: 0,
        });
      } else {
        evaled = `"${evaled}"`;
      }
      if (evaled && !message.argsUtil.flag("i")) {
        await sendEvaledMessage(
          <Message>message,
          timeTook,
          toEvaledSpilt,
          evaled,
          evaledMassed
        );
      }
    } catch (e) {
      message.say(
        new MessageEmbed({
          author: {
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL({
              format: "png",
              dynamic: true,
            }),
          },
          color: "DARK_VIVID_PINK",
          title: "Evaled Code",
          fields: [
            {
              name: "Input",
              value: `\`\`\`js\n${DiscordUtil.escapeMarkdown(
                toEvaledSpilt
                  .map((str, i) => {
                    if (i === toEvaledSpilt.length - 1)
                      return `${str.trim().replace(/return/g, "")}`;
                    else return `${str}`.trim();
                  })
                  .join("\n")
                  .trim(),
                {
                  underline: false,
                  bold: false,
                  italic: false,
                  inlineCode: false,
                }
              )}\n\`\`\``,
            },
            {
              name: "Output",
              value: `\`\`\`js\n${e}\n\`\`\``,
            },
          ],
          footer: {
            text: `${client.user.username} ©`,
            iconURL: client.user.displayAvatarURL({ format: "png" }),
          },
        })
      );
    }
  },
};
