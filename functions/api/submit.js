export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    // Validate
    if (!data.name || !data.email) {
      return new Response(JSON.stringify({ error: 'Name and Email are required' }), { status: 400 });
    }

    // Prepare Email Content
    const emailBody = `
      New Submission from OpenClawMac.com!
      
      Name: ${data.name}
      Email: ${data.email}
      Phone: ${data.phone || 'N/A'}
      
      Message:
      ${data.message || 'No message provided'}
    `;

    const tasks = [];

    // 1. Send via Resend API (if key exists)
    if (env.RESEND_API_KEY) {
      tasks.push(fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'OpenClaw Mac <onboarding@resend.dev>',
          to: [env.NOTIFICATION_EMAIL || 'joshuaallancohen@gmail.com'],
          subject: 'New Lead: ' + data.name,
          text: emailBody
        })
      }).then(r => r.json().then(d => ({ service: 'resend', status: r.status, data: d }))));
    }

    // 2. Send via Zapier Webhook (if URL exists)
    if (env.ZAPIER_WEBHOOK) {
      tasks.push(fetch(env.ZAPIER_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(r => r.json().catch(() => ({})) // Zapier often returns simple text or empty
        .then(d => ({ service: 'zapier', status: r.status, data: d }))));
    }

    // 3. Send via EmailIt (if key exists)
    if (env.EMAILIT_API_KEY) {
      tasks.push(fetch('https://api.emailit.com/v1/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.EMAILIT_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'OpenClaw Mac <hi@openclawmac.com>',
          to: env.NOTIFICATION_EMAIL || 'joshuaallancohen@gmail.com',
          subject: 'New Lead: ' + data.name,
          html: emailBody.replace(/\n/g, '<br>'),
          text: emailBody
        })
      }).then(r => r.json().catch(()=>({})).then(d => ({ service: 'emailit', status: r.status, data: d }))));
    }

    // 4. Save to Supabase (if config exists)
    if (env.SUPABASE_PROJECT_URL && env.SUPABASE_ANON_KEY) {
      const supabaseUrl = `${env.SUPABASE_PROJECT_URL}/rest/v1/leads`;
      tasks.push(fetch(supabaseUrl, {
        method: 'POST',
        headers: {
          'apikey': env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          mac_model: data.macModel, // Ensure mapping matches form field names
          package: data.package,
          goals: data.goals
        })
      }).then(r => ({ service: 'supabase', status: r.status })));
    }

    // Wait for all notifications
    const results = await Promise.all(tasks);
    console.log('Notification Results:', results);
    
    // Debug output for testing
    return new Response(JSON.stringify({ success: true, message: 'Message sent!', debug: results }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
