const express = require('express');
const dotenv = require('dotenv');
const {chats} = require('./data/data.js');
const connectToDB = require('./config/db.js');
const color=require('colors');
const UserRoutes  = require('./routes/UserRoutes.js');
const ChatRoutes=require("./routes/ChatRoutes.js")
const {notFound, errorHandler} = require('./Middlewares/errorMiddleware.js');
const cors = require('cors');

dotenv.config();
connectToDB();
const app = express();
app.use(cors())
app.use(express.json());
const port = process.env.PORT || 50020;

// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

// app.get('/api', (req, res) => {
//   res.send(chats);
// });

// app.get('/api/:id', (req, res) => {
//     console.log(req.params.id);
//   const schat = chats.find((x) => x._id === req.params.id);
//   res.send(schat);
// });

app.use('/api/user',UserRoutes)
app.use('/api/chat',ChatRoutes)
app.use(notFound);
app.use(errorHandler)
app.listen(port, () => console.log(`Server running on port ${port}`.yellow.bold));
