import { StyleSheet, View, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Toast } from 'toastify-react-native';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { UserServices, type UpdateUserReqType } from '~/src/services';

import { validateUpdateUser, ValidationResultType } from '~/src/helper/validation';
import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { AwareScrollView, HeaderNavigation, Icon } from '~/src/components/base';
import { Input } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';

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
  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        data.current.image = imageUri;
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Toast.error('Failed to pick image');
    }
  };
  const handleSave = async () => {
    Keyboard.dismiss();
    setValidationErrors({ success: true });

    const { success, errors } = await validateUpdateUser(data.current);
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
        <View style={styles.imageSection}>
          {data.current.image ? (
            <Image source={{ uri: data.current.image }} style={styles.imageContainer} />
          ) : (
            <View style={styles.imageIcon}>
              <Icon name="account" size={48} color={theme.colors.darkText[100]} />
            </View>
          )}
        </View>

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

        <Button
          title="Save Changes"
          onPress={handleSave}
          isLoading={isUpdatePending}
          containerStyle={styles.saveButton}
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
  imageSection: {
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  imageIcon: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderRadius: 60,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.colors.border,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: theme.colors.border,
  },
  formSection: {
    flex: 1,
    gap: theme.spacing.xl,
  },
  saveButton: {
    marginTop: theme.spacing.xl,
  },
});
