import React from 'react';
import { View, AsyncStorage, Text } from 'react-native';

export default class Admin extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: this.props.name
        }
    }

    static navigationOptions = {
        title: 'Admin'
    }

    render(){
        return <Text>{this.state.name}</Text>
    }
}