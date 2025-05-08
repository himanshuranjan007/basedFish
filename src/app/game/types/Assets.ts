
export interface GameAssets {
    images: {
      playerFish: string;
      smallFish: string;
      enemyFish: string;
      food: string;
      bubble: string;
      background: string;
    };
    sounds: {
      eat: string;
      background: string;
      gameOver: string;
    };
  }
  
  export interface Assets {
    images: {
      [key: string]: HTMLImageElement;
    };
    sounds: {
      [key: string]: HTMLAudioElement;
    };
  }
  