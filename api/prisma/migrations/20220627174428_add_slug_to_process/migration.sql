/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Process` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Process` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Process` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Process" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Process_name_key" ON "Process"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Process_slug_key" ON "Process"("slug");
