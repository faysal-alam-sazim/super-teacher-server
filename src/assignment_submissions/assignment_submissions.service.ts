import { Injectable } from "@nestjs/common";

import { AssignmentsRepository } from "@/assignments/assignments.repository";
import { ClassroomsRepository } from "@/classrooms/classrooms.repository";
import { FileUploadsService } from "@/file-uploads/file-uploads.service";
import { StudentsRepository } from "@/students/students.repository";

import { AssignmentSubmissionsRepository } from "./assignment_submissions.repository";

@Injectable()
export class AssignmentSubmissionsService {
  constructor(
    private readonly assignmentSubmissionsRepository: AssignmentSubmissionsRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly assignmentsRepository: AssignmentsRepository,
    private readonly fileUploadsService: FileUploadsService,
    private readonly classroomsRepository: ClassroomsRepository,
  ) {}

  async getAssignmentSubmissions(classroomId: number, assignmentId: number) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const assignment = await this.assignmentsRepository.findOneOrFail({
      id: assignmentId,
      classroom: classroom.id,
    });

    const submissions = await this.assignmentSubmissionsRepository.find(
      { assignment: assignment.id },
      { populate: ["student.user"] },
    );

    return submissions;
  }

  async addSubmission(
    classroomId: number,
    assignmentId: number,
    file: Express.Multer.File,
    userId: number,
  ) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const assignment = await this.assignmentsRepository.findOneOrFail({
      id: assignmentId,
      classroom: classroom.id,
    });

    const student = await this.studentsRepository.findOneOrFail({ user: userId });

    const fileUrl = await this.fileUploadsService.handleFileUpload(file);

    const submission = this.assignmentSubmissionsRepository.create({
      submittedAt: new Date(),
      fileUrl,
      student: student.id,
      assignment: assignment.id,
    });

    return this.assignmentSubmissionsRepository.getEntityManager().persistAndFlush(submission);
  }

  async getSubmissionDownloadUrl(submissionId: number) {
    const submission = await this.assignmentSubmissionsRepository.findOneOrFail({
      id: submissionId,
    });

    const fileKey = submission.fileUrl.split("project-dev-bucket/")[1];

    const downloadUrl = await this.fileUploadsService.getDownloadUrl(fileKey);

    return downloadUrl;
  }
}
