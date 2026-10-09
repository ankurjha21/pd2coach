// PD3-specific vocabulary: B2-level sentence connectives (sætningsadverbialer
// brugt i argumentation) and idiomatic expressions. PD2 already covers the
// 500 most common verbs and 250 adjectives, so PD3's vocab module instead
// focuses on the more advanced "glue" language and idioms that B2 writing
// and speaking require. Original content written for this app.
import type { PD3PhraseEntry } from '../types'

export const pd3Phrases: PD3PhraseEntry[] = [
  // ---------------- Connectives (argumentation) ----------------
  {
    phrase: 'desuden',
    meaning: 'furthermore, in addition',
    example: 'Lejligheden er billig. Desuden ligger den tæt på metroen.',
    category: 'connective',
  },
  {
    phrase: 'derimod',
    meaning: 'on the contrary, in contrast',
    example: 'Peter kan lide at løbe. Hans bror derimod foretrækker at svømme.',
    category: 'connective',
  },
  {
    phrase: 'alligevel',
    meaning: 'nevertheless, still, anyway',
    example: 'Det regnede meget, men vi tog alligevel en gåtur.',
    category: 'connective',
  },
  {
    phrase: 'dermed',
    meaning: 'thereby, thus (as a direct consequence)',
    example: 'Han bestod ikke prøven og kunne dermed ikke starte på uddannelsen.',
    category: 'connective',
  },
  {
    phrase: 'ikke desto mindre',
    meaning: 'nonetheless',
    example: 'Projektet var dyrt. Ikke desto mindre besluttede de at gennemføre det.',
    category: 'connective',
  },
  {
    phrase: 'til gengæld',
    meaning: 'in return, on the other hand',
    example: 'Jobbet betaler ikke så godt, men til gengæld er arbejdstiderne fleksible.',
    category: 'connective',
  },
  {
    phrase: 'på den ene side / på den anden side',
    meaning: 'on one hand / on the other hand',
    example: 'På den ene side er det godt for miljøet. På den anden side koster det mange penge.',
    category: 'connective',
  },
  {
    phrase: 'med hensyn til',
    meaning: 'with regard to, concerning',
    example: 'Med hensyn til løn er der stor forskel mellem de to jobs.',
    category: 'connective',
  },
  {
    phrase: 'hvad angår',
    meaning: 'as for, regarding',
    example: 'Hvad angår transport, foretrækker de fleste cyklen.',
    category: 'connective',
  },
  {
    phrase: 'i modsætning til',
    meaning: 'in contrast to, unlike',
    example: 'I modsætning til sidste år er salget steget markant.',
    category: 'connective',
  },
  {
    phrase: 'som følge af',
    meaning: 'as a result of',
    example: 'Som følge af det dårlige vejr blev flyet forsinket.',
    category: 'connective',
  },
  {
    phrase: 'i øvrigt',
    meaning: 'by the way, incidentally, moreover',
    example: 'Mødet var produktivt. Det var i øvrigt også rart at se kollegerne igen.',
    category: 'connective',
  },
  {
    phrase: 'under alle omstændigheder',
    meaning: 'in any case, regardless',
    example: 'Vi tager af sted i morgen under alle omstændigheder, uanset vejret.',
    category: 'connective',
  },
  {
    phrase: 'navnlig',
    meaning: 'particularly, especially',
    example: 'Mange, navnlig unge mennesker, bruger sociale medier dagligt.',
    category: 'connective',
  },
  {
    phrase: 'i det hele taget',
    meaning: 'in general, altogether',
    example: 'Jeg kan i det hele taget godt lide at bo i en storby.',
    category: 'connective',
  },
  {
    phrase: 'i forbindelse med',
    meaning: 'in connection with',
    example: 'I forbindelse med flytningen skal vi også skifte adresse officielt.',
    category: 'connective',
  },
  {
    phrase: 'med andre ord',
    meaning: 'in other words',
    example: 'Hun har ikke tid i denne uge — med andre ord må vi vente til næste uge.',
    category: 'connective',
  },
  {
    phrase: 'kort sagt',
    meaning: 'in short, to put it briefly',
    example: 'Kort sagt var ferien en stor succes.',
    category: 'connective',
  },
  {
    phrase: 'alt i alt',
    meaning: 'all in all, overall',
    example: 'Alt i alt var det et godt år for virksomheden.',
    category: 'connective',
  },
  {
    phrase: 'på trods af / til trods for',
    meaning: 'despite, in spite of',
    example: 'På trods af regnen mødte mange op til koncerten.',
    category: 'connective',
  },
  {
    phrase: 'i betragtning af',
    meaning: 'considering, in view of',
    example: 'I betragtning af omstændighederne gik mødet overraskende godt.',
    category: 'connective',
  },
  {
    phrase: 'i forhold til',
    meaning: 'in relation to, compared to',
    example: 'Priserne er steget meget i forhold til sidste år.',
    category: 'connective',
  },
  {
    phrase: 'for så vidt',
    meaning: 'as far as, insofar as',
    example: 'For så vidt jeg ved, starter mødet klokken ti.',
    category: 'connective',
  },
  {
    phrase: 'ganske vist... men',
    meaning: 'admittedly... but',
    example: 'Ganske vist er huset dyrt, men det ligger i et godt kvarter.',
    category: 'connective',
  },
  // ---------------- Idioms ----------------
  {
    phrase: 'at slå to fluer med ét smæk',
    meaning: 'to kill two birds with one stone',
    example: 'Hvis vi cykler på arbejde, slår vi to fluer med ét smæk: motion og transport.',
    category: 'idiom',
  },
  {
    phrase: 'at have is i maven',
    meaning: 'to stay calm, to be patient (lit. "to have ice in the stomach")',
    example: 'Hun havde is i maven under hele eksamen og dumpede ikke en eneste gang.',
    category: 'idiom',
  },
  {
    phrase: 'at tage tyren ved hornene',
    meaning: 'to take the bull by the horns, to tackle a problem head-on',
    example: 'I stedet for at vente besluttede han at tage tyren ved hornene og ringe til chefen med det samme.',
    category: 'idiom',
  },
  {
    phrase: 'at have en finger med i spillet',
    meaning: 'to have a hand in something, to be involved',
    example: 'Mange tror, at kommunen har en finger med i spillet i den nye beslutning.',
    category: 'idiom',
  },
  {
    phrase: 'at tale rent ud af posen',
    meaning: 'to speak frankly, to not mince words',
    example: 'Chefen talte rent ud af posen og fortalte, hvad der skulle ændres.',
    category: 'idiom',
  },
  {
    phrase: 'at være på bølgelængde',
    meaning: 'to be on the same wavelength',
    example: 'De to kolleger er altid på bølgelængde, når det gælder nye idéer.',
    category: 'idiom',
  },
  {
    phrase: 'at stikke en kæp i hjulet',
    meaning: 'to put a spoke in the wheel, to obstruct a plan',
    example: 'Den nye lov stak en kæp i hjulet for virksomhedens planer.',
    category: 'idiom',
  },
  {
    phrase: 'at have mange bolde i luften',
    meaning: 'to have many balls in the air, to juggle many tasks at once',
    example: 'Som projektleder har hun altid mange bolde i luften.',
    category: 'idiom',
  },
  {
    phrase: 'at tage bladet fra munden',
    meaning: "to speak one's mind frankly, to not hold back",
    example: 'Til sidst tog han bladet fra munden og sagde, hvad han virkelig mente.',
    category: 'idiom',
  },
  {
    phrase: 'at gå over gevind',
    meaning: 'to go overboard, to take something too far',
    example: 'Festen var sjov, men nogle gik lidt over gevind med musikken.',
    category: 'idiom',
  },
  {
    phrase: 'at tage det med ophøjet ro',
    meaning: 'to take it calmly, with composure',
    example: 'Selvom toget var forsinket, tog han det med ophøjet ro.',
    category: 'idiom',
  },
  {
    phrase: 'at lægge låg på',
    meaning: 'to suppress, to hush something up',
    example: 'Virksomheden forsøgte at lægge låg på sagen, men pressen fandt ud af det alligevel.',
    category: 'idiom',
  },
  {
    phrase: 'at gøre kål på',
    meaning: 'to put an end to, to finish off',
    example: 'Den nye teknologi gjorde kål på behovet for den gamle metode.',
    category: 'idiom',
  },
  {
    phrase: 'det er lige i skabet',
    meaning: "that's right up my alley, perfectly suited",
    example: 'Et job med rejseaktivitet er lige i skabet for hende.',
    category: 'idiom',
  },
  {
    phrase: 'at ride på en bølge',
    meaning: 'to ride a wave (of success/trend)',
    example: 'Virksomheden rider på en bølge af succes efter den nye reklame.',
    category: 'idiom',
  },
]

export function getPD3Phrase(phrase: string) {
  return pd3Phrases.find((p) => p.phrase === phrase)
}
