/**
 * GET /api/tidycal/types
 * Returns the Openclaw Consultation team booking types.
 * Team id: 9184 ("Openclaw Consultation")
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
        const res = await fetch('https://tidycal.com/api/teams/9184/booking-types', {
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

        const types = (data.data || []).map((t) => ({
            id: t.id,
            name: t.title,
            duration: t.duration_minutes,
            slug: t.url_slug,
            booking_page_url: t.booking_page_url,
        }));

        return new Response(JSON.stringify({ data: types }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300',
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
