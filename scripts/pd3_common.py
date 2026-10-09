"""Shared helpers for PD3 (Prøve i Dansk 3) extraction scripts."""
import glob
import os
import re
import unicodedata
import pdfplumber

SOURCE_ROOT = os.path.join(
    os.path.dirname(__file__), '..', '..', 'source-papers', 'pd3_extracted',
    'PD3 samples collection (2004-2024)'
)

# (folder_name, year, season, label)
SESSIONS = [
    ('2018 maj juni', 2018, 'Sommer', 'Maj-juni 2018'),
    ('2018 nov dec', 2018, 'Vinter', 'November-december 2018'),
    ('2019 maj juni', 2019, 'Sommer', 'Maj-juni 2019'),
    ('2019 nov dec', 2019, 'Vinter', 'November-december 2019'),
    ('2020 maj juni', 2020, 'Sommer', 'Maj-juni 2020'),
    ('2020 nov dec', 2020, 'Vinter', 'November-december 2020'),
    ('2021 maj juni', 2021, 'Sommer', 'Maj-juni 2021'),
    ('2021 nov dec', 2021, 'Vinter', 'November-december 2021'),
    ('2022 maj juni missing speaking', 2022, 'Sommer', 'Maj-juni 2022'),
    ('2022 nov dec', 2022, 'Vinter', 'November-december 2022'),
    ('2023 maj juni', 2023, 'Sommer', 'Maj-juni 2023'),
    ('2023 nov dec', 2023, 'Vinter', 'November-december 2023'),
    ('2024 maj juni', 2024, 'Sommer', 'Maj-juni 2024'),
]


def nfc(s):
    return unicodedata.normalize('NFC', s)


def _find_in_dir(base, name_fragments):
    if not os.path.isdir(base):
        return None
    for fname in sorted(os.listdir(base)):
        if not fname.lower().endswith('.pdf'):
            continue
        norm = nfc(fname).lower()
        if all(nfc(f).lower() in norm for f in name_fragments):
            return os.path.join(base, fname)
    return None


def find_file(session_folder, subfolder, *name_fragments):
    """Find a PDF under source-papers whose filename contains all given
    fragments (case/accent-insensitive), searching the given subfolder
    (e.g. '1 reading') within the session folder, falling back to the
    session root (some years keep a single combined censor booklet there)."""
    found = _find_in_dir(os.path.join(SOURCE_ROOT, session_folder, subfolder), name_fragments)
    if found:
        return found
    return _find_in_dir(os.path.join(SOURCE_ROOT, session_folder), name_fragments)


JUNK_LINE_PATTERNS = [
    re.compile(r'^\.?RNSNOITKUDORP'),
    re.compile(r'^\d+$'),
    re.compile(r'^\d{0,3}\s*(MAJ-JUNI|NOVEMBER-DECEMBER)\s+\d{4}\s*\d{0,3}$'),
    re.compile(r'^Prøve i Dansk 3$'),
    re.compile(r'^(Skriftlig|Mundtlig) del$'),
    re.compile(r'^(Opgavehæfte|Teksthæfte|Tekstsamling)$'),
    re.compile(r'^Udfyldes af'),
    re.compile(r'^(Navn|Dato|Prøveafholdende udbyder)\b.*CPR|Prøvenummer|Tilsynsførendes'),
    re.compile(r'^CPR-nummer$'),
    re.compile(r'^Der er et (teksthæfte|opgavehæfte)'),
    re.compile(r'^Læs først instruktionen'),
    re.compile(r'^•?\s*Hjælpemidler:'),
    re.compile(r'^•?\s*Tid:\s*\d+'),
    re.compile(r'^Produktionsnr\.?\s*\d+'),
]


def is_junk_line(line):
    s = line.strip()
    if not s:
        return True
    for pat in JUNK_LINE_PATTERNS:
        if pat.search(s):
            return True
    return False


def is_garbled(line):
    """Detect the 'double exposure' glyph-overlap garbling seen on some
    running-header lines (e.g. 'DDeelplprrøøvvee 1 2'): a high ratio of
    immediately-repeated characters."""
    s = re.sub(r'\s+', '', line)
    if len(s) < 6:
        return False
    repeats = sum(1 for i in range(1, len(s)) if s[i] == s[i - 1])
    return repeats / len(s) > 0.25


def clean_lines(text):
    out = []
    for line in text.split('\n'):
        if is_junk_line(line):
            continue
        if is_garbled(line):
            continue
        out.append(line.rstrip())
    return out


def clean_text(text):
    return '\n'.join(clean_lines(text)).strip()


def extract_plain(path, page_indices=None):
    with pdfplumber.open(path) as pdf:
        pages = pdf.pages if page_indices is None else [pdf.pages[i] for i in page_indices]
        return '\n'.join((p.extract_text() or '') for p in pages)
