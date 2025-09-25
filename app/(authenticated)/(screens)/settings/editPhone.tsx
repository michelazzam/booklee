import { StyleSheet, View, Keyboard } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { UserServices, type UpdateUserReqType } from '~/src/services';

import { validateUpdateUser, ValidationResultType } from '~/src/helper/validation';
import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { AwareScrollView, HeaderNavigation } from '~/src/components/base';
import { PhoneInput } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';

export const EditPhonePage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { data: userData } = UserServices.useGetMe();
  const { mutate: updateUser, isPending: isUpdatePending } = UserServices.useUpdateUser();

  /*** States ***/
  const [validationErrors, setValidationErrors] = useState<ValidationResultType<UpdateUserReqType>>(
    {
      success: false,
    }
  );
  const [data, setData] = useState<UpdateUserReqType>({
    phone: userData?.user?.phone || '',
  });

  useEffect(() => {
    if (!userData) return;

    const { phone } = userData?.user;

    setData({
      phone: phone || '',
    });
  }, [userData]);

  const onTextChange = (text: string, field: keyof UpdateUserReqType) => {
    setData((prev) => ({
      ...prev,
      [field]: text,
    }));

    setValidationErrors((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: undefined },
    }));
  };
  const handleSave = async () => {
    Keyboard.dismiss();
    setValidationErrors({ success: true });

    const { success, errors } = await validateUpdateUser(data);
    if (!success && errors) {
      setValidationErrors({ success: false, errors });
      return;
    }

    updateUser(data, {
      onSuccess: () => {
        router.back();
      },
      onError: (error: any) => {
        console.error('Update error:', error);
        Toast.error('Failed to update phone number');
      },
    });
  };

  return (
    <>
      <HeaderNavigation title="Edit Phone Number" />

      <AwareScrollView contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        <View style={styles.formSection}>
          <PhoneInput
            value={data.phone}
            error={validationErrors.errors?.phone}
            placeholder="Enter your phone number"
            onChangeText={(value: string) => onTextChange(value, 'phone')}
          />
        </View>

        <Button title="Save Changes" onPress={handleSave} isLoading={isUpdatePending} />
      </AwareScrollView>
    </>
  );
};

export default EditPhonePage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white[100],
  },
  formSection: {
    flex: 1,
    gap: theme.spacing.xl,
  },
});
