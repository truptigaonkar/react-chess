import React from 'react';
import { mount, configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'; 
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import App from '../App';
import Start from '../components/Start';
import Lobby from '../components/Lobby';
import Game from '../components/Game';

configure({adapter: new Adapter()});
render(<App />);

describe('App component', () => {
  it('renders Start component on root', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/' ]}>
        <App />
      </MemoryRouter>
    );
    expect(wrapper.find(Start)).toHaveLength(1);
  });

  it('routes /lobby to Lobby', () => {
    const component = shallow(<App />);
    expect(component.find('Route[path="/lobby"]').first().prop('component')).toBe(Lobby);
  });

  it('routes /game to Game', () => {
    const component = shallow(<App />);
    expect(component.find('Route[path="/game"]').first().prop('component')).toBe(Game);
  });

  /* it('renders Lobby component', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/lobby' ]}>
        <App />
      </MemoryRouter>
    );
    expect(wrapper.find(Lobby)).toHaveLength(1);
  });

  it('renders Lobby component', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/game' ]}>
        <App />
      </MemoryRouter>
    );
    expect(wrapper.find(Game)).toHaveLength(1);
  }); */
});
