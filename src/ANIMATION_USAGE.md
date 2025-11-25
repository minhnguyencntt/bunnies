# Bunny Animation System Usage Guide

This document explains how to use the comprehensive animation system for bunny characters.

## Overview

The `BunnyAnimationGenerator` creates complete sprite sheet animations for all bunny characters with 9 different animation types, all programmatically generated using Phaser graphics.

## Available Animations

### 1. Idle Animation (14 frames)
- Gentle breathing motion
- Slight ear wiggle
- Soft blinking
- Subtle head bob
- Frame rate: 8 fps
- Loops: Yes (with yoyo)

### 2. Run Right (10 frames)
- Natural rhythmic running
- Full leg cycle
- Ear bounce + tail follow-through
- Cheerful expression
- Frame rate: 12 fps
- Loops: Yes

### 3. Run Left (10 frames)
- Properly redrawn (not mirrored)
- Mirror of run-right with correct leg phases
- Frame rate: 12 fps
- Loops: Yes

### 4. Jump (8 frames)
- Squash & stretch animation
- Anticipation → takeoff → mid-air → landing
- Ears flow with gravity
- Frame rate: 15 fps
- Loops: No (one-shot)

### 5. Victory/Celebrate (12 frames)
- Jumping happily
- Sparkle effects
- Big smile and cheerful pose
- Ears lifted upward
- Frame rate: 10 fps
- Loops: Yes

### 6. Sleep (8 frames)
- Bunny lying down
- Breathing cycle
- Ears relaxed
- "Zzz" effect
- Frame rate: 6 fps
- Loops: Yes (with yoyo)

### 7. Hit/Hurt Reaction (5 frames)
- Quick shake, recoil
- Small pain expression (still cute)
- Shock lines
- Frame rate: 15 fps
- Loops: No (one-shot)

### 8. Dance (14 frames)
- Cartoonish bouncing, hopping
- Ear-flapping dance
- Fun, playful movements
- Sparkles
- Frame rate: 12 fps
- Loops: Yes

### 9. Talk (8 frames)
- Mouth opening/closing naturally
- Head bob slightly
- Expressive eyes
- Frame rate: 10 fps
- Loops: Yes

## Usage

### Basic Setup

All animations are automatically generated during BootScene. You can also generate them manually:

```javascript
// Generate all animations for all characters
if (typeof generateAllBunnyAnimations === 'function') {
    generateAllBunnyAnimations(this);
}
```

### Using Animations

Once generated, you can use the animations with any bunny sprite:

```javascript
// Create a bunny sprite
const milo = this.add.sprite(400, 300, 'bunny_milo_idle_sheet', 0);

// Play idle animation
milo.play('bunny_milo_idle');

// Play running animation
milo.play('bunny_milo_runright');

// Play jump animation (one-shot)
milo.play('bunny_milo_jump');

// Play victory animation
milo.play('bunny_milo_victory');
```

### Animation Names

Animation keys follow this pattern:
- `bunny_{characterName}_{animationType}`

Examples:
- `bunny_milo_idle`
- `bunny_luna_runright`
- `bunny_sunny_jump`
- `bunny_pinky_dance`
- `bunny_bibo_talk`

### Sprite Sheet Keys

Sprite sheet texture keys follow this pattern:
- `bunny_{characterName}_{animationType}_sheet`

Examples:
- `bunny_milo_idle_sheet`
- `bunny_luna_runright_sheet`
- `bunny_sunny_jump_sheet`

### Complete Example

```javascript
// In your scene's create() method
class MyScene extends Phaser.Scene {
    create() {
        // Ensure animations are generated
        if (typeof generateAllBunnyAnimations === 'function') {
            generateAllBunnyAnimations(this);
        }
        
        // Create bunny sprite
        const milo = this.add.sprite(400, 300, 'bunny_milo_idle_sheet', 0);
        milo.setScale(2); // Scale up if needed
        
        // Play idle animation
        milo.play('bunny_milo_idle');
        
        // On input, play different animations
        this.input.on('pointerdown', () => {
            // Play jump animation
            milo.play('bunny_milo_jump');
            
            // After jump completes, return to idle
            milo.once('animationcomplete', () => {
                milo.play('bunny_milo_idle');
            });
        });
        
        // Make bunny run when moving
        this.input.keyboard.on('keydown-RIGHT', () => {
            milo.play('bunny_milo_runright');
            this.tweens.add({
                targets: milo,
                x: milo.x + 100,
                duration: 500,
                onComplete: () => {
                    milo.play('bunny_milo_idle');
                }
            });
        });
    }
}
```

### Animation Properties

Each animation has the following properties:
- **Frames**: Number of frames in the animation
- **Frame Width**: 128 pixels
- **Frame Height**: 128 pixels
- **Frame Rate**: Varies by animation type (see list above)
- **Loop**: Most loop, except jump and hit (one-shot)

### Character-Specific Animations

All 8 bunny characters have all 9 animations:
- Milo (orange)
- Luna (white)
- Bibo (grey)
- Pinky (pink)
- Sunny (yellow)
- BluBlu (blue)
- Cocoa (brown)
- Minty (mint-green)

Each character maintains their unique colors and accessories across all animations.

### Tips

1. **Pre-load animations**: Generate all animations in BootScene for best performance
2. **Use appropriate frame rates**: Each animation has an optimized frame rate
3. **Handle one-shot animations**: Jump and hit don't loop, so handle completion events
4. **Scale sprites**: The default size is 128x128, scale as needed for your game
5. **Consistent style**: All animations maintain the same art style and proportions

## Technical Details

### Sprite Sheet Format
- Horizontal sprite sheets
- Transparent background
- 128x128 pixels per frame
- All frames aligned consistently
- Perfect for Phaser 3 spritesheet loader

### Animation Principles
- Squash & stretch (jump animation)
- Anticipation (jump, hit)
- Follow-through (running tail, ears)
- Overlapping action (ear motion, tail swing)
- Timing and spacing (natural movement)

### Performance
- All animations generated programmatically
- No external image files needed
- Cached after first generation
- Efficient for real-time rendering

