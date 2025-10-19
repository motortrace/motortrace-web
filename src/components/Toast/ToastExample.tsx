// Example usage of the universal toast system
import { useToast } from '../../hooks/useToast';

function ExampleComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast('success', 'Operation Successful', 'Your data has been saved successfully!');
  };

  const handleError = () => {
    showToast('error', 'Operation Failed', 'Something went wrong. Please try again.');
  };

  const handleInfo = () => {
    showToast('info', 'Information', 'This is an informational message.');
  };

  const handleWarning = () => {
    showToast('warning', 'Warning', 'Please be careful with this action.');
  };

  const handleCustomColor = () => {
    showToast('success', 'Custom Color', 'This toast has a custom color!', '#ff6b6b');
  };

  const handleLongDuration = () => {
    showToast('info', 'Long Toast', 'This toast stays for 10 seconds.', undefined, 10000);
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success Toast</button>
      <button onClick={handleError}>Show Error Toast</button>
      <button onClick={handleInfo}>Show Info Toast</button>
      <button onClick={handleWarning}>Show Warning Toast</button>
      <button onClick={handleCustomColor}>Show Custom Color Toast</button>
      <button onClick={handleLongDuration}>Show Long Duration Toast</button>
    </div>
  );
}

export default ExampleComponent;