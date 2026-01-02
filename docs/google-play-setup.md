# Google Play Console Setup Guide

This guide explains how to set up the Google Play Console deployment workflow for the mpt-android app.

## Prerequisites

1. **Google Play Console Account**
   - Active developer account ($25 one-time fee)
   - App created in console with package name `ebulter.multiply`

2. **Service Account Setup**
   - Google Cloud Console project with Google Play Android Developer API enabled
   - Service account with appropriate permissions

## 1. Create Service Account

### 1.1 Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable **Google Play Android Developer API**

### 1.2 Create Service Account
1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name: `google-play-deploy`
4. Click **Create and Continue**
5. Skip roles for now
6. Click **Done**

### 1.3 Generate JSON Key
1. Find your service account in the list
2. Click **Actions** → **Manage keys**
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Click **Create** (download the JSON file)

## 2. Configure Google Play Console

### 2.1 Enable Required APIs
Ensure the Google Play Android Developer API is enabled in your Google Cloud project:
1. Navigate to the [Google Play Android Developer API](https://console.cloud.google.com/apis/library/google-play-android-developer.googleapis.com)
2. Select your project
3. Click **Enable**

### 2.2 Invite Service Account to Play Console
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

### 2.3 Configure Permissions
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

### 2.4 Verify Service Account Access
1. Go back to **Users and permissions**
2. Find your service account in the users list
3. Verify all required permissions are granted
4. Test API access if needed

## 3. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

### 3.1 Existing Secrets (from GitHub Pages workflow)
```bash
KEYSTORE_PASSWORD=your_keystore_password
KEY_ALIAS=your_key_alias
KEY_PASSWORD=your_key_password
SIGNING_KEYSTORE_BASE64=base64_encoded_keystore
```

### 3.2 New Google Play Secret
```bash
GOOGLE_PLAY_SERVICE_ACCOUNT=paste_entire_json_content_here
```

**How to add the JSON content:**
1. Open the downloaded JSON file from section 1.3
2. Copy the entire content
3. Go to GitHub repository → Settings → Secrets and variables → Actions
4. Click **New repository secret**
5. Name: `GOOGLE_PLAY_SERVICE_ACCOUNT`
6. Secret: Paste the entire JSON content
7. Click **Add secret**

### 3.3 Setup in GitHub Actions
Reference this secret in your workflow file using r0adkll/upload-google-play to authenticate your deployment.

## 4. Workflow Usage

### 4.1 Manual Trigger
1. Go to **Actions** tab in GitHub
2. Select **Deploy AAB to Google Play Console**
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

### 4.2 What the Workflow Does
1. **Sets up build environment** with Java 17
2. **Decodes signing keystore** from secrets
3. **Builds AAB file** (Android App Bundle)
4. **Extracts version info** from build.gradle.kts
5. **Uploads to Google Play Console** (Internal or Closed Testing track)

## 5. Local AAB Build for Manual Deployment

### 5.1 Prerequisites
- Android Studio installed
- JDK 17 or compatible version
- Keystore file and signing credentials

### 5.2 Set Up Environment Variables
Create a `keystore.properties` file in the `mpt-android` directory:
```properties
storeFile=path/to/your/keystore.jks
storePassword=your_keystore_password
keyAlias=your_key_alias
keyPassword=your_key_password
```

### 5.3 Build AAB Locally
Navigate to the `mpt-android` directory and run:
```bash
cd mpt-android
./gradlew clean
./gradlew bundleRelease
```

**Note**: Always run `./gradlew clean` before building to ensure a fresh build and avoid "up-to-date" issues where Gradle skips the bundle creation.

### 5.4 Find the Generated AAB
The AAB file will be located at:
```
mpt-android/app/build/outputs/bundle/release/app-release.aab
```

### 5.5 Manual Upload to Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to **Release** → **Manage release**
4. Choose your track (Internal, Closed, etc.)
5. Click **Create new release**
6. Upload the AAB file from step 5.4
7. Fill in release notes and other required information
8. Click **Save** and then **Review release**
9. Click **Start rollout**

### 5.6 Version Management
Before building locally, ensure you update version information in `mpt-android/app/build.gradle.kts`:
```kotlin
defaultConfig {
    versionCode = 5  // Increment this for each release
    versionName = "1.0.0"  // Update as needed
}
```

### 5.7 Troubleshooting
- **Build fails**: Check that all signing credentials are correct
- **Upload rejected**: Ensure versionCode is unique and higher than previous releases
- **Missing keystore**: Verify the keystore.properties file path and contents

## 7. Build AAB Using GitHub Actions

### 7.1 When to Use This Method
Use this method when you want to:
- Build AAB with the same signing configuration as your CI/CD pipeline
- Avoid local keystore management
- Ensure consistent signing across all builds

### 7.2 Using the Build AAB Workflow
1. Go to **Actions** tab in GitHub
2. Select **Build AAB for Manual Upload**
3. Click **Run workflow**
4. Set version parameters:
   - **Version name**: e.g., "1.0.0"
   - **Version code**: Unique incrementing number (e.g., 5, 6, 7)
5. Click **Run workflow**

### 7.3 Download the Built AAB
1. Wait for the workflow to complete
2. Click on the workflow run
3. Download the **tafels-oefenen-aab** artifact
4. Extract the `.aab` file from the downloaded ZIP

### 7.4 Upload to Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to **Release** → **Manage release**
4. Click **Create new release**
5. Upload the downloaded AAB file
6. Fill in release notes and other required information
7. Click **Save** → **Review release** → **Start rollout**

### 7.5 Advantages
- ✅ Uses the same keystore as your automated deployments
- ✅ No local keystore management required
- ✅ Consistent signing across all builds
- ✅ Version control tracking of builds

### 7.6 Artifacts Available
- **AAB file**: Ready for upload to Google Play Console
- **Mapping file**: For de-obfuscating crash reports (if needed)

## 8. Release Management

### 6.1 Update Release Notes
Edit `deploy/whatsnew/internal.txt` to update release notes for each deployment.

### 6.2 Version Management
The workflow automatically extracts version from `build.gradle.kts`:
```kotlin
versionCode = 1
versionName = "1.0.0"
```

### 5.3 Promotion Process
1. Deploy to **Internal Testing** for validation
2. Test thoroughly on multiple devices
3. Promote to **Closed Testing** (beta testers)
4. Promote to **Open Testing** (public beta)
5. Promote to **Production** (public release)

## 6. Troubleshooting

### 6.1 Common Issues

#### **Authentication Error**
```
Error: 403 Forbidden - Permission denied
```
**Solution:** Check service account permissions in Google Play Console

#### **Package Name Mismatch**
```
Error: Package name does not match
```
**Solution:** Ensure `applicationId` in build.gradle.kts matches Google Play Console

#### **AAB Build Failed**
```
Error: Task :app:bundleRelease FAILED
```
**Solution:** Check signing configuration and keystore setup

#### **Upload Failed**
```
Error: Upload failed - Invalid AAB format
```
**Solution:** Ensure AAB is properly signed and built

### 6.2 Debug Steps
1. Check workflow logs for specific error messages
2. Verify all GitHub Secrets are correctly set
3. Confirm service account has proper permissions
4. Validate package name matches in all locations

## 7. Security Best Practices

### 7.1 Secret Management
- Never commit secrets to repository
- Use GitHub Secrets for all sensitive data
- Rotate service account keys periodically

### 7.2 Access Control
- Limit service account permissions to minimum required
- Monitor Google Play Console access logs
- Use separate service accounts for different environments

## 8. Advanced Configuration

### 8.1 Multiple Tracks
Modify the workflow to deploy to different tracks:
```yaml
- name: Upload to Beta
  uses: r0adkll/upload-google-play@v1
  with:
    track: beta
    status: completed
```

### 8.2 Staged Rollouts
For production releases with staged rollouts:
```yaml
- name: Upload to Production
  uses: r0adkll/upload-google-play@v1
  with:
    track: production
    status: completed
    userFraction: 0.1  # 10% rollout
```

### 8.3 Custom Release Notes
Create language-specific release notes:
```
deploy/whatsnew/
├── internal.txt
├── beta.txt
├── en-US.txt
└── nl-NL.txt
```

## 9. Monitoring and Maintenance

### 9.1 Workflow Monitoring
- Check GitHub Actions tab for workflow status
- Set up notifications for failed deployments
- Monitor Google Play Console for upload status

### 9.2 Regular Maintenance
- Update dependencies in build.gradle.kts
- Rotate service account keys annually
- Review and update release notes
- Monitor app performance and crashes

This setup provides a complete, automated deployment pipeline for Google Play Console with proper security and monitoring.
