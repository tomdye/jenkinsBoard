define([
	"dojo/_base/declare",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/text!./resources/JenkinsBoard.html",
	"vendor/d3"
], function (
	declare,
	_Widget,
	_TemplatedMixin,
	lang,
	on,
	template
) {
	return declare("app.JenkinsBoard", [_Widget, _TemplatedMixin], {
		templateString: template,
		model: null,
		//_observer: null,

		_setModelAttr: function (model) {
			this.model = model;
			model.fetch().then(lang.hitch(this, function (response) {
				this._render(response);

				on(model, "fetchResponse", lang.hitch(this, "_onFetchEvent"));

				/*if (this._observer && this._observer.cancel) {
					this._observer.cancel();
				}

				this._observer = model.get({}).observe(lang.hitch(this, "_onObserveEvent"), true);*/
			}));

			model.startTicker(10000);
		},

		postCreate: function () {
			var self = this;
			/*setTimeout(function () {
				self.model.store.put({"name": "newItem"});
			}, 500);

			setTimeout(function () {
				self.model.store.put({"name": "newItem2"});
			}, 1000);

			setTimeout(function () {
				self.model.store.remove("newItem2");
			}, 3000);

			setTimeout(function () {
				self.model.store.remove("newItem");
			}, 5000);*/

		},

		_render: function (items) {
			items.sort(function (a,b) {
				if (a.color < b.color)
					return 1;
				else if(a.color > b.color)
					return -1;
				return 0;
			});

			// Update…
			var p = d3.select("body").selectAll("p")
			    .data(items)
			    .text(function (job) {
			    	return "My name is: " + job.name + ", my color is: " + job.color;
			    })
			    .style("color", function (job) {
			    	return (job.color === "blue") ? "green" : "red";
			    })
			    .style("font-size", function (job) {
			    	return (job.color === "blue_anime" || job.color === "red_anime") ? "24px" : "12px";
			    });

			// Enter…
			p.enter().append("p")
				.text(function (job) {
			    	return "My name is: " + job.name + ", my color is: " + job.color;
			    })
			    .style("color", function (job) {
			    	return (job.color === "blue") ? "green" : "red";
			    })
			    .style("font-size", function (job) {
			    	return (job.color === "blue_anime" || job.color === "red_anime") ? "24px" : "12px";
			    });

			// Exit…
			p.exit().remove();


			/*d3.select("body").selectAll("p")
				.data(items)
  				.enter().append("p")
    			.text(function(job) { return "I’m job " + job.name + "!"; });*/
    			/*.exit().remove()
				.append("span")
				.text("There was an item here");*/
		},

		_onFetchEvent: function (response) {
			this._render(response);
		}
	});
});