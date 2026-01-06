import "dotenv/config";

export default {
  expo: {
    name: "7miles",
    slug: "7miles",
    "scheme": ["sevenmiles"],
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/Nav/7_miles_final_logo_PRINT_FILE-Photoroom.png",
    userInterfaceStyle: "light",

    splash: {
      image: "./assets/Nav/7_miles_final_logo_PRINT_FILE-Photoroom.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sgc.sevenmiles",
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSPhotoLibraryUsageDescription:
          "Allow access to upload photos",
      },
    },

    android: {
      package: "com.sgc.sevenmiles",
      versionCode: 1,
      googleServicesFile: "./google-services.json",
      permissions: ["READ_MEDIA_IMAGES"],
      adaptiveIcon: {
        foregroundImage:
          "./assets/Nav/7_miles_final_logo_PRINT_FILE-Photoroom.png",
        backgroundImage:
          "./assets/Nav/7_miles_final_logo_PRINT_FILE-Photoroom.png",
      },
    },

    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: "35.0.0",
            enableProguardInReleaseBuilds: true,
            jsEngine: "hermes",
            packagingOptions: {
              pickFirst: [
                "**/libc++_shared.so",
                "**/libfbjni.so",
              ],
            },
            extraProguardRules: `
              -keep class com.razorpay.** { *; }
              -keep class com.razorpay.callbacks.** { *; }
              -keepattributes *Annotation*
              -dontwarn com.razorpay.**
            `,
          },
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      "expo-font",
      [
        "expo-media-library",
        {
          photosPermission:
            "Allow 7Miles to save invoices to your media library.",
          savePhotosPermission:
            "Allow 7Miles to save files to your Downloads folder.",
        },
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-google-signin/google-signin",
    ],

    extra: {
      PRODUCTS_API: process.env.PRODUCTS_API,
      RAZORPAY_API_KEY: process.env.RAZORPAY_API_KEY,
      eas: {
        projectId: "008623e8-d0fd-49f1-9b00-a311259299e8",
      },
      privacyPolicyUrl:
        "https://www.7miles.co.in/policies/privacy-policy",
    },
  },
};

