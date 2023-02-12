
import HomeScreen from './components/HomeScreen';
import AboutScreen from './components/AboutScreen';
import React, { Component } from 'react';
import { Image,StyleSheet } from 'react-native-web';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Api } from 'fitbit-api-handler';
import { config as fitbit_config } from './components/Fitbit-config';
import { MyContext, MyContextProvider} from './Global'

const styles = StyleSheet.create({
  app: {
    width:"100%",
    height:"100%",
    flex:1
    },
    drawerActive: {

    },
    drawerInActive:{
      
    },
    
  });


const Drawer = createDrawerNavigator();

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      access_token:"",
    }
  }

  
  
  render() {
        return (
          <MyContextProvider>
            <NavigationContainer style={styles.app}>
              <Drawer.Navigator screenOptions={{
                  drawerStyle: {
                    width: "70%",
                    height:"100%",
                  },
                  // drawerContentStyle: {
                  //   flexDirection: "column-reverse",
                  // },
                }}>
                 <Drawer.Screen name="Home" 
                 component={HomeScreen} 
                 options={{ 
                      title: 'ホーム',
                      drawerLabel: 'ホーム',
                      drawerIcon: ({ focused, size }) => (
                        <Image source={{uri:process.env.PUBLIC_URL + '/heilab_logo.png'}}
                          style={[focused ? styles.drawerActive : styles.drawerInActive, { height: size, width: size }]}
                        />)
                  }}
                />
                {/* <Drawer.Screen name="Rewards" component={RewardsScreen} options={
                      { 
                        title: 'My 謝金',
                        drawerLabel: 'My 謝金',
                        drawerIcon: ({ focused, size }) => (
                          <Image source={require('./assets/reward.png')}
                            style={[focused ? styles.drawerActive : styles.drawerInActive, { height: size, width: size }]}
                          />)
                      }
                    }
                /> */}
              {/* <Drawer.Screen name="Calendar" component={CalendarScreen} options={
                    { 
                      title: 'My カレンダー',
                      drawerLabel: 'My カレンダー',
                      drawerIcon: ({ focused, size }) => (
                        <Image source={require('./assets/calendar.png')}
                          style={[focused ? styles.drawerActive : styles.drawerInActive, { height: size, width: size }]}
                        />)
                    }
                  }
              /> */}
              {/* <Drawer.Screen name="Ranking" component={RankingScreen} options={
                    { 
                      title: 'ランキング',
                      drawerLabel: 'ランキング',
                      drawerIcon: ({ focused, size }) => (
                        <Image source={require('./assets/ranking.png')}
                          style={[focused ? styles.drawerActive : styles.drawerInActive, { height: size, width: size }]}
                        />)
                    }
                  }
              /> */}
             {/* <Drawer.Screen name="Profile" component={ProfileScreen} options={
                    { 
                      title: 'アカウント情報',
                      drawerLabel: 'アカウント情報',
                      drawerIcon: ({ focused, size }) => (
                        <Image source={require('./assets/user.png')}
                          style={[focused ? styles.drawerActive : styles.drawerInActive, { height: size, width: size }]}
                        />)
                    }
                  }
                />         */}
                {/* <Drawer.Screen name="Upload" component={UploadScreen} options={
                    { 
                      title: 'Upload',
                      drawerLabel: 'Upload',
                      drawerIcon: ({ focused, size }) => (
                        <Image source={require('./assets/upload.png')}
                          style={[focused ? styles.drawerActive : styles.drawerInActive, { height: size, width: size }]}
                        />)
                    }
                  }
                /> */}
                
                {/* <Drawer.Screen name="Test" component={Test} options={
                    { 
                      title: 'Fluid IQ課題',
                      drawerLabel: 'Fluid IQ課題',
                      drawerIcon: ({ focused, size }) => (
                        <Image source={require('./assets/user.png')}
                          style={[focused ? styles.drawerActive : styles.drawerInActive, { height: size, width: size }]}
                        />)
                    }
                  }
                /> */}
              </Drawer.Navigator>
          </NavigationContainer>
          </MyContextProvider>

        );
    }
};




export default App;