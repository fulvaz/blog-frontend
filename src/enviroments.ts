 const enviroments = {
  production: {
    apiPrefix: '',
    login: 'http://auth.ad.jpushoa.com/auth',
    logout: 'http://auth.ad.jpushoa.com/auth/logout',
  },
  dev: {
    apiPrefix: 'http://nj-ssp.jpushoa.com/iportal-gw2/ad-pkg-distribution-portal',
    login: 'http://dev-test.jpushoa.com/ad/auth',
    logout: 'http://dev-test.jpushoa.com/ad/auth/logout',
  },
  local: {
    apiPrefix: 'http://nj-ssp.jpushoa.com/iportal-gw2/ad-pkg-distribution-portal',
    login: 'http://dev-test.jpushoa.com/ad/auth',
    logout: 'http://dev-test.jpushoa.com/ad/auth/logout',
  }
};

console.log(process.env.REACT_APP_ENV);

export const environment = enviroments[process.env.REACT_APP_ENV];