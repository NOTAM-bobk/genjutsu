export const config = { runtime: 'edge' };

export default async function handler(req) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const apiKey = process.env.ABLY_KEY;
    if (!apiKey || !apiKey.includes(':')) {
        return new Response(JSON.stringify({ error: 'Ably key not configured properly' }), { status: 500 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const clientId = searchParams.get('clientId') || `anon_${Math.random().toString(36).substring(2, 10)}`;
        const [keyName] = apiKey.split(':');
        
        // Use pure fetch to the Ably REST API - bypasses any Node.js/SDK bugs on Vercel
        const tokenRes = await fetch(`https://rest.ably.io/keys/${keyName}/requestToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(apiKey)}`
            },
            body: JSON.stringify({
                clientId: clientId,
                capability: {
                    "genjutsu_stranger_*": ["publish", "subscribe", "presence"],
                    "chat_*": ["publish", "subscribe", "presence"]
                }
            })
        });

        if (!tokenRes.ok) {
            throw new Error(`Ably rejected token request: ${tokenRes.status}`);
        }

        const tokenData = await tokenRes.json();
        
        return new Response(JSON.stringify(tokenData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            }
        });
    } catch (error) {
        console.error('Ably edge token error:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate token' }), { status: 500 });
    }
}
