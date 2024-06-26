<template>
  <div>
    <h1>Signup</h1>
    <form @submit.prevent="signup">
      <input v-model="username" type="text" placeholder="Username" required>
      <input v-model="password" type="password" placeholder="Password" required>
      <button type="submit">Signup</button>
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
    signup() {
      axios.post('https://localhost:3000/signup', {
        username: this.username,
        password: this.password
      }, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
      .then(() => {
        this.$router.push('/login');
      })
      .catch(error => {
        alert('Failed to sign up');
        console.error(error);
      });
    }
  }
};
</script>
