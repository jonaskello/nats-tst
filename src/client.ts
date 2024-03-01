import { connect, Empty, StringCodec } from "nats";

async function main() {
  // create a connection
  //   const nc = await connect({ servers: "demo.nats.io:4222" });
  const nc = await connect({ servers: "localhost:4222", user: "userA", pass: "passA" });

  // create an encoder
  const sc = StringCodec();

  // the client makes a request and receives a promise for a message
  // by default the request times out after 1s (1000 millis) and has
  // no payload.
  for (let i = 0; i < 100; i++) {
    console.time("CALL");
    const m = await nc.request("time", Empty, { timeout: 1000 });
    console.timeEnd("CALL");
    console.log(`got response: ${sc.decode(m.data)}`);
  }

  await nc.close();
}

main();
