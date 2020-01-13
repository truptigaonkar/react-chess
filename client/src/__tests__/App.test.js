import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import App from '../App';

describe('App component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    const container = getByTestId("container");
    expect(container.children.length).toBe(3);
  });
});
