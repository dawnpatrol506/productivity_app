import React from 'react';
import Axios from 'axios';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import { Text } from 'native-base';
import ViewParts from './ViewParts';
import CreateParts from './CreateParts';

const tabNavigator = createMaterialTopTabNavigator({
    View: ViewParts,
    Create: CreateParts
});

const AppContainer = createAppContainer(tabNavigator);

export default class Parts extends React.Component{
    static navigationOptions = {title: 'Parts'}

    render(){
        return <AppContainer />
    }
}
