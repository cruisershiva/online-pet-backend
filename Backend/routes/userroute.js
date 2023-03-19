const express = require("express");
const {
  registeruser,
  loginuser,
  logout,
  // forgotpassword,
  // resetpassword,
  getuserdetail,
  updatepassword,
  updateprofile,
  getallusers,
  getsingleuser,
  updateuserrole,
  deleteuser,
} = require("../controller/usercontroller");
const { isauthenticateduser, authorizeroles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registeruser);

router.route("/login").post(loginuser);

// router.route("/password/forgot").post(forgotpassword);
// router.route("/password/reset/:token").put(resetpassword);
router.route("/logout").get(logout);
router.route("/me").get(isauthenticateduser, getuserdetail);
router.route("/password/update").put(isauthenticateduser, updatepassword);
router.route("/me/update").put(isauthenticateduser, updateprofile);

router
  .route("/admin/users")
  .get(isauthenticateduser, authorizeroles("admin"), getallusers);
router
  .route("/admin/user/:id")
  .get(isauthenticateduser, authorizeroles("admin"), getsingleuser)
  .put(isauthenticateduser, authorizeroles("admin"), updateuserrole)
  .delete(isauthenticateduser, authorizeroles("admin"), deleteuser);

module.exports = router;
