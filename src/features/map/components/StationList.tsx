import { memo } from 'react';
import { StationItem } from './StationItem';
import { StationListProps } from '../types';

/** List of nearby polling stations. */
const StationListComponent = ({ stations, selectedId, onSelect }: StationListProps) => {
  return (
    <div className="station-list" aria-label="Nearby polling stations">
      <div className="station-list-title">🗳️ Nearby Polling Stations</div>
      {stations.map((station) => (
        <StationItem
          key={station.id}
          station={station}
          isSelected={selectedId === station.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export const StationList = memo(StationListComponent);
