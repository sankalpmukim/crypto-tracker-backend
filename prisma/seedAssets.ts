import { PrismaClient, Prisma, CoinAssetType } from "@prisma/client";
import fs from "fs";
const prisma = new PrismaClient();

// read "metadata_new.json" file
fs.readFile("./metadata/metadata_new.json", "utf8", async (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // parse JSON object
  const metadata = JSON.parse(data);

  const arr: CoinAssetType[] = metadata.map(
    (m: any) => m.asset_id_base as CoinAssetType
  );

  await prisma.coin.createMany({
    data: arr.map((a) => ({ coin: a })),
    skipDuplicates: true,
  });
  console.log("done");
});
