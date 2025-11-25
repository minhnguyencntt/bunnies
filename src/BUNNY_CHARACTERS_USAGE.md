# Bunny Characters Usage Guide

This document explains how to use the BunnyCharacter system to create and display cute cartoon-style bunny characters in the game.

## Overview

The `BunnyCharacter` system provides a comprehensive way to generate all 8 main bunny characters (Milo, Luna, Bibo, Pinky, Sunny, BluBlu, Cocoa, Minty) in various poses programmatically.

## Available Characters

1. **Milo** - Light orange fur, cheerful, energetic
2. **Luna** - Soft white fur, gentle, shy (has flower accessory)
3. **Bibo** - Light grey fur, curious explorer (has backpack)
4. **Pinky** - Pastel pink fur, bubbly and sweet (has scarf)
5. **Sunny** - Golden yellow fur, optimistic, always smiling
6. **BluBlu** - Pastel blue fur, calm and smart
7. **Cocoa** - Chocolate brown fur, brave and protective
8. **Minty** - Mint-green tint fur, magical and mysterious (has magic hat)

## Available Poses

- `idle` - Standing idle
- `running` - Running pose
- `jumping` - Jumping pose
- `waving` - Waving pose
- `sitting` - Sitting pose
- `dancing` - Dancing pose (with sparkles)
- `surprised` - Surprised expression
- `happy` - Happy expression
- `holding` - Holding an object (requires objectType parameter)

## Holding Objects

When using the `holding` pose, specify the object type:
- `flower` - Holding a flower
- `carrot` - Holding a carrot
- `star` - Holding a magic star

## Usage Examples

### Basic Usage - Create a Bunny Character

```javascript
// In your scene's create() method
const milo = new BunnyCharacter(this, BUNNY_CHARACTERS.milo);
const textureKey = milo.generateTexture('idle');
const bunnySprite = this.add.image(400, 300, textureKey);
```

### Create Bunny in Different Poses

```javascript
// Create Luna in dancing pose
const luna = new BunnyCharacter(this, BUNNY_CHARACTERS.luna);
const dancingTexture = luna.generateTexture('dancing');
const lunaSprite = this.add.image(400, 300, dancingTexture);

// Create Pinky holding a flower
const pinky = new BunnyCharacter(this, BUNNY_CHARACTERS.pinky);
const holdingTexture = pinky.generateTexture('holding', 'flower');
const pinkySprite = this.add.image(500, 300, holdingTexture);
```

### Pre-generate All Textures (Recommended)

All bunny textures are automatically generated during BootScene. You can also manually generate them:

```javascript
// Generate all textures for all characters and poses
generateAllBunnyTextures(this);
```

### Using Pre-generated Textures

Once textures are generated, you can use them directly:

```javascript
// Use Milo's running texture
const miloRunning = this.add.image(400, 300, 'bunny_milo_running');

// Use Luna's happy texture
const lunaHappy = this.add.image(500, 300, 'bunny_luna_happy');

// Use Bibo holding a carrot
const biboCarrot = this.add.image(600, 300, 'bunny_bibo_holding_carrot');
```

### Texture Naming Convention

Textures are named using the pattern:
- `bunny_{characterName}_{pose}`
- For holding poses: `bunny_{characterName}_holding_{objectType}`

Examples:
- `bunny_milo_idle`
- `bunny_luna_dancing`
- `bunny_pinky_holding_flower`
- `bunny_sunny_running`

### Creating Custom Bunny

You can also create a custom bunny with your own colors:

```javascript
const customBunny = new BunnyCharacter(this, {
    name: 'CustomBunny',
    furColor: 0xFF69B4,  // Hot pink
    earColor: 0xFF1493,  // Deep pink
    eyeColor: 0x4A90E2,  // Blue
    personality: 'custom',
    accessories: ['scarf']  // Optional accessories
});

const customTexture = customBunny.generateTexture('happy');
const sprite = this.add.image(400, 300, customTexture);
```

### Adding Animations

Once you have a bunny sprite, you can add animations:

```javascript
const milo = this.add.image(400, 300, 'bunny_milo_idle');

// Bounce animation
this.tweens.add({
    targets: milo,
    y: milo.y - 20,
    duration: 500,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
});

// Hop animation
this.tweens.add({
    targets: milo,
    x: milo.x + 100,
    y: milo.y - 50,
    duration: 400,
    yoyo: true,
    repeat: -1,
    ease: 'Bounce.easeOut'
});
```

## Art Style

All bunnies are created with:
- 2D cartoon illustration style
- Clean vector-style bold outlines
- Soft shading and gentle highlights
- Warm & bright color palette
- Soft rounded shapes, big expressive eyes
- Friendly smile, child-safe proportions (big head, small body, fluffy tail)
- Suitable for children ages 4–10

## Accessories

Some characters have accessories:
- **Luna**: Flower on ear
- **Bibo**: Backpack
- **Pinky**: Scarf
- **Minty**: Magic hat

Accessories are automatically included when generating textures for these characters.

## Notes

- All textures are generated programmatically, so no external image files are needed
- Textures are cached after first generation
- Each character maintains consistent proportions and style
- All poses maintain the same character identity and colors

