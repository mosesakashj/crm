<template>
  <div>
      <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <form-data :references.sync="formReferences" :model="modelObj" ref="formRef"></form-data>
            </v-row>
          </v-container>
        </v-card-text>
       </v-card>
    </v-dialog>
    <data-list :payload="datalistObj"></data-list>
    <v-snackbar v-model="snackbar.state">{{ snackbar.title }}</v-snackbar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import FormTemplate from '@/components/FormTemplate'
import DataList from '@/components/DataList.vue'
export default {
  data () {
    return {
      dialog:false,
      modelObj: {
        id:this.getRandomId(),
        image:null
      },
      loading: false,
      updateBtn:false,
      Employees:[],
      allAccessFor:['admin','manager'],
      snackbar:{title:'Give Valid Details..',state:false},
      datalistObj:{
        isHeader: true,
        isHideAdd:false,
        selection: [],
        showSelect: true,
        headers: [
        { text: 'Code',align: 'start',sortable: false,value: 'id', width: '10%'},
        { text: 'Name', value: 'name', width: '10%' },
        { text: 'Email', value: 'email', width: '15%' },
        { text: 'Role', value: 'role', width: '20%' },
        { text: 'Image', value: 'image', width: '20%' },
        { text: 'Actions', value: 'actions', sortable: false, width: '20%' }],
        list: [],
        loading: false,
        addNewRoute: () => this.openform(),
        actionsList:[
          {
          is_show: () => { return this.allAccessFor.includes(this.$store.state.activeUser.role) ?  true : false},
          color: () => { return 'success'},
          icon:'mdi-pencil',
          click:(item)=>{this.editEmployee(item)}
        },
        {
          is_show: () => {
           return this.allAccessFor.includes(this.$store.state.activeUser.role) ?  true : false
          },
          color: () => {return 'success'},
          icon:'mdi-delete',
          click:(item)=>{ this.removeEmployee(item)}
        }],
        // editProp: 'email',
        // editURL: (item) => { console.log(item) }
      }
    }
  },
  components: {
    'form-data': FormTemplate,
    'data-list':DataList
  },
  computed: {
    ...mapGetters(['formType']),
    formReferences () {
      return {
        title: !this.updateBtn ? 'New User' : 'Edit User',
        properties: [ 
        {
          model: 'name',
          type:  this.formType.TEXT,
          rules:  [v => !!v || 'Field is required'],
          label: 'Name',
          class: 'lg3 sm6',
          'hide-details': false
        }, {
          model: 'email',
          type: this.formType.TEXT,
          rules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
          ],
          label: 'Email',
          class: 'lg3 sm6',
          'hide-details': false
        }, {
          model: 'phone',
          type: this.formType.TEXT,
          rules: [value => !!value || 'Value Must Be Filled',value => (!isNaN(value)) || 'Value Must Be Number' ],
          label: 'Phone No',
          class: 'lg3 sm6',
          'hide-details': false
        },
        {
          model: 'password',
          type: this.formType.TEXT,
          rules: [value => !!value || 'Value Must Be Filled'],
          label: 'Password',
          class: 'lg3 sm6',
          'hide-details': false
        },{
          model: 'role',
          rules: [value => !!value || 'Value Must Be Selected'],
          type: this.formType.SELECT,
          items:['admin','manager','employee'],
          class: 'lg3 sm6 pt-2',
          label: 'Role',
          'hide-details': false

        },{
          model: 'profile',
          type: this.formType.FILES,
          rules: [],
          label: 'Profile Picture',
          class: 'lg6 sm6',
          accept:'',
          is_show:true,
          multiple:'false',
          change:()=>{if(this.modelObj.profile) this.createImage(this.modelObj.profile[0]) },
        }],
        buttons: [{
          name: 'action_handler',
          color: 'success',
          label: 'Save',
          click: () => this.addEmployee(),
          loading: this.loading,
          is_show: !this.updateBtn
        }, {
          name: 'action_handler_update',
          color: 'primary',
          label: 'Update & Close',
          click: () => this.updateEmployee(),
          loading: this.loading,
          is_show: this.updateBtn
        }, {
          name: 'back_to_list',
          color: 'info',
          click: () => this.closeform(),
          label: 'cancel',
          // to: '/company',
          is_show: true
        }, {
          name: 'delete_btn',
          color: 'error',
          label: 'Delete',
          click: ()=>this.removeEmployee(this.modelObj),
          is_show: this.updateBtn,

        }]
      }
    },
    // headers () {
    //   return [ {text: 'Code',align: 'start',sortable: false,value: 'id'},
    //     { text: 'Name', value: 'name' },
    //     { text: 'Email', value: 'email' },
    //     { text: 'Role', value: 'role' },
    //     { text: 'Image', value: 'image',width:'200px' },
    //     { text: 'Actions', value: 'actions', sortable: false,width:'200px' },]
    // }
  },mounted(){
      this.getEmployees(),
      this.$root.$on('deleteItems',(data)=>{
        this.removeEmployees(data)
      })
     this.$root.$on('addItems',(data)=>{
        this.addEmployee(data)
      })
    },
    methods:{
    getEmployees(){
      let x=JSON.parse(localStorage.getItem("employeesdata"))
      x ? this.Employees=x.slice() : this.Employees=[]
      this.datalistObj.list=this.Employees.slice()
    },
    setEmployees(){
      localStorage.setItem("employeesdata", JSON.stringify(this.Employees))
      this.getEmployees()
    },
    openform(){
      this.updateBtn=false
      this.dialog=true
    },
    closeform(){
      this.dialog=false
      this.$refs.formRef.$refs.validateForm.reset.length ? this.$refs.formRef.$refs.validateForm.reset() : false
    },
    createImage(file) {
      if(file){
        var reader = new FileReader();
        reader.onload = (e) =>{ this.modelObj.image= e.target.result}
        reader.readAsDataURL(file)
      }
    },
    addEmployee(){
      if (this.$refs.formRef.$refs.validateForm.validate()) {
      this.modelObj.id=this.getRandomId()
      this.Employees.push(this.modelObj)
      this.dialog=false
      this.setEmployees()
      this.$refs.formRef.$refs.validateForm.reset()
      }else{
        this.snackbar={title:'Give Valid Details...',state:true}
      }
    },
    editEmployee(data){
      this.updateBtn=true
      this.dialog=true
      this.modelObj=Object.assign({},data)
    },updateEmployee(){
      this.dialog=false
      this.Employees.forEach((x,index)=>{
          x.id===this.modelObj.id ? this.Employees.splice(index,1,this.modelObj) : false
      })
      this.setEmployees()
      this.$refs.formRef.$refs.validateForm.reset()
    },
    removeEmployee(data){
      if(this.dialog){
        this.dialog=false
        this.modelObj={}
        this.$refs.formRef.$refs.validateForm.reset()
      }
      this.Employees.forEach((x,index)=>{
        x.id===data.id ? this.Employees.splice(index,1) : false
      })
      this.setEmployees()
    },
    removeEmployees(data){
      for(let i in data.ids){
        this.Employees.forEach((x,index)=>{
          x.id===data.ids[i] ? this.Employees.splice(index,1) : false
        })
      }
      this.setEmployees()
      this.datalistObj.selection=[]
    }
  },
  watch:{
     
    },
  beforeDestroy () {
    this.$root.$off('deleteItems')
    this.$root.$off('addItems')
 },
}
</script>
