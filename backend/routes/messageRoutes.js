const app=require('express')
const { protect } = require("../Middlewares/authuMiddleware");
const { sendMessage, fetchMessages } = require('../controllers/messageController');
const router=app.Router()
router.route('/').post(protect,sendMessage);
router.route('/:chatId').get(protect,fetchMessages);
module.exports=router;