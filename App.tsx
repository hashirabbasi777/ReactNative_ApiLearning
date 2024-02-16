import { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Button, Modal, unstable_batchedUpdates, TextInput } from "react-native";



const App = () => {

  const [data,setData] = useState([]);
  const [showModal,setShowModal] = useState(false);
  const [selectedUser,setSelectedUser] = useState(undefined);


  const getData = async () => {
    const url = "http://192.168.0.115:3000/user";
    let result = await fetch(url);
    result = await result.json();
    if(result){
      setData(result);
    }
  }


  const deleteData = async (id) => {
    const url ="http://192.168.0.115:3000/user";
    let result = await fetch(`${url}/${id}`,{
      method:"DELETE"
    })
    result = await result.json();

    if(result){
      console.warn("User Deleted")
      getData()
    }
  }


  const updateUserBox = (data) => {
    setShowModal(true)
    setSelectedUser(data);
  }


  useEffect(()=>{
    getData();
  }, [])


 return (
  <ScrollView style={{backgroundColor:'white'}}>
    <View style={styles.sectionContainer}>

    <View style={{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'red',
      padding:15,

    }}>
    <View style={{flex:0.7,borderColor:"Black",borderRadius:5, }}><Text style={{color:'white',fontSize:23,fontWeight:'bold'}}>Complete Crud API </Text></View>
    </View>

    <View style={styles.datawrapper}>
          <View style={{flex:0.7,borderColor:"Black",borderRadius:5 }}><Text style={{color:'indigo'}}>Name</Text></View>
          <View style={{flex:0.7}}><Text style={{color:'indigo'}}>Age</Text></View>
          <View style={{flex:0.6}}><Text style={{color:'indigo'}}>Class</Text></View>
          <View style={{flex:1}}><Text style={{color:'indigo'}}>School</Text></View>
          <View style={{flex:1}}><Text style={{color:'indigo'}}>Operations</Text></View>
    </View>

      {
        data.length ? 
        data.map((item)=>
        <View style={styles.datawrapper}>
          <View style={{flex:0.8,paddingRight:4}}><Text style={{color:'black'}}>{item.name}</Text></View>
          <View style={{flex:0.8}}><Text style={{color:'black'}}>{item.age}</Text></View>
          <View style={{flex:0.8}}><Text style={{color:'black'}}>{item.Class}</Text></View>
          <View style={{flex:0.8}}><Text style={{color:'black'}}>{item.School}</Text></View>
          <View style={{flex:1,flexDirection:'column',alignItems:'center',}}>
          <View style={{flex:1,marginBottom:3}}><Button title="Delete" onPress={()=>deleteData(item.id)} /></View>
          <View style={{flex:2}}><Button title="Update" onPress={()=>updateUserBox(item)} /></View>
          </View>
        </View>)
        :null
      }
    
    </View>

    <Modal visible={showModal} transparent={true}>
      <UserModal setShowModal = {setShowModal} selectedUser = {selectedUser}  getData = {getData} />
    </Modal>
    </ScrollView>

  )


};


    const UserModal = (props) => {
      console.warn(props.selectedUser);
      const [name,setName] = useState(undefined);
      const [age,setAge] = useState(undefined);
      const [Class,setClass] = useState(undefined);
      const [School,setScool] = useState(undefined);


      useEffect(()=>{

        if(props.selectedUser){
          setName(props.selectedUser.name)
          setAge(props.selectedUser.age.toString())
          setClass(props.selectedUser.Class)
          setScool(props.selectedUser.School)
        }

      }, [props.selectedUser])


      const updateUser = async () => {
        // console.warn(name,age,Class,School);
        const url = "http://192.168.0.115:3000/user";
        const id = props.selectedUser.id;

        let result = await fetch(`${url}/${id}`,{
          method:"PUT",
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name,age,Class,School})
        })
        result = await result.json();
        if(result){
          console.warn(result);
          props.getData();
          props.setShowModal(false)
        }
      }

      return(
      <View style={styles.centerdView}>
        <View style={styles.modalView}>
          <TextInput style={styles.input} value={name} onChangeText={(text)=>setName(text)} />
          <TextInput style={styles.input} value={age}  onChangeText={(text)=>setAge(text)} />
          <TextInput style={styles.input}  value={Class} onChangeText={(text)=>setClass(text)} />
          <TextInput style={styles.input}  value={School} onChangeText={(text)=>setScool(text)} />
          <View style={{marginBottom:12}}><Button title="Update" onPress={updateUser}  /></View>
          <Button title="Close" onPress={()=>props.setShowModal(false)} />
        </View>
      </View>
      )
    }


const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  datawrapper:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    backgroundColor:'skyblue',
    margin:5,
    marginLeft:11,
    padding:5,
    fontWeight:'bold',
    fontFamily:'Cochin'
  },
  centerdView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:3
  },
  modalView:{
    backgroundColor:'orange',
    padding:30,
    width:300,
    borderRadius:20,
    shadowColor:"#red",
    shadowOpacity:0.60,
    elevation:10
  },
  input:{
    borderColor:'yellow',
    borderWidth:2,
    borderRadius:13,
    marginBottom:15,
  }
  
});

export default App;
