import { Router } from "express";
import { authenticate, authorize } from "../../../middleware/auth";
import { addInstructor, editInstructor, listInstructors, removeInstructor } from "../controllers/instructorDirectoryController";

const router = Router();

router.use(authenticate);
router.get("/", listInstructors);
router.post("/", authorize("POST", "/api/v1/instructors"), addInstructor);
router.patch("/:id", authorize("PATCH", "/api/v1/instructors/*"), editInstructor);
router.delete("/:id", authorize("DELETE", "/api/v1/instructors/*"), removeInstructor);

export default router;