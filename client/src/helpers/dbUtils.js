import * as SQLite from 'expo-sqlite';

import Constants from "expo-constants";
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

export default class DbUtils {
    db;

    init = async () => {
        this.db = await SQLite.openDatabaseAsync("cart.db");
        await this.createTable();
    }

    fillTest = async () => {
        return await this.addItem("banana", 2000, "0000");
    }

    //shopping cart
    createTable = async () => {
        if (this.db) {
            const tableExists = await this.db.getAllAsync(`
                SELECT name FROM sqlite_master WHERE type='table' AND name='cart';
            `);

            if (!tableExists) {
                await this.db.execAsync(`
                  CREATE TABLE cart (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    price REAL,
                    quantity INTEGER,
                    barcode TEXT
                  );`);
            }
        }
    };

    getCartItems = async () => {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.getAllAsync(tx => {
                    tx.executeSql(
                        'SELECT * FROM cart',
                        [],
                        (_, { rows: { _array } }) => {
                            console.log("Items fetched from cart:", _array);
                            resolve(_array); // Return the items array
                        },
                        (txObj, error) => {
                            console.log("Error fetching cart items", error);
                            reject([]);
                        }
                    );
                });
            } else {
                console.log("Database is not initialized.");
                resolve([]);
            }
        });
    };

    addItem = async (name, price, barcode) => {
        if (this.db) {
            return new Promise((resolve, reject) => {
                this.db.getAllAsync(tx => {
                    // Check if the item already exists in the cart
                    tx.executeSql(
                        'SELECT * FROM cart WHERE barcode = ?',
                        [barcode],
                        async (_, { rows }) => {
                            if (rows.length > 0) {
                                // Item already exists, increment the quantity
                                await tx.executeSql(
                                    'UPDATE cart SET quantity = quantity + 1 WHERE barcode = ?',
                                    [barcode]
                                );
                                console.log(`Updated quantity for item: ${name}`);
                            } else {
                                // Item does not exist, insert it
                                await tx.executeSql(
                                    'INSERT INTO cart (name, price, quantity, barcode) VALUES (?, ?, ?, ?)',
                                    [name, price, 1, barcode]
                                );
                                console.log(`Inserted new item: ${name}`);
                            }
                            resolve(); // Resolve the promise after operation
                        },
                        (_, error) => {
                            console.log("Error during select", error);
                            reject(error); // Reject on error
                        }
                    );
                });
            });
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

            const { id, name, price } = await response.json();

            return { id, name, price };
        } catch (error) {
            console.error('Error fetching item details:', error);
            return null;
        }
    };

    // Get item details from server by its barcode
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
            console.error('Error fetching item details:', error);
            return null;
        }
    };


}


