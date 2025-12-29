# Multiplication Trainer - Functionality Specification

## Overview
A multiplication practice application designed to help users learn and practice multiplication tables. The app provides an interactive learning experience with user authentication, customizable practice sessions, and performance tracking.

## Core Features

### 1. User Authentication & Profile Management
- **Login Screen**: Simple username input with validation
- **Name Formatting**: Automatic capitalization of first letter, lowercase for rest
- **Persistent Login**: Username stored in localStorage/session storage
- **Logout Functionality**: Clear user session and return to login
- **Session Management**: Automatic redirect to login if not authenticated

### 2. Table Selection
- **Predefined Tables**: 16 default multiplication tables:
  - Decimal tables: 0.125, 0.25
  - Whole number tables: 1, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 25
- **Custom Table Input**: Users can input any positive number (decimal or whole)
- **Input Validation**: Accepts both comma (,) and dot (.) as decimal separators
- **Visual Grid Layout**: 3-column responsive grid for table buttons
- **Hover Effects**: Interactive button animations and transitions

### 3. Practice Session
- **Question Generation**: 
  - 10 questions per session (multipliers 1-10)
  - Randomized question order
  - Supports decimal and whole number multiplicands
- **Answer Input**:
  - Desktop: Text input with keyboard
  - Mobile: On-screen numeric keypad with decimal support
  - Input validation for numbers and single decimal point
- **Real-time Feedback**:
  - Instant validation after submission
  - "Goed!" (Correct) with green background for correct answers
  - "Fout, probeer opnieuw" (Wrong, try again) with red background for incorrect
  - Auto-advance to next question after correct answer (1-second delay)
- **Progress Tracking**: Shows current question number (e.g., "Vraag 3 van 10")
- **Session Timer**: Tracks total practice duration in seconds
- **Early Exit**: "Stop Oefenen" button to return to table selection

### 4. Mobile-Specific Features
- **Responsive Design**: Adapts layout for different screen sizes
- **Virtual Keyboard**: Custom numeric keypad for mobile devices
  - Numbers 0-9
  - Decimal comma button
  - Backspace functionality
  - Visual feedback on button press
- **Touch Optimization**: Larger touch targets for mobile interaction

### 5. Score Tracking & Leaderboard
- **Score Storage**: Each completed session saves:
  - Username
  - Practiced table
  - Completion duration (seconds)
  - Timestamp (ISO format)
- **Score Display**:
  - Sorted by fastest completion time
  - Shows username, table, duration, and date/time
  - Responsive grid layout (4 columns desktop, 2 columns mobile)
- **Score Management**:
  - "Wis Scorebord" (Clear Scoreboard) with confirmation dialog
  - Persistent storage in localStorage
- **Empty State**: Message when no scores are available

### 6. Navigation & User Flow
- **Route Structure**:
  - `/` - Login screen (redirects to /tables if logged in)
  - `/tables` - Table selection (requires authentication)
  - `/practice/:table` - Practice session (requires authentication)
  - `/scores` - Scoreboard (requires authentication)
- **Navigation Guards**: Automatic redirect to login if not authenticated
- **Breadcrumb Navigation**: Clear back buttons and navigation options

## Technical Implementation Details

### Data Storage
- **localStorage** for:
  - Username persistence
  - Score history storage
- **Data Format**:
  - Username: String
  - Scores: Array of objects with username, table, duration, timestamp

### Input Handling
- **Number Validation**: Regex patterns for number input
- **Decimal Support**: Both comma and dot decimal separators
- **Floating Point Precision**: Epsilon comparison (0.0001) for answer validation
- **Input Length Limits**: Maximum 10 characters for answer input

### Responsive Design
- **Breakpoints**:
  - Mobile: < 768px (shows virtual keyboard)
  - Tablet/Desktop: ≥ 768px (uses text input)
- **CSS Classes**: Tailwind CSS with responsive prefixes (sm:, xs:, small-mobile:)
- **Layout Adaptation**: Grid columns, button sizes, text scaling

### Error Handling
- **Invalid Table Numbers**: Redirect with error message for invalid table parameters
- **Empty Input Validation**: Prevent submission of empty answers
- **Navigation Protection**: Route guards for authenticated pages

## User Experience Features

### Visual Design
- **Color Scheme**:
  - Primary: Blue (#3B82F6) for main actions
  - Secondary: Teal (#14B8A6) for headers
  - Success: Green (#16A34A) for correct answers
  - Error: Red (#DC2626) for wrong answers
  - Background: Light gray (#F8FAFC)
- **Typography**: Responsive font sizes (text-4xl to text-xs)
- **Animations**: Hover effects, transitions, and micro-interactions
- **Card Design**: Rounded corners, shadows, and white backgrounds

### Accessibility
- **Semantic HTML**: Proper heading hierarchy and form elements
- **Focus States**: Visible focus indicators for keyboard navigation
- **Color Contrast**: Sufficient contrast ratios for readability
- **Touch Targets**: Minimum 44px touch targets for mobile

### Performance
- **Local Storage**: Fast data persistence without network requests
- **Client-side Routing**: Instant navigation between screens
- **Minimal Dependencies**: Lightweight implementation for fast loading

## Localization
- **Language**: Dutch (Nederlands)
- **Text Content**:
  - App title: "Tafels Oefenen" (Tables Practice)
  - Welcome message: "Welkom {username}!"
  - Instructions: "Welk tafeltje wil je oefenen?" (Which table do you want to practice?)
  - Feedback messages: "Goed!", "Fout, probeer opnieuw"
  - Completion message: "Goed gedaan! 🎉"

## Educational Features
- **Learning Progression**: Start with easier tables, progress to harder ones
- **Immediate Feedback**: Instant validation reinforces learning
- **Motivation**: Timer and scoring system encourage improvement
- **Flexibility**: Custom table input allows targeted practice
- **Repetition**: Randomized questions ensure comprehensive coverage

## Extension Points
- **Difficulty Levels**: Could add easy/medium/hard modes
- **Question Types**: Could add division, addition, subtraction
- **Progress Analytics**: Could add detailed performance metrics
- **Multiplayer**: Could add competitive features
- **Sound Effects**: Could add audio feedback
- **Achievements**: Could add gamification elements

## Security Considerations
- **Input Sanitization**: Validate all user inputs
- **XSS Prevention**: Properly escape user-generated content
- **Data Validation**: Ensure numeric inputs are within reasonable ranges
- **Local Storage Limits**: Monitor storage usage for score history
