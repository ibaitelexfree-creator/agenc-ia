import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agencia.getxobelaeskola',
  appName: 'Getxobelaeskola',
  webDir: '.next/out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      autoHide: true,
    },
  },
};

export default config;
 