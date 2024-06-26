<template>
  <div>
    <h1>Home</h1>
    <div v-if="user">
      <p>Welcome, {{ user.username }} your balance is {{ user.balance }}</p>
      <button @click="logout">Logout</button>

      <div>
        <form @submit.prevent="transferMoney">
          <input v-model="recipientUsername" placeholder="Recipient Username" required />
          <input v-model.number="amount" type="number" placeholder="Amount" required />
          <button type="submit">Transfer</button>
        </form>
      </div>
    </div>
    <div v-else>
      <h2>You are not logged in</h2>
      <!-- Navigation Links -->
      <button @click="$router.push('/login')">Login</button>
      <button @click="$router.push('/signup')">Signup</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import https from 'https-browserify';

export default {
  data() {
    return {
      user: null
    };
  },
  methods: {
    logout() {
      axios.defaults.withCredentials = true;
      axios.get('https://localhost:3000/logout', {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      }).then(() => {
        this.user = null;
        this.$router.push('/login');
      }).catch(error => {
        console.error('Logout failed:', error);
      });
    },
    transferMoney() {
      axios.post('https://localhost:3000/transfer', {
        recipientUsername: this.recipientUsername,
        amount: this.amount
      }, {
        withCredentials: true, // Ensure cookies are sent and accepted
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
      .then(response => {
        console.log('Transfer successful:', response.data);
        window.location.reload(); // Refresh the page
      })
      .catch(error => {
        console.error('Transfer failed:', error.response.data);
      });
    }
  },
  mounted() {
    axios.get('https://localhost:3000/user', {
          withCredentials: true, // This ensures cookies are sent and accepted
          httpsAgent: new https.Agent({
            rejectUnauthorized: false
          })
        })
      .then(response => {
        this.user = response.data;
      })
      .catch(error => {
        console.error('Failed to fetch user:', error);
      });
  }
};
</script>
