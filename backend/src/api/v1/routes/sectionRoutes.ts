import { Router } from "express";
import { createSection, deleteSection, listSections, updateSection } from "../controllers/sectionController";
import { authenticate, authorize } from "../../../middleware/auth";

const router = Router();

router.get("/sections", authenticate, authorize("GET", "/api/v1/courses/sections"), listSections);
router.get("/:id/sections", authenticate, authorize("GET", "/api/v1/courses/*/sections"), listSections);
router.post("/:id/sections", authenticate, authorize("POST", "/api/v1/courses/*/sections"), createSection);
router.patch("/:id/sections/:sectionId", authenticate, authorize("PATCH", "/api/v1/courses/*/sections/*"), updateSection);
router.delete("/:id/sections/:sectionId", authenticate, authorize("DELETE", "/api/v1/courses/*/sections/*"), deleteSection);

export default router;
