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
        lines = f.readlines()

    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        new_lines.append(line)

        # Check if this line is "run: pnpm run build" or "run: pnpm run test"
        if 'run: pnpm run build' in line or 'run: pnpm run start' in line or 'run: pnpm run test' in line:
            # Check if it already has an 'env:' block
            has_env = False
            j = i + 1
            while j < len(lines) and not lines[j].strip().startswith('-') and 'steps:' not in lines[j]:
                if 'env:' in lines[j]:
                    has_env = True
                    break
                j += 1

            if not has_env:
                # Insert env block
                indent = line[:line.find('run:')]
                new_lines.append(f"{indent}env:\n")
                for key, val in placeholders.items():
                    new_lines.append(f"{indent}  {key}: ${{ secrets.{key} || '{val}' }}\n")
            else:
                # It has an env block, but we want to ensure all placeholders are there if not already
                # This is more complex, let's just append them to the existing env block if missing
                pass
        i += 1

    with open(filepath, 'w') as f:
        f.writelines(new_lines)

# For now let's just do it for the failed ones manually or with a better script
# Actually, the problem is specifically when secrets are empty.

# Let's try to find all 'run: pnpm run build' and replace them with a version that has the env
