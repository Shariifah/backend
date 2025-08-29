import express from "express";
import userAnswerController from "../controllers/userAnswer.controller";

const router = express.Router();

/**
 * Enregistrer les réponses d'un utilisateur aux questions
 */
router.post("/answer-question", userAnswerController.answerQuestion.bind(userAnswerController));


export default router;