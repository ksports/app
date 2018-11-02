import * as React from 'react';
import { Consumer } from '../context';
import { View } from 'react-native';
import styled from '@sampettersson/primitives';
import { Delayed } from 'src/components/Delayed';

import { Data } from './data';
import { SearchBar } from './search-bar';

const PickerContainer = styled(View)(({ isOpen }: { isOpen: boolean }) => ({
  height: isOpen ? 250 : 0,
  width: '100%',
}));

interface PickerProps {
  sendMessage: (message: string) => void;
}

export const Picker: React.SFC<PickerProps> = ({ sendMessage }) => (
  <Consumer>
    {({ isOpen, setIsOpen }) => (
      <PickerContainer blurType="xlight" isOpen={isOpen}>
        <Delayed
          mountChildren={isOpen}
          unmountChildrenAfter={30000}
          mountChildrenAfter={0}
        >
          <SearchBar>
            {(dataQuery) => (
              <Data
                query={dataQuery}
                onImagePress={(url) => {
                  setIsOpen(false);
                  sendMessage(url);
                }}
              />
            )}
          </SearchBar>
        </Delayed>
      </PickerContainer>
    )}
  </Consumer>
);
