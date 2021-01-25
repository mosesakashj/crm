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
        image:null
      },
      loading: false,
      updateBtn:false,
      Products:[],
      allAccessFor:['admin','manager'],
      snackbar:{title:'Give Valid Details..',state:false},
      datalistObj:{
        isHeader: true,
        isHideAdd:false,
        selection: [],
        showSelect: true,
        headers: [
        {text: 'Code',align: 'start',sortable: false,value: 'id'},
        { text: 'Name', value: 'name' },
        { text: 'Net Price', value: 'netprice' },
        { text: 'Sale Price', value: 'saleprice' },
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
          click:(item)=>{this.editProduct(item)}
        },
        {
          is_show: () => { return this.allAccessFor.includes(this.$store.state.activeUser.role) ?  true : false },
          color: () => { return 'success'},
          icon:'mdi-delete',
          click:(item)=>{ this.removeProducts(item)}
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
        title: !this.updateBtn ? 'New Product' : 'Edit product',
        properties: [ 
        {model: 'name', type:  this.formType.TEXT, rules:  [v => !!v || 'Field is required'], label: 'Product name', class: 'lg4 sm6', 'hide-details': false },
        {model: 'netprice', type: this.formType.TEXT, rules: [value => !!value || 'Value Must Be Filled',value => (!isNaN(value)) || 'Value Must Be Number' ], label: 'NetPrice', class: 'lg4 sm6', 'hide-details': false },
        {model: 'saleprice', type: this.formType.TEXT, rules: [value => !!value || 'Value Must Be Filled',value => (!isNaN(value)) || 'Value Must Be Number' ], label: 'SalePrice', class: 'lg4 sm6', 'hide-details': false },
        {model: 'description', rules: [value => !!value || 'Value Must Be Selected'], type: this.formType.TEXTAREA, class: 'lg6 sm6 pt-2', label: 'Description', 'hide-details': false },
        {model: 'profile', type: this.formType.FILES, rules: [], label: 'Image', class: 'lg6 sm6', accept:'', is_show:true, multiple:'false',change:()=>{ if(this.modelObj.profile) this.createImage(this.modelObj.profile[0]) },}
        ],
        buttons: [
          {name: 'action_handler',color: 'success',label: 'Save',click: () => this.addProduct(),loading: this.loading,is_show: !this.updateBtn}, 
          {name: 'action_handler_update', color: 'primary',label: 'Update & Close', click: () => this.updateProduct(),loading: this.loading,is_show: this.updateBtn}, 
          {name: 'back_to_list',color: 'info',click: () => this.closeform(),label: 'cancel',is_show: true}, 
          {name: 'delete_btn',color: 'error',label: 'Delete',click: ()=>this.removeProducts(this.modelObj),is_show: this.updateBtn,}
        ]
      }
    },
  },
  mounted(){
      this.getProducts(),
      this.$root.$on('deleteItems',(data)=>{
        this.removeProducts(data)
      })
     this.$root.$on('addItems',(data)=>{
        this.addProduct(data)
      })
    },
    methods:{
    getProducts(){
      let x=JSON.parse(localStorage.getItem("Productsdata"))
      x ? this.Products=x.slice() : this.Products=[]
      this.datalistObj.list=this.Products.slice()
    },
    setProducts(){
      localStorage.setItem("Productsdata", JSON.stringify(this.Products))
      this.getProducts()
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
        reader.onload = (e) =>{ this.modelObj.image= e.target.result }
        reader.readAsDataURL(file)
      }
    },
    addProduct(){
      if (this.$refs.formRef.$refs.validateForm.validate()) {
      this.modelObj.id=this.getRandomId()
      this.Products.push(this.modelObj)
      this.dialog=false
      this.setProducts()
      this.$refs.formRef.$refs.validateForm.reset()
      }else{
        this.snackbar={title:'Give Valid Details...',state:true}
      }
    },
    editProduct(data){
      this.updateBtn=true
      this.dialog=true
      this.modelObj=Object.assign({},data)
    },
    updateProduct(){
      this.dialog=false
      this.Products.forEach((x,index)=>{
        x.id===this.modelObj.id ? this.Products.splice(index,1,this.modelObj) : false
      })
      this.setProducts()
      this.$refs.formRef.$refs.validateForm.reset()
    },
    removeProducts(data){
      if(this.dialog){
        this.$refs.formRef.$refs.validateForm.reset()
        this.dialog= false
        this.modelObj ={}
      }
      let x = this.removeRecords(data, this.Products)
      this.Products = x.slice()
      this.setProducts()
      this.datalistObj.selection=[]
    }
  },
  beforeDestroy () {
    this.$root.$off('deleteItems')
    this.$root.$off('addItems')
 },
}
</script>
