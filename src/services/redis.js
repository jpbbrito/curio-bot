import { createClient } from 'redis'

export default class Redis {

    static connection

    static async createConnection({ url, username, password }) {

        console.log('[Redis] createConnection() url, username, password:', url, username, password);
        try {
            this.connection = await createClient({
                url,
                username,
                password
            });
            console.log('[Redis] createConnection() Database working');
            return this.connection;
        } catch (errors) {
            console.log('[Redis] createConnection()Error to connect DB ->', errors);
        }
    }

    static getConnection() {
        return Database.connection;
    }

    static async set(key, value, expiration = 60*60) {
        console.log('[Redis] set() key, value ->', key, value);
        try {
            await this.connection.connect()
            await this.connection.set(key, JSON.stringify(value), { EX: expiration }) // expiration 1 hr by default
            await this.connection.disconnect()
        } catch (errors) {
            await this.connection.disconnect()
            console.log('[Redis] set() err ->', errors);
            return 'error_redis'
        }
    }
    static async get(arg) {
        console.log('[Redis] get() key, arg ->', arg);
        try {
            await this.connection.connect()
            const result = await this.connection.get(arg)
            console.log('[Redis] get() result ->', result);
            await this.connection.disconnect()
            return JSON.parse(result)
        } catch (errors) {
            await this.connection.disconnect()
            console.log('[Redis] get() err ->', errors);
            return 'error_redis'
        }
    }
}