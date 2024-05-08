import { View, Text, ScrollView, FlatList } from 'react-native'
import React, { useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import {Appbar,TextInput,Button} from'react-native-paper'
import Todo from './comp/Todo'



const App = () => {
  const [todo,setTodo] = useState('');
  const [loading,setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const ref = firestore().collection('todos');
  async function addTodo() {
    await ref.add({
      title:todo,
      complete:false,
    });
    setTodo('');
  }
  useState(() =>{
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {title, complete} = doc.data();
        list.push({
          id:doc.id,
          title,
          complete,
        })
      })
      setTodos(list);

      if(loading){
        setLoading(false);
      }
    })
  });

  if(loading){
    return null;
  }
  return (
 
    <View style= {{flex:1}}>
      <Appbar>
        <Appbar.Content title={'TODOs List'}></Appbar.Content>
      </Appbar>
      <FlatList 
        style={{flex:1}}
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <Todo {...item} />}
      >
      </FlatList>
      <TextInput label={'New Todo'} value={todo} onChangeText={(text) =>setTodo(text)}></TextInput>
      <Button onPress={addTodo}>Add TODO</Button>
    </View>
  )
}

export default App