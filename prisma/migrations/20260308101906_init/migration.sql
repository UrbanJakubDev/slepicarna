-- CreateTable
CREATE TABLE "slepicarna_egg_collection" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "countWhite" INTEGER NOT NULL DEFAULT 0,
    "countBrown" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "slepicarna_egg_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slepicarna_transaction" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "slepicarna_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "slepicarna_egg_collection_date_idx" ON "slepicarna_egg_collection"("date");

-- CreateIndex
CREATE INDEX "slepicarna_transaction_date_idx" ON "slepicarna_transaction"("date");
