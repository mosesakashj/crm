<template>
  <div>
      <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <form-data :references.sync="formReferences" :model="formObj" ref="formRef"></form-data>
            </v-row>
          </v-container>
        </v-card-text>
       </v-card>
    </v-dialog>
    <data-list :payload="datalistObj"></data-list>
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
      formObj: {
        code:this.getRandomId(),
        image:null
      },
      loading: false,
      updateBtn:false,
      Customers:[],
      allAccessFor:['admin','manager'],
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
          click:(item)=>{this.editCustomer(item)}
        },
        {
          is_show: () => {
           return this.allAccessFor.includes(this.$store.state.activeUser.role) ?  true : false
          },
          color: () => {return 'success'},
          icon:'mdi-delete',
          click:(item)=>{ this.removeCustomers(item)}
        }],
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
          {model: 'name', type:  this.formType.TEXT, rules:  [v => !!v || 'Field is required'], label: 'Customer name', class: 'lg4 sm6', 'hide-details': false }, 
          { model: 'email', type: this.formType.TEXT, rules: this.findValidationRules('Email'), label: 'Email', class: 'lg3 sm6', 'hide-details': false }, 
          { model: 'phone', type: this.formType.TEXT, rules: this.findValidationRules('Number'), label: 'Phone No', class: 'lg3 sm6', 'hide-details': false },
          { model: 'address', rules: [value => !!value || 'Value Must Be Selected'], type: this.formType.TEXTAREA, class: 'lg6 sm6 pt-2', label: 'Address', 'hide-details': false },
          { model: 'profile', type: this.formType.FILES, rules: [], label: 'Image', class: 'lg6 sm6', accept:'', is_show:true, multiple:'false', change:()=>{if(this.formObj.profile) this.createImage(this.formObj.profile[0]) },}
        ],
        buttons: [
          { name: 'action_handler', color: 'success', label: 'Save', click: () => this.addCustomer(), loading: this.loading, is_show: !this.updateBtn }, 
          { name: 'action_handler_update', color: 'primary', label: 'Update & Close', click: () => this.updateCustomer(),loading: this.loading, is_show: this.updateBtn },
          { name: 'back_to_list', color: 'info', click: () => this.closeform(), label: 'cancel', is_show: true }, 
          { name: 'delete_btn', color: 'error', label: 'Delete', click: ()=>this.removeCustomers(this.formObj),is_show: this.updateBtn }
        ]
      }
    },
  },
  mounted(){
      this.getCustomers(),
      this.$root.$on('deleteItems',(data)=>{
        this.removeCustomers(data)
      })
     this.$root.$on('addItems',(data)=>{
        this.addCustomer(data)
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
      this.$refs.formRef.$refs.validateForm.resetValidation()
    },
    createImage(file) {
      if(file){
        var reader = new FileReader();
        reader.onload = (e) =>{ this.formObj.image = e.target.result }
        reader.readAsDataURL(file)
      }
    },
    addCustomer(){
      if (this.$refs.formRef.$refs.validateForm.validate()) {
        this.formObj.id=this.getRandomId()
        this.Customers.push(this.formObj)
        this.dialog=false
        this.setCustomers()
        this.$refs.formRef.$refs.validateForm.reset()
      } else this.$root.$emit('AlertUser','Give Valid Details...', true) 
    },
    editCustomer(data){
      this.updateBtn= this.dialog= true
      this.formObj=Object.assign({},data)
    },
    updateCustomer(){
      if (this.$refs.formRef.$refs.validateForm.validate()) {
        this.dialog=false
        this.Customers.forEach((x,index)=>{
            x.id===this.formObj.id ? this.Customers.splice(index,1,this.formObj) : false
        })
        this.setCustomers()
        this.$refs.formRef.$refs.validateForm.reset()
      } else this.$root.$emit('AlertUser','Give Valid Details...', true) 
    },
    removeCustomers(data){
      if(this.dialog){
        this.$refs.formRef.$refs.validateForm.reset()
        this.dialog= false
        this.formObj ={}
      }
      let x = this.removeRecords(data, this.Customers)
      this.Customers = x.slice()
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
