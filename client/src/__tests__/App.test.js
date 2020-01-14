import React from 'react';
import { mount, configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'; 
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import App from '../App';
import Start from '../components/Start';
import Lobby from '../components/Lobby';

configure({adapter: new Adapter()});
render(<App />);

describe('App component', () => {
  it('snapshot renders', () => {
    const { component } = render(<App />);
    expect(component).toMatchSnapshot();
  });

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
});
