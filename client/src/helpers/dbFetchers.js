
import Constants from "expo-constants";
const apiUrl = Constants.expoConfig.extra.apiUrl;
const userId = Constants.expoConfig.extra.userId;

export default class DbFetchers {
    //get item details from server by its barcode
    fetchItemDetails = async (item_barcode) => {
        try {
            //TODO const response = await fetch(`${apiUrl}/items/barcode/${item_barcode}`, {
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

    fetch_payments_by_customer_id = async () => {
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
}
