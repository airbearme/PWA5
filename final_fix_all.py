import os
import re

placeholders = {
    'NEXT_PUBLIC_SUPABASE_PWA4_URL': 'https://placeholder.supabase.co',
    'NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY': 'eyJplaceholder',
    'SUPABASE_PWA4_SERVICE_ROLE_KEY': 'placeholder',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': 'pk_test_placeholder',
    'STRIPE_SECRET_KEY': 'sk_test_placeholder',
    'NEXT_PUBLIC_SITE_URL': 'https://airbear.me'
}

def fix_workflow(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Standardize to pnpm and clean artifacts
    content = content.replace('npm ci', 'pnpm install --frozen-lockfile')
    content = content.replace('npm install', 'pnpm install --frozen-lockfile')
    content = content.replace('npm run', 'pnpm run')
    content = content.replace('ppnpm', 'pnpm')
    content = content.replace('--frozen-lockfile --frozen-lockfile', '--frozen-lockfile')
    content = content.replace("\\'", "'")
    content = content.replace('secrets.NEXT_PUBLIC_SUPABASE_URL', 'secrets.NEXT_PUBLIC_SUPABASE_PWA4_URL')
    content = content.replace('secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY', 'secrets.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY')
    content = content.replace('secrets.SUPABASE_SERVICE_ROLE_KEY', 'secrets.SUPABASE_PWA4_SERVICE_ROLE_KEY')

    # Standardize global env
    content = re.sub(r'\nenv:.*?(?=\non:|\njobs:)', '', content, flags=re.DOTALL)
    env_block = "\nenv:\n"
    env_block += "  NODE_VERSION: '20.x'\n"
    for k, v in placeholders.items():
        env_block += f"  {k}: ${{{{ secrets.{k} || '{v}' }}}}\n"

    if 'env:' not in content[:500]:
        content = re.sub(r'on:.*?\n', lambda m: m.group(0) + env_block, content, count=1)

    # Standardize jobs
    job_blocks = re.split(r'^  (\w+):', content, flags=re.MULTILINE)
    header = job_blocks[0]
    new_jobs = []
    for i in range(1, len(job_blocks), 2):
        job_name = job_blocks[i]
        job_body = job_blocks[i+1]

        if 'steps:' in job_body:
            steps_match = re.search(r'steps:\s*\n', job_body)
            pre_steps = job_body[:steps_match.end()]
            steps_content = job_body[steps_match.end():]

            old_steps = re.split(r'^\s+- ', steps_content, flags=re.MULTILINE)
            remaining = []
            has_checkout = False
            for s in old_steps:
                s = s.strip()
                if not s: continue
                if 'uses: actions/checkout' in s:
                    has_checkout = True
                    continue
                if any(x in s for x in ['pnpm/action-setup', 'actions/setup-node', 'Setup pnpm', 'Setup Node.js']):
                    continue
                s = re.sub(r'env:.*?(?=\n\s*-|$)', '', s, flags=re.DOTALL).strip()
                if s: remaining.append(s)

            rebuilt = []
            if has_checkout:
                rebuilt.append('uses: actions/checkout@v4')
                rebuilt.append('uses: pnpm/action-setup@v4\n        with:\n          version: latest')
                rebuilt.append('uses: actions/setup-node@v4\n        with:\n          node-version: ${{ env.NODE_VERSION }}\n          cache: "pnpm"')

            rebuilt.extend(remaining)
            job_body = pre_steps + "\n".join(['      - ' + s for s in rebuilt])

        new_jobs.append(f"  {job_name}:{job_body}")

    content = header + "\n".join(new_jobs)
    content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)

    with open(filepath, 'w') as f:
        f.write(content)

workflow_dir = '.github/workflows'
# Verified manually: ci-cd.yml, auto-deploy.yml, test-comprehensive.yml, self-test.yml, deploy.yml, airbear-visual.yml, validate-ui-ux.yml, deploy-vercel.yml
verified = ['ci-cd.yml', 'auto-deploy.yml', 'test-comprehensive.yml', 'self-test.yml', 'deploy.yml', 'airbear-visual.yml', 'validate-ui-ux.yml', 'deploy-vercel.yml']
for filename in os.listdir(workflow_dir):
    if filename.endswith('.yml') and filename not in verified:
        fix_workflow(os.path.join(workflow_dir, filename))
