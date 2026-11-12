"""Twinthos workflow wheel: one geometry, used by the hero, the scroll stage, the static
sequence and the two offer maps. Python emits the SVG; tw.js reads GEO for motion."""
import math, json

C = 500.0          # centre (viewBox 0 0 1000 1000)
R = 300.0          # the one circular path

def P(deg, r=R):
    a = math.radians(deg)
    return (round(C + r * math.sin(a), 1), round(C - r * math.cos(a), 1))

# Angles clockwise from 12 o'clock. Unwrapped so the enquiry always travels forward.
ANG = {"A": 292, "B": 340, "C": 455, "N": 490, "D": 525, "E": 598}
PTS = {k: P(v) for k, v in ANG.items()}
EMAIL = (58.0, PTS["A"][1])            # the labelled Email point
CUST = (648.0, 92.0)                   # customer, outside the path
TEAM = (118.0, 842.0)                  # your team, outside the path
CHORD = f"M{PTS['B'][0]},{PTS['B'][1]} Q470,92 {CUST[0]-30},{CUST[1]+4}"
BRANCH = f"M{PTS['E'][0]},{PTS['E'][1]} C190,712 150,760 {TEAM[0]+6},{TEAM[1]-40}"

GEO = {"C": C, "R": R, "ang": ANG, "email": EMAIL, "cust": CUST, "team": TEAM}

DOC = "M-15,-19H5L15,-9V19H-15Z"       # the enquiry marker: one document shape
FOLD = "M5,-19V-9H15"

def _lab(cls, x, y, lines, anchor="start"):
    t = "".join(f'<tspan x="{x}" dy="{0 if i == 0 else 29}">{s}</tspan>' for i, s in enumerate(lines))
    return f'<text class="w-lab {cls}" x="{x}" y="{y}" text-anchor="{anchor}">{t}</text>'

def _frag(cls, x, y, lines, anchor, w):
    """A work fragment. In beat one it is a loose chip; aligned, it becomes the station label."""
    h = 22 + 29 * len(lines)
    rx = x - (w if anchor == "end" else 0) - 14
    return (f'<g class="w-frag {cls}"><rect class="w-chip" x="{rx}" y="{y-31}" width="{w+28}" height="{h}" rx="6"/>'
            + _lab("", x, y, lines, anchor) + "</g>")

def ticks():
    out = []
    for i in range(72):
        a = i * 5
        big = a % 30 == 0
        x1, y1 = P(a, R + 16); x2, y2 = P(a, R + (30 if big else 24))
        out.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"{" class=\"big\"" if big else ""}/>')
    return '<g class="w-ticks">' + "".join(out) + "</g>"

def chevrons():
    out = []
    for a in (316, 37.5, 112, 147, 201, 265):
        x, y = P(a)
        out.append(f'<path d="M-9,-11 L4,0 L-9,11" transform="translate({x:.1f} {y:.1f}) rotate({a})"/>')
    return '<g class="w-chev">' + "".join(out) + "</g>"

def wheel_svg(extra_cls=""):
    A, B, Cc, N, D, E = (PTS[k] for k in "ABCNDE")
    nx1, ny1 = P(ANG["N"] - 3, R - 14); nx2, ny2 = P(ANG["N"] - 3, R + 14)
    nx3, ny3 = P(ANG["N"] + 3, R - 14); nx4, ny4 = P(ANG["N"] + 3, R + 14)
    bx1, by1 = P(ANG["E"], R - 34); bx2, by2 = P(ANG["E"], R + 34)
    lx, ly = P(ANG["N"], R + 58)
    return f'''<svg class="wheel {extra_cls}" viewBox="0 0 1000 1000" focusable="false" aria-hidden="true">
{ticks()}
<circle class="w-ring" cx="500" cy="500" r="{R}"/>
{chevrons()}
<circle class="w-done" cx="500" cy="500" r="{R}" transform="rotate({ANG['A']-90} 500 500)" stroke-dasharray="0 1885"/>
<line class="w-lead" x1="{EMAIL[0]}" y1="{EMAIL[1]}" x2="{A[0]}" y2="{A[1]}"/>
<rect class="w-email" x="{EMAIL[0]-9}" y="{EMAIL[1]-9}" width="18" height="18" rx="2"/>
<text class="w-tag w-email-l" x="{EMAIL[0]-9}" y="{EMAIL[1]-26}">Email</text>
<path class="w-chord" d="{CHORD}"/>
<g class="w-cust"><circle cx="{CUST[0]}" cy="{CUST[1]}" r="30"/><g class="w-clock"><line x1="{CUST[0]}" y1="{CUST[1]}" x2="{CUST[0]}" y2="{CUST[1]-17}"/></g>
<text class="w-lab" x="{CUST[0]+48}" y="{CUST[1]+9}">Customer</text></g>
<g class="w-later"><line x1="{nx1}" y1="{ny1}" x2="{nx2}" y2="{ny2}"/><line x1="{nx3}" y1="{ny3}" x2="{nx4}" y2="{ny4}"/>
<text class="w-tag" x="{lx+6}" y="{ly+14}">Later</text></g>
<path class="w-branch" d="{BRANCH}" pathLength="1" stroke-dasharray="0 1"/>
<line class="w-bound" x1="{bx1}" y1="{by1}" x2="{bx2}" y2="{by2}"/>
<text class="w-lab w-bound-l" x="{E[0]-40}" y="{E[1]-12}" text-anchor="end"><tspan x="{E[0]-40}">Above 10%:</tspan><tspan x="{E[0]-40}" dy="29">a person decides</tspan></text>
<g class="w-team"><circle cx="{TEAM[0]}" cy="{TEAM[1]}" r="30"/><circle class="w-head" cx="{TEAM[0]}" cy="{TEAM[1]-8}" r="8"/><path class="w-body" d="M{TEAM[0]-14},{TEAM[1]+16}a14,12 0 0 1 28,0"/>
<text class="w-lab" x="{TEAM[0]+48}" y="{TEAM[1]+9}">Your team</text></g>
<g class="w-nodes">{"".join(f'<circle class="w-node n-{k}" cx="{PTS[k][0]}" cy="{PTS[k][1]}" r="9"/>' for k in "ABCD")}</g>
<g class="w-attn"><line class="w-teth t1"/><line class="w-teth t2"/><line class="w-teth t3"/>
<circle cx="500" cy="500" r="30"/><circle class="w-head" cx="500" cy="492" r="8"/><path class="w-body" d="M486,516a14,12 0 0 1 28,0"/>
<text class="w-lab" x="500" y="572" text-anchor="middle">Someone’s attention</text></g>
{_frag("f-A", A[0]-34, A[1]+60, ["Read the enquiry."], "end", 196)}
{_frag("f-B", B[0]-28, B[1]-40, ["Ask for the details."], "end", 222)}
{_frag("f-C", Cc[0]+34, Cc[1]-4, ["Update", "the record."], "start", 142)}
{_lab("l-D", D[0]+22, D[1]+64, ["Send the follow-up."], "middle")}
{_lab("l-E", E[0]-40, E[1]-12, ["Within", "the rules?"], "end")}
<g class="w-ghosts"><g><path d="M-8,-10H3L8,-5V10H-8Z"/></g><g><path d="M-8,-10H3L8,-5V10H-8Z"/></g></g>
<g class="w-pkt"><path d="M-10,-13H3L10,-6V13H-10Z"/></g>
<g class="w-mk" transform="translate({A[0]},{A[1]})"><circle class="w-halo" r="30"/><path class="w-doc" d="{DOC}"/><path class="w-fold" d="{FOLD}"/>
<g class="w-pause"><rect x="-6" y="-8" width="4" height="16"/><rect x="2" y="-8" width="4" height="16"/></g></g>
<g class="w-mtag" transform="translate({A[0]+30},{A[1]-62})"><rect x="0" y="-26" width="236" height="40" rx="20"/><text x="118" y="2" text-anchor="middle">Enquiry received</text></g>
</svg>'''

def _mt(x, y, side, txt):
    parts = txt.split("|")
    anc = "end" if side < 0 else "start"
    if len(parts) == 1:
        return f'<text class="m-t" x="{x}" y="{y+9}" text-anchor="{anc}">{txt}</text>'
    y0 = y + 9 - 22 * (len(parts) - 1)
    sp = "".join(f'<tspan x="{x}" dy="{0 if i == 0 else 44}">{p}</tspan>' for i, p in enumerate(parts))
    return f'<text class="m-t" x="{x}" y="{y0}" text-anchor="{anc}">{sp}</text>'

def map_svg(kind):
    """The simplified workflow map shown above each offer. Same path, same stations."""
    A, B, Cc, D, E = (PTS[k] for k in "ABCDE")
    ann = ""
    if kind == "audit":
        notes = [(A, -1, "What arrives"), (B, -1, "Where it waits"), (Cc, 1, "What gets|updated"), (E, -1, "Who decides")]
        for i, ((x, y), side, txt) in enumerate(notes, 1):
            tx = x + side * 70
            ann += (f'<g class="m-ann"><line x1="{x}" y1="{y}" x2="{tx}" y2="{y}"/>'
                    f'<circle cx="{tx + side*22}" cy="{y}" r="18"/><text class="m-n" x="{tx + side*22}" y="{y+7}" text-anchor="middle">{i}</text>'
                    + _mt(tx + side*52, y, side, txt) + '</g>')
    mk = ""
    if kind == "managed":
        top = P(0)
        mk = (f'<circle class="m-done" cx="500" cy="500" r="{R}" transform="rotate({ANG["A"]-90} 500 500)" pathLength="1"/>'
              f'<g class="m-rot"><g class="m-glyph"><g transform="translate({top[0]},{top[1]})"><path class="w-doc" d="{DOC}"/><path class="w-fold" d="{FOLD}"/></g></g></g>')
    src = "" if kind == "audit" else f'<line class="m-lead" x1="{EMAIL[0]}" y1="{EMAIL[1]}" x2="{A[0]}" y2="{A[1]}"/><rect class="m-src" x="{EMAIL[0]-16}" y="{EMAIL[1]-16}" width="32" height="32" rx="3"/>'
    return f'''<svg class="map map-{kind}" viewBox="-120 0 1240 1000" focusable="false" aria-hidden="true">
<circle class="m-ring{' dash' if kind=='audit' else ''}" cx="500" cy="500" r="{R}"/>
{src}
<path class="m-chord" d="{CHORD}"/><circle class="m-out" cx="{CUST[0]}" cy="{CUST[1]}" r="22"/>
<path class="m-branch" d="{BRANCH}"/><circle class="m-out m-team" cx="{TEAM[0]}" cy="{TEAM[1]}" r="22"/>
{mk}
{"".join(f'<circle class="m-node" cx="{PTS[k][0]}" cy="{PTS[k][1]}" r="11"/>' for k in "ABCD")}
<line class="m-bound" x1="{P(ANG['E'], R-30)[0]}" y1="{P(ANG['E'], R-30)[1]}" x2="{P(ANG['E'], R+30)[0]}" y2="{P(ANG['E'], R+30)[1]}"/>
{ann}
</svg>'''

def geo_js():
    return json.dumps(GEO)
