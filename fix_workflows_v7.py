import os
import re

def fix_workflow(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Fix build env vars placeholders to satisfy Zod
    replacements = {
        'NEXT_PUBLIC_SUPABASE_PWA4_URL': "'https://placeholder.supabase.co'",
        'NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY': "'eyJplaceholder'",
        'SUPABASE_PWA4_SERVICE_ROLE_KEY': "'placeholder'",
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': "'pk_test_placeholder'",
        'STRIPE_SECRET_KEY': "'sk_test_placeholder'",
        'NEXT_PUBLIC_SUPABASE_URL': "'https://placeholder.supabase.co'",
        'NEXT_PUBLIC_SUPABASE_ANON_KEY': "'eyJplaceholder'",
        'SUPABASE_SERVICE_ROLE_KEY': "'placeholder'",
    }

    for var, placeholder in replacements.items():
        # Look for VAR: ${{ secrets.VAR }}
        pattern = rf'({var}: \${{ secrets\.{var} )}}'
        content = re.sub(pattern, rf'\1|| {placeholder} \2', content)

    # 2. Correct pnpm audit
    content = content.replace('Run npm audit', 'Run pnpm audit')
    content = content.replace('npm audit', 'pnpm audit')

    with open(filepath, 'w') as f:
        f.write(content)

workflows_dir = '.github/workflows'
for filename in os.listdir(workflows_dir):
    if filename.endswith('.yml') or filename.endswith('.yaml'):
        fix_workflow(os.path.join(workflows_dir, filename))
