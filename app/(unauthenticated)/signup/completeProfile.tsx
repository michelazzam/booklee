import { StyleSheet, View, Keyboard } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { AuthServices, UserServices, type UpdateUserReqType } from '~/src/services';

import { validateUpdateUser, type ValidationResultType } from '~/src/helper/validation';
import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { AwareScrollView, HeaderNavigation } from '~/src/components/base';
import { Input, PhoneInput } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';

export const CompleteProfilePage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { data: userData } = AuthServices.useGetMe();
  const { mutate: updateUser, isPending: isUpdatePending } = UserServices.useUpdateUser();

  /*** States ***/
  const [validationErrors, setValidationErrors] = useState<ValidationResultType<UpdateUserReqType>>(
    {
      success: false,
    }
  );
  const [data, setData] = useState<UpdateUserReqType>({
    phone: userData?.phone || '',
    lastName: userData?.lastName || '',
    firstName: userData?.firstName || '',
  });

  const onTextChange = (text: string, field: keyof UpdateUserReqType) => {
    setData((prev) => ({
      ...prev,
      [field]: text,
    }));

    setValidationErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };
  const handleCompleteProfile = async () => {
    Keyboard.dismiss();
    setValidationErrors({ success: false });

    const { success, errors } = await validateUpdateUser(data);
    if (!success && errors) {
      setValidationErrors({ success: false, errors });
      return;
    }

    updateUser(data, {
      onSuccess: () => {
        router.replace('/(authenticated)/(tabs)');
      },
      onError: (error: any) => {
        Toast.error(error?.message || 'Failed to update profile');
      },
    });
  };

  return (
    <>
      <HeaderNavigation title="Complete Your Profile" />

      <AwareScrollView contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        <View style={styles.nameContainer}>
          <Input
            inputWidth="48%"
            label="First Name*"
            value={data.firstName}
            placeholder="Enter first name"
            error={validationErrors.errors?.firstName}
            onChangeText={(value) => onTextChange(value, 'firstName')}
          />

          <Input
            inputWidth="48%"
            label="Last Name*"
            value={data.lastName}
            placeholder="Enter last name"
            error={validationErrors.errors?.lastName}
            onChangeText={(value) => onTextChange(value, 'lastName')}
          />
        </View>

        <PhoneInput
          isRequired
          value={data.phone}
          placeholder="Enter phone number"
          error={validationErrors.errors?.phone}
          onChangeText={(value) => onTextChange(value, 'phone')}
        />

        <Button
          title="Continue"
          isLoading={isUpdatePending}
          onPress={handleCompleteProfile}
          containerStyle={{ marginTop: theme.spacing.xl }}
        />
      </AwareScrollView>
    </>
  );
};

export default CompleteProfilePage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  nameContainer: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    justifyContent: 'space-between',
  },
});
