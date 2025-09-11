/*
  Warnings:

  - A unique constraint covering the columns `[subject_id,classroom_id]` on the table `Section` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Section_subject_id_classroom_id_key" ON "Section"("subject_id", "classroom_id");
