import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

const TOKEN = '';
const DUO_CHANNEL_ID = '';
const TRIO_CHANNEL_ID = '';
const DUO_CATEGORY_ID = '';
const TRIO_CATEGORY_ID = '';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (newState.channelId === DUO_CHANNEL_ID) {
        await createVoiceChannel(newState.guild, '💞・Duo', 2, DUO_CATEGORY_ID, newState.member);
    } else if (newState.channelId === TRIO_CHANNEL_ID) {
        await createVoiceChannel(newState.guild, '💕・Trio', 3, TRIO_CATEGORY_ID, newState.member);
    }

    // Check if the old channel is empty and delete it if so
    if (oldState.channel && oldState.channel.members.size === 0) {
        if (oldState.channel.name.startsWith('💞・Duo') || oldState.channel.name.startsWith('💕・Trio')) {
            await oldState.channel.delete();
        }
    }
});

async function createVoiceChannel(guild, baseName, userLimit, categoryId, member) {
    const existingChannels = guild.channels.cache.filter(channel => channel.type === 2 && channel.name.startsWith(baseName));
    const newChannelName = `${baseName}${existingChannels.size + 1}`;

    const newChannel = await guild.channels.create({
        name: newChannelName,
        type: 2,
        userLimit: userLimit,
        parent: categoryId
    });

    if (member) {
        await member.voice.setChannel(newChannel);
    }
}

client.login(TOKEN);
