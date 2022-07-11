/*
  Warnings:

  - Added the required column `data` to the `ProcessRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ProcessRequestStatus" ADD VALUE 'FORWARDED';

-- AlterTable
ALTER TABLE "ProcessRequest" ADD COLUMN     "data" JSONB NOT NULL;
