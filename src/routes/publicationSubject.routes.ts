import express, { Router } from "express";
import publicationSubjectController from "../controllers/publicationSubject.controller";

const router = express.Router();

router.post("/create-publication", publicationSubjectController.createPublication.bind(publicationSubjectController));

router.get("/get-publication/:id", publicationSubjectController.getPublication.bind(publicationSubjectController));

export default router;
