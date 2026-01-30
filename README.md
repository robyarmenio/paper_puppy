# 🐶 Tamagotchi Cucciolo - v0.1

Progetto Phaser 3 + TypeScript per creare un Tamagotchi virtuale con tua figlia Lisa.

## 📦 Setup Iniziale

### 1. Installa dipendenze
```bash
npm install
```

### 2. Avvia development server
```bash
npm run dev
```

Il gioco si aprirà automaticamente su `http://localhost:3000`

### 3. Build per produzione
```bash
npm run build
```
I file compilati saranno in `dist/` (pronti per deploy su Azure Static Web Apps)

---

## 🎮 v0.1 - Cosa funziona

✅ **Sfondo scrollabile**
- Tap/click a sinistra dello schermo → sfondo scorre a destra
- Tap/click a destra dello schermo → sfondo scorre a sinistra
- Zona centrale "dead" per evitare scroll accidentali

✅ **Cucciolo statico**
- Sprite placeholder al centro (cerchio arancione)
- Pronto per essere sostituito con disegni di Lisa

✅ **Struttura progetto**
```
tamagotchi-v01/
├── src/
│   ├── scenes/
│   │   └── GameScene.ts      ← Logica gioco principale
│   ├── entities/
│   │   └── Puppy.ts           ← Classe cucciolo
│   ├── config/
│   │   └── GameConfig.ts      ← Costanti configurabili
│   └── main.ts                ← Entry point Phaser
├── public/
│   └── assets/
│       └── sprites/           ← Qui metterai PNG di Lisa
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🖼️ Come sostituire placeholder con disegni di Lisa

### Passo 1: Prepara gli sprite
1. Lisa disegna il cucciolo "Idle" su carta
2. Scansiona/fotografa il disegno
3. Rimuovi sfondo con [remove.bg](https://www.remove.bg)
4. Salva come `puppy-idle.png` in `public/assets/sprites/`

### Passo 2: Aggiorna il codice
In `src/scenes/GameScene.ts`, sostituisci il metodo `preload()`:

```typescript
preload(): void {
  // Carica sprite veri invece di placeholder
  this.load.image('puppy-idle', 'assets/sprites/puppy-idle.png');
  this.load.image('background-casa', 'assets/sprites/background-casa.png');
}
```

E rimuovi (o commenta) il metodo `createPlaceholderAssets()`.

---

## 🔧 Configurazione

Tutte le costanti modificabili sono in `src/config/GameConfig.ts`:

```typescript
export const GameConfig = {
  WIDTH: 800,                      // Larghezza canvas
  HEIGHT: 600,                     // Altezza canvas
  BACKGROUND_SCROLL_SPEED: 100,    // Velocità scroll (px/sec)
  PUPPY_X: 400,                    // Posizione X cucciolo
  PUPPY_Y: 450,                    // Posizione Y cucciolo
  TAP_DEAD_ZONE: 50                // Zona centrale non-cliccabile
};
```

Sperimenta con questi valori per trovare il feeling giusto!

---

## 🚀 Prossimi passi (v0.2)

- [ ] Aggiungere animazione "corsa" al cucciolo
- [ ] Implementare porta per accesso al giardino
- [ ] Creare scena "Giardino"
- [ ] Sistema di cambio scena

---

## 🐛 Troubleshooting

**Il gioco non parte?**
- Verifica che Node.js sia installato: `node --version`
- Cancella `node_modules` e reinstalla: `rm -rf node_modules && npm install`

**Lo scroll è troppo veloce/lento?**
- Modifica `BACKGROUND_SCROLL_SPEED` in `GameConfig.ts`

**Voglio vedere le hitbox per debug?**
- In `main.ts`, metti `debug: true` nella configurazione physics

---

## 📱 Test su mobile

1. Trova l'IP della tua macchina: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
2. Avvia dev server: `npm run dev`
3. Sul telefono, vai a `http://TUO_IP:3000`
4. Aggiungi alla home screen per test PWA

---

**Buon divertimento! 🐕**
