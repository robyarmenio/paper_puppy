/**
 * Costanti di configurazione del gioco
 */
export const GameConfig = {
  // Dimensioni canvas
  WIDTH: 2100,
  HEIGHT: 800,
  
  // Velocità scroll sfondo (pixel al secondo)
  BACKGROUND_SCROLL_SPEED: 300,
  
  // Posizione cucciolo (centro schermo)
  PUPPY_X: 1050,
  PUPPY_Y: 650,
  
  // Zona "dead" centrale per evitare scroll accidentali (pixel dal centro)
  TAP_DEAD_ZONE: 50,

  BACKGROUND_WIDTH: 6300 // 3 schermate!
} as const;
