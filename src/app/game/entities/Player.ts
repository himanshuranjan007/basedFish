
interface Position {
    x: number;
    y: number;
  }
  
  class Player {
    public x: number;
    public y: number;
    public size: number;
    public speed: number;
    public health: number;
    public direction: { x: number; y: number };
    private tailAnimation: number = 0;
    private tailAnimationSpeed: number = 5;
  
    constructor(x: number, y: number, size: number, speed: number, health: number) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speed = speed;
      this.health = health;
      this.direction = { x: 1, y: 0 }; // Initially facing right
    }
  
    public update(deltaTime: number, targetPosition: Position): void {
      // Calculate direction to target
      const dx = targetPosition.x - this.x;
      const dy = targetPosition.y - this.y;
      
      // Normalize direction
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length > 0) {
        this.direction = {
          x: dx / length,
          y: dy / length
        };
        
        // Move towards target
        const moveDistance = this.speed * deltaTime * 60; // Scale by 60 for consistent speed regardless of frame rate
        
        // Only move if not already at target
        if (length > 5) {
          this.x += this.direction.x * moveDistance;
          this.y += this.direction.y * moveDistance;
        }
      }
      
      // Update tail animation
      this.tailAnimation += this.tailAnimationSpeed * deltaTime;
      if (this.tailAnimation > Math.PI * 2) {
        this.tailAnimation -= Math.PI * 2;
      }
    }
  
    public grow(amount: number): void {
      this.size += amount;
      
      // Adjust speed as fish grows (slower as it gets bigger)
      this.speed = Math.max(2, 5 - (this.size - 10) / 20);
    }
  
    public takeDamage(amount: number): void {
      this.health -= amount;
    }
  
    public isAlive(): boolean {
      return this.health > 0;
    }
  }
  
  export default Player;