// Tips & Tricks: consolidated exam strategy advice for PD2, written for
// this app. Timing/structure facts (Delprøve lengths, allowed aids, the
// 7-trins grading scale) are drawn from the real exam booklets and
// censor/eksaminator rubrics in /source-papers; the strategic advice itself
// is original, aimed at the mistakes and successes visible across the real
// student writing samples and official examiner guidance used elsewhere in
// this app.

export interface TipSection {
  id: string
  icon: string
  title: string
  tips: string[]
}

export const examFacts = {
  title: 'Eksamens-fakta (det du skal vide)',
  items: [
    { label: 'Læseforståelse, Delprøve 1 (Opgave 1-2)', value: '30 minutter · ingen hjælpemidler' },
    { label: 'Læseforståelse, Delprøve 2 (Opgave 3-5)', value: '60 minutter · ingen hjælpemidler' },
    { label: 'Skriftlig fremstilling (Delprøve 1 + 2)', value: '1½ time i alt · alle ordbøger tilladt' },
    { label: 'Mundtlig kommunikation', value: 'To prøvedeltagere ad gangen + en eksaminator, ca. 10-15 minutter' },
    { label: 'Læseforståelse point', value: '30 point i alt (12 point Delprøve 1, 18 point Delprøve 2)' },
    { label: 'Karakterskala', value: '7-trins-skalaen: 12, 10, 7, 4, 02, 00, -3 (02 er laveste beståede karakter)' },
  ],
}

export const tipSections: TipSection[] = [
  {
    id: 'general',
    icon: '🎯',
    title: 'Generelle tips til hele eksamen',
    tips: [
      'Øv dig jævnligt i små bidder (20-30 min) frem for sjældne lange sessioner — det virker bedre for sprogindlæring.',
      'Lav mindst ét helt Reading-sæt under tidspres (med Timer-funktionen i appen), så du vænner dig til tempoet.',
      'Lær de faste vendinger til hver skrivegenre udenad (se "Nyttige vendinger" i Writing) — de giver point for "pragmatisk færdighed" uden den store indsats.',
      'I den mundtlige prøve og skriftlige del bliver du bedømt på, om kommunikationen lykkes — det er ikke en grammatikprøve. Perfekt grammatik med forkert indhold scorer lavere end god kommunikation med nogle fejl.',
      'Lav en fast rutine op til eksamen: sov godt, mød op i god tid, og medbring gyldig legitimation.',
    ],
  },
  {
    id: 'reading',
    icon: '📖',
    title: 'Læseforståelse',
    tips: [
      'Læs altid spørgsmålene FØR du læser teksten — så ved du præcis, hvad du skal lede efter.',
      'Opgave 1 handler om at scanne, ikke at forstå hvert ord. Søg efter navne, tal og nøgleord fra spørgsmålet direkte i teksten.',
      'I opgave 2 (annoncer) — læs ALLE annoncerne én gang, og match derefter ordene på listen. Der er altid 2 annoncer, du ikke skal bruge; bliv ikke forvirret over dem.',
      'I opgave 3 (udfyld ord) — læs hele sætningen (før og efter hullet) først. Svaret skal passe grammatisk (fx tid/bøjning), ikke kun betydningsmæssigt.',
      'I opgave 4 (manglende sætning) — kig efter ord som "det", "den", "men", "for" i svarmulighederne; de giver et hint om, hvad sætningen før handlede om.',
      'I opgave 5 (interview) — spørgsmålene står IKKE i samme rækkefølge som afsnittene. Læs hele interviewet først, og match så.',
      'Tjek altid eksemplet (0) — det viser dig præcis, hvilket format svaret skal have.',
    ],
  },
  {
    id: 'writing',
    icon: '✍️',
    title: 'Skriftlig fremstilling',
    tips: [
      'Svar på ALLE punkterne i opgaven (de 4 "du skal fortælle"-punkter) — en besvarelse, der mangler et punkt, bliver automatisk bedømt lavere ("Er alle punkter besvaret?" er et selvstændigt bedømmelseskriterium).',
      'Brug en passende indledning og afslutning for genren (se phrasebank i hver genre) — det tæller som en del af din "pragmatiske færdighed".',
      'Delprøve 2 (e-mailen) kræver minimum 100 ord — tæl dem, hvis du er i tvivl (appen tæller automatisk for dig).',
      'Skriv i et omfang, der matcher din tid: ca. 15-20 minutter på planlægning/kladde, og gem 10 minutter til gennemlæsning.',
      'Gennemlæs for: verbets placering (nr. 2 i hovedsætninger), kongruens (en/et-ord + adjektiv), og stavefejl i ord, du er usikker på.',
      'Brug ikke for avancerede ord, du ikke er 100% sikker på — enkle, korrekte sætninger scorer bedre end avancerede, forkerte.',
      'Se de ægte elevbesvarelser i appen (med karakterer) for at se, hvad der adskiller en 10 fra en 4 — ofte er det struktur og om alle punkter er besvaret, ikke kun grammatik.',
    ],
  },
  {
    id: 'speaking',
    icon: '🗣️',
    title: 'Mundtlig kommunikation',
    tips: [
      'Når du beskriver billedet: brug simple, tydelige sætninger ("Billedet viser..."), og nævn hvem, hvad og hvor.',
      'Når du giver din mening, så BEGRUND den altid med "fordi..." eller "for mig betyder det...". Eksaminator leder efter begrundelse, ikke kun en holdning.',
      'I diskussionsdelen: lyt til din makker og svar på det, de siger ("Jeg er enig, men...", "Det synes jeg ikke, fordi..."). Det tester samtalefærdighed, ikke en monolog.',
      'Det er helt okay at blive uenige til sidst — det vigtige er, at I TALER sammen om emnet, ikke at I opnår enighed.',
      'Hvis du går i stå: brug fyldord som "Lad mig tænke...", "Det er et godt spørgsmål..." — det er bedre end lange, tavse pauser.',
      'Øv højt (ikke kun i hovedet) — brug optage-funktionen i Speaking-modulet og lyt tilbage på dig selv.',
    ],
  },
  {
    id: 'grammar',
    icon: '🧩',
    title: 'Grammatik — de hyppigste fejl',
    tips: [
      'Modalverber (kan, skal, vil, må) tager ALDRIG "at" foran det næste verbum: "Jeg kan tale dansk" (ikke "kan at tale").',
      'Husk at bytte om på subjekt og verbum (invertering), når sætningen ikke starter med subjektet: "I morgen skal jeg arbejde" (ikke "I morgen jeg skal").',
      'Adjektiver i flertal og bestemt form bruger altid e-form: "de gode venner", "det store hus" — ikke "det stort hus".',
      'Bevægelsesverber (rejse, komme, blive, flytte) danner ofte førnutid med "er", ikke "har": "Jeg er flyttet", "Hun er kommet".',
      'I ledsætninger (efter "at", "fordi", "når") flyttes "ikke" op foran det bøjede verbum: "...at hun ikke kommer" (ikke "...at hun kommer ikke").',
      'Brug Grammar-modulet i appen til at øve netop disse punkter — de er dem, PD2-teksterne rammer oftest.',
    ],
  },
  {
    id: 'vocab',
    icon: '🗂️',
    title: 'Ordforråd',
    tips: [
      'Øv verbernes bøjning (nutid/datid/førnutid), ikke kun oversættelse — PD2 tester, om du kan BRUGE ordene korrekt i en sætning, ikke kun genkende dem.',
      'Brug spaced repetition konsekvent: få minutter hver dag slår én lang session om ugen.',
      'Lær ordene i kontekst — prøv at lave en kort sætning med hvert nyt ord/verbum, du øver.',
      'Fokusér først på "uv" (uregelmæssige) verber i Vocab-træneren — de er sværest at huske og optræder ofte i eksamensteksterne.',
    ],
  },
]
