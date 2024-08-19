const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data.js");
const connectToDB = require("./config/db.js");
const color = require("colors");
const UserRoutes = require("./routes/UserRoutes.js");
const ChatRoutes = require("./routes/ChatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const JSON = require("./swagger-output.json");
const swaggerUI = require("swagger-ui-express");
const { notFound, errorHandler } = require("./Middlewares/errorMiddleware.js");
const cors = require("cors");
const { Socket } = require("socket.io");
// const connectToRedis = require("./config/redis.js");
const path = require("path");
const morgan = require("morgan");

dotenv.config();
connectToDB();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
// server.js
// connectToReds

app.use(morgan("dev"));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(JSON));
app.get("/swagger-json", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.send(JSON);
});

// app.get('/api', (req, res) => {
//   res.send(chats);
// });

// app.get('/api/:id', (req, res) => {
//     console.log(req.params.id);
//   const schat = chats.find((x) => x._id === req.params.id);
//   res.send(schat);
// });

app.use("/api/user", UserRoutes);
app.use("/api/chat", ChatRoutes);
app.use("/api/message", messageRoutes);
// app.use(notFound);
// app.use((req, res, next)=> {
//   console.log('yftui')
//   req.redisClient = redisClient;
//   next();
// });

///deploy

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
//   // app.get("/", (req, res) => {
//   //   res.send("API is running..");
//   // });
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }
// ///deploy

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () =>
	console.log(`Server running on port ${port}`.yellow.bold),
);

const io = require("socket.io")(server, {
	pingTimeout: 60000,
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		allowedHeaders: "*",  // Allow all headers
		credentials: true
	
	},
});
const users = {};
io.on("connection", (socket) => {
	console.log("Connected to socket.io");
	socket.on("setup", (userData) => {
		socket.join(userData._id);
		socket.emit("connected");
	});
	socket.on("setup", (userData) => {
		// console.log(userData._id);
		if (userData && userData._id) {
			socket.join(userData._id);
			users[userData._id] = socket.id;
			io.emit("user-online", userData._id);
			io.emit("online-users", Object.keys(users));
		}
	});

	socket.on("join chat", (room) => {
		socket.join(room);
		console.log("User Joined Room: " + room);
	});
	socket.on("typing", (room) => socket.in(room).emit("typing"));
	socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

	socket.on("new message", (newMessageRecieved) => {
		var chat = newMessageRecieved.chat;
		if (!chat.users) return console.log("chat.users not defined");

		chat.users.forEach((user) => {
			if (user._id == newMessageRecieved.sender._id) return;
			// console.log(user._id);
			socket.in(user._id).emit("message recieved", newMessageRecieved);
		});
	});

	socket.on("disconnect", () => {
		let userId;
		for (const [id, socketId] of Object.entries(users)) {
			if (socketId === socket.id) {
				userId = id;
				delete users[id];
				break;
			}
		}

		if (userId) {
			io.emit("user-offline", userId);
			io.emit("online-users", Object.keys(users));
		}
	});
});
