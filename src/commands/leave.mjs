import { SlashCommandBuilder } from "discord.js";

const leaveCommand = new SlashCommandBuilder()
  .setName("leave")
  .setDescription("Leave the Voice channel.");

export { leaveCommand };
