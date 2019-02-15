import React from 'react';
import { Text, Form, Item, Label, Input, Container, Button, Card, CardItem } from 'native-base';
import { View, Picker, Modal, TouchableHighlight } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Axios from 'axios';


export default class CreateAssemblies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parts: null,
            selectedPart: null,
            PartQty: null,
            AssemblyName: null,
            AssemblyParts: null,
            showModal: false,
            err: null
        }
    }

    handleRefresh = () => {
        Axios.get('https://project-runner-f1bdc.firebaseapp.com/api/v1/parts/all')
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }

                this.setState({ parts: result.data, selectedPart: result.data[0] });
            })
            .catch(err => this.setState({ err }))
    }

    handlePickerChange = index => {
        const part = this.state.parts[index];
        this.setState({ selectedPart: part });
    }

    handlePartAddition = () => {
        if (!this.state.PartQty || isNaN(this.state.PartQty) || this.state.PartQty < 1) {
            this.setState({ err: { message: 'you must specify a quantity for you parts.' } })
            return;
        }
        const arr = this.state.AssemblyParts ? this.state.AssemblyParts : [];
        arr.push({ ...this.state.selectedPart, quantity: this.state.PartQty });
        this.setState({ AssemblyParts: arr, showModal: false });
    }

    handlePartRemoval = index => {
        const arr = Object.assign(this.state.AssemblyParts);
        arr.splice(index, 1);
        this.setState({ AssemblyParts: arr });
    }

    handleQuantityChange = text => {
        if (isNaN(text))
            return;

        this.setState({ PartQty: text });
    }

    handleSubmit = () => {
        if (!this.state.partName) {
            this.setState({ err: { message: 'You must name your assembly.' } })
            return;
        }

        if (!this.state.AssemblyParts || this.state.AssemblyParts.length < 1) {
            this.setState({ err: { message: 'You must add parts to your assembly' } });
            return;
        }

        alert('submit');
    }

    render() {
        return (
            <Container style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                <NavigationEvents
                    onWillFocus={this.handleRefresh}
                />
                <View style={{ flex: 1 }} />
                <Form style={{ flex: 6 }}>
                    <Item>
                        <Label>{this.state.editPart ? this.state.editPart.id : 'Auto - ID'}</Label>
                    </Item>
                    <Item floatingLabel>
                        <Label floatingLabel>Part Name</Label>
                        <Input value={this.state.partName} onChangeText={(text) => this.setState({ partName: text })} />
                    </Item>
                    <View>
                        {this.state.AssemblyParts ? this.state.AssemblyParts.map((part, index) => {
                            return (
                                <Card key={index}>
                                    <CardItem>
                                        <Text>{part.name}</Text>
                                        <Text>{part.quantity}</Text>
                                        <Button onPress={() => this.handlePartRemoval(index)}><Text>X</Text></Button>
                                    </CardItem>
                                </Card>
                            )
                        }) : null}
                    </View>
                    <Item>
                        <Button onPress={() => this.setState({ showModal: true })}><Text>Add Part</Text></Button>
                    </Item>
                    <Text style={{ color: 'red' }}>{this.state.err ? this.state.err.message : null}</Text>
                </Form>
                <View style={{ flex: 1 }}>
                    <Button onPress={this.handleSubmit}><Text>Submit</Text></Button>
                </View>
                <Modal
                    animationType='slide'
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.setState({ showModal: false })}
                    style={{ flex: 1, flexDirection: 'column' }}
                >
                    <TouchableHighlight onPress={() => this.setState({ showModal: false })} style={{ flex: 1 }}>
                        <Text>Close</Text>
                    </TouchableHighlight>
                    <Form style={{ flex: 4 }}>
                        <Picker
                            style={{ width: '96%', position: 'relative', left: '2%' }}
                            selectedValue={this.state.selectedPart ? this.state.selectedPart.name.toUpperCase() : null}
                            onValueChange={(value, index) => this.handlePickerChange(index)}>
                            {this.state.parts ? this.state.parts.map((part, index) => {
                                return <Picker.Item key={index} value={part.name.toUpperCase()} label={part.name.toUpperCase()} />
                            }) : null}
                        </Picker>
                        <Item floatingLabel>
                            <Label>Quantity</Label>
                            <Input keyboardType="number-pad" onChangeText={text => this.handleQuantityChange(text)} value={this.state.PartQty} />
                        </Item>
                        <Item>
                            <Button onPress={this.handlePartAddition}><Text>Add Part</Text></Button>
                        </Item>
                    </Form>
                </Modal>
            </Container>
        )
    }
}