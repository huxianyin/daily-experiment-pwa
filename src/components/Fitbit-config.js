export const config = {
    issuer: 'https://www.fitbit.com/oauth2/authorize',
    clientId: '238PJS',
    scopes: ['activity', 'sleep', 'heartrate', 'profile', 'respiratory_rate', 'temperature'],
    clientSecret: '3ab2d9f96b2ef96c25a0d90290dea9c1',
    redirectUrl: 'http://127.0.0.1:3000/', //note: path is required
    additionalParameters: {},
    serviceConfiguration: {
        authorizationEndpoint: 'https://www.fitbit.com/oauth2/authorize',
        tokenEndpoint: 'https://api.fitbit.com/oauth2/token',
    }
};


//export default config;