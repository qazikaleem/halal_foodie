// globalStyles.js
import { StyleSheet, Platform, Dimensions } from 'react-native';

const globalStyles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#f6f6f6'
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.OS === 'android' ? 15 : 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width,
  },
  contentArea: {
    paddingVertical: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: '#2D2729',
  },
  btn: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#B1D235',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    maxHeight: 50
  },
  btnText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#B1D235',
    fontFamily: 'popS'
  },
  btnTextPress: {
    textAlign: 'center',
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'popS'
  },
  loadingtitle: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginVertical: 15,
    color: '#2D2729',
    width: Dimensions.get('window').width - 30
  },
  header: {
    paddingHorizontal: Platform.OS === 'android' ? 15 : 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width,
    backgroundColor: '#B1D235',
    paddingTop: 20,
    paddingBottom: 25,
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25
  },
  restheader: {
    padding: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden'
  },
  overlayView: {
    height: "100%",
    width: "100%",
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  headerhome: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 100,
  },
});

export default globalStyles;