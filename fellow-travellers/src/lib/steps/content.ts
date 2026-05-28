export interface Exercise {
  title: string;
  prompt: string;
  type: "journal" | "letter" | "reflection" | "list" | "meditation";
  isOptional: boolean;
  triggerWarning?: string;
}

export interface StepContent {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  acaFraming: string;
  psychoEducation: string;
  invitingIntro: string;
  exercises: Exercise[];
  resistanceNote: string;
  pacing: "slow" | "medium" | "normal";
  coreTheme: string;
}

export const LAUNDRY_LIST_TRAITS: string[] = [
  "We worden isolerende, zichzelf isolerende volwassenen.",
  "We worden goedkeuringsverslaafden en verliezen onze identiteit in dit proces.",
  "We zijn bang voor mensen die boos zijn en voor persoonlijke kritiek.",
  "We zijn familiegeheimhouders geworden die alles wat er met ons gezin mis gaat voor onszelf houden.",
  "We verwarren liefde en medelijden en neigen ernaar lief te hebben op mensen die we verlaten voelen.",
  "We hebben geleerd dat emoties — met name schuldgevoel en schaamte — niet gevoeld worden maar genesteld in onze lichamen.",
  "We zijn bang voor het verliezen van controle. We vermijden gevoelens of worden er door overweldigd.",
  "We zijn bang om kwetsbaar te zijn en anderen te vertrouwen.",
  "We hebben superverantwoordelijkheidsgevoel ontwikkeld en geven makkelijker dan we ontvangen.",
  "We zijn te kritisch over onszelf en hebben een laag zelfgevoel.",
  "We zijn zo erg gewond door verlating, dat we dit in andere relaties recreëren.",
  "We worden alcoholisten of trouwen met hen of vinden andere dwangmatige persoonlijkheden.",
  "We worden mede-afhankelijken, bang voor onze eigen emoties, en leiden een leven vol ontkenning.",
];

export const STEPS: StepContent[] = [
  {
    id: 1,
    title: "Machteloosheid",
    subtitle: "Erkennen wat was",
    icon: "self_improvement",
    color: "#476553",
    coreTheme: "Erkenning van overlevingspatronen",
    acaFraming:
      "In ACA erkennen we machteloosheid over de effecten van het disfunctionele gezin op ons leven — niet over een middel, maar over de overlevingspatronen die we als kind ontwikkelden om te overleven.",
    psychoEducation:
      "De patronen die je herkent — hyperwaakzaamheid, mensen pleasen, moeite met grenzen — waren ooit intelligente overlevingsstrategieën van een kind in een onveilige situatie. Dit is geen karaktergebrek; dit is trauma-adaptatie. Je zenuwstelsel deed precies wat het moest doen.",
    invitingIntro:
      "Je hoeft vandaag niets te besluiten of te begrijpen. Dit is een uitnodiging om te kijken — niet te oordelen. Je kunt altijd stoppen en later terugkomen.",
    exercises: [
      {
        title: "De Waslijst verkennen",
        prompt:
          "Lees de Waslijst langzaam door. Schrijf daarna: \"Ik herken in mezelf dat ik...\" — schrijf zonder te analyseren waarom. Alleen herkennen, niet verklaren.",
        type: "list",
        isOptional: false,
      },
      {
        title: "Brief aan het kind",
        prompt:
          "Schrijf een paar zinnen aan het kind dat jij was. Begin met: \"Lieve [jouw naam als kind]...\" Vertel hem of haar dat je nu hier bent.",
        type: "letter",
        isOptional: true,
        triggerWarning: "Deze oefening kan emoties oproepen. Ga in je eigen tempo.",
      },
    ],
    resistanceNote:
      "Als je denkt \"mijn jeugd was niet zo erg\" — dat is normaal. Ontkenning is de eerste bescherming die we als kind leerden. Je kunt altijd later terugkomen.",
    pacing: "slow",
  },
  {
    id: 2,
    title: "Hoop",
    subtitle: "Geloven in herstel",
    icon: "wb_sunny",
    color: "#4b6173",
    coreTheme: "Openheid voor een nieuw begin",
    acaFraming:
      "Stap 2 vraagt niet om geloof in een god. Het vraagt om de bereidheid te overwegen dat herstel mogelijk is — dat er een kracht buiten onze overlevingsmodus bestaat die ons kan helpen.",
    psychoEducation:
      "Als kind in een disfunctioneel gezin leerden we dat we alles zelf moesten oplossen. Het idee dat hulp van buitenaf beschikbaar is voelt vreemd, zelfs gevaarlijk. Neuroplasticiteit laat zien dat herstel van vroegkinderlijk trauma mogelijk is — maar alleen als we openstaan voor verandering.",
    invitingIntro:
      "Je hoeft niets te geloven. Alleen bereid zijn om open te staan voor de mogelijkheid dat het anders kan. Dat is genoeg voor vandaag.",
    exercises: [
      {
        title: "Momenten van herstel",
        prompt:
          "Denk aan een moment waarop iets in jou veranderde — hoe klein ook. Een inzicht, een rustig moment, een keer dat je anders reageerde dan gewoonlijk. Beschrijf dat moment.",
        type: "reflection",
        isOptional: false,
      },
      {
        title: "Wat zou herstel eruitzien?",
        prompt:
          "Als je drie jaar van nu bent, en je herstel is op gang — hoe voelt je dagelijkse leven dan? Schrijf in de tegenwoordige tijd, alsof het al zo is.",
        type: "journal",
        isOptional: true,
      },
    ],
    resistanceNote:
      "\"Ik geloof niet in een hogere macht\" — dat hoeft ook niet. ACA laat je zelf invullen wat die kracht is: de groep, de natuur, je eigen diepste wijsheid. Er is geen vereiste interpretatie.",
    pacing: "medium",
  },
  {
    id: 3,
    title: "Overgave",
    subtitle: "Loslaten wat je niet kunt controleren",
    icon: "open_in_full",
    color: "#8a4f38",
    coreTheme: "Controle loslaten",
    acaFraming:
      "Voor kinderen uit disfunctionele gezinnen was controle overleven. Alles under control houden was de enige manier om chaos te beheersen. Stap 3 vraagt iets radicaals: vertrouwen in plaats van controle.",
    psychoEducation:
      "Controledrang is een directe reactie op onveiligheid in de kindertijd. Het autonome zenuwstelsel leerde dat ontspanning gevaarlijk is. Overgave is niet zwakheid — het is het loslaten van een beschermingsstrategie die zijn nut heeft overleefd.",
    invitingIntro:
      "Overgave hoeft niet volledig te zijn. Zelfs een fractie — 5% minder controle — is een begin. Je doet dit in je eigen tempo.",
    exercises: [
      {
        title: "Controle inventaris",
        prompt:
          "Maak een lijst van dingen die je probeert te controleren maar niet kunt. Schrijf bij elk: wat kost je dat aan energie? Wat zou er gebeuren als je het losliet?",
        type: "list",
        isOptional: false,
      },
      {
        title: "Een kleine overgave",
        prompt:
          "Kies één klein ding dat je deze week loslaat. Niet iets groots — iets wat je normaal zou controleren. Schrijf op wat je kiest en hoe dat voelt.",
        type: "journal",
        isOptional: false,
      },
      {
        title: "Meditatie: de adem",
        prompt:
          "Zit vijf minuten stil. Observeer alleen je adem. Elke uitademing is een kleine overgave. Je hoeft niets te doen — alleen te zijn. Schrijf daarna wat je opmerkte.",
        type: "meditation",
        isOptional: true,
      },
    ],
    resistanceNote:
      "\"Loslaten voelt als opgeven\" — dat is het verschil tussen overgave en capitulatie. Je geeft niet op. Je stopt met vechten tegen wat niet te controleren is.",
    pacing: "slow",
  },
  {
    id: 4,
    title: "Inventaris",
    subtitle: "Eerlijk naar jezelf kijken",
    icon: "list_alt",
    color: "#476553",
    coreTheme: "Zelfkennis zonder oordeel",
    acaFraming:
      "De morele inventaris in ACA is anders dan in AA. We kijken niet alleen naar fouten — we kijken naar overlevingspatronen die ooit beschermden maar nu schaden. En we kijken naar de wonden die anderen ons toebrachten, die we nooit mochten erkennen.",
    psychoEducation:
      "Schaamte blokkeert eerlijk zelfonderzoek. Het verschil tussen schuld ('ik deed iets fout') en schaamte ('ik ben fout') is cruciaal. Een inventaris is geen aanklacht — het is een eerlijke kaart van het terrein.",
    invitingIntro:
      "Dit is de meest uitdagende stap. Neem je tijd. Doe het in stukjes. Er is geen deadline.",
    exercises: [
      {
        title: "Overlevingspatronen",
        prompt:
          "Schrijf patronen op die je herkent in jezelf: mensen pleasen, vermijden van conflict, overmatige verantwoordelijkheid nemen, anderen redden. Wees concreet — wanneer doet dit patroon zich voor?",
        type: "list",
        isOptional: false,
        triggerWarning: "Dit kan pijnlijk zijn. Neem pauzes wanneer nodig.",
      },
      {
        title: "Wat ik meekreeg",
        prompt:
          "Schrijf op wat je als kind ontving dat je niet verdiende: kritiek, verlating, te grote verantwoordelijkheid, onveiligheid. Dit is geen klaagzang — dit is erkenning van de werkelijkheid.",
        type: "journal",
        isOptional: true,
        triggerWarning: "Deze oefening gaat over jeugdtrauma. Ga voorzichtig met jezelf om.",
      },
      {
        title: "Krachten en gaven",
        prompt:
          "Je overlevingspatronen brachten ook krachten. Schrijf op wat je ontwikkelde: empathie, veerkracht, creativiteit, sensitiviteit. Beide kanten zijn waar.",
        type: "list",
        isOptional: false,
      },
    ],
    resistanceNote:
      "\"Ik ben bang voor wat ik zal vinden\" — dat is precies waarom dit stap 4 is en niet stap 1. Je hebt drie stappen van fundament opgebouwd. Je bent klaar voor dit.",
    pacing: "slow",
  },
  {
    id: 5,
    title: "Erkenning",
    subtitle: "Uitspreken wat was",
    icon: "record_voice_over",
    color: "#4b6173",
    coreTheme: "Het geheim doorbreken",
    acaFraming:
      "In disfunctionele gezinnen gold de wet van het zwijgen. Niemand praatte over wat er echt gebeurde. Stap 5 doorbreekt dat zwijgen — tegenover jezelf, een ander mens, en eventueel je hogere macht.",
    psychoEducation:
      "Onderzoek toont dat het uitspreken van trauma — het verwoorden ervan — de emotionele intensiteit verlaagt en het verhaal naar het talige geheugen verplaatst, weg van het traumatische geheugen. Getuige zijn van je eigen verhaal is helend.",
    invitingIntro:
      "Je hoeft dit met niemand te delen die je kent. Een therapeut, een sponsor, of zelfs een brief die je niet verstuurt — alle vormen zijn geldig.",
    exercises: [
      {
        title: "De brief die niemand leest",
        prompt:
          "Schrijf een eerlijke brief over je jeugd. Wat er werkelijk was. Vertel het aan iemand die volledig begrijpt — een denkbeeldige getuige die je volledig gelooft. Begin met: \"Wat er werkelijk was...\"",
        type: "letter",
        isOptional: false,
        triggerWarning: "Dit is zwaar werk. Doe dit op een moment dat je ruimte hebt.",
      },
      {
        title: "Wat ik nooit hardop zei",
        prompt:
          "Schrijf drie zinnen die je nooit hardop hebt gezegd over je jeugd of je patronen. Schrijf ze hier op.",
        type: "journal",
        isOptional: true,
      },
    ],
    resistanceNote:
      "\"Ik schaam me te veel\" — schaamte gedijt in stilte. Ze heeft het licht nodig. Je hoeft het niet met de wereld te delen — alleen met één getuige.",
    pacing: "slow",
  },
  {
    id: 6,
    title: "Bereidheid",
    subtitle: "Klaar zijn voor verandering",
    icon: "change_circle",
    color: "#8a4f38",
    coreTheme: "Loslaten van oude beschermers",
    acaFraming:
      "Onze karakterpatronen — ook de schadelijke — begonnen als bescherming. Bereid zijn ze los te laten is niet verraad aan het kind dat jij was. Het is het kind bevrijden van wat het niet meer nodig heeft.",
    psychoEducation:
      "Verandering activeert het angstcentrum in de hersenen, zelfs als de verandering positief is. Bereidheid is niet de afwezigheid van angst voor verandering — het is de bereidheid ondanks die angst te bewegen.",
    invitingIntro:
      "Je hoeft niet te weten hoe de verandering eruitziet. Alleen bereid zijn dat het anders kan worden. Dat is de hele stap.",
    exercises: [
      {
        title: "Wat ik vasthoud",
        prompt:
          "Welk patroon of overtuiging houd je vast, ook al weet je dat het je schaadt? Schrijf op waarom je het vasthoudt — wat beschermt het? Wat zou je verliezen als je het losliet?",
        type: "reflection",
        isOptional: false,
      },
      {
        title: "Brief aan mijn patroon",
        prompt:
          "Schrijf een brief aan een patroon dat je wil loslaten. Bedank het voor zijn bescherming. Vertel het dat je het nu voorzichtig los gaat laten.",
        type: "letter",
        isOptional: true,
      },
    ],
    resistanceNote:
      "\"Ik ben niet klaar\" — bereidheid is niet gereedheid. Je hoeft niet volledig klaar te zijn. Een fractie van openheid is voldoende voor deze stap.",
    pacing: "medium",
  },
  {
    id: 7,
    title: "Nederigheid",
    subtitle: "Om hulp vragen",
    icon: "volunteer_activism",
    color: "#476553",
    coreTheme: "Ontvangen leren",
    acaFraming:
      "Kinderen uit disfunctionele gezinnen leerden dat ze niet mochten vragen. Hulp vragen was zwakheid, of gevaarlijk, of werd niet beantwoord. Stap 7 is het herleren van iets fundamenteels: je mag ontvangen.",
    psychoEducation:
      "Hechting-onderzoek laat zien dat de behoefte aan verbinding en hulp aangeboren is. Wanneer die behoefte vroeg systematisch niet werd beantwoord, leerden we hem te onderdrukken. Dit is aangeleerd — en het kan worden afgeleerd.",
    invitingIntro:
      "Je hoeft niet perfect te weten wat je nodig hebt. Alleen bereid zijn om te vragen — aan wie of wat dan ook.",
    exercises: [
      {
        title: "Wat ik nodig heb",
        prompt:
          "Schrijf op wat je op dit moment in je leven nodig hebt. Niet wat je wil presteren — wat heb je nodig? Rust, verbinding, erkenning, ruimte? Wees eerlijk en concreet.",
        type: "journal",
        isOptional: false,
      },
      {
        title: "Eén kleine vraag",
        prompt:
          "Kies één persoon in je leven. Vraag hem of haar deze week om iets kleins — hulp, aanwezigheid, tijd. Schrijf hier op wie je kiest en wat je gaat vragen.",
        type: "reflection",
        isOptional: true,
      },
    ],
    resistanceNote:
      "\"Vragen om hulp voelt als last zijn\" — dat is het kind dat sprak. Verbinding gaat twee kanten op. Ontvangen is de andere kant van geven.",
    pacing: "medium",
  },
  {
    id: 8,
    title: "Herstellen (lijst)",
    subtitle: "Wie heb ik geraakt?",
    icon: "group",
    color: "#4b6173",
    coreTheme: "Verantwoordelijkheid nemen",
    acaFraming:
      "In ACA maken we onderscheid: we zijn niet verantwoordelijk voor wat ons werd aangedaan, maar we zijn wel verantwoordelijk voor hoe we daarop hebben gereageerd en hoe dat anderen raakte. Dit is geen zelfkastijding — het is eerlijkheid.",
    psychoEducation:
      "Trauma wordt doorgegeven. Kinderen die onveiligheid leerden recreëren soms onbewust onveiligheid voor anderen. Het erkennen hiervan — zonder in schaamte te verdrinken — is een daad van moed en integriteit.",
    invitingIntro:
      "Je hoeft nog niets te doen. Dit is alleen een lijst. Je kijkt — nog niet verder.",
    exercises: [
      {
        title: "De lijst",
        prompt:
          "Schrijf de namen of omschrijvingen op van mensen die je hebt geraakt door je overlevingspatronen. Wees eerlijk. Schrijf ook op op welke manier — niet als aanklacht, maar als erkenning.",
        type: "list",
        isOptional: false,
        triggerWarning: "Dit kan schaamte oproepen. Schaamte is geen bewijs van slechtheid.",
      },
      {
        title: "Mijn eigen naam op de lijst",
        prompt:
          "Sta je ook op je eigen lijst? Schrijf op hoe je jezelf hebt geraakt door je overlevingspatronen.",
        type: "reflection",
        isOptional: false,
      },
    ],
    resistanceNote:
      "\"Maar ik was ook slachtoffer\" — dat is waar. Beide zijn tegelijkertijd waar. Je kunt slachtoffer zijn én iemand die anderen raakte. Dit zijn geen tegenstellingen.",
    pacing: "slow",
  },
  {
    id: 9,
    title: "Herstellen (actie)",
    subtitle: "Goedmaken waar mogelijk",
    icon: "handshake",
    color: "#8a4f38",
    coreTheme: "Actie en vrijheid",
    acaFraming:
      "Herstel betekent niet dat je alles recht kunt zetten. Soms is contact niet mogelijk of zelfs schadelijk. De gids in Stap 9 is: maak goed waar het kan, zolang het de ander (of jouzelf) niet schaadt.",
    psychoEducation:
      "Het maken van herstel — ook kleine gebaren — vermindert schaamte en vergroot het gevoel van integriteit. Onderzoek toont dat dit een van de krachtigste interventies is voor het herstel van zelfrespect na trauma.",
    invitingIntro:
      "Begin klein. Één persoon. Één stap. Je hoeft niet alles tegelijk te herstellen.",
    exercises: [
      {
        title: "Wat kan ik doen?",
        prompt:
          "Kies één naam van je lijst uit Stap 8. Schrijf op wat goedmaken eruit zou zien. Direct contact? Een brief? Een gebaar? Of misschien: jezelf vergeven voor wat je deed?",
        type: "reflection",
        isOptional: false,
      },
      {
        title: "Jezelf goedmaken",
        prompt:
          "Je staat ook op de lijst. Schrijf een korte brief aan jezelf waarin je erkent wat je jezelf hebt aangedaan — en aangeeft dat je dit goed wil maken. Begin met: \"Beste [naam], ik erken dat ik jou heb...\"",
        type: "letter",
        isOptional: true,
        triggerWarning: "Dit kan emotioneel intensief zijn. Ga voorzichtig.",
      },
    ],
    resistanceNote:
      "\"Ik kan het verleden niet veranderen\" — dat klopt. Herstel gaat niet over het verleden veranderen, maar over de relatie met dat verleden veranderen.",
    pacing: "normal",
  },
  {
    id: 10,
    title: "Voortgang",
    subtitle: "Dagelijkse eerlijkheid",
    icon: "today",
    color: "#476553",
    coreTheme: "Bewust leven",
    acaFraming:
      "Herstel is geen einddoel — het is een dagelijkse praktijk. Stap 10 vraagt om voortgezette eerlijkheid: wanneer schoot ik vandaag in mijn overlevingspatronen? Wanneer reageerde ik anders?",
    psychoEducation:
      "Regelmatige zelfreflectie versterkt de prefrontale cortex — het deel van de hersenen dat bewuste keuzes maakt in plaats van automatisch te reageren. Dit is letterlijk het bouwen van nieuwe neurale paden.",
    invitingIntro:
      "Dit is een dagelijkse mini-stap. Vijf minuten eerlijk kijken. Niet meer.",
    exercises: [
      {
        title: "Dagelijkse check-in",
        prompt:
          "Beantwoord kort: Wanneer reageerde ik vandaag vanuit mijn overlevingspatroon? Wanneer reageerde ik bewust? Wat wil ik morgen anders doen?",
        type: "journal",
        isOptional: false,
      },
      {
        title: "Erkenning",
        prompt:
          "Als je vandaag iemand hebt geraakt door je reacties — ook jezelf — schrijf het op. Niet als straf, maar als erkenning. Wat zou een eerlijk excuus zijn?",
        type: "reflection",
        isOptional: true,
      },
    ],
    resistanceNote:
      "\"Ik vergeet het steeds\" — dat is precies waarom Stap 10 bestaat. Het is een gewoonte die je opbouwt, niet een vaardigheid die je al hebt.",
    pacing: "normal",
  },
  {
    id: 11,
    title: "Verbinding",
    subtitle: "Stilte en innerlijke stem",
    icon: "spa",
    color: "#4b6173",
    coreTheme: "Innerlijke rust",
    acaFraming:
      "Stap 11 is over contact met je diepste zelf — of dat nu gebed, meditatie, natuur, muziek of stilte is. In een disfunctioneel gezin leerden we dat de binnenwereld onveilig was. Dit stap hervindt die binnenwereld als thuis.",
    psychoEducation:
      "Regelmatige meditatie en mindfulness veranderen aantoonbaar de structuur van de hersenen: minder reactief, meer aanwezig. Voor mensen met vroegkinderlijk trauma is dit bijzonder helend — de stilte wordt langzaam veiliger.",
    invitingIntro:
      "Er is geen juiste manier. Vijf minuten stilte is genoeg. Je hoeft niet goed te zijn in meditatie.",
    exercises: [
      {
        title: "Vijf minuten stilte",
        prompt:
          "Zet een timer op vijf minuten. Sluit je ogen. Observeer je gedachten zonder ze te volgen. Als je afgeleid bent — dat is normaal. Kom terug. Schrijf daarna op wat je opmerkte.",
        type: "meditation",
        isOptional: false,
      },
      {
        title: "Brief aan je innerlijke stem",
        prompt:
          "Er is een stem in jou die altijd wist wat goed voor je was, ook al kon je er niet naar luisteren. Schrijf aan die stem. Wat wil je hem of haar zeggen?",
        type: "letter",
        isOptional: true,
      },
    ],
    resistanceNote:
      "\"Mijn hoofd staat nooit stil\" — dat is niet het probleem. De oefening is niet het stil maken van de geest, maar het observeren ervan zonder meegesleurd te worden.",
    pacing: "slow",
  },
  {
    id: 12,
    title: "Dienst",
    subtitle: "De cirkel voltooien",
    icon: "favorite",
    color: "#8a4f38",
    coreTheme: "Geven vanuit overvloed",
    acaFraming:
      "Stap 12 sluit de cirkel: wat je hebt ontvangen, deel je. Maar ACA voegt een cruciaal element toe: alleen geven vanuit overvloed, niet vanuit leegte. De vraag is niet 'wat kan ik geven?' maar 'wat heb ik echt te geven vanuit mijn herstel?'",
    psychoEducation:
      "Altruïsme — het helpen van anderen — is een van de krachtigste bronnen van betekenis en welzijn. Maar voor mensen met CoDA-patronen is het onderscheid cruciaal: helpen vanuit kracht versus helpen vanuit angst. Dit stap cultiveert het eerste.",
    invitingIntro:
      "Je hoeft geen sponsor te worden. Dienst kan klein zijn. Een eerlijk gesprek. Aanwezig zijn. Je verhaal delen wanneer het helpt.",
    exercises: [
      {
        title: "Mijn herstel als geschenk",
        prompt:
          "Schrijf op wat jij hebt geleerd in dit proces dat waardevol zou zijn voor iemand anders die net begint. Niet als advies — als getuigenis. Wat wou je dat iemand jou had verteld?",
        type: "journal",
        isOptional: false,
      },
      {
        title: "Brief aan een toekomstige reiziger",
        prompt:
          "Schrijf een brief aan iemand die net begint aan dit herstelproces. Wat wil je hem of haar laten weten? Begin met: \"Beste medepassagier...\"",
        type: "letter",
        isOptional: true,
      },
      {
        title: "Wat heb ik echt nodig om te geven?",
        prompt:
          "Voordat je geeft: wat heb jij nodig? Schrijf eerlijk op wat jouw fundament van herstel is — wat jou in staat stelt te geven zonder leeg te raken.",
        type: "reflection",
        isOptional: false,
      },
    ],
    resistanceNote:
      "\"Ik ben nog niet klaar om te geven\" — misschien is dat waar. Dienst begint soms met alleen aanwezig zijn. Je hoeft niets te hebben wat je niet hebt.",
    pacing: "normal",
  },
];

export const PROGRESS_PHILOSOPHY = {
  noStreaks: true,
  noFailureState: true,
  allowRevisiting: true,
  language: {
    visited: "bezoekt",
    returning: "keert terug naar",
    present: "is hier",
  },
};
