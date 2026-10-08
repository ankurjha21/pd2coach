// Grammar Engine: original explanations and quizzes covering the core B1
// Danish grammar points most relevant to PD2 (word order, articles/adjective
// agreement, verb tenses, modal verbs, pronouns, prepositions). Written for
// this app — not sourced from the exam papers.
import type { GrammarTopic } from '../types'

export const grammarTopics: GrammarTopic[] = [
  {
    id: 'word-order-v2',
    title: 'Ordstilling: Ligefrem og omvendt ordstilling (V2-reglen)',
    summary:
      'I danske helsætninger (hovedsætninger) står det bøjede verbum altid på andenpladsen (V2). Hvis sætningen ikke starter med subjektet, skal subjekt og verbum derfor "bytte plads" (omvendt ordstilling / inversion).',
    points: [
      'Ligefrem ordstilling: Subjekt – verbum – resten. Fx: "Jeg går i skole hver dag."',
      'Omvendt ordstilling: Hvis noget andet end subjektet starter sætningen (tid, sted, forbindelsesord), bytter subjekt og verbum plads. Fx: "I dag går jeg i skole."',
      'Dette gælder også efter "og" og "men", og efter ledsætninger der indleder hovedsætningen.',
      'I ledsætninger (bisætninger, fx efter "fordi", "at", "når") bliver ordstillingen ikke byttet om, men ikke-styrende biord (fx "ikke") flyttes før det bøjede verbum.',
    ],
    examples: [
      { da: 'Jeg bor i København.', note: 'Ligefrem ordstilling: subjekt (Jeg) + verbum (bor).' },
      { da: 'I København bor jeg.', note: 'Omvendt ordstilling: stedet står først, så subjekt og verbum bytter plads.' },
      { da: 'I morgen skal jeg arbejde.', note: 'Tidsudtryk ("I morgen") først → inversion: skal + jeg.' },
      { da: 'Han siger, at han ikke kommer.', note: 'I ledsætningen ("at han ikke kommer") står "ikke" før verbet "kommer".' },
    ],
    quiz: [
      {
        id: 'wo-1',
        prompt: 'Vælg den korrekte sætning:',
        options: ['I går jeg arbejdede.', 'I går arbejdede jeg.', 'I går jeg arbejde.', 'Jeg i går arbejdede.'],
        answerIndex: 1,
        explanation: '"I går" (tid) starter sætningen, så verbum og subjekt bytter plads: arbejdede + jeg.',
      },
      {
        id: 'wo-2',
        prompt: 'Vælg den korrekte sætning:',
        options: [
          'Min søster siger, at hun ikke kan komme i aften.',
          'Min søster siger, at hun kan ikke komme i aften.',
          'Min søster siger at ikke hun kan komme i aften.',
          'Min søster siger, at ikke kan hun komme i aften.',
        ],
        answerIndex: 0,
        explanation: 'I ledsætningen skal "ikke" stå før det bøjede verbum "kan": "...at hun ikke kan komme...".',
      },
      {
        id: 'wo-3',
        prompt: 'Vælg den korrekte sætning:',
        options: [
          'Fordi det regner, vi bliver hjemme.',
          'Fordi det regner, bliver vi hjemme.',
          'Fordi regner det, bliver vi hjemme.',
          'Fordi det regner vi bliver hjemme.',
        ],
        answerIndex: 1,
        explanation: 'Ledsætningen "Fordi det regner" fungerer som forfelt, så hovedsætningen får omvendt ordstilling: bliver + vi.',
      },
    ],
  },
  {
    id: 'articles-adjectives',
    title: 'Substantiver, artikler og adjektiv-bøjning',
    summary:
      'Danske substantiver har to køn (fælleskøn "en" og intetkøn "et") og bøjes i ubestemt/bestemt form og ental/flertal. Adjektiver bøjes efter substantivets køn, tal og bestemthed.',
    points: [
      'Ubestemt ental: en bil / et hus. Bestemt ental (efterhængt artikel): bilen / huset.',
      'Ubestemt flertal: biler / huse. Bestemt flertal: bilerne / husene.',
      'Adjektiv i ubestemt ental, fælleskøn: "en stor bil". Intetkøn får -t: "et stort hus".',
      'Adjektiv i flertal og i bestemt form (uanset køn) får -e: "de store biler", "det store hus" → "det store hus" (ental bestemt bruger også -e-form!).',
      'Bestemt form adjektiv kræver normalt en foranstillet bestemmer: "den/det/de" + adjektiv-e + substantiv-bestemt: "den store bil", "det store hus", "de store biler/huse".',
    ],
    examples: [
      { da: 'en lille lejlighed → den lille lejlighed → lejligheden er lille', note: 'Ubestemt → bestemt med foranstillet "den" → prædikativ (efter "er") bruger n-form.' },
      { da: 'et stort hus → det store hus → huset er stort', note: 'Intetkøn: "stort" i ubestemt, men "store" (e-form) når det står bestemt foran substantivet.' },
      { da: 'to gode venner', note: 'Flertal adjektiv altid e-form: "gode", ikke "god" eller "godt".' },
    ],
    quiz: [
      {
        id: 'aa-1',
        prompt: 'Vælg den korrekte form: "Jeg har ___ hus på landet." (stor)',
        options: ['en stor', 'et stort', 'et store', 'den store'],
        answerIndex: 1,
        explanation: '"Hus" er intetkøn (et hus), og i ubestemt form får adjektivet -t: "et stort hus".',
      },
      {
        id: 'aa-2',
        prompt: 'Vælg den korrekte form: "___ bil, jeg købte, var meget billig." (gammel)',
        options: ['En gammel', 'Den gamle', 'Det gamle', 'Gammel'],
        answerIndex: 1,
        explanation: 'Bestemt form med foranstillet "den" (fælleskøn) kræver adjektivets e-form: "Den gamle bil".',
      },
      {
        id: 'aa-3',
        prompt: 'Vælg den korrekte form: "Vi har to ___ børn." (dygtig)',
        options: ['dygtig', 'dygtigt', 'dygtige', 'den dygtige'],
        answerIndex: 2,
        explanation: 'I flertal får adjektivet altid e-form: "dygtige børn".',
      },
      {
        id: 'aa-4',
        prompt: 'Vælg den korrekte sætning:',
        options: ['Lejligheden er lille.', 'Lejligheden er lillet.', 'Lejligheden er den lille.', 'Lejligheden er lille lejlighed.'],
        answerIndex: 0,
        explanation: 'Som prædikativ (efter "er") bruges adjektivets grundform/n-form, der stemmer med substantivets køn: "Lejligheden (en-ord) er lille".',
      },
    ],
  },
  {
    id: 'perfect-tense',
    title: 'Datid og førnutid (har/er + perfektum participium)',
    summary:
      'PD2-teksterne bruger ofte datid (fortalte handlinger: "jeg arbejdede") og førnutid (handling med relevans for nu: "jeg har arbejdet"). De fleste verber danner førnutid med "har", men bevægelses- og tilstandsskifte-verber bruger "er".',
    points: [
      'Datid (præteritum): bruges om en afsluttet handling på et bestemt tidspunkt i fortiden. Fx: "Jeg boede i Odense i 2015."',
      'Førnutid (perfektum): "har/er" + kort tillægsform. Bruges, når tidspunktet ikke er vigtigt, eller handlingen har betydning for nutiden. Fx: "Jeg har boet i Danmark i 10 år" (og bor her stadig).',
      'De fleste verber bruger "har": har spist, har set, har læst.',
      'Verber om bevægelse/forandring af tilstand bruger ofte "er": er rejst, er kommet, er blevet, er vågnet, er begyndt.',
      'Før-datid (pluskvamperfektum): "havde/var" + kort tillægsform — bruges om noget, der var sket før et andet tidspunkt i fortiden.',
    ],
    examples: [
      { da: 'I går spiste jeg på en restaurant.', note: 'Datid: konkret, afsluttet tidspunkt ("i går").' },
      { da: 'Jeg har boet i Danmark i 5 år.', note: 'Førnutid: varighed frem til nu, stadig relevant.' },
      { da: 'Hun er flyttet til København.', note: 'Bevægelsesverbum "flytte" → førnutid med "er", ikke "har".' },
      { da: 'Da jeg kom hjem, havde han allerede lavet mad.', note: 'Pluskvamperfektum: "havde lavet" skete før "kom" (et andet fortidspunkt).' },
    ],
    quiz: [
      {
        id: 'pt-1',
        prompt: 'Vælg den korrekte sætning:',
        options: ['Jeg har boet her siden 2018.', 'Jeg boede her siden 2018.', 'Jeg har bo her siden 2018.', 'Jeg bor her siden 2018.'],
        answerIndex: 0,
        explanation: '"Siden 2018" angiver en varighed frem til nu → førnutid: "har boet".',
      },
      {
        id: 'pt-2',
        prompt: 'Vælg den korrekte sætning:',
        options: ['Hun har rejst til Spanien i sidste uge.', 'Hun er rejst til Spanien i sidste uge.', 'Hun rejste er til Spanien i sidste uge.', 'Hun har rejse til Spanien i sidste uge.'],
        answerIndex: 1,
        explanation: '"Rejse" er et bevægelsesverbum, så førnutid dannes med "er": "er rejst". (Selvom "i sidste uge" normalt trækker mod datid "rejste", er "er rejst" også muligt og korrekt grammatisk dannet her — fokus i denne øvelse er hjælpeverbet er/har.)',
      },
      {
        id: 'pt-3',
        prompt: 'Vælg den korrekte sætning:',
        options: [
          'Da jeg ankom, havde festen allerede sluttet.',
          'Da jeg ankom, har festen allerede sluttet.',
          'Da jeg ankom, festen havde allerede sluttet.',
          'Da jeg ankom, sluttede festen havde allerede.',
        ],
        answerIndex: 0,
        explanation: 'Noget der var afsluttet før et andet fortidspunkt ("da jeg ankom") udtrykkes med pluskvamperfektum: "havde sluttet".',
      },
    ],
  },
  {
    id: 'modal-verbs',
    title: 'Modalverber + infinitiv',
    summary:
      'Modalverber (kan, skal, vil, må, bør) følges af et andet verbum i navneform (infinitiv) UDEN "at": "Jeg kan tale dansk", ikke "Jeg kan at tale dansk".',
    points: [
      'kan = evne/mulighed. skal = pligt/plan. vil = ønske/fremtid. må = tilladelse/nødvendighed. bør = anbefaling.',
      'Modalverbum + infinitiv uden "at": "Jeg skal arbejde i morgen."',
      'I negation står "ikke" mellem modalverbum og infinitiv: "Jeg kan ikke komme."',
      'I spørgsmål bytter modalverbum og subjekt plads: "Kan du komme?"',
    ],
    examples: [
      { da: 'Jeg vil gerne lære mere dansk.', note: 'vil + infinitiv (lære) uden "at".' },
      { da: 'Du må ikke ryge her.', note: 'må ikke = forbud.' },
      { da: 'Skal du arbejde i weekenden?', note: 'Spørgsmål: modalverbum først.' },
    ],
    quiz: [
      {
        id: 'mv-1',
        prompt: 'Vælg den korrekte sætning:',
        options: ['Jeg kan at svømme.', 'Jeg kan svømme.', 'Jeg kan svømmer.', 'Jeg kan til at svømme.'],
        answerIndex: 1,
        explanation: 'Modalverbum + infinitiv uden "at": "kan svømme".',
      },
      {
        id: 'mv-2',
        prompt: 'Vælg den korrekte sætning (negation):',
        options: ['Jeg ikke kan komme i morgen.', 'Jeg kan ikke komme i morgen.', 'Jeg kan komme ikke i morgen.', 'Ikke jeg kan komme i morgen.'],
        answerIndex: 1,
        explanation: '"Ikke" placeres mellem det bøjede modalverbum (kan) og infinitiven (komme).',
      },
    ],
  },
  {
    id: 'prepositions',
    title: 'Vigtige præpositioner (i, på, til, af, for, med)',
    summary:
      'Danske præpositioner følger ofte faste udtryk, der skal læres udenad, fordi de ikke altid oversættes direkte fra andre sprog.',
    points: [
      '"i" bruges om indesluttede steder og tidsrum: i København, i to år, i dag.',
      '"på" bruges om overflader, institutioner, øer, og visse faste udtryk: på bordet, på arbejde, på Sjælland, på besøg.',
      '"til" bruges om retning/bestemmelse: til Danmark, til fest, til stede.',
      '"af" bruges bl.a. i passiv-konstruktioner og om ophav: lavet af træ, elsket af alle.',
      '"med" bruges om ledsagelse/middel: med toget, med min familie.',
    ],
    examples: [
      { da: 'Jeg bor på Nørrebro, i København.', note: '"på" + bydel, "i" + by.' },
      { da: 'Hun tager til Danmark til sommer.', note: '"til" for både rejsemål og tidspunkt.' },
      { da: 'Bordet er lavet af træ.', note: '"af" angiver materiale/ophav.' },
    ],
    quiz: [
      {
        id: 'prep-1',
        prompt: 'Vælg den korrekte præposition: "Jeg arbejder ___ et hospital."',
        options: ['i', 'på', 'til', 'af'],
        answerIndex: 1,
        explanation: 'Fast udtryk: "på et hospital/på arbejde" (institution).',
      },
      {
        id: 'prep-2',
        prompt: 'Vælg den korrekte præposition: "Vi skal rejse ___ Jylland ___ sommer."',
        options: ['til … til', 'i … på', 'på … i', 'til … i'],
        answerIndex: 0,
        explanation: '"Til Jylland" (rejsemål) og "til sommer" (kommende tidspunkt).',
      },
    ],
  },
]

export function getGrammarTopic(id: string) {
  return grammarTopics.find((t) => t.id === id)
}
