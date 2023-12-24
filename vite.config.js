// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        indexLogined: resolve(__dirname, 'index-logined.html'),
        addNewCard: resolve(__dirname, 'add-new-card.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        editPersonalInfo: resolve(__dirname, 'edit-personal-info.html'),
        newPassword: resolve(__dirname, 'new-password.html'),
        payment: resolve(__dirname, 'payment.html'),
        productDetail: resolve(__dirname, 'product-detail.html'),
        profile: resolve(__dirname, 'profile.html'),
        resetPassword: resolve(__dirname, 'reset-password.html'),
        shipping: resolve(__dirname, 'shipping.html'),
        signIn: resolve(__dirname, 'sign-in.html'),
        signUp: resolve(__dirname, 'sign-up.html'),

        header: resolve(__dirname, './template/header.html'),
        headerLogined: resolve(__dirname, './template/header-logined.html'),
        footer: resolve(__dirname, './template/footer.html'),
      },
    },
  },
});
