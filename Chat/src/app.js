import Chat from "./Chat";
import JoinQueue from "./JoinQueue";

const connection = new Chat(
  process.env.TWITCH_USERNAME,
  process.env.TWITCH_OAUTH
);

connection.on("open", () => {
  new JoinQueue(connection.ws);
});
