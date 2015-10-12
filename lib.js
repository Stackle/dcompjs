var stopCode = undefined;

class LifeCycle {
	constructor() {
		this.listener = {
			end: [],
			progress: [],
			afterEnd: null
		};
	}

	end() {
		setImmediate(() => {
			this.listener.end.forEach((fn) => fn());
			this.listener.afterEnd();
		});
	}

	onEnd(fn) {
		this.listener.end.push(fn);
	}

	onAfterEnd(fn) {
		this.listener.afterEnd = fn;
	}

	onProgress(fn) {
		this.listener.progress.push(fn);
	}

	progress() {
		setImmediate(() => {
			this.listener.progress.forEach((fn) => fn());
		});
	}
}

class Registry {
	constructor(req, res) {
		this.request = req;
		this.response = res;
		this.count = 0;

		this.sendMarkup = this.sendMarkup.bind(this);
		this.checkCount = this.checkCount.bind(this);
	}

	register(component) {
		this.count++;
		const cycle = new LifeCycle();

		const send = this.sendMarkup.bind(null, component);

		cycle.onEnd(send);
		cycle.onProgress(send);
		cycle.onProgress(component.getData.bind(component, cycle));
		cycle.onAfterEnd(this.checkCount);

		setImmediate(component.getData.bind(component, cycle));
	}

	sendMarkup(component) {
		const id = component.componentId();
		const markup = component.render();
		this.response.write('<script>sdk.arrive(' + JSON.stringify(id) + ', ' + JSON.stringify(markup) + ')</script>');
	}

	checkCount() {
		this.count--;
		if (this.count <= 0) {
			this.response.end('</body></html>');
		};
	}
}

class SeoRegistry {
	constructor() {
		this.count = 0;

		this.register = this.register.bind(this);
		this.checkCount = this.checkCount.bind(this);
	}

	register(component) {
		this.count++;
		const cycle = new LifeCycle();

		cycle.onProgress(component.getData.bind(component, cycle));
		cycle.onAfterEnd(this.checkCount);

		setImmediate(component.getData.bind(component, cycle));
	}

	onEnd(fn) {
		this.callback = fn;
	}

	checkCount() {
		this.count--;
		if (this.count <= 0) {
			if (this.callback) setImmediate(this.callback);
		};
	}
}

class Component {
	constructor(registry, props) {
		this.registry = registry;
		this.props = props;

		this.componentId = this.componentId.bind(this);
		this.getData = this.getData.bind(this);
		this.render = this.render.bind(this);

		registry.register(this);
	}

	componentId() {
		return 'default';
	}

	getData(res) {
		res.end();
	}

	render() {
		const cid = this.componentId();
		return '<div id="' + cid +'">After Data arrive</div>';
	}
}

export default {
	Registry: Registry,
	SeoRegistry: SeoRegistry,
	Component: Component
}