// Source for getting the lights: https://www.maya-ndljk.com/blog/threejs-basic-toon-shader

#include <common>
#include <lights_pars_begin>

varying vec3 vPosition;
varying vec3 eyeVector;
varying vec3 vNormal;
// varying vec3 vViewDir;

uniform float strength;
uniform float detail;
uniform vec4 color;
uniform float brightness;



// calculates brightness values according to angle between normal of the vertex and the vector of the "eye" -> camera
// values are brighter the bigger the angle
float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow(1.0 + dot(eyeVector, worldNormal), 3.0);
}


// results in fragment being fully illuminated if angle to light is below 90°
float Toon(vec3 normal, vec3 lightDir) 
{
    lightDir = lightDir;
    float NdotL = max(0.0, dot(normalize(normal), normalize(lightDir)));

    return floor(NdotL/detail);
}


void main() {
    float fres = Fresnel(eyeVector, vNormal);

    float NdotL = dot(vNormal, directionalLights[0].direction);
    float lightIntensity = floor(NdotL/detail);
    // float lightIntensity = smoothstep(0.0, 0.01, NdotL);
    vec3 directionalLight = directionalLights[0].color * lightIntensity;

    vec4 toon_color = vec4((directionalLight+brightness+color.rgb) * strength, 1.0);
    gl_FragColor = toon_color;
    // gl_FragColor = vec4(mix(toon_color, vec4(fres/1.5), 0.6));
}

