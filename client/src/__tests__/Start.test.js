import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { create } from 'react-test-renderer';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../../src/App';
import Login from '../components/Start';
import Lobby from '../components/Lobby';

const onClick = jest.fn();
const mockHandleClick = jest.fn();
const onSearchMock = jest.fn();
const onSubmit = jest.fn();

configure({ adapter: new Adapter() });
render(<App />);

afterEach(cleanup);

describe('Start component', () => {
  it('matches the snapshot', () => {
    const start = create(<Login />);
    expect(start.toJSON()).toMatchSnapshot();
  });

  it('renders input field for user Id', () => {
    const { getByTestId } = render(<Login />);
    const input = getByTestId('userIdInput');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange prop with input value', () => {
    const setup = () => {
      const utils = render(<Login />);
      const input = utils.getByTestId('userIdInput');
      return {
        input,
        ...utils
      }
    }

    const { input } = setup();
    fireEvent.change(input, { target: { value: 'player'} });
    expect(input.value).toBe('player');
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