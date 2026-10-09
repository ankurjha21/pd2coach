import importlib, json, re, sys
import extract_all_reading as m
importlib.reload(m)

SEASON_MONTHS = {'Sommer': 'Maj-juni', 'Vinter': 'November-december'}

# Manual overrides for one-off archive naming inconsistencies discovered
# during extraction (confirmed by direct inspection of the source PDFs).
OVERRIDES = {
    (2016, 'Sommer'): {
        'q1': "/Users/ankur/infra-new/infra-global-projects-v1.worktrees/pd2-coach-preparation-tool/source-papers/extracted/PD2 Exams/2016/Sommer/Skriftlig del/Teksthæfte.pdf",
        't1': "/Users/ankur/infra-new/infra-global-projects-v1.worktrees/pd2-coach-preparation-tool/source-papers/extracted/PD2 Exams/2016/Sommer/Skriftlig del/Teksthæfte.pdf",
    },
    (2019, 'Sommer'): {
        'q1': "/Users/ankur/infra-new/infra-global-projects-v1.worktrees/pd2-coach-preparation-tool/source-papers/extracted/PD2 Exams/2019/Sommer/Skriftlig del/Læseforståelse 2.pdf",
        't1': "/Users/ankur/infra-new/infra-global-projects-v1.worktrees/pd2-coach-preparation-tool/source-papers/extracted/PD2 Exams/2019/Sommer/Skriftlig del/Læseforståelse 1.pdf",
        'skip_l2': True,
    },
}

def build_exam(year, season, skip_existing=()):
    key = f"{year}-{season.lower()}"
    if key in skip_existing:
        return None

    override = OVERRIDES.get((year, season), {})
    q1, t1 = m.find_l1_combined(year, season)
    if 'q1' in override:
        q1, t1 = override['q1'], override['t1']
    if not q1:
        print(f"SKIP {year} {season}: no opgave1 files found", file=sys.stderr)
        return None

    censor = m.find_censor(year, season)
    if not censor:
        print(f"SKIP {year} {season}: no censor file", file=sys.stderr)
        return None
    answer_key = m.parse_answer_key(censor)
    if len(answer_key) < 24:
        print(f"SKIP {year} {season}: incomplete answer key ({len(answer_key)})", file=sys.stderr)
        return None

    try:
        questions1, source1 = m.extract_opgave1(q1, t1)
    except Exception as e:
        print(f"SKIP {year} {season}: opgave1 extraction error {e}", file=sys.stderr)
        return None
    if len(questions1) != 7 or len(source1) < 200:
        print(f"SKIP {year} {season}: opgave1 incomplete (q={len(questions1)} len={len(source1)})", file=sys.stderr)
        return None

    tasks = []
    opg1_questions = []
    for q in questions1:
        num = q['number']
        ans, pts = answer_key.get(num, ('', 0 if num == 0 else 1))
        opg1_questions.append({
            'id': f'q{num}',
            'number': num,
            'prompt': q['prompt'],
            'type': 'short-answer',
            'answer': ans,
            'points': pts,
        })
    tasks.append({
        'id': f'{key}-opg1',
        'opgaveNumber': 1,
        'part': 'Delprøve 1',
        'title': 'Søg informationer (skimming/scanning)',
        'type': 'short-answer',
        'timeMinutes': 30,
        'instructions': 'Svar på spørgsmålene. Find oplysningerne i teksthæftet. Svar kort og præcist.',
        'sourceText': source1,
        'questions': opg1_questions,
    })

    try:
        questions2, source2, letters2 = m.extract_opgave2(q1)
    except Exception as e:
        questions2, source2, letters2 = [], '', []
        print(f"NOTE {year} {season}: opgave2 extraction error {e}", file=sys.stderr)
    if len(letters2) == 9 and len(questions2) == 7:
        opg2_questions = []
        for q in questions2:
            num = q['number']
            ans, pts = answer_key.get(num, ('', 0 if num == 0 else 1))
            opg2_questions.append({
                'id': f'q{num}',
                'number': num,
                'prompt': q['prompt'],
                'type': 'matching',
                'options': [] if num == 0 else [l for l in 'ABCDEFGHI'],
                'answer': ans,
                'points': pts,
            })
        tasks.append({
            'id': f'{key}-opg2',
            'opgaveNumber': 2,
            'part': 'Delprøve 1',
            'title': 'Annoncer (match ord til annonce)',
            'type': 'matching',
            'instructions': 'Der mangler et eller flere ord i hver annonce. Find den annonce (A-I), der passer til ordene på listen. Der er to annoncer, du ikke skal bruge.',
            'sourceText': source2,
            'questions': opg2_questions,
        })
    else:
        print(f"NOTE {year} {season}: opgave2 incomplete (letters={len(letters2)} clues={len(questions2)}), skipped", file=sys.stderr)

    if not override.get('skip_l2'):
        l2 = m.find_l2(year, season)
        if l2:
            segs = m.split_l2_segments(l2)
            if segs:
                title3, body3, wordbank3 = m.extract_opgave3(segs[0])
                body4, options4 = m.extract_opgave45(segs[1], l2_path=l2)
                q5 = m.extract_opgave5_questions(segs[2])
                title4_match = re.search(r'korrekt svar\.\s*\n([^\n]+)', body4)
                title4 = title4_match.group(1).strip() if title4_match else 'Sætningsindsættelse'
                # opg5 body = everything between its title block and the
                # final "Instruktion" (which precedes the real question list)
                seg5 = segs[2]
                title5_match = re.search(r'Opgave 5\s*\n([^\n]+)(?:\n(–[^\n]+))?', seg5)
                title5_parts = [p for p in (title5_match.groups() if title5_match else []) if p]
                title5 = re.sub(r'\s+', ' ', ' '.join(title5_parts)).strip() if title5_parts else 'Interview'
                body5 = m.extract_opgave5_body(l2, title5)
                ok3 = len(wordbank3) >= 12
                ok4 = len(options4) == 8
                ok5 = len(q5) == 6
                if ok3 and ok4 and ok5:
                    # Opgave 3 (cloze)
                    opg3_questions = []
                    for num in range(13, 21):
                        ans, pts = answer_key.get(num, ('', 1))
                        opg3_questions.append({
                            'id': f'q{num}', 'number': num,
                            'prompt': f'Udfyld ord nummer {num} i teksten.',
                            'type': 'cloze', 'answer': ans, 'points': pts,
                        })
                    wb_display = ", ".join(sorted(set(wordbank3)))
                    tasks.append({
                        'id': f'{key}-opg3',
                        'opgaveNumber': 3, 'part': 'Delprøve 2',
                        'title': f'{title3} (udfyld manglende ord)',
                        'type': 'cloze', 'timeMinutes': 60,
                        'instructions': 'Læs teksten. Skriv de ord, der mangler. Ordene findes i rammen nederst. Der er fem ord, du ikke skal bruge.',
                        'sourceText': body3.strip() + f"\n\nOrdbank: {wb_display}",
                        'questions': opg3_questions,
                    })
                    # Opgave 4 (sentence-gap)
                    opg4_questions = []
                    for num in range(21, 26):
                        ans, pts = answer_key.get(num, ('', 1))
                        opg4_questions.append({
                            'id': f'q{num}', 'number': num,
                            'prompt': f'Hvilken sætning passer i afsnit {num}?',
                            'type': 'sentence-gap',
                            'options': sorted(options4.keys()),
                            'answer': ans, 'points': pts,
                        })
                    options_display = "\n".join(f"{letter} {text}" for letter, text in sorted(options4.items()))
                    body4_clean = body4[body4.find(title4):].strip() if title4 in body4 else body4.strip()
                    tasks.append({
                        'id': f'{key}-opg4',
                        'opgaveNumber': 4, 'part': 'Delprøve 2',
                        'title': f'{title4} (manglende sætning)',
                        'type': 'sentence-gap',
                        'instructions': 'Læs teksten. I hvert afsnit mangler der en sætning. Find den sætning (A-H), der passer. Der er to sætninger, du ikke skal bruge.',
                        'sourceText': body4_clean + f"\n\n{options_display}",
                        'questions': opg4_questions,
                    })
                    # Opgave 5 (paragraph-match)
                    opg5_questions = []
                    for q in q5:
                        num = q['number']
                        ans, pts = answer_key.get(num, ('', 0 if num == 0 else 1))
                        entry = {
                            'id': f'q{num}', 'number': num,
                            'prompt': q['prompt'], 'type': 'paragraph-match',
                            'answer': ans, 'points': pts,
                        }
                        if num != 0:
                            entry['options'] = list('ABCDEFGH')
                        opg5_questions.append(entry)
                    tasks.append({
                        'id': f'{key}-opg5',
                        'opgaveNumber': 5, 'part': 'Delprøve 2',
                        'title': f'{title5} (match spørgsmål til afsnit)',
                        'type': 'paragraph-match',
                        'instructions': 'Læs interviewet. Find det afsnit (A-H), der passer til hvert spørgsmål. Der er to afsnit, du ikke skal bruge.',
                        'sourceText': (body5 if len(body5) > 100 else '(Se teksthæftet for den fulde interviewtekst med afsnit A-H.)'),
                        'questions': opg5_questions,
                    })
                else:
                    print(f"NOTE {year} {season}: opgave 3/4/5 extraction incomplete, included opgave1 only", file=sys.stderr)

    label = f"{SEASON_MONTHS[season]} {year}"
    return {
        'id': f'pd2-{year}-{season.lower()}',
        'exam': {'year': year, 'season': season, 'label': label},
        'tasks': tasks,
    }

if __name__ == '__main__':
    skip_existing = {'2022-sommer', '2023-sommer'}  # already hand-crafted in reading.ts
    exams = []
    for year in range(2013, 2024):
        for season in ['Sommer', 'Vinter']:
            exam = build_exam(year, season, skip_existing)
            if exam:
                exams.append(exam)
    print(json.dumps(exams, ensure_ascii=False), file=sys.stdout)
    print(f"\n\nGenerated {len(exams)} exams", file=sys.stderr)
