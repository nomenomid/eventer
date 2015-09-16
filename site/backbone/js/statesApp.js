/* globals statesApp */

$(function() {
    new statesApp.MainView();    
    statesApp.States.fetch();
});