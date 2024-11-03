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
                        item_id INTEGER,
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

    resetTable = async () => {
        if (this.db) {
            // Check if the table exists
            const result = await this.db.getAllAsync(`
                SELECT name FROM sqlite_master WHERE type='table' AND name='cart';
            `);
    
            // If the table exists, drop it
            if (result.length > 0) {
                await this.db.execAsync(`DROP TABLE IF EXISTS cart;`);
                console.log("Table 'cart' supprimée avec succès.");
            }
    
            // Recreate the table
            await this.db.execAsync(`
                CREATE TABLE cart (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    item_id INTEGER,
                    name TEXT,
                    price REAL,
                    quantity INTEGER,
                    barcode TEXT
                );
            `);
            console.log("Table 'cart' recréée avec succès.");
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

    addItem = async (item_id, name, price, barcode) => {
        if (this.db) {
            const result = await this.db.getAllAsync('SELECT * FROM cart WHERE barcode = ?', [barcode]);
            if (result.length > 0) {
                response = await this.db.runAsync('UPDATE cart SET quantity = quantity + 1 WHERE barcode = ?', [barcode]);
            } else {
                await this.db.runAsync('INSERT INTO cart (item_id, name, price, quantity, barcode) VALUES (?, ?, ?, ?, ?)', [item_id, name, price, 1, barcode]);
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

}


