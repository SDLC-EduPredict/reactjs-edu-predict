import { useMemo } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import { toastAdded, type ToastType } from '@/app/store/slices/uiSlice';

export const useToast = () => {
  const dispatch = useAppDispatch();
  return useMemo(() => {
    const show = (type: ToastType) => (title: string, message?: string) =>
      dispatch(toastAdded({ type, title, message }));
    return {
      success: show('success'),
      error: show('error'),
      info: show('info'),
      warning: show('warning'),
    };
  }, [dispatch]);
};
