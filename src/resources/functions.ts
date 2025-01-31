export const sendMessage = async (message: string) => {
  try {
    const response = await fetch(
      'https://accesos-ia.azurewebsites.net/query_rag',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message }),
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
