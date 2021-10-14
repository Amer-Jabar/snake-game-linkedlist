export default class LinkedList {

    node;
    size;

    constructor(data) {
        if ( data !== null && data !== undefined ) {
            this.node = new Node(data);
            this.node.nextNode = this.node;
            this.node.prevNode = this.node;
            this.size = 1;
        } else {
            this.node = null;
            this.size = 0;
        }
    }

    add(data) {
        if ( data === null || data === undefined )
            return;

        if ( this.node === null ) {
            this.node = new Node(data);
            this.node.nextNode = this.node;
            this.node.prevNode = this.node;
            this.size++;
            return;
        }
            
        let pointer = 0;
        let currentNode = this.node;
        while ( currentNode.nextNode && pointer < this.size - 1 ) {
            currentNode = currentNode.nextNode;
            pointer++;
        }

        const newTempNode = new Node(data);
        newTempNode.nextNode = this.node;
        newTempNode.prevNode = currentNode;
        currentNode.nextNode = newTempNode;
        this.node.prevNode = newTempNode;
        this.size++;
    }

    get(index) {
        if ( index === null || index === undefined )
            return undefined;
        
        let pointer = 0;
        let currentNode = this.node;
        while ( pointer < index && currentNode.nextNode !== null ) {
            currentNode = currentNode.nextNode;
            pointer++;
        }

        return currentNode.data;
    }

    insert(index, data) {
        if ( data === null || data === undefined )
            return;
        
        if ( this.node === null ) {
            this.node = new Node(data);
            this.size++;
            return;
        }

        let pointer = 0;
        let currentNode = this.node;
        while ( pointer < index && currentNode.nextNode !== null ) {
            currentNode = currentNode.nextNode;
            pointer++;
        }
        
        const newMiddleNode = new Node(data);
        newMiddleNode.prevNode = currentNode.prevNode;
        newMiddleNode.nextNode = currentNode;
        currentNode.prevNode.nextNode = newMiddleNode;
        currentNode.prevNode = newMiddleNode;
        this.size++;
    }

    toArray() {
        let array = [];
        let currentNode = this.node;
        let pointer = 0;
        while ( pointer < this.size ) {
            array.push(currentNode.data);
            currentNode = currentNode.nextNode;
            pointer++;
        }

        return array;
    }

    toObject() {
        return {
            node: this.node, 
            size: this.size
        }
    }

    firstItem() {
        return this.node.data;
    }

    lastItem() {
        return this.node.prevNode.data;
    }

    insertMiddle(data) {
        if ( data === null && data === undefined )
            return;

        let newTempNode = new Node(data);
        newTempNode.nextNode = this.node;
        newTempNode.prevNode = this.node.prevNode;
        this.node.prevNode.nextNode = newTempNode;
        this.node.prevNode = newTempNode;
        this.node = newTempNode;

        this.size++;
    }

    removeMiddle() {
        let currentNode = this.node;
        currentNode.nextNode.prevNode = currentNode.prevNode;
        currentNode.prevNode.nextNode = currentNode.nextNode;
        this.node = currentNode.nextNode;

        this.size--;
    }

    removeLast() {

        if ( this.size === 0 )
            return;
            
        if ( this.size === 1 ) {
            let lastNode = this.node;
            this.size--;
            return lastNode.data;
        }

        if ( this.size === 2 ) {
            let lastNode = this.node.prevNode;
            this.node.prevNode = this.node;
            this.node.nextNode = this.node;
            this.size--;
            return lastNode.data;
        }

        let lastNodeToReturn = this.node.prevNode;
        let lastNode = lastNodeToReturn.prevNode;
        lastNode.nextNode = this.node;
        this.node.prevNode = lastNode;
        this.size--;

        return lastNodeToReturn.data;
    }

}

class Node {
    data;
    nextNode;
    prevNode;

    constructor(data) {
        this.data = data;
        this.nextNode = null;
        this.prevNode = null;
    }
}