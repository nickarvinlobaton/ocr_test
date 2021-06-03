(async () => {
  const vision = require("@google-cloud/vision");

  const config = {
    keyFilename: "key.json",
  };

  const client = new vision.ImageAnnotatorClient(config);

  client
    .textDetection("https://storage.googleapis.com/certovax-images/vaccination/51_vaccine_25746446a43ab00235ed79c1a7d87175.jpg")
    .then((results) => {
      const result = results[0].textAnnotations;

      console.log(JSON.stringify(result));
    })
    .catch((err) => {
      console.error("ERROR:", err);
    });
})();