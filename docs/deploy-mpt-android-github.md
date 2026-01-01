# Deploy mpt-android to GitHub Pages

This guide describes how to set up GitHub Actions to automatically build and sign the mpt-android app, making it available for direct download and installation through GitHub Pages.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [1. GitHub Secrets Configuration](#1-github-secrets-configuration)
- [2. GitHub Actions Workflow](#2-github-actions-workflow)
  - [2.1 GitHub Pages Workflow](#21-github-pages-workflow)
- [3. GitHub Pages Deployment](#3-github-pages-deployment)
  - [3.1 How It Works](#31-how-it-works)
  - [3.2 User Experience](#32-user-experience)
  - [3.3 Installation Link](#33-installation-link)
  - [3.4 Features](#34-features)
- [4. User Installation Guide](#4-user-installation-guide)
  - [4.1 Direct Link Installation](#41-direct-link-installation)
  - [4.2 Step-by-Step Installation](#42-step-by-step-installation)
  - [4.3 Installation Requirements](#43-installation-requirements)
  - [4.4 Troubleshooting](#44-troubleshooting)
- [5. Setup Instructions](#5-setup-instructions)
  - [5.1 Enable GitHub Pages](#51-enable-github-pages)
  - [5.2 Add Workflow File](#52-add-workflow-file)
  - [5.3 Test Deployment](#53-test-deployment)
- [6. Security Considerations](#6-security-considerations)
  - [6.1 Keystore Protection](#61-keystore-protection)
  - [6.2 Access Control](#62-access-control)
- [7. Maintenance and Updates](#7-maintenance-and-updates)
  - [7.1 Version Management](#71-version-management)
  - [7.2 Monitoring](#72-monitoring)
  - [7.3 Best Practices](#73-best-practices)
- [Troubleshooting](#troubleshooting)
- [Quick Start Summary](#quick-start-summary)
- [Final Result](#final-result)

## Overview

This GitHub Actions workflow will:

1. **Automatically trigger** on pushes to main branch
2. **Build and sign** the mpt-android app using secure secrets
3. **Generate APK** for direct installation
4. **Deploy to GitHub Pages** for user access
5. **Create professional download page** with installation instructions

### Benefits

- ✅ **Automated builds** - No manual compilation required
- ✅ **Secure signing** - Keystore credentials stored in GitHub Secrets
- ✅ **Direct distribution** - Users can install without Play Store
- ✅ **Professional download page** - Modern, mobile-friendly interface
- ✅ **One-click installation** - Simple user experience
- ✅ **Open source friendly** - Anyone can access and install

---

## Prerequisites

### Required Accounts and Tools
- **GitHub Repository** with mpt-android code
- **GitHub Actions** enabled (free for public repos)
- **GitHub Pages** enabled in repository settings
- **Keystore file** and signing credentials (for local development)

### Before You Begin
- Have app versioning strategy ready
- Enable GitHub Pages in repository settings
- Test local builds work correctly
- Create production keystore (see section 1.3)
- Create keystore.properties for local development (optional)
- Update build.gradle.kts with fallback logic (see section 1.4)
- Add keystore files to .gitignore (see section 1.6)

---

## 1. GitHub Secrets Configuration

### 1.1 Required Secrets

Navigate to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

#### Create these secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|----------------|
| `KEYSTORE_FILE` | Base64 encoded keystore file | (see below) |
| `KEYSTORE_PASSWORD` | Keystore password | `your_keystore_password` |
| `KEY_ALIAS` | Key alias name | `tafels_oefenen` |
| `KEY_PASSWORD` | Key password | `your_key_password` |
| `SIGNING_KEYSTORE_BASE64` | Alternative: Base64 keystore (recommended) | (see below) |

### 1.2 Encode Keystore File

#### Using Command Line (Recommended)
```bash
# Navigate to your keystore directory
cd /path/to/keystore

# Encode keystore file to Base64
base64 -i mpt-keystore | tr -d '\n' > keystore_base64.txt

# Copy the content (one long line)
cat keystore_base64.txt

# Clean up temporary file
rm keystore_base64.txt
```

### 1.3 Create and Encode Production Keystore

**Important:** You must create the production keystore ONCE locally, then encode it for GitHub Actions. **Never let GitHub Actions create the keystore** as this will break app updates.

#### **Why Not Create Keystore in GitHub Actions?**

**❌ Disadvantages of GitHub Actions Creating Keystore:**
- **Breaks App Updates:** Each build creates a new keystore with different certificate
- **Update Failures:** Users get "App not installed" errors when updating
- **Data Loss:** Users must uninstall/reinstall, losing all app data
- **Poor User Experience:** Unprofessional behavior that frustrates users
- **Store Incompatibility:** Won't work with Google Play or other app stores
- **Security Issues:** Unpredictable certificate management

**✅ Benefits of Fixed Keystore:**
- **Smooth Updates:** Same certificate for all versions
- **Professional Behavior:** Users expect seamless updates
- **Store Ready:** Compatible with all distribution methods
- **Security:** Controlled certificate management
- **User Trust:** Professional app experience

#### **Step 1: Create Production Keystore (One-Time Setup)**

```bash
# Create production keystore (do this once, keep it secure)
keytool -genkeypair -v -storetype PKCS12 -keystore mpt-keystore \
  -alias tafels_oefenen -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=Tafels Oefenen, OU=Development, O=Your Company, L=City, ST=State, C=US" \
  -storepassword your_keystore_password \
  -keypass your_key_password

# Example format (replace with your actual values):
keytool -genkeypair -v -storetype PKCS12 -keystore mpt-keystore \
  -alias tafels_oefenen -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=Tafels Oefenen, OU=Development, O=YourCompany, L=YourCity, ST=YourState, C=YourCountry" \
  -storepassword "your_keystore_password" \
  -keypass "your_key_password"
```

**Security Note:** Keep this keystore file secure! Store it in an encrypted drive or secure cloud storage. This is your master signing certificate.

#### **Step 2: Encode Keystore to Base64**

```bash
# Navigate to your keystore directory
cd /path/to/your/keystore

# Encode keystore file to Base64
base64 -i mpt-keystore | tr -d '\n' > keystore_base64.txt

# Copy the content (one long line)
cat keystore_base64.txt

# Clean up temporary file
rm keystore_base64.txt
```

#### **Step 3: Store in GitHub Secrets**

```bash
# In GitHub repository Settings → Secrets:
KEYSTORE_PASSWORD = "your_keystore_password"
KEY_ALIAS = "tafels_oefenen"
KEY_PASSWORD = "your_key_password"
SIGNING_KEYSTORE_BASE64 = "your_base64_encoded_keystore"
```

#### **Step 4: Secure the Original Keystore**

```bash
# After encoding, secure your original keystore:
✅ Store in encrypted cloud storage (Google Drive, Dropbox, etc.)
✅ Save on encrypted USB drive
✅ Store in password manager
✅ Keep multiple backups in different locations
❌ Never commit to version control
❌ Never share via email or chat
❌ Never store on unencrypted drives
```

#### **How It Works in GitHub Actions:**

```yaml
# GitHub Actions recreates the SAME keystore each time
- name: Decode keystore
  env:
    ENCODED_STRING: ${{ secrets.SIGNING_KEYSTORE_BASE64 }}
  run: |
    mkdir -p keystore
    echo $ENCODED_STRING | base64 -di > keystore/mpt-keystore
    # This recreates your original keystore identically
```

**Result:** Every build uses the same keystore → Same certificate → Smooth updates → Professional app behavior.

### 1.4 Update build.gradle.kts for Environment Variables

**Important:** Update your `app/build.gradle.kts` to use environment variables with local fallback:

```kotlin
// Load properties if file exists (for local development)
val keystoreProperties = java.util.Properties()
val keystorePropertiesFile = rootProject.file("keystore.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(java.io.FileInputStream(keystorePropertiesFile))
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
```

**How It Works:**
- ✅ **CI/CD:** Environment variables take precedence (GitHub Secrets)
- ✅ **Local:** keystore.properties file is used (not committed)
- ✅ **Security:** No sensitive data in version control
- ✅ **Flexibility:** Works seamlessly in both environments

**Security Benefits:**
- ✅ No passwords in version control
- ✅ All sensitive data in GitHub Secrets
- ✅ Keystore file never committed to repository
- ✅ Complete separation of CI/CD and local environments

### 1.5 Local Development Setup (Optional)

For local testing, create a separate keystore and properties file in your project structure:

#### **Project Structure:**
```
multiplication-trainer/
├── mpt-android/
│   ├── app/
│   │   ├── build.gradle.kts
│   │   └── src/
│   ├── keystore/
│   │   └── local-keystore          # Local keystore file
│   ├── keystore.properties         # Local properties file
│   └── .gitignore
└── docs/
```

#### **File Locations:**

**📁 Local Keystore File:**
```bash
# Path: mpt-android/keystore/local-keystore
# This is where your local development keystore is stored
mpt-android/keystore/local-keystore
```

**📄 Properties File:**
```bash
# Path: mpt-android/keystore.properties  
# This file contains the local keystore configuration
mpt-android/keystore.properties
```

#### **Create local keystore:**
```bash
# Navigate to mpt-android directory
cd mpt-android

# Create keystore directory and local keystore
mkdir -p keystore
keytool -genkeypair -v -storetype PKCS12 -keystore keystore/local-keystore \
  -alias tafels_oefenen -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=Tafels Oefenen Local, OU=Development, O=YourCompany, L=YourCity, ST=YourState, C=YourCountry" \
  -storepassword "your_local_keystore_password" \
  -keypass "your_local_key_password"
```

#### **Create keystore.properties:**
```properties
# File: mpt-android/keystore.properties
# NEVER commit this file to version control!

storeFile=keystore/local-keystore
storePassword=your_local_keystore_password
keyAlias=tafels_oefenen
keyPassword=your_local_key_password
```

#### **How build.gradle.kts Finds These Files:**
```kotlin
// In app/build.gradle.kts, the paths work like this:

// Properties file is at project root level
val keystorePropertiesFile = rootProject.file("keystore.properties")
// This looks for: mpt-android/keystore.properties

// Keystore file path is relative to app module
storeFile = file(System.getenv("KEYSTORE_PATH") ?: keystoreProperties["storeFile"] as String)
// This looks for: mpt-android/keystore/local-keystore
```

#### **Important Notes:**
- ✅ **Local keystore** is in `mpt-android/keystore/local-keystore`
- ✅ **Properties file** is in `mpt-android/keystore.properties`
- ✅ **Both files** are excluded from version control by .gitignore
- ✅ **Different from production** keystore (separate signing certificate)
- ✅ **For local testing only** (not for production builds)

### 1.6 Update .gitignore

Add these lines to your `.gitignore` file to prevent committing sensitive files:

```bash
# Keystore and signing files
keystore/
keystore.properties
*.keystore
*.jks
*.p12
signing.properties
```

---

## 2. GitHub Actions Workflow

The GitHub Actions workflow automates the entire build and deployment process for your Android APK. It:

1. **Sets up the build environment** with Java 17 and Gradle caching
2. **Decodes the signing keystore** from repository secrets
3. **Builds the signed APK** using your release configuration
4. **Extracts version information** from the build files
5. **Creates a professional download page** with installation instructions
6. **Deploys everything to GitHub Pages** for easy distribution

The complete workflow is defined in [`.github/workflows/deploy-github-pages.yml`](../.github/workflows/deploy-github-pages.yml).

This workflow is configured for manual triggering only from the GitHub UI, giving you full control over when releases are published.


## 3. GitHub Pages Deployment

### 3.1 How It Works

The GitHub Pages workflow creates a professional download page that:

1. **Automatically builds** the signed APK
2. **Deploys to GitHub Pages** at `https://username.github.io/mpt-android/`
3. **Provides direct download link** for the APK
4. **Works on both desktop and mobile** devices
5. **Auto-downloads on Android** devices
6. **Includes QR code** for easy mobile sharing

### 3.2 User Experience

#### **Desktop Users:**
```bash
1. User visits: https://username.github.io/mpt-android/
2. Sees professional download page with QR code
3. Scans QR code with phone camera
4. Downloads and installs APK on mobile device
```

#### **Mobile Users:**
```bash
1. User clicks link on Android device
2. Page detects mobile device automatically
3. Auto-starts APK download after 2 seconds
4. User taps download notification to install
5. Follows standard Android installation prompts
```

### 3.3 Installation Link

Your direct installation link will be:
```bash
https://username.github.io/mpt-android/
```

For your specific repository:
```bash
https://edwinbulter.github.io/multiplication-trainer/mpt-android/
```

### 3.4 Features

#### **Professional Download Page:**
- ✅ Modern, responsive design
- ✅ App branding and information
- ✅ Clear installation instructions
- ✅ QR code for mobile sharing
- ✅ Security information
- ✅ Requirements display

#### **Mobile Optimization:**
- ✅ Auto-detects Android devices
- ✅ Auto-starts download on mobile
- ✅ Touch-friendly interface
- ✅ Responsive design for all screen sizes

#### **Direct Download:**
- ✅ One-click installation
- ✅ No registration required
- ✅ Works without Google Play Store
- ✅ Officially signed APK
          ---

## 4. User Installation Guide

### 4.1 Direct Link Installation

Users can install the app by simply clicking this link:

```bash
🔗 https://edwinbulter.github.io/multiplication-trainer/mpt-android/
```

### 4.2 Step-by-Step Installation

#### **For Mobile Users (Recommended):**
```bash
1. Click the installation link on your Android device
2. Wait 2 seconds for automatic download to start
3. Tap the download notification when it appears
4. Enable "Install from unknown sources" when prompted
5. Tap "Install" to complete installation
6. Open Tafels Oefenen and start practicing!
```

#### **For Desktop Users:**
```bash
1. Click the installation link on your computer
2. Scan the QR code with your phone camera
3. Tap the link that appears on your phone
4. Follow the mobile installation steps above
```

### 4.3 Installation Requirements

#### **System Requirements:**
```bash
✅ Android 7.0 (API 24) or higher
✅ 50MB free storage space
✅ Internet connection for download only
✅ Ability to install from unknown sources
```

#### **Permissions Required:**
```bash
✅ "Install from unknown sources" (one-time setup)
✅ No app permissions required (offline usage)
```

### 4.4 Troubleshooting

#### **Common Issues:**
```bash
❌ "Install blocked" error:
   • Enable "Install from unknown sources" in Android settings
   • Settings → Apps & notifications → Special app access → Install unknown apps

❌ "App not installed" error:
   • Uninstall any previous version first
   • Ensure you have enough storage space
   • Check Android version compatibility

❌ "Parse error" or "Corrupt APK":
   • Clear browser cache and re-download
   • Try a different browser
   • Check internet connection stability
---

## 5. Setup Instructions

### 5.1 Enable GitHub Pages

1. **Go to repository settings**
   - Navigate to your repository on GitHub
   - Click **Settings** tab

2. **Configure Pages**
   - Scroll down to **Pages** section
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** (or **main**)
   - Folder: **/ (root)**
   - Click **Save**

### 5.2 Add Workflow File

1. **Create workflow directory**
   ```bash
   mkdir -p .github/workflows
   ```

2. **Add workflow file**
   ```bash
   # Create .github/workflows/deploy-github-pages.yml
   # Copy the GitHub Pages workflow code from section 2.1
   ```

3. **Update build.gradle.kts**
   ```bash
   # Update app/build.gradle.kts with fallback logic
   # See section 1.4 for the complete implementation
   ```

4. **Create local development setup (optional)**
   ```bash
   # For local testing, create keystore.properties
   # See section 1.5 for detailed instructions
   ```

5. **Update .gitignore**
   ```bash
   # Add keystore files to .gitignore (see section 1.6)
   echo "keystore/" >> .gitignore
   echo "keystore.properties" >> .gitignore
   echo "*.keystore" >> .gitignore
   ```

6. **Commit and push**
   ```bash
   git add .github/workflows/deploy-github-pages.yml
   git add app/build.gradle.kts
   git add .gitignore
   git commit -m "Add secure GitHub Pages deployment workflow"
   git push origin main
   ```

### 5.3 Test Deployment

1. **Trigger workflow manually**
   - Go to **Actions** tab in your repository
   - Select **Deploy APK to GitHub Pages**
   - Click **Run workflow**

2. **Verify deployment**
   - Wait for workflow to complete
   - Visit: `https://username.github.io/mpt-android/`
   ---

## 6. Security Considerations

### 6.1 Keystore Protection

#### **GitHub Secrets:**
```bash
✅ Store keystore credentials in GitHub Secrets
✅ Never commit keystore files to repository
✅ Use strong, unique passwords
✅ Rotate secrets if compromised
```

#### **APK Verification:**
```bash
# Users can verify APK authenticity:
keytool -printcert -jarfile tafels-oefenen.apk

# Should show your signing certificate information
```

### 6.2 Access Control

#### **Repository Security:**
```bash
✅ Keep repository public for easy access
✅ Enable branch protection for main branch
✅ Require PR reviews for workflow changes
✅ Monitor workflow run permissions
```

#### **Workflow Security:**
```yaml
# Limit workflow permissions
permissions:
  contents: read
  pages: write
  deployments: write
---

## 7. Maintenance and Updates

### 7.1 Version Management

#### **Automatic Updates:**
```bash
# When you push to main branch:
✅ New APK is automatically built
✅ GitHub Pages is updated
✅ Download page shows latest version
✅ Users always get the latest build
```

#### **Version Information:**
```kotlin
// Update version in app/build.gradle.kts
defaultConfig {
    versionCode = 2        // Increment for each release
    versionName = "1.1.0"  // Semantic versioning
}
```

### 7.2 Monitoring

#### **Download Tracking:**
```bash
# GitHub Pages provides basic statistics:
✅ Page views
✅ Unique visitors
✅ Traffic sources
✅ Geographic distribution
```

#### **Error Monitoring:**
```bash
# Monitor workflow runs:
✅ Check Actions tab for failures
✅ Review build logs for errors
✅ Monitor deployment success rate
```

### 7.3 Best Practices

#### **Regular Maintenance:**
```bash
✅ Update action versions quarterly
✅ Review and rotate secrets annually
✅ Monitor download statistics monthly
✅ Update dependencies regularly
```

#### **User Communication:**
```bash
✅ Keep installation instructions up to date
✅ Update requirements as needed
✅ Provide troubleshooting help
✅ Respond to user feedback promptly
```

---

## Troubleshooting

### Workflow Issues

#### **Build Failures:**
```bash
❌ "Keystore not found" - Check BASE64 encoding in secrets
❌ "Permission denied" - Verify keystore file permissions
❌ "Gradle build failed" - Check syntax and dependencies
❌ "Deploy failed" - Verify GitHub Pages is enabled
```

#### **Secret Issues:**
```bash
# Test secrets locally:
echo $SIGNING_KEYSTORE_BASE64 | base64 -di > test.keystore
keytool -list -v -keystore test.keystore
```

### Deployment Issues

#### **GitHub Pages Problems:**
```bash
❌ "Page not found" - Enable GitHub Pages in repository settings
❌ "404 error" - Check branch and folder configuration
❌ "Build failed" - Review workflow logs for errors
❌ "Old version" - Check if workflow is triggering on push
```

#### **Download Issues:**
```bash
❌ "APK not found" - Verify file path in download page
❌ "Corrupt download" - Check APK file integrity
❌ "Slow download" - Monitor GitHub Pages performance
```

---

## Quick Start Summary

### 1. Initial Setup (15 minutes)
```bash
✅ Configure GitHub Secrets with keystore credentials
✅ Enable GitHub Pages in repository settings
✅ Add workflow file to .github/workflows/
✅ Test workflow with manual trigger
```

### 2. First Deployment (10 minutes)
```bash
✅ Push changes to main branch
✅ Wait for workflow to complete
✅ Visit your GitHub Pages site
✅ Test download functionality
```

### 3. Share Your App (5 minutes)
```bash
✅ Share this link: https://username.github.io/mpt-android/
✅ Users can install with one click
✅ Works on both desktop and mobile
✅ No registration or Play Store required
```

---

## Final Result

Users can now install your mpt-android app by simply clicking a link:

```bash
🔗 Installation Link: https://edwinbulter.github.io/multiplication-trainer/mpt-android/

📱 Features:
• One-click installation
• Auto-download on Android devices
• QR code for desktop users
• Professional download page
• Officially signed APK
• No Google Play Store required
```

This setup provides a **professional, secure, and user-friendly** way to distribute your app directly to users while maintaining full control over the signing and deployment process.

---

## 6. Security Considerations

### 6.1 Keystore Protection

#### **GitHub Secrets:**
```bash
✅ Store keystore credentials in GitHub Secrets
✅ Never commit keystore files to repository
✅ Use strong, unique passwords
✅ Rotate secrets if compromised
```

#### **APK Verification:**
```bash
# Users can verify APK authenticity:
keytool -printcert -jarfile tafels-oefenen.apk

# Should show your signing certificate information
```

### 6.2 Access Control

#### **Repository Security:**
```bash
✅ Keep repository public for easy access
✅ Enable branch protection for main branch
✅ Require PR reviews for workflow changes
✅ Monitor workflow run permissions
```

#### **Workflow Security:**
```yaml
# Limit workflow permissions
permissions:
  contents: read
  pages: write
  deployments: write
```

### 6.3 Environment Variables Security

#### **Secure Implementation:**
```bash
✅ No hardcoded passwords in build.gradle.kts
✅ All signing data from GitHub Secrets
✅ Keystore file created during CI/CD run
✅ Local development uses separate setup
✅ Zero sensitive data in version control
```

#### **Local Development Setup:**
```bash
# For local builds, create a local keystore.properties file:
storeFile=../keystore/local-keystore
storePassword=your_local_password
keyAlias=tafels_oefenen
keyPassword=your_local_key_password

# Add keystore.properties to .gitignore
```

#### **CI/CD vs Local Development:**
```bash
✅ CI/CD: Uses GitHub Secrets and environment variables
✅ Local: Uses keystore.properties file (not committed)
✅ Both: Use same signing configuration structure
✅ Security: No overlap between local and production secrets
```

---

## 7. Maintenance and Updates

### 7.1 Version Management

#### **Automatic Updates:**
```bash
# When you push to main branch:
✅ New APK is automatically built
✅ GitHub Pages is updated
✅ Download page shows latest version
✅ Users always get the latest build
```

#### **Version Information:**
```kotlin
// Update version in app/build.gradle.kts
defaultConfig {
    versionCode = 2        // Increment for each release
    versionName = "1.1.0"  // Semantic versioning
}
```

### 7.2 Monitoring

#### **Download Tracking:**
```bash
# GitHub Pages provides basic statistics:
✅ Page views
✅ Unique visitors
✅ Traffic sources
✅ Geographic distribution
```

#### **Error Monitoring:**
```bash
# Monitor workflow runs:
✅ Check Actions tab for failures
✅ Review build logs for errors
✅ Monitor deployment success rate
```

### 7.3 Best Practices

#### **Regular Maintenance:**
```bash
✅ Update action versions quarterly
✅ Review and rotate secrets annually
✅ Monitor download statistics monthly
✅ Update dependencies regularly
```

#### **User Communication:**
```bash
✅ Keep installation instructions up to date
✅ Update requirements as needed
✅ Provide troubleshooting help
✅ Respond to user feedback promptly
```

---

## Troubleshooting

### Workflow Issues

#### **Build Failures:**
```bash
❌ "Keystore not found" - Check BASE64 encoding in secrets
❌ "Permission denied" - Verify keystore file permissions
❌ "Gradle build failed" - Check syntax and dependencies
❌ "Deploy failed" - Verify GitHub Pages is enabled
```

#### **Secret Issues:**
```bash
# Test secrets locally:
echo $SIGNING_KEYSTORE_BASE64 | base64 -di > test.keystore
keytool -list -v -keystore test.keystore
```

### Deployment Issues

#### **GitHub Pages Problems:**
```bash
❌ "Page not found" - Enable GitHub Pages in repository settings
❌ "404 error" - Check branch and folder configuration
❌ "Build failed" - Review workflow logs for errors
❌ "Old version" - Check if workflow is triggering on push
```

#### **Download Issues:**
```bash
❌ "APK not found" - Verify file path in download page
❌ "Corrupt download" - Check APK file integrity
❌ "Slow download" - Monitor GitHub Pages performance
```

---

## Quick Start Summary

### 1. Initial Setup (15 minutes)
```bash
✅ Configure GitHub Secrets with keystore credentials
✅ Enable GitHub Pages in repository settings
✅ Add workflow file to .github/workflows/
✅ Test workflow with manual trigger
```

### 2. First Deployment (10 minutes)
```bash
✅ Push changes to main branch
✅ Wait for workflow to complete
✅ Visit your GitHub Pages site
✅ Test download functionality
```

### 3. Share Your App (5 minutes)
```bash
✅ Share this link: https://username.github.io/mpt-android/
✅ Users can install with one click
✅ Works on both desktop and mobile
✅ No registration or Play Store required
```

---

## Final Result

Users can now install your mpt-android app by simply clicking a link:

```bash
🔗 Installation Link: https://edwinbulter.github.io/multiplication-trainer/mpt-android/

📱 Features:
• One-click installation
• Auto-download on Android devices
• QR code for desktop users
• Professional download page
• Officially signed APK
• No Google Play Store required
```

This setup provides a **professional, secure, and user-friendly** way to distribute your app directly to users while maintaining full control over the signing and deployment process.

---

## 4. User Installation Guide

### 4.1 For End Users

#### Step-by-Step Installation:

1. **Download APK**
   ```
   • Visit your GitHub repository releases page
   • Download the latest APK file
   • Or scan QR code if available
   ```

2. **Enable Unknown Sources**
   ```
   Android 8.0+:
   Settings → Apps & notifications → Special app access → Install unknown apps → Allow browser
   
   Android 7.0:
   Settings → Security → Unknown sources → Enable
   ```

3. **Install APK**
   ```
   • Open downloaded APK file
   • Tap "Install"
   • Follow on-screen instructions
   ```

4. **Verify Installation**
   ```
   • Open Tafels Oefenen app
   • Verify it works correctly
   • Check app version in settings
   ```

### 4.2 Installation Instructions Template

Create `INSTALL.md` in your repository:

```markdown
# 📱 Installation Instructions

## 🔄 Method 1: GitHub Releases (Recommended)

1. **Download APK**
   - Go to [Releases Page](https://github.com/username/mpt-android/releases)
   - Download the latest `tafels-oefenen-*.apk` file

2. **Install on Android**
   - Enable "Install from unknown sources" in settings
   - Tap the downloaded APK file
   - Follow installation prompts

## 🌐 Method 2: Direct Download Page

1. **Visit Download Page**
   - Go to: https://username.github.io/mpt-android/
   - Click the download button
   - Or scan QR code with phone camera

2. **Install**
   - Follow the same installation steps as above

## ⚙️ Requirements

- Android 7.0 (API 24) or higher
- 50MB free storage space
- Internet connection for download only

## 🔐 Security

This APK is officially signed with the developer's key. No modifications or third-party additions.

## 🆘 Troubleshooting

**"Install blocked" error:**
- Enable "Unknown sources" in Android settings
- Try downloading from a different browser

**"App not installed" error:**
- Uninstall any previous version first
- Ensure you have enough storage space
- Check Android version compatibility

## 📧 Support

For issues or questions, please open an issue on GitHub.
```

---

## 5. Security Considerations

### 5.1 Keystore Security

#### Best Practices:
```bash
✅ Use GitHub Secrets (never commit keystore)
✅ Use strong, unique passwords
✅ Rotate secrets if compromised
✅ Limit repository access
✅ Monitor workflow runs
```

#### Secret Management:
```yaml
# Never hardcode secrets in workflow
env:
  KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}  # ✅ Good
  # KEYSTORE_PASSWORD: "password123"                  # ❌ Bad
```

### 5.2 APK Security

#### Signing Verification:
```bash
# Users can verify APK signature
keytool -printcert -jarfile tafels-oefenen.apk

# Should show your signing information
```

#### Integrity Checks:
```bash
# Generate checksum for verification
sha256sum tafels-oefenen.apk > checksum.txt

# Users can verify:
sha256sum -c checksum.txt
```

### 5.3 Access Control

#### Repository Settings:
```bash
✅ Keep repository public for easy access
✅ Enable branch protection for main
✅ Require PR reviews for changes
✅ Monitor workflow run permissions
```

#### Workflow Security:
```yaml
# Limit permissions
permissions:
  contents: read
  packages: write  # Only if needed
```

---

## 6. Maintenance and Updates

### 6.1 Version Management

#### Semantic Versioning:
```kotlin
// app/build.gradle.kts
defaultConfig {
    versionCode = 2        // Increment for each release
    versionName = "1.1.0"  // Semantic versioning
}
```

#### Release Process:
```bash
# 1. Update version in build.gradle.kts
# 2. Commit changes
git add app/build.gradle.kts
git commit -m "Bump version to 1.1.0"

# 3. Create and push tag
git tag v1.1.0
git push origin v1.1.0

# 4. GitHub Actions will build and release automatically
```

### 6.2 Workflow Maintenance

#### Regular Tasks:
```bash
✅ Update action versions quarterly
✅ Review and rotate secrets annually
✅ Monitor workflow run times
✅ Check download statistics
✅ Update dependencies
```

#### Monitoring:
```yaml
# Add workflow notifications
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 6.3 User Support

#### Common Issues:
```bash
❌ "Parse error" - APK corrupted, re-download
❌ "Install blocked" - Enable unknown sources
❌ "App not installed" - Uninstall old version first
❌ "No space left" - Clear device storage
```

#### Support Documentation:
```markdown
## FAQ

**Q: Why isn't the app updating automatically?**
A: Direct APK distribution doesn't support auto-updates. Download new versions manually.

**Q: Is this safe to install?**
A: Yes, the APK is officially signed and unmodified.

**Q: Can I install alongside Play Store version?**
A: No, you must uninstall the Play Store version first.
```

---

## Troubleshooting

### Common Workflow Issues

#### Build Failures:
```bash
# Check workflow logs
# Common issues:
❌ "Keystore not found" - Check BASE64 encoding
❌ "Permission denied" - Fix keystore file permissions
❌ "Gradle build failed" - Check dependencies and syntax
```

#### Secret Issues:
```bash
# Test secrets locally:
echo $SIGNING_KEYSTORE_BASE64 | base64 -di > test.keystore
keytool -list -v -keystore test.keystore
```

#### APK Issues:
```bash
# Verify APK signature:
aapt dump badging app-release.apk

# Check APK contents:
unzip -l app-release.apk
```

### User Installation Issues

#### Android Compatibility:
```bash
# Check minimum SDK:
grep "minSdk" app/build.gradle.kts

# Verify APK architecture:
aapt dump badging app-release.apk | grep "native-code"
```

#### Installation Problems:
```bash
# Enable installation from browser:
adb shell pm grant android.permission.REQUEST_INSTALL_PACKAGES com.browser.app

# Install via ADB for testing:
adb install app-release.apk
```

---

## Quick Start Summary

### 1. Setup (15 minutes)
```bash
✅ Create GitHub Secrets (keystore and passwords)
✅ Add workflow file to .github/workflows/
✅ Test workflow with manual trigger
```

### 2. First Release (10 minutes)
```bash
✅ Update version in build.gradle.kts
✅ Create and push git tag
✅ Download and test generated APK
```

### 3. User Distribution (5 minutes)
```bash
✅ Share release page URL
✅ Provide installation instructions
✅ Monitor download statistics
```

---

## Next Steps

After setting up this workflow:

1. **Test thoroughly** with different Android devices
2. **Create user documentation** for installation
3. **Set up monitoring** for workflow failures
4. **Plan update strategy** for future versions
5. **Consider analytics** for download tracking

This automated workflow provides a professional, secure, and user-friendly way to distribute your mpt-android app outside the Google Play Store while maintaining full control over the signing and distribution process.
