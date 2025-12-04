# Multiplication Trainer

Een React-applicatie voor het oefenen van tafeltjes, gebouwd met **React**, **Vite** en **Tailwind CSS**.  
Naast deze repository bestaat de [multiplication-trainer-infrastructure](https://github.com/edwinbulter/multiplication-trainer-infrastructure) repository die de terraform scripts voor deployment van de infrastructuur naar AWS bevat.

## Hoe de applicatie te gebruiken

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

## Technische Stack

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

## AWS S3 Hosting Setup

Je hebt **twee opties** voor deployment naar AWS S3:

### Optie 1: Handmatige Deployment via GitHub Actions (Aanbevolen)
Gebruik de GitHub Actions workflow voor eenvoudige deployment - zie de sectie "Handmatige Deployment via GitHub Actions" hieronder.

### Optie 2: Handmatige Upload via AWS Console

Als je liever handmatig uploadt via de AWS Console:

#### S3 Bucket aanmaken en configureren

1. **Log in** op de [AWS Console](https://aws.amazon.com/console/)
2. **Zoek naar "S3"** in de zoekbalk en klik op S3
3. **Klik op "Create bucket"**
4. **Bucket naam**: `multiplication-trainer`
5. **Region**: Kies een regio dichtbij (bijv. Europe (Ireland) eu-west-1)
6. **Block Public Access**: **Uncheck "Block all public access"** ⚠️
7. **Acknowledge** dat de bucket publiek toegankelijk wordt
8. **Klik "Create bucket"**

#### Static Website Hosting inschakelen

1. **Open je bucket** → **Properties** tabblad
2. **Scroll naar "Static website hosting"** → **Edit**
3. **Enable** static website hosting
4. **Index document**: `index.html`
5. **Error document**: `index.html` (voor React routing)
6. **Save changes** en **noteer de website URL**

#### Bucket Policy instellen

1. **Permissions** tabblad → **Bucket policy** → **Edit**
2. **Plak deze policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::multiplication-trainer/*"
    }
  ]
}
```

#### Handmatige Upload

1. **Build je app**: `npm run build`
2. **Objects** tabblad → **Upload**
3. **Upload inhoud van `dist/` folder** (niet de folder zelf)
4. **Je app is live** op de website URL!

### Kosten
- **Opslag**: ~€0,02 per GB per maand
- **Data transfer**: Eerste 1GB gratis per maand
- **Voor deze app**: Waarschijnlijk < €1 per maand

## Handmatige Deployment via GitHub Actions

Voor handmatige deployment wanneer jij dat wilt, is er een GitHub Action workflow beschikbaar die je kunt starten vanuit de GitHub console.

### Setup GitHub Actions Deployment

#### Stap 1: AWS IAM User aanmaken voor GitHub Actions

1. **Ga naar AWS IAM Console**
2. **Klik "Users" → "Create user"**
3. **Username**: `github-actions-s3-deploy`
4. **Attach policies directly**: Selecteer `AmazonS3FullAccess`
5. **Create user**
6. **Klik op de user** → **Security credentials** → **Create access key**
7. **Use case**: Third-party service
8. **Noteer de Access Key ID en Secret Access Key** ⚠️

#### Stap 2: GitHub Secrets configureren

1. **Ga naar je GitHub repository**
2. **Settings** → **Secrets and variables** → **Actions**
3. **Klik "New repository secret"** en voeg deze secrets toe:

| Secret Name | Value | Voorbeeld |
|-------------|-------|-----------|
| `AWS_ACCESS_KEY_ID` | Je AWS Access Key ID | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Je AWS Secret Access Key | `wJalrXUt...` |
| `AWS_REGION` | Je AWS regio | `eu-west-1` |
| `S3_BUCKET_NAME` | Je S3 bucket naam | `multiplication-trainer` |
| `CLOUDFRONT_DISTRIBUTION_ID` | (Optioneel) CloudFront ID | `E1234567890123` |

#### Stap 3: Deployment starten

De GitHub Action kan **alleen handmatig** gestart worden:
- **Ga naar je repository** → **Actions tab**
- **Klik op "Deploy to AWS S3"** workflow
- **Klik "Run workflow"** → **Run workflow**

#### Stap 4: Deployment monitoren

1. **Ga naar je repository** → **Actions tab**
2. **Klik op de laatste workflow run** om de voortgang te zien
3. **Bij succes**: Je app is automatisch bijgewerkt op S3!

### Workflow Features

✅ **Automatische build** van je React app  
✅ **Upload naar S3** met oude bestanden verwijderen  
✅ **Correcte content-types** instellen  
✅ **CloudFront invalidation** (optioneel)  
✅ **Handmatige triggers** mogelijk  
✅ **Duidelijke logging** van alle stappen  

### Voordelen van GitHub Actions

- **Handmatige controle**: Deploy alleen wanneer jij dat wilt
- **Consistent**: Zelfde build proces elke keer
- **Veilig**: AWS credentials veilig opgeslagen in GitHub
- **Gratis**: GitHub Actions is gratis voor publieke repositories
- **Eenvoudig**: Één klik deployment vanuit GitHub console






# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
