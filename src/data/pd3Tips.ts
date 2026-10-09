// PD3-specific Tips & Tricks: exam facts and strategy advice for Prøve i
// Dansk 3 (B2-level), written for this app. Timing/structure facts are
// drawn from the real exam booklets and censor/eksaminator rubrics
// extracted in scripts/extract_pd3_*.py; the strategic advice is original.

export interface TipSection {
  id: string
  icon: string
  title: string
  tips: string[]
}

export const pd3ExamFacts = {
  title: 'Eksamens-fakta for PD3 (det du skal vide)',
  items: [
    { label: 'Niveau', value: 'Vantage (B2) ifølge Common European Framework of Reference (CEFR)' },
    { label: 'Læseforståelse 1 (Delprøve 1)', value: '25 minutter · ingen hjælpemidler · 15 point' },
    { label: 'Læseforståelse 2 (Delprøve 2A/2B/3)', value: '65 minutter · ingen hjælpemidler · ca. 22-24 point' },
    { label: 'Skriftlig fremstilling', value: '2½ time i alt · alle ordbøger tilladt · e-mail + valg mellem 2 opgaver' },
    { label: 'Mundtlig kommunikation', value: 'To delprøver à ca. 5 minutter hver: forberedt emne + uforberedt emne' },
    { label: 'Skriftlig fremstilling, minimumslængde', value: 'E-mail: min. 100 ord · Delprøve 2 (valgfri opgave): min. 200 ord' },
  ],
}

export const pd3TipSections: TipSection[] = [
  {
    id: 'general',
    icon: '🎯',
    title: 'Generelle tips til hele eksamen',
    tips: [
      'PD3 er sværere end PD2 (B2 i stedet for B1) — forvent længere tekster, mere abstrakt indhold og større krav til argumentation og nuancering.',
      'Øv alle fire moduler jævnligt: Reading, Writing, Speaking og Grammar hænger sammen — bedre læseforståelse gør dig også bedre til at skrive og tale.',
      'Lær konnektorerne i Vocab-modulet (fx "derimod", "ikke desto mindre", "til gengæld") — de er afgørende for at score højt i både skriftlig og mundtlig argumentation på B2-niveau.',
      'Tag mindst ét helt læsesæt under tidspres, så du vænner dig til, at Delprøve 2 (65 minutter) kræver god tidsstyring mellem flere opgavetyper.',
    ],
  },
  {
    id: 'reading',
    icon: '📖',
    title: 'Læseforståelse',
    tips: [
      'Læseforståelse 1 ligner PD2\'s opgave 1: scan efter konkrete fakta i en "opslagsbog"-tekst. Læs spørgsmålene først, og brug overskrifterne i teksten til hurtigt at finde det rigtige afsnit.',
      'Delprøve 2A (flervalg) — læs hele teksten grundigt først. Svarmulighederne er ofte tæt på hinanden, så find den PRÆCISE formulering i teksten, der bekræfter eller afkræfter hver mulighed.',
      'Delprøve 2B (tekstdele/match) — der er altid 2 ekstra tekstdele, du ikke skal bruge. Kig efter sammenhængsord (fx "derfor", "dog", "dette") i starten af hver tekstdel — de afslører, hvilket afsnit de passer til.',
      'Delprøve 3 (ord/udtryk) — læs altid hele sætningen omkring hullet, og tjek om det grammatisk er et udsagnsord, navneord, biord osv., der mangler. Mange af svarmulighederne betyder noget lignende, men kun ét passer grammatisk og stilistisk.',
      'Tjek eksemplet (0) i cloze-opgaven for at se formatet, før du går i gang.',
    ],
  },
  {
    id: 'writing',
    icon: '✍️',
    title: 'Skriftlig fremstilling',
    tips: [
      'E-mailen (Delprøve 1) minder om PD2\'s e-mail-opgave, men forventes mere nuanceret: svar på alle de understregede/markerede punkter, og uddyb med egne eksempler.',
      'I Delprøve 2 skal du vælge ÉN af to opgaver (A eller B) — brug et minut på at vælge den, du har mest at sige om, frem for automatisk at tage den første.',
      'Delprøve 2-opgaverne beder dig ofte om at: 1) beskrive et diagram/en situation, 2) forklare årsager, og 3) vurdere fordele/ulemper og begrunde din holdning. Svar på alle tre dele — vurderingsdelen skal typisk fylde omkring halvdelen af besvarelsen.',
      'Brug konnektorer aktivt (se Vocab-modulet): "på den ene side... på den anden side", "til trods for", "som følge af" — det viser, at du kan strukturere et argument på B2-niveau.',
      'Tjek ordtallet: minimum 100 ord til e-mailen og minimum 200 ord til Delprøve 2-opgaven.',
    ],
  },
  {
    id: 'speaking',
    icon: '🗣️',
    title: 'Mundtlig kommunikation',
    tips: [
      'Delprøve 1 (forberedt emne): du præsenterer et emne i ca. 2 minutter UDEN eksaminators hjælp — øv dig i at tale sammenhængende i 2 minutter uden pauser.',
      'Eksaminator stiller derefter opfølgende spørgsmål, der kræver forklaring, begrundelse og stillingtagen — forbered dig på "Hvorfor tror du...?" og "Er du enig i, at...?".',
      'Delprøve 2 (uforberedt emne): du trækker ét af tre emner (A, B, C) og får ca. 10 sekunder til at se på to billeder, før eksaminator stiller et obligatorisk spørgsmål til én af situationerne.',
      'Svar aldrig kun ja/nej til det obligatoriske spørgsmål — uddyb altid med "fordi..." og giv et konkret eksempel.',
      'Det afsluttende, mere overordnede spørgsmål tester, om du kan tage stilling til et bredere samfundsspørgsmål — øv dig i at udtrykke og begrunde en holdning, selvom du ikke har forberedt emnet.',
    ],
  },
  {
    id: 'grammar',
    icon: '🧩',
    title: 'Grammatik (B2-niveau)',
    tips: [
      'Øv forskellen på s-passiv og blive-passiv — det er et af de klareste kendetegn ved B2-niveau skriftsprog.',
      'Lær at vælge korrekt mellem "som", "der", "hvis" og "hvilket" i relativsætninger — en lille fejl her er meget synlig for en bedømmer.',
      'Træn ordstilling i ledsætninger, især efter "selvom", "fordi" og "da/når" — og husk, at "ikke" flytter plads i ledsætninger.',
      'Participier som adjektiver (fx "spændende" vs. "spændt") forveksles ofte — øv dig i forskellen mellem aktiv og passiv betydning.',
    ],
  },
]
