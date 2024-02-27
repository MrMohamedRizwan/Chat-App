const app=require('express');
const {registerUser,authUser, allUsers} = require('../controllers/userController');
const {protect} = require('../Middlewares/authuMiddleware');
// const { authUser } = require('../controllers/authController'); // Import the authUser function



const router=app.Router()
router.route('/').post(registerUser).get(protect,allUsers)
// router.post('/',registerUser)

router.post('/login',authUser);

// router.route('/login',authUser)

module.exports=router;
