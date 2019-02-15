import React from 'react';
import Axios from 'axios';
import { Container, Content, Button, Card, Text, H1, Body, CardItem, Toast } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import { FileSystem } from 'expo';
import { Linking } from 'react-native';

export default class ViewParts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parts: null,
            err: null,
            deleteTimeout: null
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

    onClose = reason => {
        if (reason === 'user')
            clearTimeout(this.state.deleteTimeout);

        this.setState({ deleteTimeout: null });
    }

    handlePartDeletion = (index, name) => {
        Toast.show({
            text: `Deleting ${name}`,
            buttonText: 'Cancel',
            buttonTextStyle: { color: 'orange' },
            duration: 5000,
            onClose: this.onClose
        })
        const deleteTimeout = setTimeout(() => {
            const id = this.state.parts[index].id;
            Axios.put(`https://project-runner-f1bdc.firebaseapp.com/api/v1/parts/archive/${id}`)
                .then(result => {
                    if (result.data.err) {
                        this.setState({ err: result.data.err })
                        return;
                    }
                    this.handleRefresh();
                })
                .catch(err => this.setState({ err }));
        }, 5100);
        this.setState({ deleteTimeout })
    }

    handlePartEdit = part => {
        this.props.navigation.navigate('Create', {...part});
    }

    handleViewAttachment = async filepath => {
        const url = `https://firebasestorage.googleapis.com/v0/b/project-runner-f1bdc.appspot.com/o/${encodeURIComponent(filepath)}?alt=media&token=0cc68cd5-114f-41f0-a38e-6052d9558d41`;
        Axios.get(url)
            .then(async result => {
                Linking.openURL(`${url}?alt=media&token=${result.data.downloadTokens}`)
            })
    }

    render() {

        return (
            <Container>
                <NavigationEvents
                    onWillFocus={this.handleRefresh}
                />
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
                                        <Text style={{ fontWeight: 'bold' }}>Stations: </Text>
                                        {part.stations.map((station, index) => {
                                            return <Text key={index}>{station.name}</Text>
                                        })}
                                    </Body>
                                </CardItem>
                                <CardItem footer>
                                    <Button style={{ backgroundColor: '#286090', marginRight: 10 }} onPress={() => this.handleViewAttachment(part.filepath)}><Text>Attachment</Text></Button>
                                    {/* <Button style={{ backgroundColor: '#ec971f', marginRight: 10 }} onPress={() => this.handlePartEdit(part)}><Text>Edit</Text></Button> */}
                                    <Button style={{ backgroundColor: '#c9023c' }} onPress={() => this.handlePartDeletion(index, part.name)}><Text>Delete</Text></Button>
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