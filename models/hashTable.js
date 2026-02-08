import { generateHash } from "../helpers/hash"
export class HashTable {
    constructor() {
        this.data = []
    } 
    add(key, instance) {
        const hash = generateHash(key)
        if (Array.isArray(this.data[hash])) { 
            // if there already is an array at the index
            // the element is appeneded to it
            this.data[hash].push(key, instance)
        } else {
            // Otherwise, we create a new array holding the key and instance
            this.data[hash] = [key, instance]
        }
    } 
    get(key) {
        const hash = generateHash(key)
        if (this.data[hash] === undefined) {
            return undefined 
        } 
        for (let i=0; i<this.data[hash].length;i+=2) {
            if (this.data[hash][i] == key) {
                return this.data[hash][i+1]
            }
        }
        return undefined 
    }
    update(key, updatedInstance) {
        const hash = generateHash(key)
        if (this.data[hash] === undefined) {
            return false
        } 
        for (let i=0; i<this.data[hash].length;i+=2) {
            if (this.data[hash][i] == key) {
                this.data[hash][i+1] = updatedInstance
                return true;
            }
        }
        return false
    }
    delete(key) {
        const hash = generateHash(key)
        if (this.data[hash] === undefined) {
            return false
        } 
        for (let i=0; i<this.data[hash].length;i+=2) {
            if (this.data[hash][i] == key) {
                this.data[hash].splice(i, 2) 
                return true
            }
        }
        return false
    } 
}

export const lobbies = new HashTable()



