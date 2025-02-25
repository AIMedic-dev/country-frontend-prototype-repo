export const sendMessage = async (message: string) => {
  try {
    const response = await fetch(
      'https://general-ia-cancer-assistant.azurewebsites.net/assistant',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
