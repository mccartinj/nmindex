const fs = require('fs');
const cheerio = require('cheerio');
const objectsToCSV = require('objects-to-csv');

//added this in after first wave of analysis
const exclusions = require('./data/exclusions.json');


(async () => {
	try {


		//use cheerio to extract all the links from the saved version of <newmodels.io/archive> pulled from archive.org
		const $ = cheerio.load(fs.readFileSync('./data/nm-archive-20211027.html'));
		let links = [];
		$('a').each(function(i,elem) {
			links[i] = $(this).attr('href');
		});

		
		//extract the domain from each link and add it to an array
		let domains = [];
		for (let link of links) {
			let url = new URL(link);
			let domain = url.hostname;
			domains.push(domain);
		}

		//create an array of unique domains
		domains_uniq = [...new Set(domains)];

		const domainCount = domains.reduce((accumulator, value) => {
		  accumulator[value] = ++accumulator[value] || 1;

		  return accumulator;
		}, {});

		let domainData = [];


		for (let domain in domainCount ) {
			let data = {};
			data.url = domain;
			data.count = domainCount[domain];
			domainData.push(data)
		}

		/* write outputs */


		fs.writeFile('./outputs/links.json', JSON.stringify(links), 'utf8', () => {
			console.log('written links.json')
		});

		fs.writeFile('./outputs/domains_uniq.json', JSON.stringify(domains_uniq), 'utf8', () => {
			console.log('written domains_uniq.json')
		});

		fs.writeFile('./outputs/domain_data.json', JSON.stringify(domainData), 'utf8', () => {
			console.log('written domain_data.json')
		});

		let csv = new objectsToCSV(domainData);
		await csv.toDisk('./outputs/domain_data.csv',header=true);



		/* clean up the domains json after analyzing the outputs */

		let domainDataClean = domainData.filter((d)=>{
			return !exclusions.includes(d.url)
		})

		domainDataClean = domainDataClean.sort((a,b)=>{
			return b.count - a.count;
		});

		console.log(domainDataClean);
		

		fs.writeFile('./outputs/domain_data_clean.json', JSON.stringify(domainDataClean), 'utf8', () => {
			console.log('written domain_data_clean.json')
		});

		let csvClean = new objectsToCSV(domainDataClean);
		await csvClean.toDisk('./outputs/domain_data_clean.csv',header=true);
		


	} catch(error) {
		console.log(error)
	}
})();

