/*
  Warnings:

  - You are about to drop the column `date` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingNumber]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `arrivalBusStop` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingNumber` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureBusStop` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('PERSON', 'LUGGAGE');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "date",
DROP COLUMN "name",
DROP COLUMN "time",
ADD COLUMN     "arrivalBusStop" TEXT NOT NULL,
ADD COLUMN     "bookingDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "bookingNumber" TEXT NOT NULL,
ADD COLUMN     "bookingTime" TEXT NOT NULL,
ADD COLUMN     "departureBusStop" TEXT NOT NULL,
ADD COLUMN     "type" "BookingType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingNumber_key" ON "Booking"("bookingNumber");
