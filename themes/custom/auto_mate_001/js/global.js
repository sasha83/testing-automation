/*
* @file
 * Global utilities.
 *
 */
//test
(function ($) {
    Drupal.behaviors.recentMeAutoRefresh = {
        attach: function (context, settings) {




            function percMeter(t, perc) {
                let val;
                if (!perc) {
                    val = t.text() * 100;
                } else {
                    val = perc * 100;;
                }

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
            $(meterEls).each(function (i) {
                percMeter($(this));
            });
            // jQuery.each(Drupal.views.instances, function (i, view) {


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
    } else {

    }









    function fieldFormatterJSON() {
        function buildJSONfield(t) {
            let fieldText = t.html();
            fieldText = JSON.parse(fieldText);
            let fieldJSON = '<pre>' + JSON.stringify(fieldText, null, "\t") + '</pre>';
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

        $(jsonFields).each(function () {
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

    function updateDomainScriptData() {
        window.domain_script_data = [];
        window.domain_script_list = [];
        window.domain_scripts = [];
        window.domain_url_data.forEach(function (url) {

            if (url && url != undefined && url.field_script_treemap_data) {
                url.field_script_treemap_data.nodes.forEach(function (scriptNode) {
                    if (!window.domain_script_list.includes(scriptNode.name)) {
                        window.domain_script_list.push(scriptNode.name);
                        window.domain_script_data[scriptNode.name] = {};
                        window.domain_script_data[scriptNode.name].resourceBytes = scriptNode.resourceBytes;
                    }
                    // $('.script-data-link[data-script-url="' + scriptNode.name + '"] .inactive-data .total-bytes').attr('data-test', scriptNode.resourceBytes)
                });

            }
        });
    }
    function getDomainURLData(url_ids) {

        let url_list = [];
        window.domain_url_data = [];

        url_ids.forEach(function (url_id) {
            let url_obj = {}
            url_obj.nid = url_id.nid;
            window.domain_url_data.push = url_obj;
            let reportURL = '/url-lighthouse-reports-rest/js-resources?url_id=' + url_id.nid;
            let currentURLID = url_id.nid;
            $.ajax({
                url: reportURL,
                context: document.body
            }).done(function (theData) {
                if (theData.length > 0) {

                    let formattedData = formatReportData(theData);
                    window.domain_url_data[url_id.nid] = formattedData;

                    window.domain_url_data[url_id.nid].url_id = currentURLID;

                    updateDomainScriptData();
                    updateJSResourcesBlock();
                    $(this).addClass("done");

                }
            });

        });

        let formatReportData = function (data) {

            if (data.length > 0) {
                const fieldsJSON = [
                    // 'field_network_requests',
                    // 'field_detected_javascript_librar',
                    'field_script_treemap_data'
                ];
                fieldsJSON.forEach(function (field_name) {
                    if (data[0][field_name] && data[0][field_name] != undefined) {
                        data[0][field_name] = JSON.parse(data[0][field_name].replaceAll('&quot;', '"'));
                    }
                });
                data[0].request_complete = true;
                return data[0];

            }
        }



    }

    function updateJSResourcesBlock(domainJSData) {
        let jsRecEl = $('.view-display-id-domain_page_url_js_resources');
        jsRecEl.empty();
        jsRecEl.append('<div class="domain-js-resources"></div>');
        jsRecEl.find('.domain-js-resources').append('<table class="domain-urls"><thead></thead><tbody></tbody></table>');
        jsRecEl.find('.domain-js-resources').append('<table class="domain-scripts"><thead></thead><tbody></tbody></table>');

        window.domain_url_data.forEach(function (d) {
            if (d && d != undefined && d.url_id) {
                jsRecElURLs = jsRecEl.find('table.domain-urls tbody').append('\
                <tr class="url-data-link-row testing-stuff" data-nid="'+ d.url_id + '">\
                <td class="url-data-link" data-nid="'+ d.url_id + '">' + d.field_requested_url + '\
                <div class="usage">\
                <div class="used"></div>\
                </div>\
                <div class="usage-data">\
                <span class="used-bytes"></span>\
                <span class="total-bytes"></span>\
                </div>\
                </td>\
                </tr>');

            }
        });

        window.domain_script_list.sort();
        window.domain_script_list.forEach(function (s) {
            // console.log('*****************', s);
            // $('.script-data-link[data-script-url="' + scriptNode.name + '"]').attr('data-resource-bytes', scriptNode.resourceBytes);
            jsRecEl.find('.domain-scripts tbody').append('\
            <tr class="script-data-link-row" data-script-url="'+ s + '" data-script-resource-bytes="' + window.domain_script_data[s].resourceBytes + '">\
            <td class="script-data-link" data-script-url="'+ s + '" data-script-resource-bytes="' + window.domain_script_data[s].resourceBytes + '">\
            <span class="script-name">'+ s + '</span>\
            <div class="usage">\
            <div class="used"></div>\
            </div>\
            <div class="inactive-data">\
            <span class="resource-bytes">'+ numberWithCommas(window.domain_script_data[s].resourceBytes) + ' bytes</span>\
            </div>\
            <div class="usage-data">\
            <span class="used-bytes"></span>\
            <span class="total-bytes"></span>\
            </div>\
            </td>\
            </tr>');
        });




        $('.url-data-link').on('click', function (url) {
            setURLAsActiveParentState($(this).attr('data-nid'));
        });
        $('.script-data-link').on('click', function (script) {
            let t = $(this);
            setActiveScriptState(t.attr('data-script-url'));

        });



    }
    function setURLAsActiveParentState(nid) {
        $('tr.url-data-link-row').removeClass('active active-child active-parent');
        $('td.url-data-link').removeClass('active active-child active-parent');
        $('tr.url-data-link-row[data-nid="' + nid + '"]').addClass('active active-parent');
        $('td.url-data-link[data-nid="' + nid + '"]').addClass('active active-parent');
        window.activeURL = nid;
        let url_scripts = window.domain_url_data[nid].field_script_treemap_data.nodes;
        $('tr.script-data-link-row').removeClass('active active-child active-parent');
        $('td.script-data-link').removeClass('active active-child active-parent');
        url_scripts.forEach(function (script) {
            setScriptAsActiveChild(script);
        });

    }
    function setURLAsActiveChildState(nid, script) {
        $('tr.url-data-link-row[data-nid="' + nid + '"]').addClass('active active-child');
        $('td.url-data-link[data-nid="' + nid + '"]').addClass('active active-child');

        let url = window.domain_url_data[nid];
        let url_script_usage = {};
        window.domain_url_data[nid].field_script_treemap_data.nodes.forEach(function (scriptNode) {
            if (scriptNode.name == script) {
                url_script_usage.unusedBytes = scriptNode.unusedBytes;
                url_script_usage.usedBytes = scriptNode.resourceBytes - url_script_usage.unusedBytes;
                url_script_usage.resourceBytes = scriptNode.resourceBytes;
                url_script_usage.usedPercentage = (scriptNode.resourceBytes - scriptNode.unusedBytes) / scriptNode.resourceBytes * 100;
            }
        });
        // console.log(url_script_usage);
        $('td.url-data-link[data-nid="' + nid + '"]').find('.used').css({ 'width': url_script_usage.usedPercentage + '%', 'background': 'hsl(' + (url_script_usage.usedPercentage * 120 / 100) + ', 50%, 60%)' });
        $('td.url-data-link[data-nid="' + nid + '"]').find('.used-bytes').html(numberWithCommas(url_script_usage.usedBytes));
        $('td.url-data-link[data-nid="' + nid + '"]').find('.total-bytes').html(numberWithCommas(url_script_usage.resourceBytes));

    }
    function setActiveScriptState(script) {
        $('tr.url-data-link-row').removeClass('active active-child active-parent');
        $('td.url-data-link').removeClass('active active-child active-parent');
        $('tr.script-data-link-row').removeClass('active active-child active-parent');
        $('td.script-data-link').removeClass('active active-child active-parent');

        $('tr.script-data-link-row[data-script-url="' + script + '"]').addClass('active active-parent');
        $('td.script-data-link[data-script-url="' + script + '"]').addClass('active active-parent');

        window.domain_url_data.forEach(function (url) {
            if (url.field_script_treemap_data.nodes) {
                let url_scripts = url.field_script_treemap_data.nodes;
                url_scripts.forEach(function (url_script) {
                    if (url_script.name == script) {

                        setURLAsActiveChildState(url.url_id, script);
                    }

                });

            }
        });

    }
    function setScriptAsActiveChild(script) {
        if (script.unusedBytes) {
            let used = script.resourceBytes - script.unusedBytes;
            let usedPercentage = (used / script.resourceBytes * 100);
            $('td.script-data-link[data-script-url="' + script.name.trim() + '"]').find('.used').css({ 'width': usedPercentage + '%', 'background': 'hsl(' + (usedPercentage * 120 / 100) + ', 50%, 60%)' });
            $('td.script-data-link[data-script-url="' + script.name.trim() + '"]').find('.used').css({ 'width': usedPercentage + '%' });

            $('td.script-data-link[data-script-url="' + script.name.trim() + '"]').find('.used-bytes').html(numberWithCommas(used));
            $('td.script-data-link[data-script-url="' + script.name.trim() + '"]').find('.total-bytes').html(numberWithCommas(script.resourceBytes));
        }
        $('tr.script-data-link-row[data-script-url="' + script.name.trim() + '"]').addClass('active active-child');
        $('td.script-data-link[data-script-url="' + script.name.trim() + '"]').addClass('active active-child');

        // $('td.script-data-link[data-script-url="'+script.name.trim()+'"]').find('.useage').css('');

    }
    function domainPageJavaScriptResources() {
        let domainID = $('#page-data-block').attr('data-nid');
        let domainURL = '/urls?domain_id=' + domainID;
        $.ajax({
            url: domainURL,
            context: document.body
        }).done(function (theData) {
            window.domainURLs = theData;

            getDomainURLData(theData);
            $(this).addClass("done");
        });






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
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
})(jQuery);


