(async () => {
  const vision = require("@google-cloud/vision");

  const config = {
    keyFilename: "key.json",
  };

  const client = new vision.ImageAnnotatorClient(config);

  client
    .textDetection("vcards/vcard5.jpg")
    .then((results) => {
      const result = results[0].textAnnotations;

      // const result = require('./sample_response/vcard1.js').responses[0].textAnnotations;


      console.log(getNameUsingCoordinates(result));
    })
    .catch((err) => {
      console.error("ERROR:", err);
    });
})();

function getDataUsingIndex(result) {
  const startIndex = result.map(item => {
    return item.description;
  }).indexOf('recibido.');

  const endIndex = result.map(item => {
    return item.description;
  }).indexOf('Last');

  const gap = endIndex - startIndex;
  console.log(gap)

  let firstName = '';
  let lastName = '';
  let middleInitial = '';

  if (gap > 1) {
    lastName = result[startIndex + 1].description;
  }

  if (gap > 2) {
    firstName = result[startIndex + 2].description;
  }

  if (gap > 3) {
    middleInitial = result[startIndex + 3].description
  }

  return {
    lastName,
    firstName,
    middleInitial,
  };
};

function getNameUsingCoordinates(data) {
  // Remove first index as it contains whole vcard
  data.splice(0,1);

  const topElements = data.filter(({ description }) => {
    return description === 'médica' || description === 'vacunas' || description === 'recibido.'
  });

  let topCoordinates= [];
  topElements.forEach(element => {
    topCoordinates.push(element.boundingPoly.vertices[3].y)
  });

  const topCoordinate = Math.min(...topCoordinates);


  const bottomElements = data.filter(({ description }) => {
    return description === 'Last' || description === 'First' || description === 'MI'
  });

  let bottomCoordinates = [];
  bottomElements.forEach(element => {
    bottomCoordinates.push(element.boundingPoly.vertices[0].y)
  });

  const bottomCoordinate = Math.max(...bottomCoordinates);

  const diff = bottomCoordinate - topCoordinate;
  const center = topCoordinate + (diff / 2);

  const nameArray = data.filter(item => {
    return center >= item.boundingPoly.vertices[0].y && center <= item.boundingPoly.vertices[3].y;
    // return item.boundingPoly.vertices[0].y > topCoordinateLimit && item.boundingPoly.vertices[3].y < bottomCoordinateLimit;
  });

  console.log(topCoordinates)
  console.log(bottomCoordinates)
  console.log(topCoordinate)
  console.log(bottomCoordinate)
  console.log(center)

  return nameArray
};