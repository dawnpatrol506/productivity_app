import React from 'react';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import { Text } from 'native-base';
import Parts from './Parts/Parts';

const dev = true;

const appNavigator = createDrawerNavigator({
    Parts: Parts,
    Assemblies: () => <Text>Assemblies</Text>,
    'Work Stations': () => <Text>Work Stations</Text>,
    Jobs: () => <Text>Jobs</Text>,
    Employees: () => <Text>Employees</Text>
})

const AppContainer = createAppContainer(appNavigator);

export default class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: dev ? 'DevMode' : this.props.navigation.state.params.name,
            appIsReady: dev ? false : true,
        }

        if (dev) {
            Expo.Font.loadAsync({
                'Roboto': require('native-base/Fonts/Roboto.ttf'),
                'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
            })
                .then(() => this.setState({ appIsReady: true }))
        }

    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: dev ? 'DevMode' : navigation.state.params.name,
        }
    }

    render() {
        if(!this.state.appIsReady){
            return <Text>...Loading App...</Text>
        }

        return <AppContainer />
    }
}