-- DropForeignKey
ALTER TABLE "Process" DROP CONSTRAINT "Process_targetGroupId_fkey";

-- DropForeignKey
ALTER TABLE "ProcessRequest" DROP CONSTRAINT "ProcessRequest_processId_fkey";

-- AlterTable
ALTER TABLE "Process" ADD COLUMN     "processCategoryId" TEXT;

-- CreateTable
CREATE TABLE "ProcessCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "ProcessCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessCategory_name_key" ON "ProcessCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessCategory_slug_key" ON "ProcessCategory"("slug");

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_targetGroupId_fkey" FOREIGN KEY ("targetGroupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_processCategoryId_fkey" FOREIGN KEY ("processCategoryId") REFERENCES "ProcessCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessRequest" ADD CONSTRAINT "ProcessRequest_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
