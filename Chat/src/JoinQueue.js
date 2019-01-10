import channels from "../channels";

// Rate limit on joins: 50 JOINs per 15 seconds
// Is there actually still a rate limit?????
class JoinQueue {
  constructor(ws) {
    this.channels = channels.channels;
    this.ws = ws;

    this.joins = 50;
    this.seconds = 1;
    this.position = 0;
    this.positionEnd = this.joins;

    this.join();
  }

  join() {
    // grab this.joins channels and repeat every this.seconds seconds
    const interval = setInterval(() => {
      const c = this.channels.slice(this.position, this.positionEnd);

      if (c.length) {
        c.forEach(e => {
          this.ws.send(`JOIN #${e.toLowerCase()}`);
        });

        this.position += this.joins;
        this.positionEnd += this.joins;
      } else {
        clearInterval(interval);
      }
    }, 1000 * this.seconds);
  }
}

export default JoinQueue;
