import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/responseHandler";
import PublicationSubjectService from "../services/publicationSubject.service";

class PublicationSubjectController {

     async createPublication(req: Request, res: Response) {
        try {
            const { subjectId, startDate, endDate } = req.body;

            const publication = await PublicationSubjectService.createPublication(
                subjectId,
                startDate,
                endDate
            );

            sendSuccess(res, publication, "Publication créée avec succès", 201);
        } catch (error) {
            sendError(res, error);
        }
    }

    async getPublication(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const subject = await PublicationSubjectService.getPublicationContent(id);

            res.setHeader("Content-Type", subject.mimeType);
            res.setHeader("Content-Disposition", "inline");
            res.send(subject.pdf);
        } catch (error) {
            sendError(res, error);
        }
    }
}

export default new PublicationSubjectController();
