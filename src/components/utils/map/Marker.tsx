import { Marker as MapMarker } from 'react-native-maps';

export type MarkerDataType = {
  _id: string;
  rating: number;
  latitude: number;
  longitude: number;
};

type MarkerProps = {
  data: MarkerDataType;
  onPress: (_id: string) => void;
};

const Marker = ({ data, onPress }: MarkerProps) => {
  const { _id, rating, latitude, longitude } = data;

  return (
    <MapMarker
      pinColor="red"
      onPress={() => onPress(_id)}
      coordinate={{ latitude, longitude }}
      title={`Rating: ${rating.toFixed(1)}`}
    />
  );
};

export default Marker;
