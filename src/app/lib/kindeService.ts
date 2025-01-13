export async function fetchAccessToken() {
    const clientId = process.env.KINDE_CLIENT_ID_M2M || ""; // Your M2M client ID
    const clientSecret = process.env.KINDE_CLIENT_SECRET_M2M || ""; // Your M2M client secret
    const domain = process.env.KINDE_ISSUER_URL || ""; // Your Kinde domain

    if (clientId === "") {
        throw new Error('Kinde client ID is required');
    }

    if (clientSecret === "") {
        throw new Error('Kinde client secret is required');
    }

    if (domain === "") {
        throw new Error('Kinde domain is required');
    }


    const tokenEndpoint = `${domain}/oauth2/token`;
    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            audience: `${domain}/api`, // Adjust the audience as needed
        }),
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch access token: ${response.statusText}`);
    }
    const data = await response.json();
    return data.access_token;
}