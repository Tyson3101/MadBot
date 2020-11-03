import Keyv from "keyv";
import { config } from "dotenv";
config();
export const guildDataBase = new Keyv(process.env.MONGODBPassword); // DataBase Connetction
guildDataBase.on("error", console.error); // Handles Errors
