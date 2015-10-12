import { Component } from './lib';
import request from 'request';

class Page extends Component {
	constructor(registry, props) {
		super(registry, props);
		this.state = 0;
	}

	componentId() {
		return 'page';
	}

	getData(res) {
		const self = this;
		if (self.state === 0) {
			setTimeout(() => {
				self.state = 1;
				res.progress();
			}, 1000);
		}
		if (self.state === 1) {
			setTimeout(() => {
				self.state = 2;
				self.searchComponent1 = new DynamicSearch(self.registry, 'stackle');
				self.searchComponent2 = new DynamicSearch(self.registry, 'facebook');
				res.end();
			}, 2000);
		}
	}

	render() {
		const cid = this.componentId();

		if (this.state === 0) {
			return '<div id="' + cid +'">Loading page...</div>';
		}
		else if (this.state === 1) {
			return '<div id="' + cid +'">Progress update...</div>';
		}
		else if (this.state === 2) {
			return '<div id="' + cid + '">Search Component: ' + this.searchComponent1.render() + this.searchComponent2.render() + '</div>';
		}
	}
}

class DynamicSearch extends Component {
	constructor(registry, props) {
		super(registry, props);
	}

	componentId() {
		return 'search-' + this.props;
	}

	getData(cycle) {
		const self = this;
		const url = 'https://api.github.com/users/' + this.props + '/repos';
		const headers = {
			'User-Agent': 'mozilla'
		};
		request({url: url, headers: headers}, function(err, res, body) {
			self.repos = JSON.parse(body);
			cycle.end();
		});
	}

	render() {
		const cid = this.componentId();
		if (!this.repos) {
			return '<div id="' + cid +'">Searching...</div>';
		}
		else {
			return '<div id="' + cid + '">First repo name of ' + this.props + ' is:' + this.repos[0].name + '</div>';	
		}
	}
}

export default {
	Page: Page,
	DynamicSearch: DynamicSearch
}