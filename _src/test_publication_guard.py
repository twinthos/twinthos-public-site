import tempfile
import unittest
from pathlib import Path
from publication_guard import inspect_paths


class PublicationGuardTests(unittest.TestCase):
    def test_blocks_nested_private_files_and_extensionless_credentials(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            files = {'index.html': '<h1>Public site</h1>',
                     'nested/.env.production': 'MODE=production',
                     'nested/MEMORY.md': 'Internal memory',
                     '_src/__pycache__/build.pyc': 'cache',
                     'private/client.txt': 'Private',
                     'notes/page.html.bak-20261109': 'backup',
                     'token': 'ghp_' + 'A' * 36}
            for name, content in files.items():
                path = root / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content)
            issues = inspect_paths(root, list(files))
            for name in list(files)[1:]:
                self.assertTrue(any(name in issue for issue in issues), name)
            self.assertFalse(any('index.html' in issue for issue in issues))
            self.assertFalse(any('A' * 36 in issue for issue in issues))

    def test_symlinks_are_rejected_without_reading_the_target(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / 'link').symlink_to('/does-not-exist')
            self.assertIn('Symlink', inspect_paths(root, ['link'])[0])

    def test_public_verification_keys_and_removed_files_are_allowed(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / 'indexnow-key.txt').write_text('a' * 64)
            self.assertEqual(inspect_paths(root, ['indexnow-key.txt', 'removed.html']), [])


if __name__ == '__main__':
    unittest.main()
