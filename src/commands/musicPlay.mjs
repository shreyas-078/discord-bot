import { SlashCommandBuilder } from "discord.js";

const playMusicCommand = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play some Music")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("Keywords relating to the song")
      .setRequired(true)
  );

export { playMusicCommand };
