# Deploy mpt-android to Google Play Store

This guide describes all steps required to deploy the Multiplication Trainer Android app to the Google Play Store.

## Table of Contents

- [Prerequisites](#prerequisites)
- [1. Prepare the App for Release](#1-prepare-the-app-for-release)
  - [1.1 Update App Version](#11-update-app-version)
  - [1.2 Update App Name and Icon](#12-update-app-name-and-icon)
  - [1.3 Check Permissions](#13-check-permissions)
  - [1.4 Proguard/R8 Configuration](#14-proguardr8-configuration)
- [2. Configure Build Settings](#2-configure-build-settings)
  - [2.1 Build Types](#21-build-types)
  - [2.2 Product Flavors (Optional)](#22-product-flavors-optional)
- [3. Generate Signed APK or App Bundle](#3-generate-signed-apk-or-app-bundle)
  - [3.1 Create Signing Key](#31-create-signing-key)
  - [3.2 Configure Signing in Gradle](#32-configure-signing-in-gradle)
  - [3.3 Build Signed Bundle](#33-build-signed-bundle)
- [4. Set Up Google Play Console](#4-set-up-google-play-console)
  - [4.1 App Information](#41-app-information)
  - [4.2 Store Listing](#42-store-listing)
  - [4.3 Graphics and Screenshots](#43-graphics-and-screenshots)
  - [4.4 App Content](#44-app-content)
  - [4.5 Pricing and Distribution](#45-pricing-and-distribution)
- [5. Create Store Listing](#5-create-store-listing)
  - [5.1 App Information](#51-app-information)
  - [5.2 Category and Tags](#52-category-and-tags)
  - [5.3 Content Rating](#53-content-rating)
- [6. Create Service Account for Automated Deployment](#6-create-service-account-for-automated-deployment)
  - [6.1 Google Cloud Console](#61-google-cloud-console)
  - [6.2 Create Service Account](#62-create-service-account)
  - [6.3 Generate JSON Key](#63-generate-json-key)
- [7. Configure Google Play Console](#7-configure-google-play-console)
  - [7.1 Enable Required APIs](#71-enable-required-apis)
  - [7.2 Invite Service Account to Play Console](#72-invite-service-account-to-play-console)
  - [7.3 Configure Permissions](#73-configure-permissions)
  - [7.4 Verify Service Account Access](#74-verify-service-account-access)
- [8. GitHub Secrets Configuration](#8-github-secrets-configuration)
  - [8.1 Existing Secrets (from GitHub Pages workflow)](#81-existing-secrets-from-github-pages-workflow)
  - [8.2 New Google Play Secret](#82-new-google-play-secret)
  - [8.3 Setup in GitHub Actions](#83-setup-in-github-actions)
- [9. Build AAB Using GitHub Actions](#9-build-aab-using-github-actions)
  - [9.1 When to Use This Method](#91-when-to-use-this-method)
  - [9.2 Using the Build AAB Workflow](#92-using-the-build-aab-workflow)
  - [9.3 Download the Built AAB](#93-download-the-built-aab)
  - [9.4 Upload to Google Play Console](#94-upload-to-google-play-console)
  - [9.5 Advantages](#95-advantages)
  - [9.6 Artifacts Available](#96-artifacts-available)
- [10. Workflow Usage](#10-workflow-usage)
  - [10.1 Manual Trigger](#101-manual-trigger)
  - [10.2 What the Workflow Does](#102-what-the-workflow-does)
- [11. Release Management](#11-release-management)
  - [11.1 Update Release Notes](#111-update-release-notes)
  - [11.2 Version Management](#112-version-management)
  - [11.3 Promotion Process](#113-promotion-process)

## Prerequisites

### Required Accounts and Tools
- **Google Play Developer Account** ($25 one-time fee)
- **Android Studio** (latest version)
- **Google Play Console** access
- **App signing key** (will be created if not exists)

### Before You Begin
- Ensure the app is fully tested and functional
- Have app screenshots ready (phone, 7-inch tablet, 10-inch tablet)
- Prepare app icon (512x512px high resolution)
- Have feature graphic (1024x500px) ready
- Test on multiple devices and Android versions

## 1. Prepare the App for Release

### 1.1 Update App Version
Open `app/build.gradle.kts` and update version information:

```kotlin
android {
    defaultConfig {
        applicationId "ebulter.multiply"
        minSdk 24
        targetSdk 36
        versionCode 1  // Increment for each release
        versionName "1.0.0"  // Semantic versioning
    }
}
```

### 1.2 Update App Name and Icon
Ensure the app name is appropriate for the Play Store:

```xml
<!-- app/src/main/res/values/strings.xml -->
<resources>
    <string name="app_name">Tafels Oefenen</string>
</resources>
```

### 1.3 Check Permissions
Review and minimize app permissions in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<!-- Only include necessary permissions -->
```

### 1.4 Proguard/R8 Configuration
Enable code shrinking and obfuscation for release builds:

```kotlin
// app/build.gradle.kts
android {
    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}
```

## 2. Configure Build Settings

### 2.1 Build Types
Ensure you have proper build types configured:

```kotlin
android {
    buildTypes {
        release {
            // Disable debugging for release
            isDebuggable = false
            
            // Enable R8 full mode
            isMinifyEnabled = true
            isShrinkResources = true
            
            // Signing configuration (will be added in next step)
            signingConfig = signingConfigs.getByName("release")
        }
        debug {
            isDebuggable = true
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
        }
    }
}
```

### 2.2 Product Flavors (Optional)
If you want different versions:

```kotlin
android {
    flavorDimensions += "version"
    productFlavors {
        create("free") {
            dimension = "version"
            applicationIdSuffix = ".free"
        }
        create("pro") {
            dimension = "version"
            applicationIdSuffix = ".pro"
        }
    }
}
```

## 3. Generate Signed APK or App Bundle

### 3.1 Create Signing Key

#### Option A: Using Android Studio GUI
1. Go to **Build** → **Generate Signed Bundle/APK**
2. Select **Android App Bundle** (recommended) or **APK**
3. Click **Create new** for the key store
4. Fill in the key store information:
   - **Key store path**: Choose a secure location
   - **Password**: Strong password for key store
   - **Alias**: Your app's alias (e.g., `tafels_oefenen`)
   - **Password**: Strong password for key
   - **Validity**: At least 25 years
   - **Certificate**: Fill in your details

#### Option B: Using Command Line
Create a keystore manually:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore tafels-oefenen.keystore -alias tafels_oefenen -keyalg RSA -keysize 2048 -validity 10000
```

### 3.2 Configure Signing in Gradle

Add signing configuration to `app/build.gradle.kts`:

```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file("../tafels-oefenen.keystore")
            storePassword = "your_keystore_password"
            keyAlias = "tafels_oefenen"
            keyPassword = "your_key_password"
        }
    }
    
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            // ... other release config
        }
    }
}
```

**Security Note**: Never commit passwords to version control. Use environment variables or `gradle.properties`:

```properties
# gradle.properties (don't commit to git)
RELEASE_STORE_FILE=../tafels-oefenen.keystore
RELEASE_STORE_PASSWORD=your_keystore_password
RELEASE_KEY_ALIAS=tafels_oefenen
RELEASE_KEY_PASSWORD=your_key_password
```

Then reference in build.gradle:

```kotlin
signingConfigs {
    create("release") {
        storeFile = file(project.findProperty("RELEASE_STORE_FILE") ?: "../tafels-oefenen.keystore")
        storePassword = project.findProperty("RELEASE_STORE_PASSWORD") as String?
        keyAlias = project.findProperty("RELEASE_KEY_ALIAS") as String?
        keyPassword = project.findProperty("RELEASE_KEY_PASSWORD") as String?
    }
}
```

### 3.3 Generate Release Bundle

#### Using Android Studio:
1. **Build** → **Generate Signed Bundle/APK**
2. Select **Android App Bundle**
3. Choose your signing configuration
4. Select release variant
5. Click **Finish**

#### Using Command Line:
```bash
./gradlew assembleRelease
# For App Bundle:
./gradlew bundleRelease
```

The generated files will be in:
- APK: `app/build/outputs/apk/release/app-release.apk`
- Bundle: `app/build/outputs/bundle/release/app-release.aab`

## 4. Set Up Google Play Console

### 4.1 Create Developer Account
1. Go to [Google Play Console](https://play.google.com/console)
2. Accept the developer agreement
3. Pay the $25 registration fee
4. Complete your developer identity details

### 4.2 Create New App
1. Click **Create app**
2. Fill in initial details:
   - **App name**: Tafels Oefenen
   - **Default language**: English (or Dutch)
   - **App or game**: App
   - **Free or paid**: Free
   - **Contains ads**: No

### 4.3 Store Listing
Fill in the store listing information:

#### App Details
- **App name**: Tafels Oefenen
- **Short description**: Practice multiplication tables with this educational app
- **Full description**: Detailed description of your app

#### Screenshots
Required screenshots:
- Phone: At least 2 screenshots
- 7-inch tablet: At least 1 screenshot
- 10-inch tablet: At least 1 screenshot

#### App Icon
- **App icon**: 512x512px PNG
- **Feature graphic**: 1024x500px JPG or PNG

## 5. Create Store Listing

### 5.1 App Information
```markdown
**App Title**: Tafels Oefenen

**Short Description**: Practice multiplication tables with this educational app

**Full Description**:
Master multiplication tables with Tafels Oefenen! This educational app makes learning math fun and interactive.

Features:
• Practice 18 different multiplication tables including decimals
• Custom table input for personalized learning
• Interactive virtual keyboard for easy number input
• Track your progress with detailed scoreboard
• Sort and view your best times
• Clean, user-friendly interface
• Perfect for students of all ages

Whether you're learning basic tables or practicing advanced multiplication with decimals, Tafels Oefenen provides the perfect platform for mathematical improvement.

Download now and start mastering multiplication!
```

### 5.2 Category and Tags
- **Category**: Education
- **Tags**: education, math, multiplication, learning, practice, tables

### 5.3 Content Rating
- **Target audience**: Everyone
- **Content rating**: Suitable for all ages

## 6. Create Service Account for Automated Deployment

### 6.1 Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable **Google Play Android Developer API**

### 6.2 Create Service Account
1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name: `google-play-deploy`
4. Click **Create and Continue**
5. Skip roles for now
6. Click **Done**

### 6.3 Generate JSON Key
1. Find your service account in the list
2. Click **Actions** → **Manage keys**
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Click **Create** (download the JSON file)

## 7. Configure Google Play Console

### 7.1 Enable Required APIs
Ensure the Google Play Android Developer API is enabled in your Google Cloud project:
1. Navigate to the [Google Play Android Developer API](https://console.cloud.google.com/apis/library/google-play-android-developer.googleapis.com)
2. Select your project
3. Click **Enable**

### 7.2 Invite Service Account to Play Console
Since recent updates, you must invite the service account email as a "user" within the Play Console:

1. **Copy the Service Account Email:**
   - Go to Google Cloud Console → **IAM & Admin** → **Service Accounts**
   - Find your service account (`google-play-deploy`)
   - Copy the email address (looks like: `google-play-deploy@your-project.iam.gserviceaccount.com`)

2. **Open Play Console:**
   - Go to [Google Play Console](https://play.google.com/console/)
   - In the left-hand menu, click **Users and permissions**

3. **Invite User:**
   - Click **Invite new users**
   - Paste your service account's email address
   - Click **Send invitation**

### 7.3 Configure Permissions
You must grant the specific rights required for automated deployments:

#### **Account Permissions:**
Under the **"Account permissions"** tab, select the following at minimum:
- ✅ **View app information and download bulk reports**
- ✅ **Release to production, exclude devices, and use Play App Signing**
- ✅ **Release apps to testing tracks**
- ✅ **Manage testing tracks and edit tester lists**

#### **App Permissions (Optional):**
If you only want the service account to manage specific apps:
- Use the **App permissions** tab to select individual apps instead of global account access
- Select **Tafels Oefenen** (ebulter.multiply) for app-specific access

#### **Finalize:**
- Click **Invite user** (or **Save changes** if already added) to complete the link

### 7.4 Verify Service Account Access
1. Go back to **Users and permissions**
2. Find your service account in the users list
3. Verify all required permissions are granted
4. Test API access if needed

## 8. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

### 8.1 Existing Secrets (from GitHub Pages workflow)
```bash
KEYSTORE_PASSWORD=your_keystore_password
KEY_ALIAS=your_key_alias
KEY_PASSWORD=your_key_password
SIGNING_KEYSTORE_BASE64=base64_encoded_keystore
```

### 8.2 New Google Play Secret
```bash
GOOGLE_PLAY_SERVICE_ACCOUNT=paste_entire_json_content_here
```

**How to add the JSON content:**
1. Open the downloaded JSON file from section 6.3
2. Copy the entire content
3. Go to GitHub repository → Settings → Secrets and variables → Actions
4. Click **New repository secret**
5. Name: `GOOGLE_PLAY_SERVICE_ACCOUNT`
6. Secret: Paste the entire JSON content
7. Click **Add secret**

### 8.3 Setup in GitHub Actions
Reference this secret in your workflow file using r0adkll/upload-google-play to authenticate your deployment.

## 9. Build AAB Using GitHub Actions

### 9.1 When to Use This Method
Use this method when you want to:
- Build AAB with the same signing configuration as your CI/CD pipeline
- Avoid local keystore management
- Ensure consistent signing across all builds

**Important**: You must use this workflow to upload the first AAB file manually to each track (internal, alpha, beta, production) before the automated deployment workflow can work for that track. Google Play Console requires at least one manual upload per track to initialize the track.

### 9.2 Using the Build AAB Workflow
1. Go to **Actions** tab in GitHub
2. Select **Build AAB for Manual Upload**
3. Click **Run workflow**
4. Set version parameters:
   - **Version name**: e.g., "1.0.0" (optional - will use current if not specified)
   - **Version code**: Leave empty for auto-increment, or specify a custom value
5. Click **Run workflow**

**Note**: The workflow will automatically increment the version code if you leave the version code field empty.

### 9.3 Download the Built AAB
1. Wait for the workflow to complete
2. Click on the workflow run
3. Download the **tafels-oefenen-aab** artifact
4. Extract the `.aab` file from the downloaded ZIP

### 9.4 Upload to Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to **Release** → **Manage release**
4. Choose your track (Internal, Alpha, Beta, or Production)
5. Click **Create new release**
6. Upload the downloaded AAB file
7. Fill in release notes and other required information
8. Click **Save** → **Review release** → **Start rollout**

**Track Initialization**: After the first manual upload to a track, you can use the automated "Deploy AAB to Google Play Console" workflow for subsequent releases to that same track.

### 9.5 Advantages
- ✅ Uses the same keystore as your automated deployments
- ✅ No local keystore management required
- ✅ Consistent signing across all builds
- ✅ Version control tracking of builds
- ✅ Required for track initialization

### 9.6 Artifacts Available
- **AAB file**: Ready for upload to Google Play Console
- **Mapping file**: For de-obfuscating crash reports (if needed)

## 10. Workflow Usage

### 10.1 Manual Trigger
1. Go to **Actions** tab in GitHub
2. Select **Deploy AAB to Google Play Console**
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Select track (internal, alpha, beta, or production)
6. Click **Run workflow**

**Prerequisite**: The selected track must have been initialized with at least one manual AAB upload using the "Build AAB Using GitHub Actions" workflow.

### 10.2 What the Workflow Does
1. **Sets up build environment** with Java 17
2. **Decodes signing keystore** from secrets
3. **Builds AAB file** (Android App Bundle)
4. **Extracts version info** from build.gradle.kts
5. **Auto-increments version code** for unique releases
6. **Uploads to Google Play Console** (selected track)

## 11. Release Management

### 11.1 Update Release Notes
Edit `deploy/whatsnew/internal.txt` to update release notes for each deployment.

### 11.2 Version Management
**Version codes are now automatically managed** by the GitHub Actions workflows. The workflows will:
- **Auto-increment** version codes on each deployment
- **Commit changes** back to the repository
- **Ensure uniqueness** for every release

You only need to update `versionName` (e.g., "1.0.0", "1.1.0") when releasing new versions. The `versionCode` is handled automatically.

### 11.3 Promotion Process
1. Deploy to **Internal Testing** for validation
2. Test thoroughly on multiple devices
3. Promote to **Closed Testing** (beta testers)
4. Promote to **Open Testing** (public beta)
5. Promote to **Production** (public release)

This setup provides a complete, automated deployment pipeline for Google Play Console with proper security and monitoring.
