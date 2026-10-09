"""Extract PD3 (Prøve i Dansk 3) writing prompts for a list of exam sessions.

Produces scripts/pd3_json/writing.json with the shape of types.ts's
PD3WritingExam: for each session, an email task (Delprøve 1) and two essay
choice tasks (Delprøve 2: A and B).
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from pd3_common import SESSIONS, find_file, extract_plain, clean_text, is_junk_line

OUT_DIR = os.path.join(os.path.dirname(__file__), 'pd3_json')
os.makedirs(OUT_DIR, exist_ok=True)


def session_id(year, season):
    return f"{year}-{'sommer' if season == 'Sommer' else 'vinter'}"


FOOTER_TAIL_RE = re.compile(r'\s*\d{0,3}\s*(MAJ-JUNI|NOVEMBER-DECEMBER)\s+\d{4}\s*\d{0,3}\s*$')


def strip_footer_tail(s):
    return FOOTER_TAIL_RE.sub('', s).strip()


MIN_WORDS_RE = re.compile(r'[Mm]inimum\s+(\d+)\s+ord')


def extract_min_words(text, default=100):
    m = MIN_WORDS_RE.search(text)
    return int(m.group(1)) if m else default


def extract_email_task(page_text):
    # situation setup sentence(s): between 'Situation' and 'Modtaget besked'
    sm = re.search(r'Situation\s*\n(.*?)\nModtaget besked', page_text, re.S)
    setup = clean_text(sm.group(1)) if sm else ''

    # the actual email body: between 'Signatur: Ingen' and 'Opgave'
    bm = re.search(r'Signatur:\s*Ingen\s*\n(.*?)\nOpgave', page_text, re.S)
    body = clean_text(bm.group(1)) if bm else ''
    body = re.sub(r'^…\s*', '', body.strip())

    # task bullets: lines starting with '•' after 'Opgave'
    om = re.search(r'\nOpgave\s*\n(.*)$', page_text, re.S)
    bullets = []
    if om:
        for line in om.group(1).split('\n'):
            s = line.strip()
            if s.startswith('•'):
                bullets.append(s.lstrip('•').strip())
            elif bullets and s and not is_junk_line(s) and not MIN_WORDS_RE.search(s):
                bullets[-1] = (bullets[-1] + ' ' + s).strip()

    min_words = extract_min_words(page_text, default=100)
    situation = (setup + ('\n\n' + body if body else '')).strip()
    bullets = [strip_footer_tail(b) for b in bullets]
    return {
        'id': 'email',
        'key': 'email',
        'title': 'En e-mail',
        'situation': situation,
        'bullets': bullets,
        'minWords': min_words,
    }


def extract_essay_task(page_text, key, letter):
    # title: "A: Sygefravær" (2018-2021) or "2A: Frivilligt arbejde" (2022+)
    tm = re.search(rf'\b2?{letter}:\s*(.+)', page_text)
    title = clean_text(tm.group(1)).split('\n')[0].strip() if tm else letter
    title = re.sub(r'[*¹\d]+$', '', title).strip()

    # context: between the title line and 'Opgave'
    idx_title_end = tm.end() if tm else 0
    om = re.search(r'\nOpgave\b', page_text)
    context_raw = page_text[idx_title_end:om.start()] if om else ''
    context_lines = [l for l in clean_text(context_raw).split('\n') if l.strip()]
    context = '\n'.join(context_lines).strip()

    bullets = []
    if om:
        tail = page_text[om.end():]
        for line in tail.split('\n'):
            s = line.strip()
            if s.startswith('•'):
                bullets.append(s.lstrip('•').strip())
            elif bullets and s and not is_junk_line(s) and not MIN_WORDS_RE.search(s) and \
                    'udgøre ca' not in s and not s.startswith('('):
                bullets[-1] = (bullets[-1] + ' ' + s).strip()

    min_words = extract_min_words(page_text, default=200)
    bullets = [strip_footer_tail(b) for b in bullets]
    return {
        'id': f'essay-{letter.lower()}',
        'key': key,
        'title': title,
        'situation': f'Delprøve 2{letter}',
        'context': context,
        'bullets': bullets,
        'minWords': min_words,
    }


def page_text_degarbled(page):
    """Most pages extract cleanly. A few PDFs in this collection have a
    double-exposure glyph bug where nearly every character is rendered
    twice at a slightly offset position, producing text like
    'DDeellpprrøøvvee'. Detect that and retry with a much looser
    dedupe_chars tolerance, which fixes readability at the cost of
    occasionally dropping a tightly-kerned character pair."""
    text = page.extract_text() or ''
    sample = re.sub(r'\s+', '', text)[:400]
    repeats = sum(1 for i in range(1, len(sample)) if sample[i] == sample[i - 1])
    if sample and repeats / len(sample) > 0.15:
        return page.dedupe_chars(tolerance=8).extract_text() or text
    return text


def extract_writing(session_folder):
    path = find_file(session_folder, '2 writing', 'skriftlig fremstilling') or \
        find_file(session_folder, '2 writing', 'skriftlig')
    if not path:
        return None
    with __import__('pdfplumber').open(path) as pdf:
        pages = [page_text_degarbled(p) for p in pdf.pages]
    if len(pages) < 3:
        return None

    email_page = pages[1] if len(pages) > 1 else ''
    essay_a_page = pages[2] if len(pages) > 2 else ''
    essay_b_page = pages[3] if len(pages) > 3 else essay_a_page

    tasks = []
    if email_page:
        tasks.append(extract_email_task(email_page))
    if essay_a_page:
        tasks.append(extract_essay_task(essay_a_page, 'essay-a', 'A'))
    if essay_b_page:
        tasks.append(extract_essay_task(essay_b_page, 'essay-b', 'B'))

    override = MANUAL_OVERRIDES.get(session_folder)
    if override:
        for task in tasks:
            if task['key'] in override:
                task.update(override[task['key']])

    return tasks


# This one exam's writing PDF has a genuine character-drop corruption bug
# (not just the double-exposure duplication every other file has) that no
# dedupe_chars tolerance fully recovers - "erhvervsuddannelser" extracts as
# "erhvervsud an elser" even in the best automatic pass. Hand-corrected from
# the best-effort extraction plus the standard PD3 essay-task structure.
MANUAL_OVERRIDES = {
    '2023 nov dec': {
        'essay-a': {
            'title': 'Mænds og kvinders valg af erhvervsuddannelser',
            'context': (
                'Andelen af mænd og kvinder optaget på erhvervsuddannelser fordelt efter uddannelsesområde i 2021.'
            ),
            'bullets': [
                'Beskriv kort hovedtrækkene i diagrammet.',
                'Fortæl, hvilke årsager der kan være til nogle af de forskelle, diagrammet viser.',
                'Vurdér, om den nuværende kønsfordeling på erhvervsuddannelserne er et problem for det danske samfund. Begrund dine synspunkter.',
            ],
        },
    },
}


def main():
    results = []
    for folder, year, season, label in SESSIONS:
        sid = session_id(year, season)
        tasks = extract_writing(folder)
        if not tasks:
            print(f'SKIP {sid}: no writing content found')
            continue
        results.append({
            'id': f'pd3-{sid}',
            'exam': {'year': year, 'season': season, 'label': label},
            'tasks': tasks,
        })
        print(f'OK {sid}: tasks=' + str([(t['key'], t['title'][:30], len(t['bullets']), t['minWords']) for t in tasks]))

    out_path = os.path.join(OUT_DIR, 'writing.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f'\nWrote {len(results)} exams to {out_path}')


if __name__ == '__main__':
    main()
