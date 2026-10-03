export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('auth_token')
  
  if (to.path !== '/login' && !token.value) {
    return navigateTo('/login')
  }
  
  if (to.path === '/login' && token.value) {
    return navigateTo('/')
  }
})
