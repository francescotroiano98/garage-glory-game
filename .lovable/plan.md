## Piano: Collection avanzata + missioni veicoli

### 1. Nomi veicoli deterministici (fondazione)
- In `src/data/cars.ts`, `motorcycles.ts`, `trucks.ts`: aggiungere accanto agli array `*_IMAGES` un array parallelo `*_NAMES` (10 nomi per categoria) — uno specifico nome per ogni immagine (es. "Rusty Bug", "Old Beetle"...).
- Helper `getVehicleNameByImage(category, variant)` in nuovo file `src/data/vehicleNames.ts`.
- Aggiornare la generazione veicoli (in `cars.ts`/`motorcycles.ts`/`trucks.ts` o dove avviene `generateCar`/spawn newspaper) così che name = `getVehicleNameByImage(category, imageVariant)`. Solo prezzo e parti rotte restano random.
- `getCardName` in `cards.ts` userà lo stesso helper invece di `Categoria #N`.

### 2. Bonus collezione completa per veicolo
- Nuovo concetto: un veicolo (category+variant) è "completato" se possiedi base + reverse + gold di quella variante.
- Helper in `cards.ts`: `isVehicleCompleted(state, category, variant)` e `getCompletedVehiclesCount(state)`.
- Quando in Newspaper / generazione un veicolo è completato → sconto **15%** sul prezzo d'acquisto. Mostrare badge "🏆 Collection -15%" sulla card del veicolo nel newspaper.
- Applicare lo sconto nel listing prezzo + nel buy/negotiation (`OfficeScreen` / dovunque venga calcolato il prezzo finale d'acquisto).

### 3. Pulsante "Vendi tutti i duplicati" nella Collection
- In `CollectionScreen.tsx`: nuovo bottone in header (accanto al progress) "Vendi duplicati (€X)".
- Helper `sellAllDuplicates(state)` in `cards.ts`: per ogni carta con qty>1 lascia 1, somma valori per rarità.
- Conferma con dialog prima di vendere. Toast con totale.

### 4. Card più "3D" stile raccoglitore
- Sostituire i bottoni-card flat con uno stile sleeve da raccoglitore:
  - Sfondo "pagina" del raccoglitore con texture (gradient + inner shadow) e griglia con "tasche" trasparenti per carte mancanti.
  - Carte possedute: tilt 3D leggero al hover/press (`transform: perspective(600px) rotateX/rotateY`), bordo lucido, riflesso diagonale (gradient overlay), shadow drop più profonda. Per gold: shimmer animato; per reverse: glow olografico animato (gradient conic).
- Aggiungere keyframes `holo-shine` e `gold-shimmer` in `index.css`/tailwind config.

### 5. Animazione apertura pacchetto figurine
- Nello `ShopScreen` (o dove si aprono i pacchetti) creare componente `PackOpeningAnimation`:
  - Step 1: pacchetto al centro che vibra/scuote (`animate-shake`).
  - Step 2: foil che si lacera (clip-path animation con flash bianco).
  - Step 3: carte che escono una per una con flip 3D (rotateY 0→180), rivelando immagine; rarità "reverse"/"gold" ottengono particelle/sparkle e suono.
  - Tap per skippare alla prossima carta.
- Aggiungere keyframes `pack-shake`, `pack-rip`, `card-flip` e particelle.

### 6. Nuove missioni
- In `src/data/dailyChallenges.ts` aggiungere template:
  - **Daily**: "Apri 1 pacchetto", "Ottieni 3 carte nuove", "Vendi 5 duplicati", "Ottieni 1 carta Reverse o Gold".
  - **Weekly/achievement**: "Completa 1 veicolo (base+reverse+gold)", "Completa 5 veicoli", "Raggiungi 25% / 50% / 100% di completamento collezione".
- Hook progresso: contatori in `GameContext` o tramite eventi quando si aprono pacchetti / si vendono duplicati / si completa un veicolo. Aggiornamento al salvataggio collection.

### Dettagli tecnici
- Tutti gli stili nuovi via design tokens (`--primary`, `--accent`, gradient personalizzati in `index.css`).
- Sconto applicato in un solo punto: helper `getVehiclePurchasePrice(vehicle, collection)` riutilizzato da newspaper/office.
- Migrazione dolce: i nomi cambieranno per veicoli già spawnati solo se ricalcolati; per save esistenti lasciamo il nome salvato com'è.
- Localizzazione (EN/IT) per tutte le nuove stringhe via `LanguageContext`.
- Nessuna modifica DB necessaria (tutto client-side).

### File principali toccati
- `src/data/{cars,motorcycles,trucks,cards,dailyChallenges}.ts`
- nuovo `src/data/vehicleNames.ts`
- `src/components/game/screens/{CollectionScreen,ShopScreen,NewspaperScreen,OfficeScreen}.tsx`
- nuovo `src/components/game/PackOpeningAnimation.tsx`
- `src/index.css`, `tailwind.config.ts`
- `src/contexts/LanguageContext.tsx` (stringhe nuove)
