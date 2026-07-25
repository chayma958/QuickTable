-- AlterEnum
BEGIN;
CREATE TYPE "OrderType_new" AS ENUM ('DINE_IN');
ALTER TABLE "Order" ALTER COLUMN "type" TYPE "OrderType_new" USING ("type"::text::"OrderType_new");
ALTER TYPE "OrderType" RENAME TO "OrderType_old";
ALTER TYPE "OrderType_new" RENAME TO "OrderType";
DROP TYPE "public"."OrderType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerEmail";

