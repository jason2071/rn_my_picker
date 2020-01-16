import React, {Component} from 'react';
import {View, Text, Button, Alert} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async browseFiles() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      const fileDetails = {
        uri: res.uri,
        name: res.name,
        size: res.size,
        type: res.type,
      };

      this.setState({
        ...this.state,
        fileDetails: fileDetails,
      });

      console.log(fileDetails);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Canceled from multiple doc picker');
      } else {
        console.log(err);
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button title="PICKER" onPress={() => this.browseFiles()} />
      </View>
    );
  }
}

export default App;
