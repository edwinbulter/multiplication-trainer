# Android App Development Guide

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
  - [Development Environment Setup](#development-environment-setup)
  - [Environment Verification](#environment-verification)
- [Phase 1: React Native Project Setup](#phase-1-react-native-project-setup)
  - [1.1 Initialize React Native Project](#11-initialize-react-native-project)
  - [1.2 Install Required Dependencies](#12-install-required-dependencies)
  - [1.3 Configure Android Project](#13-configure-android-project)
  - [1.4 Update Android Configuration with Maven](#14-update-android-configuration-with-maven)
- [Phase 2: Component Migration](#phase-2-component-migration)
  - [2.1 Project Structure](#21-project-structure)
  - [2.2 Migrate LoginScreen Component](#22-migrate-loginscreen-component)
  - [2.3 Migrate PracticeScreen Component](#23-migrate-practicescreen-component)
  - [2.4 Setup Navigation](#24-setup-navigation)
  - [2.5 Update Main App Component](#25-update-main-app-component)
- [Phase 3: Testing](#phase-3-testing)
  - [3.1 Unit Testing Setup](#31-unit-testing-setup)
  - [3.2 Create Unit Tests](#32-create-unit-tests)
  - [3.3 Run Tests](#33-run-tests)
  - [3.4 Manual Testing on Device](#34-manual-testing-on-device)
  - [3.5 Performance Testing](#35-performance-testing)
- [Phase 4: Build Configuration](#phase-4-build-configuration)
  - [4.1 Generate Release Keystore](#41-generate-release-keystore)
  - [4.2 Configure Maven for Release Build](#42-configure-maven-for-release-build)
  - [4.3 Enable ProGuard](#43-enable-proguard)
- [Phase 5: App Store Preparation](#phase-5-app-store-preparation)
  - [5.1 App Assets](#51-app-assets)
  - [5.2 Update App Information](#52-update-app-information)
  - [5.3 Build Release APK](#53-build-release-apk)
- [Phase 6: Google Play Store Deployment](#phase-6-google-play-store-deployment)
  - [6.1 Create Google Play Developer Account](#61-create-google-play-developer-account)
  - [6.2 Create New App](#62-create-new-app)
  - [6.3 Store Listing](#63-store-listing)
  - [6.4 Content Rating](#64-content-rating)
  - [6.5 Target Audience](#65-target-audience)
  - [6.6 Privacy Policy](#66-privacy-policy)
  - [6.7 App Content](#67-app-content)
  - [6.8 Release Process](#68-release-process)
  - [6.9 Post-Launch](#69-post-launch)
- [Phase 7: Maintenance and Updates](#phase-7-maintenance-and-updates)
  - [7.1 Version Management](#71-version-management)
  - [7.2 Update Process](#72-update-process)
  - [7.3 Monitoring](#73-monitoring)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
  - [Debug Commands](#debug-commands)
- [Timeline](#timeline)
- [Conclusion](#conclusion)

## Overview

This guide provides step-by-step instructions for converting the Multiplication Trainer web application into a React Native Android app, testing it, and deploying it to the Google Play Store.

## Prerequisites

### Development Environment Setup

1. **Node.js** (v16 or higher)
2. **Java Development Kit (JDK)** (v11 or higher)
3. **Android Studio** (latest version)
4. **Android SDK** (API level 31 or higher)
5. **Physical Android device** or **Android Emulator**

### Environment Verification

```bash
# Check Node.js version
node --version

# Check Java version
java -version

# Verify Android Studio installation
# Open Android Studio → Settings → Appearance & Behavior → System Settings → Android SDK
```

## Phase 1: React Native Project Setup

### 1.1 Initialize React Native Project

**Updated Command (React Native CLI is deprecated):**

```bash
# Navigate to the multiplication-trainer root directory
cd /Users/e.g.h.bulter/IdeaProjects/multiplication-trainer

# Create React Native project using the new CLI in the existing mpt-android folder
npx @react-native-community/cli@latest init MultiplicationTrainer --directory ./mpt-android

# Navigate to the project
cd mpt-android
```

**Alternative: Using Expo CLI (Recommended for easier setup)**

```bash
# Navigate to the multiplication-trainer root directory
cd /Users/e.g.h.bulter/IdeaProjects/multiplication-trainer

# If mpt-android folder exists and is empty, remove it first
rm -rf mpt-android

# Create new React Native project with Expo
npx create-expo-app mpt-android --template

# Navigate to the project
cd mpt-android
```

**Manual Setup (if automated options fail):**

```bash
# Navigate to the multiplication-trainer root directory
cd /Users/e.g.h.bulter/IdeaProjects/multiplication-trainer

# Create and navigate to mpt-android folder
mkdir -p mpt-android
cd mpt-android

# Initialize package.json
npm init -y

# Install React Native dependencies
npm install react react-native
npm install --save-dev @react-native-community/cli

# Create basic project structure
mkdir -p android ios src/components src/navigation
```

**Troubleshooting:**
- If the `--directory` flag doesn't work, create the project in a temporary folder first, then move contents
- Ensure the `mpt-android` folder is empty before running the command
- Use `npx @react-native-community/cli@latest init` instead of the deprecated `react-native init`

### 1.2 Install Required Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# Storage (replace localStorage)
npm install @react-native-async-storage/async-storage

# Haptic feedback
npm install react-native-haptic-feedback

# Vector icons
npm install react-native-vector-icons

# Device info
npm install react-native-device-info

# Note: The 'react-native link' command is deprecated in React Native 0.60+
# Native dependencies are now auto-linked automatically
# For manual linking, use platform-specific methods if needed
```

### 1.3 Configure Android Project

```bash
# Navigate to Android directory
cd android

# Generate debug keystore (for testing)
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000

# IMPORTANT: Add keystore files to .gitignore
echo "*.keystore" >> ../.gitignore

# Return to project root
cd ..
```

**Security Note**: Never commit keystore files to version control. Keystore files contain cryptographic keys that should be kept secure. The debug keystore is automatically added to .gitignore above.

```bash
e.g.h.bulter@MacBook-Pro-van-EGH android % keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
Enter the distinguished name. Provide a single dot (.) to leave a sub-component empty or press ENTER to use the default value in braces.
Enter the distinguished name. Provide a single dot (.) to leave a sub-component empty or press ENTER to use the default value in braces.
What is your first and last name?
  [Unknown]:  
What is the name of your organizational unit?
  [Unknown]:  
What is the name of your organization?
  [Unknown]:  
What is the name of your City or Locality?
  [Unknown]:  
What is the name of your State or Province?
  [Unknown]:  
What is the two-letter country code for this unit?
  [Unknown]:  
Is CN=Unknown, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown correct?
  [no]:  yes

Generating 2,048 bit RSA key pair and self-signed certificate (SHA384withRSA) with a validity of 10,000 days
        for: CN=Unknown, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown
[Storing debug.keystore]
e.g.h.bulter@MacBook-Pro-van-EGH android % 
```

### 1.4 Update Android Configuration with Maven

Create `android/app/pom.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.multiplicationtrainer</groupId>
    <artifactId>multiplication-trainer</artifactId>
    <version>1.0.0</version>
    <packaging>apk</packaging>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <android.sdk.version>31</android.sdk.version>
        <android.platform.version>31</android.platform.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.google.android</groupId>
            <artifactId>android</artifactId>
            <version>${android.sdk.version}</version>
            <scope>provided</scope>
        </dependency>
        
        <dependency>
            <groupId>androidx.appcompat</groupId>
            <artifactId>appcompat</artifactId>
            <version>1.6.1</version>
        </dependency>
        
        <dependency>
            <groupId>androidx.core</groupId>
            <artifactId>core</artifactId>
            <version>1.10.1</version>
        </dependency>
        
        <dependency>
            <groupId>com.facebook.react</groupId>
            <artifactId>react-native</artifactId>
            <version>0.72.4</version>
        </dependency>
    </dependencies>

    <build>
        <sourceDirectory>src</sourceDirectory>
        
        <plugins>
            <plugin>
                <groupId>com.jayway.maven.plugins.android.generation2</groupId>
                <artifactId>android-maven-plugin</artifactId>
                <version>4.0.0</version>
                <configuration>
                    <sdk>
                        <platform>${android.platform.version}</platform>
                    </sdk>
                    <dex>
                        <coreLibrary>true</coreLibrary>
                    </dex>
                    <manifest>
                        <debuggable>true</debuggable>
                    </manifest>
                    <proguard>
                        <skip>false</skip>
                        <config>proguard.cfg</config>
                    </proguard>
                    <sign>
                        <debug>true</debug>
                    </sign>
                </configuration>
                <extensions>true</extensions>
            </plugin>
            
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>11</source>
                    <target>11</target>
                </configuration>
            </plugin>
            
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jarsigner-plugin</artifactId>
                <version>3.0.0</version>
                <executions>
                    <execution>
                        <id>signing</id>
                        <goals>
                            <goal>sign</goal>
                        </goals>
                        <phase>package</phase>
                        <inherited>true</inherited>
                        <configuration>
                            <archive>${project.build.directory}/${project.build.finalName}.apk</archive>
                            <keystore>${sign.keystore}</keystore>
                            <storepass>${sign.storepass}</storepass>
                            <keypass>${sign.keypass}</keypass>
                            <alias>${sign.alias}</alias>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

    <profiles>
        <profile>
            <id>release</id>
            <properties>
                <sign.keystore>${project.basedir}/release.keystore</sign.keystore>
                <sign.storepass>${env.STORE_PASSWORD}</sign.storepass>
                <sign.keypass>${env.KEY_PASSWORD}</sign.keypass>
                <sign.alias>${env.KEY_ALIAS}</sign.alias>
            </properties>
            <build>
                <plugins>
                    <plugin>
                        <groupId>com.jayway.maven.plugins.android.generation2</groupId>
                        <artifactId>android-maven-plugin</artifactId>
                        <configuration>
                            <sign>
                                <debug>false</debug>
                            </sign>
                        </configuration>
                    </plugin>
                </plugins>
            </build>
        </profile>
    </profiles>
</project>
```

Create `android/pom.xml` (root POM):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.multiplicationtrainer</groupId>
    <artifactId>multiplication-trainer-parent</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>

    <modules>
        <module>app</module>
    </modules>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
</project>
```

## Phase 2: Component Migration

### 2.1 Project Structure

**Important Note**: The Android app is being developed in the `mpt-android` subfolder within the existing multiplication-trainer repository. The original web application files remain untouched in the root `src/` folder. This structure allows both applications to coexist in the same repository while sharing documentation and maintaining separate codebases.

**Create the following folder structure in `mpt-android/` (alphabetical order):**

```
multiplication-trainer/
├── docs/                         # Shared documentation
│   ├── android-app.md
│   └── mobile-app.md
├── mpt-android/                  # React Native Android app
│   ├── .gitignore
│   ├── App.tsx
│   ├── android/
│   │   ├── app/
│   │   │   ├── build.gradle
│   │   │   ├── debug.keystore
│   │   │   ├── pom.xml
│   │   │   └── src/
│   │   │       └── main/
│   │   │           ├── AndroidManifest.xml
│   │   │           ├── java/
│   │   │           │   └── com/
│   │   │           │       └── multiplicationtrainer/
│   │   │           │           ├── MainActivity.kt
│   │   │           │           └── MainApplication.kt
│   │   │           └── res/
│   │   │               ├── drawable/
│   │   │               ├── mipmap-*/
│   │   │               │   ├── ic_launcher.png
│   │   │               │   └── ic_launcher_round.png
│   │   │               └── values/
│   │   │                   ├── strings.xml
│   │   │                   └── styles.xml
│   │   ├── build.gradle
│   │   ├── gradle.properties
│   │   ├── gradle/
│   │   │   └── wrapper/
│   │   ├── gradlew
│   │   ├── gradlew.bat
│   │   ├── pom.xml
│   │   └── settings.gradle
│   ├── app.json
│   ├── assets/
│   │   └── fonts/
│   ├── babel.config.js
│   ├── index.js
│   ├── ios/
│   │   ├── .xcode.env
│   │   ├── MultiplicationTrainer/
│   │   │   ├── AppDelegate.swift
│   │   │   ├── Images.xcassets/
│   │   │   ├── Info.plist
│   │   │   ├── LaunchScreen.storyboard
│   │   │   └── PrivacyInfo.xcprivacy
│   │   ├── MultiplicationTrainer.xcodeproj/
│   │   └── Podfile
│   ├── jest.config.js
│   ├── metro.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── src/
│   │   ├── assets/
│   │   │   └── fonts/
│   │   ├── components/
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── PracticeScreen.jsx
│   │   │   ├── ScoreBoard.jsx
│   │   │   └── TableSelection.jsx
│   │   ├── navigation/
│   │   │   └── AppNavigator.jsx
│   │   └── utils/
│   │       ├── storage.js
│   │       └── styles.js
│   └── tsconfig.json
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

**Migration Guidelines:**
- **Reference**: Use the original web components in `../src/` as reference for functionality
- **Copy Logic**: Copy business logic and component structure from web to React Native
- **Adapt UI**: Convert HTML/CSS to React Native components and StyleSheet
- **Keep Separate**: Maintain complete separation between web and mobile codebases
- **Shared Docs**: Documentation remains in the shared `docs/` folder

### 2.2 Migrate LoginScreen Component

**Reference**: Original web component at `../src/components/LoginScreen.jsx`

Create `mpt-android/src/components/LoginScreen.jsx`:

```jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trigger } from 'react-native-haptic-feedback';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      await AsyncStorage.setItem('username', username);
      trigger('impactLight');
      navigation.replace('TableSelection');
    } catch (error) {
      Alert.alert('Error', 'Failed to save username');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Multiplication Trainer</Text>
        <Text style={styles.subtitle}>Enter your name to start</Text>
        
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Your name"
          placeholderTextColor="#666"
          maxLength={20}
          autoCapitalize="words"
        />
        
        <TouchableOpacity 
          style={[styles.button, !username.trim() && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!username.trim()}
        >
          <Text style={styles.buttonText}>Start Learning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f8fafc',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
```

### 2.3 Migrate PracticeScreen Component

**Reference**: Original web component at `../src/components/PracticeScreen.jsx`

Create `mpt-android/src/components/PracticeScreen.jsx`:

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trigger } from 'react-native-haptic-feedback';

const PracticeScreen = ({ route, navigation }) => {
  const { table } = route.params;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    generateQuestions();
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Exit Practice',
        'Are you sure you want to exit this practice session?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => navigation.goBack() },
        ]
      );
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const generateQuestions = () => {
    const newQuestions = [];
    for (let i = 1; i <= 10; i++) {
      newQuestions.push({
        question: `${table} × ${i}`,
        answer: table * i,
      });
    }
    setQuestions(newQuestions.sort(() => Math.random() - 0.5));
  };

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === questions[currentQuestion].answer;
    trigger(correct ? 'success' : 'error');
    
    setAnswers([...answers, {
      question: questions[currentQuestion].question,
      userAnswer: parseInt(userAnswer),
      correctAnswer: questions[currentQuestion].answer,
      isCorrect: correct,
    }]);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer('');
        setShowResult(false);
      } else {
        saveScore();
      }
    }, 1500);
  };

  const saveScore = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const existingScores = JSON.parse(await AsyncStorage.getItem('scores') || '[]');
      
      const newScore = {
        username,
        table,
        score,
        totalQuestions: questions.length,
        date: new Date().toISOString(),
      };
      
      existingScores.push(newScore);
      await AsyncStorage.setItem('scores', JSON.stringify(existingScores));
      
      navigation.navigate('ScoreBoard', { newScore });
    } catch (error) {
      Alert.alert('Error', 'Failed to save score');
    }
  };

  if (questions.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tableTitle}>Table of {table}</Text>
        <Text style={styles.progress}>{currentQuestion + 1} / {questions.length}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>{questions[currentQuestion].question}</Text>
        
        <TextInput
          style={styles.input}
          value={userAnswer}
          onChangeText={setUserAnswer}
          placeholder="Your answer"
          placeholderTextColor="#666"
          keyboardType="numeric"
          maxLength={4}
          editable={!showResult}
        />
        
        {showResult ? (
          <View style={[styles.result, answers[answers.length - 1]?.isCorrect ? styles.correct : styles.incorrect]}>
            <Text style={styles.resultText}>
              {answers[answers.length - 1]?.isCorrect ? '✓ Correct!' : `✗ Wrong! The answer is ${answers[answers.length - 1]?.correctAnswer}`}
            </Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.button, !userAnswer && styles.buttonDisabled]}
            onPress={checkAnswer}
            disabled={!userAnswer}
          >
            <Text style={styles.buttonText}>Check Answer</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.keyboard}>
        {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.key}
            onPress={() => {
              setUserAnswer(userAnswer + num.toString());
              trigger('impactLight');
            }}
            disabled={showResult}
          >
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.key, styles.deleteKey]}
          onPress={() => {
            setUserAnswer(userAnswer.slice(0, -1));
            trigger('impactLight');
          }}
          disabled={showResult}
        >
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  progress: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  question: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 30,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    width: '100%',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#f8fafc',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 40,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  correct: {
    backgroundColor: '#dcfce7',
  },
  incorrect: {
    backgroundColor: '#fee2e2',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  key: {
    width: 70,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  deleteKey: {
    backgroundColor: '#fbbf24',
  },
  keyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
});

export default PracticeScreen;
```

### 2.4 Setup Navigation

Create `mpt-android/src/navigation/AppNavigator.jsx`:

```jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../components/LoginScreen';
import TableSelection from '../components/TableSelection';
import PracticeScreen from '../components/PracticeScreen';
import ScoreBoard from '../components/ScoreBoard';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3b82f6',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TableSelection" 
          component={TableSelection}
          options={{ title: 'Select Table' }}
        />
        <Stack.Screen 
          name="Practice" 
          component={PracticeScreen}
          options={{ title: 'Practice' }}
        />
        <Stack.Screen 
          name="ScoreBoard" 
          component={ScoreBoard}
          options={{ title: 'Scores' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

### 2.5 Update Main App Component

Update `mpt-android/App.jsx`:

```jsx
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return <AppNavigator />;
};

export default App;
```

## Phase 3: Testing

### 3.1 Unit Testing Setup

Run the following commands from the React Native project root (`multiplication-trainer/mpt-android`).

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native

# Configure Jest
npm install --save-dev react-test-renderer
```

Create `jest.config.js` in the React Native project root (`multiplication-trainer/mpt-android`):

```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-vector-icons)/)',
  ],
};
```

### 3.2 Create Unit Tests

Create `__tests__/components/LoginScreen.test.js`:

```javascript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../src/components/LoginScreen';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('react-native-haptic-feedback');

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    expect(getByText('Multiplication Trainer')).toBeTruthy();
    expect(getByText('Enter your name to start')).toBeTruthy();
    expect(getByPlaceholderText('Your name')).toBeTruthy();
  });

  it('shows error when submitting empty name', async () => {
    const mockAlert = jest.spyOn(Alert, 'alert');
    const { getByText } = render(<LoginScreen />);
    
    fireEvent.press(getByText('Start Learning'));
    
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Error', 'Please enter your name');
    });
  });

  it('saves username and navigates on successful login', async () => {
    const mockNavigation = { replace: jest.fn() };
    AsyncStorage.setItem.mockResolvedValue();
    
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Your name'), 'John');
    fireEvent.press(getByText('Start Learning'));
    
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('username', 'John');
      expect(mockNavigation.replace).toHaveBeenCalledWith('TableSelection');
    });
  });
});
```

### 3.3 Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### 3.4 Manual Testing on Device

```bash
# Start Metro bundler
npm start

# Run on Android device/emulator
npx react-native run-android

# Enable remote debugging
# Shake device → Debug → Open Debugger
```

### 3.5 Performance Testing

Install Flipper for advanced debugging:

```bash
# Install Flipper
brew install --cask flipper

# Add Flipper to React Native
npm install --save-dev react-native-flipper
```

## Phase 4: Build Configuration

### 4.1 Generate Release Keystore

```bash
cd android/app

# Generate production keystore
keytool -genkey -v -keystore release.keystore -storepass your_store_password -alias your_key_alias -keypass your_key_password -keyalg RSA -keysize 2048 -validity 10000

cd ../..
```

### 4.2 Configure Maven for Release Build

Update `android/app/pom.xml` with release configuration:

```xml
<profiles>
    <profile>
        <id>release</id>
        <properties>
            <sign.keystore>${project.basedir}/release.keystore</sign.keystore>
            <sign.storepass>${env.STORE_PASSWORD}</sign.storepass>
            <sign.keypass>${env.KEY_PASSWORD}</sign.keypass>
            <sign.alias>${env.KEY_ALIAS}</sign.alias>
        </properties>
        <build>
            <plugins>
                <plugin>
                    <groupId>com.jayway.maven.plugins.android.generation2</groupId>
                    <artifactId>android-maven-plugin</artifactId>
                    <configuration>
                        <sign>
                            <debug>false</debug>
                        </sign>
                        <proguard>
                            <skip>false</skip>
                            <config>proguard.cfg</config>
                        </proguard>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>
</profiles>
```

Create `android/app/proguard.cfg`:

```proguard
# Add your ProGuard configuration here
-keep class com.facebook.react.** { *; }
-keep class com.multiplicationtrainer.** { *; }
-keep class androidx.** { *; }
-dontwarn com.facebook.react.**
-dontwarn com.multiplicationtrainer.**
```

### 4.3 Enable ProGuard

ProGuard is already configured in the Maven profile above. The configuration will be automatically applied when building with the release profile.

## Phase 5: App Store Preparation

### 5.1 App Assets

Create app icons and splash screens:

```bash
# Generate app icons
npx react-native generate-bootsplash assets/logo.png \
  --platforms=android \
  --background-source=assets/background.png \
  --logo-width=100 \
  --assets-path=android/app/src/main/res

# Generate adaptive icons
# Use Android Studio → Image Asset Studio
```

### 5.2 Update App Information

Update `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.multiplicationtrainer">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme"
      android:usesCleartextTraffic="true">
      
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize"
        android:exported="true">
        
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
    </application>
</manifest>
```

### 5.3 Build Release APK

```bash
# Navigate to Android directory
cd android

# Clean project
mvn clean

# Build debug APK
mvn package

# Build release APK with environment variables
export STORE_PASSWORD=your_store_password
export KEY_PASSWORD=your_key_password
export KEY_ALIAS=your_key_alias
mvn package -Prelease

# Build release AAB (Android App Bundle - recommended for Play Store)
mvn package -Prelease -Dandroid.packageFormat=aab

# Find generated files
# APK: android/app/target/multiplication-trainer-1.0.0.apk
# AAB: android/app/target/multiplication-trainer-1.0.0.aab

# Return to project root
cd ..
```

### 5.4 Maven Build Commands Reference

```bash
# Common Maven commands for Android development
mvn clean                    # Clean build artifacts
mvn compile                  # Compile source code
mvn package                  # Build APK
mvn install                  # Install to local repository
mvn deploy                   # Deploy to remote repository

# Build with specific profile
mvn package -Pdebug         # Build debug version
mvn package -Prelease       # Build release version

# Skip tests during build
mvn package -DskipTests     # Build without running tests

# Generate dependency tree
mvn dependency:tree         # Show dependency hierarchy

# Run specific tests
mvn test -Dtest=LoginScreenTest  # Run specific test class
```

## Phase 6: Google Play Store Deployment

### 6.1 Create Google Play Developer Account

1. Visit [Google Play Console](https://play.google.com/console)
2. Pay $25 one-time registration fee
3. Complete developer identity verification

### 6.2 Create New App

1. Click "Create app"
2. Fill in app details:
   - App name: "Multiplication Trainer"
   - Default language: English
   - Game or app: App
   - Free or paid: Free

### 6.3 Store Listing

Complete the store listing:

**App details:**
- App name: Multiplication Trainer
- Short description: Practice multiplication tables with fun exercises
- Full description: Detailed app description with features

**Graphics:**
- App icon: 512x512 PNG
- Feature graphic: 1024x500 JPEG
- Screenshots: Minimum 2, maximum 8 screenshots

**Categorization:**
- Category: Education
- Tags: mathematics, learning, practice, educational

### 6.4 Content Rating

1. Complete content rating questionnaire
2. Get rating from IARC (International Age Rating Coalition)
3. Usually "Everyone" for educational apps

### 6.5 Target Audience

- Primary audience: Children (ages 5-12)
- Secondary audience: Parents, teachers

### 6.6 Privacy Policy

Create a privacy policy addressing:
- Data collection (none for this app)
- Data usage
- Contact information

Host the policy on your website or GitHub Pages.

### 6.7 App Content

1. Upload the signed AAB file
2. Complete release notes
3. Set release to:
   - Internal testing (first)
   - Closed testing (beta)
   - Open testing
   - Production

### 6.8 Release Process

```bash
# Test internal release
# Upload to internal testing track
# Test with internal users

# Move to closed testing
# Add testers via email list or Google Groups
# Collect feedback

# Move to production
# Submit for review
# Wait for approval (usually 1-3 days)
```

### 6.9 Post-Launch

1. **Monitor crashes and ANRs** in Play Console
2. **Track user feedback** and ratings
3. **Update app regularly** with improvements
4. **Implement analytics** (Firebase Analytics)

## Phase 7: Maintenance and Updates

### 7.1 Version Management

Update `android/app/pom.xml` for new versions:

```xml
<properties>
    <maven.compiler.source>11</maven.compiler.source>
    <maven.compiler.target>11</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <android.sdk.version>31</android.sdk.version>
    <android.platform.version>31</android.platform.version>
    <!-- Increment versionCode for each release -->
    <version.code>2</version.code>
    <!-- Human-readable version -->
    <version.name>1.1</version.name>
</properties>

<version>${version.name}</version>
```

Update the Android manifest to use Maven properties:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.multiplicationtrainer"
    android:versionCode="${version.code}"
    android:versionName="${version.name}">
```

### 7.2 Update Process

1. Make code changes
2. Update version code and name in `pom.xml`
3. Test thoroughly with `mvn test`
4. Build new release AAB with `mvn package -Prelease -Dandroid.packageFormat=aab`
5. Upload to Play Console
6. Submit for review

### 7.3 Monitoring

Set up Firebase for crash reporting:

```bash
# Install Firebase
npm install @react-native-firebase/app @react-native-firebase/crashlytics

# Add Firebase configuration to pom.xml
<dependency>
    <groupId>com.google.firebase</groupId>
    <artifactId>firebase-crashlytics</artifactId>
    <version>18.6.0</version>
</dependency>

# Configure Firebase
# Follow Firebase documentation for Android setup
```

## Troubleshooting

### Common Issues

1. **Build fails with "SDK location not found"**
   - Set `ANDROID_HOME` environment variable
   - Check Android Studio SDK location
   - Verify Maven can access Android SDK

2. **Maven dependency resolution issues**
   - Run `mvn dependency:resolve` to diagnose
   - Check Maven central repository access
   - Verify Android Maven plugin compatibility

3. **App crashes on startup**
   - Check Metro bundler is running
   - Verify bundle is properly generated
   - Check for missing native modules
   - Review ProGuard configuration

4. **Google Play rejection**
   - Ensure all permissions are justified
   - Verify app functionality
   - Check content rating compliance

### Debug Commands

```bash
# Check Android devices
adb devices

# Install debug APK
adb install android/app/target/multiplication-trainer-1.0.0.apk

# View logs
adb logcat

# Clear app data
adb shell pm clear com.multiplicationtrainer

# Maven specific debugging
mvn package -X                    # Enable debug output
mvn dependency:tree              # Show dependency tree
mvn help:describe -Dplugin=android # Describe Android Maven plugin
```

## Timeline

- **Phase 1-2 (Development)**: 2-3 weeks
- **Phase 3 (Testing)**: 1 week
- **Phase 4-5 (Build & Prep)**: 1 week
- **Phase 6 (Deployment)**: 1 week
- **Phase 7 (Launch)**: 1 week

**Total Estimated Time**: 6-8 weeks

## Conclusion

This guide provides a comprehensive roadmap for converting the Multiplication Trainer web app into a native Android application. Following these steps will result in a performant, user-friendly app ready for the Google Play Store. Remember to test thoroughly and follow Google's guidelines to ensure a smooth approval process.
