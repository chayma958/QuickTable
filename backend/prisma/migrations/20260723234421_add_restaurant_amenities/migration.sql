-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "acceptsCardPayment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasParking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasWifi" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPetFriendly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isWheelchairAccessible" BOOLEAN NOT NULL DEFAULT false;

