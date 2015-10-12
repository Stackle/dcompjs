import express from 'express';
import { Registry, SeoRegistry } from './lib';
import { Page, DynamicSearch } from './components';

const app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
	const reg = new Registry(req, res);
	const page = new Page(reg, null);

	res.write('<html><head><script src="/js/sdk.js"></script></head><body>');
	res.write(page.render());
});

app.get('/seo', function(req, res) {
	const reg = new SeoRegistry();
	const page = new Page(reg, null);
	
	reg.onEnd(() => {
		res.send('<html><head></head><body>' + page.render() + '</body></html>');
	});
});

app.listen(5000);
console.log("Listening at port 5000");