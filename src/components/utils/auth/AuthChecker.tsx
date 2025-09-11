// import { StyleSheet, Text, View } from 'react-native'
// import { AuthServices } from '~/src/services';

// const AuthChecker = () => {
//   const { data: user, isLoading} = AuthServices.useGetMe();

//   console.log('user', user);
//   console.log('isLoading', isLoading);

//   return (
//     <View>
//       <Text>AuthChecker</Text>
//     </View>
//   )
// }

// export default AuthChecker

// const styles = StyleSheet.create({})

import { Text, View } from 'react-native';
import { authClient } from '~/src/services/auth/auth-client';

const AuthChecker = () => {
  const { data: session, isPending } = authClient.useSession();

  console.log('session', session);
  console.log('isPending', isPending);

  return (
    <View>
      <Text>AuthChecker</Text>
    </View>
  );
};

export default AuthChecker;
