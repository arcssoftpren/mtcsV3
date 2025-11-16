// Utilities
import { defineStore } from 'pinia';
import axios from 'axios';
import swal from 'sweetalert2';

export const useAppStore = defineStore('app', {
  persist: {
    pick: ['token', 'userData'],
  },
  state: () => ({
    //
    token: '',
    userData: {},
    apiServer: `http://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/api`,
    myAlert: swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = swal.stopTimer;
        toast.onmouseleave = swal.resumeTimer;
      },
      customClass: {
        container: 'swal-custom-zindex',
      },
    }),
    preload: false,
    preloadList: [],
    setupList: [
      {
        title: 'User Management',
        icon: 'mdi-account-multiple',
        path: '/setups/users',
      },
      {
        title: 'Role Management',
        icon: 'mdi-shield-key-outline',
        path: '/setups/roles',
      },
      {
        title: 'Tools Management',
        icon: 'mdi-wrench',
        path: '/setups/tools',
      },
    ],
    menuList: [
      {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        path: '/dashboard',
      },
      {
        title: 'Operator Report',
        icon: 'mdi-view-dashboard',
        path: '/inspections/daily',
      },
      {
        title: 'Leader Report',
        icon: 'mdi-view-dashboard',
        path: '/inspections/weekly',
      },
      {
        title: 'SPV Report',
        icon: 'mdi-view-dashboard',
        path: '/inspections/monthly',
      },
      {
        title: 'Abnormalities Report - Production',
        icon: 'mdi-view-dashboard',
        path: '/inspections/abnormalities',
      },
      {
        title: 'Finished Inspections',
        icon: 'mdi-view-dashboard',
        path: '/inspections/pdfreport',
      },
    ],
  }),
  actions: {
    fetchData(data, url, method = 'GET', options = {}) {
      return new Promise(async (resolve, reject) => {
        let preloadId = await this.generateUniqueRandomNumber();
        this.preloadList.push(preloadId);
        this.preload = this.preloadList.length > 0;
        await axios({
          method,
          url: `${this.apiServer}${url}`,
          data,
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          ...options,
        })
          .then((response) => {
            resolve(response.data);
            this.preloadList = this.preloadList.filter(
              (id) => id !== preloadId
            );
            setTimeout(() => {
              this.preload = this.preloadList.length > 0;
            }, 300);
          })
          .catch((error) => {
            reject(error.response.data);
            this.preloadList = this.preloadList.filter(
              (id) => id !== preloadId
            );
            setTimeout(() => {
              this.preload = this.preloadList.length > 0;
            }, 300);
          });
      });
    },
    async checkAccess(token, path) {
      try {
        const response = await this.fetchData(
          { token, path },
          '/access',
          'POST'
        );
        return response;
      } catch (error) {
        console.error('Access check error:', error);
        if (error.message == 'Invalid token') {
          this.logout();
        }
        return { access: false };
      }
    },
    async logout() {
      this.token = '';
      this.userData = {};
      this.myAlert.fire({
        icon: 'success',
        title: 'Logged out successfully',
      });
    },
    async generateUniqueRandomNumber() {
      let uniqueNumber;
      do {
        uniqueNumber = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit number
      } while (this.preloadList.includes(uniqueNumber));
      return uniqueNumber;
    },
  },
});
