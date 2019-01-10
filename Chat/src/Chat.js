import WebSocket from "ws";
import EventEmitter from "events";

import Parser from "./Parser";

class Chat extends EventEmitter {
  constructor(username, password) {
    super();

    this.username = username;
    this.password = password;

    this.ws = new WebSocket(process.env.TWITCH_WEBSOCKET);
    this.parser = new Parser();

    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onclose = this.onClose.bind(this);
  }

  keepAlive() {
    this.interval = setInterval(() => {
      this.ws.send("PING :tmi.twitch.tv\r\n");
    }, 2000);
  }

  onOpen() {
    if (this.ws !== null && this.ws.readyState === 1) {
      console.log("Successfully Connected to websocket");

      //   this.ws.send("CAP REQ :twitch.tv/tags");
      this.ws.send(`PASS ${this.password}`);
      this.ws.send(`NICK ${this.username}`);

      this.keepAlive();
      this.emit("open");
    }
  }

  onClose() {
    console.log("Disconnected from the chat server.");
    clearInterval(this.interval);
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }

  onError(e) {
    console.log(`Error: ${e}`);
  }

  onMessage(message) {
    if (message !== null) {
      // Basically doing nothing
      const parsed = this.parser.parse(message.data);

      if (parsed !== null) {
        this.ws.send(parsed);
      }
    }
  }
}

export default Chat;
