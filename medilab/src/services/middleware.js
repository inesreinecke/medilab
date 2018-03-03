
export default {
  auth (to, from, next) {
    next(localStorage.getItem('isAuthenticated') ? true : {
      path: '/',
      query: {
        redirect: to.path
      }
    })
  }
}
