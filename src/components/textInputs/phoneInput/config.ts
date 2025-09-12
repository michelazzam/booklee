import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  inputContainer: {
    minHeight: 75,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#F3F3F3',
    backgroundColor: 'transparent',
  },
  errorText: {
    marginTop: 8,
    marginLeft: 16,
    color: '#E81717',
  },
});

export const inputContainerStyle = {
  containerStyle: {
    container: {
      flex: 1,
      borderWidth: 0,
      borderRadius: 10,
      backgroundColor: 'transparent',
    },
    flagContainer: {
      backgroundColor: 'transparent',
    },
    callingCode: {
      fontSize: 16,
      color: '#000',
      fontWeight: '700' as const,
    },
    input: {
      color: '#000',
      fontSize: 16,
    },
  },
};

export const modalContainerStyle = {
  modalStyles: {
    modal: {
      paddingTop: 24,
      backgroundColor: 'white',
    },
    countryButton: {
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: '#F3F3F3',
      backgroundColor: 'white',
    },
    callingCode: {
      color: '#000',
    },
    countryName: {
      color: '#000',
    },
    noCountryText: {
      color: '#000',
    },
    sectionTitle: {
      color: '#000',
      marginVertical: 10,
    },
  },
};
