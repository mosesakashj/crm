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
        code:this.getRandomId(),
        image:null
      },
      loading: false,
      updateBtn:false,
      Customers:[],
      allAccessFor:['admin','manager'],
      snackbar:{title:'Give Valid Details..',state:false},
      datalistObj:{
        isHeader: true,
        isHideAdd:false,
        selection: [],
        showSelect: true,
        headers: [
        {text: 'Code',align: 'start',sortable: false,value: 'code'},
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'address', value: 'address' },
        { text: 'Image', value: 'image' },
        { text: 'Actions', value: 'actions', sortable: false },],
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
        title: !this.updateBtn ? 'New Customer' : 'Edit Customer',
        properties: [ 
        {
          model: 'name',
          type:  this.formType.TEXT,
          rules:  [v => !!v || 'Field is required'],
          label: 'Customer name',
          class: 'lg4 sm6',
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
        },{
          model: 'address',
          rules: [value => !!value || 'Value Must Be Selected'],
          type: this.formType.TEXTAREA,
          class: 'lg6 sm6 pt-2',
          label: 'Address',
          'hide-details': false
        },{
          model: 'profile',
          type: this.formType.FILES,
          rules: [],
          label: 'Image',
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
          click: ()=>this.deleteEmployee(),
          is_show: this.updateBtn,

        }]
      }
    },
  },mounted(){
      this.getCustomers(),
      this.$root.$on('deleteItems',(data)=>{
        this.removeCustomers(data)
      })
     this.$root.$on('addItems',(data)=>{
        this.addEmployee(data)
      })
    },
    methods:{
    getCustomers(){
      let x=JSON.parse(localStorage.getItem("customersdata"))
      x ? this.Customers=x.slice() : this.Customers=[]
      this.datalistObj.list=this.Customers.slice()
    },
    setCustomers(){
      localStorage.setItem("customersdata", JSON.stringify(this.Customers))
      this.getCustomers()
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
      this.Customers.push(this.modelObj)
      this.dialog=false
      this.setCustomers()
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
      this.Customers.forEach((x,index)=>{
          x.id===this.modelObj.id ? this.Customers.splice(index,1,this.modelObj) : false
      })
      this.setCustomers()
      this.$refs.formRef.$refs.validateForm.reset()
    },
    removeEmployee(data){
      this.Customers.forEach((x,index)=>{
        x.id===data.id ? this.Customers.splice(index,1) : false
      })
      this.setCustomers()
    },
    removeCustomers(data){
      for(let i in data.ids){
        this.Customers.forEach((x,index)=>{
          x.id===data.ids[i] ? this.Customers.splice(index,1) : false
        })
      }
      this.setCustomers()
      this.datalistObj.selection=[]
    }
  },
  beforeDestroy () {
    this.$root.$off('deleteItems')
    this.$root.$off('addItems')
 },
}
</script>
