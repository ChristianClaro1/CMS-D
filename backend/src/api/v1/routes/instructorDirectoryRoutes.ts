import { Router } from "express";
import { authenticate } from "../../../middleware/auth";
import { addInstructor, editInstructor, listInstructors, removeInstructor } from "../controllers/instructorDirectoryController";

const router = Router();

router.use(authenticate);
router.get("/", listInstructors);
router.post("/", addInstructor);
router.patch("/:id", editInstructor);
router.delete("/:id", removeInstructor);

export default router;