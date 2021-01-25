import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: false,
    status:['Logged In', 'Signed Out'],
    admin:{
      username: 'Akash',
      password: '0000',
      name:'AKASH J',
      image:'https://static.toiimg.com/photo/msid-71756742/71756742.jpg?134917',
      email:'akash@ceo.com',
      phoneno:'9750840534',
      code:'0001',
      role:'admin'
    },
    activeUser:{
      role:null
    },
    users:[],
    common:{
      CRM_INDEX:{ search: 'klsdfk' }
    },
    FORM_TYPE: {
      TEXT: 'text',
      TEXTAREA: 'textarea',
      CHECKBOX: 'checkbox',
      SELECT: 'select',
      AUTO_COMPLETE: 'auto_complete',
      COMBOBOX: 'combobox',
      DATE: 'date',
      PASSWORD: 'password',
      NUMBER: 'number',
      DATEPICKER: 'datepicker',
      QUICKADD: 'quickadd',
      TIMEPICKER: 'timepicker',
      FILES: 'files',
      ALERT: 'alert',
      COLORPICKER: 'color',
      BUTTON: 'btn',
      BTNDROPDOWN: 'btnDropdown',
      RADIO: 'radio'
    },
  },
  mutations: {
    authUser(state,value){
      state.authenticated=true
      state.activeUser=Object.assign(value)
      localStorage.setItem('activeUser',JSON.stringify(value))
    },
    RemoveAuth(state,value){
      state.authenticated=value.status
      state.activeUser=value.username
      localStorage.setItem('activeUser',null)
    },
    getActiveUser(state){
      if(localStorage.getItem('activeUser')){
        state.activeUser = JSON.parse(localStorage.getItem('activeUser'))
        delete state.activeUser.password
        state.authenticated=true
      }
    }
  },
  actions: {
    validateUser({commit},value){
      if(value.admin){
        this.state.admin.username === value.user.username && this.state.admin.password === value.user.password ? commit('authUser',this.state.admin) : false
      }else{
        let y=JSON.parse(localStorage.getItem("employeesdata"))
        y ? this.users=y.slice() : this.users=[]
        this.users.forEach((x,index)=>{
          x.email === value.user.username && x.password === value.user.password ? commit('authUser',this.users[index]) : false
        })
      }
    }
  },
  getters: {
    formType (state) {
      return state.FORM_TYPE
    },
  }
})
