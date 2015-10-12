var stopCode = undefined;

class Registry {
	constructor(req, res) {
		this.request = req;
		this.response = res;
		this.count = 0;
	}

	register(component) {
		this.count++;
		setImmediate(() => {
			component.getData((err) => {
				if (err === stopCode) {
					this.checkCount();
					return;
				}

				const id = component.componentId();
				const markup = component.render();
				this.response.write('<script>sdk.arrive(' + JSON.stringify(id) + ', ' + JSON.stringify(markup) + ')</script>');
				this.checkCount();
			}.bind(this));	
		}.bind(this));
	}

	checkCount() {
		this.count--;
		if (this.count <= 0) {
			this.response.end('</body></html>');
		};
	}
}

class Component {
	constructor(registry, props) {
		this.registry = registry;
		this.props = props;

		this.staticMarkup = this.staticMarkup.bind(this);
		this.componentId = this.componentId.bind(this);
		this.getData = this.getData.bind(this);
		this.render = this.render.bind(this);

		registry.register(this);
	}

	staticMarkup() {
		const cid = this.componentId();
		return '<div id="' + cid +'">Default markup</div>';
	}

	componentId() {
		return 'default';
	}

	getData(done) {
		done(stopCode);
	}

	render() {
		const cid = this.componentId();
		return '<div id="' + cid +'">After Data arrive</div>';
	}
}

export default {
	Registry: Registry,
	Component: Component
}