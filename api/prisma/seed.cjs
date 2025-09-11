const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function userSeed() {
  prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: {},
    create: {
      email: 'testuser@example.com',
      password: 'testpassword',
    },
  })
}

async function userTeacherSeed() {
  return prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      password: 'teacherpassword',
      role: 'TEACHER',
    },
  })
}

async function userStudentSeed() {
  return prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: 'studentpassword',
      role: 'STUDENT',
    },
  })
}

async function teacherSeed() {
  const user = await userTeacherSeed()
  return prisma.teacher.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      name: 'teacher',
      user: {
        connectOrCreate: {
          where: { email: 'teacher@example.com' },
          create: { email: 'teacher@example.com', password: 'teacherpassword', role: 'TEACHER' },
        },
      },
    },
    include: { user: true },
  })
}

async function studentSeed() {
  const user = await userStudentSeed()
  return prisma.student.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      name: 'student',
      user: {
        connectOrCreate: {
          where: { email: 'student@example.com' },
          create: { email: 'student@example.com', password: 'studentpassword', role: 'STUDENT' },
        },
      },
    },
    include: { user: true },
  })
}

async function subjectSeed() {
  return prisma.subject.upsert({
    where: { code: 'CHEM-101' },
    update: {},
    create: { code: 'CHEM-101', title: 'General Chemistry I' },
  })
}

async function classroomSeed() {
  return prisma.classroom.upsert({
    where: { name: 'Sci-201' },
    update: {},
    create: { name: 'Sci-201', capacity: 60 },
  })
}

async function sectionSeed() {
  const subject = await subjectSeed()
  const classroom = await classroomSeed()
  const teacher = await teacherSeed()
  return prisma.section.upsert({
    where: {
      subjectId_classroomId: { subjectId: subject.id, classroomId: classroom.id },
    },
    update: {},
    create: {
      subjectId: subject.id,
      teacherId: teacher.id,
      classroomId: classroom.id,
      startTime: new Date('1970-01-01T08:00:00Z'),
      endTime: new Date('1970-01-01T08:50:00Z'),
      days: {
        createMany: {
          data: [{ day: 'MON' }, { day: 'WED' }, { day: 'FRI' }],
          skipDuplicates: true,
        },
      },
    },
  })
}

async function studentSectionSeed() {
  const student = await studentSeed()
  const section = await sectionSeed()
  return prisma.studentSection.upsert({
    where: { studentId_sectionId: { studentId: student.id, sectionId: section.id } },
    update: {},
    create: { studentId: student.id, sectionId: section.id },
  })
}

async function main() {
  await userSeed()
  await studentSectionSeed()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
