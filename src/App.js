import React, {Component} from 'react';
import {
  View,
  Text,
  Alert,
  Button,
  Image,
  ScrollView,
  NativeModules,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video';

const ImagePicker = NativeModules.ImageCropPicker;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async browseFiles() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });

      if (res.length > 1) {
        this.setState({
          ...this.state,
          images: res,
        });
      } else {
        this.setState({
          ...this.state,
          image: res,
        });
      }

      console.log(image);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Canceled from multiple doc picker');
      } else {
        console.log(err);
      }
    }
  }

  pickSingle(isCrop, circular = false, mediaType) {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: isCrop,
      cropperCircleOverlay: circular,
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
    })
      .then(image => {
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            type: image.mime,
          },
          images: null,
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  renderVideo(video) {
    return (
      <View style={{height: 300, width: 300}}>
        <Video
          source={{uri: video.uri, type: video.type}}
          style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
          rate={1}
          paused={false}
          volume={1}
          muted={false}
          resizeMode={'cover'}
          onError={e => console.log(e)}
          onLoad={load => console.log(load)}
          repeat={false}
        />
      </View>
    );
  }

  renderImage(image) {
    return (
      <Image
        style={{width: 300, height: 300, resizeMode: 'contain'}}
        source={image}
      />
    );
  }

  renderAsset(image) {
    if (image.type && image.type.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }

  render() {
    return (
      <View style={{flex: 1, marginTop: 10, backgroundColor: '#cacaca'}}>
        <Button title="DocumentPicker" onPress={() => this.browseFiles()} />
        <View style={{marginTop: 10}} />
        <Button title="ImagePicker" onPress={() => this.pickSingle(true)} />
        <View style={{marginTop: 30}} />
        <Text>{JSON.stringify(this.state.image)}</Text>
        <Text>{JSON.stringify(this.state.images)}</Text>
        <View style={{marginTop: 10}} />
        <ScrollView horizontal={true}>
          {this.state.image ? this.renderAsset(this.state.image) : null}
          {this.state.images
            ? this.state.images.map(i => (
                <View key={i.uri}>{this.renderAsset(i)}</View>
              ))
            : null}
        </ScrollView>
      </View>
    );
  }
}

export default App;
