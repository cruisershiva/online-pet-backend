const express = require("express");
const { getallpetmedicine, createpetmedicine, updatepetmedicinedetails, getpetmedicinedetails, deletepetmedicine, createpetmedicinereview, getpetmedicinereviews, deletepetmedicinereview } = require("../controller/Petmedicinecontroller");
const { isauthenticateduser, authorizeroles } = require("../middleware/auth");
const router = express.Router();


router.route("/petmedicine").post(getallpetmedicine);
router
  .route("/admin/petmedicine/new")
  .post(isauthenticateduser, authorizeroles("admin"), createpetmedicine);
router
  .route("/admin/petmedicine/:id")
  .put(isauthenticateduser, authorizeroles("admin"), updatepetmedicinedetails)
  .delete(isauthenticateduser, authorizeroles("admin"), deletepetmedicine);
router.route("/petmedicine/:id").get(getpetmedicinedetails);


    
  router.route("/petmedicinereview").put(isauthenticateduser, createpetmedicinereview);

  router
    .route("/petmedicinereviews")
    .get(getpetmedicinereviews)
    .delete(isauthenticateduser, deletepetmedicinereview);

module.exports = router;
