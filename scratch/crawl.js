const fs = require('fs');
const cheerio = require('cheerio');
const objectsToCSV = require('objects-to-csv');
const domainDataClean = require('./outputs/domain_data_clean.json');
const Crawler = require('crawler')




(async () => {
	try {
		console.log(domainDataClean);

		const c = new Crawler({
		    maxConnections: 1,

		    callback: (error, res, done) => {
		        if (error) {
		            console.log(error);
		        } else {
		            const $ = res.$;
		            
		            console.log($('title').text());
		        }
		        done();
		    }
		});

		
		// Queue just one URL, with default callback
		c.queue('http://www.amazon.com');


	} catch(error) {
		console.log(error)
	}
})();
