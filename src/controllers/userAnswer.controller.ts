import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/responseHandler";
import UserAnswerService from "../services/userAnswer.service";

class UserAnswerController {
    async answerQuestion(req: Request, res: Response) {
        try {
            const { userId, questionId, selectedAnswers } = req.body;
            const result = await UserAnswerService.answerQuestion(userId, questionId, selectedAnswers);
            sendSuccess(res, result, "Réponse enregistrée et corrigée avec succès.");
        } catch (error) {
            sendError(res, error);
        }
    }


}

export default new UserAnswerController();
