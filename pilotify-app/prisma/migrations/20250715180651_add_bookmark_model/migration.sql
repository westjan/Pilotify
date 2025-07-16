-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "offerId" TEXT,
    "pilotProjectId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bookmark_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bookmark_pilotProjectId_fkey" FOREIGN KEY ("pilotProjectId") REFERENCES "PilotProject" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_offerId_key" ON "Bookmark"("userId", "offerId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_pilotProjectId_key" ON "Bookmark"("userId", "pilotProjectId");
