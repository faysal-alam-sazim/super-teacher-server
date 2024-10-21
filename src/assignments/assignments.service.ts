import { Injectable } from "@nestjs/common";

import { ClassroomsRepository } from "@/classrooms/classrooms.repository";
import { ClassroomsService } from "@/classrooms/classrooms.service";
import { FileUploadsService } from "@/file-uploads/file-uploads.service";
import { MailService } from "@/mail/mail.service";

import { AddAssignmentDto, UpdateAssignmentDto } from "./assignments.dtos";
import { AssignmentsRepository } from "./assignments.repository";

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly assignmentsRepository: AssignmentsRepository,
    private readonly fileUploadsService: FileUploadsService,
    private readonly classroomsRepository: ClassroomsRepository,
    private readonly classroomsService: ClassroomsService,
    private readonly mailService: MailService,
  ) {}

  async getAssignments(classroomId: number) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const assignments = await this.assignmentsRepository.find(
      { classroom: classroom.id },

      { orderBy: { createdAt: "ASC" }, populate: ["submissions.student"] },
    );

    return assignments;
  }

  async addAssignment(
    classroomId: number,
    addAssignmentDto: AddAssignmentDto,
    file: Express.Multer.File,
  ) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const fileUrl = await this.fileUploadsService.handleFileUpload(file);

    const assignment = this.assignmentsRepository.create({
      ...addAssignmentDto,
      fileUrl,
      classroom: classroom.id,
    });

    await this.assignmentsRepository.getEntityManager().persistAndFlush(assignment);

    const enrolledStudents = await this.classroomsService.getClassroomStudents(classroom.id);

    enrolledStudents.map(async (student) => {
      await this.mailService.sendMail(
        student.user.email,
        `New Assignment Created in Class ${classroom.title}`,
        `Hello ${student.user.firstName}, ${assignment.title} is created in class ${classroom.title}`,
      );
    });
  }

  async updateAssignment(
    classroomId: number,
    assignmentId: number,
    updateAssignmentDto: UpdateAssignmentDto,
    newFile?: Express.Multer.File,
  ) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const assignment = await this.assignmentsRepository.findOneOrFail({
      id: assignmentId,
      classroom: classroom.id,
    });

    if (newFile) {
      const prevFileKey = assignment.fileUrl.split("project-dev-bucket/")[1];
      await this.fileUploadsService.deleteFromS3(prevFileKey);

      updateAssignmentDto.fileUrl = await this.fileUploadsService.handleFileUpload(newFile);
    }

    return this.assignmentsRepository.updateOne(assignment, updateAssignmentDto);
  }

  async deleteAssignment(classroomId: number, assignmentId: number) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const assignment = await this.assignmentsRepository.findOneOrFail({
      id: assignmentId,
      classroom: classroom.id,
    });

    const prevFileKey = assignment.fileUrl.split("project-dev-bucket/")[1];
    await this.fileUploadsService.deleteFromS3(prevFileKey);

    await this.assignmentsRepository.getEntityManager().removeAndFlush(assignment);
  }

  async getAssignmentDownloadUrl(classroomId: number, assignmentId: number) {
    const assignment = await this.assignmentsRepository.findOneOrFail({
      id: assignmentId,
      classroom: classroomId,
    });

    const fileKey = assignment.fileUrl.split("project-dev-bucket/")[1];

    const downloadUrl = await this.fileUploadsService.getDownloadUrl(fileKey);

    return downloadUrl;
  }
}
