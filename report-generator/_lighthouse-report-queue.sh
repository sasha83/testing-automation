mkdir lighthouse
mkdir lighthouse/002
mkdir ../sites/default/files/_lighthouse_report_staging
lighthouse https://skillpointe.com/ --output json > lighthouse/002/skillpointe-home.json --headless
lighthouse https://skillpointe.com/startpointe --output json > lighthouse/002/skillpointe-startpointe.json --headless
lighthouse https://skillpointe.com/provider --output json > lighthouse/002/skillpointe-provider.json --headless
lighthouse https://skillpointe.com/provider/anne-arundel-community-college-certificate-programs --output json > lighthouse/002/skillpointe-provider_anne-arundel.json --headless
lighthouse https://skillpointe.com/jobs --output json > lighthouse/002/skillpointe-jobs.json --headless
lighthouse https://skillpointe.com/training --output json > lighthouse/002/skillpointe-training.json --headless
lighthouse https://skillpointe.com/careers --output json > lighthouse/002/skillpointe-careers.json --headless
lighthouse https://skillpointe.com/careers/construction --output json > lighthouse/002/skillpointe-careers-construction.json --headless
lighthouse https://skillpointe.com/careers/construction/plumber --output json > lighthouse/002/skillpointe-careers-construction-plumber.json --headless
lighthouse https://skillpointe.com/careers/construction/carpenter --output json > lighthouse/002/skillpointe-careers-construction-carpenter.json --headless
lighthouse https://skillpointe.com/financial-resources --output json > lighthouse/002/skillpointe-financial-resources.json --headless
lighthouse https://skillpointe.com/about --output json > lighthouse/002/skillpointe-about.json --headless
lighthouse https://skillpointe.com/contact-us --output json > lighthouse/002/skillpointe-contact-us.json --headless
lighthouse https://skillpointe.com/news-and-advice --output json > lighthouse/002/skillpointe-news-and-advice.json --headless
lighthouse https://www.nataliagill.com/blog-posts/chocolate-chip-soaked-baked-oatmeal --output json > lighthouse/002/nataliagill.com-01.json --headless
lighthouse https://www.nataliagill.com/blog-posts/3-major-benefits-to-eatong-solid-breakfast --output json > lighthouse/002/nataliagill.com-02.json --headless
lighthouse https://www.nataliagill.com/blog-posts/2012/04/11/drumstick-broth --output json > lighthouse/002/nataliagill.com-03.json --headless
lighthouse https://www.nataliagill.com/blog-posts/the-best-pan-fried-chicken --output json > lighthouse/002/nataliagill.com-04.json --headless
lighthouse https://www.nataliagill.com/blog-posts/gut-healthy-carb-sources --output json > lighthouse/002/nataliagill.com-05.json --headless
lighthouse https://www.nataliagill.com/blog-posts/how-low-carb-diets-take-a-toll --output json > lighthouse/002/nataliagill.com-06.json --headless
lighthouse https://www.nataliagill.com/blog-posts/2018/04/25/pineapple-chicken-paleo-whole30 --output json > lighthouse/002/nataliagill.com-07.json --headless
lighthouse https://www.nataliagill.com/blog-posts/2018/04/23/how-to-freeze-thyme --output json > lighthouse/002/nataliagill.com-08.json --headless
lighthouse https://www.nataliagill.com/contact --output json > lighthouse/002/nataliagill.com-09.json --headless
lighthouse https://www.nataliagill.com --output json > lighthouse/002/nataliagill.com-10.json --headless
lighthouse https://www.nataliagill.com/instagram-links --output json > lighthouse/002/nataliagill.com-11.json --headless
lighthouse https://www.nataliagill.com/about --output json > lighthouse/002/nataliagill.com-12.json --headless
lighthouse https://www.nataliagill.com/work-with-me --output json > lighthouse/002/nataliagill.com-13.json --headless
lighthouse https://www.nataliagill.com/blog --output json > lighthouse/002/nataliagill.com-14.json --headless

node build-csvs-from-lighthouse-json.js