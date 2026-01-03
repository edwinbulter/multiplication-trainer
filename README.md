# Multiplication Trainer

Een React-applicatie voor het oefenen van tafeltjes, gebouwd met **React**, **Vite** en **Tailwind CSS**.  
De applicatie is gedeployed in AWS en kun je uitproberen op [Tafels Oefenen](https://d2zf8l8tihew58.cloudfront.net/).

Dit project bevat drie hoofdcomponenten:
- **Web Applicatie** (src/) - React versie voor browsers
- [**Infrastructuur voor de Web Applicatie**](infrastructure/README.md) (infrastructure/) - Terraform scripts voor AWS deployment
- [**Android Applicatie**](mpt-android/README.md) (mpt-android/) - Native Android versie

## Inhoudsopgave

- [Functionaliteit](#functionaliteit)
  - [Hoofdfuncties (Beide Platforms)](#hoofdfuncties-beide-platforms)
  - [Decimale Ondersteuning](#decimale-ondersteuning)
  - [Data Management](#data-management)
  - [Gebruikerservaring](#gebruikerservaring)
  - [Platform Verschillen](#platform-verschillen)
- [Web Applicatie lokaal ontwikkelen](#web-applicatie-lokaal-ontwikkelen)
  - [Installatie](#installatie)
  - [Applicatie starten](#applicatie-starten)
  - [Applicatie openen in de browser](#applicatie-openen-in-de-browser)
  - [Applicatie stoppen](#applicatie-stoppen)
  - [Productie build](#productie-build)
- [Technische Stack Web Applicatie](#technische-stack-web-applicatie)
  - [Tailwind CSS Implementatie](#tailwind-css-implementatie)
  - [React Router Implementatie](#react-router-implementatie)
  - [Component Architectuur](#component-architectuur)
- [Project Structuur](#project-structuur)
  - [Web Applicatie](#web-applicatie)
  - [Android Applicatie](#android-applicatie)
  - [Infrastructuur voor de Web Applicatie](#infrastructuur-voor-de-web-applicatie)
- [Playwright tests](#playwright-tests)

## Functionaliteit

Zowel de Web Applicatie als de Android App bieden exact dezelfde kernfunctionaliteit voor het oefenen van tafeltjes:

### Hoofdfuncties (Beide Platforms)
- **Tafel Selectie**: Keuze uit 18 vooraf gedefinieerde tafels (0,125, 0,2, 0,25, 0,5, 1, 2, 2,5, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 25)
- **Operatie Keuze**: Schakel tussen **Vermenigvuldigen** (×) en **Delen** (÷) voor elke tafel
- **Aangepaste Tafels**: Mogelijkheid om elk eigen getal in te voeren voor specifieke oefening
- **Interactieve Oefening**: Beantwoord 10 vragen per sessie met directe feedback
- **Virtueel Toetsenbord**: Speciaal ontworpen numeriek toetsenbord voor eenvoudige invoer. In de web applicatie komt dit alleen tevoorschijn als het scherm smaller is dan 750 pixels breed. In de Android app is dit altijd zichtbaar.
- **Scorebord**: Bekijk en beheer beste tijden per tafel met sorteerfunctionaliteit
- **Gebruikersprofielen**: Voortgang opgeslagen per gebruikersnaam

### Decimale Ondersteuning
- **Nederlandse Notatie**: Komma (,) als decimaal scheidingsteken
- **Floating Point Precision**: Accurate verwerking van decimale getallen
- **Consistente Weergave**: Alle getallen getoond met Nederlandse formatting

### Data Management
- **Tijdsmeting**: Precieze meting van oefeningssessies in seconden
- **Score Opslag**: Permanente opslag van beste prestaties
- **Sorteerfunctionaliteit**: Sorteren op tafel, tijd, of datum
- **Data Consistentie**: Identieke datastructuur op beide platforms

### Gebruikerservaring
- **Intuïtieve Interface**: Duidelijke navigatie en consistent design
- **Directe Feedback**: Onmiddellijke validatie van antwoorden
- **Voortgang Tracking**: Zichtbare vraag telling en tijdsindicatie
- **Mobiel Geoptimaliseerd**: Touch-vriendelijke interface voor alle schermformaten

### Platform Verschillen
- **Web App**: Werkt in browsers, vereist internetverbinding, wereldwijde toegang via CloudFront
- **Android App**: Native performance, offline modus, lokale data opslag met Room database

Beide versies garanderen een consistente leerervaring met identieke functionaliteit, ongeacht het gekozen platform.

## Web Applicatie lokaal ontwikkelen

### Installatie
Zorg ervoor dat je Node.js hebt geïnstalleerd, installeer vervolgens de dependencies dmv:
```bash
npm install
```

### Applicatie starten
Om de development server te starten:
```bash
npm run dev
```

### Applicatie openen in de browser
Na het starten van de development server:
1. Open de webbrowser
2. Ga naar `http://localhost:5173` 

### Applicatie stoppen
Om de development server te stoppen:
- Druk op `Ctrl + C` in de terminal waar de server draait
- Of sluit het terminal venster

### Productie build
Om een productie-versie te bouwen:
```bash
npm run build
```

Om de productie-versie lokaal te bekijken:
```bash
npm run preview
```

## Technische Stack Web Applicatie

Deze applicatie is gebouwd met moderne web technologieën:

- **React 19** - Frontend framework voor interactieve gebruikersinterfaces
- **Vite** - Snelle build tool en development server
- **Tailwind CSS** - Utility-first CSS framework voor responsive design (lokale setup)
- **React Router Dom** - Client-side routing voor single-page application navigatie
- **PostCSS** - CSS processing tool voor Tailwind CSS

### Tailwind CSS Implementatie

De applicatie gebruikt **lokale Tailwind CSS setup** voor optimale controle en performance:

**Lokale Configuratie:**
- Tailwind CSS geïnstalleerd als development dependency
- Custom configuratie in `tailwind.config.js`
- PostCSS configuratie in `postcss.config.js`
- Optimale bundle size door purging van ongebruikte CSS

**Custom Utilities:**
- `w-15` en `h-15` (3.75rem/60px) - Voor keyboard button afmetingen
- `xs` breakpoint (320px) - Voor extra kleine schermen
- Custom mobile breakpoints: `small-mobile`, `medium-mobile`, `large-mobile`

**Voordelen van lokale implementatie:**
- ✅ Optimale bundle size door CSS purging
- ✅ Volledige controle over configuratie
- ✅ Betere development experience met IntelliSense
- ✅ Geen externe dependencies tijdens runtime
- ✅ Custom utilities en componenten mogelijk

De Tailwind configuratie bevindt zich in `tailwind.config.js`:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: { '15': '3.75rem' },
      height: { '15': '3.75rem' },
      screens: {
        'xs': '320px',
        'small-mobile': {'max': '480px', 'min-height': '700px'},
        'medium-mobile': {'max': '600px'},
        'large-mobile': {'max': '768px'}
      }
    }
  },
  plugins: [],
}
```

### React Router Implementatie

De applicatie gebruikt **React Router Dom** voor client-side routing:

**Route Structuur:**
- `/` - Login screen (redirect naar `/tables` als ingelogd)
- `/tables` - Tafel selectie screen
- `/practice/:table` - Oefensessie met URL parameter
- `/scores` - Scorebord overzicht

**Features:**
- ✅ Browser back/forward button support
- ✅ URL parameters voor tafel selectie
- ✅ Programmatische navigatie tussen screens
- ✅ Protected routes (login vereist)
- ✅ Clean URLs voor elke app state

### Component Architectuur

De applicatie is opgebouwd uit modulaire React componenten:

**Core Components:**
- `LoginScreen.jsx` - Gebruikersnaam invoer en authenticatie
- `TableSelection.jsx` - Tafel selectie met custom input mogelijkheid
- `PracticeScreen.jsx` - Volledige oefensessie met virtual keyboard
- `ScoreBoard.jsx` - Score overzicht met wis functionaliteit

**Features:**
- **Responsive design** - Automatische aanpassing aan verschillende schermformaten
- **Component-based architecture** - Herbruikbare en onderhoudbare code structuur
- **Custom breakpoints** - Extra kleine schermen (xs: 320px) voor optimale mobiele ervaring
- **Custom utilities** - Aangepaste width/height classes (w-15, h-15) voor keyboard buttons
- **Mobile-first approach** - Ontworpen voor mobiele apparaten met virtual keyboard functionaliteit
- **State management** - Centralized state in App.jsx met localStorage persistence

## Project Structuur

Dit project bevat drie hoofdcomponenten, elk met hun eigen functionaliteit en documentatie:

### Web Applicatie

De **React web applicatie** in de `src/` map biedt de volledige functionaliteit voor browsers:

**🌐 Live Demo**: [https://d2zf8l8tihew58.cloudfront.net/](https://d2zf8l8tihew58.cloudfront.net/)

**Functies:**
- ✅ Tafel selectie (18 tafels inclusief decimalen)
- ✅ Interactieve oefening met virtueel toetsenbord
- ✅ Scorebord met sorteerfunctionaliteit
- ✅ Responsive design voor alle schermformaten
- ✅ Local storage voor gebruikersdata

**Technologieën:**
- React 19 + Vite
- Tailwind CSS (lokale setup)
- React Router Dom
- PostCSS

### Android Applicatie

De **native Android app** in de `mpt-android/` map biedt identieke functionaliteit geoptimaliseerd voor Android apparaten:

**📱 Documentatie**: Zie [mpt-android/README.md](mpt-android/README.md) voor complete technische documentatie.

**Functies:**
- ✅ Identieke functionaliteit aan web app
- ✅ Native performance en offline modus
- ✅ Virtueel toetsenbord geoptimaliseerd voor touch
- ✅ Room database voor lokale data opslag
- ✅ MVVM architectuur met Kotlin

**Technologieën:**
- Kotlin + Android Jetpack
- Room Database + SQLite
- Material Design Components
- Navigation Component

### Infrastructuur voor de Web Applicatie

De **Terraform infrastructuur** in de `infrastructure/` map beheert de AWS deployment:

**🏗️ Documentatie**: Zie [infrastructure/README.md](infrastructure/README.md) voor deployment instructies.

**AWS Componenten:**
- ✅ S3 Bucket voor statische hosting
- ✅ CloudFront CDN voor wereldwijde distributie
- ✅ Origin Access Control voor beveiligde toegang
- ✅ Automatische HTTPS en caching

**Features:**
- ✅ Infrastructure as Code met Terraform
- ✅ Moderne Origin Access Control (OAC)
- ✅ SPA routing support
- ✅ Cost-effective hosting

#### Kosten
- **Opslag**: ~€0,02 per GB per maand
- **Data transfer**: Eerste 1GB gratis per maand
- **Voor deze app**: Waarschijnlijk < €1 per maand

## Playwright tests
Voor het testen van de user interface zijn Playwright tests toegevoegd in de tests folder.  
Playwright is geïnstalleerd voor dit project dmv:
```shell
npm init playwright@latest
```
Om de Playwright tests uit te voeren:
1. Start de application dmv:
    ```shell
    npm run dev
    ```
2. Run de tests dmv:
    ```shell
    npx playwright test
    ```
3. Bekijk report dmv:
    ```shell
    npx playwright show-report
    ```

Voor de naamgeving van de tests zie [playwright-test-naming](/docs/playwright-test-naming.md)
