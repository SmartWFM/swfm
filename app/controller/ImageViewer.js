/**
 * This controller displays selected images in a window.
 */
Ext.define('SmartWFM.controller.ImageViewer', {
	extend: 'Ext.app.Controller',
	requires: [
		'Ext.util.KeyNav',
		'SmartWFM.lib.Menu',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Icon',
		'SmartWFM.view.imageViewer.Window'
	],

	refs: [{
		ref: 'image',
		selector: 'imageViewer panel image'
	},{
		ref: 'imageViewer',
		selector: 'imageViewer panel'
	}],

	init: function() {
		this.registerMenuItems();
		this.control({
			'imageViewer button[action=previous]': {
				click: this.previous
			},
			'imageViewer button[action=next]': {
				click: this.next
			},
			'imageViewer button[action=zoomin]': {
				click: this.zoomin
			},
			'imageViewer button[action=zoomout]': {
				click: this.zoomout
			},
			'imageViewer button[action=fit]': {
				click: this.fit
			},
			'imageViewer button[action=reset]': {
				click: this.reset
			}
		});
	},

	registerMenuItems: function() {
		var imageViewer = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.imageViewer', 'Image Viewer'),
			icon: SmartWFM.lib.Icon.get('image/x-generic', 'mime'),
			disabled: true,
			initComponent: function() {
				this.callParent();

				var files = this.context.files;
				var regex = new RegExp("image/(png|jpeg|gif)");
				var imageFiles = [];

				for(var i in files) {
					var file = files[i];
					if(file.mimeType && file.mimeType.match(regex))
						imageFiles.push(file);
				}
				if(imageFiles.length)
					this.setDisabled(false);

				var controller = SmartWFM.app.getController('ImageViewer');
				controller.imageFiles = imageFiles;
				controller.imageIndex = 0;
			},
			handler: function () {
				var window = Ext.create('SmartWFM.view.imageViewer.Window');
				window.show();
				var controller = SmartWFM.app.getController('ImageViewer');
				if(controller.imageFiles.length == 1) {
					var previousButton = window.query('button[action=previous]')[0];
					var nextButton = window.query('button[action=next]')[0];
					previousButton.destroy();
					nextButton.destroy();
				} else {
					Ext.create('Ext.util.KeyNav', {
						target: window.getEl(),
						left: controller.previous,
						right: controller.next,
						pageUp: controller.previous,
						pageDown: controller.next,
						scope: controller
					});
				}
				controller.load();
			}
		});
		SmartWFM.lib.Menu.add('imageViewer', imageViewer);
	},

	previous: function() {
		this.imageIndex--;
		if(this.imageIndex < 0)
			this.imageIndex = this.imageFiles.length - 1;
		this.load();
	},

	next: function() {
		this.imageIndex++;
		if(this.imageIndex >= this.imageFiles.length)
			this.imageIndex = 0;
		this.load();
	},

	zoomin: function() {
		var scale = this.scale || 1.0;
		// increase scale
		scale += 0.1;
		// maximum
		if(scale > 4.0)
			scale = 4.0;
		this.rescale(scale);
	},

	zoomout: function() {
		var scale = this.scale || 1.0;
		// decrease scale
		scale -= 0.1;
		// minimum
		if(scale < 0.1)
			scale = 0.1;
		this.rescale(scale);
	},

	rescale: function(scale) {
		this.scale = scale;
		var image = this.getImage();
		// apply this scale
		image.setHeight(this.size['height'] * scale);
		image.setWidth(this.size['width'] * scale);
	},

	fit: function() {
		var image = this.getImage();
		var imageViewer = this.getImageViewer();
		// image size
		var iHeight = image.getHeight();
		var iWidth = image.getWidth();
		// viewer size
		var ivHeight = imageViewer.getHeight();
		var ivWidth = imageViewer.getWidth();
		// scale needed to fit in this view
		var heightScale = ivHeight / iHeight;
		var widthScale = ivWidth / iWidth;
		// choose minimum, so the whole image fit in this window
		var scale = Ext.Array.min([heightScale, widthScale]);
		// apply this scale
		image.setHeight(iHeight * scale);
		image.setWidth(iWidth * scale);
		this.scale = scale;
	},

	reset: function() {
		var image = this.getImage();
		image.setSize(this.size);
	},

	load: function() {
		var imageViewer = this.getImageViewer();
		imageViewer.removeAll();
		var imageMetadata = this.imageFiles[this.imageIndex];
		var image = Ext.create('Ext.Img', {
			src: SmartWFM.lib.Url.encode(
				SmartWFM.lib.Config.get('commandUrl'),
				{
					command: 'download',
					path: imageMetadata['path'],
					name: imageMetadata['name']
				}
			)
		});
		imageViewer.add(image);

		// save size when image is loaded ;)
		image.getEl().set({
			onload: "SmartWFM.app.getController('ImageViewer').loadCallback();"}
		);
	},

	loadCallback: function() {
		this.size = this.getImage().getSize();
		this.fit();
	}
});