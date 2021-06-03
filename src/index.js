(async () => {
  const vision = require("@google-cloud/vision");

  const client = new vision.ImageAnnotatorClient({ keyFilename: "key.json" });

  client
    .textDetection("sample/original.jpg")
    .then((results) => {
      const result = results[0].textAnnotations;

      console.log(JSON.stringify(result));
    })
    .catch((err) => {
      console.error("ERROR:", err);
    });
})();