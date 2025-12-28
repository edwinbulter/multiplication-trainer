import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../../src/components/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('react-native-haptic-feedback');

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    expect(getByText('Multiplication Trainer')).toBeTruthy();
    expect(getByText('Voer je naam in om te beginnen')).toBeTruthy();
    expect(getByPlaceholderText('Jouw naam')).toBeTruthy();
  });

  it('shows error when submitting empty name', async () => {
    const mockAlert = jest.spyOn(Alert, 'alert');
    const { getByText } = render(<LoginScreen />);
    
    // Button should be disabled when username is empty
    const startButton = getByText('Start');
    expect(startButton).toBeDisabled();
    
    // Press the disabled button (should not trigger alert)
    fireEvent.press(startButton);
    
    // Alert should not have been called since button is disabled
    expect(mockAlert).not.toHaveBeenCalled();
  });

  it('saves username and navigates on successful login', async () => {
    const mockNavigation = { replace: jest.fn() };
    AsyncStorage.setItem.mockResolvedValue();
    
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Jouw naam'), 'John');
    fireEvent.press(getByText('Start'));
    
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('username', 'John');
      expect(mockNavigation.replace).toHaveBeenCalledWith('TableSelection');
    });
  });
});