import React from 'react';
import Axios from 'axios';
import { Container, Content, Button, Card, Text, H1, Body, CardItem } from 'native-base';

export default class ViewParts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parts: null,
            err: null,
        }

        Axios.get('https://project-runner-f1bdc.firebaseapp.com/api/v1/parts/all')
            .then(result => {
                if (result.err) {
                    this.setState({ err });
                }
                this.setState({ parts: result.data });
            })
            .catch(err => this.setState({ err }))
    }

    handleRefresh = () => {
        Axios.get('https://project-runner-f1bdc.firebaseapp.com/api/v1/parts/all')
        .then(result => {
            if (result.err) {
                this.setState({ err });
            }
            this.setState({ parts: result.data });
        })
        .catch(err => this.setState({ err }))
    }

    render() {

        return (
            <Container>
                <H1>{this.state.err ? this.state.err.message : ''}</H1>
                <Content padder>
                    {this.state.parts ? this.state.parts.map((part, index) => {
                        return (
                            <Card key={index}>
                                <CardItem header>
                                    <Text>{part.name}</Text>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Text style={{fontWeight: 'bold'}}>Stations: </Text>
                                        {part.stations.map((station, index) => {
                                            return <Text key={index}>{station.name}</Text>
                                        })}
                                    </Body>
                                </CardItem>
                                <CardItem footer>
                                    <Button style={{backgroundColor: '#286090', marginRight: 10}}><Text>Attachment</Text></Button>
                                    <Button style={{backgroundColor: '#ec971f', marginRight: 10}}><Text>Edit</Text></Button>
                                    <Button style={{backgroundColor: '#c9023c'}}><Text>Delete</Text></Button>
                                </CardItem>
                            </Card>
                        )
                    }) : null}
                    <Button block onPress={this.handleRefresh}><Text>Refresh List</Text></Button>
                </Content>
            </Container>
        )
    }

}