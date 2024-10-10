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
        await this.addItem(2, "apple", 200);
    }

    createTable = async () => {
        if (this.db) {
            const table = await this.db.getAllAsync(`
                SELECT name FROM sqlite_master WHERE type='table' AND name='cart';
            `);

            const tableExists = table.length > 0;
            if (!tableExists) {
                await this.db.execAsync(`
                  CREATE TABLE cart (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    price REAL,
                    quantity INTEGER
                  );`);
            }
        }
    };
    

    getCartItems = async () => {
        if (this.db) {
            const result = await this.db.getAllAsync('SELECT * FROM cart');    
            return result;
        }        
        return [];
    };

    addItem = async (id, name, price) => {
        if (this.db) {
            const result = await this.db.getAllAsync('SELECT * FROM cart WHERE name = ?', [name]);            
            if (result.length > 0) {
                await this.db.runAsync('UPDATE cart SET quantity = quantity + 1 WHERE name = ?', [name]);
            } else {
                await this.db.runAsync('INSERT INTO cart (id, name, price, quantity) VALUES (?, ?, ?, ?)', [id, name, price, 1]);
            }
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
