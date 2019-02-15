import React from 'react';
import Axios from 'axios';
import { NavigationEvents } from 'react-navigation';
import { Text, Container, Content, Card, CardItem, Button, H1, Body } from 'native-base';
import { View } from 'react-native';

export default class ViewAssemblies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assemblies: null
        }
    }

    handleRefresh = () => {
        Axios.get('https://project-runner-f1bdc.firebaseapp.com/api/v1/assemblies/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }
                this.setState({ assemblies: result.data })
            })
            .catch(err => this.setState({ err }));
    }

    handleAssemblyDeletion = id => {
        Axios.put('https://project-runner-f1bdc.firebaseapp.com/api/v1/assemblies/archive', {
            id
        })
        .then(result => {
            if(result.data.err){
                this.setState({ err: result.data.err});
                return;
            }
            this.handleRefresh();
        })
        .catch(err => this.setState({ err }))
    }

    render() {
        return (
            <Container>
                <NavigationEvents
                    onWillFocus={this.handleRefresh}
                />
                <Content padder>
                    {this.state.assemblies ? this.state.assemblies.map((assembly, index) => (
                        <Card key={index}>
                            <CardItem header>
                                <H1>{assembly.name}</H1>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text style={{ fontWeight: 'bold' }}>Parts:</Text>
                                    {assembly.parts.map((part, index) => {
                                        return (
                                            <Text key={index}>
                                                <Text style={{ fontWeight: 'bold' }}>Name: </Text>
                                                <Text>{part.name}   </Text>
                                                <Text style={{fontWeight: 'bold'}}>Qty: </Text>
                                                <Text>{part.quantity}</Text>
                                            </Text>
                                        )
                                    })}
                                </Body>
                            </CardItem>
                            <CardItem footer>
                                <Button onPress={() => this.handleAssemblyDeletion(assembly.id)} style={{backgroundColor: '#c9023c', color: 'white'}}><Text>Delete</Text></Button>
                            </CardItem>
                        </Card>
                    )) : null}
                </Content>
            </Container>
        )
    }
}