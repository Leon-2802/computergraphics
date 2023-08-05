/// Planet positioning tools
const M = 1.989 * 10 ^ 30; // mass of the sun in kilograms
const G = 9.81; // Gravitationskonstante in N / kg
// dictionary for necessary planet data
const Planets = {
  "Mercury": { semiMajorAxis: 0.3871, orbitalPeriodInYears: 0.2408, radiusInKM: 2439.7 },
  "Venus": { semiMajorAxis: 0.7233, orbitalPeriodInYears: 0.6152, radiusInKM: 6051.8 },
  "Earth": { semiMajorAxis: 1, orbitalPeriodInYears: 1, radiusInKM: 6371 },
  "Mars": { semiMajorAxis: 1.5273, orbitalPeriodInYears: 1.8809, radiusInKM: 3389.5 },
  "Jupiter": { semiMajorAxis: 5.2028, orbitalPeriodInYears: 11.862, radiusInKM: 69911 },
  "Saturn": { semiMajorAxis: 9.5388, orbitalPeriodInYears: 29.458, radiusInKM: 58232 },
  "Uranus": { semiMajorAxis: 19.1914, orbitalPeriodInYears: 84.01, radiusInKM: 25362 },
  "Neptune": { semiMajorAxis: 30.0611, orbitalPeriodInYears: 164.79, radiusInKM: 24622 },
  "Pluto": { semiMajorAxis: 39.5294, orbitalPeriodInYears: 248.54, radiusInKM: 1188.3 },
};
// sMA definiert die Größe der Umlaufbahn
// große Halbachsen jedes Planetens sind in AU gegeben. 
// "One AU is the average distance from the Sun's center to the Earth's center. It is equal to 149,597,871 km (92,955,807 miles)."
// Source: https://www.windows2universe.org/our_solar_system/planets_orbits_table.html

// this equals the amount of planets stored in the dict, which can be a useful value to use when generating the cans
export const amount = Object.keys(Planets).length;

// berechnung der Planetenpositionen auf Basis der kepler'schen Gesetze mithilfe der obigen Daten
function calculatePlanetPosition(time, planet, speedFactor, planetDistanceScaleFactor) {
  if (speedFactor == undefined) {
    speedFactor = 1;
  }
  if (planetDistanceScaleFactor == undefined) {
    planetDistanceScaleFactor = 1;
  }
  const omega = (2 * Math.PI) / planet.orbitalPeriodInYears; // Winkelgeschwindigkeit -> Winkel, den planet pro zeiteinheit durchläuft
  const sunVolumeOffset = 1;
  const x = (sunVolumeOffset + planet.semiMajorAxis * planetDistanceScaleFactor) * Math.cos(omega * time * speedFactor);
  const y = (sunVolumeOffset + planet.semiMajorAxis * planetDistanceScaleFactor) * Math.sin(omega * time * speedFactor);

  return { x, y };
}

export function getAllPlanetPositions(time, speedFactor, planetDistanceScaleFactor) {
  const coordinates = [];

  for (const key in Planets) {
    var position = calculatePlanetPosition(time, Planets[key], speedFactor, planetDistanceScaleFactor);
    coordinates.push({ x: position.x, y: 0, z: position.y });
  }

  return coordinates;
}

// helper function to determine the neccessary scale of the whole solar system to fit a certain area in the scene
// e.g. 2 meters in the scene -> 0.01011905063066983
export function getScaleForSolarSystem(goalDistInMeters) {
  // how far is it from the furthest can (pluto) to the sun in the solarsystem group?
  // ignoring the radius!
  const positionPlutoXY = calculatePlanetPosition(0, Planets.Pluto);
  const positionPluto = { x: positionPlutoXY.x, y: 0, z: positionPlutoXY.y };
  const positionSun = { x: 0, y: 0, z: 0 };
  const currentDist = getDistanceBetweenVectors(positionPluto, positionSun);

  //return the scale
  return goalDistInMeters / currentDist;
}

//takes two vector2's, returns a number
function getDistanceBetweenVectors(a, b) {
  let z = b.x - a.x;
  let x = b.z - a.z;

  return Math.sqrt(x * x + z * z);
}

// function to get the can scale relative to the sun, the sun being 2 meters wide
function getCanScaleRelativeToSun(planet, lesseningFactor) {
  const sunWidth = 2;
  const rSunWidth = 20000;
  const scaleFactor = sunWidth * lesseningFactor * 0.1 / rSunWidth;

  const rPlanetWidth = planet.radiusInKM;
  const planetWidth = rPlanetWidth * scaleFactor;

  // the can has a scale of 1 already so the new width can be used as scale. 
  return planetWidth;
}

// get all the scales of all the cans for can generation
export function getAllCanScales(lesseningFactor) {
  // factor used to adjust this value with the UI slider. 
  if (lesseningFactor == undefined) {
    lesseningFactor = 1;
  }
  const scales = [];

  for (const key in Planets) {
    var scale = getCanScaleRelativeToSun(Planets[key], lesseningFactor);
    scales.push(scale);
  }
  return scales;
}