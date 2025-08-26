import { SubjectModel } from "../models/subject.model";

 class SubjectService {
     async createSubject(title: string, content: Buffer, mimeType: string) {
        const subject = new SubjectModel({ title, content, mimeType });
        return subject.save();
    }

    async getById(id: string) {
        return SubjectModel.findById(id);
    }
}
export default new SubjectService();
