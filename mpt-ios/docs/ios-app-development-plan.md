# iOS App Development Plan - Tafels Oefenen

## Table of Contents

- [Overview](#overview)
- [App Functionality](#app-functionality)
  - [Core Features](#core-features)
  - [Technical Requirements](#technical-requirements)
- [Screen Designs](#screen-designs-based-on-android-screenshots)
  - [Login Screen](#1-login-screen)
  - [Table Selection Screen](#2-table-selection-screen)
  - [Practice Screen](#3-practice-screen)
  - [Completion Screen](#4-completion-screen)
- [Development Steps](#development-steps)
  - [Phase 1: Project Setup](#phase-1-project-setup)
  - [Phase 2: Core Models](#phase-2-core-models)
  - [Phase 3: View Implementation](#phase-3-view-implementation)
  - [Phase 4: Data Persistence](#phase-4-data-persistence)
  - [Phase 5: Styling and Polish](#phase-5-styling-and-polish)
  - [Phase 6: Distribution Setup](#phase-6-distribution-setup)
- [Technical Considerations](#technical-considerations)
  - [Localization](#localization)
  - [Accessibility](#accessibility)
  - [Performance](#performance)
  - [Testing](#testing)
- [GitHub Actions Workflow](#github-actions-workflow)
  - [Extended Build and Deploy Workflow](#extended-build-and-deploy-workflow)
  - [Separate iOS-Only Workflow (Optional)](#separate-ios-only-workflow-optional)
- [Installation Guide for Users](#installation-guide-for-users)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
  - [Troubleshooting](#troubleshooting)
- [Timeline Estimate](#timeline-estimate)
- [Success Criteria](#success-criteria)
- [Next Steps](#next-steps)

## Overview

Create an iOS version of the "Tafels Oefenen" (Multiplication Trainer) app using Swift and SwiftUI that provides identical functionality to the existing Android app. The app will be distributed via GitHub Pages for sideloading, not through the App Store.

## App Functionality

### Core Features
1. **User Login Screen**
   - Welcome message in Dutch
   - Name input field
   - Start practice button
   - Clean, modern UI with Material Design-inspired styling

2. **Table Selection Screen**
   - Personalized welcome message
   - **Operation Selection**: Switch/toggle to choose between **Vermenigvuldigen** (×) and **Delen** (÷)
   - Grid of multiplication tables (1-12)
   - Custom table input option (including decimals like 1.5)
   - View scoreboard button
   - Logout button

3. **Practice Screen**
   - Display "Tafel van [table number]" header (for multiplication) or "Delen door [table number]" (for division)
   - Question display (e.g., "2 × 9 = " for multiplication, "18 ÷ 9 = " for division)
   - Answer input area
   - Numeric keypad (0-9, decimal comma, backspace)
   - Submit button
   - Stop practice button
   - Progress indicator (e.g., "Vraag 1 van 10")
   - Feedback messages for correct/incorrect answers

4. **Completion Screen**
   - App title "Tafels Oefenen"
   - Completion message with time taken
   - Return to table selection button
   - Score summary

5. **Scoreboard**
   - List of user scores
   - Table operation and number (e.g., "× 2", ": 3")
   - Time, and date
   - Sortable by time or date

### Technical Requirements
- **Language**: Swift
- **UI Framework**: SwiftUI
- **Data Storage**: Core Data or UserDefaults
- **Navigation**: SwiftUI NavigationStack
- **Target iOS Version**: iOS 15.0+
- **Device Support**: iPhone (portrait orientation)

## Screen Designs (Based on Android Screenshots)

### 1. Login Screen
- **Layout**: Centered content with app title at top
- **App Title**: "Tafels Oefenen" (bold, blue, 32sp equivalent)
- **Welcome Text**: "Welkom!" (green, 22sp equivalent)
- **Instruction**: "Voer je naam in om te beginnen" (gray, 16sp equivalent)
- **Input Card**: White card with rounded corners, shadow
- **Name Field**: Material-style text input with hint "Jouw naam"
- **Start Button**: Blue button with "Start Oefenen" text

### 2. Table Selection Screen
- **Header**: "Tafels Oefenen" title (blue, 28sp equivalent)
- **Welcome Message**: "Welkom [username]!" (secondary color, 20sp equivalent)
- **Subtitle**: "Welk tafeltje wil je oefenen?" (16sp equivalent)
- **Scoreboard Button**: Secondary color button above table grid
- **Operation Toggle**: iOS-style switch with label "Vermenigvuldigen" (when ON) or "Delen" (when OFF)
- **Table Grid**: 3-column grid of numbered buttons (1-12)
- **Custom Table Card**: Input field with hint "Bijv. 7 of 1,5" and "Start" button
- **Logout Button**: Red button at bottom

### 3. Practice Screen
- **Header**: "Tafel van [table]" (green, 34sp equivalent)
- **Question**: "[num1] × [num2] =" (black, 32sp equivalent)
- **Answer Display**: User input (blue, 36sp equivalent)
- **Keypad**: 3x4 grid with numbers 7-9, 4-6, 1-3, comma, 0, backspace
- **Submit Button**: Green "Controleer" button
- **Stop Button**: Outlined "Stop Oefenen" button
- **Progress**: "Vraag X van 10" (gray, 16sp equivalent)

### 4. Completion Screen
- **Header**: "Tafels Oefenen" (blue, 24sp equivalent)
- **Completion Card**: White card with completion message
- **Message**: "Je hebt de tafel van [table] afgerond in [time] seconden!"
- **Return Button**: "Kies een andere tafel" or similar

## Development Steps

### Phase 1: Project Setup
1. **Create Xcode Project**
   - New iOS App project
   - Interface: SwiftUI
   - Language: Swift
   - Minimum iOS Version: 15.0
   - Product Name: TafelsOefenen

2. **Project Structure**
   ```
   TafelsOefenen/
   ├── Views/
   │   ├── LoginView.swift
   │   ├── TableSelectionView.swift
   │   ├── PracticeView.swift
   │   ├── CompletionView.swift
   │   └── ScoreboardView.swift
   ├── Models/
   │   ├── User.swift
   │   ├── Score.swift
   │   └── PracticeSession.swift
   ├── ViewModels/
   │   ├── LoginViewModel.swift
   │   ├── PracticeViewModel.swift
   │   └── ScoreboardViewModel.swift
   ├── Utils/
   │   ├── Constants.swift
   │   └── Extensions.swift
   └── Resources/
       ├── Assets.xcassets
       └── Localizable.strings
   ```

### Phase 2: Core Models
1. **User Model**
   ```swift
   struct User: Codable, Identifiable {
       let id: UUID
       let name: String
       let createdAt: Date
   }
   ```

2. **Score Model**
   ```swift
   struct Score: Codable, Identifiable {
       let id: UUID
       let userId: UUID
       let tableNumber: Double
       let duration: TimeInterval
       let completedAt: Date
   }
   ```

3. **Practice Session Model**
   ```swift
   class PracticeSession: ObservableObject {
       @Published var currentQuestion: Int = 0
       @Published var totalQuestions: Int = 10
       @Published var tableNumber: Double = 0
       @Published var startTime: Date = Date()
       @Published var userAnswer: String = ""
       @Published var feedback: String?
       // ... additional properties
   }
   ```

### Phase 3: View Implementation
1. **LoginView**
   - TextField for name input
   - Navigation to TableSelectionView
   - Validation for empty names

2. **TableSelectionView**
   - LazyVGrid for table buttons
   - Custom table input section
   - Navigation to PracticeView

3. **PracticeView**
   - Question generation logic
   - Custom keypad implementation
   - Answer validation
   - Timer functionality
   - Progress tracking

4. **CompletionView**
   - Time calculation
   - Score saving
   - Navigation back to TableSelectionView

5. **ScoreboardView**
   - Score list display
   - Sorting functionality
   - Filtering options

### Phase 4: Data Persistence
1. **UserDefaults Setup**
   - Store current user
   - Store scores array
   - Store app settings

2. **Data Management**
   - Save scores after completion
   - Load scores on app launch
   - Clean up old scores if needed

### Phase 5: Styling and Polish
1. **Color Scheme**
   ```swift
   extension Color {
       static let primary = Color(red: 0.23, green: 0.51, blue: 0.96) // #3B82F6
       static let primaryDark = Color(red: 0.15, green: 0.39, blue: 0.92) // #2563EB
       static let secondary = Color(red: 0.08, green: 0.72, blue: 0.65) // #14B8A6
       static let success = Color(red: 0.09, green: 0.64, blue: 0.29) // #16A34A
       static let error = Color(red: 0.86, green: 0.15, blue: 0.15) // #DC2626
       static let background = Color(red: 0.97, green: 0.98, blue: 0.98) // #F8FAFC
   }
   ```

2. **Typography**
   - System font with appropriate sizes
   - Bold weights for titles
   - Consistent spacing and padding

3. **Animations**
   - Smooth transitions between screens
   - Button press feedback
   - Score entry animations

### Phase 6: Distribution Setup
1. **Repository Integration**
   - iOS app code in `/mpt-ios/` folder of existing multiplication-trainer repository
   - GitHub Pages deployment to `https://edwinbulter.github.io/multiplication-trainer/mpt-ios/`
   - Share existing repository structure with Android app

2. **GitHub Pages Distribution**
   - Extend existing GitHub Actions workflows
   - Add iOS build step alongside Android build
   - Generate IPA file for sideloading
   - Create download page with installation instructions

3. **Build Configuration**
   - Development signing certificate
   - Provisioning profile for ad-hoc distribution
   - Bundle identifier: `com.edwinbulter.tafels-oefenen`

4. **Installation Instructions**
   - Guide for trusting developer certificate
   - Step-by-step installation process
   - Troubleshooting common issues

## Technical Considerations

### Localization
- All UI text in Dutch
- Use NSLocalizedString for easy translation
- Support for Dutch number formatting (comma as decimal separator)

### Accessibility
- VoiceOver support for all UI elements
- Dynamic type support
- High contrast mode support

### Performance
- Efficient question generation
- Smooth animations
- Minimal memory usage

### Testing
- Unit tests for business logic
- UI tests for user flows
- Device testing on various iPhone models

## GitHub Actions Workflow

### Extended Build and Deploy Workflow
```yaml
name: Deploy APK and IPA to GitHub Pages

on:
  workflow_dispatch: # Manual triggering only from GitHub UI

permissions:
  contents: write
  pages: write
  id-token: write

jobs:
  build-android:
    runs-on: ubuntu-latest
    # ... existing Android build steps ...
    
  build-ios:
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Xcode
      uses: maxim-lobanov/setup-xcode@v1
      with:
        xcode-version: latest-stable
    
    - name: Build iOS App
      run: |
        cd mpt-ios
        xcodebuild -project TafelsOefenen.xcodeproj \
                   -scheme TafelsOefenen \
                   -configuration Release \
                   -destination generic/platform=iOS \
                   -archivePath $PWD/build.xcarchive \
                   archive
    
    - name: Export IPA
      run: |
        cd mpt-ios
        xcodebuild -exportArchive \
                   -archivePath $PWD/build.xcarchive \
                   -exportOptionsPlist ExportOptions.plist \
                   -exportPath $PWD/build
    
    - name: Upload iOS Artifacts
      uses: actions/upload-artifact@v3
      with:
        name: tafels-oefenen-ios
        path: mpt-ios/build/*.ipa
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./mpt-ios/build
        destination_dir: mpt-ios
```

### Separate iOS-Only Workflow (Optional)
```yaml
name: Build and Deploy iOS App Only

on:
  workflow_dispatch:

jobs:
  build-ios:
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Xcode
      uses: maxim-lobanov/setup-xcode@v1
      with:
        xcode-version: latest-stable
    
    - name: Build iOS App
      run: |
        cd mpt-ios
        xcodebuild -project TafelsOefenen.xcodeproj \
                   -scheme TafelsOefenen \
                   -configuration Release \
                   -destination generic/platform=iOS \
                   -archivePath $PWD/build.xcarchive \
                   archive
    
    - name: Export IPA
      run: |
        cd mpt-ios
        xcodebuild -exportArchive \
                   -archivePath $PWD/build.xcarchive \
                   -exportOptionsPlist ExportOptions.plist \
                   -exportPath $PWD/build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./mpt-ios/build
        destination_dir: mpt-ios
```

## Installation Guide for Users

### Prerequisites
- iPhone with iOS 15.0 or later
- Trusting developer certificate capability

### Installation Steps
1. **Download IPA File**
   - Visit GitHub Pages download page: `https://edwinbulter.github.io/multiplication-trainer/mpt-ios/`
   - Download the IPA file directly to iPhone

2. **Install App**
   - Open Settings app
   - Go to General > VPN & Device Management
   - Find developer profile and tap "Trust"
   - Open Files app and tap IPA file
   - Follow installation prompts

3. **Launch App**
   - Find "Tafels Oefenen" on home screen
   - Grant necessary permissions if prompted

### Troubleshooting
- "Unable to Install App": Check iOS version compatibility
- "Untrusted Developer": Follow certificate trust steps
- "App Won't Open": Restart iPhone and try again

## Timeline Estimate

- **Phase 1-2**: 2-3 days (Setup and Models)
- **Phase 3**: 5-7 days (View Implementation)
- **Phase 4**: 1-2 days (Data Persistence)
- **Phase 5**: 2-3 days (Styling and Polish)
- **Phase 6**: 2-3 days (Distribution Setup)

**Total Estimated Time**: 12-18 days

## Success Criteria

1. **Functional Parity**: All Android app features replicated
2. **Visual Consistency**: Similar look and feel to Android version
3. **Smooth Distribution**: Easy sideloading via GitHub Pages
4. **User Experience**: Intuitive navigation and responsive UI
5. **Code Quality**: Well-structured, maintainable Swift code

## Next Steps

1. Review and approve this development plan
2. Set up iOS development environment
3. Create Xcode project in `/mpt-ios/` folder with initial structure
4. Begin implementation starting with LoginView
5. Extend existing GitHub Actions workflow for iOS builds
6. Test on physical devices
7. Prepare GitHub Pages deployment to `/mpt-ios/` subdirectory
8. Create user installation guide

This plan provides a comprehensive roadmap for creating an iOS version of the Tafels Oefenen app with identical functionality to the Android version, distributed via GitHub Pages for easy sideloading within the existing multiplication-trainer repository structure.
