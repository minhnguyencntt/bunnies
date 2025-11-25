# Wise Owl Animation System Usage Guide

This document explains how to use the comprehensive animation system for the wise owl character.

## Overview

The `WiseOwlAnimationGenerator` creates complete sprite sheet animations for the wise owl character with 5 different animation types, all programmatically generated using Phaser graphics.

## Character Description

A friendly, wise white cartoon owl wearing round glasses, cheerful, intelligent, approachable, cute and expressive. The owl features:
- White/cream colored feathers
- Round glasses (characteristic feature)
- Golden/amber eyes
- Expressive wing movements
- Cute, cartoonish style with clean line art
- Vibrant colors and consistent proportions

## Available Animations

### 1. Idle/Neutral Animation (4 frames)
- Calm, relaxed pose
- Slight blinking
- Wings relaxed
- Gentle breathing motion
- Subtle head movement
- Frame rate: 8 fps
- Loops: Yes (with yoyo)

### 2. Cheering/Applauding Animation (6 frames)
- Wings raised in clapping motion
- Eyes bright and wide
- Happy smile
- Head bobbing with excitement
- Frame rate: 10 fps
- Loops: Yes

### 3. Encouraging/Motivating Animation (4 frames)
- Wings slightly stretched forward (encouraging gesture)
- Head nodding
- Friendly, gentle expression
- Frame rate: 8 fps
- Loops: Yes (with yoyo)

### 4. Sad/Disappointed Animation (4 frames)
- Drooping wings
- Eyes slightly closed
- Small frown
- Head slightly down
- Frame rate: 6 fps
- Loops: Yes (with yoyo)

### 5. Celebrating/Excited Animation (6 frames)
- Wings flapping joyfully
- Wide eyes
- Beak open in happiness
- Sparkles around the owl
- Bouncing with excitement
- Magical glow effect
- Frame rate: 12 fps
- Loops: Yes

## Usage

### Basic Setup

All animations are automatically generated during BootScene. You can also generate them manually:

```javascript
// Generate all animations
if (typeof generateWiseOwlAnimations === 'function') {
    generateWiseOwlAnimations(this);
}
```

### Using Animations with WiseOwlCharacter

The easiest way to use the animations is through the `WiseOwlCharacter` class:

```javascript
// Create wise owl
const owl = new WiseOwlCharacter(this, {
    x: 400,
    y: 300,
    size: 120
});

// Create the sprite (animations are auto-generated)
owl.create();

// Play different animations
owl.playAnimation('idle');        // Default idle animation
owl.cheer();                      // Play cheering animation
owl.encourage();                  // Play encouraging animation
owl.showSadness();                // Play sad animation
owl.celebrate();                  // Play celebrating animation
owl.returnToIdle();               // Return to idle
```

### Direct Animation Usage

You can also use the animations directly with Phaser sprites:

```javascript
// Create sprite using one of the sprite sheets
const owlSprite = this.add.sprite(400, 300, 'wise_owl_idle_sheet', 0);
owlSprite.setOrigin(0.5);

// Play idle animation
owlSprite.play('wise_owl_idle');

// Play cheering animation (switch texture first)
owlSprite.setTexture('wise_owl_cheering_sheet', 0);
owlSprite.play('wise_owl_cheering');

// Play encouraging animation
owlSprite.setTexture('wise_owl_encouraging_sheet', 0);
owlSprite.play('wise_owl_encouraging');

// Play sad animation
owlSprite.setTexture('wise_owl_sad_sheet', 0);
owlSprite.play('wise_owl_sad');

// Play celebrating animation
owlSprite.setTexture('wise_owl_celebrating_sheet', 0);
owlSprite.play('wise_owl_celebrating');
```

### Animation Names

Animation keys follow this pattern:
- `wise_owl_{animationType}`

Examples:
- `wise_owl_idle`
- `wise_owl_cheering`
- `wise_owl_encouraging`
- `wise_owl_sad`
- `wise_owl_celebrating`

### Sprite Sheet Keys

Sprite sheet texture keys follow this pattern:
- `wise_owl_{animationType}_sheet`

Examples:
- `wise_owl_idle_sheet`
- `wise_owl_cheering_sheet`
- `wise_owl_encouraging_sheet`
- `wise_owl_sad_sheet`
- `wise_owl_celebrating_sheet`

### Complete Example

```javascript
// In your scene's create() method
class MyScene extends Phaser.Scene {
    create() {
        // Ensure animations are generated
        if (typeof generateWiseOwlAnimations === 'function') {
            generateWiseOwlAnimations(this);
        }
        
        // Create wise owl character
        const owl = new WiseOwlCharacter(this, {
            x: 400,
            y: 300,
            size: 128
        });
        
        owl.create();
        
        // Show dialogue
        owl.showDialogue("Hello! I'm here to help you learn!", 3000);
        
        // On player success, celebrate
        this.input.on('pointerdown', () => {
            owl.celebrate();
            owl.showDialogue("Great job!", 2000);
            
            // Return to idle after celebration
            owl.sprite.once('animationcomplete', () => {
                owl.returnToIdle();
            });
        });
        
        // On player mistake, show sadness
        this.input.keyboard.on('keydown-SPACE', () => {
            owl.showSadness();
            owl.showDialogue("Don't worry, try again!", 2000);
            
            // Return to encouraging after a moment
            this.time.delayedCall(2000, () => {
                owl.encourage();
            });
        });
    }
}
```

### Animation Properties

Each animation has the following properties:
- **Frames**: Number of frames in the animation (4 or 6)
- **Frame Width**: 128 pixels (configurable to 64 for smaller games)
- **Frame Height**: 128 pixels
- **Frame Rate**: Varies by animation type (see list above)
- **Loop**: All animations loop (some with yoyo effect)

### Technical Details

#### Sprite Sheet Format
- Horizontal sprite sheets
- Transparent background
- 128x128 pixels per frame (or 64x64 for smaller games)
- All frames aligned consistently
- Perfect for Phaser 3 spritesheet loader

#### Animation Principles
- Smooth transitions between frames
- Expressive body language
- Wing movements convey emotion
- Eye expressions (blinking, widening, closing)
- Head movements (nodding, bobbing, rotation)
- Magical effects (sparkles, glow) for special animations

#### Performance
- All animations generated programmatically
- No external image files needed
- Cached after first generation
- Efficient for real-time rendering

### Tips

1. **Pre-load animations**: Generate all animations in BootScene for best performance
2. **Use appropriate frame rates**: Each animation has an optimized frame rate
3. **Switch textures when changing animations**: Use `setTexture()` before playing a different animation
4. **Scale sprites**: The default size is 128x128, scale as needed for your game
5. **Consistent style**: All animations maintain the same art style and proportions
6. **Use WiseOwlCharacter class**: It handles texture switching automatically

### Changing Frame Size

To use 64x64 frames instead of 128x128, modify the `WiseOwlAnimationGenerator` constructor:

```javascript
const generator = new WiseOwlAnimationGenerator(scene);
generator.frameWidth = 64;
generator.frameHeight = 64;
generateWiseOwlAnimations(scene);
```

Or modify the class directly in `WiseOwlAnimationGenerator.js`:

```javascript
constructor(scene) {
    this.scene = scene;
    this.frameWidth = 64;  // Change from 128 to 64
    this.frameHeight = 64;
}
```

## Integration with Dialogue System

The `WiseOwlCharacter` class includes a dialogue system that works seamlessly with animations:

```javascript
const owl = new WiseOwlCharacter(this, { x: 400, y: 300 });
owl.create();

// Show encouraging dialogue
owl.encourage();
owl.showDialogue("You can do it! Keep trying!", 3000);

// Show celebration dialogue
owl.celebrate();
owl.showDialogue("Excellent work!", 2000);

// Show sad dialogue
owl.showSadness();
owl.showDialogue("That's okay, let's try again.", 2000);
```

The dialogue automatically appears above the owl and disappears after the specified duration.

