import * as React from 'react';
import renderer from 'react-test-renderer';
import { it, expect } from '@jest/globals';

import { MonoText } from '../StyledText';

it(`renders correctly`, () => {
  const tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON();

  expect(tree).toMatchSnapshot();
});
