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

/* it("renders table", () => {
  const { container, getByTestId } = render(<Lobby />);
  expect(getByTestId('table')).toBeInTheDocument();
  expect(container.firstChild).toMatchSnapshot(`
    <TableHead>
      <TableRow>
        <TableCell>No.</TableCell>
        <TableCell>Player</TableCell>
        <TableCell>Play</TableCell>
        <TableCell>Delete</TableCell>
      </TableRow>
    </TableHead>
  `);
});

it("renders buttons", () => {
  const { getByTestId } = render(<Lobby />);
  const buttons = getByTestId('buttons');
  expect(buttons).toBeInTheDocument();
  expect(buttons.firstChild.textContent).toBe('Create a new match');
}); */