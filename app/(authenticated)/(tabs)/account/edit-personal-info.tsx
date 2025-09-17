import { StyleSheet, View, Keyboard } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { UserServices } from '~/src/services';
import { theme } from '~/src/constants/theme';
import { useAppSafeAreaInsets } from '~/src/hooks';

import { AwareScrollView, HeaderNavigation } from '~/src/components/base';
import { Input } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';
import { Wrapper } from '~/src/components/utils/UI';

type UpdateUserReqType = {
  firstName?: string;
  lastName?: string;
  image?: string | null;
};

export const EditPersonalInfoPage = () => {
  /*** Constants ***/
  const { bottom } = useAppSafeAreaInsets();
  const router = useRouter();
  const { user } = UserServices.useGetUser();
  const { mutate: updateUser, isPending: isUpdatePending } = UserServices.useUpdateUser();

  /***** Refs *****/
  const data = useRef<UpdateUserReqType>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    image: user?.image || null,
  });

  /*** States ***/
  const [validationErrors, setValidationErrors] = useState<{
    success: boolean;
    errors?: Partial<UpdateUserReqType>;
  }>({
    success: false,
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(user?.image || null);

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

    // Basic validation - only validate name fields for users with role "user"
    const errors: Partial<UpdateUserReqType> = {};

    if (user?.role === 'user') {
      if (!data.current.firstName?.trim()) {
        errors.firstName = 'First name is required';
      }

      if (!data.current.lastName?.trim()) {
        errors.lastName = 'Last name is required';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors({ success: false, errors });
      return;
    }

    updateUser(data.current, {
      onSuccess: () => {
        Toast.success('Personal information updated successfully');
        router.back();
      },
      onError: (error: any) => {
        console.error('Update error:', error);
        Toast.error('Failed to update personal information');
      },
    });
  };

  return (
    <Wrapper style={{ backgroundColor: theme.colors.white[100], flex: 1 }}>
      <HeaderNavigation title="Edit Personal Info" />

      <AwareScrollView contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            {selectedImage ? (
              <View style={styles.imageWrapper}>
                {/* You can add an Image component here to display the selected image */}
                <View style={styles.placeholderImage}>
                  {/* Placeholder for image - replace with actual Image component */}
                </View>
              </View>
            ) : (
              <View style={styles.placeholderImage}>{/* Default placeholder */}</View>
            )}
          </View>
          <Button
            title="Change Photo"
            variant="outline"
            onPress={handleImagePicker}
            containerStyle={styles.changePhotoButton}
          />
        </View>

        {/* Form Fields - Only show for users with role "user" */}
        {user?.role === 'user' && (
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
        )}

        <Button
          title="Save Changes"
          onPress={handleSave}
          isLoading={isUpdatePending}
          containerStyle={styles.saveButton}
        />
      </AwareScrollView>
    </Wrapper>
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
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: theme.colors.border,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.grey[10],
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    width: 'auto',
    paddingHorizontal: theme.spacing.lg,
  },
  formSection: {
    gap: theme.spacing.xl,
  },
  saveButton: {
    marginTop: theme.spacing.xl,
  },
});
