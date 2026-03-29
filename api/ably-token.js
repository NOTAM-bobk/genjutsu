import Ably from 'ably';

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.ABLY_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Ably key not configured on server' });
    }

    try {
        const clientId = req.query.clientId || `anon_${Math.random().toString(36).substring(2, 10)}`;
        
        const client = new Ably.Rest(apiKey);
        const tokenRequestData = await client.auth.createTokenRequest({
            clientId,
            capability: {
                'genjutsu_stranger_*': ['publish', 'subscribe', 'presence'],
                'chat_*': ['publish', 'subscribe', 'presence'],
            }
        });

        res.status(200).json(tokenRequestData);
    } catch (error) {
        console.error('Ably token error:', error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
}
