export default defineNuxtRouteMiddleware(async (to) => {
  const { path } = to;
  const guest = ["/social-login"];
  const authExactUrls = [""];
  const adminExactUrls = [""];
  const authStartsWithRoutes = ["/dashboard"];
  const adminStartsWithRoutes = ["/admin"];

  const { fetchUser, authUser } = useAuth();
  await fetchUser();

  const isExactRoute = authExactUrls.includes(path);
  const isAdminExactRoute = adminExactUrls.includes(path);
  const isStartsRoute = authStartsWithRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAdminStartsRoute = adminStartsWithRoutes.some((route) =>
    path.startsWith(route)
  );

  if (
    !(isExactRoute || isStartsRoute || isAdminExactRoute || isAdminStartsRoute)
  ) {
    if (guest.includes(path)) {
      if (authUser.value) return navigateTo("/dashboard");
    }
  }

  if (isExactRoute || isStartsRoute) {
    if (!authUser.value) return navigateTo("/");
  }

  if (isAdminExactRoute || isAdminStartsRoute) {
    if (!authUser.value || !authUser.value.isAdmin) return navigateTo("/");
  }
});
