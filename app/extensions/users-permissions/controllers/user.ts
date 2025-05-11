module.exports = {
    async register(ctx) {
      const { email, username, password } = ctx.request.body;
  
      try {
        // Create user with verified status false
        const user = await strapi.plugins['users-permissions'].services.user.add({
          username,
          email,
          password,
          provider: 'local',
          confirmed: false,
          blocked: false,
          verificationToken: strapi.plugins['users-permissions'].services.jwt.issue({ id: Date.now() }),
        });
  
        // Send verification email
        await strapi.plugins['email'].services.email.send({
          to: email,
          from: 'your-email@domain.com',
          subject: 'Verify your email',
          html: `
            <p>Please verify your email by clicking this link:</p>
            <a href="${process.env.FRONTEND_URL}/verify-email?token=${user.verificationToken}">
              Verify Email
            </a>
          `,
        });
  
        return ctx.send({ 
          message: 'Registration successful. Please check your email to verify your account.' 
        });
      } catch (error) {
        return ctx.badRequest('Registration failed', { error: error.message });
      }
    },
  
    async verifyEmail(ctx) {
      const { token } = ctx.query;
  
      try {
        const user = await strapi.query('plugin::users-permissions.user').findOne({
          where: { verificationToken: token }
        });
  
        if (!user) {
          return ctx.badRequest('Invalid or expired verification token');
        }
  
        await strapi.query('plugin::users-permissions.user').update({
          where: { id: user.id },
          data: {
            confirmed: true,
            verificationToken: null
          }
        });
  
        // Generate JWT token for automatic login
        const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id
        });
  
        return ctx.send({
          jwt,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          },
          dashboardUrl: process.env.ANGULAR_DASHBOARD_URL
        });
      } catch (error) {
        return ctx.badRequest('Email verification failed', { error: error.message });
      }
    },
  
    async login(ctx) {
      const { identifier, password } = ctx.request.body;
  
      try {
        const user = await strapi.plugins['users-permissions'].services.user.fetch({
          email: identifier
        });
  
        if (!user) {
          return ctx.badRequest('Invalid credentials');
        }
  
        if (!user.confirmed) {
          return ctx.badRequest('Please verify your email first');
        }
  
        const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
          password,
          user.password
        );
  
        if (!validPassword) {
          return ctx.badRequest('Invalid credentials');
        }
  
        // Update last login date
        await strapi.query('plugin::users-permissions.user').update({
          where: { id: user.id },
          data: { lastLoginDate: new Date() }
        });
  
        const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id
        });
  
        return ctx.send({
          jwt,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          },
          dashboardUrl: process.env.ANGULAR_DASHBOARD_URL
        });
      } catch (error) {
        return ctx.badRequest('Login failed', { error: error.message });
      }
    },
  
    async forgotPassword(ctx) {
      const { email } = ctx.request.body;
  
      try {
        const user = await strapi.query('plugin::users-permissions.user').findOne({
          where: { email }
        });
  
        if (!user) {
          return ctx.send({ message: 'If the email exists, you will receive a reset link' });
        }
  
        const resetToken = strapi.plugins['users-permissions'].services.jwt.issue({ 
          id: user.id,
          exp: Date.now() + (1000 * 60 * 60) // 1 hour expiry
        });
  
        await strapi.query('plugin::users-permissions.user').update({
          where: { id: user.id },
          data: { resetPasswordToken: resetToken }
        });
  
        await strapi.plugins['email'].services.email.send({
          to: email,
          from: 'your-email@domain.com',
          subject: 'Reset your password',
          html: `
            <p>Click the link below to reset your password:</p>
            <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">
              Reset Password
            </a>
          `
        });
  
        return ctx.send({ 
          message: 'If the email exists, you will receive a reset link' 
        });
      } catch (error) {
        return ctx.badRequest('Password reset request failed', { error: error.message });
      }
    },
  
    async resetPassword(ctx) {
      const { token, password } = ctx.request.body;
  
      try {
        const { id } = await strapi.plugins['users-permissions'].services.jwt.verify(token);
        const user = await strapi.query('plugin::users-permissions.user').findOne({
          where: { 
            id,
            resetPasswordToken: token
          }
        });
  
        if (!user) {
          return ctx.badRequest('Invalid or expired reset token');
        }
  
        await strapi.query('plugin::users-permissions.user').update({
          where: { id: user.id },
          data: {
            password,
            resetPasswordToken: null
          }
        });
  
        return ctx.send({ 
          message: 'Password reset successful' 
        });
      } catch (error) {
        return ctx.badRequest('Password reset failed', { error: error.message });
      }
    }
  };