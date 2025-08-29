import { Request, Response } from "express";
import QuestionService from "../services/question.service";
import { sendSuccess, sendError } from "../utils/responseHandler";

class QuestionController {
    async createQuestion(req: Request, res: Response) {
        try {
            const { subjectId, text, options, correctAnswers } = req.body;
            const question = await QuestionService.createQuestion(subjectId, text, options, correctAnswers);
            sendSuccess(res, question, "La question a été enregistrée avec succès.", 201);
        } catch (error) {
            sendError(res, error);
        }
    }

    async getQuestionsBySubject(req: Request, res: Response) {
        try {
            const { subjectId } = req.params;
            const questions = await QuestionService.getQuestionsBySubject(subjectId);
            sendSuccess(res, questions, "La liste des questions a été récupérée avec succès.");
        } catch (error) {
            sendError(res, error);
        }
    }
}

export default new QuestionController();
