-- CreateEnum
CREATE TYPE "KitchenNoteReason" AS ENUM ('ITEM_UNAVAILABLE', 'PREPARATION_DELAYED', 'NEED_CLARIFICATION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "KitchenNoteStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "servedByUserId" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "removedAt" TIMESTAMP(3),
ADD COLUMN     "removedByUserId" TEXT;

-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "assignedWaiterId" TEXT;

-- CreateTable
CREATE TABLE "KitchenNote" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "tableId" TEXT,
    "reason" "KitchenNoteReason" NOT NULL,
    "message" TEXT,
    "status" "KitchenNoteStatus" NOT NULL DEFAULT 'OPEN',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),

    CONSTRAINT "KitchenNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KitchenNote_restaurantId_status_idx" ON "KitchenNote"("restaurantId", "status");

-- CreateIndex
CREATE INDEX "KitchenNote_orderId_idx" ON "KitchenNote"("orderId");

-- CreateIndex
CREATE INDEX "KitchenNote_tableId_idx" ON "KitchenNote"("tableId");

-- CreateIndex
CREATE INDEX "Order_servedByUserId_idx" ON "Order"("servedByUserId");

-- CreateIndex
CREATE INDEX "Table_assignedWaiterId_idx" ON "Table"("assignedWaiterId");

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_assignedWaiterId_fkey" FOREIGN KEY ("assignedWaiterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitchenNote" ADD CONSTRAINT "KitchenNote_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitchenNote" ADD CONSTRAINT "KitchenNote_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitchenNote" ADD CONSTRAINT "KitchenNote_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitchenNote" ADD CONSTRAINT "KitchenNote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_servedByUserId_fkey" FOREIGN KEY ("servedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_removedByUserId_fkey" FOREIGN KEY ("removedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

