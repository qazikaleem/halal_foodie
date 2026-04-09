import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

const HeaderComponent = () => {
  return (
    <View style={[globalStyles.header, { paddingTop: StatusBar.currentHeight + 15 }]}>
      {currentLocation && <Pressable onPress={() => SearchLocationHandle()} style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <View>
          <Entypo name="location" size={24} color="#2D2729" />
        </View>
        <View style={{ width: Dimensions.get('window').width - 120 }}>
          <Text style={{ fontSize: 12, color: '#FFFFFF', fontFamily: 'popS' }}>Use your Current or Search any Location</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, marginRight: 5, fontSize: 14, color: '#2D2729', fontFamily: 'popS' }} numberOfLines={1} ellipsizeMode="tail">{currentLocation}</Text><Entypo name="chevron-thin-right" size={15} color="#2D2729" />
          </View>
        </View>
        <Image source={Logo} style={{ maxWidth: 40, height: 40 }} />
      </Pressable>}
      <View style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10 }}>
        <View style={styles.searchContainer}>
          <Pressable style={styles.textInput} onPress={() => navigation.navigate('ResultRestaurants', { search: '' })}><Text style={{ paddingHorizontal: 4, paddingVertical: 8, fontSize: 16, opacity: 0.55 }}>Search by restaurant</Text></Pressable>
          <Feather name="search" size={20} color="#B1D235" style={styles.searchIcon} />
        </View>
        <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(177, 210, 53,0.45)' : '#ffffff' }, styles.filterbtn]} onPress={() => navigation.navigate('SortFilter')}>
          <Image source={FilterList} style={{ maxWidth: 30, height: 30 }} />
        </Pressable>
      </View>
    </View>
  )
}

export default HeaderComponent

const styles = StyleSheet.create({})