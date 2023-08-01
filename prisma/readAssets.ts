import fs from "fs";

// read "metadata_new.json" file
fs.readFile("./metadata/metadata_new.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // parse JSON object
  const metadata = JSON.parse(data);

  // log JSON object
  // console.log();
  const strData = Array.from(
    new Set(metadata.map((m: any) => m.asset_id_base))
  ).join("\n");

  fs.writeFile("./metadata/assets.txt", strData, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    //file written successfully
  });
});
