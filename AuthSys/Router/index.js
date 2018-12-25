const router = require("express").Router();
const multer = require("multer");
const path = require("path");
//user defined
const userController = require("../Controller/user.controller");
const Auth = require("../../Auth/auth.service");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "ProfilePhotoDir");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});
const upload = multer({ storage: storage });
//router for user
router.post("/authenticate/register", userController.createUser);
router.post("/authenticate/login", userController.loginUser);
router.post(
  "/authenticate/editDetails",
  Auth.isAuthenticated(),
  userController.editDetails
);
router.post(
  "/authenticate/uploadProfilePhoto",
  Auth.isAuthenticated(),
  upload.single("profilePhoto"),
  userController.uploadProfilePhoto
);

module.exports = {
  router: router
};
