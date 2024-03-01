import { connect, StringCodec, Subscription } from "nats";

async function main() {
  // create a connection
  // const nc = await connect({ servers: "demo.nats.io" });
  const nc = await connect({
    servers: "localhost",
    user: "userB",
    pass: "passB",
  });

  // create a codec
  const sc = StringCodec();

  // this subscription listens for `time` requests and returns the current time
  const sub = nc.subscribe("time");
  (async (sub: Subscription) => {
    console.log(`listening for ${sub.getSubject()} requests...`);
    for await (const m of sub) {
      console.log("headers ", m.headers?.keys.length);
      if (m.respond(sc.encode(new Date().toISOString()))) {
        console.info(`[time] handled #${sub.getProcessed()}`);
      } else {
        console.log(`[time] #${sub.getProcessed()} ignored - no reply subject`);
      }
    }
    console.log(`subscription ${sub.getSubject()} drained.`);
  })(sub);
}

main();
