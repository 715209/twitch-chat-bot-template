import WebSocket from "ws";
import EventEmitter from "events";

import parse from "./Parser";

class Chat extends EventEmitter {
    constructor(username, password) {
        super();

        this.username = username;
        this.password = password;

        this.open();

        console.log("Connecting to twitch");
    }

    keepAlive() {
        this.interval = setInterval(() => {
            this.ws.send("PING :tmi.twitch.tv\r\n");
        }, 2000);
    }

    open() {
        this.ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onclose = this.onClose.bind(this);
    }

    onOpen() {
        if (this.ws !== null && this.ws.readyState === 1) {
            console.log("Successfully Connected to twitch");

            this.ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
            this.ws.send(`PASS ${this.password}`);
            this.ws.send(`NICK ${this.username}`);

            this.keepAlive();
            this.emit("connected");
        }
    }

    onClose() {
        console.log("Disconnected from twitch server");
        clearInterval(this.interval);
        this.ws.removeAllListeners();
        this.reconnect();
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }

    reconnect() {
        console.log(`Trying to reconnect in 5 seconds`);

        setTimeout(() => {
            console.log("Reconnecting...");
            this.open();
        }, 5000);
    }

    onError(e) {
        console.error(new Error(e));
    }

    onMessage(message) {
        if (message !== null) {
            const removeCRLF = message.data.split("\r\n")[0];
            this.handleMessage(parse(removeCRLF));
        }
    }

    handleMessage(message) {
        const channel = message.params[0];
        const msg = message.params[1];

        switch (message.command) {
            case "PING":
                this.ws.send("PONG");
                break;
            case "PRIVMSG":
                const username = message.prefix.split("!")[0];

                this.emit("message", msg, username, channel, message.tags);
                break;
            case "JOIN":
                this.emit("join", channel);
                break;
        }
    }
}

export default Chat;
