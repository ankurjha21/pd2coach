// Reading comprehension (Læseforståelse) exercises sourced from official
// Prøve i Dansk 2 past exams. Texts, questions, and answer keys are adapted
// from the released exam booklets and censor/eksaminator answer keys
// (see /source-papers in the repo for the originals). Used here for
// personal exam preparation only.
import type { ReadingExam } from '../types'
import { readingArchive } from './readingArchive'

export const handCraftedExams: ReadingExam[] = [
  {
    id: 'pd2-2023-sommer',
    exam: { year: 2023, season: 'Sommer', label: 'Maj-juni 2023' },
    tasks: [
      {
        id: '2023s-opg1',
        opgaveNumber: 1,
        part: 'Delprøve 1',
        title: 'Søg informationer (skimming/scanning)',
        type: 'short-answer',
        timeMinutes: 30,
        instructions:
          'Svar på spørgsmålene. Find oplysningerne i teksthæftet nedenfor. Svar kort og præcist.',
        sourceText: `DANSESKOLER I HOVEDSTADEN

Akinyis danseskole — Østerbro (www.akinyidans.dk)
Vi har babyrytmik, rytmik og legetræning for børnefamilier og dans for 10-19-årige. Songadans er vores helt særlige svar på zumba, og består af salsa, merengue, cumbia og afrikansk dans. På Akinyis danseskole er værdier som udvikling, trivsel og livsglæde højt prioriteret.

Cphdans — Vanløse, Tårnby, Dragør, Hørsholm, Hvidovre og Værløse (www.cphdans.dk)
Hos Cphdans er der et bredt udbud af dansehold til både børn, unge og voksne. De kan både vælge ballet, zumba, MGP, showdance, hiphop og mange andre genrer. Undervisningen foregår på vores 6 danseskoler.

Dancelab.dk — Rødovre (www.dancelab.dk)
Vi er en danseskole beliggende på Tæbyvej 9 i Rødovre. Vi underviser børn fra 5 år i poledance (little spinners) og MGP. Derudover specialiserer vi os i poledance/polefitness for voksne.

Dance Affair — Islands Brygge (www.danceaffair.dk)
Vores undervisning har størst fokus på salsa og latin lady styling, men vi underviser også i reggaeton, bachata, afro, dancehall og burlesque.

Global Kidz — Nørrebro, Bispebjerg og Amager (www.globalkidz.dk)
Global Kidz tilbyder danseundervisning for børn og unge. Vores undervisere er dansere fra alle verdenshjørner. Undervisning i dancehall, hiphop, afrobeat, afrohouse, breakdance og meget mere. Hold for alle aldre fra 1 år og op.

Al-dans — Søborg og Kongens Lyngby (www.al-dans.dk)
Vi er en danseskole med mange tilbud til både store og små. Danseskolen tilbyder undervisning i følgende stilarter: ballet, breakdance, disco, hiphop, jazz, jitterbug og Vild med dans.

BOFÆLLESSKABER PÅ SJÆLLAND

Ab Allerslev Kloster — Munkedammen, 4320 Lejre
Et bofællesskab, der har eksisteret i mere end 40 år. Vi er en blandet gruppe på omkring 10 voksne med børn. Alle voksne laver fællesmad én gang på tre uger, hvilket svarer til fællesspisning tre gange om ugen.

Trekronerbo — Isafjordvej, 4000 Roskilde
Vi er voksne, børn og 4 hunde, 12 katte og 14 kaniner. Hjertet i bofællesskabet er aktiviteterne i vores fælleshus med tre ugentlige fællesspisninger.

Buske — Raunsbjergvej, 4330 Hvalsø
Vi er 8 familier med børn på en stor herregård. Vi har fællesspisning fire dage om ugen. Vores mange høns giver æg og kød.

Andedammen — Andedammen, 3460 Birkerød
17 boliger i et roligt og bilfrit område. Her bor vi omtrent 40 mennesker med en aldersspredning fra 2 til 90+ år. Fællesspisning et par gange om ugen.

Sneglebo — Sneglebo, 4000 Roskilde
20 lejeboliger til voksne og børn i alle aldre. Fællesspisning 2-3 gange om ugen.

Trekronergård — Isafjordvej, 4000 Roskilde
En lille andelsforening for voksne uden hjemmeboende børn. Fællesspisning en gang om måneden.

Fælleden — Bispehøjen, 4300 Holbæk
75 beboere fra 0 til 80 år. Fællesspisning fem dage om ugen fra mandag til fredag.

Stokken — Stokrosevej, 4450 Jyderup
20 andele, hvor de voksne beboere er fra midt i 20'erne til midt i 70'erne. Fællesspisning i vores store fælleshus seks af ugens dage.

Karise Permatopia — Køgevej, 4653 Karise
Et bo- og arbejdsfællesskab på Sydsjælland med ca. 150 voksne og 85 børn. Permatopias vindmølle leverer strøm til fælleskøkken, vaskeri og elbiler.

Gundsølille — Store Valbyvej, 4000 Roskilde
36 beboere, hvoraf de fleste er børn, i en tidligere skole. Fritgående høns og mulighed for køkkenhave.

Åhusene — Tønsbergvej, 4000 Roskilde
Voksne og børn i alle aldre. Fællesspisning tre gange om ugen.

Glashusene — Tønsbergvej, 4000 Roskilde
En god blanding af børn og voksne i alle aldre. Fællesspisning tre dage om ugen.

NYEKONTAKTER.DK

Lasse, 41 år: Jeg søger nye bekendtskaber, både mænd og kvinder. Jeg er en mand på 41, har ikke børn og bor i København. Jeg elsker at rejse, gå ture i naturen, musik og koncerter, og at træne.

Daniel, 38 år: Jeg søger en ven til nye oplevelser — gå ud og spise, vandre, ro kajak, rejse. Skriv, hvis du bor i Københavnsområdet.

Kristian, 41 år: Jeg er en frisk fyr på 41, single og har ingen børn, lige flyttet til hovedstaden. Jeg kunne godt tænke mig at lave en lille mandeklub, hvor vi mødes i byen og drikker en øl et par gange om måneden.

Henning, 81 år (skrevet af hans datter): Min far er en glad 81-årig pensionist. Han savner selskab med andre mænd og kvinder til gåture, kortspil og hyggeligt samvær.

Inge, 71 år: Jeg kunne godt tænke mig at lave en strikkeklub. Jeg vil gerne mødes med andre kreative ca. en gang om måneden for at strikke eller hækle.

Alice, 68 år: Jeg efterlyser en familie på Frederiksberg, der har brug for en reservebedste til mindre børn.

Toni, 53 år: Jeg søger jævnaldrende kvinder og mænd, som har lyst til at være med i en madklub, hvor vi mødes én gang om måneden og spiser sammen.

Gerd, 49 år: Vi er en gruppe kvinder, der har lavet en læseklub i Brønshøj. Vi mødes mandag aften ca. hver anden måned.

Rikke, 44 år: Jeg søger en, der har lyst til at løbe, gå, cykle eller svømme med mig i Strandparken.

Marek, 26 år: Jeg kommer fra Letland. Jeg søger en dansk ven at tale dansk med, så jeg kan blive bedre til dansk.`,
        questions: [
          {
            id: 'q0',
            number: 0,
            prompt: '(Eksempel) Hvilken danseskole ligger i Rødovre?',
            type: 'short-answer',
            answer: ['Dancelab.dk'],
            points: 0,
          },
          {
            id: 'q1',
            number: 1,
            prompt: 'Hvilke to danseskoler underviser i ballet?',
            type: 'short-answer',
            answer: ['Cphdans og Al-dans', 'Cphdans, Al-dans'],
            points: 1,
          },
          {
            id: 'q2',
            number: 2,
            prompt: 'Hvilket bofællesskab er kun for voksne?',
            type: 'short-answer',
            answer: ['Trekronergård'],
            points: 1,
          },
          {
            id: 'q3',
            number: 3,
            prompt: 'I hvilket bofællesskab er der fællesspisning 6 dage om ugen?',
            type: 'short-answer',
            answer: ['Stokken'],
            points: 1,
          },
          {
            id: 'q4',
            number: 4,
            prompt: 'Hvilke to bofællesskaber har høns?',
            type: 'short-answer',
            answer: ['Buske og Gundsølille', 'Buske, Gundsølille'],
            points: 1,
          },
          {
            id: 'q5',
            number: 5,
            prompt: 'Hvilket bofællesskab har en vindmølle?',
            type: 'short-answer',
            answer: ['Karise Permatopia', 'Permatopia'],
            points: 1,
          },
          {
            id: 'q6',
            number: 6,
            prompt: 'Hvem vil gerne lave en klub, som kun er for mænd?',
            type: 'short-answer',
            answer: ['Kristian (41 år)', 'Kristian'],
            points: 1,
          },
        ],
      },
      {
        id: '2023s-opg2',
        opgaveNumber: 2,
        part: 'Delprøve 1',
        title: 'Annoncer (match ord til annonce)',
        type: 'matching',
        instructions:
          'Der mangler et eller flere ord i hver annonce. Find den annonce (A-I), der passer til ordene på listen. Der er to annoncer, du ikke skal bruge.',
        sourceText: `A: Skoleleder Karin Børgesen går på pension. Arrangementet holdes i gymnastiksalen fredag d. 16. juni kl. 16-17. Havreholmens Skole, Havreholmen 12.

B: Festlig aften i Kulturhuset! Kom og vær med til en festlig aften fredag d. 9. juni. Vi starter med middag kl. 18. [___] Det er DJ Henning, der styrer diskoteket. Pris: 125 kroner ekskl. drikkevarer. OBS: Du skal være min. 18 år for at deltage. Kulturhuset, Hovedgaden 17.

C: [___] Vi har solgt sports- og træningstøj til hele familien i 25 fantastiske år, men d. 31. maj siger vi farvel og tak. Derfor holder vi ophørsudsalg i hele næste uge med store rabatter. Alt skal væk! Centrum Sport og Træning, Juelsgade 19.

D: Lykkehus Fysioterapi. [___] Så kan vi hjælpe dig! Vores klinik tilbyder bl.a.: Fysioterapi, massage og akupunktur, individuel træning og holdtræning. Der er gratis parkering for vores patienter. www.lh-fysio.dk.

E: [___] Vær blandt de første til at fejre, at vi slår dørene op til vores store legeland søndag d. 4. juni kl. 10. Der er gratis adgang hele dagen. Bibis Legeland, Grønnevej 33.

F: Motionsdag for børn. Vindby Idrætsforening har mange tilbud til børn i alderen 5-15 år. Lørdag d. 27. maj kl. 12-16 holder vi gratis motionsdag, hvor man kan prøve at danse, lave gymnastik og spille fodbold, håndbold og badminton. [___] www.vindby-if.dk.

G: [___] Vi søger unge under 18 år til omdeling af reklamer og aviser. Jobbet kan klares til fods eller på cykel. Fast løn pr. rute. Du skal være min. 13 år. Ring til Flex Omdeling på 94 20 48 56.

H: Ny app: Sund ryg. Styrk din ryg på en hurtig, sjov og effektiv måde med den helt nye app 'Sund ryg'. [___] Alle øvelser vises på videoer. App'en er helt gratis. www.sundrygnu.dk.

I: Los Latinos spiller op til dans! Koncert med det populære band på Kasernen fredag d. 2. juni kl. 20. [___] Kan købes på www.kasernen.dk. Sælges også i døren før koncerten.`,
        questions: [
          {
            id: 'q0b',
            number: 0,
            prompt: '(Eksempel) Afskedsreception',
            type: 'matching',
            answer: 'A',
            points: 0,
          },
          {
            id: 'q7',
            number: 7,
            prompt: 'Træning derhjemme på kun 15 minutter.',
            type: 'matching',
            options: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
            answer: 'H',
            points: 1,
          },
          {
            id: 'q8',
            number: 8,
            prompt: 'Stor åbningsfest for hele familien.',
            type: 'matching',
            options: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
            answer: 'E',
            points: 1,
          },
          {
            id: 'q9',
            number: 9,
            prompt: 'Efter maden er der dans og musik.',
            type: 'matching',
            options: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
            answer: 'B',
            points: 1,
          },
          {
            id: 'q10',
            number: 10,
            prompt: 'Har du ondt i ryggen?',
            type: 'matching',
            options: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
            answer: 'D',
            points: 1,
          },
          {
            id: 'q11',
            number: 11,
            prompt: 'Tjen penge – og få frisk luft og motion!',
            type: 'matching',
            options: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
            answer: 'G',
            points: 1,
          },
          {
            id: 'q12',
            number: 12,
            prompt: 'Billetter: 100 kroner pr. stk.',
            type: 'matching',
            options: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
            answer: 'I',
            points: 1,
          },
        ],
      },
      {
        id: '2023s-opg3',
        opgaveNumber: 3,
        part: 'Delprøve 2',
        title: 'To naboer mødes (udfyld manglende ord)',
        type: 'cloze',
        timeMinutes: 60,
        instructions:
          'Læs teksten. Skriv de ord, der mangler. Ordene findes i rammen nederst. Der er fem ord, du ikke skal bruge.',
        sourceText: `Sofie på 22 år er frisør og arbejder i en salon i Aarhus. For en måned siden flyttede hun fra et område uden for Aarhus til en lejlighed, som (0) ligger i centrum af byen.

Sofie betaler lidt (13)___ i husleje, end hun gjorde før. Alligevel er hun glad for, at hun er flyttet. Før tog det nemlig næsten en time for hende at cykle til arbejde, og nu tager det kun et kvarter. Og Sofie synes, det er dejligt at (14)___ tid på transport.

I den måned, Sofie har boet i opgangen, har der været meget (15)___, men en torsdag aften kan hun pludselig høre høj musik. Det er hendes nabo, Clara, der holder fest. Sofie skal op og på arbejde næste dag, så hun vil gerne (16)___ i seng, og derfor håber hun, at festen ikke varer så længe.

Men klokken et om natten er musikken stadig høj, og Sofie ringer på hos Clara, (17)___ hun vil have hende til at skrue ned. Men døren bliver ikke åbnet, og festen slutter først klokken tre om natten. Sofie har svært ved at falde i søvn, (18)___ festen er slut, og der er fred og ro.

Et par dage efter møder Sofie og Clara hinanden i opgangen, og Sofie fortæller, at hun ikke kunne sove om natten på grund af festen. Clara undskylder og siger, at hun (19)___ plejer at holde fest på hverdage, men at det kun var, fordi hun havde 25-års fødselsdag. Hun fortæller, at hun skal holde fest igen næste lørdag og spørger, om Sofie har lyst til at komme med. Sofie er stadig lidt irriteret, men hun vil alligevel (20)___ komme til festen, for hun synes, Clara virker flink.

Ordbank: skilt, kort, men, tidligt, dårligt, sent, bedre, som, mere, stille, for, mindre, spare, selvom, ikke, gerne, tit`,
        questions: [
          { id: 'q13', number: 13, prompt: 'Sofie betaler lidt ___ i husleje, end hun gjorde før.', type: 'cloze', answer: 'mere', points: 1 },
          { id: 'q14', number: 14, prompt: 'Sofie synes, det er dejligt at ___ tid på transport.', type: 'cloze', answer: 'spare', points: 1 },
          { id: 'q15', number: 15, prompt: 'Der har været meget ___ i opgangen.', type: 'cloze', answer: 'stille', points: 1 },
          { id: 'q16', number: 16, prompt: 'Sofie vil gerne ___ i seng.', type: 'cloze', answer: 'tidligt', points: 1 },
          { id: 'q17', number: 17, prompt: 'Sofie ringer på hos Clara, ___ hun vil have hende til at skrue ned.', type: 'cloze', answer: 'for', points: 1 },
          { id: 'q18', number: 18, prompt: 'Sofie har svært ved at falde i søvn, ___ festen er slut.', type: 'cloze', answer: 'selvom', points: 1 },
          { id: 'q19', number: 19, prompt: 'Clara plejer ___ at holde fest på hverdage.', type: 'cloze', answer: 'ikke', points: 1 },
          { id: 'q20', number: 20, prompt: 'Sofie vil alligevel ___ komme til festen.', type: 'cloze', answer: 'gerne', points: 1 },
        ],
      },
      {
        id: '2023s-opg4',
        opgaveNumber: 4,
        part: 'Delprøve 2',
        title: 'Buschauffør med rygproblemer (manglende sætning)',
        type: 'sentence-gap',
        instructions:
          'Læs teksten. I hvert afsnit mangler der en sætning. Find den sætning (A-H), der passer. Der er to sætninger, du ikke skal bruge.',
        sourceText: `Klaus er 45 år og buschauffør. Han har desværre fået problemer med ryggen.

(0) Klaus elsker at køre bil, og han har arbejdet som chauffør, lige siden han fik kørekort som 18-årig. Han har kørt både taxa, bus og lastbil. Nu er han 45 år, og de sidste 15 år har han arbejdet som buschauffør. (A: Og det vil han gerne blive ved med.) Men selvom han er glad for jobbet, er det hårdt at sidde ned så mange timer hver dag, og han får nogle gange ondt i ryggen.

(21) Klaus taler med sin læge om sine rygproblemer. Hun siger, at han skal træne for at få en stærkere ryg. ___ Han kan godt lide at se sport i tv, men han har aldrig selv gået til sport eller fitness, for han kan ikke lide at dyrke motion. Så han har slet ikke lyst til at begynde at træne.

(22) Klaus får det værre og værre med ryggen, så en dag går han alligevel hen i det lokale fitnesscenter og melder sig ind. Han er lidt usikker på, hvordan maskinerne virker. ___ For han taler med en instruktør, og hun viser ham, hvordan han skal bruge maskinerne, og det er Klaus glad for.

(23) Klaus har planer om at tage til fitness tre gange om ugen efter arbejde, men somme tider gider han ikke. ___ Han har prøvet at tage headset på, så han kan lytte til musik, mens han træner. Alligevel føler han, at tiden går meget langsomt, når han er i fitnesscentret.

(24) En dag møder Klaus en af sine kolleger, Omar, i fitnesscentret. Omar spørger, om de skal træne sammen. ___ Omar kender nemlig alle maskinerne og er glad for at komme i fitnesscenteret.

(25) Klaus og Omar mødes tit og træner sammen. Men nogle dage har de meget forskellige arbejdstider, og så er det svært for dem at mødes. ___ For han er faktisk blevet så glad for at gå til fitness, at han også kommer afsted, selvom Omar ikke er med.

A Og det vil han gerne blive ved med.
B Og han kan ikke lide at bede om hjælp.
C Men det synes Klaus er en dårlig idé.
D For han synes, det er kedeligt at træne.
E Men han får heldigvis hjælp.
F Så er de nødt til at træne sent om aftenen.
G Det vil Klaus rigtig gerne.
H Men Klaus tager alligevel altid til træning.`,
        questions: [
          { id: 'q21', number: 21, prompt: 'Afsnit 21: Lægen siger, han skal træne.', type: 'sentence-gap', options: ['B','C','D','E','F','G','H'], answer: 'C', points: 1 },
          { id: 'q22', number: 22, prompt: 'Afsnit 22: Han er usikker på maskinerne.', type: 'sentence-gap', options: ['B','C','D','E','F','G','H'], answer: 'E', points: 1 },
          { id: 'q23', number: 23, prompt: 'Afsnit 23: Somme tider gider han ikke.', type: 'sentence-gap', options: ['B','C','D','E','F','G','H'], answer: 'D', points: 1 },
          { id: 'q24', number: 24, prompt: 'Afsnit 24: Omar spørger, om de skal træne sammen.', type: 'sentence-gap', options: ['B','C','D','E','F','G','H'], answer: 'G', points: 1 },
          { id: 'q25', number: 25, prompt: 'Afsnit 25: Svært at mødes pga. forskellige arbejdstider.', type: 'sentence-gap', options: ['B','C','D','E','F','G','H'], answer: 'H', points: 1 },
        ],
      },
      {
        id: '2023s-opg5',
        opgaveNumber: 5,
        part: 'Delprøve 2',
        title: 'Interview med Ida – tjener (match spørgsmål til afsnit)',
        type: 'paragraph-match',
        instructions:
          'Læs interviewet. Find det afsnit (A-H), der passer til hvert spørgsmål. Der er to afsnit, du ikke skal bruge.',
        sourceText: `Ida på 35 år er uddannet tjener og ansat på en restaurant i Aarhus.

A: Da jeg gik ud af 10. klasse, fik jeg arbejde på en café. Jeg syntes, det var sjovt, og jeg kunne godt lide kontakten med gæsterne. Så da jeg havde arbejdet der i et par år, besluttede jeg mig for at tage tjeneruddannelsen.

B: Ja, helt sikkert. Vi går meget på jobbet og bærer tit på tunge bakker og fade, så nogle gange kan man godt få smerter i både benene og ryggen. Det går også tit ud over min nattesøvn, at jeg arbejder om aftenen og tit kommer sent hjem.

C: Ja, de fleste dage. Jeg og mine kollegaer deler dem imellem os, når dagen er slut. Det er altid spændende at se, hvor mange der er. Det er selvfølgelig dejligt, når man får lidt ekstra for en god servering.

D: Jeg kan godt lide at arbejde som tjener, og det vil jeg gerne fortsætte med i mange år endnu. Men hvis jeg skal prøve noget andet en dag, tror jeg, jeg vil åbne en vinforretning, for jeg er meget interesseret i vin.

E: Mange ting! Men det vigtigste er nok, at man er serviceminded, og at man kan lide at have med mennesker at gøre. Det er også en fordel at kunne tale flere sprog. Du skal ikke være typen, der bliver ked af det, hvis nogen taler lidt hårdt til dig.

F: Nej, faktisk ikke, men det betyder ikke så meget, at lønnen ikke er så høj, for jeg arbejder på en ret fin restaurant, hvor mange af gæsterne heldigvis giver gode drikkepenge.

G: Ja, for selvom det er en arbejdsplads, hvor der tit er meget travlt, har vi det også sjovt med hinanden, og vi er næsten som én stor familie. Hvis der er et problem, sætter vi os altid ned, når vi har lukket, og snakker om det.

H: At være en del af et stort team, der arbejder sammen om at give gæsterne en god oplevelse, er helt sikkert det, der betyder mest for mig. Man er i godt humør, når man går hjem efter en aften, hvor alt bare gik, som det skulle.`,
        questions: [
          { id: 'q0c', number: 0, prompt: '(Eksempel) Hvorfor er du blevet tjener?', type: 'paragraph-match', answer: 'A', points: 0 },
          { id: 'q26', number: 26, prompt: 'Hvad skal en tjener være god til?', type: 'paragraph-match', options: ['B','C','D','E','F','G','H'], answer: 'E', points: 1 },
          { id: 'q27', number: 27, prompt: 'Har du gode kollegaer?', type: 'paragraph-match', options: ['B','C','D','E','F','G','H'], answer: 'G', points: 1 },
          { id: 'q28', number: 28, prompt: 'Hvad kan du bedst lide ved dit job?', type: 'paragraph-match', options: ['B','C','D','E','F','G','H'], answer: 'H', points: 1 },
          { id: 'q29', number: 29, prompt: 'Er det hårdt at være tjener?', type: 'paragraph-match', options: ['B','C','D','E','F','G','H'], answer: 'B', points: 1 },
          { id: 'q30', number: 30, prompt: 'Får du mange drikkepenge?', type: 'paragraph-match', options: ['B','C','D','E','F','G','H'], answer: 'C', points: 1 },
        ],
      },
    ],
  },
  {
    id: 'pd2-2022-sommer',
    exam: { year: 2022, season: 'Sommer', label: 'Maj-juni 2022' },
    tasks: [
      {
        id: '2022s-opg1',
        opgaveNumber: 1,
        part: 'Delprøve 1',
        title: 'Søg informationer (skimming/scanning)',
        type: 'short-answer',
        timeMinutes: 30,
        instructions:
          'Svar på spørgsmålene. Find oplysningerne i teksthæftet nedenfor. Svar kort og præcist.',
        sourceText: `KANOTURE I JYLLAND

Tur nr. 1: Mosbjerg-Uggerby (Uggerby Kanofart). Går gennem smukke, naturskønne omgivelser. Mulighed for overnatning i eget telt eller shelters.

Tur nr. 2: Tørring-Klostermølle (Tørring Kanoudlejning). Todages kanotur med overnatning i standardhytte på campingplads.

Tur nr. 3: Bjerringbro-Randers (Silkeborg Kanocenter). Tre dage med to overnatninger på Langå Camping og Randers City Camp. Ikke tilladt at medbringe hunde.

Tur nr. 4: Silkeborg-Bjerringbro (Silkeborg Kanocenter). Luksus-tur med overnatning i dobbeltværelse på Kongensbro Kro inkl. 3-retters menu.

Tur nr. 5: Bindslev-Uggerby (Uggerby Kanofart). En 2,5 times kanooplevelse til Uggerby eller stranden.

Tur nr. 6: Tørring-Voervadsbro (Tørring Kanoudlejning). Luksus kæreste-/forkælelseskanotur med en overnatning på hotel.

Tur nr. 7: Ry-Ans (Silkeborg Kanocenter). 48 km over tre dage. Et 4-personers iglotelt følger med og må beholdes.

Tur nr. 8: Tørring-Fladbro (Ry Kanofart). Den ultimative Gudenå-tur, 160 km over syv dage, med telt og bål.

HOTELLER PÅ BORNHOLM

Allinge Badehotel — ved stranden, 5 km fra Hammershus. Cykeludlejning på hotellet.

Hotel Gudhjem — centrum af Gudhjem. Indendørs swimmingpool, petanquebane og billardbord.

Sverre's Hotel — centralt i Rønne. Gratis trådløs internetadgang, gratis parkering.

Hotel Fredensborg — ved havet i Rønne. Bar, lounge, spabad og rummelig have.

Hotel Siemsens Gaard — charmerende bygning fra 1600-tallet i Svaneke. Sauna og fitnesscenter.

Hotel Balka Strand — 150 meter fra Balka Strand. Udendørs swimmingpool, sauna og legeplads.

Hotel Sandvig Havn — ved Sandvig Havn. Tv-stue og indre gårdhave.

Stammershalle Badehotel — på Bornholms klippekyst. Tennisbaner og gratis parkering.

Kanns Hotel — moderne hotel i Aakirkeby.

Hotel Skovly — i en fredet skov, 5 km fra Rønne. Cykeludlejning på stedet.

Hotel Friheden — 100 meter fra stranden i Sandkås. Adgang til spabad og sauna samt indendørs pool.

BB-Hotel Rønne Bornholm — på Store Torv i centrum af Rønne.

KOR I REGION HOVEDSTADEN

Cikaderne — Brønshøj. 30 medlemmer, 6 stemmegrupper. Øver hver torsdag i EnergiCenter Voldparken.

Facett — Taastrup. 45 sangere. Øver hver onsdag aften i Taastrup Kulturcenter.

Elverhøjkoret — Virum. Kvindekor med 20 erfarne sangere. Øver mandage på Kulturstedet Lindegården.

Eventyrkoret — Herlev. Gospel- og folkekor med 33 sangere. Øver torsdag kl. 19.00-21.30 i Korskirken, Herlev Hovedgade 42.

ØreVOX — Nørrebro. Øvelokale stillet til rådighed af musik-plejehjemmet Sølund. Øver mandag kl. 18.30-21.00.

Kor Dialis — Valby. Ca. 45 erfarne amatørkorsangere. Øver hver tirsdag på Plejehjemmet Langgadehus.

Vox Humana — Allerød. Specialiseret i ny nordisk kormusik. Øver torsdage på Allerød Musikskole.

Korinor — Helsingør. Ca. 35 sangere. Øver hver onsdag aften på Helsingør Gymnasium.`,
        questions: [
          { id: 'q0', number: 0, prompt: '(Eksempel) På hvilken kanotur overnatter man på et hotel?', type: 'short-answer', answer: ['Tur nr. 6'], points: 0 },
          { id: 'q1', number: 1, prompt: 'Hvilken kanotur varer i 7 dage?', type: 'short-answer', answer: ['Tur nr. 8', 'Tørring-Fladbro'], points: 1 },
          { id: 'q2', number: 2, prompt: 'Hvilket hotel har en udendørs swimmingpool?', type: 'short-answer', answer: ['Hotel Balka Strand'], points: 1 },
          { id: 'q3', number: 3, prompt: 'Hvilket hotel har både spabad og sauna?', type: 'short-answer', answer: ['Hotel Friheden'], points: 1 },
          { id: 'q4', number: 4, prompt: 'Hvilket hotel har tennisbaner?', type: 'short-answer', answer: ['Stammershalle Badehotel'], points: 1 },
          { id: 'q5', number: 5, prompt: 'På hvilke to hoteller er der cykeludlejning?', type: 'short-answer', answer: ['Allinge Badehotel og Hotel Skovly'], points: 1 },
          { id: 'q6', number: 6, prompt: 'Hvilket kor øver i en kirke?', type: 'short-answer', answer: ['Eventyrkoret (Herlev)'], points: 1 },
        ],
      },
      {
        id: '2022s-opg2',
        opgaveNumber: 2,
        part: 'Delprøve 1',
        title: 'Annoncer (match ord til annonce)',
        type: 'matching',
        instructions:
          'Der mangler et eller flere ord i hver annonce. Find den annonce (A-I), der passer til ordene på listen. Der er to annoncer, du ikke skal bruge.',
        sourceText: `A: Gør som 100.000 andre… Få vores online nyhedsbrev direkte i din indbakke. Masser af tips om mode og bolig. [___]

B: [___] Vi tilbyder inspirerende motion i naturen med fokus på styrke, balance og kondition. Vi har hold med professionelle instruktører alle ugens dage. www.naturfit.dk

C: [___] Børnemenuer, byg-selv-burgere og salatbar, tag-selv softice. Åbningstider: mandag-lørdag kl. 15-22. Spisehuset Madglad i Bycentret.

D: Udsalg i Dyrehandlen. Vi har et stort udvalg af luksusfoder, udstyr og legetøj til glade og sunde kæledyr! Særtilbud i denne uge: [___] Vi ses på Storevej 16.

E: [___] I hele denne uge har vi rabat på fx tasker, penalhuse, hæfter, skriveredskaber og lommeregnere. Åbent alle hverdage kl. 10-17. Jørgens Boghandel.

F: Frisk luft og hygge. Tilmeld dig vores næste hyggelige vandretur på 7 km i Gribskov søndag d. 5/6 kl. 10. Hunde er også meget velkomne. Deltagelse er gratis. [___]

G: Træning for små og store hunde. Intensiv træning på små hold med uddannet instruktør. Vi træner tirsdag og torsdag i Visby Hallen. [___]

H: [___] Her kan hele familien lære at lave lette og sunde hverdagsretter, og alle hjælper hinanden. Pris inkl. råvarer: Kr. 680,-. Tid: søndag d. 6/8, 3/9 og 1/10 kl. 11-14.

I: [___] Gamby Skole søger nogle frivillige, som har lyst til at læse med skolebørn fra 1. til 3. klasse i skoletiden. Kontakt vejleder Lene Ibsen.`,
        questions: [
          { id: 'q0b', number: 0, prompt: '(Eksempel) Tilmeld dig på www.smukkehjem.dk', type: 'matching', answer: 'A', points: 0 },
          { id: 'q7', number: 7, prompt: '20 % rabat på hundemad.', type: 'matching', options: ['B','C','D','E','F','G','H','I'], answer: 'D', points: 1 },
          { id: 'q8', number: 8, prompt: 'Effektiv udendørs træning!', type: 'matching', options: ['B','C','D','E','F','G','H','I'], answer: 'B', points: 1 },
          { id: 'q9', number: 9, prompt: 'Madkursus for børn og voksne.', type: 'matching', options: ['B','C','D','E','F','G','H','I'], answer: 'H', points: 1 },
          { id: 'q10', number: 10, prompt: 'Alt til dit barns skolestart.', type: 'matching', options: ['B','C','D','E','F','G','H','I'], answer: 'E', points: 1 },
          { id: 'q11', number: 11, prompt: 'Besøg vores familievenlige restaurant.', type: 'matching', options: ['B','C','D','E','F','G','H','I'], answer: 'C', points: 1 },
          { id: 'q12', number: 12, prompt: 'Kan du hjælpe os 2-3 timer om ugen?', type: 'matching', options: ['B','C','D','E','F','G','H','I'], answer: 'I', points: 1 },
        ],
      },
      {
        id: '2022s-opg3',
        opgaveNumber: 3,
        part: 'Delprøve 2',
        title: 'Held i uheld (udfyld manglende ord)',
        type: 'cloze',
        timeMinutes: 60,
        instructions:
          'Læs teksten. Skriv de ord, der mangler. Ordene findes i rammen nederst. Der er fem ord, du ikke skal bruge.',
        sourceText: `Linda på 55 er (0) skilt og bor alene i et hus lidt uden for Herning. Hendes søster bor inde i byen, og Linda tager tit bilen og kører til Herning for at besøge sin søster.

En lørdag formiddag skal Linda til Herning for at shoppe og spise frokost med sin søster. Hun kører ind på en stor parkeringsplads midt i Herning, selvom hun ved, at det godt kan tage (13)___ tid at finde en plads der. Der er mange biler på parkeringspladsen. Da bilen foran hende pludselig stopper, ser hun det for (14)___, og derfor kører hun ind i den.

Linda bliver ret chokeret, men manden i den anden bil ser (15)___ ud som om, han er okay, og det gør hende mere rolig. Hun står ud af sin bil og hilser på manden, som hedder Ole. Der er ikke sket noget med Lindas bil, men der er (16)___ kommet en lille bule i Oles bil, og det er han ret sur over. Men da Linda siger, at hendes forsikring nok skal betale, og spørger, om hun må invitere ham på en kop kaffe, bliver han i (17)___ humør.

De sidder længe på caféen og snakker, og Linda glemmer helt, at hun har en frokostaftale med sin søster, (18)___ hun hygger sig så godt med Ole. Men pludselig ser Linda, at klokken er mange. Hendes søster venter på hende, og (19)___ Linda gerne vil snakke mere med Ole, er hun nødt til at gå. Ole har heldigvis (20)___ lyst til at snakke mere med Linda, så før hun skynder sig afsted, aftaler de at ringe sammen og mødes igen en anden dag.

Ordbank: skilt, kort, men, tidligt, dårligt, sent, bedre, også, heldigvis, selvom, ikke, fordi, lang, desværre`,
        questions: [
          { id: 'q13', number: 13, prompt: 'Det kan godt tage ___ tid at finde en plads.', type: 'cloze', answer: 'lang', points: 1 },
          { id: 'q14', number: 14, prompt: 'Hun ser det for ___.', type: 'cloze', answer: 'sent', points: 1 },
          { id: 'q15', number: 15, prompt: 'Manden ser ___ ud, som om han er okay.', type: 'cloze', answer: 'heldigvis', points: 1 },
          { id: 'q16', number: 16, prompt: 'Der er ___ kommet en lille bule i Oles bil.', type: 'cloze', answer: 'desværre', points: 1 },
          { id: 'q17', number: 17, prompt: 'Han bliver i ___ humør.', type: 'cloze', answer: 'bedre', points: 1 },
          { id: 'q18', number: 18, prompt: 'Linda glemmer frokostaftalen, ___ hun hygger sig så godt.', type: 'cloze', answer: 'fordi', points: 1 },
          { id: 'q19', number: 19, prompt: '___ Linda gerne vil snakke mere, er hun nødt til at gå.', type: 'cloze', answer: 'selvom', points: 1 },
          { id: 'q20', number: 20, prompt: 'Ole har ___ lyst til at snakke mere.', type: 'cloze', answer: 'også', points: 1 },
        ],
      },
      {
        id: '2022s-opg4',
        opgaveNumber: 4,
        part: 'Delprøve 2',
        title: 'Sanne er social- og sundhedshjælper (manglende sætning)',
        type: 'sentence-gap',
        instructions:
          'Læs teksten. I hvert afsnit mangler der en sætning. Find den sætning (A-H), der passer. Der er to sætninger, du ikke skal bruge.',
        sourceText: `Sanne på 26 år har en travl hverdag. Hun er gift og har en datter på 3 år, og for nogle måneder siden fik hun fast job som social- og sundhedshjælper.

(0) Sanne er 26 år og bor i Viborg sammen med sin mand og deres datter på 3 år. Hun er nyuddannet social- og sundhedshjælper, og de sidste par år har uddannelsen fyldt meget i hendes liv. (A: Men det gør den ikke mere.) Nu er hun nemlig ansat og arbejder på fuld tid på et plejehjem, som hedder Birkebo.

(21) De fleste af social- og sundhedshjælperne på Birkebo har arbejdet der i mange år, så de har meget erfaring. ___ For selvom hun har lært meget på sin uddannelse, er hun også ny i jobbet, og derfor er der tit noget, hun ikke ved, hvordan hun skal gøre.

(22) Det kan godt være fysisk hårdt at arbejde med ældre mennesker på et plejehjem. Derfor har mange social- og sundhedshjælpere ondt i ryggen. ___ Da hun tog sin uddannelse, lærte hun nemlig forskellige teknikker til at løfte de ældre.

(23) Sanne har skiftende arbejdstider på Birkebo, og det bliver hun og hendes mand, Claus, altid nødt til at tage med i deres planlægning. Når Sanne har eftermiddagsvagt, kan hun fx ikke hente deres datter fra børnehave. ___ Claus arbejder nemlig som maler, og han har faste arbejdstider og fri kl. 15 hver dag.

(24) Sanne har også en del aftenvagter på plejehjemmet. ___ Hun synes ellers, det er hyggeligt at være på Birkebo om aftenen, men når hun arbejder om aftenen, kan hun ikke være hjemme og lægge Olivia i seng.

(25) Sanne har været på Birkebo i tre måneder, og hun skal snart til en samtale med sin chef. ___ For hun har aldrig været til sådan en samtale før, og hun er lidt bange for sin chef.

A Men det gør den ikke mere.
B Hun er nervøs for, hvad han vil sige.
C Men det har Sanne heldigvis ikke.
D Og det passer ikke så godt med hendes familieliv.
E Det har Sanne desværre også.
F Og det er Sanne rigtig glad for.
G Men det kan hendes mand heldigvis godt.
H Men de har ikke tid til at hjælpe Sanne.`,
        questions: [
          { id: 'q21', number: 21, prompt: 'Afsnit 21: Kolleger har meget erfaring.', type: 'sentence-gap', options: ['B','C','D','E','F','G','H'], answer: 'F', points: 1 },
          { id: 'q22', number: 22, prompt: 'Afsnit 22: Mange har ondt i ryggen.', type: 'sentence-gap', options: ['B','C','D','E','F','G','H'], answer: 'C', points: 1 },
          { id: 'q23', number: 23, prompt: 'Afsnit 23: Hun kan ikke hente datteren.', type: 'sentence-gap', options: ['B','C','D','E','F','G','H'], answer: 'G', points: 1 },
          { id: 'q24', number: 24, prompt: 'Afsnit 24: Hun har aftenvagter.', type: 'sentence-gap', options: ['B','C','D','E','F','G','H'], answer: 'D', points: 1 },
          { id: 'q25', number: 25, prompt: 'Afsnit 25: Snart samtale med chefen.', type: 'sentence-gap', options: ['B','C','D','E','F','G','H'], answer: 'B', points: 1 },
        ],
      },
      {
        id: '2022s-opg5',
        opgaveNumber: 5,
        part: 'Delprøve 2',
        title: 'Interview med Lena – professionel musiker (match spørgsmål til afsnit)',
        type: 'paragraph-match',
        instructions:
          'Læs interviewet. Find det afsnit (A-H), der passer til hvert spørgsmål. Der er to afsnit, du ikke skal bruge.',
        sourceText: `Lena på 29 er musiker. Hun synger, spiller guitar og laver sin egen musik. Sidste år udgav hun sit første album.

A: Jeg har været glad for at synge, siden jeg var helt lille, og da jeg var 10, ville jeg gerne lære at spille et instrument. Så mine forældre købte en guitar til mig.

B: Ja, det går ok. Selvfølgelig er det meget forskelligt, hvad der kommer ind på min konto hver måned. Men lige nu går det faktisk rigtig fint.

C: At stå på en scene foran en masse mennesker og spille min musik. Når folk hører min musik og kommer hen til mig efter koncerten og siger, at de er vilde med mine sange, bliver jeg rigtig stolt og glad.

D: Nej, det synes jeg ikke. Men det er også kun, fordi jeg nu er i en situation, hvor jeg kan leve af min musik. Mange af mine kolleger vil sige, at det er et stort problem, at de ikke tjener nok.

E: Det føles mest naturligt, fordi det er mit modersmål. Nu skriver jeg jo selv mine sange. Men hvis jeg i fremtiden også skal have succes i udlandet, bliver jeg nødt til at skrive mine sange på engelsk.

F: Jeg har en bred musiksmag, så jeg hører faktisk mange forskellige slags musik. Jeg går tit til klassiske koncerter. Og jeg kan også godt lide heavy rock.

G: At få international succes med min musik og rejse rundt i hele verden og give koncerter på nogle af de helt store scener, fx i England og Japan.

H: Jeg har min egen stil, hvor jeg blander pop med lidt jazz. Jeg synger på dansk, og de fleste af mine sange er kærlighedssange, der handler om drømme og oplevelser, jeg selv har haft.`,
        questions: [
          { id: 'q0c', number: 0, prompt: '(Eksempel) Hvornår begyndte du at interessere dig for musik?', type: 'paragraph-match', answer: 'A', points: 0 },
          { id: 'q26', number: 26, prompt: 'Hvad slags musik laver du?', type: 'paragraph-match', options: ['B','C','D','E','F','G','H'], answer: 'H', points: 1 },
          { id: 'q27', number: 27, prompt: 'Hvorfor synger du på dansk?', type: 'paragraph-match', options: ['B','C','D','E','F','G','H'], answer: 'E', points: 1 },
          { id: 'q28', number: 28, prompt: 'Kan du tjene nok som musiker?', type: 'paragraph-match', options: ['B','C','D','E','F','G','H'], answer: 'B', points: 1 },
          { id: 'q29', number: 29, prompt: 'Er der nogen ulemper ved at være musiker?', type: 'paragraph-match', options: ['B','C','D','E','F','G','H'], answer: 'D', points: 1 },
          { id: 'q30', number: 30, prompt: 'Hvad drømmer du om i fremtiden?', type: 'paragraph-match', options: ['B','C','D','E','F','G','H'], answer: 'G', points: 1 },
        ],
      },
    ],
  },
]

export const readingExams: ReadingExam[] = [...handCraftedExams, ...readingArchive].sort(
  (a, b) => b.exam.year - a.exam.year || (a.exam.season === 'Sommer' ? -1 : 1),
)

export function getReadingExam(id: string) {
  return readingExams.find((e) => e.id === id)
}
