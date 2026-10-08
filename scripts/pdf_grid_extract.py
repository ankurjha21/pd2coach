"""Multi-column grid-aware PDF text extraction (for 3x3 ad-box grids etc).
Splits words into N columns based on x-gap clustering, each column read top-to-bottom.
"""
import pdfplumber
import sys

def extract_grid(path, gap_threshold=15, page_indices=None):
    out_pages = []
    with pdfplumber.open(path) as pdf:
        pages = pdf.pages if page_indices is None else [pdf.pages[i] for i in page_indices]
        for page in pages:
            words = page.extract_words(use_text_flow=False, keep_blank_chars=False)
            if not words:
                out_pages.append("")
                continue
            xs = sorted(set(round(w['x0']) for w in words))
            # find gap boundaries
            boundaries = [page.width + 1]
            for i in range(1, len(xs)):
                if xs[i] - xs[i-1] > gap_threshold:
                    boundaries.append((xs[i] + xs[i-1]) / 2)
            boundaries.sort()
            # build column ranges
            cols = []
            prev = -1
            for b in boundaries:
                cols.append((prev, b))
                prev = b
            col_texts = []
            for lo, hi in cols:
                col_words = [w for w in words if lo < w['x0'] <= hi]
                if not col_words:
                    continue
                col_words.sort(key=lambda w: (round(w['top'], 1), w['x0']))
                lines = group_into_lines(col_words)
                col_texts.append("\n".join(lines))
            out_pages.append("\n\n----COL----\n\n".join(col_texts))
    return "\n\n====PAGE====\n\n".join(out_pages)

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

if __name__ == "__main__":
    path = sys.argv[1]
    pages = None
    if len(sys.argv) > 2:
        pages = [int(x) for x in sys.argv[2].split(",")]
    print(extract_grid(path, page_indices=pages))
