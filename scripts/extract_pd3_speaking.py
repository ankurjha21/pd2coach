"""Extract PD3 (Prøve i Dansk 3) speaking (Mundtlig kommunikation) topics for
a list of exam sessions.

The candidate-facing "Mundtlig kommunikation" booklet only has topic titles
(the actual picture prompts aren't extractable text), so all real content
comes from the "Censor- og eksaminatorhæfte" (examiner script), which gives
the exact questions the examiner is scripted to ask. The exact layout
changed across years:
  - 2018-2021: one combined "Ark med to billeder" situation per topic, with
    the examiner choosing between two alternative first questions (A/B),
    then a single shared second question.
  - 2022-2024: two separate picture situations per topic, each with its own
    first question, plus a single shared second question.

Produces scripts/pd3_json/speaking.json.
"""
import json
import os
import re
import sys

import pdfplumber

sys.path.insert(0, os.path.dirname(__file__))
from pd3_common import SESSIONS, find_file, clean_text

OUT_DIR = os.path.join(os.path.dirname(__file__), 'pd3_json')
os.makedirs(OUT_DIR, exist_ok=True)


def session_id(year, season):
    return f"{year}-{'sommer' if season == 'Sommer' else 'vinter'}"


QUOTE_RE = re.compile(r'[”"]([^”"]+)[”"]', re.S)


HYPHEN_BREAK_RE = re.compile(r'(\w+)-\s+(\w+)')
# Danish sometimes legitimately writes elliptical compounds like
# 'social- og sundhedsassistenter' (hyphen + space + short conjunction) -
# don't merge those; only fix genuine line-wrap remnants like 'Hvil- ke'.
_HYPHEN_SAFE_WORDS = {'og', 'at', 'som', 'der', 'en', 'et', 'de', 'i', 'på', 'for', 'med'}


def fix_hyphenation(s):
    def repl(m):
        if m.group(2).lower() in _HYPHEN_SAFE_WORDS:
            return m.group(0)
        return m.group(1) + m.group(2)
    return HYPHEN_BREAK_RE.sub(repl, s)


def first_quote(text):
    m = QUOTE_RE.search(text)
    return fix_hyphenation(clean_text(m.group(1)).replace('\n', ' ')).strip() if m else ''


def extract_topic_block(block, letter):
    """block = raw text from this topic's 'A.'/'B.'/'C.' marker up to the
    next topic marker (or end of booklet)."""
    # the topic's own title, e.g. "Støtte til kultur" or "Transportformer"
    title_m = re.match(r'\s*(.+)', block.split('\n', 1)[0])
    title = clean_text(title_m.group(1)).strip() if title_m else letter

    idx_first = block.find('Første obligatoriske spørgsmål')
    idx_second = block.find('Andet obligatoriske spørgsmål')
    if idx_first == -1 or idx_second == -1:
        return None
    first_section = block[idx_first:idx_second]
    second_section = block[idx_second:idx_second + 1200]

    situations = []

    # 2022+ style: 'Emne A' / 'Emne B' sub-headers, each with its own
    # 'Forslag til indledning:' + 'Obligatorisk(?:e)? spørgsmål:' + follow-up.
    sub_topics = list(re.finditer(r'\nEmne\s+([AB])\b', first_section))
    if sub_topics:
        for idx, m in enumerate(sub_topics):
            sub_label = m.group(1)
            start = m.end()
            end = sub_topics[idx + 1].start() if idx + 1 < len(sub_topics) else len(first_section)
            chunk = first_section[start:end]
            intro_m = re.search(r'Forslag til indledning:\s*(.+?)(?=Obligatorisk(?:e)? spørgsmål:)', chunk, re.S)
            intro = first_quote(intro_m.group(1)) if intro_m else ''
            q_m = re.search(r'Obligatorisk(?:e)? spørgsmål:\s*(.+?)(?=Forslag til opfølgende|\Z)', chunk, re.S)
            question = first_quote(q_m.group(1)) if q_m else ''
            fu_m = re.search(r'Forslag til opfølgende spørgsmål:\s*(.+)', chunk, re.S)
            followup = first_quote(fu_m.group(1)) if fu_m else ''
            situations.append({
                'label': f'Situation {sub_label}',
                'description': intro,
                'firstQuestions': [{'question': question, 'followUp': followup}] if question else [],
            })
    else:
        # 2018-2021 style: one shared description, then 'A.'/'B.' alternative
        # obligatory questions (examiner picks one), each with its own follow-up.
        # The description sits *before* the 'Første obligatoriske spørgsmål'
        # marker, so it's searched for in the pre-marker part of the block.
        pre_first = block[:idx_first]
        desc_m = re.search(r'siger:\s*(.+?)(?=Efter ca\.)', pre_first, re.S)
        description = first_quote(desc_m.group(1)) if desc_m else ''
        alt_m = re.search(r'Eksaminator vælger spørgsmål A eller spørgsmål B\.(.+)', first_section, re.S)
        alt_text = alt_m.group(1) if alt_m else first_section
        alt_markers = list(re.finditer(r'\n\s*([AB])\.\s*[”"]', '\n' + alt_text))
        first_questions = []
        if alt_markers:
            for idx, m in enumerate(alt_markers):
                start = m.start()
                end = alt_markers[idx + 1].start() if idx + 1 < len(alt_markers) else len(alt_text) + 1
                chunk = ('\n' + alt_text)[start:end]
                q_m = re.search(r'[”"](.+?)[”"]', chunk, re.S)
                question = clean_text(q_m.group(1)).replace('\n', ' ').strip() if q_m else ''
                fu_m = re.search(r'Forslag til opfølgende spørgsmål:\s*(.+)', chunk, re.S)
                followup = first_quote(fu_m.group(1)) if fu_m else ''
                if question:
                    first_questions.append({'question': question, 'followUp': followup})
        else:
            q = first_quote(alt_text)
            if q:
                first_questions.append({'question': q})
        situations.append({
            'label': 'Situation',
            'description': description,
            'firstQuestions': first_questions,
        })

    # shared second question, applied to every situation
    q2_m = re.search(r'(?:Obligatorisk(?:e)? spørgsmål:\s*)?(.+?)(?=Forslag til opfølgende spørgsmål:|\Z)',
                      second_section[len('Andet obligatoriske spørgsmål'):], re.S)
    second_question = first_quote(q2_m.group(1)) if q2_m else ''
    fu2_m = re.search(r'Forslag til opfølgende spørgsmål:\s*(.+)', second_section, re.S)
    second_followup = first_quote(fu2_m.group(1)) if fu2_m else ''
    for sit in situations:
        if second_question:
            sit['secondQuestion'] = {'question': second_question, 'followUp': second_followup}

    situations = [s for s in situations if s['firstQuestions']]
    if not situations:
        return None
    return {
        'id': f'topic-{letter.lower()}',
        'letter': letter,
        'title': title,
        'situations': situations,
    }


def extract_topic_titles(session_folder):
    """The candidate-facing 'Mundtlig kommunikation' booklet reliably lists
    each topic as 'Emne A – <title>' with no surrounding noise; use it to
    validate real topic-header matches in the (noisier) examiner booklet."""
    path = find_file(session_folder, '3 speaking', 'mundtlig kommunikation') or \
        find_file(session_folder, '3 speaking', 'opgaveark')
    if not path:
        return {}
    with pdfplumber.open(path) as pdf:
        text = '\n'.join((p.extract_text() or '') for p in pdf.pages)
    titles = {}
    for m in re.finditer(r'Emne\s+([ABC])\s*[\u2013-]\s*(.+)', text):
        titles[m.group(1)] = clean_text(m.group(2)).split('\n')[0].strip()
    return titles


def extract_speaking(session_folder):
    censor_path = find_file(session_folder, '3 speaking', 'censor')
    if not censor_path:
        return None
    with pdfplumber.open(censor_path) as pdf:
        full_text = '\n'.join((p.extract_text() or '') for p in pdf.pages)

    titles = extract_topic_titles(session_folder)

    # topic markers look like 'A. Støtte til kultur' / 'A: Transportformer' /
    # 'Emne A: Transportformer' / 'Emne A – Transportformer' - but a bare
    # letter+punctuation marker also appears for the unrelated 'A/B'
    # alternative-question choice inside Delprøve 1's content, so candidates
    # are validated against the known title from the candidate-facing
    # booklet before being accepted as a real topic boundary.
    marker_re = re.compile(r'\n(?:Emne\s+)?([ABC])[.:\u2013-]\s*(?=[^\n]{2,80}\n)')
    candidates = list(marker_re.finditer('\n' + full_text))
    valid = []
    for m in candidates:
        letter = m.group(1)
        expected = titles.get(letter, '')
        if not expected:
            continue
        tail = ('\n' + full_text)[m.end():m.end() + 80]
        first_word = expected.split(' ')[0].strip()
        if first_word and tail.strip().lower().startswith(first_word.lower()[:6]):
            valid.append((letter, m))

    topics = []
    seen_letters = set()
    for idx, (letter, m) in enumerate(valid):
        start = m.end()
        end = valid[idx + 1][1].start() if idx + 1 < len(valid) else len(full_text) + 1
        block = ('\n' + full_text)[start:end]
        if 'Første obligatoriske spørgsmål' not in block or letter in seen_letters:
            continue
        topic = extract_topic_block(block, letter)
        if topic:
            topic['title'] = titles.get(letter, topic['title'])
            topics.append(topic)
            seen_letters.add(letter)
    return topics


def main():
    results = []
    for folder, year, season, label in SESSIONS:
        sid = session_id(year, season)
        topics = extract_speaking(folder)
        if not topics:
            print(f'SKIP {sid}: no speaking content found')
            continue
        results.append({
            'id': f'pd3-{sid}',
            'exam': {'year': year, 'season': season, 'label': label},
            'topics': topics,
        })
        summary = [(t['letter'], t['title'][:30], len(t['situations']),
                    [len(s['firstQuestions']) for s in t['situations']]) for t in topics]
        print(f'OK {sid}: {summary}')

    out_path = os.path.join(OUT_DIR, 'speaking.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f'\nWrote {len(results)} exams to {out_path}')


if __name__ == '__main__':
    main()
