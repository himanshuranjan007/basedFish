
class Bubble {
    public x: number;
    public y: number;
    public size: number;
    public speed: number;
  
    constructor(x: number, y: number, size: number, speed: number) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speed = speed;
    }
  
    public update(deltaTime: number): void {
      // Move bubble upward
      this.y -= this.speed * deltaTime * 60;
      
      // Add slight horizontal wobble
      this.x += Math.sin(this.y / 20) * 0.5;
    }
  }
  
  export default Bubble;