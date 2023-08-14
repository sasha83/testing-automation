// https://drupalize.me/tutorial/connect-react-drupal-theme-or-module
/*
* @file
 * Global utilities.
 *
 */
console.log(1);
(function ($) {

    window.compareArray = [];
    if (getCookie('compareArray')) {
        window.compareArray = getCookie('compareArray');
        console.log('window.compareArray', window.compareArray);
    } else {
        console.log('nope');
    }


    $(document).ready(function () {
        'use strict';
        window.setTimeout(function () {
            $('.view-lighthouse-reports .view-content tbody').attr('id', 'lightHouseReports');
            new Sortable(lightHouseReports, {
                animation: 150,
                ghostClass: 'blue-background-class'
            });

            $('.compare').each(function () {
                let thisID = $(this).attr('data-nid');
                $(this).append('<input class="compare-toggle" type="checkbox" value="Compare" data-nid="' + thisID + '"></input>');
                $(this).parents('tr').attr('data-nid', thisID);
            });
            $('.compare-toggle').on('change', function () {
                if (window.compareArray) {
                    updateCompareArray($(this).attr('data-nid'), $(this).is(':checked'));
                } else {
                    window.compareArray = [];
                    updateCompareArray($(this).attr('data-nid'), $(this).is(':checked'));
                }
                // updateCompareArray($(this).attr('data-nid'), $(this).is(':checked'));
            });


        }, 500);
    });
    async function updateCompareArray(thisID, enabled) {
        if (window.compareArray.indexOf(thisID) == -1) {
            if (enabled == true) {
                window.compareArray.push(thisID);
                let reportObject = await getReportObjects(thisID);
                console.log(thisID, enabled, reportObject);
            } else {
            }
        } else {
            if (enabled == true) { }
            else {
                let tempArray = [];
                window.compareArray.forEach(function (nid) {
                    if (nid != thisID) {
                        tempArray.push(nid);
                    }
                });
                window.compareArray = tempArray;
            }
        }
        updateCompareTool();
        console.log(window.compareArray);
    }

    async function getReportObjects(thisID) {
        let reportObject = await $.getJSON('https://automate.ddev.site/reports-by-ids?id=' + thisID, {
            format: "JSON"
        }).done(async function (data) {
        });
        return reportObject;
    }
    async function updateCompareTool() {
        let thisID = window.compareArray.join('+');
        console.log(await getReportObjects(thisID));
        //         window.compareArray.forEach(function(thisID) {
        // )
        //         });
    }
    function buildCompareObject(idA, idB) {
        let compareObjectA = getReportObject(idA);
        let compareObjectB = getReportObject(idB);
        return compareObject;
    } function checkQuery(field) {
        var url = window.location.href;
        if (url.indexOf('?' + field + '=') != -1)
            return true;
        else if (url.indexOf('&' + field + '=') != -1)
            return true;
        return false
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

})(jQuery);

