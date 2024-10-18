import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

import { ClassroomStudent } from "@/common/entities/classrooms-students.entity";
import { Classroom } from "@/common/entities/classrooms.entity";
import { Student } from "@/common/entities/students.entity";

export const enrollStudentInClassroomsInDb = async (
  dbService: EntityManager<IDatabaseDriver<Connection>>,
  classrooms: Classroom[],
  students: Student[],
) => {
  const enrollments: ClassroomStudent[] = [];

  classrooms.forEach((classroom) => {
    students.forEach((student) => {
      const enrollment = dbService.create(ClassroomStudent, {
        classroomId: classroom,
        studentId: student,
      });
      enrollments.push(enrollment);
    });
  });

  await dbService.persistAndFlush(enrollments);
};
