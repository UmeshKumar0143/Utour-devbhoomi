import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation resources
const resources = {
  en: {
    translation: {
      welcome: "Welcome back, {{name}}! 🙏",
      touristId: "Tourist ID",
      journeyTagline: "Plan your divine journey through the sacred lands of Uttarakhand",
      quickActions: {
        viewPlans: "View Plans",
        bookPlan: "Book Plan",
        map: "Map & Navigation",
        alerts: "Alerts & Safety"
      },
      bookings: "Recent Bookings",
      upcomingJourneys: "Your upcoming spiritual journeys",
      alertsTitle: "Safety Alerts",
      alertsDesc: "Stay informed about conditions",
      multilingual: "Multilingual Support",
      multilingualDesc: "Choose your preferred language for better experience"
    }
  },
  hi: {
    translation: {
      welcome: "वापसी पर स्वागत है, {{name}}! 🙏",
      touristId: "पर्यटक आईडी",
      journeyTagline: "उत्तराखंड की पवित्र भूमि पर अपनी दिव्य यात्रा की योजना बनाएं",
      quickActions: {
        viewPlans: "योजनाएँ देखें",
        bookPlan: "योजना बुक करें",
        map: "मानचित्र और नेविगेशन",
        alerts: "अलर्ट और सुरक्षा"
      },
      bookings: "हाल की बुकिंग",
      upcomingJourneys: "आपकी आगामी आध्यात्मिक यात्राएँ",
      alertsTitle: "सुरक्षा अलर्ट",
      alertsDesc: "स्थितियों के बारे में सूचित रहें",
      multilingual: "बहुभाषी समर्थन",
      multilingualDesc: "बेहतर अनुभव के लिए अपनी पसंदीदा भाषा चुनें"
    }
  }
};

i18n
  .use(LanguageDetector) // auto-detect browser language
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
