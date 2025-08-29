import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/responseHandler";
import SubjectService from "../services/subject.service";


 class SubjectController {
    // Enregistrer un sujet
    async createSubject(req: Request, res: Response) {
        try {

            const { title } = req.body;
            if (!req.file) throw new Error("Le fichier PDF est requis");

            const subject = await SubjectService.createSubject(
                title,
                req.file.buffer,
                req.file.mimetype
            );

            sendSuccess(res, subject, "Sujet enregistré avec succès.", 201);
        } catch (error) {
            sendError(res, error);
        }
    }
}
export default new SubjectController();
