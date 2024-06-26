<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input v-model="username" type="text" placeholder="Username">
        <input v-model="password" type="password" placeholder="Password">
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import https from 'https-browserify';
  
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      login() {
        axios.post('https://localhost:3000/login', {
          username: this.username,
          password: this.password
        }, {
          withCredentials: true, // This ensures cookies are sent and accepted
          httpsAgent: new https.Agent({
            rejectUnauthorized: false
          })
        })
        .then(() => {
          this.$router.push('/');
        })
        .catch(error => {
          alert('Failed to log in');
          console.error(error);
        });
      }
    }
  };
  </script>
  