// Writing (Skriftlig fremstilling) content sourced from official PD2 past
// exams (prompts 2012-2023) and real anonymized student model answers with
// their examiner grades, adapted from study materials in /source-papers.
import type { WritingGenreInfo, WritingModelAnswer, WritingPrompt } from '../types'

export const writingGenres: WritingGenreInfo[] = [
  {
    key: 'opslag',
    label: 'Et opslag',
    description:
      'En kort offentlig besked, hvor du søger eller tilbyder noget (fx et medlem til en klub, en lejlighed, en rejsemakker).',
    openingPhrases: ['(Overskrift, fx) Brugt cykel købes!', 'Hej!', 'Nye medlemmer søges!'],
    closingPhrases: [
      'Er du interesseret? Så kontakt venligst [navn] på [tlf./e-mail].',
      'Hvis du kan hjælpe mig, så kontakt venligst [navn] på [tlf./e-mail].',
      'Jeg håber at høre fra jer. God dag!',
      'På forhånd mange tak.',
    ],
    usefulPhrases: [
      'Jeg leder efter/søger…',
      'Vi mødes hver [ugedag] kl. …',
      'Er du interesseret i at deltage/melde dig ind?',
    ],
    structureTips: [
      'Brug en kort, fængende overskrift.',
      'Svar på alle punkterne i opgaven (hvem, hvad, hvornår, hvor, hvordan man kontakter dig).',
      'Afslut altid med en tydelig "sådan kontakter du mig"-sætning.',
    ],
  },
  {
    key: 'invitation',
    label: 'En invitation',
    description: 'Du inviterer nogen (venner, kolleger, familie) til en begivenhed.',
    openingPhrases: ['Kære venner', 'Kære kolleger', 'Kære [navn]'],
    closingPhrases: [
      'S.U. på telefon/mail senest den [dato].',
      'Jeg håber, at I alle vil komme, og at vi vil nyde dagen sammen.',
      'Med venlig hilsen / Kh, [dit navn]',
    ],
    usefulPhrases: [
      'Jeg vil gerne invitere jer til …',
      'Vi mødes (sted) (dato) kl. (tid).',
      'Medbring: …',
      'Hvis I har spørgsmål, kan I ringe til mig eller sende mig en e-mail.',
    ],
    structureTips: [
      'Fortæl hvorfor du holder festen/arrangementet.',
      'Angiv tid og sted tydeligt (dato + klokkeslæt + adresse).',
      'Beskriv lidt om programmet (mad, aktiviteter).',
      'Bed om tilmelding (S.U.) med en frist.',
    ],
  },
  {
    key: 'jobansoegning',
    label: 'En jobansøgning',
    description: 'Du søger et konkret job, du har set annonceret.',
    openingPhrases: [
      '(Overskrift, fx) Erfaren [stilling] søger job hos [firma]',
      'Jeg har med stor interesse læst jeres jobopslag, og jeg vil hermed gerne søge stillingen som …',
    ],
    closingPhrases: [
      'Jeg håber at komme i betragtning til stillingen, og jeg ser frem til at høre fra jer.',
      'Jeg kan kontaktes på (tlf./mail).',
      'Med venlig hilsen, (dit fulde navn)',
    ],
    usefulPhrases: [
      'Jeg er uddannet … og har gode færdigheder inden for …',
      'Jeg har erfaring med at arbejde i Danmark. Jeg har arbejdet som … i … år.',
      'Jeg er ansvarlig, stabil, hårdtarbejdende og god til at arbejde sammen med mennesker.',
      'Det vil glæde mig at komme til en samtale, hvor jeg kan fortælle mere om mig selv.',
    ],
    structureTips: [
      'Overskrift der nævner stillingen.',
      'Fortæl lidt om dig selv og din baggrund (uddannelse/erfaring).',
      'Forklar hvorfor netop du passer til jobbet.',
      'Afslut professionelt med kontaktoplysninger.',
    ],
  },
  {
    key: 'klage',
    label: 'En klage',
    description: 'Du klager formelt over en vare, service eller oplevelse til en virksomhed/forening.',
    openingPhrases: [
      'Modtager: (navn på firma)\n(adresse)',
      'Vedr. klage over …',
      'Til rette vedkommende',
    ],
    closingPhrases: [
      'Jeg vil bede jer om at …',
      'Jeg ser frem til at høre fra jer snarest muligt.',
      'Jeg kan kontaktes på (tlf./e-mail).',
      'Mvh, (dit fulde navn)',
    ],
    usefulPhrases: [
      'Jeg skriver til jer for at klage over …',
      'For det første … For det andet …',
      'Jeg forventer, at I …',
      'Jeg vil også gerne bede jer om at …',
    ],
    structureTips: [
      'Angiv modtager og emne (Vedr.) øverst — det er en formel brevgenre.',
      'Forklar hvad der skete, og hvornår.',
      'Forklar tydeligt, hvorfor det er et problem.',
      'Sig konkret, hvad du forventer, at modtageren gør (handling/kompensation).',
    ],
  },
  {
    key: 'takkebrev',
    label: 'Et takkebrev',
    description: 'Du takker nogen (fx kolleger efter en praktik, en kollega der går på pension).',
    openingPhrases: ['Kære kolleger', 'Kære [navn]'],
    closingPhrases: [
      'Jeg glæder mig til at se jer igen.',
      'De bedste hilsner / Kh, (dit navn)',
    ],
    usefulPhrases: [
      'Tusinde tak for den gode tid …',
      'Jeg har lært meget af/i …',
      'Jeg vil savne …',
      'Nu skal jeg …',
    ],
    structureTips: [
      'Tak for noget konkret.',
      'Fortæl, hvad du har lært/fået ud af det.',
      'Fortæl, hvad du vil savne.',
      'Fortæl, hvad der skal ske nu (fremtid), og evt. foreslå at ses igen.',
    ],
  },
  {
    key: 'anbefaling',
    label: 'En anbefaling',
    description: 'Du anbefaler noget (en restaurant, film, aktivitet, sted) til andre, ofte i et kursistblad.',
    openingPhrases: ['(Overskrift der nævner, hvad du anbefaler)'],
    closingPhrases: ['Jeg kan varmt anbefale … til alle, der …', 'Prøv det selv — det fortryder du ikke!'],
    usefulPhrases: [
      'Jeg vil gerne anbefale … til …',
      'Det, jeg bedst kan lide ved …, er …',
      'Hvis du er til …, så er dette noget for dig.',
    ],
    structureTips: [
      'Sig hvad/hvem du anbefaler, og hvor/hvordan man finder det.',
      'Beskriv din egen oplevelse konkret.',
      'Forklar hvorfor andre også vil kunne lide det.',
      'Afslut med en tydelig anbefaling.',
    ],
  },
  {
    key: 'laeserbrev',
    label: 'Et læserbrev',
    description: 'Et personligt indlæg til et blad (fx skolens kursistblad) om en erfaring eller holdning.',
    openingPhrases: ['(Overskrift der fanger emnet)'],
    closingPhrases: ['Jeg håber, at flere vil …', 'Tak fordi I læste med.'],
    usefulPhrases: ['Jeg vil gerne fortælle om …', 'Det er vigtigt for mig, fordi …'],
    structureTips: [
      'Introducér dig selv/emnet kort.',
      'Fortæl om din erfaring eller holdning med konkrete eksempler.',
      'Forklar hvorfor det betyder noget (for dig eller for andre).',
      'Afslut med en konklusion eller opfordring.',
    ],
  },
  {
    key: 'efterlysning',
    label: 'En efterlysning',
    description: 'Du søger en person eller ting (fx en bils ejer efter en parkeringsskade), ofte i en lokalavis.',
    openingPhrases: ['(Overskrift der beskriver, hvad/hvem du søger)'],
    closingPhrases: ['Hvis du ved noget, så kontakt mig endelig på (tlf./e-mail).'],
    usefulPhrases: ['Jeg efterlyser …', 'Det skete den … kl. …', 'Jeg vil gerne i kontakt med …, fordi …'],
    structureTips: [
      'Fortæl hvad der skete, og hvornår/hvor.',
      'Beskriv det, du leder efter, så konkret som muligt.',
      'Forklar hvorfor du gerne vil i kontakt.',
      'Giv dine kontaktoplysninger.',
    ],
  },
  {
    key: 'email',
    label: 'En e-mail (svar til en ven)',
    description:
      'Delprøve 2: et uformelt svar på en e-mail fra en ven, der har spurgt ind til noget i dit liv. Minimum 100 ord.',
    openingPhrases: ['Kære [navn]', 'Hej [navn]'],
    closingPhrases: [
      'Skriv eller ring snart tilbage.',
      'Hav det nu rigtig godt, indtil vi ses.',
      'Kh / Vh / Kærlig hilsen, (dit fornavn)',
    ],
    usefulPhrases: [
      'Mange tak for din mail. Det er dejligt at høre fra dig.',
      'Undskyld, at jeg skriver så sent/først nu.',
      'Jeg håber, at du/I har det godt.',
      'Ja, det er rigtigt, at …',
    ],
    structureTips: [
      'Tak afsenderen for mailen, og undskyld evt. for sent svar (uformel tone — du kan sige "du", bruge sammentrækninger).',
      'Besvar det, vennen spurgte om, med konkrete detaljer.',
      'Stil evt. et modspørgsmål eller foreslå at ses.',
      'Afslut varmt og uformelt — husk minimumskravet på 100 ord.',
    ],
  },
]

export const writingPrompts: WritingPrompt[] = [
  // --- Opslag ---
  {
    id: 'opslag-2012-nov',
    genre: 'opslag',
    exam: { year: 2012, season: 'Sommer', label: 'Maj 2012' },
    situation: 'Du vil arrangere en tur ud i naturen for beboerne i den opgang, hvor du bor.',
    bullets: [
      'hvor I skal hen og hvornår',
      'hvad der skal ske på turen',
      'hvad slags tøj I skal have på, og hvad I skal have med',
      'hvordan man kan tilmelde sig til turen',
    ],
  },
  {
    id: 'opslag-2013-may',
    genre: 'opslag',
    exam: { year: 2013, season: 'Sommer', label: 'Maj 2013' },
    situation: 'Du spiller guitar. Du vil gerne finde nogen at spille musik sammen med i en gruppe.',
    bullets: [
      'lidt om dig selv og din interesse for musik',
      'hvorfor du gerne vil finde nogen at spille sammen med',
      'hvor, hvornår og hvordan gruppen kan øve',
      'hvordan du kan kontaktes',
    ],
  },
  {
    id: 'opslag-2013-nov',
    genre: 'opslag',
    exam: { year: 2013, season: 'Vinter', label: 'November 2013' },
    situation: 'Du vil flytte. Du søger en ny lejlighed.',
    bullets: [
      'lidt om dig selv',
      'hvorfor du har brug for en ny lejlighed',
      'hvad slags lejlighed du gerne vil have, og hvor den skal ligge',
      'hvordan du kan kontaktes',
    ],
  },
  {
    id: 'opslag-2015-may',
    genre: 'opslag',
    exam: { year: 2015, season: 'Sommer', label: 'Maj 2015' },
    situation: 'Du vil lave en klub for kursister på din sprogskole, hvor I skal lave mad til hinanden.',
    bullets: [
      'hvorfor du gerne vil lave en madklub på sprogskolen',
      'hvad slags mad du foreslår, I laver i madklubben',
      'hvor tit du synes, I skal mødes, og hvor I skal mødes',
      'hvordan man kan tilmelde sig',
    ],
  },
  {
    id: 'opslag-2015-nov',
    genre: 'opslag',
    exam: { year: 2015, season: 'Vinter', label: 'November 2015' },
    situation: 'Du er formand i en klub, og du søger nye medlemmer til klubben.',
    bullets: [
      'hvad slags klub det er, og hvad I laver i klubben',
      'hvad slags medlemmer I søger',
      'hvor I holder møderne, og hvornår klubben har åbent',
      'hvordan man kan melde sig ind',
    ],
  },
  // --- Invitation ---
  {
    id: 'invitation-2012-nov',
    genre: 'invitation',
    exam: { year: 2012, season: 'Vinter', label: 'November 2012' },
    situation: 'Du vil holde en fest hjemme hos dig selv for dine klassekammerater fra sprogskolen.',
    bullets: [
      'hvorfor du gerne vil invitere dine klassekammerater til fest',
      'hvornår du holder fest (dato og klokkeslæt), og hvad din adresse er',
      'hvad I skal spise til festen, og hvad I skal lave',
      'hvordan og hvornår dine klassekammerater kan melde sig til festen',
    ],
  },
  {
    id: 'invitation-2015-nov',
    genre: 'invitation',
    exam: { year: 2015, season: 'Vinter', label: 'November 2015' },
    situation: 'Din arbejdsplads skal holde en sommerfest. Festen skal holdes i dit sommerhus.',
    bullets: [
      'hvornår I skal af sted (dato og klokkeslæt), og hvor I skal hen',
      'hvad I skal have at spise',
      'hvad I skal have med',
      'lidt om sommerhuset og området, hvor det ligger',
    ],
  },
  {
    id: 'invitation-2017-nov',
    genre: 'invitation',
    exam: { year: 2017, season: 'Vinter', label: 'November 2017' },
    situation: 'Du arbejder i et lille firma. Du vil gerne invitere dine kollegaer til filmaften.',
    bullets: [
      'hvorfor du gerne vil invitere dine kollegaer til filmaften',
      'lidt om den film, I skal se',
      'hvor og hvornår I skal se filmen',
      'lidt om, hvad I skal lave efter filmen',
    ],
  },
  {
    id: 'invitation-2020-may',
    genre: 'invitation',
    exam: { year: 2020, season: 'Sommer', label: 'Maj 2020' },
    situation: 'Du vil arrangere en cykeltur for alle medarbejderne på din arbejdsplads.',
    bullets: [
      'hvorfor du gerne vil arrangere en cykeltur',
      'hvor I skal cykle hen, og hvad I skal se på turen',
      'hvornår I skal afsted (dato og tidspunkt)',
      'hvordan man kan melde sig til turen',
    ],
  },
  {
    id: 'invitation-2021-may',
    genre: 'invitation',
    exam: { year: 2021, season: 'Sommer', label: 'Maj 2021' },
    situation: 'Du vil gerne invitere dine venner på restaurant.',
    bullets: [
      'hvorfor du gerne vil invitere dine venner på restaurant',
      'hvor og hvornår I skal mødes (sted, dato og tidspunkt)',
      'lidt om restauranten og den mad, I skal have',
      'hvad I skal lave, efter at I har spist',
    ],
  },
  // --- Jobansøgning ---
  {
    id: 'job-2014-may',
    genre: 'jobansoegning',
    exam: { year: 2014, season: 'Sommer', label: 'Maj 2014' },
    situation:
      'Du har set i en jobannonce i avisen, at kantinen på Roskilde Sygehus søger en kantinemedarbejder.',
    bullets: [
      'lidt om dig selv, og hvorfor du gerne vil arbejde i en kantine',
      'hvilke erfaringer du har med at arbejde i et kantinekøkken',
      'hvorfor du vil være god til jobbet som kantinemedarbejder',
      'hvordan du kan kontaktes',
    ],
  },
  {
    id: 'job-2015-may',
    genre: 'jobansoegning',
    exam: { year: 2015, season: 'Sommer', label: 'Maj 2015' },
    situation: 'Du søger frivilligt arbejde i en lektiecafé for børn i alderen 7-12 år.',
    bullets: [
      'lidt om dig selv, og hvad du kan hjælpe med i lektiecaféen',
      'hvilke erfaringer du har med at arbejde med børn',
      'hvor tit du kan arbejde i lektiecaféen',
      'hvordan du kan kontaktes',
    ],
  },
  {
    id: 'job-2016-may',
    genre: 'jobansoegning',
    exam: { year: 2016, season: 'Sommer', label: 'Maj 2016' },
    situation: 'Du vil gerne arbejde i supermarkedet Netto. Du har set, at Netto søger kasseassistenter.',
    bullets: [
      'lidt om dig selv, og hvorfor du gerne vil arbejde i Netto',
      'hvad du har lavet før (f.eks. kurser, praktik, arbejde)',
      'hvad du er god til',
      'hvordan du kan kontaktes',
    ],
  },
  {
    id: 'job-2019-nov',
    genre: 'jobansoegning',
    exam: { year: 2019, season: 'Vinter', label: 'November 2019' },
    situation:
      'Du vil gerne arbejde som rengøringsassistent. Du har set en jobannonce, hvor Hotel Luxdan søger en rengøringsassistent.',
    bullets: [
      'lidt om dig selv, og hvad du har lavet før (fx kurser, arbejde, praktik)',
      'hvorfor du gerne vil arbejde som rengøringsassistent på Hotel Luxdan',
      'hvorfor du er den rigtige til jobbet',
      'hvordan du kan kontaktes',
    ],
  },
  {
    id: 'job-2023-may',
    genre: 'jobansoegning',
    exam: { year: 2023, season: 'Sommer', label: 'Maj-juni 2023' },
    situation:
      'Du vil gerne arbejde som køkkenmedhjælper på en restaurant. Restaurant Nimo søger køkkenmedhjælpere.',
    bullets: [
      'lidt om dig selv, og hvordan du er som person',
      'hvad du har lavet før',
      'hvorfor du gerne vil arbejde som køkkenmedhjælper',
      'hvordan du kan kontaktes',
    ],
  },
  // --- Klage ---
  {
    id: 'klage-2012-may',
    genre: 'klage',
    exam: { year: 2012, season: 'Sommer', label: 'Maj 2012' },
    situation:
      'Du har haft håndværkere i dit hjem. Du er utilfreds med det arbejde, de har lavet. Du vil skrive en klage til firmaet Kvik Ombygning.',
    bullets: ['hvornår du havde håndværkere', 'hvad de skulle lave i din lejlighed', 'hvorfor du klager', 'hvordan du kan kontaktes'],
  },
  {
    id: 'klage-2012-nov',
    genre: 'klage',
    exam: { year: 2012, season: 'Vinter', label: 'November 2012' },
    situation:
      'Du bor i lejlighed. Det er forbudt at ryge i opgangen i ejendommen. Din nabo ryger tit i opgangen.',
    bullets: [
      'hvad du hedder, og hvor du bor',
      'hvad din nabo hedder, og hvor tit din nabo ryger i opgangen',
      'hvorfor det er et problem for dig',
      'hvad du har gjort for at løse problemet',
    ],
  },
  {
    id: 'klage-2013-nov',
    genre: 'klage',
    exam: { year: 2013, season: 'Vinter', label: 'November 2013' },
    situation: 'Du har været på restaurant. Du blev syg af maden. Du vil skrive en klage til restauranten.',
    bullets: [
      'hvorfor du skriver',
      'hvornår du var på restauranten',
      'hvad du spiste, og hvordan du havde det bagefter',
      'hvad du synes, restauranten skal gøre',
    ],
  },
  {
    id: 'klage-2021-may',
    genre: 'klage',
    exam: { year: 2021, season: 'Sommer', label: 'Maj 2021' },
    situation:
      'Du tager bussen til arbejde hver dag. Der er problemer med buschaufføren. Du vil klage til busselskabet Citybus.',
    bullets: [
      'hvilken bus du tager, og hvad til du tager den',
      'hvilke problemer der er med chaufføren',
      'hvad du har gjort for at løse problemerne',
      'hvad du synes, busselskabet skal gøre',
    ],
  },
  // --- Takkebrev ---
  {
    id: 'takkebrev-2014-may',
    genre: 'takkebrev',
    exam: { year: 2014, season: 'Sommer', label: 'Maj 2014' },
    situation: 'Du er lige blevet færdig med en praktik i en børnehave.',
    bullets: [
      'takke for en god tid',
      'fortælle, hvad du synes, du lærte i din praktik',
      'fortælle, hvad du vil savne',
      'fortælle, hvad du nu skal lave, og hvornår du gerne vil komme på besøg',
    ],
  },
  {
    id: 'takkebrev-2018-may',
    genre: 'takkebrev',
    exam: { year: 2018, season: 'Sommer', label: 'Maj 2018' },
    situation: 'Du er lige blevet færdig med din praktik i en kantine.',
    bullets: [
      'takke for en god praktik',
      'fortælle, hvad du synes, du har lært i din praktik',
      'fortælle, hvorfor du vil savne dine kolleger',
      'fortælle lidt om, hvad du skal lave nu',
    ],
  },
  {
    id: 'takkebrev-2020-nov',
    genre: 'takkebrev',
    exam: { year: 2020, season: 'Vinter', label: 'November 2020' },
    situation: 'Du har en kollega, der snart går på pension.',
    bullets: [
      'takke ham/hende for at have været en god kollega',
      'fortælle, hvad du har lært af din kollega',
      'fortælle, hvorfor du vil savne din kollega på arbejdspladsen',
      'invitere din kollega på en kop kaffe',
    ],
  },
  // --- Anbefaling ---
  {
    id: 'anbefaling-2014-nov',
    genre: 'anbefaling',
    exam: { year: 2014, season: 'Vinter', label: 'November-december 2014' },
    situation: 'Du har set en film på DVD. Du vil skrive en anbefaling af filmen til sprogskolens kursistblad.',
    bullets: [
      'hvad filmen hedder, og hvad slags film det er',
      'hvad filmen handler om',
      'hvorfor du vil anbefale andre at se filmen',
      'hvor og hvornår man kan se filmen',
    ],
  },
  {
    id: 'anbefaling-2016-may',
    genre: 'anbefaling',
    exam: { year: 2016, season: 'Sommer', label: 'Maj 2016' },
    situation:
      'På biblioteket i din by er der sprogcafé, hvor frivillige danskere hjælper udlændinge med at lære dansk.',
    bullets: [
      'hvor tit og hvornår der er sprogcafé på biblioteket',
      'hvad man f.eks. kan få hjælp til på sprogcaféen',
      'hvem der arbejder frivilligt på sprogcaféen',
      'hvorfor du vil anbefale andre at komme på sprogcaféen',
    ],
  },
  {
    id: 'anbefaling-2017-may',
    genre: 'anbefaling',
    exam: { year: 2017, season: 'Sommer', label: 'Maj 2017' },
    situation: 'Du har været på en god restaurant sammen med en ven. Du vil gerne anbefale restauranten til andre.',
    bullets: [
      'hvad restauranten hedder, og hvor den ligger',
      'hvad slags mad man kan købe',
      'hvad du og din ven spiste',
      'hvorfor du vil anbefale restauranten til andre',
    ],
  },
  // --- Læserbrev ---
  {
    id: 'laeserbrev-2017-may',
    genre: 'laeserbrev',
    exam: { year: 2017, season: 'Sommer', label: 'Maj 2017' },
    situation: 'Du arbejder frivilligt i en klub for unge. Du vil skrive et læserbrev til kursistbladet.',
    bullets: [
      'lidt om dig selv',
      'lidt om klubben, og hvor mange timer om ugen du arbejder frivilligt',
      'lidt om, hvilke aktiviteter du hjælper med',
      'hvad der er godt ved at have frivilligt arbejde (selv om man ikke får løn)',
    ],
  },
  // --- Efterlysning ---
  {
    id: 'efterlysning-2014-nov',
    genre: 'efterlysning',
    exam: { year: 2014, season: 'Vinter', label: 'November-december 2014' },
    situation:
      'Du har været i byen for at købe ind. På parkeringspladsen så du, at en bil kørte ind i din bil og kørte væk.',
    bullets: [
      'hvor og hvornår bilen kørte ind i din bil',
      'hvad slags bil det var, og hvordan den så ud',
      'hvad der skete med din bil, og hvorfor du gerne vil i kontakt med bilens ejer',
      'hvordan du kan kontaktes',
    ],
  },
  // --- Email (Delprøve 2) ---
  {
    id: 'email-2014-nov',
    genre: 'email',
    exam: { year: 2014, season: 'Vinter', label: 'November-december 2014' },
    situation:
      'Du har fået en e-mail fra din veninde Marie: "Jeg har hørt, at du har fået en ny fritidsinteresse, som du er meget glad for. Skriv og fortæl mig om den, og hvorfor du er så glad for den."',
    bullets: ['fortæl om din nye fritidsinteresse', 'forklar hvorfor du er glad for den'],
    minWords: 100,
  },
  {
    id: 'email-2017-may',
    genre: 'email',
    exam: { year: 2017, season: 'Sommer', label: 'Maj 2017' },
    situation:
      'Din ven Daniel skriver: "Du skrev, at du er meget glad for din nye praktik. Men du skriver ikke noget om, hvad det er, du er glad for. Vil du godt give nogle eksempler på, hvad du er glad for?"',
    bullets: ['giv konkrete eksempler på, hvad du er glad for i din nye praktik'],
    minWords: 100,
  },
  {
    id: 'email-2020-may',
    genre: 'email',
    exam: { year: 2020, season: 'Sommer', label: 'Maj 2020' },
    situation:
      'Din ven Johan skriver: "Jeg har hørt, at du har fået nyt job. Tillykke med det! Skriv og fortæl mig lidt om, hvilke arbejdsopgaver du har, og hvad du synes om dem."',
    bullets: ['fortæl om dine arbejdsopgaver', 'fortæl, hvad du synes om dem'],
    minWords: 100,
  },
  {
    id: 'email-2020-nov',
    genre: 'email',
    exam: { year: 2020, season: 'Vinter', label: 'November 2020' },
    situation:
      'Din ven Johan skriver: "Tillykke! Jeg har hørt, at du har vundet 2 millioner. Det er da helt fantastisk! Skriv og fortæl mig om, hvordan du har vundet pengene, og hvad du vil bruge dem til."',
    bullets: ['fortæl hvordan du vandt pengene', 'fortæl hvad du vil bruge dem til'],
    minWords: 100,
  },
  {
    id: 'email-2021-may',
    genre: 'email',
    exam: { year: 2021, season: 'Sommer', label: 'Maj 2021' },
    situation:
      'Din ven spørger: "Nu har du jo boet i Danmark i et stykke tid. Hvordan er det at bo i Danmark? Og har du fundet nye venner her?"',
    bullets: ['fortæl hvordan det er at bo i Danmark', 'fortæl om nye venner, du har fundet'],
    minWords: 100,
  },
  {
    id: 'email-2023-may',
    genre: 'email',
    exam: { year: 2023, season: 'Sommer', label: 'Maj-juni 2023' },
    situation:
      'Din ven Viktor skriver: "Du skrev, at du gerne vil flytte, fordi du ikke er tilfreds med din bolig. Skriv og fortæl mig lidt om, hvorfor du er utilfreds med din bolig, og hvor du vil flytte hen."',
    bullets: ['fortæl hvorfor du er utilfreds med din bolig', 'fortæl hvor du gerne vil flytte hen'],
    minWords: 100,
  },
]

export const writingModelAnswers: WritingModelAnswer[] = [
  {
    id: 'model-invitation-2021-may',
    promptId: 'invitation-2021-may',
    grade: '10',
    examinerComment: 'God besvarelse og høj korrekthed.',
    text: `Kære Venner

Det er min fødselsdag snart, og jeg vil gerne fejre den med jer alle.

Vi mødes lørdag den 30. november kl. 17:00. Vi skal spise indisk mad til middag på Guru restaurant på Vesterbro. Kokken fra restauranten laver god mad, og deres mango lassi er meget berømt. Jeg tror, at I alle vil nyde den indiske mad.

Når vi har spist, går vi til Strøget og drikker øl sammen i baren Femmlingo.

S.U. på telefon +45 23232323 senest den 20. november.

Jeg håber, at I alle vil komme, og at vi vil nyde denne hyggelige dag sammen.

Kh
Freya
+45 23232323`,
  },
  {
    id: 'model-invitation-2020-may',
    promptId: 'invitation-2020-may',
    grade: '10',
    examinerComment: 'God besvarelse og høj korrekthed.',
    text: `Kære kolleger

Cykeltur-invitation

Jeg håber, at I alle har det godt og nyder sommeren med jeres familie.

Jeg har arrangeret en cykeltur for alle medarbejdere. Nu hvor vejret er godt, bliver det sjovt at være sammen. Vores teambuilding i år bliver en cykeltur i det fri.

Vi mødes ved Hellerup station lørdag den 30. november kl. 8.00 og cykler til Dyrehaven i Klampenborg. Vi cykler på den smukke Strandvejen.

Vi vil se hjorte, høje træer og det gamle slot i Dyrehaven. Der vil være lidt at spise og drikke på turen. Vi afslutter vores tur kl. 15.00.

Medbring: cykel, cykelhjelm og godt humør.

S.U. på telefon +45 12 43 23 12 senest den 20. november.

Hvis I har spørgsmål, kan I ringe til mig eller sende mig en e-mail. Jeg håber, at I alle vil komme, og at vi vil nyde denne hyggelige dag sammen.

Med venlig hilsen
Freya
Mobil: +45 6789 0123`,
  },
  {
    id: 'model-jobansoegning-2019-nov',
    promptId: 'job-2019-nov',
    grade: undefined,
    text: `Erfaren og serviceminded rengøringsassistent søger job hos Hotel Luxdan

Jeg har med stor interesse læst jeres jobopslag på www.jobindex.dk, og jeg vil gerne søge stillingen som rengøringsassistent.

Jeg er en 25-årig indisk kvinde, der har været i Danmark i 10 år. Jeg er uddannet rengøringsassistent i Indien, og jeg har gode færdigheder inden for rengøring. I 2021 bestod jeg PD2, så jeg skriver og taler godt dansk.

Jeg har erfaring med at arbejde i Danmark. Jeg har arbejdet som rengøringsassistent på Hotel Vila i de sidste fem år. Mens jeg har arbejdet der, fik jeg en meget god oplæring og arbejdserfaring.

Jeg er ansvarlig, stabil, hårdtarbejdende og smilende. Jeg er god til at arbejde sammen med mennesker, og jeg kan også arbejde selvstændigt. Jeg kan også godt lide at have travlt og arbejde under pres.

Jeg vil virkelig gerne arbejde på Hotel Luxdan, fordi det matcher min uddannelse og min erfaring.

Jeg håber, at I vil overveje min ansøgning, og det vil glæde mig at komme til en samtale, hvor jeg kan fortælle mere om mig selv.

Jeg ser frem til at høre fra jer. Jeg kan kontaktes på DP@gmail.com.

Med venlig hilsen
Freya`,
  },
  {
    id: 'model-klage-2012-may',
    promptId: 'klage-2012-may',
    grade: '10',
    text: `Modtager: Kvik Ombygning
Viborggade 25
2450 København

Vedr. klage over tømrerarbejde på Viborggade 26, 3. th., 2100 København

Til rette vedkommende

Jeg skriver til jer for at klage over udskiftningen af taget, som I udførte i mit hjem fra d. 15. maj til d. 18. maj.

For det første er taget ikke helt tæt, så der kommer vand ind på loftet. For det andet har jeg modtaget en regning, der er for høj. Prisen er 5.000 kr. højere, end vi aftalte.

Jeg forventer, at I kommer og udbedrer fejlene. Jeg vil også gerne bede jer om at sende mig en regning på den aftalte pris.

Jeg ser frem til at høre fra jer snarest muligt.

Jeg kan kontaktes på telefon 1212 1212 eller mail dhara@gmail.com.

Mvh
Freya Thor`,
  },
  {
    id: 'model-klage-2013-nov',
    promptId: 'klage-2013-nov',
    grade: '4',
    examinerComment: 'Lavere karakter pga. gentagne grammatiske fejl (fx verbets placering og "giv mig" i stedet for "give mig") — godt eksempel at øve retning på.',
    text: `Modtager: Urban India Restaurant
Viborggade 25
2450 København

Vedr. klage over middag

Til rette vedkommende

Jeg skriver til jer for at klage over den middag, som jeg spiste med mine venner på jeres restaurant den 15. maj kl. 18:00.

Jeg spiste biryani med yoghurt, mango lassi og vand. Efter jeg kom hjem, fik jeg ondt i maven.

Jeg tror, at yoghurten, som jeres kok brugte, ikke var frisk og dermed ikke spiselig.

Jeres kok skal altid kontrollere maden, før den serveres til kunderne. Vil I venligst tale med jeres kok og vende tilbage til mig med en kompensation.

Jeg vil også gerne bede jer om at give mig rabat næste gang, jeg kommer på jeres restaurant.

Jeg ser frem til at høre fra jer snarest muligt.

Jeg kan kontaktes på telefon 1212 1212 eller mail dhara@gmail.com.

Mvh
Freya Thor`,
  },
  {
    id: 'model-takkebrev-2020-nov',
    promptId: 'takkebrev-2020-nov',
    text: `Kære Thomas

Hvordan har du det? Jeg håber, at du har det godt og nyder tiden med din familie.

Jeg ved, at du snart går på pension. Jeg vil gerne takke dig meget for at være en god, hjælpsom og støttende kollega. Du er en fantastisk kollega og en meget intelligent, dygtig og inspirerende leder.

Jeg har lært mange professionelle ting af dig, f.eks. om projektledelse og it-kodning. Du har også lært mig meget om Danmark. Mange tak for din store hjælp.

Jeg vil savne dig og vores hyggelige og sjove dage sammen på arbejdspladsen. Jeg vil også savne vores frokoster sammen og alle dine råd.

Tak for de mange gode og hyggelige timer, vi har haft. Jeg vil gerne invitere dig på en kop kaffe i kantinen på fredag. Jeg håber at høre fra dig snart.

Vi ses.
Kh / De bedste hilsner
Freya`,
  },
  {
    id: 'model-opslag-2013-nov',
    promptId: 'opslag-2013-nov',
    grade: '7',
    text: `Ny lejlighed i det centrale København søges!

Mit navn er Freya, og jeg bor alene i en studielejlighed på Vesterbro.

Jeg søger en ny lejlighed i centrum af København fra begyndelsen af november. Min søster kommer fra Indien i november for at studere på CBS. Derfor har jeg brug for en større lejlighed tæt på hendes universitet.

Jeg leder efter en lejlighed med to soveværelser, køkken, møbler, vaskemaskine og internet.

Mit budget er 10.000 kr. om måneden.

Hvis du har en lejlighed til leje, så kontakt venligst Freya på +45 6789 0123.

På forhånd mange tak.`,
  },
  {
    id: 'model-email-2021-may',
    promptId: 'email-2021-may',
    text: `Kære Adam

Mange tak for din mail. Det er så dejligt at høre fra dig. Det er meget lang tid siden, jeg har skrevet til dig. Undskyld, jeg skriver først nu. Jeg har meget travlt med mit arbejde og renovering af hjemmet.

Jeg håber, at du og din familie har det godt og nyder efteråret.

Ja, det er rigtigt, nu har jeg boet i Danmark i 3 år. Danmark er et meget smukt land, og jeg er så glad for at bo her. Jeg bor på Viborggade 26, 4. th., 2450 København. Min lejlighed ligger i byens centrum tæt på vandet. Lejligheden har to soveværelser, et smukt køkken, en stue og et badeværelse. Det er meget varmt og hyggeligt.

Jeg har fundet nye og søde venner her. Jeg arbejder i Nordea, og mange af mine kolleger er internationale, så vi ses også privat efter arbejde. Jeg går på sprogskole for at lære mere dansk, og jeg har også fået nogle nye venner der.

Jeg tænker på at gå ud og spise næste weekend. Vil du komme med? Skriv eller tekst tilbage. Jeg håber snart at høre fra dig. Giv venligst min hilsen til din familie.

Hav det nu rigtig godt indtil vi ses.
Kærlig hilsen
Freya
+45 12324232`,
  },
]

export function getGenreInfo(key: string) {
  return writingGenres.find((g) => g.key === key)
}

export function getPromptsForGenre(genre: string) {
  return writingPrompts.filter((p) => p.genre === genre)
}

export function getModelAnswersForPrompt(promptId: string) {
  return writingModelAnswers.filter((m) => m.promptId === promptId)
}
