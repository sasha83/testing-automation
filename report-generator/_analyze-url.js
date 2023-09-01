const childProcess = require('child_process');
const request = require('request');
const util = require('util')
const fs = require("fs");
let url_id = 0;
const outFolder = '../sites/default/files/_url_stats';
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let i = 0;
let url_stats = {};



async function doRequest(url) {
        return new Promise(function (resolve, reject) {
                request(url, function (error, res, body) {
                        if (!error && res.statusCode == 200) {
                                let queueArray = JSON.parse(body);
                                resolve(body);
                                if (queueArray.length > 0) {
                                        url_stats.nid = url_id;
                                        url_stats.cls = {
                                                'max': {
                                                        'val': queueArray.sort(dynamicSort('-field_cumulative_layout_shift'))[0].field_cumulative_layout_shift,
                                                        'id': queueArray.sort(dynamicSort('-field_cumulative_layout_shift'))[0].nid
                                                },
                                                'min': {
                                                        'val': queueArray.sort(dynamicSort('field_cumulative_layout_shift'))[0].field_cumulative_layout_shift,
                                                        'id': queueArray.sort(dynamicSort('field_cumulative_layout_shift'))[0].nid
                                                },
                                                'avg': propAvg(queueArray, 'field_cumulative_layout_shift')
                                        };


                                        url_stats.fcp = {
                                                'max': {
                                                        'val': queueArray.sort(dynamicSort('-field_first_contentful_paint'))[0].field_first_contentful_paint,
                                                        'id': queueArray.sort(dynamicSort('-field_first_contentful_paint'))[0].nid
                                                },
                                                'min': {
                                                        'val': queueArray.sort(dynamicSort('field_first_contentful_paint'))[0].field_first_contentful_paint,
                                                        'id': queueArray.sort(dynamicSort('field_first_contentful_paint'))[0].nid
                                                },
                                                'avg': propAvg(queueArray, 'field_first_contentful_paint')
                                        };


                                        url_stats.fmp = {
                                                'max': {
                                                        'val': queueArray.sort(dynamicSort('-field_first_meaningful_paint'))[0].field_first_meaningful_paint,
                                                        'id': queueArray.sort(dynamicSort('-field_first_meaningful_paint'))[0].nid
                                                },
                                                'min': {
                                                        'val': queueArray.sort(dynamicSort('field_first_meaningful_paint'))[0].field_first_meaningful_paint,
                                                        'id': queueArray.sort(dynamicSort('field_first_meaningful_paint'))[0].nid
                                                },
                                                'avg': propAvg(queueArray, 'field_first_meaningful_paint')
                                        };



                                        url_stats.lcp = {
                                                'max': {
                                                        'val': queueArray.sort(dynamicSort('-field_largest_contentful_paint'))[0].field_largest_contentful_paint,
                                                        'id': queueArray.sort(dynamicSort('-field_largest_contentful_paint'))[0].nid
                                                },
                                                'min': {
                                                        'val': queueArray.sort(dynamicSort('field_largest_contentful_paint'))[0].field_largest_contentful_paint,
                                                        'id': queueArray.sort(dynamicSort('field_largest_contentful_paint'))[0].nid
                                                },
                                                'avg': propAvg(queueArray, 'field_largest_contentful_paint')
                                        };


                                        url_stats.tbt = {
                                                'max': {
                                                        'val': queueArray.sort(dynamicSort('-field_total_blocking_time'))[0].field_total_blocking_time,
                                                        'id': queueArray.sort(dynamicSort('-field_total_blocking_time'))[0].nid
                                                },
                                                'min': {
                                                        'val': queueArray.sort(dynamicSort('field_total_blocking_time'))[0].field_total_blocking_time,
                                                        'id': queueArray.sort(dynamicSort('field_total_blocking_time'))[0].nid
                                                },
                                                'avg': propAvg(queueArray, 'field_total_blocking_time')
                                        };

                                        writeToCSV(url_stats);
                                        console.log('url_stats: ', url_stats);

                                }
                        } else {
                                reject(error);
                        }
                });
        });
}
// function propAvg(property) {
//         let avg = filteredData.reduce((r, c) => r + c[property], 0)
//         return avg;
// }
function writeToCSV(url_stats) {
        let headers = [
                { id: 'nid', title: 'ID' },
                { id: 'cls_max', title: 'CLS Max' },
                { id: 'cls_max_lh_nid', title: 'CLS Max LHR ID' },
                { id: 'cls_min', title: 'CLS Min' },
                { id: 'cls_min_lh_nid', title: 'CLS Min LHR ID' },
                { id: 'cls_avg', title: 'CLS Average' },
                { id: 'fcp_max', title: 'FCP Max' },
                { id: 'fcp_max_lh_nid', title: 'FCP Max LHR ID' },
                { id: 'fcp_min', title: 'FCP Min' },
                { id: 'fcp_min_lh_nid', title: 'FCP Min LHR ID' },
                { id: 'fcp_avg', title: 'FCP Average' },
                { id: 'fmp_max', title: 'FMP Max' },
                { id: 'fmp_max_lh_nid', title: 'FMP Max LHR ID' },
                { id: 'fmp_min', title: 'FMP Min' },
                { id: 'fmp_min_lh_nid', title: 'FMP Min LHR ID' },
                { id: 'fmp_avg', title: 'FMP Average' },
                { id: 'lcp_max', title: 'LCP Max' },
                { id: 'lcp_max_lh_nid', title: 'LCP Max LHR ID' },
                { id: 'lcp_min', title: 'LCP Min' },
                { id: 'lcp_min_lh_nid', title: 'LCP Min LHR ID' },
                { id: 'lcp_avg', title: 'LCP Average' },
                { id: 'tbt_max', title: 'TBT Max' },
                { id: 'tbt_max_lh_nid', title: 'TBT Max LHR ID' },
                { id: 'tbt_min', title: 'TBT Min' },
                { id: 'tbt_min_lh_nid', title: 'TBT Min LHR ID' },
                { id: 'tbt_avg', title: 'TBT Average' }
        ];
        headers.forEach(function (header) {
                header.title = header.id;
        });
        let content = [{
                'nid': url_stats.nid,
                'cls_max': url_stats.cls.max.val,
                'cls_max_lh_nid': parseInt(url_stats.cls.max.id),
                'cls_min': url_stats.cls.min.val,
                'cls_min_lh_nid': parseInt(url_stats.cls.min.id),
                'cls_avg': url_stats.cls.avg,
                'fcp_max': url_stats.fcp.max.val,
                'fcp_max_lh_nid': url_stats.fcp.max.id,
                'fcp_min': url_stats.fcp.min.val,
                'fcp_min_lh_nid': url_stats.fcp.min.id,
                'fcp_avg': url_stats.fcp.avg,
                'fmp_max': url_stats.fmp.max.val,
                'fmp_max_lh_nid': url_stats.fmp.max.id,
                'fmp_min': url_stats.fmp.min.val,
                'fmp_min_lh_nid': url_stats.fmp.min.id,
                'fmp_avg': url_stats.fmp.avg,
                'lcp_max': url_stats.lcp.max.val,
                'lcp_max_lh_nid': url_stats.lcp.max.id,
                'lcp_min': url_stats.lcp.min.val,
                'lcp_min_lh_nid': url_stats.lcp.min.id,
                'lcp_avg': url_stats.lcp.avg,
                'tbt_max': url_stats.tbt.max.val,
                'tbt_max_lh_nid': url_stats.tbt.max.id,
                'tbt_min': url_stats.tbt.min.val,
                'tbt_min_lh_nid': url_stats.tbt.min.id,
                'tbt_avg': url_stats.tbt.avg
        }];
        const csvWriter = createCsvWriter({
                path: outFolder + '/' + url_stats.nid + '.csv',
                header: headers,
        });
        csvWriter
                .writeRecords(content)
                .then(() => console.log('The CSV file was written successfully'));

}

const propAvg = (arr, property) => {
        const { length } = arr;
        return arr.reduce((acc, val) => {
                return acc + (val[property] / length);
        }, 0);
};

function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
        }
        return function (a, b) {
                /* next line works with strings and numbers, 
                 * and you may want to customize it to your needs
                 */
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
        }
}

process.argv.forEach(function (val, index, array) {
        if (i == 2) {
                url_id = val;
        }
        i++;
});
console.log(url_id);
// fs.writeFile(shFilename, shOutput, (err) => {
//         if (err) throw err;
// })










let url = 'http://automate.ddev.site/url-lighthouse-reports-rest?url_id=' + url_id;
doRequest(url);