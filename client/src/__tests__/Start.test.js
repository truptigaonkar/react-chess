import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import Login from '../components/Start';

afterEach(cleanup);

describe('Start component', () => {
  it('renders input field for user Id', () => {
    const { getByTestId } = render(<Login />);
    const input = getByTestId('input');
    expect(input).toBeInTheDocument();
  });

  it('renders Enter button', () => {
    const { getByTestId } = render(<Login />);
    const button = getByTestId('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('Enter');
  });
});

describe('save to localStorage', () => {
  it('saves user input to localStorage', () => {
    localStorage.setItem = jest.fn();
    localStorage.getItem = jest.fn(() => 'testUser');

    localStorage.setItem('userId','testUser');
    expect(localStorage.getItem('userId')).toBe('testUser');
  });

  it('saves user input to localStorage', () => {
    localStorage.setItem = jest.fn();
    localStorage.getItem = jest.fn(() => '');

    localStorage.setItem('userId','{test: "test"}');
    expect(localStorage.getItem('userId')).toBe('{test: "test"}');
  });
});
