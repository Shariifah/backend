import { QuestionModel } from "../models/question.model";
import { UserAnswerModel } from "../models/userAnswer.model";

class UserAnswerService {

    async answerQuestion(userId: string, questionId: string, selectedAnswers: number[]) {
        const question = await QuestionModel.findById(questionId);
        if (!question) throw new Error("Question introuvable");

        const isCorrect =
            JSON.stringify([...selectedAnswers].sort()) ===
            JSON.stringify([...question.correctAnswers].sort());

        const userAnswer = new UserAnswerModel({
            userId,
            questionId,
            selectedAnswers,
            isCorrect,
        });

        await userAnswer.save();

        return {
            questionId,
            isCorrect,
            correctAnswers: isCorrect ? undefined : question.correctAnswers,
        };
    }
}

export default new UserAnswerService();
