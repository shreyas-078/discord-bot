import { SlashCommandBuilder } from "discord.js";

const stopCommand = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Stop the music.");

export { stopCommand };
