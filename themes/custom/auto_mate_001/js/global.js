/*
* @file
 * Global utilities.
 *
 */
//test
(function ($) {
    Drupal.behaviors.recentMeAutoRefresh = {
        attach: function (context, settings) {




            function percMeter(t) {
                let val = t.text() * 100;
                val = Math.round(val);
                // t.html('<span class="perc-value">'+val+'</span>');
                t.append('<div class="percentage-meter"><div class="percentage-amount" style="width: ' + val + '%; background-color: hsl(' + ((val * 120 / 100)) + ', 50%, 60%);"></div></div>');
            }

            let meterFields = [
                '.view-domain-page .views-field-field-cls-average',
                '.view-domain-page .views-field-field-fcp-average',
                '.view-domain-page .views-field-field-fmp-average',
                '.view-domain-page .views-field-field-lcp-average',
                '.view-domain-page .views-field-field-tbt-average',
                '.view-id-lighthouse_reports.view-display-id-block_4 .views-field-field-largest-contentful-paint',
                '.view-id-lighthouse_reports.view-display-id-block_4 .views-field-field-total-blocking-time',
                '.view-id-lighthouse_reports.view-display-id-block_4 .views-field-field-cumulative-layout-shift',
                '.view-id-lighthouse_reports.view-display-id-block_4 .views-field-field-first-contentful-paint',
                '.view-id-lighthouse_reports.view-display-id-block_4 .views-field-field-first-meaningful-paint'
            ];
            let meterEls = meterFields.join(', ');
            // console.log(meterEls);
            $(meterEls).each(function (i) {
                // console.log(i);
                percMeter($(this));
            });
            // jQuery.each(Drupal.views.instances, function (i, view) {
            //     console.log('view: ', view);
            //     console.log('i: ', i);
            //     if (view.settings.view_display_id == "lighthouse_comparison_tool") {
            //         view.settings.view_args = '27704';
            //         $('.view-display-id-lighthouse_comparison_tool').trigger('RefreshView');
            //     }

            // });
        }
    };
})(jQuery);

(function ($) {










    window.compareArray = [];
    if (getCookie('compareArray')) {
        window.compareArray = getCookie('compareArray');
        // console.log('window.compareArray', window.compareArray);
    } else {
        // console.log('nope');
    }




    




    function fieldFormatterJSON() {
        function buildJSONfield(t) {
            let fieldText = t.html();
            fieldText = JSON.parse(fieldText);
            let fieldJSON = '<pre>' + JSON.stringify(fieldText, null, "\t") + '</pre>';
            // console.log(fieldJSON);
            return fieldJSON;
        }
    
    
        let jsonFields = [
            // '.field--name-field-user-agent',
            '.field--name-field-environment .field__item',
            '.field--name-field-config-settings .field__item',
            // '.field--name-field-category-groups .field__item',
            // '.field--name-field-categories .field__item',
            '.field--name-field-critical-request-chains .field__item',
            // '.field--name-field-ensure-csp-xss .field__item',
            '.field--name-field-final-screenshot .field__item',
            '.field--name-field-detected-javascript-librar .field__item',
            '.field--name-field-largest-contentful-paint-e .field__item',
            '.field--name-field-layout-shift-elements .field__item',
            '.field--name-field-long-tasks .field__item',
            '.field--name-field-main-thread-tasks .field__item',
            '.field--name-field-metrics .field__item',
            '.field--name-field-network-requests .field__item',
            '.field--name-field-network-rtt .field__item',
            '.field--name-field-network-server-latency .field__item',
            '.field--name-field-resource-summary .field__item',
            '.field--name-field-screenshot-thumbnails .field__item',
            '.field--name-field-script-treemap-data .field__item'
        ];
        jsonFields = jsonFields.join(', ');
    
        $(jsonFields).each(function(){
            $(this).html(buildJSONfield($(this)));
        });
    }


    $(document).ready(function () {
        'use strict';
        // window.setTimeout(function () {
        //     $('.view-lighthouse-reports-url .view-content tbody').attr('id', 'lightHouseReports');
        //     new Sortable(lightHouseReports, {
        //         animation: 150,
        //         ghostClass: 'blue-background-class'
        //     });

        //     $('.compare').each(function () {
        //         let thisID = $(this).attr('data-nid');
        //         $(this).append('<input class="compare-toggle" type="checkbox" value="Compare" data-nid="' + thisID + '"></input>');
        //         $(this).parents('tr').attr('data-nid', thisID);
        //     });
        //     $('.compare-toggle').on('change', function () {
        //         if (window.compareArray) {
        //             updateCompareArray($(this).attr('data-nid'), $(this).is(':checked'));
        //         } else {
        //             window.compareArray = [];
        //             updateCompareArray($(this).attr('data-nid'), $(this).is(':checked'));
        //         }
        //     });

        // }, 500);
        fieldFormatterJSON();
        domainPageJavaScriptResources();


        window.setInterval(function () {
            if (window.compareArray.length > 0) {
                var selector = '.view-display-id-lighthouse_comparison_tool';
                // let viewSettings = window.compareArray.join('+');
                let viewSettings = 29165;
                Drupal.settings.views.ajaxViews['view_display_id:lighthouse_comparison_tool'] = viewSettings;
                $(selector).triggerHandler('RefreshView');
            }
        }, 5000);
    });
    function getDomainURLData(url_ids) {
        console.log('url_ids: ', url_ids);
        let url_list = [];
        url_ids.forEach(function(url_id) {
            url_list.push(parseInt(url_id.nid));
        });
        console.log('url_list: ', url_list.join(','));
        window.domain_url_list = url_list;
    }
    function domainPageJavaScriptResources() {  
            let domainID = $('#page-data-block').attr('data-nid');
            let ajaxURL = '/urls?domain_id='+domainID;
            console.log('domainID: ', domainID);
            console.log('ajaxURL: ', ajaxURL);
            $.ajax({
                url: ajaxURL,
                context: document.body
              }).done(function(theData) {
                console.log('theData: ', theData);
                window.domainURLs = theData;
                window.domainURLData = getDomainURLData(theData);
                $( this ).addClass( "done" );
              });
            // 'https://automate.ddev.site/urls?domain_id="'+domainID+'"';
            let urlNodeData = [];
            // let urlNodeIDs = 'https://automate.ddev.site/urls?domain_id="'+domainID+'"';

            // urlNodeIDs.forEach(function() {
            //     urlNodeData.push(getURLResourceData(urlNodeID));
            // });

    }
    function getURLResourceData(urlNodeID) {
        let urlResourceData = {};
        return urlResourceData;
    }
    async function updateCompareArray(thisID, enabled) {
        if (window.compareArray.indexOf(thisID) == -1) {
            if (enabled == true) {
                window.compareArray.push(thisID);
                let reportObject = await getReportObjects(thisID);
                // console.log(thisID, enabled, reportObject);
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
        // console.log(window.compareArray);
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
        // console.log(await getReportObjects(thisID));
        //         window.compareArray.forEach(function(thisID) {
        // )
        //         });
    }
    function buildCompareObject(idA, idB) {
        let compareObjectA = getReportObject(idA);
        let compareObjectB = getReportObject(idB);
        return compareObject;
    }
    function checkQuery(field) {
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

