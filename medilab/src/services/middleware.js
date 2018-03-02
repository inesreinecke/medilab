
export default {
  auth (to, from, next) {
    // const isAuthenticated = false

    next(localStorage.getItem('isAuthenticated') ? true : {
      path: '/',
      query: {
        redirect: to.path
      }
    })
    // console.log(to)
    // console.log(from)
    // next()
  }
}
