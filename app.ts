import "dotenv/config";
import { promisify } from "util";
import redisClient from "./redisClient";

const wait = promisify(setTimeout);

const start = async () => {
  // String
  await redisClient.set("myStr", "You are beautiful");
  console.log(await redisClient.get("myStr"));

  // Check if key exists
  console.log("myStr exists:", await redisClient.exists("myStr") === 1);

  // TTL
  await redisClient.setEx("myStr", 5, "You are beautiful");
  console.log("myStr exists with TTL:", await redisClient.exists("myStr") === 1);
  await wait(5000);
  console.log("myStr exists after 5 seconds:", await redisClient.exists("myStr") === 1);

  // List
  await redisClient.rPush("myList", ["a", "b", "c"]);
  await redisClient.rPush("myList", "2");
  await redisClient.rPush("myList", "3");
  await redisClient.lPush("myList", "last");
  console.log("Full list:", await redisClient.lRange("myList", 0, -1));
  console.log("First 3 elements of list:", await redisClient.lRange("myList", 0, 2));
  await redisClient.lTrim("myList", 0, 1);
  console.log("Elements of list (lTrim):", await redisClient.lRange("myList", 0, -1));
  await redisClient.rPop("myList");
  console.log("Elements of list (rPop):", await redisClient.lRange("myList", 0, -1));
  await redisClient.lPop("myList");
  console.log("Elements of list (lPop):", await redisClient.lRange("myList", 0, -1));
  await redisClient.del("myList");
  console.log("List exists:", await redisClient.exists("myStr") === 1);

  // Hash
  await redisClient.hSet("myHash", ["name", "John", "age", "30", "gender", "m"]);
  console.log("Hash:", await redisClient.hGetAll("myHash"));
  // get a single value
  console.log("Hash (name):", await redisClient.hGet("myHash", "name"));
  // get multiple values
  console.log("Hash (name, age):", await redisClient.hmGet("myHash", ["name", "age"]));

  // Set
  await redisClient.sAdd("mySet", ["a", "b", "c"]);
  await redisClient.sAdd("mySet", "2");
  await redisClient.sAdd("mySet", "3");
  console.log("Set:", await redisClient.sMembers("mySet"));
  await redisClient.sRem("mySet", "2");
  console.log("Set:", await redisClient.sMembers("mySet"));
  // check if value exists
  console.log("Set (a):", await redisClient.sIsMember("mySet", "a"));

  // Bitmaps
  await redisClient.setBit("myBitmap", 0, 1);
  await redisClient.setBit("myBitmap", 1, 1);
  console.log("Bitmap:", await redisClient.getBit("myBitmap", 0));
};

start().then(() => {
  console.log("All done");
}).catch(err => {
  console.error(err);
});
