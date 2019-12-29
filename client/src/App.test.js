import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import Login from './components/Login';

afterEach(cleanup);

it("renders Enter button", () => {
  const { getByTestId } = render(<Login />);
  const button = getByTestId('button');
  expect(button).toBeInTheDocument();
  expect(button.textContent).toBe('Enter');
});