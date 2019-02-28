import Chat from "./Chat";
import JoinQueue from "./JoinQueue";
import config from "../config";

const client = new Chat(config.username, config.oauth);

client.on("connected", () => {
    new JoinQueue(client.ws, config.channels);
});

client.on("join", channel => {
    console.log(`Joined channel ${channel}`);
});

client.on("message", (msg, username, channel, tags) => {
    console.log(msg, username, channel, tags);
});
