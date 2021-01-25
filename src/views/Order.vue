<template>
  <div>
    <v-dialog v-model="modal.dialog" fullscreen  transition="dialog-bottom-transition">
      <v-card tile>
        <v-toolbar dark >
          <v-btn icon dark @click="closeform('ORDER')"><v-icon>mdi-close</v-icon></v-btn>
          <v-toolbar-title>{{formReferences.title}}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
            <form-data :references.sync="formReferences" :model="formTemplateObj" ref="formRef"></form-data>
          <v-divider></v-divider>
          <v-row class="pa-5">
            <v-dialog v-model="modal.dialog3" persistent max-width="600px">
              <v-card>
                      <form-data :references.sync="productReferences" :model="productObj" ref="productFormRef"></form-data>
              </v-card>
            </v-dialog>
          </v-row>
          <v-card>
            <data-list :payload="orderProductObj"></data-list>
          </v-card>
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
      formTemplateObj: { products:[] },
      productObj: { },
      loading: false,
      updateBtn:false,
      productUpdateBtn:false,
      modal:{dialog:false,dialog2:false,dialog3:false},
      allData:{Products:[], Users:[], Employees:[], Orders:[],OrderProducts:[],userOrderProducts:[]},
      allAccessFor:['admin','manager'],
      snackbar:{title:'Give Valid Details..',state:false},
      orderProductObj:{
        isHeader: true,
        list: [],
        selection: [],
        addNewRoute: () =>this.openform('ORDER_PRODUCT'),
        headers: [
          { text: 'Product', value: 'name' },
          { text: 'Unit Price', value: 'saleprice'},
          { text: 'Quantity', value: 'quantity' },
          { text: 'Total Amount',value:'total'},
          { text: 'Actions',value:'actions'}],
          actionsList:[
          {
          is_show: () => { return true },
          color: () => { return 'success'},
          icon:'mdi-pencil',
          click:(item)=>{this.editProducts(item)}
        },
        {
          is_show: () => { return this.allAccessFor.includes(this.$store.state.activeUser.role) ?  true : false},
          color: () => {return 'success'},
          icon:'mdi-delete',
          click:(item)=>{ this.deleteProduct(item)}
        }],
      },
      datalistObj:{
        isHeader: true,
        isHideAdd:false,
        selection: [],
        showSelect: true,
        headers: [
          {text: 'id',value: 'id',},
          { text: 'Customer', value: 'customer' },
          { text: 'Managing By', value: 'employee'},
          { text: 'Date', value: 'date' },
          { text: 'Status', value: 'status'},
          { text: 'Actions',value:'actions'}],
        list: [],
        loading: false,
        addNewRoute: () => this.openform('ORDER'),
        actionsList:[
          {
            is_show: () => { return true},
            color: () => { return 'success'},
            icon:'mdi-pencil',
            click:(item)=>{this.editOrder(item)}
        },
        {
          is_show: () => { return this.allAccessFor.includes(this.$store.state.activeUser.role) ?  true : false },
          color: () => { return 'success'},
          icon:'mdi-delete',
          click:(item)=>{ this.removeOrders(item)}
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
        title: !this.updateBtn ? 'New Order' : 'Edit Order',
        properties: [
        {model: 'customer',type: this.formType.SELECT, select_text:'name', items:this.allData.Users.slice(), class: 'lg3 sm6 pt-2', label: 'Select Customer','hide-details': false,rules: [value => !!value || 'Value Must Be Selected'],},
        {model: 'employee', rules: [value => !!value || 'Value Must Be Selected'], type: this.formType.SELECT, select_text:'name', items:this.allData.Employees.slice(),class: 'lg3 sm6 pt-2', label: 'Managing By','hide-details': false},
        {model: 'date',type: this.formType.DATEPICKER, picker:'date', label: 'Order Date', class: 'lg3 sm6', is_show:true, menu:true,disabled:false, change:()=>{},rules: [value => !!value || 'Value Must Be Filled'],},
        {model: 'status', rules: [value => !!value || 'Value Must Be Selected'], type: this.formType.SELECT, items:['Initiated','On Going','Completed'], class: 'lg3 sm6 pt-2',label: 'Order status','hide-details': false}
        ],
        buttons: [
         {name: 'action_handler', color: 'success',label: 'Save',click: () => this.addOrders(),loading: this.loading,is_show: !this.updateBtn},
         {name: 'action_handler_update',color: 'primary',label: 'Update & Close',click: () => this.updateOrders(),loading: this.loading,is_show: this.updateBtn}, 
         {name: 'back_to_list',color: 'info',click: () => this.closeform('ORDER'),label: 'cancel',is_show: true,},
        //  {name: 'delete_btn',color: 'error',label: 'Delete',click: ()=>this.deleteOrder(),is_show: this.updateBtn,}
        ]
      }
    },
    productReferences(){
      return {
        title: !this.productUpdateBtn ? 'New Product' : 'Edit Product',
        properties: [ 
        {model: 'product',type: this.formType.SELECT, select_text:'name', select_value: 'id', items:this.allData.Products.slice(), class: 'lg3 sm6 pt-2', label: 'Select Product','hide-details': false,rules: [value => !!value || 'Value Must Be Selected'],},
        {model: 'quantity', rules: [value => !!value || 'Value Must Be Selected'], type: this.formType.TEXT, class: 'lg3 sm6 pt-2',label: 'Quantity','hide-details': false}
        ],
        buttons: [
         {name: 'action_handler', color: 'success',label: 'Save',click: () => this.addProducts(),is_show: !this.productUpdateBtn},
         {name: 'action_handler_update',color: 'primary',label: 'Update & Close',click: () => this.updateProducts(),is_show: this.productUpdateBtn}, 
         {name: 'back_to_list',color: 'info',click: () => this.closeform('ORDER_PRODUCT'),label: 'cancel',is_show: true,},
        //  {name: 'delete_btn',color: 'error',label: 'Delete',click: ()=>this.deleteProduct(),is_show: this.productUpdateBtn,}
        ]
      }
    }
  },
  mounted(){
      this.getAllRecords()
      this.getOrderdata()
      this.$root.$on('deleteItems',(data)=>{
        this.removeOrders(data)
        this.setOrders()
      })
    },
    methods:{
    getAllRecords(){
      let x=JSON.parse(localStorage.getItem("customersdata"))
      x ? this.allData.Users=x.slice() : this.allData.Users=[]
      let y=JSON.parse(localStorage.getItem("employeesdata"))
      y ? this.allData.Employees=y.slice() : this.allData.Employees=[]
      let z=JSON.parse(localStorage.getItem("Productsdata"))
      z ? this.allData.Products=z.slice() : this.allData.Products=[]
    },getOrderdata(){
      let x=JSON.parse(localStorage.getItem("orderdata"))
      x ? this.allData.Orders=x.slice() : this.allData.Orders=[]
      this.datalistObj.list=this.allData.Orders.slice()
      let w=JSON.parse(localStorage.getItem("OrderProductsdata"))
      w ? this.allData.OrderProducts=w.slice() : this.allData.OrderProducts=[]
    },
    setOrders(){
      localStorage.setItem("orderdata", JSON.stringify(this.allData.Orders))
      localStorage.setItem("OrderProductsdata", JSON.stringify(this.allData.OrderProducts))
      this.getOrderdata()
    },
    openform(type){
      if(type === 'ORDER') {
        this.updateBtn = false
        this.modal.dialog=true
        this.formTemplateObj={}
        this.formTemplateObj.id=this.getRandomId()
      } else {
         this.modal.dialog3=true
         this.productUpdateBtn=false
      }
    },
    closeform(type){
      if(type === 'ORDER'){
      this.modal.dialog=false
      this.modal.dialog3=false
      this.orderProductObj.list=[]
      this.$refs.formRef.$refs.validateForm.reset()
      } else {
        this.modal.dialog3=false
        this.$refs.productFormRef.$refs.validateForm.reset()
      }
    },
    addOrders(){
      if (this.$refs.formRef.$refs.validateForm.validate()) {
        if(this.orderProductObj.list.length){
          this.modal.dialog=false
          this.allData.Orders.push(this.formTemplateObj)
          this.orderProductObj.list.forEach(x=>{ this.allData.OrderProducts.push(x)})
          this.orderProductObj.list=[]
          this.setOrders()
          this.$refs.formRef.$refs.validateForm.reset()
        }else this.snackbar={title:'Add Atleast One Product...',state:true}
      }else this.snackbar={title:'Give Valid Details...',state:true}
    },
    addProducts(){
      this.modal.dialog3=false
      let result=this.allData.Products.find(product=>{
        if(product.id===this.productObj.product){
          return product
        }
      })
      let product = Object.assign({},result,{id:this.getRandomId(),orderid: this.formTemplateObj.id,quantity:this.productObj.quantity,product:this.productObj.product})
      product.total = product.saleprice * product.quantity
      this.orderProductObj.list.push(product)
      this.$refs.productFormRef.$refs.validateForm.reset()
    },
    editOrder(data){
      this.updateBtn=true
      this.modal.dialog=true
      this.formTemplateObj=Object.assign({},data)
      this.orderProductObj.list=[]
      this.allData.OrderProducts.forEach(orderProduct=>{
        orderProduct.total = orderProduct.saleprice * orderProduct.quantity
        if( orderProduct.orderid === this.formTemplateObj.id ){
          this.orderProductObj.list.includes(orderProduct) ? false : this.orderProductObj.list.push(orderProduct)
        }
      })
    },
    editProducts(data){
      this.modal.dialog3=true
      this.productUpdateBtn=true
      this.productObj=Object.assign({},data)
    },
    updateOrders(){
      if (this.$refs.formRef.$refs.validateForm.validate()) {
        if(this.orderProductObj.list.length){
        this.allData.Orders.forEach((x,index)=>{
          x.id === this.formTemplateObj.id ? this.allData.Orders.splice(index,1,this.formTemplateObj) : false
        })
        this.orderProductObj.list.forEach((x, xindex)=>{ 
          if(this.allData.OrderProducts.length){
            this.allData.OrderProducts.forEach((y,index)=>{
              x.id === y.id ? (this.allData.OrderProducts.splice(index,1,x), this.orderProductObj.list.splice(xindex,1)) : false
          })
          }else this.allData.OrderProducts.push(x)
        })
        this.orderProductObj.list.forEach((x)=>{
          if(!this.allData.OrderProducts.includes(x)) this.allData.OrderProducts.push(x)
        })
        this.orderProductObj.list = []
        this.modal.dialog=false
        this.setOrders()
        this.$refs.formRef.$refs.validateForm.reset()
        }else this.snackbar={title:'Add Atleast One Product...',state:true}
      }else this.snackbar={title:'Give Valid Details...',state:true}
    },
    updateProducts(){
      if (this.$refs.productFormRef.$refs.validateForm.validate()) {
        this.modal.dialog3=false
        let result=this.allData.Products.find((product)=>{
          if(product.id===this.productObj.product){
            return product
          }
        })
        let product =Object.assign({},result,{orderid: this.formTemplateObj.id,quantity:this.productObj.quantity,id:this.productObj.id,product:this.productObj.product})
        product.total = product.saleprice * product.quantity
        this.orderProductObj.list.find((tempOrderProduct,index)=>{
          if(tempOrderProduct.id===product.id){
          this.orderProductObj.list.splice(index,1,product)
          }
        })
        this.$refs.productFormRef.$refs.validateForm.reset()
      }
    },
    deleteProduct(item){
      this.orderProductObj.list.forEach((tempOrderProduct,tempOrderProductIndex)=>{ 
          this.allData.OrderProducts.forEach((orderProduct,orderProductIndex)=>{
            tempOrderProduct.orderid === item.orderid && tempOrderProduct.id === item.id ? (this.allData.OrderProducts.splice(orderProductIndex,1),this.orderProductObj.list.splice(tempOrderProductIndex,1)) : false
        })
      })
      this.setOrders()
    },
    removeOrders(data){
      let x = this.removeRecords(data, this.allData.Orders)
      this.allData.Orders = x.slice()
      let y = this.removeRecords(data, this.allData.OrderProducts)
      this.allData.OrderProducts = y.slice()
      if(this.datalistObj.selection.length) this.datalistObj.selection=[]
      this.setOrders()
    }
  },
  beforeDestroy () {
    this.$root.$off('deleteItems')
    this.$root.$off('addItems')
 },
}
</script>
