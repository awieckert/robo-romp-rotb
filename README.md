# NSS Frontend Capstone: Robo-Romp: Revenge of the Bots!

# Tech Specs:
Create a website that utilizes the following, emphasis on full CRUD.
* React.js
* Firebase CRUD
* Bootstrap 3.3    >_<

# Technologies Utilized:
1. JavaScript, CSS and HTML5
1. React.js: Component encapsulation and state management
1. React-Router: Dynamic Routing
1. React-bootstrap: Grid based page layout
1. Animate.css: built in and customized animations
1. Bttn.css: customized button styling and animations
1. Firebase 5.2.0: User authentication and data storage

# Description:
One on one combat game for humiliating your friends publicly. Ages 13 and up.
* User must create an account to join the fight for galactic dominance. During account creation user must specify a username, this will be their unique identifier throughout the game.

* Once users log into the application they will gain access to the Game Mode selection page. Here they will be able to select between an online game against another user or a single player battle against a computer opponent. This screen also prominently displays Leader Boards for both styles of play and access to the users profile page.

* Accessing the User Profile page from the Game Mode screen displays statistics for the logged in user. Stats include: Wins and loses for single and online play, the user's favorite battle bots, and career statistics such as total games played and damage done across all game modes.

* Single Player: Users make their selection from 8 different robots. Each robot has unique stats and special ability that make for different fighting styles. After selection the computer randomly selects a robot that is not the users. In the fight arena the "A" key is used for basic attacks while the "S" key is used to unleash the robots special ability once it is charged.

* Online Play: Similar to single player games, except that you will battle another human opponent in real time. When on the Game Mode page, User1 must create the online match such that User2 can join by selecting the correct "Join Game" from within the online games list. Once user2 has joined the correct game both users will share the same game instance. Fight mechanics are the same as in Single Player mode.

* Once a winner is determined both users will be directed to the winner screen. This page is where the winner is glorified and losers are shamed! Option to play again is provided by a "Select Game Mode" button.

# Video Demos:
User Registration and Login:\
![userlogin](https://raw.githubusercontent.com/awieckert/robo-romp-rotb/master/screenShots/capstone1.gif)

User Profile:\
![userProfile](https://raw.githubusercontent.com/awieckert/robo-romp-rotb/master/screenShots/capstone2.gif)

Single Player and Online Play Options. Robot Selection:\
![gameModes](https://raw.githubusercontent.com/awieckert/robo-romp-rotb/master/screenShots/capstone3.gif)

Combat:\
![combat](https://raw.githubusercontent.com/awieckert/robo-romp-rotb/master/screenShots/capstone4.gif)

Winner Screen:\
![winnerScreen](https://raw.githubusercontent.com/awieckert/robo-romp-rotb/master/screenShots/capstone5.gif)

# How to Run:
1. Clone down repo https://github.com/awieckert/robo-romp-rotb
1. In root of cloned folder run `npx create-react-app react-setup`
1. Rename `src/constants.js.example` to `src/constants.js`
1. Create a free firebase database and add unique info to `src/constants.js`
1. Use seed data in `src/db/` to start your database
1. In root of project Run `npm install`
1. `npm start` to host site locally

# Link to deployed Site:
[Robo-Romp: Revenge of the Bots!](https://robo-romp-rotb.firebaseapp.com/)

# Specs By:
[Nashville Software School](https://github.com/nashville-software-school)\
[Zoe Ames](https://github.com/zoeames)\
[Callan Morrison](https://github.com/morecallan)\
[Lauren Rouse](https://github.com/rousell)

# Contributors:
[Adam Wieckert](https://github.com/awieckert)

# Credit to:
[Animate.css](https://github.com/daneden/animate.css)\
[Bttn.css](https://bttn.surge.sh/)
