#!/usr/bin/env node

/**
 * Error Reporting Script
 * Reports build/test errors to the error logging database
 */

const https = require('https');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.log('⚠️  Supabase credentials not set, skipping error reporting');
  process.exit(0);
}

async function reportError(errorData) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/error_logs`);
    
    const data = JSON.stringify({
      error_type: errorData.type || 'BuildError',
      error_message: errorData.message || 'Unknown error',
      error_stack: errorData.stack,
      severity: errorData.severity || 'error',
      component: 'CI/CD',
      route: 'github-actions',
      metadata: {
        workflow: process.env.GITHUB_WORKFLOW,
        run_id: process.env.GITHUB_RUN_ID,
        branch: process.env.GITHUB_REF,
        ...errorData.metadata,
      },
      consent_given: true, // CI/CD errors always logged
    });

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('✅ Error reported to database');
        resolve();
      } else {
        console.log(`⚠️  Failed to report error: ${res.statusCode}`);
        resolve(); // Don't fail the workflow
      }
    });

    req.on('error', (error) => {
      console.log(`⚠️  Error reporting failed: ${error.message}`);
      resolve(); // Don't fail the workflow
    });

    req.write(data);
    req.end();
  });
}

// Check if we're in a GitHub Actions environment
if (process.env.GITHUB_ACTIONS) {
  console.log('📊 Reporting errors to database...');
  
  // Report workflow completion status
  const workflowStatus = process.env.GITHUB_JOB_STATUS || 'unknown';
  
  if (workflowStatus === 'failure') {
    reportError({
      type: 'WorkflowFailure',
      message: `Workflow ${process.env.GITHUB_WORKFLOW} failed`,
      severity: 'error',
      metadata: {
        job: process.env.GITHUB_JOB,
        actor: process.env.GITHUB_ACTOR,
      },
    });
  }
} else {
  console.log('ℹ️  Not in GitHub Actions, skipping error reporting');
}

process.exit(0);

