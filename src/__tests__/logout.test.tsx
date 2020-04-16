import React from 'react';

import Logout from '../pages/logout';
import { render } from '@testing-library/react';

it('renders Logout without crashing', () => {
  const { getByText } = render(<Logout />);
  getByText('Logout');
});
