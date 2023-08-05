# Group assignment 03 - Final

## Task

The task is to further develop the AR application from the second task, by getting the app to run in AR mode on mobile devices and adding some additional features.

## Rating

The rating will be as follows:

- presentation and idea: 30 %
- WebXR Concept: 40 %
- code quality: 30 %

## Description of our Work

By analyzing the other groups AR setup, we came across some issues in the way we set up the three.js renderer. Fixing those issues made the app able to run in AR mode on mobile devices.

The features we added to the application for this assignement are: 
1. A GUI that lets the user adjust the scale of the planets size, speed and distance to each other
2. A 3D UI floating above the sun showing informations about the currently selected planet (default = earth), although not entirely serious, because we kept the softdrink-theme also for the planet informations
3. A raycast can be shot from the center of the screen, and if it hits one of the planets, it shows the information about the respective planet. (This one is not yet working. We tried to implement a mesh for the pointer of the raycaster in order to make it visible for the user, as there is nothing optical included in it by default. Apart from that we tried several ways to check if the ray has been moved and if a planet intersects with it to be able to display the information of the planet.)

## Want to check it out?
1. Get your smartphone ready and...
    - a. ... open the Chrome browser if you are on Android
    - b. ... if you are on iOS, download the 'WebXR Viewer' application from the App Store and launch it
2. Copy the following link and paste it into the URL/address bar: https://hfu-dm-ecg.github.io/group-assignment-3-final-shadywizards/
