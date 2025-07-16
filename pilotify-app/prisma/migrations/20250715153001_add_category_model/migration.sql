/*
  Warnings:

  - You are about to drop the column `category` on the `Offer` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "categoryId" TEXT,
    "price" REAL,
    "duration" TEXT,
    "deliverables" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "contactEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Offer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Offer_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("contactEmail", "createdAt", "deliverables", "description", "duration", "id", "ownerId", "price", "status", "title", "updatedAt") SELECT "contactEmail", "createdAt", "deliverables", "description", "duration", "id", "ownerId", "price", "status", "title", "updatedAt" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
