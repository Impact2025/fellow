export interface CrisisResource {
  name: string;
  phone?: string;
  chat?: string;
  available: string;
  country: string;
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: "113 Zelfmoordpreventie",
    phone: "113",
    chat: "https://www.113.nl",
    available: "24 uur per dag, 7 dagen per week",
    country: "NL",
  },
  {
    name: "Zelfmoordlijn",
    phone: "0800 32 123",
    chat: "https://www.zelfmoordlijn.be",
    available: "24 uur per dag, 7 dagen per week",
    country: "BE",
  },
  {
    name: "Spoedhulp",
    phone: "112",
    available: "Bij direct gevaar voor jezelf of anderen",
    country: "NL/BE",
  },
];

export const CRISIS_TEXT = {
  heading: "Het klinkt alsof het zwaar is.",
  body: "Je hoeft dit niet alleen te dragen. Er zijn mensen die nu voor je beschikbaar zijn.",
  reassurance: "Er is geen verkeerde reactie op een moeilijk moment.",
  returnLabel: "Terug naar de app",
};
