export function isSuperAdmin(user: IUser) {
  return user.role === 'super_admin';
}
