"""Extract PD3 (Prøve i Dansk 3) reading content for a list of exam sessions.

Produces one JSON file per session under scripts/pd3_json/reading-<id>.json
with the shape of types.ts's PD3ReadingExam.
"""
import json
import os
import re
import sys

import pdfplumber

sys.path.insert(0, os.path.dirname(__file__))
from pd3_common import SESSIONS, find_file, extract_plain, clean_text, nfc, is_junk_line
from pdf_column_extract import extract_columns

OUT_DIR = os.path.join(os.path.dirname(__file__), 'pd3_json')
os.makedirs(OUT_DIR, exist_ok=True)


def session_id(year, season):
    return f"{year}-{'sommer' if season == 'Sommer' else 'vinter'}"


# ---------------- Delprøve 1 (short-answer search) ----------------

GROUP_HEADING_RE = re.compile(r'^Søg informationer (under|om)\b.*', re.IGNORECASE)
QUESTION_START_RE = re.compile(r'^(\d{1,2})\.\s+(.*)$')


def parse_delprove1_questions(opgave_text):
    lines = [l for l in opgave_text.split('\n')]
    questions = []
    current = None
    group_heading = None
    started = False
    for line in lines:
        s = line.strip()
        if not s:
            continue
        if GROUP_HEADING_RE.match(s):
            group_heading = s
            continue
        m = QUESTION_START_RE.match(s)
        if m:
            started = True
            if current:
                questions.append(current)
            current = {
                'number': int(m.group(1)),
                'prompt': m.group(2).strip(),
                'groupHeading': group_heading or '',
            }
        elif started and current is not None:
            # continuation of a multi-line question, but stop once we hit
            # an unrelated trailing footer-ish fragment
            if re.match(r'^(MAJ-JUNI|NOVEMBER-DECEMBER)', s):
                continue
            current['prompt'] += ' ' + s
    if current:
        questions.append(current)
    # de-duplicate by number (keep first) and sort
    seen = {}
    for q in questions:
        if q['number'] not in seen:
            seen[q['number']] = q
    return [seen[k] for k in sorted(seen)]


ANSWER_LINE_RE = re.compile(r'^(\d{1,2})\.\s+(.*?)\s+(\d)$')


def parse_rettenoegle_block(block_text):
    """Parse a 'Svar Point' answer-key block into {number: (answer, points)}.
    Some answers wrap onto a continuation line (the points digit appears at
    the end of the *first* visual line, with the rest of the answer text
    following on the next line with no leading number) - those are appended
    to the previous answer. Everything from 'Der gives'/'I alt'/'Bemærk'
    onward is boilerplate/footer and is never appended to an answer."""
    answers = {}
    last_num = None
    footer_started = False
    for raw_line in block_text.split('\n'):
        s = raw_line.strip()
        if not s:
            continue
        m = ANSWER_LINE_RE.match(s)
        if m and not footer_started:
            num = int(m.group(1))
            answers[num] = [m.group(2).strip(), int(m.group(3))]
            last_num = num
            continue
        if s == 'Svar Point' or s.startswith('Vejledende') or s.startswith('Rettenøgle'):
            continue  # header line, appears before the answer list
        if s.startswith('Der gives') or s.startswith('I alt') or s.startswith('Bemærk'):
            footer_started = True
            continue
        if not footer_started and last_num is not None:
            # continuation of the previous answer's text
            answers[last_num][0] = (answers[last_num][0] + ' ' + s).strip()
    return {k: (v[0], v[1]) for k, v in answers.items()}




def split_censor_reading_blocks(censor_text):
    """Split the censor booklet's 'Læseforståelse' section into per-Delprøve
    answer-key blocks, keyed by a normalized label like '1', '2a', '2b', '3'."""
    # find start of "2. Læseforståelse"
    idx = censor_text.find('2. Læseforståelse')
    if idx == -1:
        idx = 0
    body = censor_text[idx:]
    # split on "Delprøve X" headers (X is 1, 2 A, 2A, 2 B, 2B, 3 ...)
    parts = re.split(r'(Delprøve\s*\d\s*[AB]?\s*[–-])', body)
    blocks = {}
    for i in range(1, len(parts), 2):
        header = parts[i]
        content = parts[i + 1] if i + 1 < len(parts) else ''
        m = re.search(r'Delprøve\s*(\d)\s*([AB])?', header)
        if not m:
            continue
        label = m.group(1) + (m.group(2) or '').lower()
        blocks[label] = content
    return blocks


def extract_delprove1(session_folder, out):
    opgave_path = find_file(session_folder, '1 reading', 'læseforståelse 1', 'opgave') or \
        find_file(session_folder, '1 reading', 'laeseforstaaelse 1', 'opgave')
    tekst_path = find_file(session_folder, '1 reading', 'læseforståelse 1', 'tekst')
    censor_path = find_file(session_folder, '1 reading', 'censor')
    if not (opgave_path and tekst_path and censor_path):
        return None

    opgave_text = extract_plain(opgave_path)
    # title is on first page: "Delprøve 1:\n<Title>"
    title_m = re.search(r'Delprøve 1:\s*\n?(.*)', opgave_text)
    title = title_m.group(1).strip() if title_m else 'Delprøve 1'

    questions = parse_delprove1_questions(opgave_text)

    with pdfplumber.open(tekst_path) as pdf:
        n_pages = len(pdf.pages)
    # pages 0-1 are always a cover page + "Indhold" table of contents;
    # real passage content starts on page index 2. This directory-style
    # document is single-column prose with floating caption boxes (not a
    # true 2-column layout), so plain per-page extraction reads correctly -
    # column-aware extraction wrongly reorders it.
    body_pages = list(range(2, n_pages)) if n_pages > 2 else list(range(n_pages))
    tekst_raw = extract_plain(tekst_path, page_indices=body_pages)
    source_text = clean_text(tekst_raw)

    censor_text = extract_plain(censor_path)
    blocks = split_censor_reading_blocks(censor_text)
    answer_block = blocks.get('1', '')
    answers = parse_rettenoegle_block(answer_block)

    for q in questions:
        a = answers.get(q['number'])
        q['answer'] = a[0] if a else ''
        q['points'] = a[1] if a else 1

    return {
        'id': 'delprove-1',
        'type': 'short-answer',
        'letter': '1',
        'title': title,
        'instructions': 'Søg informationer i tekstsamlingen. Svar præcist og kort på spørgsmålene.',
        'points': sum(q['points'] for q in questions),
        'timeMinutes': 25,
        'sourceText': source_text,
        'shortAnswerQuestions': questions,
    }


# ---------------- Delprøve 2A (MCQ) ----------------

MCQ_Q_RE = re.compile(r'^(\d{1,2})\.?\s+(.*)$')
MCQ_OPT_RE = re.compile(r'^[^A-Za-z0-9]*([A-D])\.\s*(.*)$')
MCQ_JUNK_RE = re.compile(
    r'^(Opgaver til tekst|Delprøve|CPR-nummer|Bemærk|Læs teksten|Læs teksterne|'
    r'Instruktion|Til hvert|Der gives|Herunder|Sæt kryds|Sæt ét kryds|Sæt et kryds)'
)


def parse_mcq_block(text):
    questions = []
    current = None
    mode = 'question'
    for raw in text.split('\n'):
        s = raw.strip()
        if not s:
            continue
        if s.startswith('Sæt ét kryds') or s.startswith('Sæt et kryds'):
            mode = 'options'
            continue
        if MCQ_JUNK_RE.match(s) or is_junk_line(s):
            continue
        om = MCQ_OPT_RE.match(s)
        if om and current:
            current['options'].append({'label': om.group(1), 'text': om.group(2).strip()})
            continue
        qm = MCQ_Q_RE.match(s)
        if qm and not re.match(r'^(MAJ-JUNI|NOVEMBER-DECEMBER)\s+\d{4}', qm.group(2)):
            if current:
                questions.append(current)
            current = {'number': int(qm.group(1)), 'prompt': qm.group(2).strip(), 'options': []}
            mode = 'question'
        elif current:
            if mode == 'question' and not current['options']:
                current['prompt'] += ' ' + s
            elif mode == 'options' and current['options']:
                # continuation of the previous option's text
                current['options'][-1]['text'] = (current['options'][-1]['text'] + ' ' + s).strip()
    if current:
        questions.append(current)
    return questions


def strip_leading_title_noise(text, title):
    """The teksthæfte/opgavehæfte body text for each Delprøve section is
    often preceded by 1-3 repeated/garbled copies of the section title
    (cover-page remnants, running headers) before the real prose begins.
    Strip leading lines that are just the title (optionally with a stray
    leading ':' or '–')."""
    if not title:
        return text.strip()
    title_norm = re.sub(r'[^\w\s]', '', title).strip().lower()
    lines = text.split('\n')
    i = 0
    while i < len(lines):
        line_norm = re.sub(r'[^\w\s]', '', lines[i]).strip().lower()
        if not line_norm:
            i += 1
            continue
        if line_norm in title_norm or title_norm in line_norm:
            i += 1
            continue
        break
    # second pass: a duplicated running-header line (e.g. '– X' then 'X')
    # can remain right at the new start even when it didn't match the title
    # closely enough (OCR/kerning glitches); drop it if the next line repeats it.
    while i + 1 < len(lines):
        a = re.sub(r'[^\w\s]', '', lines[i]).strip().lower()
        b = re.sub(r'[^\w\s]', '', lines[i + 1]).strip().lower()
        if a and a == b:
            i += 1
        else:
            break
    return '\n'.join(lines[i:]).strip()


def extract_mcq_section(opgave_sections, tekst_sections, censor_blocks, label, title=''):
    """label like '2a'"""
    opg_text = opgave_sections.get(label)
    tekst_text = clean_text(tekst_sections.get(label) or '')
    if opg_text is None:
        return None
    questions = [q for q in parse_mcq_block(opg_text) if q['options']]
    answers = parse_rettenoegle_block(censor_blocks.get(label, ''))
    for q in questions:
        a = answers.get(q['number'])
        q['correct'] = a[0].strip() if a else ''
        q['points'] = a[1] if a else 2
    return {
        'questions': questions,
        'passage': strip_leading_title_noise(tekst_text or '', title),
    }


# ---------------- Delprøve 2B (gap-match, paragraph insertion) ----------------

GAP_OPT_RE = re.compile(r'^([A-H])\.\s+(.*)$')


def parse_gap_options(text):
    options = []
    current = None
    for raw in text.split('\n'):
        s = raw.strip()
        if not s:
            continue
        m = GAP_OPT_RE.match(s)
        if m:
            if current:
                options.append(current)
            current = {'label': m.group(1), 'text': m.group(2)}
        elif current and not re.match(r'^\d(\s+\d)*$', s) and not s.startswith('Instruktion') and \
                not s.startswith('Læs teksten') and not s.startswith('I teksten') and \
                not s.startswith('På dette') and not s.startswith('Udfyld') and not s.startswith('Bogstavet') and \
                not s.startswith('Der gives'):
            current['text'] += ' ' + s
    if current:
        options.append(current)
    return options


def mark_paragraph_gaps(tekst_text):
    """In the teksthæfte, removed-paragraph markers appear as a lone digit
    on its own line. Replace with inline [[n]] markers and return cleaned text."""
    out_lines = []
    for raw in tekst_text.split('\n'):
        s = raw.strip()
        if re.match(r'^\d{1,2}$', s):
            out_lines.append(f'[[{s}]]')
        else:
            out_lines.append(raw)
    return '\n'.join(out_lines)


def extract_gapmatch_section(opgave_sections, tekst_sections, censor_blocks, label, title=''):
    opg_text = opgave_sections.get(label)
    tekst_text = tekst_sections.get(label)
    if opg_text is None:
        return None
    options = parse_gap_options(opg_text)
    # mark gaps on the raw text *before* junk-line cleanup, since the gap
    # markers are themselves standalone digit lines that would otherwise be
    # stripped as page-number noise.
    text_with_gaps = clean_text(mark_paragraph_gaps(tekst_text or ''))
    text_with_gaps = strip_leading_title_noise(text_with_gaps, title)
    answers = parse_rettenoegle_block(censor_blocks.get(label, ''))
    matches = []
    for num in sorted(answers):
        matches.append({'number': num, 'correct': answers[num][0].strip()})
    points = sum(a[1] for a in answers.values()) if answers else 0
    return {
        'textWithGaps': text_with_gaps,
        'gapOptions': options,
        'gapMatches': matches,
        'points': points,
    }


# ---------------- Delprøve 3 (cloze) ----------------

CLOZE_ROW_RE = re.compile(r'^(\d)\s+(.*)$')


def parse_cloze_rows(text):
    """Rows like: '1 omvendt alligevel derfor dog' -> split into 4 options.
    Uses multi-space runs as the split boundary; falls back to even split."""
    items = {}
    for raw in text.split('\n'):
        s = raw.strip()
        if not s:
            continue
        m = CLOZE_ROW_RE.match(s)
        if not m:
            continue
        num = m.group(1)
        if num == '0':
            continue  # the worked example row
        rest = m.group(2)
        # remove a trailing 'X' answer marker from the (irrelevant) example row
        parts = re.split(r'\s{2,}', rest.strip())
        if len(parts) < 4:
            parts = rest.split()
        if len(parts) >= 4:
            items[int(num)] = parts[:4]
    return items


def extract_cloze_section(opgave_sections, tekst_sections, censor_blocks, label, title=''):
    opg_text = opgave_sections.get(label)
    tekst_text = clean_text(tekst_sections.get(label) or '')
    tekst_text = strip_leading_title_noise(tekst_text, title)
    if opg_text is None:
        return None
    rows = parse_cloze_rows(opg_text)
    text_with_gaps = re.sub(r'\((\d)\)\s*…', lambda m: f'[[{m.group(1)}]]', tekst_text or '')
    answers = parse_rettenoegle_block(censor_blocks.get(label, ''))
    cloze_items = []
    for num in sorted(rows):
        opts = rows[num]
        letters = ['A', 'B', 'C', 'D']
        options = [{'label': letters[i], 'text': opts[i]} for i in range(min(4, len(opts)))]
        correct = answers.get(num, ('', 1))[0].strip()
        cloze_items.append({'number': num, 'options': options, 'correct': correct})
    points = sum(a[1] for a in answers.values()) if answers else 0
    return {
        'textWithGaps': text_with_gaps,
        'clozeItems': cloze_items,
        'points': points,
    }


# ---------------- Reading 2 orchestration ----------------

def split_by_delprove(text, titles=None):
    """Split opgavehæfte/teksthæfte text into sections keyed by '2a'/'2b'/'3'.
    Section headers in the real exam PDFs are inconsistent (dash sometimes
    before the number, sometimes missing entirely, and stray pointer lines
    like 'Delprøve 3 er på bagsiden!' can look like a header) so candidate
    matches are validated against the known title text extracted from the
    paper's table-of-contents page."""
    pattern = re.compile(r'Delprøve\s*[–-]?\s*(\d)\s*([AB])?')
    candidates = list(pattern.finditer(text))
    valid = []
    for m in candidates:
        label = m.group(1) + (m.group(2) or '').lower()
        if titles:
            expected = titles.get(label, '')
            tail = text[m.end():m.end() + 80]
            tail_clean = re.sub(r'^[\s:–-]+', '', tail)
            first_word = expected.split(' ')[0].strip() if expected else ''
            if first_word and not tail_clean.lower().startswith(first_word.lower()[:6]):
                continue
        valid.append((label, m))
    sections = {}
    for idx, (label, m) in enumerate(valid):
        start = m.end()
        end = valid[idx + 1][1].start() if idx + 1 < len(valid) else len(text)
        sections[label] = sections.get(label, '') + text[start:end]
    return sections


def extract_reading2(session_folder):
    opgave_path = find_file(session_folder, '1 reading', 'læseforståelse 2', 'opgave')
    tekst_path = find_file(session_folder, '1 reading', 'læseforståelse 2', 'tekst')
    censor_path = find_file(session_folder, '1 reading', 'censor')
    if not (opgave_path and tekst_path and censor_path):
        return []

    opgave_full = extract_plain(opgave_path)
    tekst_full = extract_columns(tekst_path)
    censor_full = extract_plain(censor_path)

    # title line, e.g. "Delprøve 2A: At skifte branche" (titles can wrap onto
    # a second physical line, so capture greedily until the next boilerplate
    # marker or the next Delprøve entry).
    titles = {}
    for m in re.finditer(r'Delprøve\s*(\d)\s*([AB])?:\s*(.+?)(?=\n(?:Der er et|Delprøve\s*\d|$))',
                          opgave_full, re.S):
        label = m.group(1) + (m.group(2) or '').lower()
        titles[label] = re.sub(r'\s+', ' ', m.group(3)).strip()

    opgave_sections = split_by_delprove(opgave_full, titles)
    tekst_sections_raw = split_by_delprove(tekst_full, titles)
    opgave_sections = {k: v for k, v in opgave_sections.items()}
    censor_blocks = split_censor_reading_blocks(censor_full)

    out_sections = []
    for label in sorted(titles.keys()):
        title = titles[label]
        if label == '2a':
            data = extract_mcq_section(opgave_sections, tekst_sections_raw, censor_blocks, label, title)
            if not data:
                continue
            out_sections.append({
                'id': 'delprove-2a',
                'type': 'mcq',
                'letter': '2A',
                'title': title,
                'instructions': 'Læs teksten. Der er tre svarmuligheder (A, B, C) til hvert spørgsmål. Sæt ét kryds.',
                'points': sum(q['points'] for q in data['questions']),
                'passage': data['passage'],
                'mcqQuestions': data['questions'],
            })
        elif label == '2b':
            # 2B is either gap-match (2022+) or cloze (2018-2021) depending on
            # whether a separate "3" section also exists this year.
            if '3' in titles:
                data = extract_gapmatch_section(opgave_sections, tekst_sections_raw, censor_blocks, label, title)
                if not data:
                    continue
                out_sections.append({
                    'id': 'delprove-2b',
                    'type': 'gap-match',
                    'letter': '2B',
                    'title': title,
                    'instructions': 'I teksten er der fjernet tekstdele. Match hvert tal med det bogstav for den tekstdel, der passer ind i teksten.',
                    'points': data['points'],
                    'textWithGaps': data['textWithGaps'],
                    'gapOptions': data['gapOptions'],
                    'gapMatches': data['gapMatches'],
                })
            else:
                data = extract_cloze_section(opgave_sections, tekst_sections_raw, censor_blocks, label, title)
                if not data:
                    continue
                out_sections.append({
                    'id': 'delprove-2b',
                    'type': 'cloze',
                    'letter': '2B',
                    'title': title,
                    'instructions': 'Der er fjernet ord eller udtryk fra teksten. Vælg det rigtige ord eller udtryk (A, B, C eller D) til hvert hul.',
                    'points': data['points'],
                    'textWithGaps': data['textWithGaps'],
                    'clozeItems': data['clozeItems'],
                })
        elif label == '3':
            data = extract_cloze_section(opgave_sections, tekst_sections_raw, censor_blocks, label, title)
            if not data:
                continue
            out_sections.append({
                'id': 'delprove-3',
                'type': 'cloze',
                'letter': '3',
                'title': title,
                'instructions': 'Der er fjernet ord eller udtryk fra teksten. Vælg det rigtige ord eller udtryk (A, B, C eller D) til hvert hul.',
                'points': data['points'],
                'textWithGaps': data['textWithGaps'],
                'clozeItems': data['clozeItems'],
            })
    return out_sections


def main():
    results = []
    for folder, year, season, label in SESSIONS:
        sid = session_id(year, season)
        delprove1 = extract_delprove1(folder, None)
        reading2_sections = extract_reading2(folder)
        if not delprove1 and not reading2_sections:
            print(f'SKIP {sid}: no reading content found')
            continue
        exam = {
            'id': f'pd3-{sid}',
            'exam': {'year': year, 'season': season, 'label': label},
            'papers': [],
        }
        if delprove1:
            exam['papers'].append({
                'id': 'laeseforstaaelse-1',
                'title': 'Læseforståelse 1',
                'sections': [delprove1],
            })
        if reading2_sections:
            exam['papers'].append({
                'id': 'laeseforstaaelse-2',
                'title': 'Læseforståelse 2',
                'sections': reading2_sections,
            })
        results.append(exam)
        n_q1 = len(delprove1['shortAnswerQuestions']) if delprove1 else 0
        n_sections2 = len(reading2_sections)
        print(f'OK {sid}: delprove1 questions={n_q1}, reading2 sections={n_sections2} ' +
              str([(s['letter'], s['type']) for s in reading2_sections]))

    out_path = os.path.join(OUT_DIR, 'reading.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f'\nWrote {len(results)} exams to {out_path}')


if __name__ == '__main__':
    main()
