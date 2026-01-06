import org.gradle.kotlin.dsl.java
import java.util.Properties
import java.io.FileInputStream

// 1. Create a properties object and load the file
val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("keystore.properties")
// Only try to load the properties file if it exists, to avoid errors in other environments (like CI servers)
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.ksp)
    alias(libs.plugins.navigation.safeargs.kotlin)
}

android {
    namespace = "ebulter.multiply"
    compileSdk = 36

    defaultConfig {
        applicationId = "ebulter.multiply"
        minSdk = 24
        targetSdk = 36
        versionCode = 14
        versionName = "1.0.6"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        create("release") {
            // Use environment variables in CI/CD, local properties for development
            storeFile = file(System.getenv("KEYSTORE_PATH") ?: keystoreProperties["storeFile"] as String)
            storePassword = System.getenv("KEYSTORE_PASSWORD") ?: keystoreProperties["storePassword"] as String
            keyAlias = System.getenv("KEY_ALIAS") ?: keystoreProperties["keyAlias"] as String
            keyPassword = System.getenv("KEY_PASSWORD") ?: keystoreProperties["keyPassword"] as String
        }
    }

    buildTypes {
        release {
            // Disable debugging for release
            isDebuggable = false
            
            // Enable R8 full mode for code shrinking and obfuscation
            isMinifyEnabled = true
            isShrinkResources = true
            
            // Signing configuration (will be added in next step)
            signingConfig = signingConfigs.getByName("release")
            
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            isDebuggable = true
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)

    // Navigation
    implementation(libs.androidx.navigation.fragment.ktx)
    implementation(libs.androidx.navigation.ui.ktx)

    // ViewModel and LiveData
    implementation(libs.androidx.lifecycle.viewmodel.ktx)
    implementation(libs.androidx.lifecycle.livedata.ktx)

    // Room
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // Preferences for login
    implementation(libs.androidx.preference.ktx)

    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
}
