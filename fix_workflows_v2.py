import os
import re

def fix_workflow(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. First, cleanup the mess I made
    content = re.sub(r' +uses: actions/setup- name: Setup pnpm\n +uses: actions/setup  uses: pnpm/action-setup@v4\n +uses: actions/setup  with:\n +uses: actions/setup    version: '\''9'\''\n', '', content)

    # 2. Fix the deprecated upload/download-artifact
    content = content.replace('uses: actions/upload-artifact@v3', 'uses: actions/upload-artifact@v4')
    content = content.replace('uses: actions/download-artifact@v3', 'uses: actions/download-artifact@v4')

    # 3. Use a much simpler replacement for pnpm setup
    # We want Setup pnpm (v4, version 9) BEFORE Setup Node.js (v4, cache pnpm)

    # First, let's identify every Setup Node.js block and replace it with a standardized sequence
    # This pattern matches both - name: Setup Node.js and - uses: actions/setup-node@v4

    pattern = re.compile(r' *- (name: Setup Node\.js\n +)?uses: actions/setup-node@v4\n +with:\n +node-version: [^\n]+\n( +cache: [^\n]+\n)?')

    def replace_node_setup(match):
        full_match = match.group(0)
        indent = full_match[:full_match.find('-')]

        # Extract node-version
        version_match = re.search(r'node-version: ([^\n]+)', full_match)
        node_version = version_match.group(1) if version_match else "'20.x'"

        return f"""{indent}- name: Setup pnpm
{indent}  uses: pnpm/action-setup@v4
{indent}  with:
{indent}    version: '9'

{indent}- name: Setup Node.js
{indent}  uses: actions/setup-node@v4
{indent}  with:
{indent}    node-version: {node_version}
{indent}    cache: 'pnpm'
"""

    # We need to be careful about not doubling up pnpm-setup if it's already there (correctly)
    # So first remove any existing Setup pnpm blocks (correct or messed up)
    content = re.sub(r' *- name: Setup pnpm\n +uses: pnpm/action-setup@v4\n +with:\n +version: [^\n]+\n\n?', '', content)

    # Now apply the standardized replacement
    new_content = pattern.sub(replace_node_setup, content)

    with open(filepath, 'w') as f:
        f.write(new_content)

workflows_dir = '.github/workflows'
for filename in os.listdir(workflows_dir):
    if filename.endswith('.yml') or filename.endswith('.yaml'):
        fix_workflow(os.path.join(workflows_dir, filename))
