/**
 * POST /api/tidycal/book
 * Creates a real booking in TidyCal.
 *
 * Expected request body:
 * {
 *   bookingTypeId: number,   // TidyCal booking type ID
 *   name: string,            // Customer name
 *   email: string,           // Customer email
 *   notes: string,           // Goals / context (mapped to custom question)
 *   timezone: string         // e.g. "America/Chicago"
 * }
 */
export async function onRequestPost(context) {
    const apiKey = context.env.TIDYCAL_API_KEY;

    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Missing API key' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Parse request body
    let body;
    try {
        body = await context.request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { bookingTypeId, name, email, notes, timezone } = body;

    if (!bookingTypeId || !name || !email) {
        return new Response(JSON.stringify({ error: 'bookingTypeId, name, and email are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Build the TidyCal booking payload
    const payload = {
        name,
        email,
        timezone: timezone || 'America/Chicago',
        ...(notes && {
            answers: [{ question: 'What do you want OpenClaw to help with?', answer: notes }],
        }),
    };

    try {
        const res = await fetch(`https://tidycal.com/api/booking-types/${bookingTypeId}/bookings`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            return new Response(JSON.stringify({ error: 'TidyCal booking failed', detail: data }), {
                status: res.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Extract the booking URL if available
        const booking = data.data;
        const bookingUrl = booking?.booking_page_url || booking?.tidycal_url || null;

        return new Response(
            JSON.stringify({
                success: true,
                booking_url: bookingUrl,
                booking_id: booking?.id,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Internal error', detail: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Handle CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
