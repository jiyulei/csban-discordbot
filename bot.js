require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  console.log(
    `[${message.channel.name}] ${message.author.username}: ${message.content}`
  );
  const ALLOWED_CHANNEL_ID = "1362699362945339562"; 
  if (message.channel.id !== ALLOWED_CHANNEL_ID) return;
  // 发到 n8n webhook
  try {
    await axios.post(process.env.N8N_WEBHOOK_URL, {
      user: message.author.username,
      content: message.content,
    });
  } catch (err) {
    console.error("❌ Failed to send to n8n webhook:", err.message);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
