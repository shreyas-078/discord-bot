//List of Commands

import { SlashCommandBuilder } from "discord.js";
import { playMusicCommand } from "./musicPlay.mjs";
import { skipCommand } from "./skip.mjs";
import { stopCommand } from "./stop.mjs";
import { leaveCommand } from "./leave.mjs";

const helpCommand = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Show All Commands and a Short Description");

const unclejokeCommand = new SlashCommandBuilder()
  .setName("unclejoke")
  .setDescription("Return a random Ferses Humor Joke");

export const commands = [
  helpCommand.toJSON(),
  unclejokeCommand.toJSON(),
  playMusicCommand.toJSON(),
  skipCommand.toJSON(),
  stopCommand.toJSON(),
  leaveCommand.toJSON(),
];
