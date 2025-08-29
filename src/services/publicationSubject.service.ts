import SubjectService from "../services/subject.service";
import {PublicationSubjectModel} from "../models/publicationSubject.model";


class PublicationSubjectService {

    async createPublication(subjectId: string, startDate: Date, endDate: Date) {
        if (new Date(startDate) >= new Date(endDate)) {
            throw new Error("La date de début doit être avant la date de fin");
        }

        const subject = await SubjectService.getById(subjectId);
        if (!subject) throw new Error("Sujet non trouvé");

        const publication = new PublicationSubjectModel({
            subject: subjectId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        });

        return publication.save();
    }

     async getPublicationContent(publicationId: string) {
        const publication = await PublicationSubjectModel.findById(publicationId).populate("subject");
        if (!publication) throw new Error("Aucune publication trouvée");

        const now = new Date();
        if (now < publication.startDate) throw new Error("Le sujet n'est pas encore disponible");
        if (now > publication.endDate) throw new Error("La période de publication est expirée");

        return publication.subject as any;
    }
}
export default new PublicationSubjectService()