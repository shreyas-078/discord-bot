import { SlashCommandBuilder } from "discord.js";

const skipCommand = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("A Command to skip music");

export { skipCommand };
