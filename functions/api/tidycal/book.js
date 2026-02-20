/**
 * POST /api/tidycal/book
 * Creates a real booking for the Openclaw team booking type.
 *
 * Default booking type: 1756759 ("15 Minute Open Claw Consultation Call")
 * Team URL: https://tidycal.com/team/openclaw/15-minute-open-claw-consultation-call
 *
 * Expected request body:
 * {
 *   bookingTypeId?: number,  // Optional override; defaults to 1756759
 *   name: string,
 *   email: string,
 *   notes?: string,
 *   timezone?: string
 * }
 */

const DEFAULT_BOOKING_TYPE_ID = 1756759;

export async function onRequestPost(context) {
    const apiKey = context.env.TIDYCAL_API_KEY;

    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Missing API key' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

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

    if (!name || !email) {
        return new Response(JSON.stringify({ error: 'name and email are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const typeId = bookingTypeId || DEFAULT_BOOKING_TYPE_ID;

    const payload = {
        name,
        email,
        timezone: timezone || 'America/Chicago',
        ...(notes && {
            answers: [{ question: 'What do you want OpenClaw to help with?', answer: notes }],
        }),
    };

    try {
        const res = await fetch(`https://tidycal.com/api/booking-types/${typeId}/bookings`, {
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

        const booking = data.data;
        const bookingUrl =
            booking?.booking_page_url ||
            'https://tidycal.com/team/openclaw/15-minute-open-claw-consultation-call';

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
