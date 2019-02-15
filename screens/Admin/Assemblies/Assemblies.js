import React from 'react';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import ViewAssemblies from './ViewAssemblies';
import CreateAssemblies from './CreateAssemblies';

const tabNavigator = createMaterialTopTabNavigator({
    View: ViewAssemblies,
    Create: CreateAssemblies
});

const AppContainer = createAppContainer(tabNavigator);

export default class Parts extends React.Component{
    static navigationOptions = {title: 'Assemblies'}

    render(){
        return <AppContainer />
    }
}
