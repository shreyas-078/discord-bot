import { config } from "dotenv";
import { commands } from "./commands/commands.mjs";
import { DisTube } from "distube";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { youtubeCookie } from "../cookie.mjs";
config();

import {
  REST,
  Routes,
  Client,
  GatewayIntentBits,
  EmbedBuilder,
} from "discord.js";

const listOfCommands = commands;

// Create a new Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.DisTube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  youtubeCookie: youtubeCookie,
  emitAddListWhenCreatingQueue: false,
  plugins: [new YtDlpPlugin({ update: true })],
});

// New Discord REST API
const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_BOT_TOKEN
);

// Refresh all the (/) Commands
try {
  console.log("Refreshing application (/) commands.");
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: listOfCommands,
  });

  console.log("Successfully Reloaded Application (/) Commands.");
} catch (error) {
  console.error(error);
}

// When Bot is Ready display text to show it
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Creating the help Embed using EmbedBuilder
const helpEmbed = new EmbedBuilder()
  .setColor("Aqua")
  .setTitle("Cookie Bot Commands")
  .setDescription("A List of commands you can use with Cookie Bot!")
  .addFields(
    { name: "/help", value: "Displays this Embed" },
    {
      name: "/unclejoke",
      value: "Returns a random Uncle Joke",
    }, //inline: true makes the next field appear in the same line
    { name: "/play", value: "Play some music" },
    { name: "/skip", value: "Skip Current song" },
    { name: "/stop", value: "Stop music" },
    { name: "/leave", value: "Leave the voice Channel" }
    // { name: "\u200B", value: "\u200B" } Leaves Space
  );

async function getUncleJoke() {
  const response = await fetch("https://icanhazdadjoke.com/", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  return response.json();
}
// When a new interaction is created
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "help") {
    await interaction.reply({ embeds: [helpEmbed] });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "play") {
    const query = interaction.options.get("query").value;

    if (!interaction.member.voice.channel) {
      await interaction.reply({ content: "User not in VC." });
      return;
    }
    client.DisTube.play(interaction.member.voice.channel, query, {
      member: interaction.member,
      textChannel: interaction.channel,
      interaction,
    });
    await interaction.reply({
      content: `Added to Queue: ${query.toUpperCase()}`,
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  if (interaction.commandName === "skip") {
    if (!interaction.member.voice.channel) {
      await interaction.reply({
        content: "You need to be in a Voice channel to use this command",
      });
      return;
    }
    const queue = client.DisTube.getQueue(interaction);
    if (!queue) {
      await interaction.reply({ content: "There is nothing in the queue." });
      return;
    }
    try {
      const song = await queue.skip();
      await interaction.reply({ content: "Skipped the current song" });
    } catch (e) {
      await interaction.reply({ content: "There is no up next song to skip." });
    }
  }
  if (interaction.commandName === "stop") {
    if (!interaction.member.voice.channel) {
      await interaction.reply({
        content: "You need to be in a Voice channel to use this command",
      });
      return;
    }
    const queue = client.DisTube.getQueue(interaction);
    if (!queue) {
      await interaction.reply({ content: "There is nothing in the queue." });
      return;
    }
    queue.stop();
    await interaction.reply({ content: "Stopped the music." });
  }
  if (interaction.commandName === "leave") {
    if (!interaction.member.voice.channel) {
      await interaction.reply({
        content: "You need to be in a vc to use this command.",
      });
      return;
    }
    client.DisTube.voices.leave(interaction);
    await interaction.reply({ content: "Left the voice channel." });
  }
});

client.DisTube.on("playSong", (queue, song) => {
  queue.textChannel.send("Searching for: " + song.name);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "unclejoke") {
    const { joke } = await getUncleJoke();
    await interaction.reply({ content: joke });
  }
});

// Log the bot in
client.login(process.env.DISCORD_BOT_TOKEN);
