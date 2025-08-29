import { QuestionModel } from "../models/question.model";

class QuestionService {

    async createQuestion(subjectId: string, text: string, options: string[], correctAnswers: number[]) {
        if (!options || options.length < 2) {
            throw new Error("Une question doit avoir au moins deux options");
        }
        if (!correctAnswers || correctAnswers.length < 1) {
            throw new Error("Il faut au moins une bonne réponse");
        }

        const question = new QuestionModel({
            subjectId,
            text,
            options,
            correctAnswers,
        });

        return await question.save();
    }


    async getQuestionsBySubject(subjectId: string) {
        return await QuestionModel.find({ subjectId });
    }
}

export default new QuestionService();
