-- AlterTable
ALTER TABLE "Cube" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'stopped',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
