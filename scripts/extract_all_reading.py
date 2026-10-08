"""
Master extraction pipeline for ALL PD2 reading exams (2013-2023).
Produces structured JSON per exam with texts, questions, and answer keys,
reusing the box-rect / column-aware extraction techniques validated on
the 2022 & 2023 exams.
"""
import pdfplumber, re, json, glob, os, sys, unicodedata

BASE = "/Users/ankur/infra-new/infra-global-projects-v1.worktrees/pd2-coach-preparation-tool/source-papers/extracted/PD2 Exams"
OUT = "/Users/ankur/infra-new/infra-global-projects-v1.worktrees/pd2-coach-preparation-tool/source-papers/reading_json"

def listdir_nfc(folder):
    """macOS/APFS returns NFD-decomposed filenames (e.g. å as a+combining
    ring); normalize to NFC so substring matches against literal æ/ø/å in
    this source file work regardless of filesystem normalization."""
    return [(unicodedata.normalize('NFC', f), f) for f in os.listdir(folder)]
os.makedirs(OUT, exist_ok=True)

def find_file(year, season, patterns):
    folder = os.path.join(BASE, str(year), season, "Skriftlig del")
    if not os.path.isdir(folder):
        folder = os.path.join(BASE, str(year), season)
    if not os.path.isdir(folder):
        return None
    files = os.listdir(folder)
    for pat in patterns:
        for f in files:
            if re.search(pat, f, re.IGNORECASE):
                return os.path.join(folder, f)
    return None

def find_l1_combined(year, season):
    """Returns (questions_file, text_file). questions_file has instructions
    and numbered questions (may also include the text itself). text_file is
    the cleanest dedicated passage booklet, if a separate one exists."""
    folder_candidates = [os.path.join(BASE, str(year), season, "Skriftlig del"), os.path.join(BASE, str(year), season)]
    folder = next((f for f in folder_candidates if os.path.isdir(f)), None)
    if not folder:
        return None, None
    files = [orig for nfc, orig in listdir_nfc(folder) if 'æseforståelse 1' in nfc.lower() and nfc.lower().endswith('.pdf')]

    def norm(f):
        n = unicodedata.normalize('NFC', f).lower()
        # "teksthæfte til opgave N" names WHICH task the text belongs to;
        # it is not a combined tekst+opgave (questions) file.
        n = re.sub(r'tekst(?:h[æa]fte)?\s+til\s+opgave\s*\d*', 'tekst', n)
        return n

    both = [f for f in files if 'tekst' in norm(f) and 'opgave' in norm(f)]
    bare = [f for f in files if 'tekst' not in norm(f) and 'opgave' not in norm(f)]
    tekst_only = [f for f in files if 'tekst' in norm(f) and 'opgave' not in norm(f)]
    opgave_only = [f for f in files if 'opgave' in norm(f) and 'tekst' not in norm(f)]

    questions_candidates = both + bare + opgave_only
    questions_file = os.path.join(folder, questions_candidates[0]) if questions_candidates else None
    text_candidates = tekst_only + both + bare
    text_file = os.path.join(folder, text_candidates[0]) if text_candidates else None
    return questions_file, text_file

def find_l2(year, season):
    folder_candidates = [os.path.join(BASE, str(year), season, "Skriftlig del"), os.path.join(BASE, str(year), season)]
    folder = next((f for f in folder_candidates if os.path.isdir(f)), None)
    if not folder:
        return None
    files = [orig for nfc, orig in listdir_nfc(folder) if 'æseforståelse 2' in nfc.lower() and nfc.lower().endswith('.pdf')]
    return os.path.join(folder, files[0]) if files else None

def find_censor(year, season):
    folder_candidates = [os.path.join(BASE, str(year), season, "Skriftlig del"), os.path.join(BASE, str(year), season)]
    folder = next((f for f in folder_candidates if os.path.isdir(f)), None)
    if not folder:
        return None
    files = [f for f in os.listdir(folder) if re.search(r'censor.*eksaminator|eksaminator.*censor', f, re.IGNORECASE) and f.lower().endswith('.pdf')]
    # prefer ones mentioning skriftlig
    skr = [f for f in files if 'skrift' in f.lower()]
    chosen = skr[0] if skr else (files[0] if files else None)
    return os.path.join(folder, chosen) if chosen else None

def parse_answer_key(censor_path):
    """Returns {question_number: (answer_text, points)} parsed from the
    censor/eksaminator booklet's 'Rettenøgler' section. Anchored on
    'Delprøve 1' (always present, unlike the section heading which is
    sometimes mangled/lowercased by OCR-like font issues in older PDFs)."""
    with pdfplumber.open(censor_path) as pdf:
        text = "\n".join((p.extract_text() or "") for p in pdf.pages)
    idx = text.find('Delprøve 1 ')
    if idx == -1:
        idx = text.find('Delprøve 1')
    if idx == -1:
        return {}
    section = text[idx:idx + 3000]
    stop_idx = section.find('Bedømmerark')
    if stop_idx == -1:
        stop_idx = section.find('Bedømmelsesskema')
    if stop_idx != -1:
        section = section[:stop_idx]
    pattern = re.compile(r'^(\d+)\.\s+(.+?)\s+(\d)\s*$', re.MULTILINE)
    answers = {}
    for mobj in pattern.finditer(section):
        num, ans, pts = mobj.groups()
        answers[int(num)] = (ans.strip(), int(pts))
    return answers

# ---------- low-level text extraction helpers ----------

def group_into_lines(words_sorted, tol=3):
    lines = []
    cur_line = []
    cur_top = None
    for w in words_sorted:
        if cur_top is None or abs(w['top'] - cur_top) <= tol:
            cur_line.append(w)
            cur_top = w['top'] if cur_top is None else cur_top
        else:
            cur_line.sort(key=lambda x: x['x0'])
            lines.append(" ".join(x['text'] for x in cur_line))
            cur_line = [w]
            cur_top = w['top']
    if cur_line:
        cur_line.sort(key=lambda x: x['x0'])
        lines.append(" ".join(x['text'] for x in cur_line))
    return lines

def extract_page_columns(page):
    """2-column-aware text extraction for a single page (prose directories)."""
    words = page.extract_words(use_text_flow=False, keep_blank_chars=False)
    if not words:
        return ""
    xs = sorted(w['x0'] for w in words)
    gaps = []
    for i in range(1, len(xs)):
        gaps.append((xs[i] - xs[i-1], (xs[i] + xs[i-1]) / 2))
    gaps.sort(key=lambda g: -g[0])
    page_width = page.width
    split_x = None
    for gap_size, mid in gaps[:5]:
        if page_width * 0.3 < mid < page_width * 0.7 and gap_size > 8:
            split_x = mid
            break
    if split_x is None:
        words_sorted = sorted(words, key=lambda w: (round(w['top'], 1), w['x0']))
        return "\n".join(group_into_lines(words_sorted))
    left = [w for w in words if w['x0'] < split_x]
    right = [w for w in words if w['x0'] >= split_x]
    left_lines = group_into_lines(sorted(left, key=lambda w: (round(w['top'], 1), w['x0'])))
    right_lines = group_into_lines(sorted(right, key=lambda w: (round(w['top'], 1), w['x0'])))
    return "\n".join(left_lines) + "\n\n" + "\n".join(right_lines)

def extract_lettered_options(page, letters='ABCDEFGH'):
    """Extracts a lettered A-H sentence-option list. Handles the common PD2
    layout where each row is itself split into two x-ranges: a narrow
    label+first-word column, and a wider continuation-text column further
    right (NOT the same as simple 2-line wrapping) — by pairing rows across
    the two detected columns using vertical (top) position bands anchored
    on each letter marker, rather than assuming same-column wrapping."""
    words = page.extract_words(use_text_flow=False, keep_blank_chars=False)
    if not words:
        return {}
    xs = sorted(w['x0'] for w in words)
    gaps = []
    for i in range(1, len(xs)):
        gaps.append((xs[i] - xs[i - 1], (xs[i] + xs[i - 1]) / 2))
    gaps.sort(key=lambda g: -g[0])
    page_width = page.width
    split_x = None
    for gap_size, mid in gaps[:5]:
        if page_width * 0.3 < mid < page_width * 0.7 and gap_size > 8:
            split_x = mid
            break
    left = [w for w in words if split_x is None or w['x0'] < split_x]
    right = [w for w in words if split_x is not None and w['x0'] >= split_x]
    left_sorted = sorted(left, key=lambda w: (round(w['top'], 1), w['x0']))

    # Find each letter marker's row (top) and immediate first-word on the
    # same row within the left column. The example option is occasionally
    # typeset as lowercase (e.g. "a") in a couple of older exams.
    marker_set = set(letters) | {c.lower() for c in letters}
    marker_rows = []  # list of (letter, top, firstword_text)
    i = 0
    while i < len(left_sorted):
        w = left_sorted[i]
        if w['text'] in marker_set and (w['x1'] - w['x0']) < 11:
            row_top = w['top']
            rest = []
            j = i + 1
            while j < len(left_sorted) and abs(left_sorted[j]['top'] - row_top) <= 4:
                rest.append(left_sorted[j]['text'])
                j += 1
            marker_rows.append((w['text'].upper(), row_top, " ".join(rest)))
            i = j
        else:
            i += 1

    if not marker_rows:
        return {}
    if not right:
        return {letter: firstword for letter, _, firstword in marker_rows}

    right_sorted = sorted(right, key=lambda w: (round(w['top'], 1), w['x0']))
    options = {}
    for idx, (letter, row_top, firstword) in enumerate(marker_rows):
        band_start = row_top - 3
        band_end = marker_rows[idx + 1][1] - 3 if idx + 1 < len(marker_rows) else row_top + 200
        band_words = [w['text'] for w in right_sorted if band_start <= w['top'] < band_end]
        continuation = " ".join(band_words).strip()
        options[letter] = (firstword + " " + continuation).strip()
    return options

def extract_boxes(page, min_area=4000):
    words = page.extract_words()
    seen = set(); boxes = []
    for r in page.rects:
        key = (round(r['x0']), round(r['top']), round(r['x1']), round(r['bottom']))
        area = (r['x1'] - r['x0']) * (r['bottom'] - r['top'])
        if key in seen or area < min_area:
            continue
        seen.add(key); boxes.append(r)
    boxes.sort(key=lambda b: (b['x0'] > 200, b['top']))
    results = []
    for b in boxes:
        bx0, bt, bx1, bb = b['x0'], b['top'], b['x1'], b['bottom']
        contained = [w for w in words if bx0 - 1 <= w['x0'] < bx1 + 1 and bt - 1 <= w['top'] < bb + 1]
        contained.sort(key=lambda w: (round(w['top'], 1), w['x0']))
        text = " ".join(w['text'] for w in contained)
        results.append({'x0': bx0, 'top': bt, 'x1': bx1, 'bottom': bb, 'text': text})
    return results

def full_text(path):
    with pdfplumber.open(path) as pdf:
        return "\n".join((p.extract_text() or "") for p in pdf.pages)

def clean_noise(text):
    """Strip recurring running headers/footers/scanner artifacts seen across
    the PD2 PDF exports (page numbers, reversed watermark text, print-shop
    job codes, season/year footers)."""
    lines = text.split("\n")
    out = []
    for l in lines:
        s = l.strip()
        if not s:
            continue
        if re.match(r'^\d+\s*(MAJ-JUNI|NOVEMBER-DECEMBER|NOVEMBER|MAJ)', s, re.IGNORECASE):
            continue
        if re.match(r'^(MAJ-JUNI|NOVEMBER-DECEMBER|NOVEMBER|MAJ)[\w\s-]*\d{4}\s*\d*$', s, re.IGNORECASE):
            continue
        if re.search(r'Rød_PD2|\.indd\s*\d|_P\.nr\.', s):
            continue
        if re.match(r'^\.?[A-Z]{0,2}RNSNOITKUDORP', s):
            continue
        if re.match(r'^CPR-nummer$|^CPr-nummer$', s, re.IGNORECASE):
            continue
        out.append(s)
    return "\n".join(out)

# ---------- Opgave 1 (short-answer scanning) ----------

def extract_opgave1(questions_path, text_path):
    text = clean_noise(full_text(questions_path))
    start = text.find('Delprøve 1 – Opgave 1')
    end = text.find('Delprøve 1 – Opgave 2')
    if start == -1:
        start = 0
    if end == -1 or end < start:
        end = start + 2000
    block = text[start:end]

    questions = []
    current_category = None
    for line in block.split('\n'):
        cat_match = re.match(r'^Søg informationer under (.+?)\.?$', line)
        if cat_match:
            current_category = cat_match.group(1).strip()
            continue
        qm = re.match(r'^(\d+)\.\s+(.+)$', line)
        if qm:
            num = int(qm.group(1))
            prompt = qm.group(2).strip()
            if current_category:
                prompt = f'({current_category}) {prompt}'
            questions.append({'number': num, 'prompt': prompt})

    # Source text: prefer column-aware extraction of the dedicated teksthæfte
    source_text = ""
    try:
        with pdfplumber.open(text_path) as pdf:
            parts = []
            for page in pdf.pages:
                t = page.extract_text() or ""
                if 'Delprøve 1' in t and 'Opgave 1' in t and 'Teksthæfte' not in t and len(t) < 400:
                    continue  # cover page
                parts.append(extract_page_columns(page))
            source_text = clean_noise("\n\n".join(parts))
    except Exception as e:
        source_text = f"[Fejl ved tekstudtræk: {e}]"
    return questions, source_text

# ---------- Opgave 2 (ad matching) ----------

def extract_opgave2(questions_path):
    with pdfplumber.open(questions_path) as pdf:
        pages = pdf.pages
        ad_page_idx = None
        clue_page_idx = None
        for i, p in enumerate(pages):
            t = p.extract_text() or ""
            if 'Annoncer' in t and ad_page_idx is None:
                ad_page_idx = i
            if ad_page_idx is not None and i > ad_page_idx and 'Instruktion' in t and 'annoncerne' in t.lower():
                clue_page_idx = i
                break
        if ad_page_idx is None:
            return [], "", []
        # Ads may span one or two pages (grid of boxes with borders)
        ad_pages = [pages[ad_page_idx]]
        if ad_page_idx + 1 < len(pages) and clue_page_idx != ad_page_idx + 1:
            nxt_text = pages[ad_page_idx + 1].extract_text() or ""
            if 'Instruktion' not in nxt_text:
                ad_pages.append(pages[ad_page_idx + 1])

        ad_texts = []
        for p in ad_pages:
            boxes = extract_boxes(p, min_area=3000)
            for b in boxes:
                if 'Opgave 2' in b['text'] and 'Annoncer' in b['text']:
                    continue  # title bar
                letter_match = re.search(r'\b([A-I])\s*■(?:\s*■)*\s*', b['text'])
                if not letter_match:
                    continue
                letter = letter_match.group(1)
                # remove the letter+squares marker from the copy, leaving a blank placeholder
                cleaned = b['text'][:letter_match.start()] + '[___] ' + b['text'][letter_match.end():]
                cleaned = re.sub(r'\s+', ' ', cleaned).strip()
                if len(cleaned) > 15:
                    ad_texts.append((letter, cleaned))
        ad_texts.sort(key=lambda x: x[0])

        # Clue list: scan pages for whichever yields a clean 0,7-12 numbered
        # list, trying both plain and column-aware extraction per page (the
        # layout varies year to year: ad-reprints beside clues, or clues
        # alone).
        questions = []
        with pdfplumber.open(questions_path) as pdf2:
            for page in pdf2.pages:
                for candidate_text in (clean_noise(page.extract_text() or ""), clean_noise(extract_page_columns(page))):
                    found = {}
                    for line in candidate_text.split('\n'):
                        qm = re.match(r'^(\d+)\.\s+(.+)$', line)
                        if qm:
                            num = int(qm.group(1))
                            if num in (0, 7, 8, 9, 10, 11, 12) and num not in found:
                                found[num] = qm.group(2).strip()
                    if len(found) >= 6 and all(n in found for n in (7, 8, 9, 10, 11, 12)):
                        questions = [{'number': n, 'prompt': p} for n, p in sorted(found.items())]
                        break
                if questions:
                    break

    source_text = "\n\n".join(f"{letter}: {txt}" for letter, txt in ad_texts)
    letters = sorted({letter for letter, _ in ad_texts})
    return questions, source_text, letters

# ---------- L2: Opgave 3 (cloze), 4 (sentence-gap), 5 (paragraph-match) ----------

def extract_l2_column_aware(l2_path):
    """Extracts the full L2 document page-by-page using column-aware
    extraction throughout (it auto-falls-back to normal single-column
    reading order when no 2-column gap is detected, so this is safe for
    narrative pages too — and fixes the lettered-options blocks, which are
    laid out in 2 columns on PD2 answer-key pages)."""
    with pdfplumber.open(l2_path) as pdf:
        return clean_noise("\n".join(extract_page_columns(p) for p in pdf.pages))

def split_l2_segments(l2_path):
    text = clean_noise(full_text(l2_path))
    instr_positions = [m.start() for m in re.finditer(r'Instruktion', text)]
    if len(instr_positions) < 2:
        return None
    # opg3/opg4 boundary: the 2nd "Instruktion" occurrence is always opg4's
    # own instruction block (reliable across years; the literal "Opgave 4"
    # heading text is NOT consistently repeated in older exams).
    opg4_start = instr_positions[1]

    # opg4/opg5 boundary: opg5's interview body has no "Instruktion" of its
    # own (that only appears later, right before the final question list) —
    # it starts at a standalone "Opgave 5" heading. Exclude "Opgave 5 –
    # fortsat" continuation markers and the cover-page mention.
    opg5_candidates = [m.start() for m in re.finditer(r'Opgave 5\b', text)]
    opg5_start = None
    for p in opg5_candidates:
        if p < opg4_start + 50:
            continue  # cover page / too early
        nearby = text[p:p + 20]
        if 'fortsat' in nearby or '–' in nearby.replace('Opgave 5', '', 1)[:5]:
            continue
        opg5_start = p
        break
    if opg5_start is None or opg5_start <= opg4_start:
        # fall back to the old equal-thirds-by-Instruktion split
        if len(instr_positions) < 3:
            return None
        bounds = instr_positions[:3] + [len(text)]
        return [text[bounds[i]:bounds[i + 1]] for i in range(3)]
    seg3 = text[instr_positions[0]:opg4_start]
    seg4 = text[opg4_start:opg5_start]
    seg5 = text[opg5_start:]
    return [seg3, seg4, seg5]

def extract_opgave3(segment):
    # word bank = trailing lines that are purely lowercase word lists (the
    # fill-in-the-blank options), collected backward until a non-matching
    # (prose/instruction) line is hit. Strip trailing heading lines (e.g.
    # "Opgave 4") first, since those sit after the word bank in the raw text
    # but aren't part of this task.
    lines = [l for l in segment.split('\n') if l.strip()]
    while lines and re.match(r'^Opgave \d+', lines[-1]):
        lines.pop()
    wordbank_lines = []
    body_lines = []
    done = False
    for l in reversed(lines):
        if not done and re.match(r'^[a-zæøå]+(?:[\s,]+[a-zæøå]+)*$', l) and len(l.split()) <= 10:
            wordbank_lines.insert(0, l)
            continue
        done = True
        body_lines.insert(0, l)
    wordbank = " ".join(wordbank_lines).replace(',', ' ').split()
    body = "\n".join(body_lines)
    # Title = the short line right after "Der gives 1 point for hvert korrekt svar."
    title_match = re.search(r'korrekt svar\.\s*\n([^\n]+)', body)
    title = title_match.group(1).strip() if title_match else "Cloze-tekst"
    return title, body, wordbank

def find_options_page(l2_path, letters='ABCDEFGH'):
    """Scans all pages for one yielding a clean 8-entry lettered option list
    with short, single-sentence text — i.e. the opgave 4 sentence bank (as
    opposed to opgave 5's much longer interview-answer paragraphs, which
    also use A-H labels)."""
    with pdfplumber.open(l2_path) as pdf:
        for page in pdf.pages:
            opts = extract_lettered_options(page, letters)
            if len(opts) == 8:
                avg_words = sum(len(v.split()) for v in opts.values()) / 8
                if 2 <= avg_words <= 20:
                    return opts
    return {}

def extract_opgave45(segment, l2_path=None):
    options = find_options_page(l2_path) if l2_path else {}
    lines = [l for l in segment.split('\n') if l.strip()]
    if not options:
        # fallback: best-effort line regex (less reliable on 2/3-column pages)
        option_lines = [l for l in lines if re.match(r'^([A-H])\s+\S', l) and len(l) < 200]
        for l in option_lines:
            m = re.match(r'^([A-H])\s+(.+)$', l)
            if m and len(m.group(2).split()) >= 2:
                options[m.group(1)] = m.group(2).strip()
    non_option_lines = [l for l in lines if not re.match(r'^[A-H]\s', l)]
    body = "\n".join(non_option_lines)
    return body, options

def extract_opgave5_questions(segment):
    questions = []
    for line in segment.split('\n'):
        qm = re.match(r'^(\d+)\.\s+(.+)$', line)
        if qm:
            prompt = qm.group(2).strip()
            # the example question (0) is sometimes followed by its single-letter
            # answer on the same line (e.g. "Hvorfor...? A") — strip it
            prompt = re.sub(r'\s+[A-H]$', '', prompt)
            questions.append({'number': int(qm.group(1)), 'prompt': prompt})
    return questions

def extract_opgave5_body(l2_path, title):
    """Re-extracts the opgave 5 interview body using column-aware
    extraction (the plain-text segment interleaves the two side-by-side
    answer columns line-by-line, which is hard to read)."""
    title_key = title.split('–')[0].split('—')[0].strip()
    if not title_key:
        return ''
    with pdfplumber.open(l2_path) as pdf:
        pages_text = [p.extract_text() or '' for p in pdf.pages]
        start_idx = next((i for i, t in enumerate(pages_text) if title_key in t and 'Eksempel' in t), None)
        if start_idx is None:
            return ''
        end_idx = next((i for i in range(start_idx, len(pages_text)) if i > start_idx and 'Instruktion' in pages_text[i]), len(pages_text))
        with_cols = [extract_page_columns(pdf.pages[i]) for i in range(start_idx, end_idx)]
        combined = clean_noise("\n\n".join(with_cols))
        start_pos = combined.find(title_key)
        return combined[start_pos:].strip() if start_pos >= 0 else combined.strip()

if __name__ == "__main__":
    year = sys.argv[1]
    season = sys.argv[2]
    questions_file, text_file = find_l1_combined(year, season)
    l2 = find_l2(year, season)
    censor = find_censor(year, season)
    print(json.dumps({
        'questions_l1': questions_file,
        'text_l1': text_file,
        'l2': l2,
        'censor': censor,
    }, indent=2, ensure_ascii=False))
