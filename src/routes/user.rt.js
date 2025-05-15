import { Router } from "express";
import { registerUser } from "../controllers/user.ct.js";
import { upload } from "../middlewares/multer.mw.js";
import { registerUserSchema } from "../utils/validators.ut.js";
const router = Router();

router.route("/register").post(
  registerUserSchema,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverimg",
      maxCount: 1,
    },
  ]),
  registerUser
);

export default router;
