import { Component } from './lib';
import request from 'request';

class Page extends Component {
	constructor(registry, props) {
		super(registry, props);
	}

	componentId() {
		return 'page';
	}

	staticMarkup() {
		const cid = this.componentId();
		return '<div id="' + cid +'">Loading page...</div>';
	}

	getData(done) {
		const self = this;
		setTimeout(() => {
			self.query = 'stackle';
			done(null);
		}, 2000);
	}

	render() {
		const cid = this.componentId();
		const searchComponent = new DynamicSearch(this.registry, this.query);
		return '<div id="' + cid + '">' + searchComponent.staticMarkup() + '</div>';
	}
}

class DynamicSearch extends Component {
	constructor(registry, props) {
		super(registry, props);
	}

	componentId() {
		return 'search';
	}

	staticMarkup() {
		const cid = this.componentId();
		return '<div id="' + cid +'">Searching...</div>';
	}

	getData(done) {
		const self = this;
		const url = 'https://api.github.com/users/' + this.props + '/repos';
		const headers = {
			'User-Agent': 'mozilla'
		};
		request({url: url, headers: headers}, function(err, res, body) {
			// console.log(err, res, body);
			self.repos = JSON.parse(body);
			done(null);
		});
	}

	render() {
		const cid = this.componentId();
		return '<div id="' + cid + '">First repo name:' + this.repos[0].name + '</div>';
	}
}

export default {
	Page: Page,
	DynamicSearch: DynamicSearch
}