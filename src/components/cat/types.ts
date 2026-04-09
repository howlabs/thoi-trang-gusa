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
  | "laugh";

export type Emotion = "smug" | "surprised" | "happy" | "sleepy" | "angry" | "cute" | "cool" | "love" | "sad" | "mischievous" | "shocked";
export type Outfit = "cape" | "suit" | "sweater" | "ninja" | "beach";
export type Hat = "crown" | "tophat" | "none" | "sunglasses" | "wizard" | "cap" | "headband";

export interface CatAppearance {
  emotion: Emotion;
  outfit: Outfit;
  hat: Hat;
}

// Map each action to a specific combination of items and expressions
export const ACTION_CONFIG: Record<CatState, CatAppearance> = {
  idle: { emotion: "smug", outfit: "cape", hat: "crown" },
  walk: { emotion: "smug", outfit: "suit", hat: "tophat" },
  run: { emotion: "angry", outfit: "ninja", hat: "headband" },
  jump: { emotion: "surprised", outfit: "cape", hat: "tophat" },
  sleep: { emotion: "sleepy", outfit: "sweater", hat: "none" },
  groom: { emotion: "cute", outfit: "beach", hat: "none" },
  stretch: { emotion: "happy", outfit: "sweater", hat: "cap" },
  look: { emotion: "mischievous", outfit: "suit", hat: "tophat" },
  scratch: { emotion: "angry", outfit: "ninja", hat: "none" },
  pounce: { emotion: "mischievous", outfit: "ninja", hat: "headband" },
  lay: { emotion: "sleepy", outfit: "sweater", hat: "none" },
  fly: { emotion: "happy", outfit: "cape", hat: "wizard" },
  whine: { emotion: "sad", outfit: "sweater", hat: "cap" },
  dance: { emotion: "cool", outfit: "beach", hat: "sunglasses" },
  eat: { emotion: "love", outfit: "beach", hat: "none" },
  hide: { emotion: "shocked", outfit: "ninja", hat: "none" },
  attack: { emotion: "angry", outfit: "ninja", hat: "headband" },
  celebrate: { emotion: "happy", outfit: "suit", hat: "crown" },
  work: { emotion: "sad", outfit: "suit", hat: "tophat" },
  laugh: { emotion: "happy", outfit: "beach", hat: "cap" },
};
