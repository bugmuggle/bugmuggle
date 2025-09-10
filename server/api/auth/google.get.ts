export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['email', 'openid', 'profile']
  },
  async onSuccess(event, { user, tokens }) {
    console.log('Google Auth onSuccess')
    /* await setUserSession(event, {
      user: {
        githubId: user.id
      }
    })
    return sendRedirect(event, '/') */
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  },
})