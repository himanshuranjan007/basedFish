
import Player from './entities/Player';
import Fish from './entities/Fish';
import Food from './entities/Food';
import Bubble from './entities/Bubble';
import { loadImages, loadSounds } from './utils/assetLoader';
import { Assets, GameAssets } from './types/Assets';
import { FishType } from './types/GameTypes';

class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private smallFish: Fish[] = [];
  private enemyFish: Fish[] = [];
  private foods: Food[] = [];
  private bubbles: Bubble[] = [];
  private assets: Assets = { images: {}, sounds: {} };
  private score: number = 0;
  private isRunning: boolean = false;
  private lastTimestamp: number = 0;
  private smallFishTimer: number = 0;
  private enemyFishTimer: number = 0;
  private foodTimer: number = 0;
  private mousePosition = { x: 0, y: 0 };
  private mobileDirection = { x: 0, y: 0 };
  private isMobileControl: boolean = false;
  private onGameOver: (score: number, size: number) => void;
  private onScoreUpdate: (score: number) => void;
  private onPlayerSizeUpdate: (size: number) => void;
  private onPlayerPositionUpdate: (x: number, y: number) => void;
  private animationFrameId: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    onGameOver: (score: number, size: number) => void,
    onScoreUpdate: (score: number) => void,
    onPlayerSizeUpdate: (size: number) => void,
    onPlayerPositionUpdate: (x: number, y: number) => void
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = context;
    this.onGameOver = onGameOver;
    this.onScoreUpdate = onScoreUpdate;
    this.onPlayerSizeUpdate = onPlayerSizeUpdate;
    this.onPlayerPositionUpdate = onPlayerPositionUpdate;
    
    // Initialize player at center of canvas
    this.player = new Player(
      canvas.width / 2,
      canvas.height / 2,
      10, // Initial size
      5,  // Speed
      100 // Health
    );
    
    // Set up mouse movement listener
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    
    // Check if on mobile
    this.isMobileControl = window.innerWidth < 768;
    window.addEventListener('resize', this.checkMobile);
  }

  private checkMobile = () => {
    this.isMobileControl = window.innerWidth < 768;
  };

  private handleMouseMove = (event: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.mousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  public setMobileDirection(x: number, y: number): void {
    this.mobileDirection = { x, y };
  }

  public async start(): Promise<void> {
    if (this.isRunning) return;
    
    try {
      // Load game assets
      this.assets = await this.loadGameAssets();
      
      // Reset game state
      this.reset();
      
      // Start game loop
      this.isRunning = true;
      this.lastTimestamp = performance.now();
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
      
      // Play background music
      this.playBackgroundMusic();
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  }

  private async loadGameAssets(): Promise<Assets> {
    const imageAssets: GameAssets['images'] = {
      playerFish: '/api/proxy?imageUrl=https://raw.githubusercontent.com/placeholder/fish-game-assets/main/player-fish.png',
      smallFish: '/api/proxy?imageUrl=https://raw.githubusercontent.com/placeholder/fish-game-assets/main/small-fish.png',
      enemyFish: '/api/proxy?imageUrl=https://raw.githubusercontent.com/placeholder/fish-game-assets/main/enemy-fish.png',
      food: '/api/proxy?imageUrl=https://raw.githubusercontent.com/placeholder/fish-game-assets/main/food.png',
      bubble: '/api/proxy?imageUrl=https://raw.githubusercontent.com/placeholder/fish-game-assets/main/bubble.png',
      background: '/api/proxy?imageUrl=https://raw.githubusercontent.com/placeholder/fish-game-assets/main/ocean-bg.png',
    };
    
    const soundAssets: GameAssets['sounds'] = {
      eat: '/api/proxy?soundUrl=https://raw.githubusercontent.com/placeholder/fish-game-assets/main/eat-sound.mp3',
      background: '/api/proxy?soundUrl=https://raw.githubusercontent.com/placeholder/fish-game-assets/main/background-music.mp3',
      gameOver: '/api/proxy?soundUrl=https://raw.githubusercontent.com/placeholder/fish-game-assets/main/game-over.mp3',
    };
    
    // Since we don't have actual assets, we'll create placeholder colored shapes
    // In a real implementation, you would load the actual images and sounds
    const images = await loadImages(imageAssets);
    const sounds = await loadSounds(soundAssets);
    
    return { images, sounds };
  }

  private reset(): void {
    // Reset game state
    this.score = 0;
    this.onScoreUpdate(this.score);
    
    this.smallFish = [];
    this.enemyFish = [];
    this.foods = [];
    this.bubbles = [];
    
    // Reset player
    this.player = new Player(
      this.canvas.width / 2,
      this.canvas.height / 2,
      10, // Initial size
      5,  // Speed
      100 // Health
    );
    this.onPlayerSizeUpdate(this.player.size);
    this.onPlayerPositionUpdate(this.player.x, this.player.y);
    
    // Initialize game entities
    this.initializeEntities();
    
    // Reset timers
    this.smallFishTimer = 0;
    this.enemyFishTimer = 0;
    this.foodTimer = 0;
  }

  private initializeEntities(): void {
    // Create initial small fish
    for (let i = 0; i < 20; i++) {
      this.createFish(FishType.SMALL);
    }
    
    // Create initial enemy fish
    for (let i = 0; i < 10; i++) {
      this.createFish(FishType.ENEMY);
    }
    
    // Create initial food
    for (let i = 0; i < 50; i++) {
      this.createFood();
    }
    
    // Create bubbles for decoration
    for (let i = 0; i < 20; i++) {
      this.createBubble();
    }
  }

  private createFish(type: FishType): void {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;
    
    let size: number;
    let speed: number;
    let health: number;
    
    if (type === FishType.SMALL) {
      size = 5 + Math.random() * 3; // 5-8
      speed = 3;
      health = 10;
      
      if (this.smallFish.length < 30) {
        const fish = new Fish(x, y, size, speed, health, type);
        this.smallFish.push(fish);
      }
    } else {
      size = 15 + Math.random() * 15; // 15-30
      speed = 2 + Math.random() * 2; // 2-4
      health = 50;
      
      if (this.enemyFish.length < 20) {
        const fish = new Fish(x, y, size, speed, health, type);
        this.enemyFish.push(fish);
      }
    }
  }

  private createFood(): void {
    if (this.foods.length < 100) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const food = new Food(x, y, 3); // Size 3
      this.foods.push(food);
    }
  }

  private createBubble(): void {
    const x = Math.random() * this.canvas.width;
    const y = this.canvas.height + Math.random() * 20; // Start below the canvas
    const size = 2 + Math.random() * 8; // Random size between 2-10
    const speed = 0.5 + Math.random() * 1.5; // Random speed
    
    const bubble = new Bubble(x, y, size, speed);
    this.bubbles.push(bubble);
  }

  private gameLoop = (timestamp: number): void => {
    if (!this.isRunning) return;
    
    const deltaTime = (timestamp - this.lastTimestamp) / 1000; // Convert to seconds
    this.lastTimestamp = timestamp;
    
    this.update(deltaTime);
    this.render();
    
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number): void {
    // Update player
    const targetPosition = this.isMobileControl && (this.mobileDirection.x !== 0 || this.mobileDirection.y !== 0)
      ? {
          x: this.player.x + this.mobileDirection.x * 100,
          y: this.player.y + this.mobileDirection.y * 100
        }
      : this.mousePosition;
    
    this.player.update(deltaTime, targetPosition);
    this.handleBoundaryWrapping(this.player);
    this.onPlayerSizeUpdate(this.player.size);
    this.onPlayerPositionUpdate(this.player.x, this.player.y);
    
    // Update small fish
    this.updateFish(this.smallFish, deltaTime, FishType.SMALL);
    
    // Update enemy fish
    this.updateFish(this.enemyFish, deltaTime, FishType.ENEMY);
    
    // Update food
    this.foods.forEach(food => {
      // Check if player eats food
      if (this.checkCollision(this.player, food)) {
        this.player.grow(0.5);
        this.score += 1;
        this.onScoreUpdate(this.score);
        this.playEatSound();
        
        // Remove eaten food
        const index = this.foods.indexOf(food);
        if (index !== -1) {
          this.foods.splice(index, 1);
        }
      }
    });
    
    // Update bubbles
    this.bubbles = this.bubbles.filter(bubble => {
      bubble.update(deltaTime);
      return bubble.y + bubble.size > 0; // Keep bubbles that are still on screen
    });
    
    // Randomly add new bubbles
    if (Math.random() < 0.05) {
      this.createBubble();
    }
    
    // Spawn new entities based on timers
    this.updateSpawnTimers(deltaTime);
  }

  private updateFish(fishArray: Fish[], deltaTime: number, type: FishType): void {
    for (let i = fishArray.length - 1; i >= 0; i--) {
      const fish = fishArray[i];
      fish.update(deltaTime);
      this.handleBoundaryWrapping(fish);
      
      // Check collision with player
      if (this.checkCollision(this.player, fish)) {
        if (this.player.size > fish.size) {
          // Player eats fish
          this.player.grow(1);
          this.score += 5;
          this.onScoreUpdate(this.score);
          this.playEatSound();
          fishArray.splice(i, 1);
        } else {
          // Fish eats player
          this.gameOver();
          return;
        }
      }
      
      // Check collision with other fish
      for (let j = fishArray.length - 1; j >= 0; j--) {
        if (i !== j) {
          const otherFish = fishArray[j];
          if (this.checkCollision(fish, otherFish)) {
            if (fish.size > otherFish.size) {
              // Fish eats other fish
              fish.grow(0.5);
              fishArray.splice(j, 1);
              if (i > j) i--;
            }
          }
        }
      }
      
      // Check collision with fish of other type
      const otherFishArray = type === FishType.SMALL ? this.enemyFish : this.smallFish;
      for (let j = otherFishArray.length - 1; j >= 0; j--) {
        const otherFish = otherFishArray[j];
        if (this.checkCollision(fish, otherFish)) {
          if (fish.size > otherFish.size) {
            // Fish eats other fish
            fish.grow(0.5);
            otherFishArray.splice(j, 1);
          } else {
            // Other fish eats fish
            otherFish.grow(0.5);
            fishArray.splice(i, 1);
            break;
          }
        }
      }
      
      // Check if fish eats food
      for (let j = this.foods.length - 1; j >= 0; j--) {
        const food = this.foods[j];
        if (this.checkCollision(fish, food)) {
          fish.grow(0.2);
          this.foods.splice(j, 1);
        }
      }
    }
  }

  private updateSpawnTimers(deltaTime: number): void {
    // Update small fish spawn timer
    this.smallFishTimer += deltaTime;
    if (this.smallFishTimer >= 10) { // Every 10 seconds
      this.smallFishTimer = 0;
      this.createFish(FishType.SMALL);
    }
    
    // Update enemy fish spawn timer
    this.enemyFishTimer += deltaTime;
    if (this.enemyFishTimer >= 20) { // Every 20 seconds
      this.enemyFishTimer = 0;
      this.createFish(FishType.ENEMY);
    }
    
    // Update food spawn timer
    this.foodTimer += deltaTime;
    if (this.foodTimer >= 5) { // Every 5 seconds
      this.foodTimer = 0;
      // Add 5 new food items
      for (let i = 0; i < 5; i++) {
        this.createFood();
      }
    }
  }

  private handleBoundaryWrapping(entity: Player | Fish): void {
    // Wrap around screen boundaries
    if (entity.x < 0) {
      entity.x = this.canvas.width;
    } else if (entity.x > this.canvas.width) {
      entity.x = 0;
    }
    
    if (entity.y < 0) {
      entity.y = this.canvas.height;
    } else if (entity.y > this.canvas.height) {
      entity.y = 0;
    }
  }

  private checkCollision(entity1: Player | Fish | Food, entity2: Fish | Food): boolean {
    const dx = entity1.x - entity2.x;
    const dy = entity1.y - entity2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < (entity1.size + entity2.size) / 2;
  }

  private render(): void {
    // Clear canvas
    this.ctx.fillStyle = '#1e3a8a'; // Deep blue for ocean
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw bubbles
    this.bubbles.forEach(bubble => {
      this.drawBubble(bubble);
    });
    
    // Draw food
    this.foods.forEach(food => {
      this.drawFood(food);
    });
    
    // Draw small fish
    this.smallFish.forEach(fish => {
      this.drawFish(fish, FishType.SMALL);
    });
    
    // Draw enemy fish
    this.enemyFish.forEach(fish => {
      this.drawFish(fish, FishType.ENEMY);
    });
    
    // Draw player
    this.drawPlayer();
  }

  private drawPlayer(): void {
    this.ctx.save();
    this.ctx.translate(this.player.x, this.player.y);
    
    // Rotate to face direction of movement
    const angle = Math.atan2(
      this.player.direction.y,
      this.player.direction.x
    );
    this.ctx.rotate(angle);
    
    // Draw fish body
    this.ctx.fillStyle = '#ff9900'; // Orange
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, this.player.size, this.player.size / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw tail
    this.ctx.fillStyle = '#ff7700';
    this.ctx.beginPath();
    this.ctx.moveTo(-this.player.size, 0);
    this.ctx.lineTo(-this.player.size * 1.5, -this.player.size / 2);
    this.ctx.lineTo(-this.player.size * 1.5, this.player.size / 2);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Draw eye
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(this.player.size / 2, -this.player.size / 4, this.player.size / 5, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    this.ctx.arc(this.player.size / 2 + 2, -this.player.size / 4, this.player.size / 10, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  private drawFish(fish: Fish, type: FishType): void {
    this.ctx.save();
    this.ctx.translate(fish.x, fish.y);
    
    // Rotate to face direction of movement
    const angle = Math.atan2(fish.direction.y, fish.direction.x);
    this.ctx.rotate(angle);
    
    // Draw fish body
    if (type === FishType.SMALL) {
      this.ctx.fillStyle = '#66ccff'; // Light blue
    } else {
      this.ctx.fillStyle = '#cc3333'; // Red
    }
    
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, fish.size, fish.size / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw tail
    this.ctx.fillStyle = type === FishType.SMALL ? '#3399ff' : '#992222';
    this.ctx.beginPath();
    this.ctx.moveTo(-fish.size, 0);
    this.ctx.lineTo(-fish.size * 1.5, -fish.size / 2);
    this.ctx.lineTo(-fish.size * 1.5, fish.size / 2);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Draw eye
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(fish.size / 2, -fish.size / 4, fish.size / 5, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    this.ctx.arc(fish.size / 2 + 1, -fish.size / 4, fish.size / 10, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  private drawFood(food: Food): void {
    this.ctx.fillStyle = '#00ff00'; // Green
    this.ctx.beginPath();
    this.ctx.arc(food.x, food.y, food.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawBubble(bubble: Bubble): void {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // Add a little shine to the bubble
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.arc(bubble.x - bubble.size / 3, bubble.y - bubble.size / 3, bubble.size / 4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private gameOver(): void {
    this.isRunning = false;
    this.playGameOverSound();
    this.onGameOver(this.score, this.player.size);
  }

  public pause(): void {
    this.isRunning = false;
    this.pauseBackgroundMusic();
  }

  public resume(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTimestamp = performance.now();
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
      this.resumeBackgroundMusic();
    }
  }

  public stop(): void {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);
    this.stopBackgroundMusic();
    
    // Remove event listeners
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.checkMobile);
  }

  private playEatSound(): void {
    try {
      if (this.assets.sounds.eat) {
        const sound = this.assets.sounds.eat.cloneNode() as HTMLAudioElement;
        sound.volume = 0.3;
        sound.play();
      }
    } catch (error) {
      console.error('Error playing eat sound:', error);
    }
  }

  private playGameOverSound(): void {
    try {
      if (this.assets.sounds.gameOver) {
        const sound = this.assets.sounds.gameOver.cloneNode() as HTMLAudioElement;
        sound.volume = 0.5;
        sound.play();
      }
    } catch (error) {
      console.error('Error playing game over sound:', error);
    }
  }

  private playBackgroundMusic(): void {
    try {
      if (this.assets.sounds.background) {
        const bgMusic = this.assets.sounds.background as HTMLAudioElement;
        bgMusic.loop = true;
        bgMusic.volume = 0.2;
        bgMusic.play();
      }
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  }

  private pauseBackgroundMusic(): void {
    try {
      if (this.assets.sounds.background) {
        const bgMusic = this.assets.sounds.background as HTMLAudioElement;
        bgMusic.pause();
      }
    } catch (error) {
      console.error('Error pausing background music:', error);
    }
  }

  private resumeBackgroundMusic(): void {
    try {
      if (this.assets.sounds.background) {
        const bgMusic = this.assets.sounds.background as HTMLAudioElement;
        bgMusic.play();
      }
    } catch (error) {
      console.error('Error resuming background music:', error);
    }
  }

  private stopBackgroundMusic(): void {
    try {
      if (this.assets.sounds.background) {
        const bgMusic = this.assets.sounds.background as HTMLAudioElement;
        bgMusic.pause();
        bgMusic.currentTime = 0;
      }
    } catch (error) {
      console.error('Error stopping background music:', error);
    }
  }
}

export default Game;