import React from 'react';
import Axios from 'axios';
import { View, Picker } from 'react-native';
import { Container, Form, Input, Button, Item, Label, Text, Card, CardItem } from 'native-base';

export default class CreateParts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStation: null,
            stations: null,
            partName: null,
            partAttachment: null,
            partStations: null,
            err: null,
        }
    }

    componentWillMount = () => {
        Axios.get('https://project-runner-f1bdc.firebaseapp.com/api/v1/stations/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err })
                    return;
                }
                this.setState({ stations: result.data, selectedStation: result.data[0] });
            })
            .catch(err => this.setState({ err }))
    }

    handlePickerChange = index => {
        const station = this.state.stations[index];
        this.setState({ selectedStation: station });
    }

    handleStationAddition = () => {
        const arr = this.state.partStations ? [...this.state.partStations] : [];
        arr.push(this.state.selectedStation);
        this.setState({ partStations: arr });
    }

    handleStationRemoval = index => {
        const arr = Object.assign(this.state.partStations);
        arr.splice(index, 1);
        this.setState({ partStations: arr })
    }

    handleSubmit = () => {
        this.setState({ err: null })

        if (!this.state.partStations || this.state.partStations.length < 1) {
            const err = { message: 'You must have a minimum of one station.' }
            this.setState({ err })
            return;
        }

        if (!this.state.partName) {
            const err = { message: 'You must name your part' };
            this.setState({ err });
            return;
        }

        Axios.post('https://project-runner-f1bdc.firebaseapp.com/api/v1/parts/create', {
            part: {
                id: '',
                name: this.state.partName,
                filename: 'No File',
                stations: this.state.partStations,
                
            }
        })
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err })
                    return;
                }

                this.props.navigation.navigate('View')
            })
            .catch(err => this.setState({ err }))

    }

    render() {
        return (
            <Container style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                <View style={{ flex: 1 }} />
                <Form style={{ flex: 6 }}>
                    <Item>
                        <Label>{this.state.editPart ? this.state.editPart.id : 'Auto - ID'}</Label>
                    </Item>
                    <Item floatingLabel>
                        <Label floatingLabel>Part Name</Label>
                        <Input value={this.state.partName} onChangeText={(text) => this.setState({ partName: text })} />
                    </Item>
                    <Picker
                        style={{ width: '96%', position: 'relative', left: '2%' }}
                        selectedValue={this.state.selectedStation ? this.state.selectedStation.name.toUpperCase() : null}
                        onValueChange={(value, index) => this.handlePickerChange(index)}>
                        {this.state.stations ? this.state.stations.map((station, index) => {
                            return <Picker.Item key={index} value={station.name.toUpperCase()} label={station.name.toUpperCase()} />
                        }) : null}
                    </Picker>
                    <View>
                        {this.state.partStations ? this.state.partStations.map((station, index) => {
                            return (
                                <Card key={index}>
                                    <CardItem>
                                        <Text>{station.name}</Text>
                                        <Button onPress={() => this.handleStationRemoval(index)}><Text>X</Text></Button>
                                    </CardItem>
                                </Card>
                            )
                        }) : null}
                    </View>
                    <Item>
                        <Button onPress={this.handleStationAddition}><Text>Add Station</Text></Button>
                    </Item>
                    <Text style={{ color: 'red' }}>{this.state.err ? this.state.err.message : null}</Text>
                </Form>
                <View style={{ flex: 1 }}>
                    <Button onPress={this.handleSubmit}><Text>Submit</Text></Button>
                </View>
            </Container>
        )
    }
}
