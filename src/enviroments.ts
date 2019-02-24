const enviroments = {
    production: {
        apiPrefix: 'http://api.fulvaz.com/blog',
        login: '/login',
        logout: '/logout',
    },
    dev: {
        apiPrefix: '',
        login: '/login',
        logout: '/logout',
    },
    local: {
        apiPrefix: '/blog',
        login: '/login',
        logout: '/logout',
    },
};

console.log(process.env);

export const environment = enviroments[process.env.REACT_APP_ENV];
