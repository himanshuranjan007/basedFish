
import { GameAssets } from '../types/Assets';

export const loadImages = async (imageUrls: GameAssets['images']): Promise<{ [key: string]: HTMLImageElement }> => {
  const images: { [key: string]: HTMLImageElement } = {};
  
  // Since we don't have actual image assets, we'll create placeholder colored canvases
  // In a real implementation, you would load the actual images
  
  // Create a function to generate placeholder images
  const createPlaceholderImage = (color: string, width: number, height: number): HTMLImageElement => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
    }
    
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  };
  
  // Create placeholder images for each asset
  images.playerFish = createPlaceholderImage('#ff9900', 40, 20);
  images.smallFish = createPlaceholderImage('#66ccff', 20, 10);
  images.enemyFish = createPlaceholderImage('#cc3333', 60, 30);
  images.food = createPlaceholderImage('#00ff00', 6, 6);
  images.bubble = createPlaceholderImage('#ffffff', 10, 10);
  images.background = createPlaceholderImage('#1e3a8a', 1000, 800);
  
  return images;
};

export const loadSounds = async (soundUrls: GameAssets['sounds']): Promise<{ [key: string]: HTMLAudioElement }> => {
  const sounds: { [key: string]: HTMLAudioElement } = {};
  
  // Since we don't have actual sound assets, we'll create silent audio elements
  // In a real implementation, you would load the actual sounds
  
  // Create silent audio elements
  const createSilentAudio = (): HTMLAudioElement => {
    const audio = new Audio();
    audio.volume = 0;
    return audio;
  };
  
  sounds.eat = createSilentAudio();
  sounds.background = createSilentAudio();
  sounds.gameOver = createSilentAudio();
  
  return sounds;
};