import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import Lobby from './components/Lobby';

afterEach(cleanup);

it("renders table", () => {
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
});