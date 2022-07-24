import { createClient} from "redis";

console.log( process.env.REDIS_URL );
const client = createClient({ url: process.env.REDIS_URL });

client.on("error", (err) => {
  console.log("Error " + err);
});

client.connect().catch((err) => {
  console.error("Redis Error", err);
});

export default client;
