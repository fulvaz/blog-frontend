const enviroments = {
    production: {
        apiPrefix: '',
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

console.log(process.env.REACT_APP_ENV);

export const environment = enviroments[process.env.REACT_APP_ENV];
