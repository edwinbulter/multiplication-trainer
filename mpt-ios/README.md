# Tafels Oefenen - iOS App

Een iOS app voor het oefenen van tafels, gebouwd met SwiftUI.

## Functies

### Hoofdfuncties
- **Gebruikerslogin**: Voer je naam in om te beginnen
- **Tafel Selectie**: Kies uit vooraf gedefinieerde tafels of voer je eigen getal in
- **Operatie Keuze**: Wissel tussen vermenigvuldigen en delen
- **Interactieve Oefening**: Beantwoord vragen met een virtueel toetsenbord
- **Scorebord**: Bekijk je voortgang en beste tijden
- **Data Opslag**: Slaat scores lokaal op het apparaat op

### Technische Kenmerken
- **Platform**: iOS 15.0+
- **Taal**: Nederlands
- **Framework**: SwiftUI
- **Architectuur**: MVVM (Model-View-ViewModel)
- **Data Opslag**: UserDefaults
- **Distributie**: GitHub Pages (sideloading)

## Project Structuur

```
TafelsOefenen/
├── TafelsOefenen/
│   ├── TafelsOefenenApp.swift      # App entry point
│   ├── ContentView.swift           # Main view controller
│   ├── Models.swift                # Data models and ViewModels
│   ├── Views/                      # SwiftUI views
│   │   ├── LoginView.swift
│   │   ├── TableSelectionView.swift
│   │   ├── PracticeView.swift
│   │   ├── CompletionView.swift
│   │   └── ScoreboardView.swift
│   ├── Extensions/                 # Extensions
│   │   ├── FoundationExtensions.swift
│   │   └── SwiftUIExtensions.swift
│   ├── Utils/                      # Utility classes
│   │   └── StorageManager.swift
│   ├── Resources/                  # Resources and constants
│   │   └── LocalizedStrings.swift
│   ├── Assets.xcassets/            # Images and colors
│   └── Info.plist                  # App configuration
└── TafelsOefenen.xcodeproj/        # Xcode project
```

## Vereisten

- Xcode 15.0+
- iOS 15.0+
- Swift 5.9+
- macOS 13.0+ (voor development)

## Installatie

### Ontwikkelaars

1. Clone de repository:
   ```bash
   git clone https://github.com/edwinbulter/multiplication-trainer.git
   cd multiplication-trainer/mpt-ios/TafelsOefenen
   ```

2. Open het project in Xcode:
   ```bash
   open TafelsOefenen.xcodeproj
   ```

3. Selecteer een simulator of verbonden iOS-apparaat

4. Klik op de "Run" knop (⌘+R) om de app te bouwen en uit te voeren

### Gebruikers

1. Download het `.ipa` bestand van de [GitHub Pages](https://edwinbulter.github.io/multiplication-trainer/mpt-ios/) pagina

2. Volg de installatie-instructies op de downloadpagina

## Gebruik

1. **Start de app** en voer je naam in
2. **Selecteer een tafel** uit de beschikbare opties of voer een eigen getal in
3. **Kies de operatie** (vermenigvuldigen of delen)
4. **Begin de oefening** en beantwoord de vragen
5. **Bekijk je score** na voltooiing in het scoreboard

## Bouwen en Deployen

### Lokale Build

```bash
cd mpt-ios/TafelsOefenen
xcodebuild -project TafelsOefenen.xcodeproj \
           -scheme TafelsOefenen \
           -configuration Release \
           -destination 'generic/platform=iOS' \
           archive
```

### Automated Build

De app wordt automatisch gebouwd en gedeployed naar GitHub Pages via GitHub Actions wanneer er wijzigingen worden gepusht naar de `main` branch.

## Aanpassingen

### Kleuren en Styling

Pas de kleuren aan in `Extensions/SwiftUIExtensions.swift`:

```swift
extension Color {
    static let appBlue = Color(red: 0.0, green: 0.478, blue: 1.0)
    static let appGreen = Color(red: 0.0, green: 0.8, blue: 0.4)
    // ...
}
```

### Teksten

Pas de gelokaliseerde teksten aan in `Resources/LocalizedStrings.swift`.

### Tafels

Pas de vooraf gedefinieerde tafels aan in `Views/TableSelectionView.swift`.

## Troubleshooting

### Build Fouten

1. Zorg dat je de juiste Xcode versie hebt geïnstalleerd
2. Controleer de deployment target (iOS 15.0+)
3. Clean en rebuild het project (⌘+Shift+K)

### Installatie Problemen

1. Zorg dat je een ontwikkelaarsaccount hebt voor sideloading
2. Controleer of het .ipa bestand niet corrupt is
3. Probeer de installatie via Xcode als alternatief

## Toekomstige Ontwikkeling

- [ ] Toevoegen van geluidseffecten
- [ ] Implementeren van achievements
- [ ] Toevoegen van meer talen
- [ ] Cloud synchronisatie voor scores
- [ ] Apple Watch app

## Licentie

Dit project is gelicentieerd onder de MIT Licentie.

## Bijdragen

Bijdragen zijn welkom! Maak een pull request of open een issue voor suggesties en problemen.

## Contact

Voor vragen of feedback, neem contact op via GitHub issues.
