const Redis = require("ioredis");

const redis = new Redis(
  `redis://redis:${process.env.REDISPASSWORD}@${process.env.REDISHOST}:${process.env.REDISPORT}/0`
);

const resetOnlineUsers = async () => {
  await redis.del("online-users");
};

const getOnlineUsers = async () => {
  return await redis.smembers("online-users");
};

const addOnlineUser = async (user) => {
  await redis.sadd("online-users", user);
};

const removeOnlineUser = async (user) => {
  await redis.srem("online-users", user);
};

const isUserOnline = async (user) => {
  const isMember = await redis.sismember("online-users", user);
  return isMember > 0;
};

module.exports = {
  resetOnlineUsers,
  getOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  isUserOnline,
};
