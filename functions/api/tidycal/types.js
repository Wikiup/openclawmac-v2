/**
 * GET /api/tidycal/types
 * Proxies TidyCal booking types — returns id, name, duration for mapping.
 * The TIDYCAL_API_KEY secret is injected by Cloudflare at runtime.
 */
export async function onRequestGet(context) {
    const apiKey = context.env.TIDYCAL_API_KEY;

    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Missing API key' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const res = await fetch('https://tidycal.com/api/booking-types', {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: 'application/json',
            },
        });

        if (!res.ok) {
            const text = await res.text();
            return new Response(JSON.stringify({ error: 'TidyCal API error', detail: text }), {
                status: res.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await res.json();

        // Return a slimmed-down response with just what the frontend needs
        const types = (data.data || []).map((t) => ({
            id: t.id,
            name: t.title,
            duration: t.duration_minutes,
            slug: t.url_slug,
        }));

        return new Response(JSON.stringify({ data: types }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300', // cache for 5 minutes
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Internal error', detail: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
