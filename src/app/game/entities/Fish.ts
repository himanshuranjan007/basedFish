
import { FishType } from '../types/GameTypes';

class Fish {
  public x: number;
  public y: number;
  public size: number;
  public speed: number;
  public health: number;
  public type: FishType;
  public direction: { x: number; y: number };
  private directionChangeTimer: number = 0;
  private directionChangeCooldown: number = 2; // Change direction every 2 seconds
  private tailAnimation: number = 0;
  private tailAnimationSpeed: number = 5;

  constructor(x: number, y: number, size: number, speed: number, health: number, type: FishType) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.health = health;
    this.type = type;
    
    // Random initial direction
    const angle = Math.random() * Math.PI * 2;
    this.direction = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
  }

  public update(deltaTime: number): void {
    // Move in current direction
    const moveDistance = this.speed * deltaTime * 60; // Scale by 60 for consistent speed
    this.x += this.direction.x * moveDistance;
    this.y += this.direction.y * moveDistance;
    
    // Update direction change timer
    this.directionChangeTimer += deltaTime;
    if (this.directionChangeTimer >= this.directionChangeCooldown) {
      this.changeDirection();
      this.directionChangeTimer = 0;
    }
    
    // Update tail animation
    this.tailAnimation += this.tailAnimationSpeed * deltaTime;
    if (this.tailAnimation > Math.PI * 2) {
      this.tailAnimation -= Math.PI * 2;
    }
  }

  private changeDirection(): void {
    // Slightly change current direction
    const angleChange = (Math.random() - 0.5) * Math.PI / 2; // -45 to 45 degrees
    const currentAngle = Math.atan2(this.direction.y, this.direction.x);
    const newAngle = currentAngle + angleChange;
    
    this.direction = {
      x: Math.cos(newAngle),
      y: Math.sin(newAngle)
    };
  }

  public grow(amount: number): void {
    this.size += amount;
    
    // Adjust speed as fish grows (slower as it gets bigger)
    if (this.type === FishType.SMALL) {
      this.speed = Math.max(1.5, 3 - (this.size - 5) / 10);
    } else {
      this.speed = Math.max(1, 2 - (this.size - 15) / 30);
    }
  }

  public takeDamage(amount: number): void {
    this.health -= amount;
  }

  public isAlive(): boolean {
    return this.health > 0;
  }
}

export default Fish;