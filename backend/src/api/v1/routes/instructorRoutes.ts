import { Router } from "express";
import { assign, deleteAssignment, editAssignment, getAssignments } from "../controllers/instructorController";
import { authenticate, authorize } from "../../../middleware/auth";

const router = Router();

router.patch("/:id/instructor", authenticate, authorize("PATCH", "/api/v1/courses/*/instructor"), assign);
router.patch("/:id/instructor/:section", authenticate, authorize("PATCH", "/api/v1/courses/*/instructor/*"), editAssignment);
router.delete("/:id/instructor/:section", authenticate, authorize("DELETE", "/api/v1/courses/*/instructor/*"), deleteAssignment);
router.get("/instructors", authenticate, getAssignments);

export default router;
