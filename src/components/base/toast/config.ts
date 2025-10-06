import type { ToastThemeConfig, ToastStyleConfig, ToastType } from './types';

const successConfig: ToastStyleConfig = {
  title: 'Success!',
  icon: 'check-circle',
  iconColor: '#FFFFFF',
  textColor: '#FFFFFF',
  backgroundColor: '#00B894',
  subtitleColor: 'rgba(255, 255, 255, 0.9)',
  closeIconColor: 'rgba(255, 255, 255, 0.8)',
  subtitle: 'Operation completed successfully',
  progressBarColor: 'rgba(255, 255, 255, 0.95)',
  progressTrackColor: 'rgba(255, 255, 255, 0.2)',
};
const errorConfig: ToastStyleConfig = {
  title: 'Oh no!',
  icon: 'alert-circle',
  iconColor: '#FFFFFF',
  textColor: '#FFFFFF',
  backgroundColor: '#E74C3C',
  subtitle: 'Something went wrong',
  subtitleColor: 'rgba(255, 255, 255, 0.9)',
  closeIconColor: 'rgba(255, 255, 255, 0.8)',
  progressBarColor: 'rgba(255, 255, 255, 0.95)',
  progressTrackColor: 'rgba(255, 255, 255, 0.2)',
};
const warningConfig: ToastStyleConfig = {
  icon: 'alert',
  title: 'Warning!',
  iconColor: '#FFFFFF',
  textColor: '#FFFFFF',
  backgroundColor: '#F39C12',
  subtitle: 'Please check your action',
  subtitleColor: 'rgba(255, 255, 255, 0.9)',
  closeIconColor: 'rgba(255, 255, 255, 0.8)',
  progressBarColor: 'rgba(255, 255, 255, 0.95)',
  progressTrackColor: 'rgba(255, 255, 255, 0.2)',
};
const infoConfig: ToastStyleConfig = {
  title: 'Info',
  icon: 'information',
  iconColor: '#FFFFFF',
  textColor: '#FFFFFF',
  backgroundColor: '#3498DB',
  subtitle: "Here's some information",
  subtitleColor: 'rgba(255, 255, 255, 0.9)',
  closeIconColor: 'rgba(255, 255, 255, 0.8)',
  progressBarColor: 'rgba(255, 255, 255, 0.95)',
  progressTrackColor: 'rgba(255, 255, 255, 0.2)',
};

// Main toast configuration
export const TOAST_CONFIG: ToastThemeConfig = {
  colors: {
    info: infoConfig,
    error: errorConfig,
    warning: warningConfig,
    success: successConfig,
  },
  defaults: {
    iconSize: 24,
    duration: 3000,
    borderRadius: 16,
    closeIconSize: 20,
    showProgress: true,
    fontFamily: 'Montserrat',
  },
};

export const getToastConfig = (type: keyof ToastThemeConfig['colors']): ToastStyleConfig => {
  return TOAST_CONFIG.colors[type] || TOAST_CONFIG.colors.success;
};

export { successConfig, errorConfig, warningConfig, infoConfig, type ToastType };
