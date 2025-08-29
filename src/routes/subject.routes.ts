import express from "express";

import subjectController from "../controllers/subject.controller";
import multer from "multer";

const router = express.Router();
/**
 * Créer un sujet
 *
 */
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Seuls les fichiers PDF sont autorisés !"));
        }
        cb(null, true);
    },
});

router.post("/create-subject", upload.single("content"), subjectController.createSubject.bind(subjectController));

/**
 * Récupérer les sujets par type
 *
 */

router.get("/getByType/:type", subjectController.getSubjectByType.bind(subjectController));

/**
 * Récupérer tous les sujets
 */
router.get("/findAll", subjectController.getAllSubjects.bind(subjectController));

export default router;
