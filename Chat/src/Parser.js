class Parser {
  parse(message) {
    console.log(message);

    const regex = RegExp(/([A-Z]\w*)/, "g");
    const array = regex.exec(message);

    if (array !== null && typeof this[array[1]] == "function") {
      return this[array[1]](message);
    } else if (/^PING/.test(message)) {
      console.log("this is a ping");
      return this.PONG();
    }

    return null;
  }

  //   PRIVMSG(message) {
  //     return "TODO";
  //   }

  PONG() {
    return "PONG :tmi.twitch.tv";
  }
}

export default Parser;
