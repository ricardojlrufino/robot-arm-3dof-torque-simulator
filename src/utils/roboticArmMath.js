// Constants
export const GRAVITY = 9.81; // m/s²
export const NM_TO_KGFCM = 10.1972; // Conversion factor from Nm to kgf·cm

// Convert degrees to radians
export const toRadians = (degrees) => degrees * Math.PI / 180;

// Convert centimeters to meters
export const cmToM = (cm) => cm / 100;

// Calculate coordinates for each joint
export const calculateCoordinates = (lengths, angles) => {
  const anglesRad = {
    L1: toRadians(angles.L1),
    L2: toRadians(angles.L2),
    L3: toRadians(angles.L3)
  };

  const coords = {
    M1: { x: 0, y: 0 },
    M2: { 
      x: Math.cos(anglesRad.L1) * lengths.L1, 
      y: -Math.sin(anglesRad.L1) * lengths.L1  // Inverted for SVG coordinate system
    },
    M3: { 
      x: Math.cos(anglesRad.L1) * lengths.L1 + Math.cos(anglesRad.L2) * lengths.L2, 
      y: -Math.sin(anglesRad.L1) * lengths.L1 - Math.sin(anglesRad.L2) * lengths.L2 
    }
  };

  coords.LOAD = { 
    x: coords.M3.x + Math.cos(anglesRad.L3) * lengths.L3, 
    y: coords.M3.y - Math.sin(anglesRad.L3) * lengths.L3 
  };

  return coords;
};

// Calculate torques for each joint
export const calculateTorques = (coordinates, masses, lengths) => {
  // Convert coordinates to meters for torque calculations
  const coordsM = {
    M1: { x: cmToM(coordinates.M1.x), y: cmToM(coordinates.M1.y) },
    M2: { x: cmToM(coordinates.M2.x), y: cmToM(coordinates.M2.y) },
    M3: { x: cmToM(coordinates.M3.x), y: cmToM(coordinates.M3.y) },
    LOAD: { x: cmToM(coordinates.LOAD.x), y: cmToM(coordinates.LOAD.y) }
  };

  // Calculate horizontal distances for torque calculations
  const horizontalDistances = {
    M2fromM1: coordsM.M2.x - coordsM.M1.x,
    M3fromM1: coordsM.M3.x - coordsM.M1.x,
    M3fromM2: coordsM.M3.x - coordsM.M2.x,
    LoadFromM1: coordsM.LOAD.x - coordsM.M1.x,
    LoadFromM2: coordsM.LOAD.x - coordsM.M2.x,
    LoadFromM3: coordsM.LOAD.x - coordsM.M3.x
  };

  // Calculate torques
  const torqueM3 = masses.LOAD * GRAVITY * horizontalDistances.LoadFromM3;

  const torqueM2 = (masses.M3 * GRAVITY * horizontalDistances.M3fromM2) +
                   (masses.LOAD * GRAVITY * horizontalDistances.LoadFromM2);

  const torqueM1 = (masses.M2 * GRAVITY * horizontalDistances.M2fromM1) +
                   (masses.M3 * GRAVITY * horizontalDistances.M3fromM1) +
                   (masses.LOAD * GRAVITY * horizontalDistances.LoadFromM1);

  // Format torque values
  const formatTorque = (torqueNm) => ({
    Nm: Math.abs(torqueNm).toFixed(2),
    kgfcm: (Math.abs(torqueNm) * NM_TO_KGFCM).toFixed(2)
  });

  return {
    M1: formatTorque(torqueM1),
    M2: formatTorque(torqueM2),
    M3: formatTorque(torqueM3)
  };
};