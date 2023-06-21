/*
* @file
 * Global utilities.
 *
 */
console.log(1);
(function($){
    console.log(2);
    $(document).ready(function(){
        'use strict';
        console.log(3);
        // views-field-title
        // $('.view-content').sortable();
        window.setTimeout(function(){
            $('.view-lighthouse-reports .view-content tbody').attr('id', 'lightHouseReports');
            new Sortable(lightHouseReports, {
                animation: 150,
                ghostClass: 'blue-background-class'
            });
    
        }, 2000);
    });
})(jQuery);
