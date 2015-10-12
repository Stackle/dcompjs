import express from 'express';
import { Registry } from './lib';
import { Page, DynamicSearch } from './components';

const app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
	const reg = new Registry(req, res);

	res.write('<html><head><script src="/js/sdk.js"></script></head><body>');

	const page = new Page(reg, null);
	res.write(page.staticMarkup());
});

app.listen(5000);
console.log("Listening at port 5000");