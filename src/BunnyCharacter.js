/**
 * BunnyCharacter - System for creating cute cartoon-style bunny characters
 * Supports multiple characters, poses, and accessories
 * Art style: 2D cartoon, clean outlines, soft shading, warm colors, child-friendly
 */

class BunnyCharacter {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.name = config.name || 'Bunny';
        this.furColor = config.furColor || 0xFFFFFF;
        this.earColor = config.earColor || 0xFFB6C1;
        this.eyeColor = config.eyeColor || 0x4A90E2;
        this.personality = config.personality || 'friendly';
        this.accessories = config.accessories || [];
        this.size = config.size || 80; // Base size for the bunny
    }

    /**
     * Generate a bunny texture for a specific pose
     * @param {string} pose - The pose name (running, jumping, waving, sitting, dancing, idle, surprised, happy, holding)
     * @param {string} objectType - Optional object type when pose is 'holding' (flower, carrot, star)
     * @returns {string} Texture key name
     */
    generateTexture(pose = 'idle', objectType = null) {
        const textureKey = `bunny_${this.name.toLowerCase()}_${pose}${objectType ? '_' + objectType : ''}`;
        
        // Check if texture already exists
        if (this.scene.textures.exists(textureKey)) {
            return textureKey;
        }

        const size = this.size;
        const graphics = this.scene.add.graphics();
        
        // Draw bunny based on pose
        this.drawBunnyPose(graphics, pose, objectType, size);
        
        // Generate texture
        graphics.generateTexture(textureKey, size, size);
        graphics.destroy();
        
        return textureKey;
    }

    /**
     * Draw bunny in a specific pose
     */
    drawBunnyPose(graphics, pose, objectType, size) {
        const centerX = size / 2;
        const centerY = size / 2;
        const bodyRadius = size * 0.2;
        const earWidth = size * 0.15;
        const earHeight = size * 0.3;
        
        // Draw based on pose
        switch(pose) {
            case 'running':
                this.drawRunningPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight);
                break;
            case 'jumping':
                this.drawJumpingPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight);
                break;
            case 'waving':
                this.drawWavingPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight);
                break;
            case 'sitting':
                this.drawSittingPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight);
                break;
            case 'dancing':
                this.drawDancingPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight);
                break;
            case 'surprised':
                this.drawSurprisedPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight);
                break;
            case 'happy':
                this.drawHappyPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight);
                break;
            case 'holding':
                this.drawHoldingPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight, objectType);
                break;
            case 'idle':
            default:
                this.drawIdlePose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight);
                break;
        }
    }

    /**
     * Draw base bunny body parts (used by all poses)
     */
    drawBaseBunny(graphics, centerX, centerY, bodyRadius, earWidth, earHeight, earAngle = 0, bodyOffsetY = 0) {
        // Body with soft shading
        // Main body circle
        graphics.fillStyle(this.furColor, 1);
        graphics.fillCircle(centerX, centerY + bodyOffsetY, bodyRadius);
        
        // Soft highlight on body
        graphics.fillStyle(0xFFFFFF, 0.3);
        graphics.fillCircle(centerX - bodyRadius * 0.3, centerY + bodyOffsetY - bodyRadius * 0.3, bodyRadius * 0.4);
        
        // Ears
        const earLeftX = centerX - bodyRadius * 0.6;
        const earRightX = centerX + bodyRadius * 0.6;
        const earY = centerY - bodyRadius * 0.8 + bodyOffsetY;
        
        // Left ear (ellipse, slight angle effect by offsetting)
        graphics.fillStyle(this.furColor, 1);
        if (earAngle !== 0) {
            // Apply slight rotation effect by adjusting position
            const offsetX = Math.sin(earAngle) * earHeight * 0.2;
            const offsetY = -Math.cos(earAngle) * earHeight * 0.2;
            graphics.fillEllipse(earLeftX + offsetX, earY + offsetY, earWidth, earHeight);
        } else {
            graphics.fillEllipse(earLeftX, earY, earWidth, earHeight);
        }
        
        // Right ear
        if (earAngle !== 0) {
            const offsetX = -Math.sin(earAngle) * earHeight * 0.2;
            const offsetY = -Math.cos(earAngle) * earHeight * 0.2;
            graphics.fillEllipse(earRightX + offsetX, earY + offsetY, earWidth, earHeight);
        } else {
            graphics.fillEllipse(earRightX, earY, earWidth, earHeight);
        }
        
        // Inner ears (pink)
        graphics.fillStyle(this.earColor, 1);
        graphics.fillEllipse(earLeftX, earY + earHeight * 0.1, earWidth * 0.6, earHeight * 0.7);
        graphics.fillEllipse(earRightX, earY + earHeight * 0.1, earWidth * 0.6, earHeight * 0.7);
        
        // Eyes
        const eyeSize = bodyRadius * 0.25;
        const eyeLeftX = centerX - bodyRadius * 0.3;
        const eyeRightX = centerX + bodyRadius * 0.3;
        const eyeY = centerY - bodyRadius * 0.2 + bodyOffsetY;
        
        // Eye whites
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillCircle(eyeLeftX, eyeY, eyeSize);
        graphics.fillCircle(eyeRightX, eyeY, eyeSize);
        
        // Eye color
        graphics.fillStyle(this.eyeColor, 1);
        graphics.fillCircle(eyeLeftX, eyeY, eyeSize * 0.7);
        graphics.fillCircle(eyeRightX, eyeY, eyeSize * 0.7);
        
        // Eye highlights
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillCircle(eyeLeftX - eyeSize * 0.2, eyeY - eyeSize * 0.2, eyeSize * 0.3);
        graphics.fillCircle(eyeRightX - eyeSize * 0.2, eyeY - eyeSize * 0.2, eyeSize * 0.3);
        
        // Pupils
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(eyeLeftX, eyeY, eyeSize * 0.4);
        graphics.fillCircle(eyeRightX, eyeY, eyeSize * 0.4);
        
        // Nose
        graphics.fillStyle(0xFF69B4, 1);
        const noseY = centerY + bodyRadius * 0.1 + bodyOffsetY;
        graphics.fillTriangle(centerX, noseY, centerX - bodyRadius * 0.15, noseY + bodyRadius * 0.2, centerX + bodyRadius * 0.15, noseY + bodyRadius * 0.2);
        
        // Fluffy tail
        const tailX = centerX + bodyRadius * 0.7;
        const tailY = centerY + bodyRadius * 0.5 + bodyOffsetY;
        graphics.fillStyle(this.furColor, 1);
        graphics.fillCircle(tailX, tailY, bodyRadius * 0.4);
        graphics.fillStyle(0xFFFFFF, 0.3);
        graphics.fillCircle(tailX - bodyRadius * 0.1, tailY - bodyRadius * 0.1, bodyRadius * 0.2);
    }

    /**
     * Draw idle standing pose
     */
    drawIdlePose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight) {
        this.drawBaseBunny(graphics, centerX, centerY, bodyRadius, earWidth, earHeight, 0, 0);
        this.drawMouth(graphics, centerX, centerY + bodyRadius * 0.3, bodyRadius, 'smile');
        this.drawAccessories(graphics, centerX, centerY, bodyRadius);
    }

    /**
     * Draw running pose
     */
    drawRunningPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight) {
        // Body tilted forward, ears back
        this.drawBaseBunny(graphics, centerX, centerY, bodyRadius, earWidth, earHeight, -0.3, bodyRadius * 0.1);
        
        // Arms (front paws) extended
        graphics.fillStyle(this.furColor, 1);
        graphics.fillEllipse(centerX - bodyRadius * 0.5, centerY + bodyRadius * 0.3, bodyRadius * 0.2, bodyRadius * 0.15);
        graphics.fillEllipse(centerX + bodyRadius * 0.5, centerY + bodyRadius * 0.3, bodyRadius * 0.2, bodyRadius * 0.15);
        
        // Legs (back paws) extended
        graphics.fillEllipse(centerX - bodyRadius * 0.3, centerY + bodyRadius * 0.6, bodyRadius * 0.25, bodyRadius * 0.2);
        graphics.fillEllipse(centerX + bodyRadius * 0.3, centerY + bodyRadius * 0.6, bodyRadius * 0.25, bodyRadius * 0.2);
        
        this.drawMouth(graphics, centerX, centerY + bodyRadius * 0.3, bodyRadius, 'excited');
    }

    /**
     * Draw jumping pose
     */
    drawJumpingPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight) {
        // Body higher, ears up, arms raised
        this.drawBaseBunny(graphics, centerX, centerY - bodyRadius * 0.3, bodyRadius, earWidth, earHeight, 0.2, 0);
        
        // Arms raised
        graphics.fillStyle(this.furColor, 1);
        graphics.fillEllipse(centerX - bodyRadius * 0.5, centerY - bodyRadius * 0.5, bodyRadius * 0.2, bodyRadius * 0.25);
        graphics.fillEllipse(centerX + bodyRadius * 0.5, centerY - bodyRadius * 0.5, bodyRadius * 0.2, bodyRadius * 0.25);
        
        // Legs extended down
        graphics.fillEllipse(centerX - bodyRadius * 0.3, centerY + bodyRadius * 0.4, bodyRadius * 0.25, bodyRadius * 0.3);
        graphics.fillEllipse(centerX + bodyRadius * 0.3, centerY + bodyRadius * 0.4, bodyRadius * 0.25, bodyRadius * 0.3);
        
        this.drawMouth(graphics, centerX, centerY - bodyRadius * 0.1, bodyRadius, 'excited');
    }

    /**
     * Draw waving pose
     */
    drawWavingPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight) {
        this.drawBaseBunny(graphics, centerX, centerY, bodyRadius, earWidth, earHeight, 0, 0);
        
        // One arm raised and waving
        graphics.fillStyle(this.furColor, 1);
        graphics.fillEllipse(centerX + bodyRadius * 0.6, centerY - bodyRadius * 0.3, bodyRadius * 0.2, bodyRadius * 0.3);
        // Paw at end of arm
        graphics.fillCircle(centerX + bodyRadius * 0.75, centerY - bodyRadius * 0.4, bodyRadius * 0.15);
        
        // Other arm at side
        graphics.fillEllipse(centerX - bodyRadius * 0.4, centerY + bodyRadius * 0.2, bodyRadius * 0.18, bodyRadius * 0.2);
        
        this.drawMouth(graphics, centerX, centerY + bodyRadius * 0.3, bodyRadius, 'smile');
    }

    /**
     * Draw sitting pose
     */
    drawSittingPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight) {
        // Body lower, more rounded
        const bodyY = centerY + bodyRadius * 0.2;
        this.drawBaseBunny(graphics, centerX, bodyY, bodyRadius, earWidth, earHeight, 0, -bodyRadius * 0.1);
        
        // Body more oval when sitting
        graphics.fillStyle(this.furColor, 1);
        graphics.fillEllipse(centerX, bodyY, bodyRadius * 1.2, bodyRadius * 1.1);
        
        // Legs visible in front
        graphics.fillEllipse(centerX - bodyRadius * 0.3, bodyY + bodyRadius * 0.4, bodyRadius * 0.3, bodyRadius * 0.25);
        graphics.fillEllipse(centerX + bodyRadius * 0.3, bodyY + bodyRadius * 0.4, bodyRadius * 0.3, bodyRadius * 0.25);
        
        // Arms resting
        graphics.fillEllipse(centerX - bodyRadius * 0.4, bodyY + bodyRadius * 0.1, bodyRadius * 0.2, bodyRadius * 0.15);
        graphics.fillEllipse(centerX + bodyRadius * 0.4, bodyY + bodyRadius * 0.1, bodyRadius * 0.2, bodyRadius * 0.15);
        
        this.drawMouth(graphics, centerX, bodyY + bodyRadius * 0.2, bodyRadius, 'gentle');
    }

    /**
     * Draw dancing pose
     */
    drawDancingPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight) {
        // Body tilted, one leg up
        this.drawBaseBunny(graphics, centerX, centerY, bodyRadius, earWidth, earHeight, 0.1, 0);
        
        // Arms raised and out
        graphics.fillStyle(this.furColor, 1);
        graphics.fillEllipse(centerX - bodyRadius * 0.6, centerY - bodyRadius * 0.4, bodyRadius * 0.2, bodyRadius * 0.3);
        graphics.fillEllipse(centerX + bodyRadius * 0.6, centerY - bodyRadius * 0.4, bodyRadius * 0.2, bodyRadius * 0.3);
        
        // One leg up, one leg down
        graphics.fillEllipse(centerX - bodyRadius * 0.3, centerY + bodyRadius * 0.2, bodyRadius * 0.25, bodyRadius * 0.3);
        graphics.fillEllipse(centerX + bodyRadius * 0.3, centerY + bodyRadius * 0.5, bodyRadius * 0.25, bodyRadius * 0.25);
        
        this.drawMouth(graphics, centerX, centerY + bodyRadius * 0.3, bodyRadius, 'bigSmile');
        
        // Magic sparkles around dancing bunny
        this.drawSparkles(graphics, centerX, centerY, bodyRadius);
    }

    /**
     * Draw surprised pose
     */
    drawSurprisedPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight) {
        // Ears straight up
        this.drawBaseBunny(graphics, centerX, centerY, bodyRadius, earWidth, earHeight, 0, 0);
        
        // Bigger, rounder eyes
        const eyeSize = bodyRadius * 0.3;
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillCircle(centerX - bodyRadius * 0.3, centerY - bodyRadius * 0.2, eyeSize);
        graphics.fillCircle(centerX + bodyRadius * 0.3, centerY - bodyRadius * 0.2, eyeSize);
        
        graphics.fillStyle(this.eyeColor, 1);
        graphics.fillCircle(centerX - bodyRadius * 0.3, centerY - bodyRadius * 0.2, eyeSize * 0.8);
        graphics.fillCircle(centerX + bodyRadius * 0.3, centerY - bodyRadius * 0.2, eyeSize * 0.8);
        
        // Small pupils (surprised)
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(centerX - bodyRadius * 0.3, centerY - bodyRadius * 0.2, eyeSize * 0.3);
        graphics.fillCircle(centerX + bodyRadius * 0.3, centerY - bodyRadius * 0.2, eyeSize * 0.3);
        
        // Mouth open (O shape)
        graphics.fillStyle(0xFF69B4, 1);
        graphics.fillCircle(centerX, centerY + bodyRadius * 0.3, bodyRadius * 0.15);
        
        // Arms up
        graphics.fillStyle(this.furColor, 1);
        graphics.fillEllipse(centerX - bodyRadius * 0.5, centerY - bodyRadius * 0.3, bodyRadius * 0.2, bodyRadius * 0.25);
        graphics.fillEllipse(centerX + bodyRadius * 0.5, centerY - bodyRadius * 0.3, bodyRadius * 0.2, bodyRadius * 0.25);
    }

    /**
     * Draw happy pose
     */
    drawHappyPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight) {
        this.drawBaseBunny(graphics, centerX, centerY, bodyRadius, earWidth, earHeight, 0, 0);
        
        // Big happy smile
        this.drawMouth(graphics, centerX, centerY + bodyRadius * 0.3, bodyRadius, 'bigSmile');
        
        // Cheeks (blush)
        graphics.fillStyle(0xFFB6C1, 0.5);
        graphics.fillCircle(centerX - bodyRadius * 0.5, centerY + bodyRadius * 0.1, bodyRadius * 0.15);
        graphics.fillCircle(centerX + bodyRadius * 0.5, centerY + bodyRadius * 0.1, bodyRadius * 0.15);
        
        // Arms out (celebrating)
        graphics.fillStyle(this.furColor, 1);
        graphics.fillEllipse(centerX - bodyRadius * 0.6, centerY + bodyRadius * 0.1, bodyRadius * 0.2, bodyRadius * 0.2);
        graphics.fillEllipse(centerX + bodyRadius * 0.6, centerY + bodyRadius * 0.1, bodyRadius * 0.2, bodyRadius * 0.2);
    }

    /**
     * Draw holding an object pose
     */
    drawHoldingPose(graphics, centerX, centerY, bodyRadius, earWidth, earHeight, objectType) {
        this.drawBaseBunny(graphics, centerX, centerY, bodyRadius, earWidth, earHeight, 0, 0);
        
        // One arm extended holding object
        graphics.fillStyle(this.furColor, 1);
        graphics.fillEllipse(centerX + bodyRadius * 0.4, centerY - bodyRadius * 0.1, bodyRadius * 0.2, bodyRadius * 0.25);
        
        // Draw the object
        const objectX = centerX + bodyRadius * 0.65;
        const objectY = centerY - bodyRadius * 0.15;
        
        switch(objectType) {
            case 'flower':
                this.drawFlower(graphics, objectX, objectY, bodyRadius);
                break;
            case 'carrot':
                this.drawCarrot(graphics, objectX, objectY, bodyRadius);
                break;
            case 'star':
                this.drawStar(graphics, objectX, objectY, bodyRadius);
                break;
        }
        
        this.drawMouth(graphics, centerX, centerY + bodyRadius * 0.3, bodyRadius, 'smile');
    }

    /**
     * Draw mouth expressions
     */
    drawMouth(graphics, x, y, bodyRadius, expression) {
        graphics.lineStyle(bodyRadius * 0.08, 0xFF69B4, 1);
        
        switch(expression) {
            case 'smile':
                graphics.beginPath();
                graphics.arc(x, y, bodyRadius * 0.2, 0.2, Math.PI - 0.2, false);
                graphics.strokePath();
                break;
            case 'bigSmile':
                graphics.beginPath();
                graphics.arc(x, y, bodyRadius * 0.25, 0.1, Math.PI - 0.1, false);
                graphics.strokePath();
                break;
            case 'excited':
                graphics.beginPath();
                graphics.arc(x, y, bodyRadius * 0.22, 0.15, Math.PI - 0.15, false);
                graphics.strokePath();
                break;
            case 'gentle':
                graphics.beginPath();
                graphics.arc(x, y, bodyRadius * 0.18, 0.25, Math.PI - 0.25, false);
                graphics.strokePath();
                break;
        }
    }

    /**
     * Draw accessories
     */
    drawAccessories(graphics, centerX, centerY, bodyRadius) {
        this.accessories.forEach(accessory => {
            switch(accessory) {
                case 'scarf':
                    this.drawScarf(graphics, centerX, centerY, bodyRadius);
                    break;
                case 'hat':
                    this.drawMagicHat(graphics, centerX, centerY, bodyRadius);
                    break;
                case 'flower':
                    this.drawFlowerOnEar(graphics, centerX, centerY, bodyRadius);
                    break;
                case 'backpack':
                    this.drawBackpack(graphics, centerX, centerY, bodyRadius);
                    break;
            }
        });
    }

    drawScarf(graphics, centerX, centerY, bodyRadius) {
        graphics.fillStyle(0xFF69B4, 1);
        graphics.fillRect(centerX - bodyRadius * 0.6, centerY - bodyRadius * 0.2, bodyRadius * 1.2, bodyRadius * 0.15);
        // Scarf ends
        graphics.fillRect(centerX - bodyRadius * 0.7, centerY - bodyRadius * 0.15, bodyRadius * 0.2, bodyRadius * 0.1);
        graphics.fillRect(centerX + bodyRadius * 0.5, centerY - bodyRadius * 0.15, bodyRadius * 0.2, bodyRadius * 0.1);
    }

    drawMagicHat(graphics, centerX, centerY, bodyRadius) {
        // Hat base
        graphics.fillStyle(0x9370DB, 1);
        graphics.fillRect(centerX - bodyRadius * 0.3, centerY - bodyRadius * 0.9, bodyRadius * 0.6, bodyRadius * 0.15);
        // Hat top
        graphics.fillStyle(0xFF69B4, 1);
        graphics.fillTriangle(centerX, centerY - bodyRadius * 1.1, centerX - bodyRadius * 0.25, centerY - bodyRadius * 0.75, centerX + bodyRadius * 0.25, centerY - bodyRadius * 0.75);
        // Star on hat
        graphics.fillStyle(0xFFD700, 1);
        this.drawStar(graphics, centerX, centerY - bodyRadius * 0.95, bodyRadius * 0.15);
    }

    drawFlowerOnEar(graphics, centerX, centerY, bodyRadius) {
        const flowerX = centerX - bodyRadius * 0.5;
        const flowerY = centerY - bodyRadius * 0.7;
        this.drawFlower(graphics, flowerX, flowerY, bodyRadius * 0.3);
    }

    drawBackpack(graphics, centerX, centerY, bodyRadius) {
        graphics.fillStyle(0x4A90E2, 1);
        graphics.fillRoundedRect(centerX - bodyRadius * 0.2, centerY + bodyRadius * 0.1, bodyRadius * 0.4, bodyRadius * 0.5, 5);
        // Straps
        graphics.fillRect(centerX - bodyRadius * 0.25, centerY - bodyRadius * 0.1, bodyRadius * 0.1, bodyRadius * 0.3);
        graphics.fillRect(centerX + bodyRadius * 0.15, centerY - bodyRadius * 0.1, bodyRadius * 0.1, bodyRadius * 0.3);
    }

    drawFlower(graphics, x, y, size) {
        const colors = [0xFF69B4, 0xFFD700, 0xFF8C00, 0xFF1493];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Petals
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60) * Math.PI / 180;
            const petalX = x + Math.cos(angle) * size * 0.3;
            const petalY = y + Math.sin(angle) * size * 0.3;
            graphics.fillStyle(color, 1);
            graphics.fillCircle(petalX, petalY, size * 0.2);
        }
        // Center
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillCircle(x, y, size * 0.15);
    }

    drawCarrot(graphics, x, y, size) {
        // Carrot body
        graphics.fillStyle(0xFF8C00, 1);
        graphics.fillTriangle(x, y - size * 0.3, x - size * 0.15, y + size * 0.2, x + size * 0.15, y + size * 0.2);
        // Carrot top (leaves)
        graphics.fillStyle(0x90EE90, 1);
        graphics.fillRect(x - size * 0.05, y - size * 0.35, size * 0.1, size * 0.15);
        graphics.fillRect(x - size * 0.02, y - size * 0.4, size * 0.1, size * 0.12);
    }

    drawStar(graphics, x, y, size) {
        graphics.fillStyle(0xFFD700, 1);
        const points = 5;
        const outerRadius = size;
        const innerRadius = size * 0.5;
        
        graphics.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) {
                graphics.moveTo(px, py);
            } else {
                graphics.lineTo(px, py);
            }
        }
        graphics.closePath();
        graphics.fillPath();
    }

    drawSparkles(graphics, centerX, centerY, bodyRadius) {
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60) * Math.PI / 180;
            const sparkleX = centerX + Math.cos(angle) * bodyRadius * 0.8;
            const sparkleY = centerY + Math.sin(angle) * bodyRadius * 0.8;
            
            graphics.fillStyle(0xFFD700, 1);
            graphics.fillCircle(sparkleX, sparkleY, bodyRadius * 0.08);
            graphics.fillStyle(0xFFFFFF, 0.8);
            graphics.fillCircle(sparkleX, sparkleY, bodyRadius * 0.04);
        }
    }
}

/**
 * Bunny Character Definitions
 * All 8 main characters with their unique colors and personalities
 */
const BUNNY_CHARACTERS = {
    milo: {
        name: 'Milo',
        furColor: 0xFFA500, // Light orange
        earColor: 0xFF8C00, // Darker orange
        eyeColor: 0x4A90E2, // Blue
        personality: 'cheerful, energetic',
        accessories: []
    },
    luna: {
        name: 'Luna',
        furColor: 0xFFFFFF, // Soft white
        earColor: 0xFFB6C1, // Pink
        eyeColor: 0x9370DB, // Purple
        personality: 'gentle, shy',
        accessories: ['flower']
    },
    bibo: {
        name: 'Bibo',
        furColor: 0xD3D3D3, // Light grey
        earColor: 0xC0C0C0, // Silver
        eyeColor: 0x4A90E2, // Blue
        personality: 'curious explorer',
        accessories: ['backpack']
    },
    pinky: {
        name: 'Pinky',
        furColor: 0xFFB6C1, // Pastel pink
        earColor: 0xFF69B4, // Hot pink
        eyeColor: 0xFF1493, // Deep pink
        personality: 'bubbly and sweet',
        accessories: ['scarf']
    },
    sunny: {
        name: 'Sunny',
        furColor: 0xFFD700, // Golden yellow
        earColor: 0xFFA500, // Orange
        eyeColor: 0x4A90E2, // Blue
        personality: 'optimistic, always smiling',
        accessories: []
    },
    blublu: {
        name: 'BluBlu',
        furColor: 0xADD8E6, // Pastel blue
        earColor: 0x87CEEB, // Sky blue
        eyeColor: 0x0000CD, // Blue
        personality: 'calm and smart',
        accessories: []
    },
    cocoa: {
        name: 'Cocoa',
        furColor: 0x8B4513, // Chocolate brown
        earColor: 0xA0522D, // Sienna
        eyeColor: 0x4A90E2, // Blue
        personality: 'brave and protective',
        accessories: []
    },
    minty: {
        name: 'Minty',
        furColor: 0x98FB98, // Mint green
        earColor: 0x90EE90, // Light green
        eyeColor: 0x9370DB, // Purple
        personality: 'magical and mysterious',
        accessories: ['hat']
    }
};

/**
 * Generate all bunny textures for all characters and poses
 * Call this during BootScene to pre-generate all textures
 */
function generateAllBunnyTextures(scene) {
    const poses = ['idle', 'running', 'jumping', 'waving', 'sitting', 'dancing', 'surprised', 'happy'];
    const holdingObjects = ['flower', 'carrot', 'star'];
    
    Object.keys(BUNNY_CHARACTERS).forEach(charKey => {
        const charConfig = BUNNY_CHARACTERS[charKey];
        const bunny = new BunnyCharacter(scene, charConfig);
        
        // Generate all poses
        poses.forEach(pose => {
            bunny.generateTexture(pose);
        });
        
        // Generate holding poses
        holdingObjects.forEach(obj => {
            bunny.generateTexture('holding', obj);
        });
    });
    
    console.log('All bunny character textures generated!');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BunnyCharacter, BUNNY_CHARACTERS, generateAllBunnyTextures };
}

