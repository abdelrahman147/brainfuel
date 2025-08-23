import sqlite3 from 'sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'backend', 'database', 'projects.db');

class Database {
    constructor() {
        this.db = null;
    }

    async connect() {
        if (!this.db) {
            this.db = new sqlite3.Database(DB_PATH, (err) => {
                if (err) {
                    console.error('Error opening database:', err.message);
                } else {
                    console.log('Connected to SQLite database');
                }
            });

            // Enable foreign keys
            await this.runQuery('PRAGMA foreign_keys = ON');
        }
        return this.db;
    }

    async getConnection() {
        if (!this.db) {
            await this.connect();
        }
        return this.db;
    }

    async close() {
        if (this.db) {
            return new Promise((resolve, reject) => {
                this.db.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.db = null;
                        resolve();
                    }
                });
            });
        }
    }

    // Helper method for running queries
    async runQuery(sql, params = []) {
        const db = await this.getConnection();
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        });
    }

    // Helper method for getting single row
    async getRow(sql, params = []) {
        const db = await this.getConnection();
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Helper method for getting multiple rows
    async getAll(sql, params = []) {
        const db = await this.getConnection();
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Alias methods for backward compatibility
    async run(sql, params = []) {
        return this.runQuery(sql, params);
    }

    async get(sql, params = []) {
        return this.getRow(sql, params);
    }

    async all(sql, params = []) {
        return this.getAll(sql, params);
    }
}

// Export singleton instance
export default new Database(); 