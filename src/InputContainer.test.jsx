import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { render, fireEvent } from '@testing-library/react';

import InputContainer from './InputContainer';

import { changeTitle, addTask } from './action';

jest.mock('react-redux');

describe('<InputContainer />', () => {
  context('When the user does nothing', () => {
    it('shows "할 일을 입력해 주세요"', () => {
      useSelector.mockImplementation((selector) => selector({
        taskTitle: '',
      }));

      const { getByPlaceholderText } = render(<InputContainer />);

      expect(
        getByPlaceholderText(/할 일을 입력해 주세요/i),
      ).toBeInTheDocument();
    });

    it('shows a "추가" button', () => {
      const { container } = render(<InputContainer />);

      expect(container).toHaveTextContent('추가');
    });
  });

  context('When a user enters a task called "바뀐다"', () => {
    it('shows "바뀐다" in the input', () => {
      useSelector.mockImplementation((selector) => selector({}));

      const dispatch = jest.fn();

      useDispatch.mockImplementation(() => dispatch);

      const { getByLabelText } = render(<InputContainer />);

      fireEvent.change(getByLabelText(/할 일/i), {
        target: {
          value: '바뀐다',
        },
      });

      expect(getByLabelText(/할 일/i).value).toBe('바뀐다');

      expect(dispatch).toHaveBeenCalledWith(changeTitle('바뀐다'));

      expect(dispatch).toHaveBeenCalledTimes(1);
    });
  });

  context('when a user add a task called "할 일4"', () => {
    it('clear task title', () => {
      useSelector.mockImplementation((selector) => selector({
        taskTitle: '할 일4',
      }));

      const { getByLabelText, getByText, getByPlaceholderText } = render(
        <InputContainer />,
      );

      const inputTodo = getByLabelText(/할 일/i);

      fireEvent.change(inputTodo, { target: { value: '할 일4' } });

      fireEvent.click(getByText(/추가/i));

      expect(
        getByPlaceholderText(/할 일을 입력해 주세요/i),
      ).toBeInTheDocument();
    });

    it('occurs a addTask action', () => {
      useSelector.mockImplementation((selector) => selector({
        taskTitle: '할 일4',
      }));

      const dispatch = jest.fn();

      useDispatch.mockImplementation(() => dispatch);

      const { getByLabelText, getByText } = render(<InputContainer />);

      const inputTodo = getByLabelText(/할 일/i);

      fireEvent.change(inputTodo, { target: { value: '할 일4' } });

      fireEvent.click(getByText(/추가/i));

      expect(dispatch).toHaveBeenCalledWith(addTask());

      expect(dispatch).toHaveBeenCalledTimes(1);
    });
  });
});
