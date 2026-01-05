# iOS App Development Guide - Tafels Oefenen

## Overview

This guide provides detailed instructions for setting up, running, and testing the "Tafels Oefenen" iOS app locally using Xcode and iOS simulators/devices.

## Prerequisites

### Hardware Requirements
- **Mac** with Apple Silicon (M1/M2/M3) or Intel-based Mac
- **Minimum**: 8GB RAM (16GB recommended)
- **Storage**: 20GB free space for Xcode and iOS SDKs

### Software Requirements
- **macOS**: Monterey (12.5) or later
- **Xcode**: 14.0 or later (download from Mac App Store)
- **iOS Simulator**: Included with Xcode
- **Command Line Tools**: Install via Xcode Preferences

### Apple Developer Account (Optional)
- **Free Account**: For local development and simulator testing
- **Paid Account ($99/year)**: For device testing and distribution

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
open TafelsOefenen.xcodeproj

# Or open Xcode and File → Open → Select TafelsOefenen.xcodeproj
```

### 2. Configure Project Settings

#### Target Settings
1. **Select Project** in navigator
2. **Target**: TafelsOefenen
3. **General Tab**:
   - **Display Name**: `Tafels Oefenen`
   - **Bundle Identifier**: `com.yourname.TafelsOefenen`
   - **Version**: `1.0`
   - **Build**: `1`
   - **Deployment Target**: `iOS 15.0`

#### Signing & Capabilities
1. **Team**: Select your Apple Developer account
2. **Signing Certificate**: Automatic (managed by Xcode)
3. **Capabilities**: Ensure none are initially selected

### 3. Choose Run Destination

#### iOS Simulator (Recommended for development)
1. **Device Selector**: Top toolbar in Xcode
2. **Available Simulators**:
   - iPhone 14 Pro
   - iPhone 14
   - iPhone SE (3rd generation)
   - iPad (if iPad support planned)

#### Physical Device (for real testing)
1. **Connect iPhone/iPad** via USB
2. **Trust Computer** on iOS device
3. **Select Device** from dropdown in Xcode
4. **Ensure signing** is configured correctly

### 4. Build and Run

#### Using Xcode UI
1. **Run Button** (▶) in top left
2. **Keyboard Shortcut**: `Cmd + R`
3. **Menu**: Product → Run

#### Using Command Line
```bash
# Build project
xcodebuild -project TafelsOefenen.xcodeproj -scheme TafelsOefenen -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build

# Run on simulator
xcodebuild -project TafelsOefenen.xcodeproj -scheme TafelsOefenen -destination 'platform=iOS Simulator,name=iPhone 17 Pro' run

# Run on physical device
xcodebuild -project TafelsOefenen.xcodeproj -scheme TafelsOefenen -destination 'platform=iOS,name=Your iPhone Name' run
```

## Testing Guide

### 1. Unit Testing

#### Create Unit Test Target
1. **File → New → Target**
2. **Template**: iOS → Unit Testing Bundle
3. **Product Name**: `TafelsOefenenTests`
4. **Language**: Swift

#### Write Unit Tests
```swift
// TafelsOefenenTests/TafelsOefenenTests.swift
import XCTest
@testable import TafelsOefenen

class TafelsOefenenTests: XCTestCase {
    
    func testQuestionGeneration() {
        // Test multiplication question generation
        let table = 5
        let multiplier = 3
        let expectedAnswer = 15
        
        // Add your question generation logic test here
        XCTAssertEqual(expectedAnswer, 15)
    }
    
    func testScoreCalculation() {
        // Test score calculation logic
        let duration = 45000 // milliseconds
        let expectedTime = 45 // seconds
        
        XCTAssertEqual(duration / 1000, expectedTime)
    }
}
```

#### Run Unit Tests
```bash
# Using Xcode
# Product → Test or Cmd + U

# Using command line
xcodebuild test -project TafelsOefenen.xcodeproj -scheme TafelsOefenen -destination 'platform=iOS Simulator,name=iPhone 14 Pro'
```

### 2. UI Testing

#### Create UI Test Target
1. **File → New → Target**
2. **Template**: iOS → UI Testing Bundle
3. **Product Name**: `TafelsOefenenUITests`

#### Write UI Tests
```swift
// TafelsOefenenUITests/TafelsOefenenUITests.swift
import XCTest

class TafelsOefenenUITests: XCTestCase {
    
    override func setUpWithError() throws {
        continueAfterFailure = false
    }
    
    func testAppLaunch() throws {
        let app = XCUIApplication()
        app.launch()
        
        // Test that app launches successfully
        XCTAssertTrue(app.exists)
    }
    
    func testLoginFlow() throws {
        let app = XCUIApplication()
        app.launch()
        
        // Test login screen elements
        let nameField = app.textFields["Jouw naam"]
        let startButton = app.buttons["Start Oefenen"]
        
        XCTAssertTrue(nameField.exists)
        XCTAssertTrue(startButton.exists)
        
        // Test login flow
        nameField.tap()
        nameField.typeText("Test User")
        startButton.tap()
        
        // Verify navigation to table selection
        let tableSelectionTitle = app.staticTexts["Tafels Oefenen"]
        XCTAssertTrue(tableSelectionTitle.waitForExistence(timeout: 2))
    }
    
    func testTableSelection() throws {
        let app = XCUIApplication()
        app.launch()
        
        // Complete login first
        let nameField = app.textFields["Jouw naam"]
        let startButton = app.buttons["Start Oefenen"]
        nameField.tap()
        nameField.typeText("Test User")
        startButton.tap()
        
        // Test table selection
        let tableButton = app.buttons["3"] // Select table 3
        XCTAssertTrue(tableButton.exists)
        tableButton.tap()
        
        // Verify navigation to practice screen
        let practiceHeader = app.staticTexts["Tafel van 3"]
        XCTAssertTrue(practiceHeader.waitForExistence(timeout: 2))
    }
}
```

#### Run UI Tests
```bash
# Using Xcode
# Product → Test or Cmd + U

# Using command line
xcodebuild test -project TafelsOefenen.xcodeproj -scheme TafelsOefenen -destination 'platform=iOS Simulator,name=iPhone 14 Pro' -only-testing:TafelsOefenenUITests
```

### 3. Manual Testing Checklist

#### Login Screen Tests
- [ ] App launches successfully
- [ ] Welcome message displays correctly
- [ ] Name input field accepts text
- [ ] Start button enables with valid input
- [ ] Navigation to table selection works

#### Table Selection Screen Tests
- [ ] Welcome message shows username
- [ ] Operation toggle switches between "Vermenigvuldigen" and "Delen"
- [ ] Table grid displays correctly (1-12)
- [ ] Custom table input accepts numbers and decimals
- [ ] Scoreboard button navigates correctly
- [ ] Logout button works

#### Practice Screen Tests
- [ ] Header shows correct operation and table
- [ ] Questions display in correct format
- [ ] Numeric keypad works correctly
- [ ] Decimal comma input works
- [ ] Backspace function works
- [ ] Submit button validates answers
- [ ] Progress indicator updates
- [ ] Feedback messages display correctly

#### Scoreboard Tests
- [ ] Scores display with operation symbols
- [ ] Sorting functionality works
- [ ] Clear scores function works
- [ ] Navigation back works

## Debugging Tools

### 1. Xcode Debugger
- **Breakpoints**: Click line numbers to set breakpoints
- **Variables**: View variable values in debug area
- **Console**: Check print statements and errors
- **View Hierarchy**: Debug UI layout issues

### 2. iOS Simulator Tools
- **Device Menu**: Simulate device features
- **Debug → View Debugging**: Inspect view hierarchy
- **Debug → Network Link Conditioner**: Test network scenarios
- **Debug → Location**: Simulate GPS locations

### 3. Logging
```swift
// Add logging to your code
import os.log

let logger = Logger(subsystem: "com.yourname.TafelsOefenen", category: "Practice")

// Log user actions
logger.info("User started practice for table \(table)")

// Log errors
logger.error("Failed to save score: \(error.localizedDescription)")
```

## Performance Testing

### 1. Memory Usage
```swift
// Monitor memory during practice sessions
// Use Xcode's Memory Graph Debugger
// Product → Memory Graph Debugger
```

### 2. CPU Performance
```swift
// Use Time Profiler
// Product → Profile → Time Profiler
```

### 3. Battery Impact
- Test with **Energy Log** in Instruments
- Monitor background activity
- Optimize for battery life

## Common Issues and Solutions

### Build Issues
1. **Code Signing Error**: Ensure Apple Developer account is configured
2. **Missing Frameworks**: Add required frameworks in project settings
3. **iOS Version Compatibility**: Check minimum deployment target

### Runtime Issues
1. **App Crashes**: Check Xcode console for crash logs
2. **UI Not Responding**: Check for main thread blocking
3. **Data Not Persisting**: Verify Core Data/UserDefaults implementation

### Simulator Issues
1. **Slow Performance**: Restart simulator or use physical device
2. **Keyboard Not Appearing**: Hardware → Keyboard → Toggle Software Keyboard
3. **Network Issues**: Check simulator network settings

## Best Practices

### 1. Code Organization
- Use SwiftUI views for UI components
- Separate business logic into ViewModels
- Use proper file naming conventions

### 2. Version Control
- Commit frequently with meaningful messages
- Use .gitignore for Xcode build files
- Branch for major features

### 3. Testing Strategy
- Write unit tests for business logic
- Use UI tests for critical user flows
- Test on multiple device sizes

## Next Steps

1. **Complete Implementation**: Follow the main development plan
2. **Add Comprehensive Tests**: Expand test coverage
3. **Performance Optimization**: Profile and optimize
4. **Prepare for Distribution**: Set up GitHub Actions workflow
5. **User Testing**: Test with real users on devices

## Resources

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui/)
- [Xcode User Guide](https://help.apple.com/xcode/mac/current/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/)
