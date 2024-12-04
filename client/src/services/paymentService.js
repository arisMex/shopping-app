import Constants from "expo-constants";

const apiUrl = Constants.expoConfig.extra.apiUrl;
const userId = Constants.expoConfig.extra.userId;
const publishableKey = Constants.expoConfig.extra.stripePK;

// Récupération des paramètres nécessaires pour Stripe
export const fetchPaymentSheetParams = async (cartItems) => {
    try {
        const response = await fetch(`${apiUrl}/payments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publishableKey}`,
            },
            body: JSON.stringify({
                pending_items: cartItems.map(item => ({
                    id: item.item_id,
                    amount: item.quantity,
                })),
                customer_id: userId,
            }),
        });

        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error fetching payment sheet params:", error);
        Alert.alert("Error", "Failed to initialize payment. Please try again later.");
        return {};
    }
};

export const checkPayment = async (paymentIntentId) => {
    const paymentIntent = `pi_${paymentIntentId.split("_")[1]}`;
    console.log("checking payment for ", paymentIntentId);

    console.log("fetch checkPayment");
    
    
    return await fetch(`${apiUrl}/payments/check/${paymentIntent}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "customer_id": userId
        })
    });
};

export const fetchItemDetails = async (item_barcode) => {
    try {
      const response = await fetch(`${apiUrl}/items/barcode/${item_barcode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { id, name, price, barcode } = await response.json();

      return { id, name, price, barcode };
    } catch (error) {
      console.log('Error fetching item details:', error);
      return null;
    }
};

export const fetchPaymentsByCustomerId = async () => {
    try {
      console.log("fetching payements for ", userId, apiUrl);

      const response = await fetch(`${apiUrl}/payments/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      return result;
    } catch (error) {
      console.log('Error fetching item details:', error);
      return null;
    }
  };