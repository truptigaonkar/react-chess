import React from 'react';
<<<<<<< HEAD
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
=======
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
>>>>>>> backend
