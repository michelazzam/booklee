import { StyleSheet, View, Keyboard } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';

import { UserServices, type UpdateUserReqType } from '~/src/services';

import { validateUpdateUser, ValidationResultType } from '~/src/helper/validation';
import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { AwareScrollView, HeaderNavigation } from '~/src/components/base';
import { Input } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';
import { PhotoPicker } from '~/src/components/utils';

export const EditPersonalInfoPage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { data: userData } = UserServices.useGetMe();
  const { mutate: updateUser, isPending: isUpdatePending } = UserServices.useUpdateUser();

  /***** Refs *****/
  const data = useRef<UpdateUserReqType>({
    image: userData?.user?.image || null,
    lastName: userData?.user?.lastName || '',
    firstName: userData?.user?.firstName || '',
  });

  /*** States ***/
  const [selectedImage, setSelectedImage] = useState<string | null>(userData?.user?.image || null);
  const [validationErrors, setValidationErrors] = useState<ValidationResultType<UpdateUserReqType>>(
    {
      success: false,
    }
  );

  const onTextChange = (text: string, field: keyof UpdateUserReqType) => {
    data.current[field] = text;

    setValidationErrors((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: undefined },
    }));
  };
  const handleSave = async () => {
    Keyboard.dismiss();
    setValidationErrors({ success: true });

    const { success, errors } = await validateUpdateUser(data.current);
    console.log('data.current', data.current);
    console.log('errors', errors);
    if (!success && errors) {
      setValidationErrors({ success: false, errors });
      return;
    }

    updateUser(data.current, {
      onSuccess: () => {
        router.back();
      },
      onError: (error: any) => {
        console.error('Update error:', error);
        Toast.error('Failed to update personal information');
      },
    });
  };

  return (
    <>
      <HeaderNavigation title="Edit Personal Info" />

      <AwareScrollView contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        <PhotoPicker
          style={{ alignSelf: 'center' }}
          onSelect={(image) => setSelectedImage(image.uri)}
          initialImage={
            selectedImage
              ? { uri: selectedImage, name: 'image.jpg', type: 'image/jpeg' }
              : undefined
          }
        />
        <View style={styles.formSection}>
          <Input
            label="First Name*"
            placeholder="John"
            value={data.current.firstName}
            error={validationErrors.errors?.firstName}
            onChangeText={(value) => onTextChange(value, 'firstName')}
          />

          <Input
            label="Last Name*"
            placeholder="Doe"
            value={data.current.lastName}
            error={validationErrors.errors?.lastName}
            onChangeText={(value) => onTextChange(value, 'lastName')}
          />
        </View>

        <Button title="Save Changes" onPress={handleSave} isLoading={isUpdatePending} />
      </AwareScrollView>
    </>
  );
};

export default EditPersonalInfoPage;

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
