# Model Viewer 'Toon shader combined with Fresnel effect'

## Explanation
This model viewer showcases a classic toon shader combined with a Fresnel effect. The toon shading works by only illuminating fragments where the normals form an angle lower than 90° to the light direction. I have added a Fresnel effect on top of this, which increases the brightness of the fragments based on the angle between the eyeVector and the normals.

When these effects are combined, you achieve a toon shader with a slight metallic appearance, perfectly suited for a robot model.

Note: Unfortunately, there is an issue where rotating the robot does not result in the shader illuminating the areas facing the light. And to help with positioning the light, you can comment line 175 in scene.js back in, to get a test sphere into the scene.

## GitHub pages link
https://hfu-dm-ecg.github.io/assignment-3-model-viewer-Leon-2802/

## Sources:
- how to get the direction of lights in a scene: https://www.maya-ndljk.com/blog/threejs-basic-toon-shader
- code for outline-pass: https://github.com/OmarShehata/webgl-outlines/blob/main/threejs/src/CustomOutlinePass.js
- article about how the outline-pass works: https://omar-shehata.medium.com/how-to-render-outlines-in-webgl-8253c14724f9