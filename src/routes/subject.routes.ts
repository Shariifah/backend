import express, { Router } from "express";

import subjectController from "../controllers/subject.controller";
import multer from "multer";

const router = express.Router();
/**
 * Créer un sujet
 *
 */
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Seuls les fichiers PDF sont autorisés !"));
        }
        cb(null, true);
    },
});

router.post("/create-subject", upload.single("content"), subjectController.createSubject.bind(subjectController));

export default router;
