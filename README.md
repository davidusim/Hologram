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
- **Extensive customization** via CONFIG object in hologram.js
- Advanced animations and interaction effects
- Post-processing bloom effects
- Auto-pilot parameter cycling
- Particle systems with shader materials

## How It Works

The software implements the Pepper's ghost technique:

1. **Four Virtual Cameras**: Positioned at 0°, 90°, 180°, and 270° around the Y-axis
2. **Render-to-Texture**: Each camera renders the scene to an off-screen texture
3. **Trapezoidal Distortion**: Each texture is distorted to match the pyramid face geometry
4. **Composition**: The four distorted views are combined and displayed on screen
5. **Physical Setup**: When viewed through a transparent pyramid placed at 45° to the screen, the distorted views combine to form a 3D hologram

## Files

- `index.html` - Main HTML file with UI and controls
- `hologram.js` - Core Three.js implementation with extensive CONFIG object
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
- **Keyboard Shortcuts**:
  - Spacebar: Toggle animation
  - R: Reset view
  - F: Fullscreen toggle
  - 1-5: Toggle visibility of different object types
  - P: Toggle particle system
  - B: Toggle bloom effect
  - +/-: Increase/decrease animation speed
  - A: Toggle auto-pilot mode
  - C: Cycle object colors

## Pyramid Building Instructions

For the true Pepper's ghost hologram effect, you need to construct a physical pyramid that sits above your screen. Here's a comprehensive guide:

### Materials Needed

1. **Transparent Material** (choose one):
   - **Acrylic Sheet** (recommended): Clear cast acrylic, 1-3mm thick
   - **Glass Picture Frames**: Four identical frames with glass
   - **Clear Report Covers**: Sturdy transparent plastic
   - **DVD/CD Cases**: Clear plastic cases (for small pyramids)
   - **Transparent Folder Dividers**: Office supply stores

2. **Tools**:
   - Sharp utility knife or glass cutter (for acrylic)
   - Ruler or measuring tape
   - Fine-tip permanent marker
   - Cutting mat or protective surface
   - Sandpaper (fine grit, for acrylic edges)
   - Clear tape or adhesive (transparent preferred)
   - Clamps or weights (to hold pieces while drying)
   - Isopropyl alcohol and cloth (for cleaning)

3. **Optional but Helpful**:
   - Laser cutter or CNC (for precise cuts)
   - Heat gun (for bending acrylic, if experienced)
   - Protractor or angle guide
   - Dark cloth or backdrop (to reduce ambient light)

### Pyramid Dimensions

The classic Pepper's ghost pyramid uses a specific ratio for optimal 3D effect:

- **Top Width**: 1 cm (small opening at the peak)
- **Bottom Width**: 6 cm (opening that sits on screen)
- **Height**: 10 cm (from tip to base)
- **Side Length**: ~10.3 cm (calculated from dimensions)

This gives a **1:6 ratio** (top:bottom width) which works well for most screen sizes.

For larger displays, scale up proportionally:
- Small phone/tablet: 0.5:3:5 cm ratio
- Medium monitor/laptop: 1:6:10 cm ratio (standard)
- Large TV/display: 2:12:20 cm ratio

### Step-by-Step Construction

#### Method 1: Four-Piece Pyramid (Recommended)

1. **Create Template**:
   - Draw an isosceles triangle on paper with:
     - Base: 6 cm
     - Sides: 10.3 cm each
     - Height: 10 cm
   - This is one face of your pyramid

2. **Cut Four Identical Pieces**:
   - Trace the triangle onto your transparent material
   - Cut out four identical triangles
   - For acrylic: Score deeply with utility knife, then snap along straight edge
   - For glass: Use glass cutter and running pliers (exercise extreme caution)
   - For plastic: Sharp scissors or utility knife works

3. **Prepare Edges**:
   - Sand acrylic edges lightly with fine sandpaper to remove sharpness
   - Clean all pieces with isopropyl alcohol to remove oils and fingerprints
   - Ensure edges are clean and flat for good adhesion

4. **Assemble the Pyramid**:
   - Lay three pieces flat with edges touching to form a triangular base
   - The fourth piece will be the top
   - Apply clear tape to the inside edges where pieces meet
   - Carefully lift and bring edges together to form the pyramid shape
   - Tape all inside seams securely
   - Reinforce with tape on outside corners if needed
   - Optional: Use transparent epoxy or cyanoacrylate adhesive for permanent bond

5. **Create Base Opening**:
   - The bottom should be open (like a truncated pyramid)
   - Measure and mark a 6cm square opening at the base
   - Trim excess material if your triangles created a closed bottom

#### Method 2: Single-Sheet Foldable Pyramid

1. **Create Net Template**:
   - Draw four equilateral triangles connected in a cross pattern
   - Each triangle: 6cm base, 10cm height
   - Leave small tabs (0.5cm) on edges for gluing

2. **Cut and Fold**:
   - Cut out the entire net as one piece
   - Score along all fold lines with blunt tool (don't cut through)
   - Fold up along scored lines to form pyramid
   - Glue tabs inside to hold shape

3. **Trim Base**:
   - Cut off bottom to create 6cm opening

### Viewing Setup

1. **Positioning**:
   - Place pyramid center-point over the center of your screen
   - Orient so one face is parallel to your viewing angle (typically facing you)
   - The pyramid should sit at approximately **45° angle** to the screen surface
   - Adjust until you see a clear, stable 3D image

2. **Viewing Angle**:
   - View from the **side** of the pyramid, not directly above
   - Ideal angle: 45° from horizontal (eye level with pyramid midpoint)
   - Move around to find the "sweet spot" where all four views fuse

3. **Environment**:
   - **Dim lighting** is crucial - darkness enhances contrast
   - Avoid direct light on screen or pyramid
   - Use a dark backdrop behind the display if possible
   - Ensure screen brightness is high for better visibility

4. **Screen Preparation**:
   - Maximize browser window (F11 for fullscreen)
   - Ensure hologram.js is running smoothly (check FPS counter)
   - Adjust object sizes/speeds via CONFIG if needed for your pyramid

### Troubleshooting

| Problem | Solution |
|---------|----------|
| **Double/triple images** | Pyramid angle incorrect - adjust to exactly 45° |
| **Dim or faint image** | Increase screen brightness, darken room further |
| **Ghosting/blurring** | Clean pyramid surfaces with alcohol, check for scratches |
| **Image too small/large** | Adjust pyramid size or screen distance |
| **Colors washed out** | Reduce ambient light, increase display contrast |
| **Pieces won't stick** | Ensure surfaces are clean, use proper adhesive for material |
| **Unstable/shaky image** | Secure pyramid base with non-transparent stand or weights |

### Safety Considerations

- **Cutting Glass**: Only attempt if experienced - use gloves and eye protection
- **Acrylic Fumes**: Score in well-ventilated area, avoid heating acrylic
- **Sharp Edges**: Always sand or file cut edges smooth
- **Adhesives**: Use in ventilated area, follow manufacturer instructions
- **Supervision**: Minors should have adult supervision for cutting

### Optimization Tips

1. **Material Choice**: Acrylic gives clearest results; glass is heavier but more scratch-resistant
2. **Sealing**: For best results, seal seams with minimal adhesive to avoid internal reflections
3. **Base Stability**: Create a small platform or ring to hold pyramid steady at correct height
4. **Light Control**: Create a hood or baffle around screen edges to prevent light leakage
5. **Multiple Viewing Sides**: The pyramid allows viewing from 4 sides (90° apart) - position audience accordingly
6. **Experimentation**: Try different ratios (1:4, 1:8) for various effects - 1:6 is standard but not absolute

### Advanced Customization

Once your pyramid is built, experiment with these hologram.js adjustments:

- **Object Scale**: Modify CONFIG.objects.[type].size for better fit
- **Animation Speed**: Adjust CONFIG.animation.globalSpeed or individual speeds
- **Color Schemes**: Edit CONFIG.theme.secondaryColors for different palettes
- **Particle Effects**: Toggle and adjust CONFIG.particles for atmospheric effects
- **Bloom Intensity**: Modify CONFIG.postProcessing.bloom for glow effects
- **Auto-Pilot**: Enable for continuously evolving displays (press 'A')

### Mathematical Basis

The 1:6 ratio works because:
- Creates appropriate viewing angles for typical screen distances
- Provides sufficient vertical separation between virtual cameras
- Matches the aspect ratio of human binocular vision for depth perception
- Minimizes keystoning distortion when viewed from 45°

For technical viewers: The ratio balances the frustum size, camera distance, and viewport mapping to create undistorted triangular faces that combine properly in the pyramid.

### Alternative Materials

- **Pre-made Options**: Search for "hologram pyramid" or "Pepper's ghost projector" online
- **CD Cases**: Four clear cases taped together make a quick, small pyramid
- **Picture Frame Hack**: Remove backs from four identical frames, tape glass edges
- **Restaurant Supplies**: Clear plastic cake domes or food covers can be modified
- **Acrylic Rods**: For educational kits, some suppliers sell pre-cut hologram kits

### Final Notes

Remember that this creates an **optical illusion**, not a true volumetric hologram. The effect relies on:
- Persistence of vision
- Binocular depth cues
- Careful light management
- Precise geometric alignment

With careful construction and proper viewing conditions, you can achieve impressive 3D displays that appear to float in space - bringing science fiction holograms into your reality!

Start with a small prototype using CD cases or clear report covers before investing in larger materials. The joy is in both the building and the seeing - enjoy creating your window into another dimension!