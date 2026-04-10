import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken";
import { checkRole } from "../../middlewares/checkRole";

import voucherController from "../../controllers/voucherController";

const router = Router();

router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  voucherController.createVoucher,
);

router.put("/:voucherId", verifyToken, voucherController.updateVoucherById);

router.delete("/:voucherId", verifyToken, voucherController.deleteVoucherById);

router.get("/", verifyToken, voucherController.getVouchers);

router.get("/:voucherId", verifyToken, voucherController.getVoucherById);

router.patch(
  "/:voucherId/active",
  verifyToken,
  voucherController.toggleVoucherActive,
);

export default router;
