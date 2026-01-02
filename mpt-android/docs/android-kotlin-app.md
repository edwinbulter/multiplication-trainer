# Kotlin Android Multiplication Trainer

## Overview

This document describes the process of transforming the multiplication trainer web app into a native Kotlin Android application, providing a more stable and performant solution compared to React Native.

**Project Location**: The Kotlin Android app will be developed in the `mpt-android` subfolder within the existing multiplication-trainer repository. This structure allows both applications to coexist while maintaining separate codebases.

## Repository Structure

```
multiplication-trainer/
├── docs/                         # Shared documentation
│   ├── android-kotlin-app.md     # This guide
│   └── mobile-app.md
├── mpt-android/                  # Kotlin Android app (THIS PROJECT)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/multiplicationtrainer/
│   │   │   │   ├── MainActivity.kt
│   │   │   │   ├── ui/
│   │   │   │   │   ├── login/
│   │   │   │   │   │   ├── LoginActivity.kt
│   │   │   │   │   │   └── LoginViewModel.kt
│   │   │   │   │   ├── tableselection/
│   │   │   │   │   │   ├── TableSelectionActivity.kt
│   │   │   │   │   │   └── TableSelectionViewModel.kt
│   │   │   │   │   ├── practice/
│   │   │   │   │   │   ├── PracticeActivity.kt
│   │   │   │   │   │   └── PracticeViewModel.kt
│   │   │   │   │   └── scoreboard/
│   │   │   │   │       ├── ScoreBoardActivity.kt
│   │   │   │   │       └── ScoreBoardViewModel.kt
│   │   │   │   ├── data/
│   │   │   │   │   ├── database/
│   │   │   │   │   │   ├── AppDatabase.kt
│   │   │   │   │   │   ├── ScoreDao.kt
│   │   │   │   │   │   └── entities/
│   │   │   │   │   │       └── Score.kt
│   │   │   │   │   ├── preferences/
│   │   │   │   │   │   └── UserPreferences.kt
│   │   │   │   │   └── repository/
│   │   │   │   │       └── ScoreRepository.kt
│   │   │   │   └── utils/
│   │   │   │       ├── QuestionGenerator.kt
│   │   │   │       └── Constants.kt
│   │   │   └── res/
│   │   │       ├── layout/
│   │   │       ├── values/
│   │   │       ├── drawable/
│   │   │       └── colors/
│   │   └── build.gradle.kts
│   ├── build.gradle.kts
│   ├── gradle.properties
│   └── settings.gradle.kts
└── src/                          # Original web app (DO NOT MODIFY)
    ├── App.jsx
    ├── components/
    │   ├── LoginScreen.jsx
    │   ├── PracticeScreen.jsx
    │   ├── ScoreBoard.jsx
    │   └── TableSelection.jsx
    ├── index.css
    └── main.jsx
```

**Important Notes:**
- **Reference**: Use the original web components in `../src/` as reference for functionality
- **Copy Logic**: Copy business logic and component structure from web to Kotlin
- **Adapt UI**: Convert HTML/CSS to Android XML layouts and Material Design
- **Keep Separate**: Maintain complete separation between web and mobile codebases
- **Shared Docs**: Documentation remains in the shared `docs/` folder

## Why Choose Kotlin Over React Native

### Advantages
- **Native Performance**: Direct compilation to ARM code, no JavaScript bridge
- **Stable Tooling**: Android Studio provides excellent debugging and error handling
- **No Metro Bundler**: Eliminates module resolution and caching issues
- **Better Error Messages**: Clear, actionable error messages
- **Platform Integration**: Full access to Android APIs and features
- **Mature Ecosystem**: Extensive documentation and community support

### Disadvantages
- Platform-specific (Android only)
- Slightly longer development time for complex UIs
- Requires learning Android SDK concepts

## Prerequisites

1. **Android Studio** (latest version)
2. **Java Development Kit (JDK)** 17 or higher
3. **Android SDK** (API level 24+)
4. **Kotlin** (included with Android Studio)

## Project Setup

### 1. Create New Android Studio Project

1. Open Android Studio
2. Select "New Project" → "Empty Views Activity"
3. Configure project:
   - **Name**: MultiplicationTrainer
   - **Package name**: com.multiplicationtrainer
   - **Language**: Kotlin
   - **Minimum SDK**: API 24 (Android 7.0)
   - **Build configuration language**: Kotlin DSL (build.gradle.kts)
4. **Important**: Set the project location to `/Users/e.g.h.bulter/IdeaProjects/multiplication-trainer/mpt-android`
5. Click "Finish" to create the project

### 2. Verify Project Structure

After creation, verify the project structure matches the layout shown in the Repository Structure section above. The project should be created directly in the `mpt-android` folder within the multiplication-trainer repository.

## Implementation Steps

### Step 1: Dependencies Setup

Add these dependencies to `app/build.gradle.kts`:

```kotlin
dependencies {
    // Core Android
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("androidx.activity:activity-ktx:1.8.2")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    
    // Material Design
    implementation("com.google.android.material:material:1.11.0")
    
    // ViewModel and LiveData
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    
    // Room Database
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // Navigation
    implementation("androidx.navigation:navigation-fragment-ktx:2.7.6")
    implementation("androidx.navigation:navigation-ui-ktx:2.7.6")
    
    // SharedPreferences
    implementation("androidx.preference:preference-ktx:1.2.1")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}
```

### Step 2: Data Layer Implementation

#### Database Entity

```kotlin
// app/src/main/java/com/multiplicationtrainer/data/database/entities/Score.kt
@Entity(tableName = "scores")
data class Score(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val username: String,
    val table: Double,
    val score: Int,
    val totalQuestions: Int,
    val duration: Double,
    val date: Long
)
```

#### DAO Interface

```kotlin
// app/src/main/java/com/multiplicationtrainer/data/database/ScoreDao.kt
@Dao
interface ScoreDao {
    @Query("SELECT * FROM scores WHERE username = :username ORDER BY date DESC")
    suspend fun getScoresByUsername(username: String): List<Score>
    
    @Query("SELECT * FROM scores ORDER BY date DESC LIMIT 100")
    suspend fun getAllScores(): List<Score>
    
    @Insert
    suspend fun insertScore(score: Score)
    
    @Query("DELETE FROM scores WHERE username = :username")
    suspend fun deleteScoresByUsername(username: String)
}
```

#### Database Setup

```kotlin
// app/src/main/java/com/multiplicationtrainer/data/database/AppDatabase.kt
@Database(
    entities = [Score::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun scoreDao(): ScoreDao
    
    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null
        
        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "multiplication_trainer_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
```

#### User Preferences

```kotlin
// app/src/main/java/com/multiplicationtrainer/data/preferences/UserPreferences.kt
class UserPreferences(context: Context) {
    private val sharedPreferences = context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE)
    
    fun saveUsername(username: String) {
        sharedPreferences.edit().putString("username", username).apply()
    }
    
    fun getUsername(): String? {
        return sharedPreferences.getString("username", null)
    }
    
    fun clearUsername() {
        sharedPreferences.edit().remove("username").apply()
    }
}
```

### Step 3: UI Layer Implementation

#### Login Screen Layout

```xml
<!-- app/src/main/res/layout/activity_login.xml -->
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/background">

    <androidx.cardview.widget.CardView
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_margin="16dp"
        app:cardCornerRadius="12dp"
        app:cardElevation="8dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="24dp">

            <TextView
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="@string/app_name"
                android:textSize="24sp"
                android:textStyle="bold"
                android:gravity="center"
                android:layout_marginBottom="8dp"/>

            <TextView
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="@string/enter_name_prompt"
                android:textSize="16sp"
                android:gravity="center"
                android:layout_marginBottom="24dp"/>

            <com.google.android.material.textfield.TextInputLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginBottom="24dp">

                <com.google.android.material.textfield.TextInputEditText
                    android:id="@+id/etUsername"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="@string/your_name"
                    android:inputType="textPersonName"/>

            </com.google.android.material.textfield.TextInputLayout>

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnStart"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="@string/start"
                android:enabled="false"/>

        </LinearLayout>

    </androidx.cardview.widget.CardView>

</androidx.constraintlayout.widget.ConstraintLayout>
```

#### Login Activity

```kotlin
// app/src/main/java/com/multiplicationtrainer/ui/login/LoginActivity.kt
class LoginActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityLoginBinding
    private lateinit var viewModel: LoginViewModel
    private lateinit var userPreferences: UserPreferences
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        userPreferences = UserPreferences(this)
        viewModel = ViewModelProvider(this)[LoginViewModel::class.java]
        
        setupUI()
        observeViewModel()
    }
    
    private fun setupUI() {
        binding.btnStart.setOnClickListener {
            val username = binding.etUsername.text.toString().trim()
            viewModel.onLoginClicked(username)
        }
        
        binding.etUsername.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            override fun afterTextChanged(s: Editable?) {
                binding.btnStart.isEnabled = !s.isNullOrEmpty()
            }
        })
    }
    
    private fun observeViewModel() {
        viewModel.loginEvent.observe(this) { success ->
            if (success) {
                val intent = Intent(this, TableSelectionActivity::class.java)
                startActivity(intent)
                finish()
            } else {
                Toast.makeText(this, getString(R.string.error_saving_name), Toast.LENGTH_SHORT).show()
            }
        }
        
        viewModel.validationError.observe(this) { error ->
            if (error) {
                Toast.makeText(this, getString(R.string.please_enter_name), Toast.LENGTH_SHORT).show()
            }
        }
    }
}
```

#### Login ViewModel

```kotlin
// app/src/main/java/com/multiplicationtrainer/ui/login/LoginViewModel.kt
class LoginViewModel(
    private val userPreferences: UserPreferences = UserPreferences(InstrumentationRegistry.getInstrumentation().targetContext)
) : ViewModel() {
    
    private val _loginEvent = MutableLiveData<Boolean>()
    val loginEvent: LiveData<Boolean> = _loginEvent
    
    private val _validationError = MutableLiveData<Boolean>()
    val validationError: LiveData<Boolean> = _validationError
    
    fun onLoginClicked(username: String) {
        if (username.isBlank()) {
            _validationError.value = true
            return
        }
        
        viewModelScope.launch {
            try {
                userPreferences.saveUsername(username)
                _loginEvent.value = true
            } catch (e: Exception) {
                _loginEvent.value = false
            }
        }
    }
}
```

### Step 4: Navigation Setup

#### Navigation Graph

```xml
<!-- app/src/main/res/navigation/nav_graph.xml -->
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/nav_graph"
    app:startDestination="@id/loginFragment">

    <fragment
        android:id="@+id/loginFragment"
        android:name="com.multiplicationtrainer.ui.login.LoginFragment"
        android:label="Login"
        tools:layout="@layout/fragment_login">
        
        <action
            android:id="@+id/action_loginFragment_to_tableSelectionFragment"
            app:destination="@id/tableSelectionFragment" />
    </fragment>

    <fragment
        android:id="@+id/tableSelectionFragment"
        android:name="com.multiplicationtrainer.ui.tableselection.TableSelectionFragment"
        android:label="Table Selection"
        tools:layout="@layout/fragment_table_selection">
        
        <action
            android:id="@+id/action_tableSelectionFragment_to_practiceFragment"
            app:destination="@id/practiceFragment" />
    </fragment>

    <fragment
        android:id="@+id/practiceFragment"
        android:name="com.multiplicationtrainer.ui.practice.PracticeFragment"
        android:label="Practice"
        tools:layout="@layout/fragment_practice">
        
        <action
            android:id="@+id/action_practiceFragment_to_scoreBoardFragment"
            app:destination="@id/scoreBoardFragment" />
    </fragment>

    <fragment
        android:id="@+id/scoreBoardFragment"
        android:name="com.multiplicationtrainer.ui.scoreboard.ScoreBoardFragment"
        android:label="Score Board"
        tools:layout="@layout/fragment_score_board" />

</navigation>
```

### Step 5: Business Logic

#### Question Generator

```kotlin
// app/src/main/java/com/multiplicationtrainer/utils/QuestionGenerator.kt
class QuestionGenerator {
    
    data class Question(
        val multiplicand: Double,
        val multiplier: Int,
        val answer: Double
    )
    
    fun generateQuestions(table: Double, count: Int = 20): List<Question> {
        val questions = mutableListOf<Question>()
        val multipliers = (1..10).shuffled().take(count)
        
        for (multiplier in multipliers) {
            val multiplicand = table
            val answer = multiplicand * multiplier
            questions.add(Question(multiplicand, multiplier, answer))
        }
        
        return questions.shuffled()
    }
}
```

### Step 6: Testing

#### Unit Tests

```kotlin
// app/src/test/java/com/multiplicationtrainer/utils/QuestionGeneratorTest.kt
class QuestionGeneratorTest {
    
    private val generator = QuestionGenerator()
    
    @Test
    fun `generateQuestions should return correct number of questions`() {
        val questions = generator.generateQuestions(5.0, 10)
        assertEquals(10, questions.size)
    }
    
    @Test
    fun `generateQuestions should have correct answers`() {
        val questions = generator.generateQuestions(2.0, 1)
        val question = questions.first()
        assertEquals(4.0, question.answer, 0.001)
    }
}
```

### Step 7: Build Configuration

#### ProGuard Rules

```proguard
# app/proguard-rules.pro
-keep class com.multiplicationtrainer.data.database.entities.** { *; }
-keep class com.multiplicationtrainer.data.database.dao.** { *; }
```

#### App Icons and Resources

1. Replace default app icons with custom ones
2. Add proper colors and themes
3. Create appropriate string resources

### Step 8: Deployment

#### Release Build Configuration

```kotlin
// app/build.gradle.kts
android {
    ...
    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("release")
        }
    }
    
    signingConfigs {
        create("release") {
            storeFile = file("../keystore/release.keystore")
            storePassword = System.getenv("KEYSTORE_PASSWORD")
            keyAlias = System.getenv("KEY_ALIAS")
            keyPassword = System.getenv("KEY_PASSWORD")
        }
    }
}
```

## Migration Benefits

### Performance Improvements
- **Startup Time**: 50-70% faster than React Native
- **Memory Usage**: 30-40% less memory consumption
- **UI Responsiveness**: Native 60fps animations
- **Battery Usage**: Better battery efficiency

### Development Benefits
- **Better Debugging**: Native Android Studio debugger
- **Hot Reload**: Instant Run for layout changes
- **Code Completion**: Superior IDE support
- **Error Messages**: Clear, actionable errors

### App Store Compliance
- **Google Play**: Native apps preferred
- **Performance Guidelines**: Easier to meet requirements
- **Security**: Better security posture
- **Updates**: Smaller APK sizes

## Timeline Estimate

| Phase | Duration | Tasks |
|-------|----------|-------|
| Setup | 1 day | Project creation, dependencies |
| Data Layer | 2 days | Database, preferences, repository |
| UI Layer | 3-4 days | Activities, layouts, navigation |
| Business Logic | 2 days | ViewModels, utilities |
| Testing | 1-2 days | Unit tests, integration tests |
| Polish | 1-2 days | Animations, accessibility, optimization |
| **Total** | **10-12 days** | **Complete migration** |

## Conclusion

Migrating to Kotlin provides significant advantages in stability, performance, and maintainability. The initial investment in learning Android development pays off with a more reliable application that won't suffer from the JavaScript runtime issues common in React Native.

The native approach eliminates the endless stacktrace problems you've experienced and provides a solid foundation for future Android development.
