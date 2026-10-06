import { useState } from 'react';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let landmarkerPromise;
async function getLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      return PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        numPoses: 1,
      });
    })();
  }
  return landmarkerPromise;
}

/** Detecta hombros con MediaPipe Pose y devuelve coordenadas en la imagen */
export function usePoseDetection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function detect(imageElement) {
    setLoading(true);
    setError(null);
    try {
      const lm = await getLandmarker();
      const result = lm.detect(imageElement);
      const pose = result.landmarks?.[0];
      if (!pose) throw new Error('No se detectó ninguna persona en la imagen');
      const w = imageElement.naturalWidth;
      const h = imageElement.naturalHeight;
      return {
        leftShoulder: { x: pose[11].x * w, y: pose[11].y * h },
        rightShoulder: { x: pose[12].x * w, y: pose[12].y * h },
      };
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { detect, loading, error };
}
