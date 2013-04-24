/**
 * @class Ext.ux.upload.Button
 * @extends Ext.button.Button
 *
 * @author Harald Hanek (c) 2011-2012
 * @license http://harrydeluxe.mit-license.org
 */
Ext.define('Ext.ux.upload.Button', {
    extend: 'Ext.button.Button',
    alias: 'widget.uploadbutton',
    requires: ['Ext.ux.upload.Basic'],
    disabled: true,

    config: {
        text: SmartWFM.lib.I18n.get('plugin.baseActions', 'Upload'),
        plugins: [{
            ptype: 'ux.upload.window',
            title: SmartWFM.lib.I18n.get('plugin.baseActions', 'Upload'),
            width: 520,
            height: 350
        }],
        uploader: {
            url: '/', // will be set in "beforeUpload"
            uploadpath: '/', // will be set in "beforeUpload"
            max_file_size: '512mb',
            statusQueuedText: SmartWFM.lib.I18n.get('plugin.baseActions', 'Ready to upload'),
            statusUploadingText: SmartWFM.lib.I18n.get('plugin.baseActions', 'Uploading ({0}%)'),
            statusFailedText: '<span style="color: red">' + SmartWFM.lib.I18n.get('plugin.baseActions.errors', 'Error') + '</span>',
            statusDoneText: '<span style="color: green">' + SmartWFM.lib.I18n.get('plugin.baseActions', 'Complete') + '</span>',
            statusInvalidSizeText: SmartWFM.lib.I18n.get('plugin.baseActions.errors', 'File too large'),
            statusInvalidExtensionText: SmartWFM.lib.I18n.get('plugin.baseActions.errors', 'Invalid file type')
        },
        addButtonText: SmartWFM.lib.I18n.get('plugin.baseActions', 'Add files'),
        uploadButtonText: SmartWFM.lib.I18n.get('swfm.button', 'Start'),
        cancelButtonText: SmartWFM.lib.I18n.get('swfm.button', 'Cancel'),
        deleteUploadedText: SmartWFM.lib.I18n.get('plugin.baseActions', 'Remove uploaded'),
        deleteAllText: SmartWFM.lib.I18n.get('plugin.baseActions', 'Remove all'),
        listeners: {
            beforeupload: function(me, uploader, file) {
                var path = SmartWFM.app.getController('Browser').getBrowserView().getActiveTab().getPath();
                uploader.settings.url = SmartWFM.lib.Config.get('commandUrl') + '?command=upload&path=' + path;
            },
            uploadcomplete: function() {
                SmartWFM.lib.Event.fire('', 'refresh');
            }
        }
    },

    constructor: function(config)
    {
        var me = this;
        Ext.applyIf(me.config.uploader, {
            browse_button: me.config.id || Ext.id(me)
        });
        me.callParent([me.config]);
    },

    initComponent: function()
    {
        var me = this,
            e;
        me.callParent();
        me.uploader = me.createUploader();

        if(me.uploader.drop_element && (e = Ext.getCmp(me.uploader.drop_element)))
        {
            e.addListener('afterRender', function()
                {
                       me.uploader.initialize();
                },
                {
                    single: true,
                    scope: me
                }
            );
        }
        else
        {
            me.listeners = {
                afterRender: {
                    fn: function()
                    {
                        me.uploader.initialize();
                    },
                    single: true,
                    scope: me
                }
            };
        }

        me.relayEvents(me.uploader, ['beforestart',
                'uploadready',
                'uploadstarted',
                'uploadcomplete',
                'uploaderror',
                'filesadded',
                'beforeupload',
                'fileuploaded',
                'updateprogress',
                'uploadprogress',
                'storeempty']);
    },

    /**
     * @private
     */
    createUploader: function()
    {
        return Ext.create('Ext.ux.upload.Basic', this, Ext.applyIf({
            listeners: {}
        }, this.initialConfig));
    }
});