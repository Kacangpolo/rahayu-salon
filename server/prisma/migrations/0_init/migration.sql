-- CreateExtension
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
CREATE TYPE "Channel" AS ENUM ('WHATSAPP', 'GCAL');
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "startAt" TIMESTAMPTZ NOT NULL,
    "endAt" TIMESTAMPTZ NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "googleEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationOutbox" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "channel" "Channel" NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 5,
    "nextAttemptAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "errorLog" TEXT,

    CONSTRAINT "NotificationOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationOutbox_bookingId_channel_key" ON "NotificationOutbox"("bookingId", "channel");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationOutbox" ADD CONSTRAINT "NotificationOutbox_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- EXCLUSION CONSTRAINT
ALTER TABLE "Booking"
ADD CONSTRAINT booking_no_overlap
EXCLUDE USING gist (
  "resourceId" WITH =,
  tstzrange("startAt", "endAt", '[)') WITH &&
)
WHERE ("status" IN ('PENDING', 'CONFIRMED'));
