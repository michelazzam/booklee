import { StyleSheet, View, Keyboard } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { Toast } from 'toastify-react-native';
import { useRouter } from 'expo-router';

import { UserServices, type UpdateUserReqType } from '~/src/services';

import { validateUpdateUser, ValidationResultType } from '~/src/helper/validation';
import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { AwareScrollView, HeaderNavigation } from '~/src/components/base';
import { PhotoPicker, type ImageType } from '~/src/components/utils';
import { Input } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';

export const EditPersonalInfoPage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { data: userData } = UserServices.useGetMe();
  const { mutate: updateUser, isPending: isUpdatePending } = UserServices.useUpdateUser();
  const { mutate: updateUserImage, isPending: isUpdateUserImagePending } =
    UserServices.useUpdateUserImage();

  /*** States ***/
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationResultType<UpdateUserReqType>>(
    {
      success: false,
    }
  );
  const [data, setData] = useState<UpdateUserReqType>({
    lastName: userData?.user?.lastName || '',
    firstName: userData?.user?.firstName || '',
  });

  /*** Memoization ***/
  const isDataChanged = useMemo(() => {
    const { lastName, firstName } = data;
    const { lastName: lastNameUser, firstName: firstNameUser } = userData?.user || {};
    return lastName !== lastNameUser || firstName !== firstNameUser;
  }, [data, userData]);

  useEffect(() => {
    if (!userData) return;

    const { lastName, firstName, image } = userData?.user;

    if (image) {
      setSelectedImage({ uri: image, name: 'image.jpg', type: 'image/jpeg' });
    }

    if (lastName && firstName) {
      setData({
        lastName,
        firstName,
      });
    }
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

    if (selectedImage) {
      updateUserImage(selectedImage, {
        onSuccess: () => {
          if (!isDataChanged) {
            router.back();
          }
        },
        onError: (error: any) => {
          console.error('Update error:', error);
          Toast.error('Failed to update your profile image');
        },
      });
    }

    if (isDataChanged) {
      updateUser(data, {
        onSuccess: () => {
          router.back();
        },
        onError: (error: any) => {
          console.error('Update error:', error);
          Toast.error('Failed to update personal information');
        },
      });
    }
  };

  return (
    <>
      <HeaderNavigation title="Edit Personal Info" />

      <AwareScrollView contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        <PhotoPicker
          style={{ alignSelf: 'center' }}
          onSelect={(image) => setSelectedImage(image)}
          initialImage={selectedImage ? selectedImage : undefined}
        />

        <View style={styles.formSection}>
          <Input
            label="First Name"
            placeholder="John"
            value={data.firstName}
            error={validationErrors.errors?.firstName}
            onChangeText={(value) => onTextChange(value, 'firstName')}
          />

          <Input
            label="Last Name"
            placeholder="Doe"
            value={data.lastName}
            error={validationErrors.errors?.lastName}
            onChangeText={(value) => onTextChange(value, 'lastName')}
          />
        </View>

        <Button
          title="Save Changes"
          onPress={handleSave}
          isLoading={isUpdatePending || isUpdateUserImagePending}
        />
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
