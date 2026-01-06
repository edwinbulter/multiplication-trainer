# Tafels Oefenen - iOS App

Een eenvoudige en effectieve app om de tafels van vermenigvuldiging en deling te oefenen. Gebouwd met SwiftUI voor iOS 15+.

## Inhoudsopgave
- [Functionaliteit](#functionaliteit)
- [Screenshots](#screenshots)
- [Development](#development)
- [Installatie op een iOS Apparaat](#installatie-op-een-ios-apparaat)
- [Technische Details](#technische-details)

## Functionaliteit

De iOS app biedt exact dezelfde functionaliteit als de web versie:

### 🎓 Hoofdfuncties
- **Tafel Selectie**: Kies uit 18 vooraf gedefinieerde tafels (0,125 tot 25) inclusief decimale tafels
- **Operatie Keuze**: Schakel tussen **Vermenigvuldigen** (×) en **Delen** (÷) voor elke tafel
- **Aangepaste Tafels**: Voer elk getal in om specifieke tafels te oefenen
- **Interactieve Oefening**: Beantwoord 10 vragen per sessie met virtueel toetsenbord
- **Scorebord**: Bekijk en beheer je beste tijden per tafel
- **Gebruikersprofielen**: Slaat voortgang per gebruiker op

### 📱 Mobiele Optimalisaties
- **Virtueel Toetsenbord**: Speciaal ontworpen numeriek toetsenbord voor eenvoudige invoer
- **Touch-Optimalisatie**: Grote knoppen en intuïtieve navigatie
- **Offline Modus**: App werkt volledig zonder internetverbinding
- **Systeem Integratie**: Past zich aan aan iOS thema's en navigatie

### 🌙 Dark Mode
- **Automatische ondersteuning**: Volgt de systeeminstellingen van je iPhone
- **Handmatige schakeling**: Kies zelf tussen light en dark mode
- **Optimaliseerde weergave**: Perfect leesbaar in beide modi

## Screenshots

### Light Mode
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="docs/screenshots-light-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.24.25.png" width="200" alt="Login scherm">
  <img src="docs/screenshots-light-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.24.56.png" width="200" alt="Tafel selectie">
  <img src="docs/screenshots-light-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.25.21.png" width="200" alt="Oefenen">
  <img src="docs/screenshots-light-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.26.16.png" width="200" alt="Voltooid">
  <img src="docs/screenshots-light-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.26.48.png" width="200" alt="Scorebord">
  <img src="docs/screenshots-light-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.27.42.png" width="200" alt="Score details">
</div>

### Dark Mode
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="docs/screenshots-dark-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.13.50.png" width="200" alt="Login scherm">
  <img src="docs/screenshots-dark-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.14.33.png" width="200" alt="Tafel selectie">
  <img src="docs/screenshots-dark-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.15.41.png" width="200" alt="Oefenen">
  <img src="docs/screenshots-dark-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.38.31.png" width="200" alt="Voltooid">
  <img src="docs/screenshots-dark-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.18.09.png" width="200" alt="Scorebord">
  <img src="docs/screenshots-dark-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.19.39.png" width="200" alt="Score details">
  <img src="docs/screenshots-dark-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.21.03.png" width="200" alt="Wis scoreboard">
  <img src="docs/screenshots-dark-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.22.23.png" width="200" alt="Bevestiging">
  <img src="docs/screenshots-dark-mode/Simulator Screenshot - iPhone 17 Pro - 2026-01-06 at 17.22.43.png" width="200" alt="Leeg scoreboard">
</div>

## Development

### 📖 Development-documentatie
Bekijk de [gedetailleerde development gids](docs/ios-app-development.md) voor:
- Installatie van de development omgeving
- Projectstructuur en architectuur
- Build-instructies voor local development
- CI/CD setup voor automatische builds
- Testprocedures en best practices

### 🔧 Vereisten voor Development
- **Mac computer** met macOS 12.5+ 
- **Xcode 14.0+** (gratis via Mac App Store)
- **iOS Simulator** voor testen
- **Git** voor versiebeheer

### 🚀 Snel Starten
```bash
# Clone de repository
git clone https://github.com/edwinbulter/multiplication-trainer.git
cd multiplication-trainer/mpt-ios

# Open in Xcode
open TafelsOefenen/TafelsOefenen.xcodeproj

# Run in simulator (⌘R)
```

### 📱 Testen op Echte Apparaten
Voor het testen op echte iOS-apparaten is een **Apple Developer Program** lidmaatschap vereist ($99/jaar). Zie de [installatie sectie](#installatie-op-een-ios-apparaat) voor meer informatie.


## Installatie op een iOS Apparaat

### Vereisten
Om de app op een echt iOS-apparaat (iPhone/iPad) te installeren, heb je nodig:

1. **Apple Developer Program lidmaatschap** ($99/jaar)
   - Vereist voor het maken van certificaten en provisioning profiles
   - Nodig om apps op echte apparaten te testen
   - Jaarlijks vernieuwen

2. **Mac computer**
   - Voor het bouwen van de app met Xcode
   - macOS Monterey (12.5) of nieuwer
   - Xcode 14.0 of nieuwer

3. **iOS Apparaat**
   - iPhone of iPad met iOS 15.0 of nieuwer
   - USB-kabel voor verbinding met Mac

### Installatieproces

#### Optie 1: Lokale Installatie (Aanbevolen)
1. **Installeer Xcode** op je Mac via de Mac App Store
2. **Download de source code** van deze repository
3. **Open het project** in Xcode: `TafelsOefenen.xcodeproj`
4. **Verbind je iPhone/iPad** met je Mac
5. **Selecteer je apparaat** in Xcode (bovenaan)
6. **Klik op de Play-knop** (⌘R) om te bouwen en installeren

#### Optie 2: CI/CD Build (Geavanceerd)
1. **Voltooi de CI/CD setup** zoals beschreven in [ios-app-development.md](docs/ios-app-development.md)
2. **Voeg de benodigde secrets** toe aan GitHub
3. **Wacht op de GitHub Actions build**
4. **Download het .ipa bestand** van GitHub Pages
5. **Installeer met 3uTools** of via Xcode

### Kostenoverzicht

| Item | Kosten | Geldigheid | Opmerkingen |
|------|--------|------------|-------------|
| Apple Developer Program | $99/jaar | 1 jaar | Vereist voor apparaat testing |
| Ontwikkeltools | Gratis | - | Xcode is gratis in Mac App Store |
| App distributie | $0 | - | Geen extra kosten voor TestFlight/App Store |

### Belangrijke Opmerkingen

- **Zonder Apple Developer Program**: Kun je alleen in de iOS Simulator testen
- **Certificaten vervallen**: Elk jaar moet je certificaten vernieuwen
- **Apparaat registratie**: Maximaal 100 testapparaten per jaar
- **Team lidmaatschap**: Individuele accounts zijn goed voor persoonlijk gebruik

## Technische Details

- **Platform**: iOS 15.0+
- **Taal**: Swift
- **Framework**: SwiftUI
- **Architectuur**: MVVM (Model-View-ViewModel)
- **Dataopslag**: Core Data
- **Ondersteuning**: iPhone en iPad
