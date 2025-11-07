import { StyleSheet, Keyboard } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useRef, useState } from 'react';

import { type UpdateUserReqType, UserServices } from '~/src/services';

import { ValidationResultType, validateUpdateUser } from '~/src/helper/validation';
import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { AwareScrollView, HeaderNavigation } from '~/src/components/base';
import { PhoneInput } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';

export const PhoneNumberPage = () => {
  /*** Constants ***/
  const { bottom } = useAppSafeAreaInsets();
  const { mutate: updateProfile, isPending } = UserServices.useUpdateUser();

  /***** Refs *****/
  const phoneNumber = useRef<string>('');

  /*** States ***/
  const [validationErrors, setValidationErrors] = useState<
    ValidationResultType<UpdateUserReqType> | undefined
  >(undefined);

  const onTextChange = (text: string) => {
    phoneNumber.current = text;
    setValidationErrors(undefined);
  };
  const handleSubmit = async () => {
    Keyboard.dismiss();
    setValidationErrors(undefined);

    if (!phoneNumber.current) {
      setValidationErrors({ success: false, errors: { phone: 'Phone is required' } });
      return;
    }

    const { success, errors } = await validateUpdateUser({ phone: phoneNumber.current });
    if (!success && errors) {
      setValidationErrors({ success: false, errors });
      return;
    }

    updateProfile(
      { phone: phoneNumber.current },
      {
        onError: (error) => {
          Toast.error(error.message || 'There was an error saving your phone number');
        },
      }
    );
  };

  return (
    <>
      <HeaderNavigation title="Phone Number" />

      <AwareScrollView contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        <PhoneInput
          isRequired
          onChangeText={onTextChange}
          placeholder="Enter phone number"
          error={validationErrors?.errors?.phone}
        />

        <Button
          title="Continue"
          isLoading={isPending}
          onPress={handleSubmit}
          containerStyle={{ marginTop: theme.spacing.xl }}
        />
      </AwareScrollView>
    </>
  );
};

export default PhoneNumberPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
});
