# Hologram Display Software

This project implements a Pepper's ghost hologram display using JavaScript and Three.js. The software creates the illusion of a floating 3D object by rendering four distorted views that, when reflected by a transparent pyramid, appear as a coherent 3D hologram.

## Features

- Real-time 3D rendering with Three.js
- Four-camera system for Pepper's ghost effect
- Trapezoidal distortion mapping for proper pyramid projection
- Interactive controls (spin, reset, fullscreen)
- Performance monitoring (FPS counter)
- Status indicators
- Responsive design

## How It Works

The software implements the Pepper's ghost technique:

1. **Four Virtual Cameras**: Positioned at 0°, 90°, 180°, and 270° around the Y-axis
2. **Render-to-Texture**: Each camera renders the scene to an off-screen texture
3. **Trapezoidal Distortion**: Each texture is distorted to match the pyramid face geometry
4. **Composition**: The four distorted views are combined and displayed on screen
5. **Physical Setup**: When viewed through a transparent pyramid placed at 45° to the screen, the distorted views combine to form a 3D hologram

## Files

- `index.html` - Main HTML file with UI and controls
- `hologram.js` - Core Three.js implementation
- `hologram_design.html` - Original design document (in parent directory)

## Requirements

- Modern web browser with WebGL support
- For physical hologram: Transparent pyramid (acrylic or glass) and a display device

## Setup

1. Open `index.html` in a web browser
2. For best results, use fullscreen mode (F11 or click the fullscreen button)
3. Place a transparent pyramid above the screen at approximately 45° angle
4. View the hologram from the side of the pyramid

## Controls

- **Toggle Spin**: Pause/resume object rotation
- **Reset View**: Reset object rotations to initial position
- **Fullscreen**: Toggle fullscreen mode for better immersion
- **FPS Counter**: Monitors performance in real-time

## Technical Details

The implementation follows the specifications in `hologram_design.html`:

- Uses Three.js r152 for rendering
- Implements orthographic cameras for consistent scaling
- Applies viewport-based rendering for the four-way split
- Includes ambient and directional lighting for proper illumination
- Features multiple 3D objects (tetrahedron, cube, sphere, particle system)
- Provides smooth animation and interaction

## Customization

To modify the hologram content:
- Edit `createObjects()` in `hologram.js` to change 3D models
- Adjust camera parameters in `createCameras()` for different pyramid sizes
- Modify lighting and materials for different visual effects
- Adjust rotation speeds in the `objects` array for different motion

## Notes

This software creates the optical illusion of a hologram using the Pepper's ghost technique. For true holographic light field projection, specialized hardware (lasers, spatial light modulators) would be required. However, this implementation provides an accessible and convincing 3D display using commonly available materials.

For best results:
- Use a bright, high-contrast display
- Construct a pyramid with precise dimensions (typically 1:6 top-to-bottom ratio)
- Perform in a darkened environment to enhance contrast
- Ensure the pyramid is clean and free of scratches