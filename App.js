import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Text } from 'native-base';
import Login from './screens/Login/Login';
import Admin from './screens/Admin/Admin';


const AppNavigator = createStackNavigator({
  Login: Login,
  Admin: Admin,
  Employee: () => <Text>Employee</Text>
})

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component{
  render(){
    return <AppContainer />
  }
}