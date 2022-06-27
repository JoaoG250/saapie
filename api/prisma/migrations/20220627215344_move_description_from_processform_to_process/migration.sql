/*
  Warnings:

  - You are about to drop the column `description` on the `ProcessForm` table. All the data in the column will be lost.
  - Added the required column `description` to the `Process` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Process" DROP CONSTRAINT "Process_targetGroupId_fkey";

-- DropForeignKey
ALTER TABLE "ProcessForm" DROP CONSTRAINT "ProcessForm_processId_fkey";

-- DropForeignKey
ALTER TABLE "ProcessRequest" DROP CONSTRAINT "ProcessRequest_processId_fkey";

-- AlterTable
ALTER TABLE "Process" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProcessForm" DROP COLUMN "description";

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_targetGroupId_fkey" FOREIGN KEY ("targetGroupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessForm" ADD CONSTRAINT "ProcessForm_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessRequest" ADD CONSTRAINT "ProcessRequest_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE SET NULL ON UPDATE CASCADE;
