const Redis = require("ioredis");

// Create a new Redis client
const connectToRedis = new Redis({
	host: "localhost", // Replace with your Redis server host
	port: 6379, // Replace with your Redis server port if different
});

connectToRedis.on("connect", () => {
	console.log("Connected to Redis".red.bold);
});

connectToRedis.on("error", (err) => {
	console.error("Redis error: " + err);
});
connectToRedis.set('mykey', 'myvalue')
  .then(result => {
    console.log('Set result:', result); // Should print 'OK'
  })
  .catch(error => {
    console.error('Error setting value:', error);
  });

module.exports = connectToRedis;
