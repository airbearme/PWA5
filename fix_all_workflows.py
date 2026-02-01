import os
import re

mandatory_env = """
          NEXT_PUBLIC_SUPABASE_PWA4_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_PWA4_URL || 'https://placeholder.supabase.co' }}
          NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY || 'eyJplaceholder' }}
          SUPABASE_PWA4_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_PWA4_SERVICE_ROLE_KEY || 'placeholder' }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder' }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY || 'sk_test_placeholder' }}
          STRIPE_WEBHOOK_SECRET: ${{ secrets.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder' }}
          NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL || 'https://airbear.me' }}"""

def fix_workflow(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Fix setup-node and add pnpm-setup
    def setup_pnpm_node(match):
        indent = match.group(1)
        node_version_match = re.search(r'node-version:\s*([^\n]+)', match.group(0))
        node_version = node_version_match.group(1) if node_version_match else "'20.x'"

        res = f"{indent}- name: Setup pnpm\n"
        res += f"{indent}  uses: pnpm/action-setup@v4\n"
        res += f"{indent}  with:\n"
        res += f"{indent}    version: 9\n\n"
        res += f"{indent}- name: Setup Node.js\n"
        res += f"{indent}  uses: actions/setup-node@v4\n"
        res += f"{indent}  with:\n"
        res += f"{indent}    node-version: {node_version}\n"
        res += f"{indent}    cache: 'pnpm'\n"
        return res

    # Replace existing setup-node blocks (simplified)
    # We look for uses: actions/setup-node@v4 and its preceding step if it's already pnpm/action-setup
    # but it's easier to just identify setup-node and ensure pnpm-setup is there.

    # First, remove any existing pnpm/action-setup to avoid duplicates
    content = re.sub(r'^\s*-\s*(name: [^\n]*\n\s*)?uses: pnpm/action-setup@[^\n]*\n(\s+with:\n\s+version: [^\n]*\n)?', '', content, flags=re.MULTILINE)

    # Now replace setup-node with the full standardized block
    content = re.sub(r'^(\s+)-\s*(name: [^\n]*\n\1\s*)?uses: actions/setup-node@v4\n(\1\s+with:\n(\1\s+[^\n]*\n)*)?', setup_pnpm_node, content, flags=re.MULTILINE)

    # 2. Standardize dependencies install
    content = re.sub(r'run: npm ci', 'run: pnpm install --frozen-lockfile', content)
    content = re.sub(r'run: npm install', 'run: pnpm install', content)
    content = re.sub(r'npm ci \|\| pnpm install --frozen-lockfile', 'pnpm install --frozen-lockfile', content)

    # 3. Fix Vercel CLI
    content = re.sub(r'npm install --global vercel@latest', 'pnpm add -g vercel', content)
    content = re.sub(r'npm install -g vercel', 'pnpm add -g vercel', content)

    # 4. Fix ppnpm typos
    content = content.replace('ppnpm', 'pnpm')

    # 5. Add mandatory env to build/test steps
    # This is tricky with regex. We look for run: pnpm run build or run: pnpm run test
    steps_to_env = ['pnpm run build', 'pnpm run test', 'pnpm test', 'pnpm run validate', 'vercel build', 'pnpm run type-check', 'pnpm run lint']

    lines = content.split('\n')
    new_lines = []
    for line in lines:
        new_lines.append(line)
        if any(cmd in line for cmd in steps_to_env) and 'run:' in line:
            # Check if it already has an env: block next to it (heuristic)
            # For simplicity, we'll just append it if not present in the next few lines
            pass
    # Actually, a better way to add env is to find the step and add it.

    # Let's use a simpler approach for env: replace existing env blocks or add new ones
    # for build steps.

    def add_env_to_step(match):
        step_content = match.group(0)
        if 'env:' in step_content:
            # Try to add missing ones to existing env block
            # But it's safer to just replace the whole env block if it's a known build/test step
            step_content = re.sub(r'(\s+)env:\n(\1\s+[^\n]*\n)*', f'\\1env:{mandatory_env}\n', step_content)
            return step_content
        else:
            # Add new env block
            return step_content.rstrip() + f"\n          env:{mandatory_env}\n"

    for cmd in steps_to_env:
        pattern = r'^(\s+)-\s*name: [^\n]*' + re.escape(cmd) + r'[^\n]*\n(\1\s+[^\n]*\n)*?\1\s+run: [^\n]*' + re.escape(cmd) + r'[^\n]*\n(\1\s+[^\n]*\n)*'
        # content = re.sub(pattern, add_env_to_step, content, flags=re.MULTILINE)
        # Regex above is too complex and fragile.

    # I'll do it manually for the most important ones as I already did,
    # but I'll make sure they are ALL covered.

    with open(filepath, 'w') as f:
        f.write(content)

workflow_dir = '.github/workflows'
for filename in os.listdir(workflow_dir):
    if filename.endswith('.yml'):
        fix_workflow(os.path.join(workflow_dir, filename))
