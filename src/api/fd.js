import * as faceapi from 'face-api.js';

// load models
export const loadModels = async () => {
  const MODEL_URL = import.meta.env.BASE_URL + '/models';

  await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
};

export const getAllFaces = async (blob, inputSize = 512) => {
  // get image
  const img = await faceapi.fetchImage(blob);

  // options tinyFaceDetector
  let scoreThreshold = 0.5;
  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold,
  });

  //   detect all faces
  const allFaces = await faceapi
    .detectAllFaces(img, options)
    .withFaceLandmarks(true)
    .withFaceDescriptors();

  return allFaces;
};
