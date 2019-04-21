import React from 'react';
import { Alert, Button, Text, TouchableOpacity, TextInput, View, StyleSheet } from 'react-native';

export default class AuthScreen extends React.Component {
//   constructor(props) {
//     super(props);
//     // this._bootstrapAsync();
//   }

  state = {
    email: '',
    password: '',
  };


onLogin() {
    const { email, password } = this.state;

    if (email === 'Amicus' && password === '2019') {
        this.props.navigation.navigate('Main');
    } else {
        Alert.alert('User sau parola incorecta!');
    }
}

  // Fetch the token from storage then navigate to our appropriate place
//   _bootstrapAsync = async () => {
//     const userToken = await AsyncStorage.getItem('userToken');

//     // This will switch to the App screen or Auth screen and this loading
//     // screen will be unmounted and thrown away.
//     this.props.navigation.navigate(userToken ? 'App' : 'Auth');
//   };

  // Render any loading content that you like here
  render() {
    return (
    <View style={styles.container}>
        <Text style={styles.titleText}>Verificare Mese</Text>
        <TextInput
          value={this.state.email}
          keyboardType = 'email-address'
          onChangeText={(email) => this.setState({ email })}
          placeholder='email'
          placeholderTextColor = 'white'
          style={styles.input}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'password'}
          secureTextEntry={true}
          placeholderTextColor = 'white'
          style={styles.input}
        />
        
      
        <TouchableOpacity
          style={styles.button}
          onPress={this.onLogin.bind(this)}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
          
    </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleText:{
      fontSize: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      alignItems: 'center',
      width: 200,
      height: 44,
      padding: 10,
      borderWidth: 1,
      borderColor: 'lightblue',
      borderRadius: 25,
      marginBottom: 10,
    },
    buttonText:{
      fontSize: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      width: 200,
      fontSize: 20,
      height: 44,
      padding: 10,
      borderWidth: 1,
      borderColor: 'lightblue',
      marginVertical: 10,
    },
  });