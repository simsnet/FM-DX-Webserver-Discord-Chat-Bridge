console.clear();

process.title = 'Starting up...  |  FMDXWeb Discord Chat Bridge v1.0';

console.log('');
console.log('FM-DX Webserver Discord Chat Bridge');
console.log('v1.0 - created by Simsnet (https://github.com/simsnet)\n');

import {
    Client,
    GatewayIntentBits,
    Events
}
from 'discord.js';
import WebSocket from 'ws';
import dotenv from 'dotenv';

dotenv.config();

let live = false;
let quietTimer = null;

let ws = null;
let reconnectTimer = null;
let reconnectDelay = 1000;
const MAX_RECONNECT_DELAY = 30000;

const {
    DISCORD_TOKEN,
    DISCORD_CHANNEL_ID,
    WS_URL
} = process.env;

/* ---------------- Discord Client ---------------- */

const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

function getTime() {
    const timenow = new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(new Date());
	
	return timenow;
}

getTime();
console.log(`Server started at ${getTime()}.\n`);

/* ---------------- WebSocket Client ---------------- */

function connectWebSocket() {
    console.log(`Connecting to FM-DX Webserver Chat WebSocket (${WS_URL})...`);
    process.title = 'Connecting to WebSocket...  |  FMDXWeb Discord Chat Bridge v1.0';

    ws = new WebSocket(WS_URL);

    ws.on('open', () => {
        console.log('Connected to WebSocket!\n');
        process.title = `Connected to WebSocket!  |  FMDXWeb Discord Chat Bridge v1.0`;
        live = false;
        clearTimeout(quietTimer);
        reconnectDelay = 1000;
    });

    ws.on('message', async(data) => {
        clearTimeout(quietTimer);

        // Ignore messages until the stream goes quiet
        if (!live) {
            quietTimer = setTimeout(() => {
                live = true;
                console.log('Waiting for message queue to clear...');
                console.log('Queue cleared. Message forwarding enabled.\n');
                process.title = `Ready to accept messages!  |  FMDXWeb Discord Chat Bridge v1.0`;
            }, 500);
            return;
        }

        let payload;
        try {
            payload = JSON.parse(data.toString());
        } catch {
            return;
        }

        // Ignore echoes from Discord
        if (payload.source === 'discord') {
            return;
        }

        const channel = await discordClient.channels.fetch(DISCORD_CHANNEL_ID);
        if (!channel) {
            return;
        }

        console.log(`[${getTime()}] Sending WebSocket message to Discord:\n${payload.nickname}: ${payload.message}\n`);

        await channel.send(`**${payload.nickname}:** ${payload.message}`);
    });

    ws.on('close', () => {
        console.warn('WebSocket connection closed');
        process.title = `WebSocket connection closed, attempting to reconnect...  |  FMDXWeb Discord Chat Bridge v1.0`;
        live = false;
        scheduleReconnect();
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
        process.title = `WebSocket error!  |  FMDXWeb Discord Chat Bridge v1.0`;
    });
}

function scheduleReconnect() {
    if (reconnectTimer) {
        return;
    }

    console.log(`Reconnecting in ${reconnectDelay / 1000}s...`);

    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectWebSocket();
        reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY);
    }, reconnectDelay);
}

connectWebSocket();

/* ---------------- Discord → WebSocket ---------------- */

discordClient.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }

    if (message.channel.id !== DISCORD_CHANNEL_ID) {
        return;
    }

    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.warn('WebSocket not connected — Discord message dropped');
        process.title = `Websocket connection closed, pausing Discord bridge...  |  FMDXWeb Discord Chat Bridge v1.0`;
        return;
    }

    const discordname = message.member?.displayName || message.author.username;
    const discordid = message.member?.id || message.author.id;

    const payload = JSON.stringify({
        source: 'discord',
        nickname: `[DISCORD] ${discordname}`,
        message: message.content
    });

    console.log(`[${getTime()}] Sending Discord message to Websocket:\n[DISCORD] ${discordname} (${discordid}): ${message.content}\n\n`);

    ws.send(payload);
});

/* ---------------- Discord Login ---------------- */

let botname;

discordClient.once(Events.ClientReady, (client) => {
    botname = client.user.tag;
    console.log(`Connected to Discord as ${botname}!\n`);
	startTitleRotation();
});

discordClient.login(DISCORD_TOKEN);

/* --- Status bar --- */

const actions = [
    () => process.title = `Discord messages forwarding to ${WS_URL}  |  FMDXWeb Discord Chat Bridge v1.0`,
    () => process.title = `WebSocket messages forwarding to ID ${DISCORD_CHANNEL_ID}  |  FMDXWeb Discord Chat Bridge v1.0`,
    () => process.title = `Logged into Discord as ${botname}  |  FMDXWeb Discord Chat Bridge v1.0`
];

let titleInterval = null;

function startTitleRotation(intervalMs = 10000) {
    if (titleInterval !== null) {
        return;
    }

    let index = 0;

    titleInterval = setInterval(() => {
        actions[index % actions.length]();
        index++;
    }, intervalMs);
}

function stopTitleRotation() {
    if (titleInterval === null) {
        return;
    }

    clearInterval(titleInterval);
    titleInterval = null;
}
