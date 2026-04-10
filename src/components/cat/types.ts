export type CatState = 
  | "idle" 
  | "walk" 
  | "run" 
  | "jump" 
  | "sleep" 
  | "groom" 
  | "stretch" 
  | "look" 
  | "scratch" 
  | "pounce"
  | "lay"
  | "fly"
  | "whine"
  | "dance"
  | "eat"
  | "hide"
  | "attack"
  | "celebrate"
  | "work"
  | "laugh"
  | "cook"
  | "heal"
  | "rule"
  | "space"
  | "magic"
  | "heart"
  | "pet";

export type Emotion = "smug" | "surprised" | "happy" | "sleepy" | "angry" | "cute" | "cool" | "love" | "sad" | "mischievous" | "shocked" | "proud" | "thoughtful" | "dizzy";
export type Outfit = "cape" | "suit" | "ninja" | "onepiece" | "naruto" | "saiyan" | "astronaut" | "chef" | "doctor" | "king" | "wizardrobe" | "akatsuki" | "scout" | "jujutsu" | "gear5";
export type Hat = "crown" | "tophat" | "none" | "sunglasses" | "wizard" | "cap" | "headband" | "strawhat" | "leafband" | "saiyanhair" | "helmet" | "chefhat" | "headmirror" | "rogueband" | "scoutcape" | "blindfold" | "gear5hair";

export interface CatAppearance {
  emotion: Emotion;
  outfit: Outfit;
  hat: Hat;
}

// Map each action to a specific combination of items and expressions
export const ACTION_CONFIG: Record<CatState, CatAppearance> = {
  idle: { emotion: "smug", outfit: "cape", hat: "crown" },
  walk: { emotion: "smug", outfit: "suit", hat: "tophat" },
  run: { emotion: "angry", outfit: "scout", hat: "scoutcape" },
  jump: { emotion: "surprised", outfit: "saiyan", hat: "saiyanhair" },
  sleep: { emotion: "sleepy", outfit: "cape", hat: "none" },
  groom: { emotion: "cute", outfit: "suit", hat: "none" },
  stretch: { emotion: "happy", outfit: "onepiece", hat: "strawhat" },
  look: { emotion: "cool", outfit: "jujutsu", hat: "blindfold" },
  scratch: { emotion: "angry", outfit: "ninja", hat: "none" },
  pounce: { emotion: "mischievous", outfit: "naruto", hat: "leafband" },
  lay: { emotion: "sleepy", outfit: "onepiece", hat: "strawhat" },
  fly: { emotion: "happy", outfit: "saiyan", hat: "saiyanhair" },
  whine: { emotion: "sad", outfit: "cape", hat: "cap" },
  dance: { emotion: "cool", outfit: "onepiece", hat: "strawhat" },
  eat: { emotion: "love", outfit: "onepiece", hat: "none" },
  hide: { emotion: "mischievous", outfit: "akatsuki", hat: "rogueband" },
  attack: { emotion: "angry", outfit: "naruto", hat: "leafband" },
  celebrate: { emotion: "happy", outfit: "scout", hat: "scoutcape" },
  work: { emotion: "sad", outfit: "suit", hat: "tophat" },
  laugh: { emotion: "happy", outfit: "saiyan", hat: "saiyanhair" },
  cook: { emotion: "happy", outfit: "chef", hat: "chefhat" },
  heal: { emotion: "thoughtful", outfit: "doctor", hat: "headmirror" },
  rule: { emotion: "proud", outfit: "king", hat: "crown" },
  space: { emotion: "dizzy", outfit: "astronaut", hat: "helmet" },
  magic: { emotion: "mischievous", outfit: "wizardrobe", hat: "wizard" },
  heart: { emotion: "love", outfit: "cape", hat: "none" },
  pet: { emotion: "cute", outfit: "onepiece", hat: "strawhat" },
};
