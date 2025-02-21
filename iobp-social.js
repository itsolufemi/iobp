//Olufemi Davies 18552564 - 6COSC023W FYP

// #region Imports
const EventManager = require('./tools/event-manager'); // event manager
// #endregion

class Network{
    constructor(name, n_c, db, uname){
        this.the_soc_net = ""; //passing an instance of social network allows the instance passed to post users create
        //but it cannot be passed until after network is created
        this.users = [];  // list of all users on the network
        this.all_posts = []; //list of all post created on the network
        this.name = name; //name of the social network
        this.username = uname //social network username
        this.node_code = n_c; //node code for blockchain interaction
        this.iobp_med_db_copy = db; //copy of distribute media database
    }

    view_all() {
        const show_users = this.users.map(user => {return `${user.userId}: ${user.username}`;}).join(", ");
    
        const show_posts = this.all_posts.map(post => {return `Posted by: ${this.users.find(user => user.userId === post.userId).username} on ${post.date_time}
Media: ${post.show_media()}
Caption: ${post.text}
Post Id: ${post.post_id}
---------------------------

`;
        });
    
        return `Users: ${show_users}
Posts:
${show_posts}
            `
    }

    set_soc_net(network){
        this.the_soc_net = network;
    }

    add_user(x, y, z, pic) {
        const new_user = new User(this.the_soc_net, x, y, z, pic, this.node_code);
        this.users.push(new_user);
    }

    assign_followers() {// randomly assign 3-5 followers for each user
        this.users.forEach(user => {
            let x_curr_usr = this.users.filter(u => u !== user); // This creates a new array excluding the user we want to follow others
            let follow_count = Math.floor(Math.random() * 3) + 3; // Random number between 3 and 5
            while (user.following.length < follow_count) {// this part will execute until the rand num is complete
                let i = Math.floor(Math.random() * x_curr_usr.length);
                let usr_to_follow = x_curr_usr[i];
                user.follow_usr(usr_to_follow); // Using a method that ensures no duplicates and valid follow
                x_curr_usr.splice(i, 1); // Remove this user from possible follows to avoid duplicates
            }
        });
    }

    login_auth(x){ // logs in a user
        let user = this.users.find(user => user.username === x);
        if(user){
            let usr_sess = new Session(user) //create a new session with the user object that has the corresponding username
            return usr_sess
        } else {
            console.log("User not found");
            return null;
        }
    }

    rand_login_auth() { // logs in a random user
        if (this.users.length === 0) {
            console.log("No users available.");
            return null;
        }
        const i = Math.floor(Math.random() * this.users.length);
        let usr_sess = new Session(this.users[i]);
        return usr_sess;
    }
}

class Session {
    constructor(x) {
        this.curr_user = x;
        this.user_feed = this.load_feed();
    }

    load_feed() { // Load the User feed with up to three files
        let feed = [];
        // Iterate over the list of users the current user is following
        for (const usr of this.curr_user.following) {
            // Check if the followed user has any posts and the feed has less than 3 posts
            if (usr.posts.length > 0 && feed.length < 3) {
                let lastPost = usr.posts[usr.posts.length - 1]; // Get the last post from the followed user's posts
                feed.push(lastPost); // Add the last post to the feed
            }
            // Break the loop if we already have 3 files in the feed
            if (feed.length >= 3) {
                break;
            }
        }
        return feed;
    }

    report_by_post(post_id, comment){ //allows to report media by post, hence all media files will be flagged.
        let pst = this.user_feed.find(post => post.post_id === post_id); //finds post in the the feed using id entered
        if(pst){        
            pst.med_is_reported(pst.media_arr, comment)
            console.log("Post has been reported")
        } else{
            console.log("No matching post found with id ", post_id);
        }
    }   
}

class User {
    constructor(soc_net,email, username, password, pic, n_c) {
        this.the_soc_net = soc_net //passing an instance of social network allows the instance passed to post users create

        //user info
        this.email = email;
        this.username = username;
        this.password = password;
        this.userId = this.gen_uID(); //system generated User ID
        this.node_code_u = n_c;
        this.gallery = this.create_user_gallery();

        //account features
        this.profile_pic = pic;
        this.posts = [];
        this.following = [];
        //this.user_feed = [];
    }

    gen_rand_posts() {
        // Array of sample texts for posts
        const sample_txt = ["Beautiful day out in nature!","Loving the new camera effects.","Had a great time at the beach.",
            "Can't believe how clear this shot came out!","Enjoying the sunset with friends."
        ];

        let rand_is_news = Math.random() < 0.5 ? "1" : "2"; //randomise if its a news story or not

        // Create two random posts
        for (let i = 0; i < 4; i++) {
            const randomTextIndex = Math.floor(Math.random() * sample_txt.length);
            const text = sample_txt[randomTextIndex];
            this.new_post_nm(text, rand_is_news); //some posts will be news stories which should help populate network pool
        }
    }

    create_user_gallery(){
        //to create a gallry of images users can upload with posts
        let images = [["0", "image_000.jpg", "10234"], ["1", "vid_001.mp4", "20345"], ["2", "pic_002.jpg", "30456"], 
        ["3", "shot_003.jpg", "40567"], ["4", "video_004.mp4", "50678"], ["5", "vid_005.mp4", "60789"], 
        ["6", "frame_006.jpg", "70890"], ["7", "view_007.jpg", "80901"], ["8", "scene_008.jpg", "91012"], 
        ["9", "image_009.jpg", "12345"], ["10", "vid_010.mp4", "23456"], ["11", "pic_011.jpg", "34567"], 
        ["12", "shot_012.jpg", "45678"], ["13", "vid_013.mp4", "56789"], ["14", "vid_014.mp4", "67890"]];

        let user_gallery = [];
        
        images.forEach(file => {
            const [index, path, id] = file;  // Destructure the file array into individual variables
            const media = new Media(index, path, id);
            user_gallery.push(media);  // Push the newly created media object to the userGallery array
        });

        return user_gallery;
    }

    new_post(text, is_news, med_idx) { //new post with random media
        let med_list = [this.find_media(med_idx)]; // select users to pick an media by inputing an index number
        // Create new post with all media IDs resolved
        const new_post = new Post(this.the_soc_net, this.userId, this.username, med_list, text,  this.node_code_u);
        new_post.is_this_news(is_news); //checks to see if it is a news story
        this.posts.push(new_post)
        this.the_soc_net.all_posts.push(new_post); //pushes new post to the social network post record
        return new_post;
    }
    
    new_post_nm(text, is_news) { //new post with random media
        let rand_med_list = this.choose_rand_media(); // function radonmly selects 1/2 photos from users' gallery
        // Create new post with all media IDs resolved
        const new_post = new Post(this.the_soc_net, this.userId, this.username, rand_med_list, text, this.node_code);
        new_post.is_this_news(is_news);
        this.posts.push(new_post)
        this.the_soc_net.all_posts.push(new_post); //pushes new post to the social network post record
        return new_post;
    }

    find_media(med_idx){//finds media file  by id
        let media = this.gallery.find(media => media.media_indx === med_idx);
        if (media) {
            return media;
        } else{
            return "No media found in gallery";
        }
    }

    choose_rand_media(){
        const selected = [];
        const num_items = Math.random() < 0.5 ? 1 : 2; //determine whether to select 1 or 2 items

        const gall_copy = this.gallery.slice(); // copy gallery

        for (let i = 0; i < num_items; i++) {
            const randomIndex = Math.floor(Math.random() * gall_copy.length); // pick a random index from what's in the array
            selected.push(gall_copy[randomIndex]); // Push the randomly selected item to the 'selected' array
            gall_copy.splice(randomIndex, 1);// remove the selected item from the 'gall_copy' array to avoid duplicates
        }
    
        // Return the array of selected items
        return selected;

    }

    follow_usr(x) {
        if (!this.following.includes(x)) {
            this.following.push(x);
        }
    }

    load_user_profile(){
        let map_friends = this.following.map( friend => friend.username).join(', '); //show friend's usernames
        let map_posts = this.posts.map( post => post.post_id).join(', '); //show only post ids

        let profile = this.username + "\nYour Friends: " + map_friends + "\nYour Posts: " + map_posts;
        return profile
    }

    gen_uID() {
        return Math.floor(Math.random() * 90000) + 10000; //random 5 digit number
    }
}

class Post {
    constructor(soc_net, userId, u_nm, media_lst, text,  n_c) {
        this.the_soc_net = soc_net //passing an instance of social network allows checking media files vs soc_net's media db copy
        // faciliates the connection from the post on a social net to the broader iobp platform powered by blockchain
        this.userId = userId;
        this.username = u_nm;
        this.date_time = this.get_date_time(); //date/time stamp for post
        this.media_arr = media_lst; //media files in the post
        this.text = text; //post caption
        this.post_id = this.create_post_id(this.the_soc_net.username, this.userId, this.date_time); //system generated post id
        this.node_code_p = n_c;
    }


    load_post() {
        const postText = `Posted by: ${this.username} on ${this.date_time}
Media: ${this.show_media()}
Caption: ${this.text}
Post Id: ${this.post_id}
                    `;
    
        return postText;
    }

    show_media() {
        const show_media = this.media_arr.map(media => {return `${media.media_id}: ${media.media_path}`;}).join(", ");
        return show_media;
    }

    create_post_id(code, uId, dt) { // create  unique id for the post
        let post_id = code + "." + uId + "." + dt + "." + /*(rand 6 digit num)*/Math.floor(Math.random() * 900) + 100;
        return post_id
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

    flag_post_med(med_file, comment){
        EventManager.emit('newTransaction', {
            mediaId: med_file.media_id,
            postId: this.post_id, // the post in which the media is featured
            comment: comment, //records reason for flaggin post and could news or reported
            nodeCode_p: this.node_code_p // node code for the social net
        });
    }

    is_this_news(news){ // this method takes action if the post is tagged as a news story
        if(news === "1"){
            this.media_arr.forEach(med_file => {this.flag_post_med(med_file, "tagged as new story")}); 
            //each media in the post is flagged for the blockchain
        } else {
             this.post_med_dbcheck(); //db checking was moved here because you dont want to create two entries  
                                      //for news stories that also feature existing news
        }
    }

    med_is_reported(med_list, comment){ //this method takes action when a file is reported
        med_list.forEach(file => this.flag_post_med(file, comment)); //flags each media in the post med_arr
    }

    post_med_dbcheck(){
        let media_db = this.the_soc_net.iobp_med_db_copy; //Access the iobp media db
        this.media_arr.forEach(med_file => { //iterate through each media file in the post (media_arr)
            let entry_exist = media_db.find(med_entry => med_entry.id === med_file.id);

            if (entry_exist) {
                console.log("Media already exist in the db");
                this.flag_post_med(med_file, "");
            } 
        });
    }
}

class Media {
    constructor(index, path, id) {
        this.media_indx = index;
        this.media_id = id;
        this.media_path = path;
    }

    gen_med_id() {
        return Math.floor(Math.random() * 90000) + 10000; //random 5 digit number
    }
}

module.exports = { Network, Post }; 