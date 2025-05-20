/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0A0045',
        ocean: '#2264DC',
        indigo: '#6795FF',
        aqua: '#0184D2',
        'cloud-nine': '#E4F1FF',
        white: '#FFFFFF',
        iris: '#9747FF', // Added for the gradient, adjust if needed
      },
      backgroundImage: {
        'brand-gradient': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        "client-theme": {
          extend: "light", // or "dark" depending on your preference
          colors: {
            background: "#FFFFFF",
            foreground: "#0A0045",
            primary: {
              50: "#E4F1FF",
              100: "#C9E3FF",
              200: "#9BC7FF",
              300: "#6DABFF",
              400: "#3F8FFF",
              500: "#2264DC", // Ocean
              600: "#1A4FB0",
              700: "#133B84",
              800: "#0D2758",
              900: "#06132C",
              DEFAULT: "#2264DC",
              foreground: "#FFFFFF",
            },
            secondary: {
              50: "#EEF3FF",
              100: "#DDE7FF",
              200: "#BBCFFF",
              300: "#99B7FF",
              400: "#779FFF",
              500: "#6795FF", // Indigo
              600: "#5277CC",
              700: "#3E5999",
              800: "#293B66",
              900: "#151D33",
              DEFAULT: "#6795FF",
              foreground: "#FFFFFF",
            },
            focus: "#6795FF",
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
      },
    }),
    function({ addUtilities }) {
      const newUtilities = {
        '.bg-brand-gradient': {
          background: 'radial-gradient(circle, var(--color-cloud-nine) -15%, var(--color-indigo) 10%, var(--color-ocean) 77%)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
// /** @type {import('tailwindcss').Config} */
// const {nextui} = require("@nextui-org/react");
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//     "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
//   ],  theme: {
//     extend: {
//       colors: {
//         primary: '#1d4ed8', // Blue
//         secondary: '#9333ea', // Purple
//         accent: {
//           light: '#fbbf24', // Amber
//           dark: '#d97706',   // Amber Darker Shade
//         },
//       },
//     },
//   },
//   plugins: [
//     nextui({
//       themes: {
//         "purple-dark": {
//           extend: "dark", // <- inherit default values from dark theme
//           colors: {
//             background: "#0D001A",
//             foreground: "#ffffff",
//             primary: {
//               50: "#3B096C",
//               100: "#520F83",
//               200: "#7318A2",
//               300: "#9823C2",
//               400: "#c031e2",
//               500: "#DD62ED",
//               600: "#F182F6",
//               700: "#FCADF9",
//               800: "#FDD5F9",
//               900: "#FEECFE",
//               DEFAULT: "#DD62ED",
//               foreground: "#ffffff",
//             },
//             focus: "#F182F6",
//           },
//           layout: {
//             disabledOpacity: "0.3",
//             radius: {
//               small: "4px",
//               medium: "6px",
//               large: "8px",
//             },
//             borderWidth: {
//               small: "1px",
//               medium: "2px",
//               large: "3px",
//             },
//           },
//         },
//       },
//     }),
//   ],
// }