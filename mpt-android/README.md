# Multiplication Trainer Android App

De Android versie van de [Multiplication Trainer applicatie](https://github.com/edwinbulter/multiplication-trainer). Deze native Android app biedt dezelfde functionaliteit aan als de web app, maar is specifiek ontwikkeld voor Android apparaten met een optimale gebruikerservaring voor mobiele apparaten.

**📱 Download**: Installeer de app via de [Play Store](https://play.google.com/store/apps/details?id=ebulter.multiply) de [GitHub Pages downloadpagina](https://edwinbulter.github.io/multiplication-trainer/mpt-android/) of via de `app-debug.apk` in de `app/build/outputs/apk/debug/` map.

## Inhoudsopgave

- [Functieoverzicht](#functieoverzicht)
- [Technische Stack](#technische-stack)
- [Architectuur](#architectuur)
- [Implementatie Details](#implementatie-details)
- [Installatie](#installatie)
- [Automatische Build en Deploy](#automatische-build-en-deploy)
- [Ontwikkeling](#ontwikkeling)
- [Build Instructies](#build-instructies)
- [Functionaliteit](#functionaliteit)
- [Data Opslag](#data-opslag)
- [Verschillen met Web App](#verschillen-met-web-app)
- [Licentie](#licentie)

## Functieoverzicht

De Android app biedt exact dezelfde functionaliteit als de web versie:

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
- **Systeem Integratie**: Past zich aan aan Android thema's en navigatie

### 🌙 Dark Mode
- **Automatische ondersteuning**: Volgt de systeeminstellingen van je Android apparaat
- **Handmatige schakeling**: Kies zelf tussen light en dark mode
- **Optimaliseerde weergave**: Perfect leesbaar in beide modi

## Technische Stack

### 🛠️ Ontwikkelomgeving
- **Taal**: **Kotlin** - Moderne, type-veilige Android ontwikkeling
- **IDE**: **Android Studio** - Officiële Android ontwikkelomgeving
- **Build Tool**: **Gradle** - Automatisering van build processen
- **Minimum SDK**: **API 24** (Android 7.0) - Brede compatibiliteit
- **Target SDK**: **API 36** (Android 14) - Latest features

### 📚 Libraries & Frameworks
- **UI Framework**: **Android Jetpack Components**
  - `Navigation Component` - Single-activity architectuur
  - `ViewModel` - UI state management
  - `LiveData` - Reactive data binding
  - `Room Database` - Lokale data opslag
  - `RecyclerView` - Efficiënte lijsten weergave
- **Material Design**: **Material Components** - Modern UI design
- **Asynchrone Operaties**: **Kotlin Coroutines** - Background processing
- **Dependency Injection**: **Hilt** (optioneel) - Object management

### 🗄️ Data Opslag
- **Lokale Database**: **Room Database** - SQLite abstractie
- **Gebruikersdata**: **SharedPreferences** - Instellingen en gebruikersnaam
- **Data Model**: **Entity classes** - Type-veilige data representatie

## Architectuur

### 🏗️ MVVM (Model-View-ViewModel) Pattern

#### **Model Layer**
```kotlin
// Data entiteiten
@Entity
data class Score(
    @PrimaryKey val id: Long = 0,
    val username: String,
    val table: String,
    val duration: Long,
    val timestamp: Long
)

@Entity
data class User(
    @PrimaryKey val username: String,
    val lastLogin: Long
)
```

#### **View Layer (Fragments)**
- **LoginFragment**: Gebruikersnaam invoer en start scherm
- **TableSelectionFragment**: Tafel selectie en scoreboard toegang
- **PracticeFragment**: Hoofdscherm voor oefenen
- **ScoreboardFragment**: Score overzicht en beheer

#### **ViewModel Layer**
```kotlin
class PracticeViewModel(
    private val repository: ScoreRepository,
    private val table: String
) : ViewModel() {
    private val _currentQuestionIndex = MutableLiveData(0)
    private val _isCorrect = MutableLiveData<Boolean>()
    private val _isFinished = MutableLiveData<Boolean>()
    
    fun checkAnswer(answer: String, username: String)
    fun generateQuestions()
    fun saveScore(duration: Long, username: String)
}
```

### 🔄 Navigation Flow
```
LoginFragment → TableSelectionFragment → PracticeFragment → CompletionFragment
                    ↓
                ScoreboardFragment
```

## Implementatie Details

### 🎮 Virtueel Toetsenbord
```kotlin
// Custom keypad implementatie
private fun setupKeypad() {
    val buttons = listOf(
        R.id.keypad_0, R.id.keypad_1, R.id.keypad_2,
        R.id.keypad_3, R.id.keypad_4, R.id.keypad_5,
        R.id.keypad_6, R.id.keypad_7, R.id.keypad_8,
        R.id.keypad_9, R.id.keypad_decimal, R.id.keypad_backspace
    )
    
    buttons.forEach { buttonId ->
        binding.root.findViewById<MaterialButton>(buttonId).setOnClickListener {
            handleKeypadInput(buttonId)
        }
    }
}
```

### 📊 Score Systeem
```kotlin
// Tijdmeting en score opslag
fun checkAnswer(answer: String, username: String) {
    val correctAnswer = table.replace(',', '.').toDouble() * questions[currentQuestionIndexValue]
    val userAnswer = answer.replace(',', '.').toDoubleOrNull()
    
    // Floating point precisie handling
    if (userAnswer != null && abs(userAnswer - correctAnswer) < 0.0001) {
        _isCorrect.value = true
        currentQuestionIndexValue++
        
        if (currentQuestionIndexValue >= questions.size) {
            val duration = System.currentTimeMillis() - startTime
            viewModelScope.launch {
                repository.insert(Score(username, table, duration, System.currentTimeMillis()))
            }
            _isFinished.value = true
        }
    }
}
```

### 🔢 Decimale Tafel Ondersteuning
```kotlin
// Dutch decimal notation support
fun generateQuestions() {
    val tableValue = table.replace(',', '.').toDouble()
    questions = (1..10).map { multiplier ->
        Question(
            multiplicand = tableValue,
            multiplier = multiplier,
            expectedAnswer = tableValue * multiplier
        )
    }
}

// Input handling voor komma als decimaal scheidingsteken
fun onDecimalClicked() {
    if (!answerDisplay.text.contains(',')) {
        answerDisplay.append(",")
    }
}
```

## Installatie

### 📋 Vereisten
- **Android Studio** Arctic Fox of nieuwer
- **Android SDK** API 24+
- **Kotlin** 1.9+
- **Gradle** 8.0+

### 🔧 Stappen
1. **Clone de repository**
   ```bash
   git clone https://github.com/edwinbulter/multiplication-trainer.git
   cd multiplication-trainer/mpt-android
   ```

2. **Open in Android Studio**
   - File → Open → Selecteer de `mpt-android` map

3. **Sync Gradle**
   - Wacht tot Gradle synchronisatie is voltooid

4. **Run de app**
   - Selecteer een emulator of fysiek apparaat
   - Klik op de 'Run' knop (groen driehoek)

## Automatische Build en Deploy

### 🚀 GitHub Actions Workflow

Deze repository maakt gebruik van een geautomatiseerde GitHub Actions workflow voor het bouwen en deployen van de Android app. De workflow wordt handmatig gestart en voert de volgende stappen uit:

#### **Workflow Features**
- **Automatische APK Build**: Bouwt de signed release APK
- **GitHub Pages Deploy**: Genereert een professionele downloadpagina
- **Version Management**: Extraheert automatisch versie-informatie
- **Secure Signing**: Gebruikt GitHub Secrets voor veilige keystore beheer

#### **Downloadpagina**
Na succesvolle build is de app beschikbaar via:
- **URL**: [https://edwinbulter.github.io/multiplication-trainer/mpt-android/](https://edwinbulter.github.io/multiplication-trainer/mpt-android/)
- **Features**: Professionele downloadpagina, QR-code, installatie-instructies
- **Direct APK Download**: Automatische download op Android apparaten

#### **Handmatige Trigger**
De workflow wordt handmatig gestart via:
- GitHub Actions tab → "Deploy APK to GitHub Pages" → "Run workflow"

#### **📋 Gedetailleerde Documentatie**
Voor volledige details over de GitHub Actions workflow, setup instructies, en configuratie, zie: [**deploy-mpt-android-github.md**](docs/deploy-mpt-android-github.md)

**Belangrijkste onderwerpen in de documentatie:**
- Volledige workflow stappen en configuratie
- GitHub Secrets setup en keystore management
- Security overwegingen en best practices
- Troubleshooting en veelvoorkomende problemen
- Lokale ontwikkeling setup

## Ontwikkeling

### 🏗️ Project Structuur
```
app/
├── src/main/
│   ├── java/ebulter/multiply/
│   │   ├── data/           # Data laag (entities, dao, database)
│   │   ├── ui/             # UI laag (fragments, adapters)
│   │   ├── viewmodel/      # ViewModel laag
│   │   └── MainActivity.kt  # Single activity
│   ├── res/
│   │   ├── layout/         # XML layouts
│   │   ├── values/         # Strings, colors, themes
│   │   └── drawable/       # Icons en graphics
│   └── AndroidManifest.xml
└── build.gradle            # Build configuratie
```

### 🎨 UI Componenten
- **MaterialButton**: Voor alle interactieve elementen
- **MaterialCardView**: Voor content containers
- **RecyclerView**: Voor efficiënte lijsten
- **TextInputLayout**: Voor input velden
- **ConstraintLayout**: Voor responsive layouts

## Build Instructies

### 📱 Debug Build
```bash
./gradlew assembleDebug
```

### 📦 Release Build
```bash
./gradlew assembleRelease
```

### 🧪 Testen
```bash
./gradlew test
./gradlew connectedAndroidTest
```

## Functionaliteit

### 🎯 Identiek aan Web App
- **Tafel Selectie**: Zelfde 18 tafels inclusief decimalen
- **Operatie Keuze**: Schakel tussen **Vermenigvuldigen** (×) en **Delen** (÷) voor elke tafel
- **Oefening Modus**: 10 vragen per sessie
- **Score Systeem**: Tijdsmeting en opslag
- **Gebruikersbeheer**: Per gebruiker voortgang
- **Decimale Ondersteuning**: Komma als decimaal scheidingsteken

### 📱 Android Specifieke Features
- **Native Performance**: Snellere laadtijden dan web
- **Offline Modus**: Werkt zonder internet
- **Systeem Integratie**: Android thema ondersteuning
- **Touch Optimalisatie**: Speciaal voor mobiele interactie
- **Push Notificaties**: (optioneel) voor herinneringen

## Data Opslag

### 🗄️ Room Database Schema
```kotlin
@Database(entities = [Score::class, User::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun scoreDao(): ScoreDao
    abstract fun userDao(): UserDao
}
```

### 💾 Data Flow
1. **Gebruikersinvoer** → ViewModel validatie
2. **Score Berekening** → Tijdmeting en opslag
3. **Database Opslag** → Room persistency
4. **UI Update** → LiveData reactieve updates

## Verschillen met Web App

### 📱 Platform Specifieke Voordelen
- **Performance**: Native code is sneller dan JavaScript
- **Offline**: Volledige functionaliteit zonder internet
- **Integratie**: Android systeem features
- **User Experience**: Touch-geoptimaliseerde interface

### 🌐 Web App Voordelen
- **Platform Onafhankelijk**: Werkt op alle apparaten
- **Geen Installatie**: Direct toegang via browser
- **Automatische Updates**: Altijd laatste versie
- **Development**: Snellere development cyclus

## Licentie

Dit project is gelicenseerd onder de MIT License - zie de [LICENSE](../LICENSE) file voor details.

## Gerelateerde Projecten

- **[Web App](../src/)**: React versie van de applicatie
- **[Infrastructure](../infrastructure/)**: Terraform AWS deployment
- **[Documentation](../docs/)**: Technische documentatie
