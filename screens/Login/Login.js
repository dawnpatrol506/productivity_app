import React from 'react';
import { Container, Content, Item, Label, Input, Button, Form, H1, Text } from 'native-base';
import { View, AsyncStorage } from 'react-native';
import Axios from 'axios';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appIsReady: false,
            isLoggedIn: false,
            email: '',
            password: '',
            err: null
        }

        Expo.Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
        })
            .then(() => this.setState({ appIsReady: true }))
    }

    static navigationOptions = { title: "Login" }

    handleSubmit = () => {

        this.setState({ err: null })
        Axios.post('https://project-runner-f1bdc.firebaseapp.com/api/v1/auth/login', {
            email: this.state.email,
            password: this.state.password
        })
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err.message })
                    return;
                }

                AsyncStorage.setItem('name', result.data.name);

                const params = {
                    uid: result.data.uid,
                    token: result.data.token,
                    name: result.data.name,
                    isAdmin: result.data.isAdmin
                }

                if (result.data.isAdmin === true) {
                    this.props.navigation.navigate('Admin', { ...params });
                }
                else {
                    this.props.navigation.navigate('Employee', { ...params });
                }
            })
            .catch(err => this.setState({ err: err.message }))
    }

    render() {
        if (!this.state.appIsReady)
            return (
                <Container>
                    <Content>
                        <H1>Loading Interface...</H1>
                    </Content>
                </Container>
            )

        return (
            <Container style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: 'red' }}>{this.state.err}</Text>
                </View>
                <H1 style={{ textAlign: 'center' }}>Login</H1>
                <Form style={{ flex: 2 }}>
                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input value={this.state.email} onChangeText={text => this.setState({ email: text })} />
                    </Item>
                    <Item floatingLabel>
                        <Label>Password</Label>
                        <Input secureTextEntry={true} value={this.state.password} onChangeText={text => this.setState({ password: text })} />
                    </Item>
                </Form>
                <Button style={{ width: '80%', position: 'relative', left: '5%', }} onPress={this.handleSubmit}><Text>Log In</Text></Button>
                <View style={{ flex: 3 }} />
            </Container>
        )
    }
}