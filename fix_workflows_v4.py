import os
import re

def fix_workflow(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Standardize Setup pnpm + Setup Node.js
    # Remove existing pnpm setup blocks and messed up ones
    content = re.sub(r' *- name: (Setup|Install) pnpm\n +uses: pnpm/action-setup@[^\n]+\n +with:\n +version: [^\n]+\n\n?', '', content)
    content = re.sub(r' +uses: actions/setup- name: Setup pnpm\n +uses: actions/setup  uses: pnpm/action-setup@v4\n +uses: actions/setup  with:\n +uses: actions/setup    version: '\''9'\''\n', '', content)

    # Standardize artifact actions
    content = content.replace('uses: actions/upload-artifact@v3', 'uses: actions/upload-artifact@v4')
    content = content.replace('uses: actions/download-artifact@v3', 'uses: actions/download-artifact@v4')

    # Replace npm ci with pnpm install --frozen-lockfile
    content = content.replace('npm ci || pnpm install --frozen-lockfile', 'pnpm install --frozen-lockfile')
    content = content.replace('npm ci', 'pnpm install --frozen-lockfile')

    # Replace npm run with pnpm run
    content = content.replace('npm run', 'pnpm run')

    # Pattern to match setup-node blocks
    # It might have name or not, might have cache or not.
    pattern = re.compile(r'( *)(-( name: [^\n]+)?\n +)?uses: actions/setup-node@v4\n +with:\n +node-version: ([^\n]+)\n( +cache: [^\n]+\n)?')

    def replace_node_setup(match):
        indent = match.group(1)
        node_version = match.group(4)

        return f"""{indent}- name: Setup pnpm
{indent}  uses: pnpm/action-setup@v4
{indent}  with:
{indent}    version: 9

{indent}- name: Setup Node.js
{indent}  uses: actions/setup-node@v4
{indent}  with:
{indent}    node-version: {node_version}
{indent}    cache: 'pnpm'
"""

    new_content = pattern.sub(replace_node_setup, content)

    # Final cleanup of double newlines
    new_content = re.sub(r'\n\n\n+', '\n\n', new_content)

    with open(filepath, 'w') as f:
        f.write(new_content)

workflows_dir = '.github/workflows'
for filename in os.listdir(workflows_dir):
    if filename.endswith('.yml') or filename.endswith('.yaml'):
        fix_workflow(os.path.join(workflows_dir, filename))
