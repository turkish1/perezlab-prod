function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock users:
 * - admin / password => roles: ['admin','staff']
 * - staff / password => roles: ['staff']
 * - customer / password => roles: []
 */
const MOCK_USERS = [
    { id: 'u_admin', name: 'Bibi Lopez', email: 'BibiLopez@perez.co', username: 'bibi', roles: ['admin', 'staff'] },
    { id: 'u_admin', name: 'Hugo Blanco', email: 'HugoBlanco@perez.co', username: 'hugob', roles: ['admin', 'staff'] },
    { id: 'u_service', name: 'AWS Service', email: 'orders@perezlab.co', roles: ['service'] },
    { id: 'u_customer', name: 'Casey Customer', username: 'customer', roles: [] }
];

export const authService = {
    async login(username, password) {
        await sleep(300);

        if (!username) {
            throw new Error('Username is required');
        }

        const normalized = String(username).toLowerCase();

        const found = MOCK_USERS.find((u) => u.username && u.username.toLowerCase() === normalized);
        if (!found || password !== 'password') {
            const err = new Error('Invalid username or password');
            err.code = 'AUTH_INVALID';
            throw err;
        }

        const token = `mock.${found.id}.${Date.now()}`;

        return { token, user: found };
    },
    // async login(username, password) {
    //     await sleep(300);

    //     const found = MOCK_USERS.find((u) => u.username.toLowerCase() === String(username).toLowerCase());

    //     if (!found || password !== 'password') {
    //         const err = new Error('Invalid username or password');
    //         err.code = 'AUTH_INVALID';
    //         throw err;
    //     }

    //     // Mock token (replace with JWT in production)
    //     const token = `mock.${found.id}.${Date.now()}`;

    //     return {
    //         token,
    //         user: found
    //     };
    // },

    async logout() {
        await sleep(100);
        return true;
    }
};
