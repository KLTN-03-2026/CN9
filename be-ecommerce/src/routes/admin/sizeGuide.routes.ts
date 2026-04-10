import { Router } from "express";
import sizeGuideController from "../../controllers/sizeGuideController";
import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.post("/", verifyToken, sizeGuideController.createSizeGuide);

router.get(
  "/category/:categoryId",
  verifyToken,
  sizeGuideController.getSizeGuideByCategory,
);

router.put(
  "/:sizeGuideId/measurement/:sizeMeasurementId",
  verifyToken,
  sizeGuideController.updateSizeGuideById,
);

router.get(
  "/:sizeGuideId",
  verifyToken,
  sizeGuideController.getSizeGuideByIdSizeMeasurement,
);

export default router;
