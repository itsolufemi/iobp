//Olufemi Davies 18552564 - 6COSC023W FYP

const EventManager = require('./tools/event-manager'); //import event manager
const SHA256 = require('./node_modules/crypto-js/sha256');

class Blockchain {
    constructor() {
        this.sealer_nodes = [ ]; //create the sealers
        this.participant_nodes = []; //create the participant nodes
        this.curr_validator = '';
        this.chain = [this.createGenesisBlock()]; //create the genesis block 
        this.network_pool = []; //create the network pool
        this.initListeners(); //event listeners
    }    
//#region The Blockchain  =====================================================
    // #region 1. Node Functions

    //a. participants 
    add_participants(x, y, z, chain_ref) {
        const n_exist = this.participant_nodes.find(node => node.node_id === z); //
        if (n_exist) {
            console.log("Node with id " + z + " already exists, please review")
        } 

        else {
            const new_p = new Node(x, y, z,chain_ref);
            this.participant_nodes.push(new_p);
            console.log("New Participant " + x + " added successfully with ID " + z);
        }
    }

    del_participant(x) { //deletes a node from the participant and sealer arrays
        const n_idx = this.participant_nodes.findIndex(node => node.node_id === x);
        const sn_idx = this.sealer_nodes.findIndex(node => node.node_id === x);
        if (n_idx > -1) {
            const node = this.participant_nodes[n_idx]
            console.log('Participant node "' + node.name + '" with ID ' + x + 'has been deleted');
            this.participant_nodes.splice(n_idx, 1);

            // Also check if the node is a sealer
            const sn_idx = this.sealer_nodes.findIndex(node => node.node_id === x);
            if (n_idx > -1) {
                //if it is a sealer also remove the node from the sealer array
                this.sealer_nodes.splice(n_idx, 1);
            }
        } else {
            console.log("No participant node found with ID " + x);
        }
    }

    add_sealer(x) { //Add a new node as validator
        const new_v = this.participant_nodes.find(node => node.node_id === x); //
        if (new_v) {
            // Check if the node is already a sealer_nodes array to avoid duplicates
            if (!this.sealer_nodes.some(n => n.node_id === x)) {
                this.sealer_nodes.push(new_v);
                console.log("Node " + new_v.name + " added as a new validator.");
            } else {
                console.log("Node " + new_v.name + " is already a validator.");
            }
        } else {
            console.log("Node with ID " + x + " does not exist.");
        }
    }  

    remove_sealer(x) {// removes a node from the sealer arr
        const n_idx = this.sealer_nodes.findIndex(node => node.node_id === x);
        if (n_idx > -1) {
            const node = this.participant_nodes[n_idx]
            console.log('Sealer node "' + node.name + '" with ID ' + x + 'has been removed');
            this.sealer_nodes.splice(n_idx, 1);
        } else {
            console.log("No Sealer node found with ID " + x);
        }
    }

    show_nodes(x){ //would be used to display a list of the nodes
        let mapped_par = this.participant_nodes.map( node => {return `${node.name}:${node.node_id}`;}).join(" , ");
        let mapped_seal = this.sealer_nodes.map( node => node.name).join(" , ");
        return "Participants: " + mapped_par + "\nSealers/Validators: " + mapped_seal;
    }
    // #endregion

    // 2. Genesis block
    createGenesisBlock() { //genesis block
        return new Block("", "Genesis Block");
    }
  
    // #region 3. Network Transaction & Pool Functions
    initListeners() { //event listerner to create new transaction is triggered from the social networks
        EventManager.on('newTransaction', (data) => {
            let node = this.participant_nodes.find(n => n.node_code === data.node_code); //autheticates node code
            if(node){
                node.create_transaction(data.mediaId, data.postId, data.comment); // assigns correspoding node to create transaction
            } else {
                console.log("No Node found to initiate transactions, transaction terminated");
                console.log("hello", data.nodeCode_p);
                return null;
            }
        });
    }


    validate_Transactions(){ // validating transactions in the pool
        this.select_rand_valid(); //choose a validator
        let validated_pool = []; // Create a pool for the transactions once validated
        this.network_pool.forEach(trans => {
            EventManager.emit('newEntry', {
                med_id: trans.media_ID,
                pst_id: trans.post_ID, // the post in which the media is featured
                comment: trans.comment, //the comment for the which the media in the post has been flagged, which could vary across different posts
                trans_id: trans.trans_ID // node code for the social net
            }); //update entry in the iobp media db
            validated_pool.push(trans.trans_ID //only the transaction id is pushed to the transation list thats added to a block
        )}); 
    
        this.network_pool = []; // Clear the network pool
        return this.addNewBlock(new Block("", validated_pool, this.curr_validator));
    }
    // #endregion

    //4. Block Functions
    addNewBlock(newBlock) { //add a new block to the chain
        newBlock.previousHash = this.getLatestBlock().hash; /*to get prev hash number*/
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    getLatestBlock() { // retrieve the last block
        return this.chain[this.chain.length - 1];
    }

    //5. PoA consensus mechanism
    select_rand_valid() {
        /*
        The concensus mechanism randomly selects a sealer to validate the transactions in the
        nework pool and create the next block
        */

        if (this.sealer_nodes.length === 0) {
            console.log("No sealer nodes available.");
            return -1;  // Return an invalid index if no sealer nodes are available
        }
        const index = Math.floor(Math.random() * this.sealer_nodes.length);
        this.curr_validator = this.sealer_nodes[index].node_id;
    }

    //#endregion ==============================================================
}

class Block {
    static index = 0;

    constructor(previousHash = '', trans_list, validator) {
        this.header = "Block " + Block.index++;
        this.index_num = Block.index;
        this.validator = validator;
        this.timestamp = this.get_date_time();
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.merkleHash = this.generateMerkleHash();
        this.trans_list = trans_list;
    }

    get_date_time() { // date/timestamp
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = currentDate.getFullYear();
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        return `${day}.${month}.${year}.${hours}.${minutes}.${seconds}`;
    }

    calculateHash() {//hashnumber
        //returns sha 256 hash number of the entire block 
        return SHA256 (this.index_num + this.previousHash + this.timestamp + this.merkleHash).toString();
    }

    generateMerkleHash() {//merklehash
        //hashes this.trans_list
        return SHA256 (JSON.stringify(this.trans_list)).toString();
    }
}

class Node {
    constructor(name, uname, code = " ", blockchain) {
        this.name = name;
        this.code = code;
        this.node_id = this.create_node_id(uname, code);
        this.blockchain = blockchain; //reference to current blockchain instance
    }

    create_node_id(x, y) { //generates a system id for the secondary nodes
        let node_id = x + "." + y + ".iobp";
        return node_id
    }

    //Transaction Methods
    create_transaction(x, y, comment) {
        let trans = new Transaction(x, y, this.node_id, comment);
        this.add_Transaction_toPool(trans); //comment won't feature in the block but will be recorded in media db
    }

    add_Transaction_toPool(x){ // adding transactions to the pool
        let i = this.blockchain.network_pool.length;
        if (i == 10){ 
            this.blockchain.validate_Transactions();
            //if the the net_pool has 10 transactions validates them and clear the pool to make room for 10 new
            this.blockchain.network_pool.push(x);
        }
        else {
            this.blockchain.network_pool.push(x);
        }
    }
}

class Transaction {
    constructor(media_ID, post_ID, node_code, comment) {
        this.trans_ID = this.generateTransID();
        this.timestamp = this.get_date_time();
        this.media_ID = media_ID;
        this.post_ID = post_ID;
        this.node_priv_key = node_code;
        this.comment = "reported for: " + comment;
    }

    //transaction id
    generateTransID() {
        /*Temporary 10 digit number generator*/
        return Math.floor(Math.random() * 9000000000) + 1000000000;
    }

    //timestamp
    get_date_time() {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = currentDate.getFullYear();
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
      
        return `${day}.${month}.${year}.${hours}.${minutes}.${seconds}`;
    }
}

module.exports.Blockchain = Blockchain;