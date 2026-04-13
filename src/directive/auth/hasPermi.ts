import { useUserStore } from '@/store/modules/user';

export default {
  mounted(el: HTMLElement, binding: any) {
    const { value } = binding;
    const userStore = useUserStore();
    const { permissions } = userStore;

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value;
      const hasPermissions = permissions.some((permission: string) => {
        return permissionFlag.includes(permission);
      });
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  }
};
