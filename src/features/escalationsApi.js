import { baseUrl } from "../features/config";

export const createEscalationApi = async (formData) => {
  try {
    const response = await fetch(`${baseUrl}/api/escalations/upload`, {
      method: 'POST',
      body: formData,
    
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit escalation');
    }

    const data = await response.json();
    alert("Escalation submitted successfully!");
    return data;
    
  } catch (error) {
    console.error('API Error:', error);
    alert(`Error: ${error.message || 'Failed to submit escalation'}`);
   
  }
};

  