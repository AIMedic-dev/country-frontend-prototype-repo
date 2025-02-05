export const sendMessage = async (message: string) => {
  try {
    const response = await fetch('https://ia-hope-0.azurewebsites.net/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message, init: false }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
