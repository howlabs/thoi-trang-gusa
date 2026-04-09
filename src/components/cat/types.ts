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
export type Outfit = "cape" | "suit" | "sweater" | "ninja" | "beach" | "onepiece" | "naruto" | "saiyan";
export type Hat = "crown" | "tophat" | "none" | "sunglasses" | "wizard" | "cap" | "headband" | "strawhat" | "leafband" | "saiyanhair";

export interface CatAppearance {
  emotion: Emotion;
  outfit: Outfit;
  hat: Hat;
}

// Map each action to a specific combination of items and expressions
export const ACTION_CONFIG: Record<CatState, CatAppearance> = {
  idle: { emotion: "smug", outfit: "cape", hat: "crown" },
  walk: { emotion: "smug", outfit: "suit", hat: "tophat" },
  run: { emotion: "angry", outfit: "naruto", hat: "leafband" },
  jump: { emotion: "surprised", outfit: "saiyan", hat: "saiyanhair" },
  sleep: { emotion: "sleepy", outfit: "sweater", hat: "none" },
  groom: { emotion: "cute", outfit: "beach", hat: "none" },
  stretch: { emotion: "happy", outfit: "onepiece", hat: "strawhat" },
  look: { emotion: "mischievous", outfit: "naruto", hat: "leafband" },
  scratch: { emotion: "angry", outfit: "ninja", hat: "none" },
  pounce: { emotion: "mischievous", outfit: "naruto", hat: "leafband" },
  lay: { emotion: "sleepy", outfit: "onepiece", hat: "strawhat" },
  fly: { emotion: "happy", outfit: "saiyan", hat: "saiyanhair" },
  whine: { emotion: "sad", outfit: "sweater", hat: "cap" },
  dance: { emotion: "cool", outfit: "onepiece", hat: "strawhat" },
  eat: { emotion: "love", outfit: "beach", hat: "none" },
  hide: { emotion: "shocked", outfit: "ninja", hat: "none" },
  attack: { emotion: "angry", outfit: "naruto", hat: "leafband" },
  celebrate: { emotion: "happy", outfit: "onepiece", hat: "strawhat" },
  work: { emotion: "sad", outfit: "suit", hat: "tophat" },
  laugh: { emotion: "happy", outfit: "saiyan", hat: "saiyanhair" },
};
