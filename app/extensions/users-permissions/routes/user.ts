module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/auth/local/register',
        handler: 'user.register',
        config: {
          middlewares: [],
          policies: [],
        }
      },
      {
        method: 'GET',
        path: '/auth/verify-email',
        handler: 'user.verifyEmail',
        config: {
          middlewares: [],
          policies: [],
        }
      },
      {
        method: 'POST',
        path: '/auth/local',
        handler: 'user.login',
        config: {
          middlewares: [],
          policies: [],
        }
      },
      {
        method: 'POST',
        path: '/auth/forgot-password',
        handler: 'user.forgotPassword',
        config: {
          middlewares: [],
          policies: [],
        }
      },
      {
        method: 'POST',
        path: '/auth/reset-password',
        handler: 'user.resetPassword',
        config: {
          middlewares: [],
          policies: [],
        }
      }
    ]
  };