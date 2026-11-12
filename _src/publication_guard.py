#!/usr/bin/env python3
"""Check the tracked tree before publication; never print matching secret values.

This heuristic checks the current tracked tree in CI, not history. In a public
repository a file may already be exposed before CI runs. It is not a complete
secret scanner. .gitignore alone does not stop git add --force.
"""
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
PRIVATE_NAMES = {
    'soul.md', 'memory.md', 'user.md', 'identity.md', 'heartbeat.md',
    'credentials.json', 'secrets.json', 'service-account.json', '.netrc',
    'id_rsa', 'id_ed25519', 'guardian_ledger.jsonl', 'sentinel_state.json',
    'sentinel_feedback.json', 'offers.md', 'jobs_opportunities.pdf',
}
PRIVATE_DIRS = {'__pycache__', '.hermes', '.ssh', '.aws', 'client-exports',
                'customer-data', 'private', 'backups', 'qa-mobile'}
PRIVATE_SUFFIXES = {'.pyc', '.pyo', '.pem', '.key', '.p12', '.pfx', '.p8',
                    '.db', '.sqlite', '.sqlite3', '.log', '.bak'}
MEDIA_SUFFIXES = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.woff',
                  '.woff2', '.mp3', '.mp4', '.webm'}
PATTERNS = tuple(re.compile(pattern) for pattern in (
    r'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b',
    r'\bgh[pousr]_[A-Za-z0-9]{36,}\b',
    r'\bgithub_pat_[A-Za-z0-9_]{50,}\b',
    r'\bxox[baprs]-[A-Za-z0-9-]{24,}\b',
    r'\bsk-(?:proj-|ant-)[A-Za-z0-9_-]{24,}',
    r'\b[rs]k_live_[A-Za-z0-9]{20,}',
    r'\b[0-9]{8,12}:[A-Za-z0-9_-]{35}\b',
    r'-----BEGIN (?:OPENSSH |RSA |EC |DSA )?PRIVATE KEY-----',
))


def inspect_paths(root, paths):
    issues = []
    root = Path(root).resolve()
    for relative in paths:
        path = root / relative
        parts = tuple(part.casefold() for part in Path(relative).parts)
        if not parts or Path(relative).is_absolute() or '..' in parts:
            issues.append(f'Invalid tracked path: {relative}')
            continue
        name = parts[-1]
        if (name in PRIVATE_NAMES or any(p in PRIVATE_DIRS for p in parts)
                or any(p == '.env' or p.startswith('.env.') for p in parts)
                or name.startswith(('hotbox-pitch-', 'engagement-report', 'engagement-audit'))
                or '.bak-' in name or path.suffix.casefold() in PRIVATE_SUFFIXES):
            issues.append(f'Private or runtime artifact: {relative}')
        if path.is_symlink():
            issues.append(f'Symlink requires publication review: {relative}')
            continue
        if not path.is_file():
            continue  # A tracked file removed by this build is not published.
        if path.suffix.casefold() in MEDIA_SUFFIXES:
            continue
        if path.stat().st_size > 2_000_000:
            issues.append(f'Large non-media file requires review: {relative}')
            continue
        data = path.read_bytes()
        if b'\0' in data:
            issues.append(f'Unexpected binary file requires review: {relative}')
            continue
        text = data.decode('utf-8', errors='replace')
        if any(pattern.search(text) for pattern in PATTERNS):
            issues.append(f'Credential-like content: {relative}')
    return issues


def audit():
    tracked = subprocess.check_output(['git', 'ls-files', '-z'], cwd=ROOT)
    paths = [p.decode('utf-8') for p in tracked.split(b'\0') if p]
    issues = inspect_paths(ROOT, paths)
    if issues:
        raise AssertionError('\n'.join(issues))
    print(f'PASS: publication guard checked {len(paths)} tracked paths; history not covered')


if __name__ == '__main__':
    audit()
