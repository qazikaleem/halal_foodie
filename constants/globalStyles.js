// globalStyles.js
import { StyleSheet, Platform, Dimensions } from 'react-native';

const globalStyles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width,
    backgroundColor: '#B1D235',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
    zIndex: 2
  },
  headerInner: {
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0
  },
  restheader: {
    padding: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden'
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.OS === 'android' ? 15 : 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width,
  },

  text: {
    fontSize: 16,
    fontWeight: '400',
    color: '#2D2729',
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    maxHeight: 45
  },
  iconBtn: {
    backgroundColor: '#87aa03',
    padding: 10,
    borderRadius: '50%'
  },
  btnText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 32,
    color: '#FFFFFF',
    fontFamily: 'popS'
  },
  btnTextPress: {
    textAlign: 'center',
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'popM'
  },
  loadingtitle: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginVertical: 15,
    color: '#2D2729',
    width: Dimensions.get('window').width - 30
  },
  overlayView: {
    height: "100%",
    width: "100%",
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.45)',
    overflow: 'hidden'
  },
  headerhome: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 50,
  },
});

export default globalStyles;