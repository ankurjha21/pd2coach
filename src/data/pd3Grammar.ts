// PD3 Grammar Engine: original explanations and quizzes covering B2-level
// Danish grammar points that build on PD2's B1 foundation — passive voice,
// relative clauses, subordinate-clause conjunctions, participles as
// adjectives, and reported speech. Written for this app, not sourced from
// the exam papers.
import type { GrammarTopic } from '../types'

export const pd3GrammarTopics: GrammarTopic[] = [
  {
    id: 'passive-voice',
    title: 'Passiv: s-passiv og blive-passiv',
    summary:
      'Dansk har to måder at danne passiv på: s-passiv (verbum + "-s") og blive-passiv ("blive" + perfektum participium). De bruges lidt forskelligt, og det er et typisk B2-emne at kunne vælge rigtigt mellem dem.',
    points: [
      's-passiv bruges typisk om generelle, gentagne eller upersonlige handlinger, ofte i skriftsprog og regler. Fx: "Døren lukkes kl. 22" (det sker hver dag).',
      'Blive-passiv bruges typisk om en konkret, enkeltstående handling, ofte i talesprog. Fx: "Døren blev lukket af vagten" (det skete én gang).',
      's-passiv dannes ved at lægge "-s" til verbets grundform (uden at droppe evt. "-r" i nutid): "bygger" → "bygges", "spiser" → "spises".',
      'Blive-passiv dannes med "blive" bøjet i den rigtige tid + perfektum participium af hovedverbet: "bliver bygget", "blev bygget", "er blevet bygget".',
      'Modalverber danner oftest passiv med infinitiv + "-s": "Opgaven skal løses i dag" (ikke "skal blive løst", som lyder unaturligt i de fleste sammenhænge).',
      'Man kan også lave passiv med "der" + s-passiv, når der ikke er noget tydeligt subjekt: "Der bliver arbejdet hårdt her" / "Her arbejdes der hårdt".',
    ],
    examples: [
      { da: 'Breve sendes hver dag kl. 12.', note: 's-passiv: en fast, gentagen rutine.' },
      { da: 'Brevet blev sendt i går.', note: 'Blive-passiv: én konkret handling i fortiden.' },
      { da: 'Opgaven skal afleveres senest fredag.', note: 'Modalverbum + s-passiv infinitiv.' },
      { da: 'Huset er blevet renoveret for nylig.', note: 'Blive-passiv i førnutid: "er blevet" + participium.' },
    ],
    quiz: [
      {
        id: 'pv-1',
        prompt: 'Vælg den mest naturlige sætning om en fast regel:',
        options: [
          'Butikken blev åbnet kl. 10 hver dag.',
          'Butikken åbnes kl. 10 hver dag.',
          'Butikken åbner blevet kl. 10 hver dag.',
          'Butikken er åbner kl. 10 hver dag.',
        ],
        answerIndex: 1,
        explanation: 'En fast, gentagen rutine udtrykkes mest naturligt med s-passiv: "åbnes".',
      },
      {
        id: 'pv-2',
        prompt: 'Vælg den korrekte sætning om en enkeltstående hændelse i fortiden:',
        options: [
          'Bilen blev repareret i sidste uge.',
          'Bilen reparedes i sidste uge.',
          'Bilen er reparere i sidste uge.',
          'Bilen bliver reparere i sidste uge.',
        ],
        answerIndex: 0,
        explanation: 'En konkret, enkeltstående hændelse i datid passer bedst med blive-passiv: "blev repareret".',
      },
      {
        id: 'pv-3',
        prompt: 'Vælg den korrekte passiv med modalverbum:',
        options: [
          'Regningen skal blive betalt i dag.',
          'Regningen skal betales i dag.',
          'Regningen skal betalt i dag.',
          'Regningen skal være betales i dag.',
        ],
        answerIndex: 1,
        explanation: 'Modalverber danner normalt passiv med infinitiv + "-s": "skal betales".',
      },
    ],
  },
  {
    id: 'relative-clauses',
    title: 'Relativsætninger: som, der, hvis, hvilket',
    summary:
      'Relativsætninger binder to informationer sammen om det samme substantiv (eller hele sætningen). At vælge mellem "som", "der", "hvis" og "hvilket" korrekt er et klassisk B2-niveau.',
    points: [
      '"Der" bruges kun, når relativpronomenet er subjekt i relativsætningen: "Manden, der bor ved siden af mig, er lærer."',
      '"Som" kan altid bruges i stedet for "der" (og er obligatorisk, når relativpronomenet IKKE er subjekt): "Manden, som jeg talte med, er lærer."',
      '"Hvis" svarer til ejefald ("hvis hund", "hvis bil") og bruges om ejerskab/tilhørsforhold: "Pigen, hvis cykel blev stjålet, er ked af det."',
      '"Hvilket" henviser til HELE den foregående sætning (ikke kun ét ord): "Han kom for sent igen, hvilket irriterede hende."',
      'Relativpronomenet kan udelades, når det ikke er subjekt, og det ofte gøres i talesprog: "Manden(, som) jeg talte med, er lærer."',
    ],
    examples: [
      { da: 'Bogen, der ligger på bordet, er min.', note: '"der" er subjekt i relativsætningen (bogen ligger).' },
      { da: 'Bogen, som jeg læste i går, var spændende.', note: '"som" fordi relativpronomenet er objekt (jeg læste bogen).' },
      { da: 'Min kollega, hvis datter studerer i udlandet, savner hende meget.', note: '"hvis" udtrykker ejerskab (hendes datter).' },
      { da: 'Vi skulle vente en time, hvilket ingen havde regnet med.', note: '"hvilket" henviser til hele forholdet "at vente en time".' },
    ],
    quiz: [
      {
        id: 'rc-1',
        prompt: 'Vælg det korrekte relativpronomen: "Kvinden, ___ arbejder i banken, er min nabo."',
        options: ['som', 'der', 'hvis', 'hvilket'],
        answerIndex: 1,
        explanation: 'Kvinden er subjekt i relativsætningen ("kvinden arbejder") → "der".',
      },
      {
        id: 'rc-2',
        prompt: 'Vælg det korrekte relativpronomen: "Filmen, ___ vi så i går, var kedelig."',
        options: ['der', 'hvis', 'som', 'hvilket'],
        answerIndex: 2,
        explanation: 'Her er relativpronomenet objekt ("vi så filmen"), så det skal være "som" (ikke "der").',
      },
      {
        id: 'rc-3',
        prompt: 'Vælg det korrekte relativpronomen: "Han glemte sin fødselsdag, ___ gjorde hans kone ked af det."',
        options: ['som', 'der', 'hvis', 'hvilket'],
        answerIndex: 3,
        explanation: '"Hvilket" henviser til hele den foregående sætning (at han glemte sin fødselsdag), ikke kun ét ord.',
      },
    ],
  },
  {
    id: 'subordinate-conjunctions',
    title: 'Ledsætninger: konjunktioner og ordstilling',
    summary:
      'Ledsætninger (bisætninger) indledes af konjunktioner som "fordi", "selvom", "hvis", "da/når", "mens" og "inden". Reglerne for ordstilling i og efter ledsætninger er et vigtigt B2-emne, da fejl her ofte lyder meget "forkerte" på dansk.',
    points: [
      'Hvis en ledsætning står FØRST i en helsætning, fungerer den som forfelt, og hovedsætningen får omvendt ordstilling (verbum før subjekt): "Selvom det regnede, gik vi en tur."',
      '"Da" bruges om en enkeltstående begivenhed i fortiden: "Da jeg kom hjem, sov hun allerede." "Når" bruges om gentagne/fremtidige begivenheder: "Når jeg kommer hjem, spiser vi altid sammen."',
      '"Selvom" udtrykker en indrømmelse/modsætning: "Selvom han var træt, blev han ved med at arbejde."',
      '"Mens" udtrykker samtidighed: "Mens jeg lavede mad, læste han avisen."',
      'I ledsætninger står "ikke" og andre bisætningsadverbier FØR det bøjede verbum (modsat i helsætninger): "...fordi han ikke kom til tiden."',
    ],
    examples: [
      { da: 'Selvom jeg var syg, tog jeg på arbejde.', note: 'Ledsætning først → omvendt ordstilling i hovedsætningen: tog + jeg.' },
      { da: 'Da hun ringede, var jeg ikke hjemme.', note: '"Da" om en konkret, enkeltstående situation i fortiden.' },
      { da: 'Han siger, at han ikke har tid i dag.', note: '"Ikke" placeret før verbet "har" i ledsætningen.' },
      { da: 'Vi spiser altid is, når det er varmt.', note: '"Når" om noget der gentages/sker hver gang.' },
    ],
    quiz: [
      {
        id: 'sc-1',
        prompt: 'Vælg den korrekte sætning:',
        options: [
          'Selvom det var sent, han blev ved med at arbejde.',
          'Selvom det var sent, blev han ved med at arbejde.',
          'Selvom var det sent, blev han ved med at arbejde.',
          'Selvom det var sent han blev ved med at arbejde.',
        ],
        answerIndex: 1,
        explanation: 'Ledsætningen "Selvom det var sent" kræver omvendt ordstilling i hovedsætningen: blev + han.',
      },
      {
        id: 'sc-2',
        prompt: 'Vælg det rigtige ord: "___ jeg var barn, boede vi i Odense." (én bestemt periode i fortiden)',
        options: ['Når', 'Da', 'Mens', 'Hvis'],
        answerIndex: 1,
        explanation: '"Da" bruges om en afgrænset periode/begivenhed i fortiden, ikke "når" (som er for gentagelser).',
      },
      {
        id: 'sc-3',
        prompt: 'Vælg den korrekte sætning:',
        options: [
          'Hun sagde, at hun ikke kunne komme.',
          'Hun sagde, at hun kunne ikke komme.',
          'Hun sagde at ikke hun kunne komme.',
          'Hun sagde, at kunne hun ikke komme.',
        ],
        answerIndex: 0,
        explanation: 'I ledsætningen skal "ikke" stå før det bøjede verbum "kunne".',
      },
    ],
  },
  {
    id: 'participles-as-adjectives',
    title: 'Participier som adjektiver (nutids- og datidsparticipium)',
    summary:
      'Participier kan bruges som adjektiver til at beskrive substantiver — fx "en kogende gryde" (nutidsparticipium) vs. "en kogt kartoffel" (datidsparticipium). At vælge den rigtige form er et typisk B2-emne.',
    points: [
      'Nutidsparticipium (verbum + "-ende") beskriver noget, der UDFØRER handlingen eller er i gang: "en sovende baby", "et interessant foredrag" (noget der interesserer).',
      'Datidsparticipium (verbets perfektum participium, ofte "-t"/"-et") beskriver noget, der er UDSAT FOR handlingen (passivt): "en kogt kartoffel", "et interesseret publikum" (nogen der er interesseret).',
      'Mange par kan forveksles, fordi de ligner hinanden: "overraskende" (det overrasker) vs. "overrasket" (nogen er overrasket); "forvirrende" vs. "forvirret"; "irriterende" vs. "irriteret".',
      'Participier som adjektiver bøjes som almindelige adjektiver (n-, t- og e-form), fx "en kogt kartoffel" / "et kogt æg" / "kogte kartofler".',
    ],
    examples: [
      { da: 'Filmen var meget spændende.', note: 'Nutidsparticipium: filmen UDFØRER handlingen (den spænder os).' },
      { da: 'Jeg var meget spændt på resultatet.', note: 'Datidsparticipium: jeg er UDSAT for følelsen (nogen/noget spænder mig).' },
      { da: 'Det var en overraskende nyhed.', note: 'Nyheden overrasker (aktiv betydning).' },
      { da: 'Vi var overraskede over nyheden.', note: 'Vi blev overrasket (passiv betydning), bøjet i flertal: "overraskede".' },
    ],
    quiz: [
      {
        id: 'pa-1',
        prompt: 'Vælg den korrekte form: "Mødet var meget ___." (mødet kedede os)',
        options: ['kedet', 'kedelig', 'kedende', 'keder'],
        answerIndex: 2,
        explanation: 'Mødet UDFØRER handlingen (det keder os) → nutidsparticipium: "kedende". ("Kedelig" findes også som almindeligt adjektiv, men her øves formen -ende vs. -et.)',
      },
      {
        id: 'pa-2',
        prompt: 'Vælg den korrekte form: "Jeg blev meget ___ over beslutningen." (nogen gjorde mig forvirret)',
        options: ['forvirrende', 'forvirret', 'forvirre', 'forvirres'],
        answerIndex: 1,
        explanation: 'Her er personen UDSAT for forvirringen (passiv betydning) → datidsparticipium: "forvirret".',
      },
      {
        id: 'pa-3',
        prompt: 'Vælg den korrekte form: "Det var en ___ oplevelse." (oplevelsen chokerede os)',
        options: ['chokeret', 'chokerende', 'chokeres', 'chok'],
        answerIndex: 1,
        explanation: 'Oplevelsen UDFØRER chokket (aktiv betydning) → nutidsparticipium: "chokerende".',
      },
    ],
  },
  {
    id: 'reported-speech',
    title: 'Indirekte tale (referat af det, andre har sagt)',
    summary:
      'Når man gengiver, hvad andre har sagt eller tænkt (indirekte tale), ændres ordstillingen, og nogle gange også tempus og pronominer. Dette bruges meget i Delprøve 1 til Mundtlig kommunikation og i referater.',
    points: [
      'Direkte tale: "Jeg kommer i morgen," sagde han. → Indirekte tale: Han sagde, at han kom (den) næste dag.',
      'I indirekte tale bliver direkte tale til en ledsætning (ofte indledt af "at"), og ordstillingen følger ledsætningsreglerne: bisætningsadverbier (fx "ikke") flyttes før verbet.',
      'Pronominer ændres, så de passer til den nye synsvinkel: "jeg" → "han/hun", "min" → "hans/hendes".',
      'Tidsudtryk ændres ofte: "i dag" → "den dag", "i morgen" → "næste dag/dagen efter", "i går" → "dagen før".',
      'Spørgsmål i indirekte tale indledes af "om" (ja/nej-spørgsmål) eller af spørgeordet selv ("hvorfor", "hvornår"), og ordstillingen bliver som i en almindelig ledsætning (ikke omvendt): "Hun spurgte, om han ville komme." / "Hun spurgte, hvorfor han ikke var kommet."',
    ],
    examples: [
      { da: '"Jeg er træt," sagde Peter. → Peter sagde, at han var træt.', note: 'Direkte tale bliver til en ledsætning med "at".' },
      { da: '"Kommer du i morgen?" spurgte hun. → Hun spurgte, om jeg kom (den) næste dag.', note: 'Ja/nej-spørgsmål indledes af "om" i indirekte tale.' },
      { da: '"Hvorfor er du sen?" spurgte læreren. → Læreren spurgte, hvorfor jeg var sen.', note: 'Spørgeordet bevares, men ordstillingen er som en ledsætning (ikke omvendt).' },
    ],
    quiz: [
      {
        id: 'rs-1',
        prompt: 'Omsæt til indirekte tale: "Jeg har ikke tid," sagde hun. → Hun sagde, ___',
        options: [
          'at hun havde ikke tid.',
          'at hun ikke havde tid.',
          'at ikke hun havde tid.',
          'at havde hun ikke tid.',
        ],
        answerIndex: 1,
        explanation: 'I ledsætningen skal "ikke" stå før det bøjede verbum: "at hun ikke havde tid".',
      },
      {
        id: 'rs-2',
        prompt: 'Omsæt til indirekte tale: "Vil du have kaffe?" spurgte han. → Han spurgte, ___',
        options: [
          'vil jeg have kaffe.',
          'om jeg ville have kaffe.',
          'at jeg ville have kaffe.',
          'ville jeg have kaffe.',
        ],
        answerIndex: 1,
        explanation: 'Ja/nej-spørgsmål bliver til en ledsætning indledt af "om", med almindelig (ikke omvendt) ledsætnings-ordstilling.',
      },
      {
        id: 'rs-3',
        prompt: 'Omsæt til indirekte tale: "Hvornår kommer toget?" spurgte hun. → Hun spurgte, ___',
        options: [
          'hvornår kom toget.',
          'hvornår kommer toget.',
          'hvornår toget kom.',
          'om hvornår toget kom.',
        ],
        answerIndex: 2,
        explanation: 'Spørgeordet "hvornår" bevares, men ordstillingen følger en almindelig ledsætning: subjekt (toget) før verbum (kom).',
      },
    ],
  },
]

export function getPD3GrammarTopic(id: string) {
  return pd3GrammarTopics.find((t) => t.id === id)
}
