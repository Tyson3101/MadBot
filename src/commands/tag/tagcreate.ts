import { commandInterFace } from "../../interfaces/Command";
import { guildDataBase } from "../../structures/DataBase";

export const command: commandInterFace = {
  name: "tagcreate",
  description: `Creates a tag`,
  note: 'This command allows random responses. Wrap each response with " "',
  usage: [
    "tagcreate [TagName] [First Text to Reply Back With] (2nd Reply) (3rd Reply) (...)",
  ],
  example: [
    "tagcreate 5+5 it equals 6",
    `tagcreate "new rules" Check the #rules here`,
    `tagcreate joke "9+10" "21" "19"`,
  ],
  args: [
    {
      name: "TagName",
      type: "Text",
      example: [`"Are Cats Dangerous?"`, `new rules`, `joke`],
      required: true,
      length: "any",
    },
    {
      name: "Text to Reply Back With",
      type: "Text",
      example: [
        "Yes, Cats are dangerous",
        "Check the #rules here",
        '"21" "19"',
      ],
      length: "any",
      note: 'This command allows random responses. Wrap each response with " "',
      required: true,
    },
  ],
  async run(
    client,
    {
      argsUtil: {
        parserOutput: { flags, options },
        flag,
        option,
      },
      args,
      ...message
    }
  ) {
    const replies: string[] = [];
    for (let i = 1; i < args.length; i++) {
      if (args[i].raw.startsWith('"')) {
        replies.push(args[i].value);
      } else {
        replies.push(
          args
            .slice(i)
            .map((x) => x.raw)
            .join(" ")
        );
        break;
      }
    }
    message.DB.tags[args[0].value.toLowerCase()] = {
      name: args[0].value.toLowerCase(),
      replies: replies,
      createdAt: new Date(),
      author: message.author.id,
      uses: 0,
    };
    const newDB = {
      ...message.DB,
    };
    await guildDataBase.set(message.guild.id, newDB);
    message.say(`The tag "${args[0].value}" has been created!`);
  },
};
