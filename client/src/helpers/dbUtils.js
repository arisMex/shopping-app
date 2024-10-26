import * as SQLite from 'expo-sqlite';

import Constants from "expo-constants";
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

export default class DbUtils {
    db;

    init = async () => {
        this.db = await SQLite.openDatabaseAsync("cart.db");
        await this.createTable();
    }


    //shopping cart
    createTable = async () => {
        if (this.db) {
            // Vérifiez d'abord si la table existe
            const result = await this.db.getAllAsync(`
                SELECT name FROM sqlite_master WHERE type='table' AND name='cart';
            `);

            // Si la table n'existe pas, créez-la
            if (result.length === 0) {
                await this.db.execAsync(`
                    CREATE TABLE cart (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        price REAL,
                        quantity INTEGER,
                        barcode TEXT
                    );
                `);
                console.log("Table 'cart' créée avec succès.");
            }
        } else {
            console.log("Database is not initialized.");
        }
    };


    getCartItems = async () => {
        if (this.db) {
            const result = await this.db.getAllAsync('SELECT * FROM cart');
            return result;
        }
        return [];
    };



    fillTest = async () => {
        return await this.addItem("banana", 2000, "0000");
    }

    addItem = async (name, price, barcode) => {
        if (this.db) {
            const result = await this.db.getAllAsync('SELECT * FROM cart WHERE barcode = ?', [barcode]);
            console.log(result);

            if (result.length > 0) {
                response = await this.db.runAsync('UPDATE cart SET quantity = quantity + 1 WHERE barcode = ?', [barcode]);
            } else {
                await this.db.runAsync('INSERT INTO cart (name, price, quantity, barcode) VALUES (?, ?, ?, ?)', [name, price, 1, barcode]);
            }
        }
    };

    removeItem = async (barcode) => {
        if (this.db) {
            try {
                const result = await this.db.getAllAsync('SELECT * FROM cart WHERE barcode = ?', [barcode]);

                if (result.length > 0) {
                    await this.db.runAsync('DELETE FROM cart WHERE barcode = ?', [barcode]);
                    console.log(`Article avec le code-barres ${barcode} a été supprimé.`);
                } else {
                    console.log(`Aucun article trouvé avec le code-barres ${barcode}.`);
                }
            } catch (error) {
                console.log("Erreur lors de la suppression de l'article:", error);
            }
        } else {
            console.log("Database is not initialized.");
        }
    };


    increaseQuantity = async (id) => {
        if (this.db) {
            await this.db.runAsync('UPDATE cart SET quantity = quantity + 1 WHERE id = ?', [id]);
        }
    };

    decreaseQuantity = async (id, quantity) => {
        if (this.db && quantity > 1) {
            await this.db.runAsync('UPDATE cart SET quantity = quantity - 1 WHERE id = ?', [id]);
        } else {
            await this.db.runAsync('DELETE FROM cart WHERE id = ?', [id]);
        }
    };

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

    fetch_payments_by_customer_id = async (user_id) => {
        try {
            const response = await fetch(`${apiUrl}/payments/${user_id}`, {
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


