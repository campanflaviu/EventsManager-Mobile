import React from 'react';
import {
  AsyncStorage,
  Image,
  Picker,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { Meals } from '../components/Firebase/Firebase';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    meals: [],
    selectedMeal: null,
  }

  async componentDidMount() {
    const selectedMeal = await AsyncStorage.getItem('selectedMeal');

    this.setState({
      selectedMeal,
    });
    
    Meals.once('value').then((meals) => {
      let parsedMeals = [];

      meals.forEach((meal) => {
        parsedMeals.push({
          id: meal.key,
          name: meal.val(),
        });
      });

      this.setState({
        meals: parsedMeals,
      })
    });
  }

  changeMeal(val, index) {
    AsyncStorage.setItem('selectedMeal', val);
    this.setState({
      selectedMeal: val,
    })
  }

  render() {

    const { meals, selectedMeal } = this.state;

    let masaSelectata = meals.find((meal) => {
      if (meal.id === selectedMeal) {
        return true;
      }
      return false;
    });

    if (!masaSelectata) {
      masaSelectata = meals[0];
    }

    return (
      <View style={styles.container}>
        {/* <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}> */}
          <View style={styles.getStartedContainer}>
            <Picker
              selectedValue={selectedMeal}
              style={[styles.picker, {height: 400, width: '100%'}]}
              onValueChange={(val, index) => this.changeMeal(val, index)}
              >
              {meals && meals.map((meal) => {
                return <Picker.Item label={meal.name} value={meal.id} key={meal.id} />
              })}
            </Picker>

            <Text style={styles.getStartedText}>Masa selectata: {masaSelectata && masaSelectata.name}</Text>
          </View>
        {/* </ScrollView> */}
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: '25%',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
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
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  picker: {
    borderColor: 'blue',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10
  }
});
