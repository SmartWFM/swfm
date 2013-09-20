Ext.define('Ext.ux.CKeditor', {
	extend : 'Ext.form.field.TextArea',
	alias : 'widget.ckeditorField',
	xtype: 'ckeditorField',
	CkConfig: {},
	initComponent : function(){
		this.callParent(arguments);
		this.on('afterrender', function(){
			Ext.apply(this.CKConfig ,{
				height : this.getHeight()
			});
			this.editor = CKEDITOR.replace(this.inputEl.id,this.CKConfig);
			this.editorId =this.editor.id;
			this.editor.on('change', function(){
				var ckeditor = Ext.ComponentQuery.query('ckeditorViewer')[0];
				ckeditor.down('button[action=save]')
					.setDisabled(
						!ckeditor.down('ckeditorField')
							.getModifiedState()
					);
			});
		},this);
	},
	onRender : function(ct, position){
		if(!this.el){
			this.defaultAutoCreate ={
				tag : 'textarea',
				autocomplete : 'off'
			};
		}
		this.callParent(arguments)
	},
	onDestroy: function() {
		this.editor.destroy();
	},
	setValue  : function(value){
		this.callParent(arguments);
		if(this.editor){
			// resetDirty method passed as callback, because setData is async
			this.editor.setData(value, this.editor.resetDirty);
		}
	},
	getRawValue: function(){
		if(this.editor){
			return this.editor.getData();
		}else{
			return '';
		}
	},
	resetModifiedState: function(){
		this.editor.resetDirty()
	},
	getModifiedState: function(){
		return this.editor.checkDirty();
	}

});

function waitForCKEditor(){
	if(typeof CKEDITOR === 'undefined') {
		window.setTimeout("waitForCKEditor();", 100);
	}else{
		CKEDITOR.on('instanceReady',function(e){
			var o = Ext.ComponentQuery.query('ckeditorField[editorId="'+ e.editor.id +'"]'),
			comp = o[0];
			e.editor.resize(comp.getWidth(), comp.getHeight())
			comp.on('resize',function(c,adjWidth,adjHeight){
				c.editor.resize(adjWidth, adjHeight)
			})
		});
	}
}

Ext.onReady(waitForCKEditor);