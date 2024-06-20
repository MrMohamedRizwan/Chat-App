const swaggerAutogen = require("swagger-autogen");
const port = process.env.PORT || 5000;
const doc = {
	info: {
		title: "Whatsapp Monitoring",
		description: "Monitor whatsapp groups",
	},
	host: `localhost:${port}/api`,
};

const outputFile = "./swagger-output.json";
const routes = [
	"./routes/ChatRoutes.js",
	"./routes/messageRoutes.js",
	"./routes/UserRoutes.js",
];
swaggerAutogen(outputFile, routes, doc);
