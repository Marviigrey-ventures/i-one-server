import { LocationCoordinates } from '@app/common';

export class CreateLocationDto {
  name: string;
  address: string;
  location: LocationCoordinates;
}

export class ViewNearbyLocationsDto {
  longitude: string;
  latitude: string;
  maxDistance?: number;
}
