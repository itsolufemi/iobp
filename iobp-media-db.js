//Olufemi Davies 18552564 - 6COSC023W FYP

const EventManager = require('./tools/event-manager'); //import event manager

class Media_db{
    constructor(){
        this.media_db = []; //This array will hold all a database for media transactions
        this.initListeners(); //event listeners
    }

    initListeners() { //event listerner to create new transaction is triggered from the social networks
        EventManager.on('newEntry', (data) => {
           this.new_entry(data.med_id, data.pst_id, data.comment, data.trans_id);
        });
    }
    
    new_entry(med_id, pst_id, comment, trans_id) {
        let med_exist = this.media_db.find(entry => entry.med_id === med_id); // Find the media entry in the database using the med_id
    
        if (med_exist) {
            // If found, add the new post ID to this entry
            med_exist.new_post_entry(pst_id, comment, trans_id);
        } else {
            // If not found, create a new media entry
            let new_ent = new Media_Entry(med_id);
            new_ent.new_post_entry(pst_id, comment,  trans_id);
            this.media_db.push(new_ent); // Add the new entry to the media_db array
        }
    }

    retrieve_med_record(med_id){
        let entree = this.media_db.find(med => med.med_id === med_id);
        if(entree){
            console.log(entree.med_id);
            console.log("Share count: ", entree.instance_count)
            console.log(entree.get_med_timeline());
        }
    }
}

class Media_Entry{
    constructor(med_id){
        this.med_id = med_id;
        //this.date_time = this.get_date_time();
        this.pst_list = []; // array holds list of post instaces that feature the media file
        this.instance_count = 0
    }

    new_post_entry(x, y, z) {
        this.pst_list.push([x,y, z]);
        this.instance_count += 1;
    }

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

    get_med_timeline(){
       // this.pst_list.forEach(post => this.find_post)
       return this.pst_list.map(post => `ID: ${post[0]}, Comment: ${post[1]}`).join(", "); //return the find post function for each 
                                                                                           //post in the media ids post list
    }
}

module.exports.Media_db = Media_db;