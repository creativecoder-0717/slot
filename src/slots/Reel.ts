import * as PIXI from 'pixi.js';
import { AssetLoader } from '../utils/AssetLoader';

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const SPIN_SPEED = 10; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down

export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[];
    private symbolSize: number;
    private symbolCount: number;
    private speed: number = 0;
    private isSpinning: boolean = false;

    constructor(symbolCount: number, symbolSize: number) {
        this.container = new PIXI.Container();
        this.symbols = [];
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;

        this.createSymbols();

        // Add a rectangular mask so symbols outside bounds are not visible
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff, 1);
        mask.drawRect(0, 0, this.symbolCount * this.symbolSize, this.symbolSize);
        mask.endFill();
        this.container.addChild(mask);
        this.container.mask = mask;
    }

    private createSymbols(): void {
        // Create symbols for the reel, arranged horizontally
        for (let i = 0; i < this.symbolCount; i++) {
            const symbol = this.createRandomSymbol();
            symbol.width = this.symbolSize;
            symbol.height = this.symbolSize;
            symbol.x = i * this.symbolSize;
            symbol.y = 0;
            this.container.addChild(symbol);
            this.symbols.push(symbol);
        }
    }

    private createRandomSymbol(): PIXI.Sprite {
        // Get a random symbol texture and create a sprite
        const randomIndex = Math.floor(Math.random() * SYMBOL_TEXTURES.length);
        const textureName = SYMBOL_TEXTURES[randomIndex];
        const texture = AssetLoader.getTexture(textureName);
        return new PIXI.Sprite(texture);
    }

    public update(delta: number): void {
        if (!this.isSpinning && this.speed === 0) return;

        // Move symbols horizontally (leftward)
        if (this.isSpinning) {
            this.speed = SPIN_SPEED;
        }

        const deltaPixels = this.speed * delta;
        const totalWidth = this.symbolCount * this.symbolSize;

        for (const symbol of this.symbols) {
            symbol.x -= deltaPixels;

            // Wrap symbol to the right side when it exits left
            while (symbol.x < -this.symbolSize) {
                symbol.x += totalWidth;
            }
            while (symbol.x >= totalWidth) {
                symbol.x -= totalWidth;
            }
        }

        // If we're stopping, slow down the reel
        if (!this.isSpinning && this.speed > 0) {
            this.speed *= SLOWDOWN_RATE;

            // If speed is very low, stop completely and snap to grid
            if (this.speed < 0.5) {
                this.speed = 0;
                this.snapToGrid();
            }
        }
    }

    private snapToGrid(): void {
        // Snap symbols to horizontal grid positions and normalize ordering
        // Sort by x so they align from left to right
        const sorted = [...this.symbols].sort((a, b) => a.x - b.x);
        for (let i = 0; i < sorted.length; i++) {
            sorted[i].x = i * this.symbolSize;
        }
    }

    public startSpin(): void {
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
    }

    public stopSpin(): void {
        this.isSpinning = false;
        // The reel will gradually slow down in the update method
    }
}
