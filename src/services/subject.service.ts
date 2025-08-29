import fs from "fs";
import path from "path";
import { SubjectModel } from "../models/subject.model";
import {TarifSubscriptionModel} from "@models/tarifSubscription.model";

class SubjectService {
    async createSubject(type: string, title: string, file: Express.Multer.File) {

        const uploadDir = path.join(__dirname, "../../Sujets");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileName = `${file.originalname}`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, file.buffer);

        const subject = new SubjectModel({
            type,
            title,
            filePath,
            mimeType: file.mimetype,
        });

        return subject.save();
    }

    async getById(id: string) {
        return SubjectModel.findById(id);
    }

    async getAllSubjects() {
        return SubjectModel.find();
    }

    async getByType(type: string) {
        return SubjectModel.find({ type });
    }
}

export default new SubjectService();
