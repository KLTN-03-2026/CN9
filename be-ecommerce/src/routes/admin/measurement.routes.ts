import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken";

import measurementController from "../../controllers/measurementController";

const router = Router();

router.post("/", verifyToken, measurementController.createMeasurement);

router.get("/", verifyToken, measurementController.getAllMeasurement);

router.get(
  "/:measurementId",
  verifyToken,
  measurementController.getMeasurementById,
);

router.put(
  "/:measurementId",
  verifyToken,
  measurementController.updateMeasurementById,
);

router.delete(
  "/:measurementId",
  verifyToken,
  measurementController.deleteMeasurementById,
);

export default router;
