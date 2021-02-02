import { render, screen } from '@testing-library/react';
import Gol from '../game-of-life';

test('renders learn react link', () => {
  render(<Gol />);
  const linkElement = screen.getByText(/start/i);
  expect(linkElement).toBeInTheDocument();
});
