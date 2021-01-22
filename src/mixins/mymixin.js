export default{
  data(){
    return{
    }
  },
  methods:{
    getRandomId(){
      return Math.floor((Math.random() * 10000) + 1)
    },
    isEmptyObject (obj) {
      return Object.entries(obj).length === 0 && obj.constructor === Object
    },
    findValidationRules(type) {
      var result
      switch(type){
        case 'Number': 
          result = [value => !!value || 'Value Must Be Filled',value => (!isNaN(value)) || 'Value Must Be Number' ]
          break
        case 'File' :
          result = value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!'
          break
        case 'Email':
          result= [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
          ]
       break
        case 'Text' :
          result= [
            v => !!v || 'Field is required',
          ]
       break
        default :
         result=  v => !!v || 'Field is required'
       break
      }
      return result
    },
    removeRecords(data, array){
      if(!data.ids) { 
        data.ids=[]
        data.ids.push(data.id)
      }
      for(let i in data.ids){
        array.forEach((x,index)=>{
          x.id===data.ids[i] ? array.splice(index,1) : false
        })
      }
      return array
    }
  }
}

