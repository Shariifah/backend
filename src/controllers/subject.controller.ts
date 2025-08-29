import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/responseHandler";
import SubjectService from "../services/subject.service";
enum SubjectType {
    COURS = 'cours',
    EXAM = 'examen',
}

class SubjectController {
    async createSubject(req: Request, res: Response) {
        try {
            const { title, type } = req.body;
            if (!req.file) throw new Error("Le fichier PDF est requis");

            const subject = await SubjectService.createSubject(type, title, req.file);

            sendSuccess(res, subject, "Le sujet est enregistré avec succès.", 201);
        } catch (error) {
            sendError(res, error);
        }
    }


    async getAllSubjects(req: Request, res: Response) {
        try {
            const subjects = await SubjectService.getAllSubjects();
            sendSuccess(res, subjects, "Liste de tous les sujets récupérée.");
        } catch (error) {
            sendError(res, error);
        }
    };

    async getSubjectByType(req: Request, res: Response) {
        try {
            const { type } = req.params;

            const validTypes = Object.values(SubjectType);

            if (!validTypes.includes(type as SubjectType)) {
                throw new Error(`Type de sujet non valide. Types acceptés : ${validTypes.join(', ')}`);
            }

            const subjects = await SubjectService.getByType(type as SubjectType);

            sendSuccess(res, subjects, "Sujets récupérés avec succès.");
        } catch (error) {
            sendError(res, error);
        }
    }

}
export default new SubjectController();
