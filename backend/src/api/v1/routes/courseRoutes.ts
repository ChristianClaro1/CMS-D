import { Router } from "express";
import { create, getById, updateStatus, update, remove } from "../controllers/courseController";
import { authenticate, authorize } from "../../../middleware/auth";

const router = Router();

router.post("/", authenticate, authorize("POST", "/api/v1/courses"), create);
router.get("/:id", authenticate, getById);
router.patch("/:id", authenticate, authorize("PATCH", "/api/v1/courses/*"), update);
router.patch("/:id/status", authenticate, authorize("PATCH", "/api/v1/courses/*/status"), updateStatus);
router.delete("/:id", authenticate, authorize("DELETE", "/api/v1/courses/*"), remove);

export default router;
