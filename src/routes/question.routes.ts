import express from "express";
import questionController from "../controllers/question.controller";

const router = express.Router();

/**
 * Enregistrer une question
 */
router.post("/create-question", questionController.createQuestion.bind(questionController));

/**
 * Récupérer les questions d'un sujet
 */
router.get("/getBySubject/:subjectId", questionController.getQuestionsBySubject.bind(questionController));

export default router;
