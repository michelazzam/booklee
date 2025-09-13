import React, { useRef, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';
import { Icon, Text } from '~/src/components/base';
import { SearchServices, type SearchHistoryItem } from '~/src/services';
import CustomSearchInput from './CustomSearchInput';
import ModalWrapper, { type ModalWrapperRef } from './ModalWrapper';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
  onSearch,
  initialQuery = '',
}) => {
  /*** Constants ***/
  const { top, bottom } = useAppSafeAreaInsets();
  const modalRef = useRef<ModalWrapperRef>(null);

  /*** States ***/
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  /*** Data Fetching ***/
  const { data: searchHistory } = SearchServices.useGetSearchHistory();
  const { data: searchResults, isLoading: isSearching } = SearchServices.useSearchLocations(
    { query: debouncedQuery, limit: 10 },
    debouncedQuery.length >= 2
  );

  /*** Effects ***/
  useEffect(() => {
    if (visible) {
      modalRef.current?.present();
      setSearchQuery(initialQuery);
    } else {
      modalRef.current?.dismiss();
    }
  }, [visible, initialQuery]);

  /*** Handlers ***/
  const handleDebouncedSearch = useCallback((query: string) => {
    setDebouncedQuery(query);
  }, []);

  const handleHistoryItemPress = useCallback(
    (item: SearchHistoryItem) => {
      onSearch(item.query);
      onClose();
    },
    [onSearch, onClose]
  );

  const handleSearchResultPress = useCallback(
    (item: any) => {
      onSearch(item.name);
      onClose();
    },
    [onSearch, onClose]
  );

  // Updated handleClose to ensure modal dismisses properly
  const handleClose = useCallback(() => {
    modalRef.current?.dismiss();
    onClose();
  }, [onClose]);

  /*** Render Functions ***/
  const renderHistoryItem = useCallback(
    ({ item }: { item: SearchHistoryItem }) => (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => handleHistoryItemPress(item)}
        activeOpacity={0.7}>
        <View style={styles.historyItemContent}>
          <Icon name="store" size={20} color={theme.colors.lightText} />
          <Text style={styles.historyItemText} color={theme.colors.darkText[100]} weight="medium">
            {item.query}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [handleHistoryItemPress]
  );

  const renderEmptyHistory = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text color={theme.colors.lightText} weight="medium">
          No recent searches
        </Text>
      </View>
    ),
    []
  );

  const renderSearchResult = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => handleSearchResultPress(item)}
        activeOpacity={0.7}>
        <View style={styles.historyItemContent}>
          <Icon name="store" size={20} color={theme.colors.lightText} />
          <View style={styles.searchResultTextContainer}>
            <Text style={styles.historyItemText} color={theme.colors.darkText[100]} weight="medium">
              {item.name}
            </Text>
            {item.city && (
              <Text
                style={styles.searchResultSubtext}
                color={theme.colors.lightText}
                weight="regular">
                {item.city}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handleSearchResultPress]
  );

  // Create the back button component separately for better control
  const BackButton = useCallback(
    () => (
      <TouchableOpacity
        onPress={handleClose}
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touch area
      >
        <Icon name="arrow-left" size={24} color={theme.colors.darkText[100]} />
      </TouchableOpacity>
    ),
    [handleClose]
  );

  return (
    <ModalWrapper
      ref={modalRef}
      snapPoints={['100%']}
      onDismiss={handleClose} // Make sure this calls handleClose
      leadingIcon={<BackButton />}
      contentContainerStyle={styles.contentContainer}>
      <View style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <CustomSearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onDebouncedSearch={handleDebouncedSearch}
            placeholder="Store, location, or service"
            autoFocus
            debounceTime={800}
          />
        </View>

        {/* Search Results Section */}
        {searchQuery.length >= 2 && (
          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
              color={theme.colors.darkText[100]}
              weight="medium"
              size={theme.typography.fontSizes.lg}>
              {isSearching ? 'Searching...' : 'Search Results'}
            </Text>
            {searchResults && searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            ) : !isSearching && debouncedQuery.length >= 2 ? (
              <View style={styles.emptyContainer}>
                <Text color={theme.colors.lightText} weight="medium">
                  No results found for "{debouncedQuery}"
                </Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Recent Searches Section - Only show when no search query */}
        {searchQuery.length < 2 && searchHistory && searchHistory.length > 0 && (
          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
              color={theme.colors.darkText[100]}
              weight="medium"
              size={theme.typography.fontSizes.lg}>
              Your Recent Searches
            </Text>
            <FlatList
              data={searchHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item, index) => `${item.query}-${index}`}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Empty State for History - Only show when no search query */}
        {searchQuery.length < 2 && searchHistory && searchHistory.length === 0 && (
          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
              color={theme.colors.darkText[100]}
              weight="medium"
              size={theme.typography.fontSizes.lg}>
              Your Recent Searches
            </Text>
            {renderEmptyHistory()}
          </View>
        )}
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  backButton: {
    padding: theme.spacing.sm,
    // Add some additional styling to ensure proper touch handling
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  historyItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  historyItemText: {
    flex: 1,
  },
  searchResultTextContainer: {
    flex: 1,
  },
  searchResultSubtext: {
    fontSize: theme.typography.fontSizes.sm,
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
});
