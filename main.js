//Olufemi Davies 18552564 - 6COSC023W FYP

//#region Imports
const { Blockchain } = require('./iobp-blockchain'); //Import the blockchain class
const { Network } = require('./iobp-social'); //Import the Network class
const { Media_db } = require('./iobp-media-db'); //Import Media db

const readline = require('readline'); //import readline module
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// #endregion

//#region Init
let db = new Media_db; //init media db

//Blockchain Init
let x_chain = new Blockchain();

x_chain.add_participants("iobp", "iobp", "000.111", x_chain) //init iobp as first participant
x_chain.add_sealer("iobp.000.111.iobp"); // add iobp as sealer

x_chain.add_participants("instagram", "ig", "157.241", x_chain); 
x_chain.add_sealer("ig.157.241.iobp"); // add instagram as a sealer

x_chain.add_participants("twitter", "twt", "104.244", x_chain); //init first validator

//Instagram Init
let insta = new Network("instagram", "157.241", db.media_db, "ig"); //Initialise Instagram clone
insta.set_soc_net(insta); //pass instance of the network to itself
    //Instagram Users Initi
    //#region create the users for instagram
    insta.add_user("itsolufemi@gmail.com", "iamod", "123456")
    insta.add_user("itsolatomi@gmail.com", "tomi", "123456")
    insta.add_user("itsdaniel@gmail.com", "daniboy", "123456")
    insta.add_user("jane.doe@example.com", "janed", "password123");
    insta.add_user("john.smith@domain.com", "johnny", "pass456");
    insta.add_user("alice.wonderland@mail.com", "alicew", "wonderpass");
    insta.add_user("bob.builder@construct.com", "bobbuild", "buildit777");
    insta.add_user("clara.cloud@skynet.com", "cloudyclara", "skyhigh88");
    //#endregion

    insta.users.forEach(user => {user.gen_rand_posts();}); //generate 2 random posts for each user

    insta.assign_followers(); // Assign followers to each user

    let logged_in =""; // to hold current user

//Twiiter Init
let twitter = new Network("twitter", "104.244", db.media_db, "twt"); //Initialise Twitter clone
twitter.set_soc_net(twitter); //pass instance of the network to itself
    //Twitter Users Initi
    //#region create the users for twitter
    twitter.add_user("itsolufemi@gmail.com", "iamod", "123456")
    twitter.add_user("itsolatomi@gmail.com", "tomi", "123456")
    twitter.add_user("itsdaniel@gmail.com", "daniboy", "123456")
    twitter.add_user("jane.doe@example.com", "janed", "password123");
    twitter.add_user("john.smith@domain.com", "johnny", "pass456");
    twitter.add_user("alice.wonderland@mail.com", "alicew", "wonderpass");
    twitter.add_user("bob.builder@construct.com", "bobbuild", "buildit777");
    twitter.add_user("clara.cloud@skynet.com", "cloudyclara", "skyhigh88");
    //#endregion

    twitter.users.forEach(user => {user.gen_rand_posts();}); //generate 2 random posts for each user
    twitter.assign_followers(); // Assign followers to each user
    let logged_in_twit =""; // to hold current user for session
//#endregion

//#region db menu
function db_menu() {

}
//#endregion

//#region blockchain menu
function blockchain_menu() {//blockchain menu
    console.log(`Interoperable Blockchain Platform
1 => View Blockchain
2 => Manage Nodes
3 => Exit `);
}

function show_blockchain_menu() {
    blockchain_menu();
    rl.question('Select option: ', blockchain_menu_input);
}

function blockchain_menu_input(x) {
    switch (x.trim()) {
        case '1': //View Blockchain
            console.clear();
            console.log('Interoperable Blockchain')
            console.log(JSON.stringify(x_chain.chain, null, 4)); // Shows the blockchain;
            console.log("The network pool");
            console.log(JSON.stringify(x_chain.network_pool, null, 4)); // Shows the blockchain network pool;
            console.log("--------------------------------------------------------------------------------")
            setTimeout(show_blockchain_menu, 500); // Show menu after output
            break;
        case '2': //Manage nodes
            console.clear();
            show_node_menu();
            break;
        case '3': //Exit
            console.clear();
            show_iobp_supermenu();
            break; // Stop the process
        default:
            console.log("Invalid option, please try again.");
            console.log("--------------------------------------------------------------------------------");
            rl.question('Select option: ', blockchain_menu_input);
            break;
    }  
}

    //#region node menu
    function node_menu() {//node menu
        console.log(`Manage Chain Nodes
1 => View all Nodes
2 => Add new participant node
3 => Add new Sealer(Validator)
4 => Remove a Sealer(Validator)
5 => Delete node
6 => Exit`);
    }

    function show_node_menu() {
        node_menu();
        rl.question('Select option: ', node_menu_input)
    }

    function node_menu_input(x) {
        switch (x.trim()) {
            case '1'://View all nodes
                console.clear();
                console.log('Blockchain Nodes');
                console.log(x_chain.show_nodes());
                console.log("\n--------------------------------------------------------------------------------");
                setTimeout(show_node_menu, 1000); // Give some time for the output to be read before showing menu again
                break;
            case '2'://Add new participant node
                console.clear();
                //Call add participant function
                rl.question("Enter new Participant Org Name: ", (x) => { // new Node (name
                    x = x.trim().toLowerCase();
            
                    rl.question("Enter new Participant Username: ", (y) => { // new Node (name, uname
                        y = y.trim().toLowerCase();
            
                        rl.question("Enter new Participant ID: ", (z) => { // new Node (name, uname, id)
                            z = z.trim().toLowerCase();
                            x_chain.add_participants(x, y, z); // Now with all three inputs, call add_participants()
                console.log("\n--------------------------------------------------------------------------------");
                setTimeout(show_node_menu, 1000); // Give some time for the output to be read before showing menu again
                return;
                        });
                    });
                });
            case '3'://Add new Sealer(validator)
                console.clear();
                rl.question("Enter new sealer node-ID: ", (x) => { //Call add sealer function with input as argument
                    x_chain.add_sealer(x.trim().toLowerCase());
                    console.log("\n--------------------------------------------------------------------------------");
                    setTimeout(show_node_menu, 1000); // Give some time for the output to be read before showing menu again
                }); 
                return; 
            case '4'://Remove a Sealer(validator)
                console.clear();
                rl.question("Enter sealer node-ID: ", (x) => { //Call remove_sealer function with input as argument
                    x_chain.remove_sealer(x.trim().toLowerCase());
                console.log("\n--------------------------------------------------------------------------------");
                setTimeout(show_node_menu, 1000); // Give some time for the output to be read before showing menu again
                }); 
                return; 
            case '5'://Delete node
                console.clear();
                rl.question("Enter participant node-ID: ", (x) => { //Call del_participant function with input as argument
                    x_chain.del_participant(x.trim().toLowerCase());
                console.log("\n--------------------------------------------------------------------------------");
                setTimeout(show_node_menu, 1000); // Give some time for the output to be read before showing menu again
                }); 
                return; 
            case '6'://Exit nodes menu
                console.clear();
                show_blockchain_menu(); // Return to main menu
                return; 
            default:
                console.log("Invalid option, please try again.");
                console.log("--------------------------------------------------------------------------------")
                rl.question('Select option: ', node_menu_input)
                break;
        }
    }
    //#endregion
//#endregion

//#region social nets menu
function social_menu() { //social menu
    console.log(`Social Networking platforms
1 => Instagram
2 => Twitter
3 => Exit `);
}

function show_social_menu(){
    social_menu();
    rl.question('Select option: ', social_menu_input);
}

function social_menu_input(x) {
    switch (x.trim()) {
        case '1'://Instagram
            console.clear();
            show_instagram_app();
            break;
        case '2'://Twitter
            console.clear();
            show_twitter_app();
            break;
        case '3'://Exit to supermenu
            console.clear();
            show_iobp_supermenu();
            return; 
        default:
            console.log("Invalid option, please try again.");
            console.log("--------------------------------------------------------------------------------")
            rl.question('Select option: ', social_menu_input);
            break;
    }
}

    //#region instagram app
    function instagram_app() { //Instagram App
        console.log(`Instagram
1 => Login
2 => View all posts
3 => Exit `);
    }

    function show_instagram_app(){
        instagram_app();
        rl.question('Select option: ', instagram_app_input);
    }

    function instagram_app_input(x) {
        switch (x.trim()) {
            case '1'://Login
                console.clear();
                rl.question('Enter username: ', (username) => { // Function to login a specific user
                    let sess = insta.login_auth(username.trim().toLowerCase()); // Login with username entered
                    if (!sess) {
                        console.log("Login failed.");
                        console.log("--------------------------------------------------------------------------------");
                        show_instagram_app();
                    } else {
                        logged_in = sess;
                        console.log("Logged in", logged_in.curr_user.username); // Welcome current user (don't be rude)
                        show_instagram_user();
                    }
                });
                break;
            case '2'://View all post
                console.clear()
                console.log(insta.view_all());
                setTimeout(show_instagram_app, 1000); // Give some time for the output to be read before showing menu again
                break;
            case '3'://Exit
                console.clear();
                show_social_menu();
                break; 
            default:
                console.log("Invalid option, please try again.");
                console.log("--------------------------------------------------------------------------------")
                rl.question('Select option: ', instagram_app_input);
                break;
        }
    }
    //#endregion

    //#region instagram user
    function instagram_user() {//Instagram User
        console.log(`Social Networking platforms
1 => Feed
2 => User Profile
3 => New post
4 => Logout `);
    }

    function show_instagram_user(){
        instagram_user();
        rl.question('Select option: ', instagram_user_input);
    }

    function instagram_user_input(x) {
        switch (x.trim()) {
            case '1'://Feed
                console.clear();
                console.log(logged_in.curr_user.username);
                console.log(" ");
                const feed_out = logged_in.user_feed.map(post => post.load_post());
                console.log(feed_out);
                rl.question('Enter 0 to Report a post, 1 to exit feed: ', feed_menu);
                    function feed_menu(x){
                        switch (x.trim()) {
                            case "0":
                                rl.question("Enter post id: ", (post_id) => { // Get post ID from user
                                    post_id = post_id.trim().toLowerCase();
                                    rl.question("Report comment: ", (comment) => { // Get report comment from user
                                        comment = comment.toLowerCase();
                                        logged_in.report_by_post(post_id, comment);
                                        
                                    console.log("--------------------------------------------------------------------------------");
                                    setTimeout(show_instagram_user, 1000); // Give some time for the output to be read before showing menu again
                                    });
                                });                    
                                break;
                            case "1":
                                console.clear()
                                show_instagram_user();
                        }}
                break;
            case '2':// User profile
                console.clear();
                console.log(logged_in.curr_user.load_user_profile());
                console.log("--------------------------------------------------------------------------------");
                setTimeout(show_instagram_user, 1000); // Give some time for the output to be read before showing menu again
                break;
            case '3'://New post
                console.clear();
                console.log("\n--------------------------------------------------------------------------------");
                console.log("New post ");
                rl.question("Enter caption: ", (x) => { // new Post ([random media], text
                    x = x.trim().toLowerCase();
            
                    rl.question("Is this a news story, enter 1 if yes: ", (y) => { // new Post ([random media], text, is_news)
                        y = y.trim().toLowerCase();

                        rl.question("Enter media index 0 - 15: ", (z) => { // new Post ([random media], text, is_news)
                            z = z.trim().toLowerCase();

                            logged_in.curr_user.new_post(x, y ,z); // Now with all two inputs, create new post
                            console.log("Post Added");
                            console.log(logged_in.curr_user.posts[logged_in.curr_user.posts.length - 1].load_post()); 
                            //shows the new post as the last //enables us to see media
                    console.log("\n--------------------------------------------------------------------------------");
                    setTimeout(show_instagram_user, 1000); // Give some time for the output to be read before showing menu again
                        });
                    });
                });
                break;
            case '4'://Logout
                console.clear();
                show_instagram_app(); //back to instagram main app
                return; 
            default:
                console.log("Invalid option, please try again.");
                console.log("--------------------------------------------------------------------------------");
                rl.question('Select option: ', instagram_user_input);
                break;
        }
    }
    //#endregion

    //#region twitter app
    function twitter_app() { //twitter App
        console.log(`Twitter
1 => Login
2 => View all posts
3 => Exit `);
    }

    function show_twitter_app(){
        twitter_app();
        rl.question('Select option: ', twitter_app_input);
    }

    function twitter_app_input(x) {
        switch (x.trim()) {
            case '1'://Login
                console.clear();
                rl.question('Enter username: ', (username) => { // Function to login a specific user
                    let sess = twitter.login_auth(username.trim().toLowerCase()); // Login with username entered
                    if (!sess) {
                        console.log("Login failed.");
                        console.log("--------------------------------------------------------------------------------");
                        show_twitter_app();
                    } else {
                        logged_in = sess;
                        console.log("Logged in", logged_in.curr_user.username); // Welcome current user
                        show_twitter_user();
                    }
                });
                break;
            case '2'://View all post
                console.clear()
                console.log(twitter.view_all());
                setTimeout(show_twitter_app, 1000); // Give some time for the output to be read before showing menu again
                break;
            case '3'://Exit
                console.clear();
                show_social_menu();
                break; 
            default:
                console.log("Invalid option, please try again.");
                console.log("--------------------------------------------------------------------------------")
                rl.question('Select option: ', twitter_app_input);
                break;
        }
    }
    //#endregion
    
    //#region twitter user
    function twitter_user() {//twitter User
        console.log(`Social Networking platforms
1 => Feed
2 => User Profile
3 => New post
4 => Logout `);
    }

    function show_twitter_user(){
        twitter_user();
        rl.question('Select option: ', twitter_user_input);
    }

    function twitter_user_input(x) {
        switch (x.trim()) {
            case '1'://Feed
                console.clear();
                console.log(logged_in.curr_user.username);
                console.log(" ");
                const feed_out = logged_in.user_feed.map(post => post.load_post());
                console.log(feed_out);
                rl.question('Enter 0 to Report a post, 1 to exit feed: ', feed_menu);
                    function feed_menu(x){
                        switch (x.trim()) {
                            case "0":
                                rl.question("Enter post id: ", (post_id) => { // Get post ID from user
                                    post_id = post_id.trim().toLowerCase();
                                    rl.question("Report comment: ", (comment) => { // Get report comment from user
                                        comment = comment.toLowerCase();
                                        logged_in.report_by_post(post_id, comment);
                                        
                                    console.log("--------------------------------------------------------------------------------");
                                    setTimeout(show_twitter_user, 1000); // Give some time for the output to be read before showing menu again
                                    });
                                });                    
                                break;
                            case "1":
                                console.clear()
                                show_twitter_user();
                        }}
                break;
            case '2':// User profile
                console.clear();
                console.log(logged_in.curr_user.load_user_profile());
                console.log("--------------------------------------------------------------------------------");
                setTimeout(show_twitter_user, 1000); // Give some time for the output to be read before showing menu again
                break;
            case '3'://New post
                console.clear();
                console.log("\n--------------------------------------------------------------------------------");
                console.log("New post ");
                rl.question("Enter caption: ", (x) => { // new Post ([random media], text
                    x = x.trim().toLowerCase();
            
                    rl.question("Is this a news story, enter 1 if yes: ", (y) => { // new Post ([random media], text, is_news)
                        y = y.trim().toLowerCase();

                        rl.question("Enter media index 0 - 15: ", (z) => { // new Post ([random media], text, is_news)
                            z = z.trim().toLowerCase();

                            logged_in.curr_user.new_post(x, y ,z); // Now with all two inputs, create new post
                            console.log("Post Added");
                            console.log(logged_in.curr_user.posts[logged_in.curr_user.posts.length - 1].load_post()); 
                            //shows the new post as the last //enables us to see media
                    console.log("\n--------------------------------------------------------------------------------");
                    setTimeout(show_twitter_user, 1000); // Give some time for the output to be read before showing menu again
                        });
                    });
                });
                break;
            case '4'://Logout
                console.clear();
                show_twitter_app(); //back to twitter main app
                return; 
            default:
                console.log("Invalid option, please try again.");
                console.log("--------------------------------------------------------------------------------");
                rl.question('Select option: ', twitter_user_input);
                break;
        }
    }
    //#endregion
//#endregion

//#region iobp supermenu
function iobp_supermenu(){
    console.log(`IOBP Supermenu
1 => iobp Media Database
2 => Blockchain
3 => Social Network Clones
4 => Exit`)
}

function show_iobp_supermenu(){
    console.clear();
    iobp_supermenu();
    rl.question('Select option: ', supermenu_input);
}

function supermenu_input(x) {
    switch (x.trim()) {
        case '1'://iobp media database
            console.clear();
            console.log(db.media_db);
            rl.question("Enter media id to view media file data/timeline ", (x) => {
                console.clear();
                db.retrieve_med_record(x.trim())    
                console.log("--------------------------------------------------------------------------------")
            setTimeout(show_iobp_supermenu, 4000); // Give some time for the output to be read before showing menu again
                
            });
            break;
        case '2'://blockchain
            console.clear();
            show_blockchain_menu(); // load blockchain menu
            return;
        case '3'://social network clones
            console.clear();
            show_social_menu(); //load the menu for social media clones
            return; 
        case '4'://exit
            console.log("Exiting ...");
            rl.close();
            console.clear();
            return; // Stop the process
        default:
            console.log("Invalid option, please try again.");
            console.log("--------------------------------------------------------------------------------")
            rl.question('Select option: ', supermenu_input);
            break;
    }
}
//#endregion



console.clear();
show_iobp_supermenu();