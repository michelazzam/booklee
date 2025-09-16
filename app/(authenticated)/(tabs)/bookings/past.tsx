import { Text, View, StyleSheet } from 'react-native';

const PastBookingsPage = () => {
  return (
    <View style={styles.container}>
      <Text>Past Bookings</Text>
    </View>
  );
};

export default PastBookingsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
