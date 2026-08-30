-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'completed');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'pending';
