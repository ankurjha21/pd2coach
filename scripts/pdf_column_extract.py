"""Column-aware PDF text extraction for two-column PD2 reading passages.
Groups words into columns by x-position gap detection, then reconstructs
reading order: column 1 top-to-bottom, then column 2 top-to-bottom.
"""
import pdfplumber
import sys

def extract_columns(path, page_indices=None):
    out_pages = []
    with pdfplumber.open(path) as pdf:
        pages = pdf.pages if page_indices is None else [pdf.pages[i] for i in page_indices]
        for page in pages:
            words = page.extract_words(use_text_flow=False, keep_blank_chars=False)
            if not words:
                out_pages.append("")
                continue
            xs = sorted(w['x0'] for w in words)
            # find the largest gap in x0 positions to split into 2 columns
            gaps = []
            for i in range(1, len(xs)):
                gaps.append((xs[i] - xs[i-1], (xs[i] + xs[i-1]) / 2))
            gaps.sort(key=lambda g: -g[0])
            page_width = page.width
            # only treat as 2-column if the biggest gap is near the middle and reasonably wide
            split_x = None
            for gap_size, mid in gaps[:5]:
                if page_width * 0.3 < mid < page_width * 0.7 and gap_size > 8:
                    split_x = mid
                    break
            if split_x is None:
                # single column - sort by top then x0
                words_sorted = sorted(words, key=lambda w: (round(w['top'], 1), w['x0']))
                lines = group_into_lines(words_sorted)
                out_pages.append("\n".join(lines))
            else:
                left = [w for w in words if w['x0'] < split_x]
                right = [w for w in words if w['x0'] >= split_x]
                left_lines = group_into_lines(sorted(left, key=lambda w: (round(w['top'],1), w['x0'])))
                right_lines = group_into_lines(sorted(right, key=lambda w: (round(w['top'],1), w['x0'])))
                out_pages.append("\n".join(left_lines) + "\n\n" + "\n".join(right_lines))
    return "\n\n".join(out_pages)

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
    print(extract_columns(path))
