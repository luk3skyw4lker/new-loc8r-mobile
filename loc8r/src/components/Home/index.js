import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableNativeFeedback } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import api from '../../services/api';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: '',
      locations: [],
      error: null,
      locationId: ''
    };

    this.handlePress = this.handlePress.bind(this);
  }

  async componentDidMount() {
    Geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        console.log('Success!');
        this.setState({
          region: {
            lat: latitude,
            lng: longitude
          }
        }, getLocations);
      },
      (err) => {
        console.log(err);
        this.setState({
          error: 'Could not get location info, clean the application data and open the app again'
        });
      },
      {
        timeout: 10000,
        maximumAge: 1000,
        enableHighAccuracy: true
      }
    );

    const getLocations = async () => {
      const url = `/locations?lng=${this.state.region.lng}&lat=${this.state.region.lat}&maxDistance=20`;

      const response = await api.get(url);

      this.setState({
        locations: response.data
      });
    }
  }

  handlePress(locationId) {
    const { navigation } = this.props;

    this.setState({
      locationId
    }, () => navigation.navigate('Locations', { locationId: this.state.locationId }));
  }

  render() {
    const { locations, error } = this.state;

    return (
      <ScrollView style={styles.container} contentContainerStyle={locations.length > 0 ? { alignItems: 'center' } : styles.allCenter} maintainVisibleContentPosition={true}>
        {
          error !== null ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
              locations.length > 0 ? (
                locations.map((location) => {
                  return (
                    <TouchableNativeFeedback key={location.id} onPress={() => this.handlePress(location.id)}>
                      <View style={styles.locationBox}>
                        <Text style={[styles.locationName, { fontFamily: 'Lobster-Regular' }]}>{location.name}</Text>
                        <Text style={[styles.locationName, { fontSize: 20, fontWeight: 'bold' }]}>{location.address}</Text>
                        <View style={{ flexDirection: 'row' }}>
                          {
                            location.facilities.map((facility, index) => {
                              return (
                                <View style={styles.facilityBox} key={index}>
                                  <Text style={styles.facilityText}>{index === 0 ? facility : facility.substr(1)}</Text>
                                </View>
                              )
                            })
                          }
                        </View>
                      </View>
                    </TouchableNativeFeedback>
                  )
                })
              ) : (
                  <Text style={styles.buttonText}>Getting locations...</Text>
                )
            )
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#108a93',
    padding: 15
  },

  button: {
    margin: 20,
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#A92323',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center'
  },

  errorText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },

  error: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#A92323',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left'
  },

  locationBox: {
    padding: 5,
    width: 350,
    height: 115,
    borderColor: '#fff',
    borderRadius: 5,
    borderWidth: 2,
    marginBottom: 8,
    backgroundColor: '#469ea8',
    elevation: 8
  },

  locationName: {
    textAlign: 'left',
    fontSize: 30,
    color: '#fff'
  },

  facilityBox: {
    flexDirection: 'row',
    backgroundColor: '#ffc107',
    padding: 4,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5
  },

  facilityText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 10,
  },

  allCenter: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});