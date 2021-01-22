<template>
  <div :style="`height:${height}px`">
    <section>
      <v-row >
        <v-col cols="12">
          <v-card>
          <v-row>
              <v-col cols="4">
              <v-img height="250" :src="$store.state.activeUser.image"></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title> {{$store.state.activeUser.name}}</v-card-title>
              <v-card-subtitle class="pt-3">Email    :{{$store.state.activeUser.email}} </v-card-subtitle>
              <v-card-subtitle>Phone No :{{$store.state.activeUser.phoneno}} </v-card-subtitle>
              <v-card-subtitle>Code : {{$store.state.activeUser.Code}} </v-card-subtitle>
              <v-card-subtitle>Role : {{$store.state.activeUser.role}}</v-card-subtitle>
            </v-col>
          </v-row>
        </v-card>
        </v-col>
        <!-- <v-col cols="3" v-if="!allAccessFor.includes($store.state.activeUser.role)">
        <v-card v-for="(i,index) in EmployeeOrder" :key="index">
          <v-img height="100" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>
            <v-card-title class="pa-2"> Order Code : {{i.code}} </v-card-title>
            <v-card-title class="pa-2"> Customer Name :{{ i.customer.name }} </v-card-title>
             <v-card-title class="pa-2"> Order status :{{ i.status }} </v-card-title>
            <v-card-actions>
              <v-btn color="orange lighten-2" text > More detail About Customer</v-btn>
              <v-spacer></v-spacer>
              <v-btn icon @click="show = !show"><v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon></v-btn>
            </v-card-actions>
            <v-expand-transition>
              <div v-show="show">
                <v-divider></v-divider>
                <v-card-title>Name :{{ i.customer.name }} </v-card-title>
                <v-card-text> Phone No  :{{ i.customer.phoneno }}</v-card-text>
                <v-card-text> Address  :{{ i.customer.address }}</v-card-text>
              </div>
            </v-expand-transition>
        </v-card>
        <v-card v-if="!EmployeeOrder.length">
          <v-card-title> No Orders Assigned for You...</v-card-title>
        </v-card>
      </v-col> -->
      </v-row>
    </section>
    <section v-if="allAccessFor.includes($store.state.activeUser.role)">
      <v-row>
        <v-col cols="12" lg="3" md="3" sm="3" >
          <v-card color="red" to="/customer">
            <v-icon class="px-15" large>mdi-account-group-outline</v-icon>
            <v-card-title>No of Customers : {{Users.length}}</v-card-title></v-card></v-col>
        <v-col cols="12" lg="3" md="3" sm="3"><v-card color="blue-grey" to="/employee"> 
          <v-icon class="px-15" large>mdi-account-group-outline</v-icon>
          <v-card-title>No of Users : {{Employees.length}}</v-card-title></v-card></v-col>
        <v-col cols="12" lg="3" md="3" sm="3"><v-card color="teal" to="/product">
          <v-icon class="px-15" large>mdi-basket</v-icon> 
          <v-card-title>No of Products : {{Products.length}}</v-card-title></v-card></v-col>
        <v-col cols="12" lg="3" md="3" sm="3"><v-card color="blue"  to="/order">
          <v-icon class="px-15" large>mdi-cash-usd</v-icon>
          <v-card-title >No of Orders : {{Orders.length}}</v-card-title></v-card></v-col>
      </v-row>
      <v-row class="pt-5">
        <v-col cols="6"><line-chart :data="chartData"></line-chart></v-col>
        <v-col cols="6"><bar-chart :data="ProductsStatus" v-if="isUpdated"></bar-chart></v-col>
      </v-row>
    </section>
  </div>
</template>
<script>
export default {
  data(){
    return{
      Users:[],
      Employees:[],
      Products:[],
      Orders:[],
      chartData:{'2020-12-12':45, '2020-12-13':5,'2020-12-14':78,},
      ProductsStatus:{'Total Order':0,'Initialized':0,'On Going':0, 'Completed':0},
      isUpdated:false,
      status:['Initialized','On Going', 'Completed'],
      allAccessFor:['admin','manager'],
      EmployeeOrder:[],
      show:false,
      height:window.innerHeight,
    }
  },
  methods:{
    getAllRecords(){
    let x=JSON.parse(localStorage.getItem("customersdata"))
    x ? this.Users=x.slice() : this.Users=[]
    let y=JSON.parse(localStorage.getItem("employeesdata"))
    y ? this.Employees=y.slice() : this.Employees=[]
    let z=JSON.parse(localStorage.getItem("Productsdata"))
    z ? this.Products=z.slice() : this.Products=[]
    let w=JSON.parse(localStorage.getItem("orderdata"))
    w ? this.Orders=w.slice() : this.Orders=[]
    },
    findOrderStatusCount(){
      this.isUpdated=false
      this.ProductsStatus['Total Order'] = this.Orders.length
      this.Orders.forEach(x=>{
        for(let i in this.status){
          this.status[i]==x.status ? this.ProductsStatus[x.status]+=1 : false
        }
      })
      this.isUpdated=true
    },
    getEmployeeDetails(){
      let w=JSON.parse(localStorage.getItem("orderdata"))
      w ? this.Orders=w.slice() : this.Orders=[]
      this.Orders.forEach((x)=>{
        x.employee.name === this.$store.state.activeUser.name ? this.EmployeeOrder.push(x) : false
      })
    }
  },
  mounted(){
    this.allAccessFor.includes(this.$store.state.activeUser.role) ? this.getAllRecords() : this.getEmployeeDetails()
  },
  watch:{
    Orders(){
      this.findOrderStatusCount()
    }
  }
}
</script>
<style>

</style>