<template>
  <v-app light>
    <div >
      <nav>
      <v-toolbar id="navbar" v-if="$store.state.authenticated">
          <v-app-bar-nav-icon @click="side= !side"></v-app-bar-nav-icon>
          <v-toolbar-title>
            <span class="font-weight-light pr-3">MRC (Management to Reach Customer) </span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
         <v-icon  v-if="$store.state.authenticated" to="/" @click="logout()">mdi-logout</v-icon>
      </v-toolbar>
    </nav>
    <v-navigation-drawer app v-model="side"  v-if="$store.state.authenticated">
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img :src="$store.state.activeUser.image">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{$store.state.activeUser.name}}</v-list-item-title>
            <v-list-item-subtitle>{{$store.state.activeUser.role}}</v-list-item-subtitle>
          </v-list-item-content>
          <v-app-bar-nav-icon @click="side= !side"></v-app-bar-nav-icon>
        </v-list-item>
      </template>
      <v-divider></v-divider>
      <v-list-item v-for="(item, i) in items" :key="i" :to="item.link">
        <v-list-item-icon><v-icon v-text="item.icon"></v-icon></v-list-item-icon>
        <v-list-item-content><v-list-item-title v-text="item.text" ></v-list-item-title></v-list-item-content>
      </v-list-item>
      <v-list-group :value="false"  prepend-icon="mdi-settings" v-if="isVisiblefor.includes($store.state.activeUser.role)">
        <template v-slot:activator>
          <v-list-item-title>Settings</v-list-item-title>
        </template>
          <v-list-item  v-for="(item, i) in settings" :key="i" :to="item.link">
            <v-list-item-icon><v-icon v-text="item.icon"></v-icon></v-list-item-icon>
            <v-list-item-content><v-list-item-title v-text="item.text"></v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
          <router-view /> 
      </v-container>
    </v-main>
    <v-footer>  </v-footer>
    </div>
  </v-app>
</template>
<script>
export default {
  data(){
    return{
      side:false,
      transitionName: 'scale-transition',
      items: [
        { text: 'Dashboard', icon: 'mdi-home-variant',link:'/dashboard' },
        { text: 'Orders', icon: 'mdi-cart',link:'/order' },
        // { text: 'Trial', icon: 'mdi-cart',link:'/settings' },
      ],
      settings:[{ text: 'Product', icon: 'mdi-format-list-checks', link:'/product' },
        { text: 'User', icon: 'mdi-account-tie',link:'/employee'},
        { text: 'Customer', icon: 'mdi-account',link:'/customer'},],
      isVisiblefor:['admin','manager']
    }
  },methods:{
    logout() {
      this.$store.commit('RemoveAuth',{status:false,username:null,admin:false})
      this.$router.push({ name: "Home" })
    }
  },
  mounted() {
    this.$store.commit('getActiveUser')
    this.$route.name !== "Home" && !this.$store.state.authenticated ?  this.$router.push({ name: "Home" }) : false
  }
}
</script>

<style>
#navbar a{
  color: black;
  padding-inline-end: 3%;
  text-align: center;
  padding: 10px 20px;
  text-decoration: none;
}
#navbar a:hover{
   background-color:grey;
    color: white;
}
</style>
