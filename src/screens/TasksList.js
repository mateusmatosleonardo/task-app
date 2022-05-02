/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {api} from '../api';
import Task from '../components/Task';
import Icon from 'react-native-vector-icons/AntDesign';
import Profile from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('window');

const TasksList = () => {
  const [text, setText] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('red');
  const [task, setTask] = useState([]);
  const colors = {
    red: '#F44B4B',
    blue: '#7ACBD6',
    green: '#63E478',
  };

  const Loading = () => {
    return <ActivityIndicator color={'#616060'} size={'large'} />;
  };

  const getTask = async () => {
    await api
      .get('/task')
      .then(({data}) => {
        setTask(data);
        setTimeout(() => {
          setRefresh(false);
        }, 2000);
        console.log(JSON.stringify(data));
      })
      .catch(err => {
        console.log(err) + 'ocorreu um erro na requisição';
      });
  };

  const createTask = async () => {
    await api
      .post('/task', {
        content: text,
        selected: `${selected}`,
      })
      .catch(err => {
        console.log({...err});
      });
    setTask(task.concat({content: text, selected: `${selected}`}));
  };

  // const addTask = () => {
  //   setTask([...task, {id: Math.random(), content: text, selected}]);
  //   setText('');
  // };

  const deletTask = async id => {
    await api
      .delete(`/task/${id}`)
      .then(() => {
        setTask(task.filter(task => task.id !== id));
      })
      .catch(err => {
        console.log(err) + 'ocorreu um erro na requisição';
      });
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      getTask();
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.nameUser, {fontFamily: 'Montserrat-SemiBold'}]}>
          Mateus
        </Text>

        <View style={styles.borderProfile}>
          <Profile name="user-circle" color="#414040" size={42} />
          {/* <Image source={ImgProfile} style={styles.imgProfile} /> */}
        </View>
      </View>
      <View
        style={[
          styles.taskList,
          {borderTopRightRadius: 15, borderTopLeftRadius: 15},
        ]}>
        {/* <Image
          source={require('../assets/imgs/bgApp.jpg')}
          style={StyleSheet.absoluteFillObject}
          blurRadius={15}
          resizeMode="cover"
        /> */}
        <FlatList
          ListEmptyComponent={
            loading ? (
              <View
                style={{
                  height: height * 0.9,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Loading />
              </View>
            ) : (
              <Text
                style={{
                  fontFamily: 'Montserrat-Regular',
                  color: '#919090',
                  textAlign: 'center',
                  marginVertical: 300,
                }}>
                Você não possui tarefas no momento!
              </Text>
            )
          }
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={() => getTask()} />
          }
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          contentContainerStyle={styles.flatStyle}
          data={task}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Task
              style={[
                styles.containerTask,
                {backgroundColor: colors[item.selected]},
              ]}
              textStyle={styles.nameTask}
              text={item.content}
              onPress={() => deletTask(item.id)}
            />
          )}
        />
        <View />
      </View>

      <TouchableOpacity
        style={styles.btnAddTask}
        onPress={() => setVisible(!visible)}>
        <Text style={{color: '#fefefe', fontSize: 30, fontWeight: '300'}}>
          +
        </Text>
      </TouchableOpacity>
      <Modal transparent visible={visible} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={styles.modal}>
            <View style={{width: '100%', padding: 10}}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 30,
                  height: 30,
                  borderRadius: 50,
                  elevation: 6,
                  backgroundColor: '#0C202D',
                }}
                onPress={() => setVisible(!visible)}>
                <Icon name="close" size={18} color="#fafafa" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nome da tarefa"
              placeholderTextColor={'#000'}
              onChangeText={text => setText(text)}
              maxLength={40}
            />
            <View style={{width: '100%', padding: 20}}>
              <Text
                style={{
                  color: '#414040',
                  fontSize: 14,
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                Escolha a prioridade da tarefa:
              </Text>
              <View style={{width: '100%', marginTop: 15}}>
                <TouchableOpacity
                  onPress={() => setSelected('red')}
                  activeOpacity={0.8}
                  style={[
                    styles.prioritySelected,
                    {
                      ...(selected === 'red' ? {elevation: 6} : {elevation: 1}),
                    },
                  ]}>
                  <View
                    style={{
                      width: 30,
                      height: '100%',
                      backgroundColor: '#F44B4B',

                      marginRight: 10,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                  />
                  <Text
                    style={{
                      color: '#414040',
                      fontFamily: 'Montserrat-Regular',
                    }}>
                    Alta prioridade
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelected('blue')}
                  activeOpacity={0.8}
                  style={[
                    styles.prioritySelected,
                    {marginTop: 10},
                    {
                      ...(selected === 'blue'
                        ? {elevation: 6}
                        : {elevation: 1}),
                    },
                  ]}>
                  <View
                    style={{
                      width: 30,
                      height: '100%',
                      backgroundColor: '#7ACBD6',
                      marginRight: 10,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                  />
                  <Text
                    style={{
                      color: '#414040',
                      fontFamily: 'Montserrat-Regular',
                    }}>
                    Média prioridade
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelected('green')}
                  activeOpacity={0.8}
                  style={[
                    styles.prioritySelected,
                    {marginTop: 10},
                    {
                      ...(selected === 'green'
                        ? {elevation: 6}
                        : {elevation: 1}),
                    },
                  ]}>
                  <View
                    style={{
                      width: 30,
                      height: '100%',
                      backgroundColor: '#63E478',
                      marginRight: 10,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                  />
                  <Text
                    style={{
                      color: '#414040',
                      fontFamily: 'Montserrat-Regular',
                    }}>
                    Baixa prioridade
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              disabled={text === '' ? true : false}
              style={styles.btnAddModal}
              onPress={() => createTask()}>
              <Text
                style={{color: '#fefefe', fontFamily: 'Montserrat-Regular'}}>
                Adicionar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C202D',
  },
  header: {
    width: '100%',
    height: height * 0.12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0C202D',
  },
  taskList: {
    width: '100%',
    height: height * 0.9,
    backgroundColor: '#f2f2f2',
  },
  containerTask: {
    width: 8,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    height: 90,
  },
  btnAddTask: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
    right: 30,
    width: 46,
    height: 46,
    borderRadius: 50,
    backgroundColor: '#0C202D',
    elevation: 6,
  },
  modal: {
    width: width * 0.88,
    height: height * 0.52,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    elevation: 4,
  },
  nameUser: {
    fontSize: 20,
    color: '#f2f2f2',
  },
  imgProfile: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  borderProfile: {
    borderWidth: 1.5,
    padding: 1,
    borderRadius: 50,
    borderColor: '#f2f2f2',
    elevation: 8,
  },
  flatStyle: {
    paddingHorizontal: 15,
    marginTop: 5,
  },
  nameTask: {
    color: '#414040',
    fontFamily: 'Montserrat-Regular',
  },
  input: {
    width: '90%',
    marginVertical: 25,
    borderBottomWidth: 0.5,
    borderBottomColor: '#414040',
    borderColor: '#000',
    color: '#414040',
    fontFamily: 'Montserrat-Regular',
  },
  prioritySelected: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    elevation: 0.5,
    borderRadius: 8,
  },
  btnAddModal: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    height: 35,
    borderRadius: 8,
    elevation: 6,
    backgroundColor: '#0C202D',
  },
});

/*
  * código que posso usar no futuro kk
<Text
                style={{
                  fontFamily: 'Montserrat-Regular',
                  color: '#919090',
                  textAlign: 'center',
                  marginVertical: 300,
                }}>
                Você não possui tarefas no momento!
              </Text>
*/

export default TasksList;
