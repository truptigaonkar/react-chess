import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { create } from 'react-test-renderer';
import Login from '../components/Start';

const onClick = jest.fn();
const mockHandleClick = jest.fn();
const onSearchMock = jest.fn();

afterEach(cleanup);

describe('Start component', () => {
  it('matches the snapshot', () => {
    const start = create(<Login />);
    expect(start.toJSON()).toMatchSnapshot();
  });

  it('renders input field for user Id', () => {
    const { getByTestId } = render(<Login />);
    const input = getByTestId('input');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange prop with input valud', () => {
    const component = mount(<Login />)
  });

  it('renders Enter button', () => {
    const { getByTestId } = render(<Login />);
    const button = getByTestId('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('Enter');
  });

  it('captures clicks', () => {
    const { getByTestId } = render(<Login />);
    const button = getByTestId('button');
    fireEvent.click(button);

    
    /* const handleClick = () => {
      done();
    }
    const { getByTestId } = render(<Login onClick={handleClick} />);
    const button = getByTestId('button');

    const { getByText } = render(
      <Button onClick={handleClick}>Enter</Button>
    );
    const node = getByText('Enter'); 
    fireEvent.click(button);*/
  })
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
