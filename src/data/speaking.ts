// Speaking (Mundtlig kommunikation) topics. The PD2 oral exam pairs two
// candidates: each gets a picture on the same topic (~30s to look), is asked
// to describe it, give an opinion, and share personal experience — then both
// candidates discuss/debate a related dilemma together.
//
// Topics marked source: 'official' reproduce the structure of real PD2
// examiner scripts (2022-2023). Topics marked source: 'practice' are original
// practice material written in the same style for topics that have appeared
// as real exam titles across 2013-2023 (see /source-papers) but whose exact
// examiner script wasn't digitized — useful for broadening practice coverage.
import type { SpeakingTopic } from '../types'

export const speakingTopics: SpeakingTopic[] = [
  {
    id: 'sp-transport',
    letter: 'A',
    title: 'Transport',
    exam: { year: 2023, season: 'Sommer', label: 'Maj-juni 2023' },
    source: 'official',
    pictures: [
      {
        participant: 1,
        imageDescription: 'Nogle personer, der kører i bil.',
        describeCue: 'Vil du godt beskrive situationen på billedet?',
        opinionQuestion: 'Hvad er godt ved at tage bilen på arbejde?',
        experienceQuestion: 'Hvordan kommer du i skole (eller på arbejde)? Hvad synes du om det? Hvorfor?',
      },
      {
        participant: 2,
        imageDescription: 'Nogle personer, der tager toget.',
        describeCue: 'Vil du godt beskrive situationen på billedet?',
        opinionQuestion: 'Hvad er godt ved at tage toget på arbejde?',
        experienceQuestion: 'Hvordan kommer du i skole (eller på arbejde)? Hvad synes du om det? Hvorfor?',
      },
    ],
    discussionPrompt:
      'Bliv enige: skal en mand på 35, der har fået nyt arbejde 10 km fra sin bolig, cykle eller tage bussen på arbejde?',
    discussionPointsFor: [
      'Cykle: det er billigt / frisk luft og motion / skal ikke vente på bussen / godt for miljøet',
      'Bus: man kan slappe af / godt i dårligt vejr / kan høre musik eller se film på mobilen',
    ],
    discussionPointsAgainst: [
      'Cykle: tager måske længere tid / sveder og lugter måske / irriterende i regn/blæst/punktering',
      'Bus: dyrt / irriterende at vente / kører måske ikke så tit / skal måske stå op',
    ],
  },
  {
    id: 'sp-boernepasning',
    letter: 'B',
    title: 'Børnepasning',
    exam: { year: 2023, season: 'Sommer', label: 'Maj-juni 2023' },
    source: 'official',
    pictures: [
      {
        participant: 1,
        imageDescription: 'Et barn, der bliver passet hjemme.',
        describeCue: 'Vil du godt beskrive situationen på billedet?',
        opinionQuestion: 'Hvad synes du om, at børn bliver passet hjemme?',
        experienceQuestion:
          'Har du børn? Hvis ja: Hvor bliver dine børn passet (hjemme eller i børnehave)? Hvis nej: Blev du passet hjemme eller i børnehave, da du var barn?',
      },
      {
        participant: 2,
        imageDescription: 'Nogle børn, der bliver passet i en børnehave.',
        describeCue: 'Vil du godt beskrive situationen på billedet?',
        opinionQuestion: 'Hvad synes du om, at børn bliver passet i børnehave?',
        experienceQuestion:
          'Har du børn? Hvis ja: Hvor bliver dine børn passet? Hvis nej: Blev du passet hjemme eller i børnehave, da du var barn?',
      },
    ],
    discussionPrompt:
      'Bliv enige: er det okay, at en pige på 10 år er alene hjemme om eftermiddagen, indtil hendes forældre kommer hjem kl. 18?',
    discussionPointsFor: [
      'Hvis hun gerne selv vil / har en mobil og kan ringe til forældrene',
      'Der er måske en nabo, hun kan kontakte, eller større søskende hjemme',
      'God måde for hende at lære at klare sig selv',
    ],
    discussionPointsAgainst: [
      'Hvis hun ikke vil være alene / bliver bange eller ked af det',
      'Kedeligt for hende',
      'Hun er måske ikke gammel nok, og kan komme til at gøre noget farligt (fx varme mad)',
    ],
  },
  {
    id: 'sp-sommerferie',
    letter: 'C',
    title: 'Sommerferie',
    exam: { year: 2023, season: 'Sommer', label: 'Maj-juni 2023' },
    source: 'official',
    pictures: [
      {
        participant: 1,
        imageDescription: 'Nogle personer, der holder sommerferie.',
        describeCue: 'Vil du godt beskrive situationen på billedet?',
        opinionQuestion: 'Hvad synes du om den måde at holde ferie på?',
        experienceQuestion:
          'Holder du selv sommerferie? Hvis ja: Hvad kan du godt lide at lave i din sommerferie? Hvis nej: Hvad lavede du i dine ferier, da du var barn?',
      },
      {
        participant: 2,
        imageDescription: 'Nogle personer, der holder sommerferie (et andet sted/anden aktivitet).',
        describeCue: 'Vil du godt beskrive situationen på billedet?',
        opinionQuestion: 'Hvad synes du om den måde at holde ferie på?',
        experienceQuestion:
          'Holder du selv sommerferie? Hvad kan du godt lide at lave? Eller: hvad lavede du som barn?',
      },
    ],
    discussionPrompt:
      'Bliv enige: er det bedst for en familie med to små børn på 2 og 4 år at holde ferie i udlandet eller i Danmark?',
    discussionPointsFor: [
      'Udlandet: dejligt med varme / spændende at se en anden kultur / sjovt for børnene / måske billigere restauranter',
      'Danmark: måske billigere / mere afslappende at rejse med små børn',
    ],
    discussionPointsAgainst: [
      'Udlandet: måske dyrt / besværligt at rejse langt med små børn / dårligt for miljøet at flyve',
      'Danmark: vejret kan være dårligt / mindre spændende / dyrt at spise ude',
    ],
  },
  {
    id: 'sp-laere-dansk',
    letter: 'A',
    title: 'At lære dansk',
    exam: { year: 2022, season: 'Sommer', label: 'Maj-juni 2022' },
    source: 'official',
    pictures: [
      {
        participant: 1,
        imageDescription: 'En mand, der lærer dansk derhjemme.',
        describeCue: 'Vil du godt beskrive situationen på billedet?',
        opinionQuestion: 'Hvad synes du om, at man lærer dansk online?',
        experienceQuestion: 'Hvordan har du selv lært dansk? Hvad synes du om det?',
      },
      {
        participant: 2,
        imageDescription: 'Nogle personer, der lærer dansk på en sprogskole.',
        describeCue: 'Vil du godt beskrive situationen på billedet?',
        opinionQuestion: 'Hvad synes du om, at man lærer dansk på en sprogskole?',
        experienceQuestion: 'Hvordan har du selv lært dansk? Hvad synes du om det?',
      },
    ],
    discussionPrompt: 'Bliv enige: hvad kan man som udlænding gøre for at lære dansk, hvis man har en travl hverdag?',
    discussionPointsFor: [
      'Gå på sprogskole en gang om ugen, om aftenen eller i weekenden',
      'Lære derhjemme: apps, danske film/tv/bøger, YouTube',
      'Lære på arbejde/i praktik: tale med kolleger, chef og kunder',
      'Lære i fritiden: tale dansk med venner, naboer, børn eller en frivillig',
    ],
    discussionPointsAgainst: [
      'Svært at finde tid med en travl hverdag',
      'Dyrt eller langt at komme til sprogskole',
      'Kan være akavet at øve sig med modersmålstalere i starten',
    ],
  },
  {
    id: 'sp-godt-liv-aeldre',
    letter: 'B',
    title: 'Et godt liv som ældre',
    exam: { year: 2022, season: 'Sommer', label: 'Maj-juni 2022' },
    source: 'official',
    pictures: [
      {
        participant: 1,
        imageDescription: 'Nogle ældre mennesker, der dyrker motion.',
        describeCue: 'Vil du godt beskrive situationen på billedet?',
        opinionQuestion: 'Hvad synes du om, at ældre mennesker dyrker motion?',
        experienceQuestion: 'Hvad vil du selv gerne lave, når du bliver ældre? Hvorfor?',
      },
      {
        participant: 2,
        imageDescription: 'Nogle ældre mennesker, der passer deres børnebørn.',
        describeCue: 'Vil du godt beskrive situationen på billedet?',
        opinionQuestion: 'Hvad synes du om, at ældre mennesker hjælper med at passe deres børnebørn?',
        experienceQuestion: 'Hvad vil du selv gerne lave, når du bliver ældre? Hvorfor?',
      },
    ],
    discussionPrompt: 'Bliv enige: er det bedst for ældre mennesker at fortsætte med at arbejde, eller at gå på pension?',
    discussionPointsFor: [
      'Fortsætte med at arbejde: tjener penge / holder sig aktiv / faste rutiner / kontakt til kolleger',
      'Gå på pension: mere tid / kan være mere sammen med familie og venner',
    ],
    discussionPointsAgainst: [
      'Fortsætte: kan ikke arbejde så hurtigt / brug for flere pauser / hårdt fysisk / bliver hurtigere træt',
      'Pension: mindre fast struktur i hverdagen / kan føles ensomt uden kolleger',
    ],
  },
]

// Additional real PD2 topic titles that have appeared 2013-2023 (sourced
// from official examiner booklets in /source-papers), with original
// practice material in the same exam style for self-study.
const extraTopicTitles: { letter: string; title: string }[] = [
  { letter: 'A', title: 'Arbejde' },
  { letter: 'A', title: 'At købe nyt eller brugt' },
  { letter: 'A', title: 'At være sammen med andre' },
  { letter: 'A', title: 'Brug af mobiltelefoner' },
  { letter: 'A', title: 'En travl hverdag' },
  { letter: 'A', title: 'Et godt arbejde' },
  { letter: 'A', title: 'Fester' },
  { letter: 'A', title: 'Fritid' },
  { letter: 'A', title: 'Fritidsarbejde' },
  { letter: 'A', title: 'Gæster' },
  { letter: 'A', title: 'Husarbejde' },
  { letter: 'A', title: 'Morgen' },
  { letter: 'A', title: 'Søskende' },
  { letter: 'A', title: 'Venner' },
  { letter: 'A', title: 'Årstider' },
  { letter: 'B', title: 'At bo alene eller sammen med andre' },
  { letter: 'B', title: 'At have travlt på arbejde' },
  { letter: 'B', title: 'At hjælpe andre' },
  { letter: 'B', title: 'At lære noget nyt som voksen' },
  { letter: 'B', title: 'By eller land' },
  { letter: 'B', title: 'Børn og forældre' },
  { letter: 'B', title: 'Et godt job' },
  { letter: 'B', title: 'Fritidsinteresser' },
  { letter: 'B', title: 'Mad' },
  { letter: 'B', title: 'Naboer' },
  { letter: 'B', title: 'Ny i Danmark' },
  { letter: 'B', title: 'Ny på en arbejdsplads' },
  { letter: 'B', title: 'Praktik' },
  { letter: 'B', title: 'På tur' },
  { letter: 'B', title: 'Sund eller usund mad' },
  { letter: 'C', title: 'Arbejde' },
  { letter: 'C', title: 'At flytte hjemmefra' },
  { letter: 'C', title: 'At få danske venner' },
  { letter: 'C', title: 'At spare penge i hverdagen' },
  { letter: 'C', title: 'Boligområder' },
  { letter: 'C', title: 'Børn og unges fritid' },
  { letter: 'C', title: 'Dyr' },
  { letter: 'C', title: 'Et godt sted at bo' },
  { letter: 'C', title: 'Hjælpsomhed' },
  { letter: 'C', title: 'Kolleger og klassekammerater' },
  { letter: 'C', title: 'Motion' },
  { letter: 'C', title: 'Naboer' },
  { letter: 'C', title: 'Penge' },
  { letter: 'C', title: 'Smartphones og tablets' },
  { letter: 'C', title: 'Sund eller usund livsstil' },
  { letter: 'C', title: 'Transport til arbejde' },
  { letter: 'C', title: 'Weekend' },
]

function buildPracticeTopic(letter: string, title: string, idx: number): SpeakingTopic {
  return {
    id: `sp-practice-${idx}`,
    letter,
    title,
    source: 'practice',
    pictures: [
      {
        participant: 1,
        imageDescription: `(Forestil dig et billede, der viser en situation om "${title}".)`,
        describeCue: 'Beskriv situationen: hvem ser du, hvad laver de, og hvor foregår det?',
        opinionQuestion: `Hvad synes du om dette, når det handler om "${title}"? Hvorfor?`,
        experienceQuestion: `Fortæl om dine egne erfaringer med "${title}". Hvad synes du om det?`,
      },
      {
        participant: 2,
        imageDescription: `(Forestil dig et andet billede om samme emne: "${title}".)`,
        describeCue: 'Beskriv situationen på dit billede.',
        opinionQuestion: `Hvad er din holdning til "${title}"? Begrund dit synspunkt.`,
        experienceQuestion: `Hvordan er din egen erfaring med "${title}"?`,
      },
    ],
    discussionPrompt: `Diskutér sammen: bliv enige om en konkret situation eller holdning inden for emnet "${title}" (fx er I enige om, hvad der er den bedste løsning for en bestemt person i en bestemt situation?).`,
    discussionPointsFor: [
      'Brug udtryk som "Jeg synes, at …", "Jeg er enig, fordi …", "En fordel er …"',
    ],
    discussionPointsAgainst: [
      'Brug udtryk som "Jeg er ikke helt enig, fordi …", "En ulempe er …", "Hvad synes du om …?"',
    ],
  }
}

export const allSpeakingTopics: SpeakingTopic[] = [
  ...speakingTopics,
  ...extraTopicTitles.map((t, i) => buildPracticeTopic(t.letter, t.title, i)),
]

export function getSpeakingTopic(id: string) {
  return allSpeakingTopics.find((t) => t.id === id)
}
