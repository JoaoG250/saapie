/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `ProcessRequestAttachment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProcessRequestAttachment_url_key" ON "ProcessRequestAttachment"("url");
