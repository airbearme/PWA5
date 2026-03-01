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

    # 1. Add global env if it doesn't exist
    has_global_env = False
    for line in lines[:30]:
        if line.startswith('env:'):
            has_global_env = True
            break

    if not has_global_env:
        # Insert after name: or on:
        inserted = False
        for i, line in enumerate(lines):
            if line.startswith('on:') or line.startswith('name:'):
                # Find the end of this block
                j = i + 1
                while j < len(lines) and (lines[j].startswith(' ') or not lines[j].strip()):
                    j += 1

                # Insert env block at j
                env_block = ["env:\n"]
                for k, v in placeholders.items():
                    env_block.append(f"  {k}: ${{{{ secrets.{k} || '{v}' }}}}\n")

                # Also add NODE_VERSION if not there
                if 'NODE_VERSION' not in "".join(lines):
                    env_block.append("  NODE_VERSION: '20.x'\n")

                lines[j:j] = env_block
                inserted = True
                break
    else:
        # Global env exists, ensure our vars are there
        # This is more complex, but let's try to append to it
        for i, line in enumerate(lines):
            if line.startswith('env:'):
                j = i + 1
                existing_vars = []
                while j < len(lines) and lines[j].startswith('  '):
                    existing_vars.append(lines[j].split(':')[0].strip())
                    j += 1

                for k, v in placeholders.items():
                    if k not in existing_vars:
                        lines.insert(j, f"  {k}: ${{{{ secrets.{k} || '{v}' }}}}\n")
                        j += 1
                break

    # 2. Standardize steps: checkout -> setup-pnpm -> setup-node
    i = 0
    while i < len(lines):
        line = lines[i]

        # Detect start of steps
        if line.strip() == 'steps:':
            indent = line[:line.find('steps:')]
            step_indent = indent + "  "

            # Look at the steps in this job
            j = i + 1
            job_steps = []
            while j < len(lines) and (lines[j].startswith(step_indent) or not lines[j].strip()):
                job_steps.append(lines[j])
                j += 1

            # Clean up these steps: remove all setup-pnpm and setup-node
            # We'll rebuild them in correct order
            new_job_steps = []
            has_checkout = False
            for step_line in job_steps:
                if 'uses: actions/checkout' in step_line:
                    has_checkout = True
                # Skip existing setup steps
                if any(x in step_line for x in ['pnpm/action-setup', 'actions/setup-node', 'Setup pnpm', 'Setup Node.js']):
                    continue
                # Also skip the 'with' and other follow-up lines of these steps
                # This is hard because we don't know where they end easily
                # But typically they follow the 'uses' line
                new_job_steps.append(step_line)

            # Filter out lines that were part of 'with' blocks for setup-node/pnpm
            # This is a bit risky but we'll try to remove lines with 'version:', 'node-version:', 'cache:'
            # that are not part of other steps
            filtered_steps = []
            skip_next = 0
            for k, s in enumerate(new_job_steps):
                if skip_next > 0:
                    skip_next -= 1
                    continue
                if any(x in s for x in ['version:', 'node-version:', 'cache: "pnpm"', "cache: 'pnpm'"]):
                    continue
                filtered_steps.append(s)

            # Rebuild steps
            rebuilt = []
            if has_checkout:
                rebuilt.append(f"{step_indent}- uses: actions/checkout@v4\n")
                rebuilt.append(f"{step_indent}- name: Setup pnpm\n")
                rebuilt.append(f"{step_indent}  uses: pnpm/action-setup@v4\n")
                rebuilt.append(f"{step_indent}  with:\n")
                rebuilt.append(f"{step_indent}    version: latest\n")
                rebuilt.append(f"{step_indent}- name: Setup Node.js\n")
                rebuilt.append(f"{step_indent}  uses: actions/setup-node@v4\n")
                rebuilt.append(f"{step_indent}  with:\n")
                rebuilt.append(f"{step_indent}    node-version: ${{{{ env.NODE_VERSION || '20.x' }}}}\n")
                rebuilt.append(f"{step_indent}    cache: 'pnpm'\n")

            # Add back remaining steps
            # But avoid adding 'env:' blocks that were attached to pnpm run commands
            # since we have them globally now
            final_steps = []
            skip_env = False
            for s in filtered_steps:
                if 'pnpm run' in s or 'pnpm install' in s:
                    final_steps.append(s)
                    skip_env = True # We might want to skip the immediately following env block
                elif skip_env and ('env:' in s or (step_indent + '  ') in s and ':' in s):
                    continue
                else:
                    final_steps.append(s)
                    if s.strip().startswith('-'):
                        skip_env = False

            rebuilt.extend(final_steps)

            # Replace in lines
            lines[i+1:j] = rebuilt
            i += len(rebuilt)
            continue

        i += 1

    # 3. Final cleanup
    content = "".join(lines)
    content = content.replace("ppnpm", "pnpm")
    content = content.replace("\\'", "'")
    content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)

    with open(filepath, 'w') as f:
        f.write(content)

workflow_dir = '.github/workflows'
for filename in os.listdir(workflow_dir):
    if filename.endswith('.yml'):
        fix_workflow(os.path.join(workflow_dir, filename))
