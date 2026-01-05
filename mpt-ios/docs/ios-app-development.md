# iOS App Development Guide

## Overview
This guide covers the setup and development process for the "Tafels Oefenen" iOS application, a multiplication trainer app built with Swift and SwiftUI.

## Prerequisites

### Hardware Requirements
- Mac computer (MacBook Pro, Mac mini, iMac, or Mac Studio)
- Minimum 8GB RAM (16GB recommended)
- At least 20GB free disk space

### Software Requirements
- macOS Monterey (12.5) or later
- Xcode 14.0 or later
- Apple Developer Account (free version sufficient for simulator testing)

## Setup Instructions

### 1. Install Xcode
```bash
# Install via Mac App Store (recommended)
# Or download from https://developer.apple.com/xcode/

# Install command line tools
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

### 2. Verify Installation
```bash
# Check Xcode version
xcodebuild -version

# Check installed simulators
xcrun simctl list devices
```

### 3. Clone the Repository
```bash
# Clone the main repository
git clone https://github.com/edwinbulter/multiplication-trainer.git
cd multiplication-trainer/mpt-ios

# If iOS project doesn't exist yet, create it (see Project Setup section)
```

## Project Setup

### Creating the iOS Project (if not already exists)

#### Option A: Using Xcode
1. **Open Xcode**
2. **Create New Project**: File → New → Project
3. **Template**: iOS → App
4. **Project Settings**:
   - **Product Name**: `TafelsOefenen`
   - **Team**: Your Apple Developer account (or None)
   - **Organization Identifier**: `com.yourname`
   - **Bundle Identifier**: `com.yourname.TafelsOefenen`
   - **Interface**: SwiftUI
   - **Language**: Swift
   - **Minimum iOS Version**: iOS 15.0
   - **Use Core Data**: Checked
5. **Save**: Choose location within `mpt-ios/` folder

#### Option B: Using Command Line
```bash
# Navigate to mpt-ios directory
cd /Users/e.g.h.bulter/IdeaProjects/multiplication-trainer/mpt-ios

# Create Xcode project structure
mkdir -p TafelsOefenen/TafelsOefenen
mkdir -p TafelsOefenen/TafelsOefenen/Views
mkdir -p TafelsOefenen/TafelsOefenen/Models
mkdir -p TafelsOefenen/TafelsOefenen/ViewModels

# Create basic project files (simplified - use Xcode for full setup)
```

## Running the App Locally

### 1. Open the Project
```bash
# Using command line
open TafelsOefenen/TafelsOefenen.xcodeproj

# Or open Xcode and File → Open → Select TafelsOefenen.xcodeproj
```

### 2. Configure Project Settings

#### Target Settings
1. **Select Project** in navigator
2. **Select Target** → "TafelsOefenen"
3. **General Tab**:
   - **Deployment Target**: iOS 15.0
   - **Bundle Identifier**: `com.yourname.TafelsOefenen`
   - **Team**: Your Apple Developer account

#### Build Settings
1. **Build Settings** tab
2. **Search for "Swift Language Version"**
3. **Set to**: Swift 5.0 or later

### 3. Build and Run

#### Using Xcode UI
1. **Run Button** (▶) in top left
2. **Keyboard Shortcut**: `Cmd + R`
3. **Menu**: Product → Run

#### Using Command Line
```bash
# IMPORTANT: Navigate to the correct directory first
cd TafelsOefenen

# Build project
xcodebuild -project TafelsOefenen.xcodeproj -scheme TafelsOefenen -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build

# Run on simulator
xcodebuild -project TafelsOefenen.xcodeproj -scheme TafelsOefenen -destination 'platform=iOS Simulator,name=iPhone 17 Pro' run

# Run on physical device
xcodebuild -project TafelsOefenen.xcodeproj -scheme TafelsOefenen -destination 'platform=iOS,name=Your iPhone Name' run
```

**Important Note**: Always run build commands from the `TafelsOefenen` subdirectory, not from the `mpt-ios` root directory. The Xcode project file is located at `TafelsOefenen/TafelsOefenen.xcodeproj`.

## Testing Guide

### 1. Unit Testing

#### Create Unit Test Target
1. **File** → **New** → **Target**
2. **Choose**: iOS → Unit Testing Bundle
3. **Product Name**: `TafelsOefenenTests`
4. **Finish**

#### Write Unit Tests
```swift
import XCTest
@testable import TafelsOefenen

class TafelsOefenenTests: XCTestCase {
    func testUserCreation() {
        let user = User(username: "TestUser")
        XCTAssertEqual(user.username, "TestUser")
    }
    
    func testScoreCalculation() {
        let score = Score(username: "Test", table: "5", operation: "multiply", duration: 30.0)
        XCTAssertEqual(score.duration, 30.0)
    }
}
```

#### Run Tests
```bash
# Run unit tests
xcodebuild test -project TafelsOefenen.xcodeproj -scheme TafelsOefenen -destination 'platform=iOS Simulator,name=iPhone 17 Pro'
```

### 2. UI Testing

#### Create UI Test Target
1. **File** → **New** → **Target**
2. **Choose**: iOS → UI Testing Bundle
3. **Product Name**: `TafelsOefenenUITests`
4. **Finish**

#### Write UI Tests
```swift
import XCTest

class TafelsOefenenUITests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = false
    }
    
    func testLoginFlow() throws {
        let app = XCUIApplication()
        app.launch()
        
        // Test login functionality
        let nameTextField = app.textFields["Jouw naam"]
        nameTextField.tap()
        nameTextField.typeText("TestUser")
        
        let startButton = app.buttons["Start Oefenen"]
        XCTAssertTrue(startButton.exists)
        startButton.tap()
    }
}
```

## Project Structure

```
TafelsOefenen/
├── TafelsOefenen.xcodeproj/
├── TafelsOefenen/
│   ├── TafelsOefenenApp.swift          # App entry point
│   ├── ContentView.swift               # Root view
│   ├── AppState.swift                  # Global state management
│   ├── Models/                         # Data models
│   │   ├── User.swift
│   │   ├── Score.swift
│   │   └── PracticeSession.swift
│   ├── ViewModels/                     # View logic
│   │   ├── LoginViewModel.swift
│   │   ├── PracticeViewModel.swift
│   │   └── ScoreboardViewModel.swift
│   ├── Views/                          # UI views
│   │   ├── LoginView.swift
│   │   ├── TableSelectionView.swift
│   │   ├── PracticeView.swift
│   │   ├── CompletionView.swift
│   │   └── ScoreboardView.swift
│   ├── Utils/                          # Utilities
│   │   ├── Constants.swift
│   │   ├── Extensions.swift
│   │   └── StorageManager.swift
│   ├── Resources/                      # Resources
│   │   └── Localizable.strings
│   └── Assets.xcassets/               # Images, colors, icons
└── docs/                              # Documentation
    └── ios-app-development.md
```

## Development Workflow

### 1. Feature Development
1. **Create branch**: `git checkout -b feature/new-feature`
2. **Implement changes**: Add/modify Swift files
3. **Test locally**: Build and run in simulator
4. **Commit changes**: `git commit -m "Add new feature"`
5. **Push branch**: `git push origin feature/new-feature`
6. **Create PR**: Submit pull request for review

### 2. Code Review Process
1. **Peer review**: Team member reviews code
2. **Automated tests**: CI/CD pipeline runs tests
3. **Merge**: Merge to main branch after approval

### 3. Deployment
1. **Archive**: Product → Archive
2. **Upload**: Upload to App Store Connect
3. **Submit**: Submit for review

## Troubleshooting

### Common Issues

#### Build Errors
- **Missing imports**: Ensure `import Combine` for ObservableObject classes
- **Target membership**: Verify files are added to correct target
- **iOS version**: Check deployment target compatibility

#### Simulator Issues
- **Reset simulator**: Xcode → Device → Erase All Content and Settings
- **Check iOS version**: Ensure simulator matches deployment target

#### Code Signing
- **Team selection**: Choose correct development team
- **Bundle ID**: Ensure unique bundle identifier
- **Provisioning profile**: Update if expired

### Debug Commands
```bash
# Clean build folder
xcodebuild clean -project TafelsOefenen.xcodeproj -scheme TafelsOefenen

# Show build settings
xcodebuild -project TafelsOefenen.xcodeproj -scheme TafelsOefenen -showBuildSettings

# List available destinations
xcrun simctl list devices
```

## Best Practices

### Code Organization
- **Single responsibility**: Each class has one clear purpose
- **MVVM pattern**: Separate UI, logic, and data
- **Protocol-oriented**: Use protocols for testability

### Performance
- **Lazy loading**: Load views only when needed
- **Memory management**: Avoid strong reference cycles
- **Image optimization**: Use appropriate image sizes

### Accessibility
- **VoiceOver**: Support screen readers
- **Dynamic Type**: Support text scaling
- **Color contrast**: Ensure readability

## Resources

### Documentation
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui/)
- [Xcode Documentation](https://help.apple.com/xcode/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/)

### Tools
- [Xcode](https://developer.apple.com/xcode/)
- [Instruments](https://help.apple.com/instruments/)
- [Simulator](https://help.apple.com/simulator/)

### Communities
- [Apple Developer Forums](https://developer.apple.com/forums/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/ios+swift+swiftui)
- [Reddit r/iOSProgramming](https://www.reddit.com/r/iOSProgramming/)
