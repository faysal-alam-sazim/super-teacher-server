import { Injectable } from "@nestjs/common";

import { AssignmentSubmissionsRepository } from "@/assignment_submissions/assignment_submissions.repository";
import { ClassroomsRepository } from "@/classrooms/classrooms.repository";
import { FileUploadsService } from "@/file-uploads/file-uploads.service";
import { StudentsRepository } from "@/students/students.repository";

import { AddAssignmentDto, UpdateAssignmentDto } from "./assignments.dtos";
import { AssignmentsRepository } from "./assignments.repository";

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly assignmentsRepository: AssignmentsRepository,
    private readonly fileUploadsService: FileUploadsService,
    private readonly classroomsRepository: ClassroomsRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly assignmentSubmissionsRepository: AssignmentSubmissionsRepository,
  ) {}

  async getAssignments(classroomId: number) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const assignments = await this.assignmentsRepository.find(
      { classroom: classroom.id },
      { orderBy: { createdAt: "ASC" } },
    );

    return assignments;
  }

  async getStudentSubmittedAssignments(classroomId: number, userId: number) {
    const assignments = await this.assignmentsRepository.find({ classroom: classroomId });

    const student = await this.studentsRepository.findOneOrFail({ user: userId });

    const submissions = await this.assignmentSubmissionsRepository.find({ student: student.id });

    const submittedAssignmentIds = submissions.map((submission) => submission.assignment.id);

    const submittedAssignments = assignments.filter((assignment) =>
      submittedAssignmentIds.includes(assignment.id),
    );

    return submittedAssignments;
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
}
