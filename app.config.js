import "dotenv/config";

export default {
  expo: {
    name: "7milesapp",
    slug: "7miles",
    "scheme": ["sevenmiles"],
    version: "2.0.0",
    orientation: "portrait",
    icon: "./assets/7miles_app_white_icon.png",
    userInterfaceStyle: "light",

    splash: {
      image: "./assets/7miles_app_white_icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sgc.sevenmilesapp",
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },

    android: {
      package: "com.sgc.sevenmilesapp",
      versionCode: 4,
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage:
          "./assets/7miles_app_white_icon.png",
        backgroundImage:
          "./assets/7miles_app_white_icon.png",
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
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-google-signin/google-signin",
    ],

    extra: {
      PRODUCTS_API: process.env.PRODUCTS_API,
      RAZORPAY_API_KEY: process.env.RAZORPAY_API_KEY,
      PAYMENT_API_KEY: process.env.PAYMENT_API_KEY,
      eas: {
        projectId: "008623e8-d0fd-49f1-9b00-a311259299e8",
      },
      privacyPolicyUrl:
        "https://www.7miles.co.in/policies/privacy-policy",
    },
  },
};

