const app=require("express");
const {accessChat,fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require("../controllers/chatController");
const { protect } = require("../Middlewares/authuMiddleware");
const router=app.Router()
router.route("/").post(protect,accessChat);
router.route("/").get(protect,fetchChats)
router.route("/group").post(protect,createGroupChat)
router.route("/renamegroup").put(protect,renameGroup)
router.route("/addTogroup").post(protect,addToGroup)
router.route("/removeFromgroup").post(protect,removeFromGroup)
module.exports=router;