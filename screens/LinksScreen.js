import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, Button, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';

import { Meals, Users } from '../components/Firebase/Firebase';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    hasCameraPermission: null,
    scanned: false,
    scannedData: null,
    selectedMeal: null,
    meals: [],
    notFound: false,
  }


  async componentWillMount() {
    this.props.navigation.addListener('willFocus', (route) => {
      this.getCurrentMeal();
      this.setState({
        scanned: false,
        scannedData: null,
      });
    });

    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    Meals.once('value').then((meals) => {
      let parsedMeals = [];

      
      meals.forEach((meal) => {
        parsedMeals.push({
          id: meal.key,
          name: meal.val(),
        });
      });
      console.log('meals', meals, 'parsed meals', parsedMeals);

      this.setState({
        meals: parsedMeals,
      }, async () => {
        await this.getCurrentMeal();
      });
    });
  }

  async getCurrentMeal() {
    let selectedMeal = await AsyncStorage.getItem('selectedMeal');
    if (!selectedMeal) {
      selectedMeal = this.state.meals[0].id;
    }
    console.log('selectedMeal', selectedMeal, this.state.meals);

    this.setState({
      selectedMeal,
    });
  }

  handleBarCodeScanned(data) {
    const { selectedMeal } = this.state;
    const scannedId = data ? data.data.split('_')[0] : null;
    console.log('barcode data', data, scannedId);
    this.setState({
      notFound: false
    }, () => {
      Users.once('value').then((data) => {
        let userData = {};
        if (data.val()) {
          const val = data.val()[scannedId];
          console.log('user data', val, selectedMeal);
          if (!val) {
            this.setState({
              notFound: true,
            });
          } else {
            userData = {
              id: val.id,
              name: val.name,
              m1: val.m1,
              m2: val.m2,
              m4: val.m4,
              m5: val.m5,
              m6: val.m6,
              meals: val.meals,
              notes: val.notes,
              masaCurentaValida: val[selectedMeal]
            }
    
            if (userData[this.state.selectedMeal]) {
              console.log('da!', userData.id, this.state.selectedMeal, userData[this.state.selectedMeal]);
            // } else{
              // console.log('nu');
              Users.child(userData.id).update({
                [this.state.selectedMeal]: !userData[this.state.selectedMeal]
              });
    
              this.updateMeal(userData, this.state.selectedMeal, userData[this.state.selectedMeal]);
            }
          }
        }
        this.setState({
          scanned: true,
          scannedData: data.data,
          userData,
        });
      });
    });

  }

  scanAgain() {
    this.setState({
      scanned: false,
      scannedData: null,
    });
  }

  updateMeal(userData, meal, value) {
    console.log('update meal', userData, meal, value);

    Users.child(userData.id).update({
      [meal]: !value
    }).then(() => {
      this.setState({
        userData: {
          ...userData,
          [meal]: !value
        }
      });
    });
  }

  render() {
    const { hasCameraPermission, scanned, scannedData, userData, meals, selectedMeal, notFound } = this.state;

    // if (!userData) {
    //   return <Text>Waiting</Text>;
    // }

    console.log('userdata', userData);

    console.log('not found', notFound);

    let masaSelectata = meals.find((meal) => {
      if (meal.id === selectedMeal) {
        return true;
      }
      return false;
    });

    if (!masaSelectata) {
      masaSelectata = meals[0];
    }

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    if (userData) {
      console.log(userData[masaSelectata.id]);
    }

    console.log('masa selectata', masaSelectata, 'user data', userData);

    return (
        <View style={{ flex: 1 }}>
          {!scanned && <BarCodeScanner
            onBarCodeScanned={this.handleBarCodeScanned.bind(this)}
            style={styles.fill}
            >
            <Text style={styles.barcodeOverlay}>{masaSelectata && masaSelectata.name}</Text>
          </BarCodeScanner>}
          {(scanned && !notFound && userData) &&
            <React.Fragment>
              <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.container}>
                  <View style={styles.centerContainer}>
                    <Text>{scannedData}</Text>
                    <View>
                      <Text style={styles.name}>{userData.name}</Text>
                      <TouchableOpacity onPress={() => {}}>
                        <View style={[styles.meal, styles.currentMeal, userData.masaCurentaValida ? styles.mealYes : styles.mealNo]}>
                          <Text style={styles.whiteText}>{masaSelectata.name} : {userData.masaCurentaValida ? 'DA' : 'NU'}</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={{marginTop: 20, marginBottom: 20}}>
                        <Text>Mese (text): {userData.meals}</Text>
                        <Text>Note: {userData.notes}</Text>
                      </View>

                      <Text>Toate mesele</Text>
                      <TouchableOpacity onPress={() => this.updateMeal(userData, 'm1', userData.m1)}>
                        <View style={[styles.meal, userData.m1 ? styles.mealYes : styles.mealNo]}>
                          <Text style={styles.whiteText}>{meals.find((meal) => meal.id === 'm1').name} : {userData.m1 ? 'da' : 'nu'}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.updateMeal(userData, 'm2', userData.m2)}>
                        <View style={[styles.meal, userData.m2 ? styles.mealYes : styles.mealNo]}>
                          <Text style={styles.whiteText}>{meals.find((meal) => meal.id === 'm2').name} : {userData.m2 ? 'da' : 'nu'}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.updateMeal(userData, 'm4', userData.m4)}>
                        <View style={[styles.meal, userData.m4 ? styles.mealYes : styles.mealNo]}>
                          <Text style={styles.whiteText}>{meals.find((meal) => meal.id === 'm4').name} : {userData.m4 ? 'da' : 'nu'}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.updateMeal(userData, 'm5', userData.m5)}>
                        <View style={[styles.meal, userData.m5 ? styles.mealYes : styles.mealNo]}>
                          <Text style={styles.whiteText}>{meals.find((meal) => meal.id === 'm5').name} : {userData.m5 ? 'da' : 'nu'}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.updateMeal(userData, 'm6', userData.m6)}>
                        <View style={[styles.meal, userData.m6 ? styles.mealYes : styles.mealNo]}>
                          <Text style={styles.whiteText}>{meals.find((meal) => meal.id === 'm6').name} : {userData.m6 ? 'da' : 'nu'}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <View style={styles.tabBarInfoContainer}>
                <Button
                  onPress={this.scanAgain.bind(this)}
                  title="Scanează din nou"
                  color="#841584"
                  accessibilityLabel="Scanează din nou"
                />
              </View>
            </React.Fragment>
          }
          {notFound && 
            <React.Fragment>
              <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={[styles.centerContainer, styles.name]}>
                  <Text>Nu s-a gasit codul de bare!</Text>
                </View>
              </ScrollView>
              <View style={styles.tabBarInfoContainer}>
                <Button
                  onPress={this.scanAgain.bind(this)}
                  title="Scanează din nou"
                  color="#841584"
                  accessibilityLabel="Scanează din nou"
                />
              </View>
            </React.Fragment>
          }
        </View>
    );  
  }
}

const styles = StyleSheet.create({
  fill: {
    display: 'flex',
    width: '100%',
    height: '100%'
  },  
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  centerContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    marginBottom: 150,
  },
  barcodeOverlay: {
    width: '100%',
    height: 100,
    backgroundColor: 'black',
    padding: '10%',
    color: 'white',
    opacity: 0.7,
    fontSize: 20
  },
  overlayText: {
    color: 'white'
  },
  name: {
    fontSize: 25,
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    fontWeight: 'bold',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  currentMeal: {
    height: 100,
    fontSize: 20
  },
  meal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    height: 50,
    // padding: 10,
    color: 'white'
  },
  mealYes: {
    backgroundColor: 'green'
  },
  mealNo: {
    backgroundColor: 'red'
  },
  whiteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15
  }
});
