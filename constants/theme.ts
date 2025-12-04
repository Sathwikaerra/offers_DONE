const APP_NAME = "OffersHolic";
const APP_VERSION = "1.0.0";
const APP_DESCRIPTION = "OffersHolic is a platform that provides you with the best offers and deals from your favorite and nearby stores.";
const APP_AUTHOR = "Team DesignerDudes";

//Login Screen

const AUTH_TYPES = {
  EMAIL: true,
  MOBILE: true,
  EMAIL_WITH_OTP: true,
  GOOGLE_PROVIDER: false,
}; //true for enable and false for disable, Either Email or Mobile must be true
const COLORS = {
  // Brand colors
  primary: "#C82038",       // Strong red
  primary_light: "#FFDEE4", // Soft pinkish red
  secondary: "#444262",     // Grayish purple
  tertiary: "#312651",      // Deep purple

  // Grays / Neutrals
  gray: "#83829A",
  gray2: "#C1C0C8",
  lightGray: "#D1D5DB",     // Mid gray
  darkGray: "#374151",      // Darker gray (good for text)

  // Whites
  white: "#F3F4F8",
  white2: "#FFFFFF",
  lightWhite: "#FAFAFC",
  tabWhite: "#EDEDED",

  // Dark Mode / Backgrounds
  dark: "#0F0F0F",          // Pure dark
  dark2: "#1A1A1A",         // Dark gray
  dark3: "#111827",         // Slate black
  backdrop: "rgba(0,0,0,0.6)", // Overlay black

  // Accent colors
  success: "#22C55E",       // Green
  warning: "#FACC15",       // Yellow
  danger: "#EF4444",        // Red
  info: "#3B82F6",          // Blue
  purple: "#8B5CF6",        // Accent purple
  orange: "#F97316",        // Accent orange
  teal: "#14B8A6",          // Accent teal

  // Gradient helpers
  gradient1: ["#C82038", "#8B1A2C"], // Primary red gradient
  gradient2: ["#312651", "#1E1B4B"], // Deep purple gradient
  gradient3: ["#0F172A", "#1E293B"], // Dark blue gradient
};


const FONT = {
  thin: "Lexend-Thin",
  extraLight: "Lexend-ExtraLight",
  light: "Lexend-Light",
  regular: "Lexend-Regular",
  medium: "Lexend-Medium",
  semiBold: "Lexend-SemiBold",
  bold: "Lexend-Bold",
  extraBold: "Lexend-ExtraBold",
  black: "Lexend-Black",

};

const SIZES = {
  xxSmall: 8,
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.09,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

// export const BACKEND_URL = "https://apis.offersholic.zephyrapps.in/";
export const BACKEND_URL = "https://backendoff.vercel.app/";
// export const BACKEND_URL = "http://192.168.1.8:3000";



export { APP_NAME, COLORS, FONT, SIZES, SHADOWS, AUTH_TYPES, APP_VERSION, APP_DESCRIPTION, APP_AUTHOR };
