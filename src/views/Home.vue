<template>
  <div class="home">
    <v-row :style="`height:${height}px`">
      <v-card max-height="60%" class="mx-auto my-auto pa-10" width="600px" elevation="12">
        <v-card-title primary-title> <h4 class="text-xs-center mx-auto my-auto" id="v-step-0">To Step In.. </h4></v-card-title>
        <v-form>
          <v-text-field prepend-icon="mdi-account" label="Username" v-model="form.username" id="v-step-1"></v-text-field>
          <v-text-field prepend-icon="mdi-lock" label="Password" type="password" v-model="form.password" id="v-step-2" @keyup.enter="validate()"></v-text-field>
          <v-switch v-model="form.admin" label="are you a developer?"></v-switch>
          <v-card-actions><v-btn primary large block @click="validate()" id="v-step-3">Enter</v-btn></v-card-actions>
        </v-form>
        <v-tour name="myTour" :steps="steps"></v-tour>
      </v-card>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'Home',
  data(){
    return{
      form:{username:'',password:'',admin:''},
      text:'',
      color:"red",
      height:window.innerHeight,
      steps: [
          {
            target: '#v-step-0',
            header: {
              title: 'Get Started',
            },
            content: `Discover <strong>Vue Tour</strong>!`
          },
          {
            target: '#v-step-1',
            content: 'Enter Username'
          },
          {
            target: '#v-step-2',
            content: 'Enter Password',
            params: {
              placement: 'top'
            }
          }, {
            target: '#v-step-3',
            content: 'Click to Login',
            params: {
              placement: 'bottom'
            }
          }
        ]
    }
  },methods:{
    validate(){
      if(this.form.username && this.form.password)
      {
        this.$store.dispatch('validateUser',{status:true,user:{username:this.form.username,password:this.form.password},admin:this.form.admin})
        this.$store.state.authenticated ? this.$router.push({ name: 'Dashboard'}) : this.$root.$emit('Invalid Username / Password', true)
      } else this.$root.$emit('Username & Password Must be Filled', true)
    },
  },
  mounted(){
    this.$tours['myTour'].start()
  }
}
</script>

