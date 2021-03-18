'use strict';

(function() {

  console.log('loaded');

  const JQUERY_URL = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js';

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = false;
  script.addEventListener('load', () => {
    jQuery.noConflict();

    const basicPlugin = {
      app: undefined,
      setApp: function (app) {
        this.app = app;
      },
      init: function () {
  
      },
      $: function () {
        return this.app.contentWindow.jQuery.apply(this, arguments);
      }
    };
  
    const iTAPlugin = jQuery.extend(jQuery.extend({}, basicPlugin), {
      init: function () {
        try {
          document.getElementById(loader.panelId).removeChild(document.getElementById('ita-btn'));
        } catch (e) {
  
        }
  
        const btn = document.createElement('button');
        btn.style = 'background-color: white;';
        btn.id = 'ita-btn';
        btn.innerHTML = 'Add iTA People';
        btn.onclick = function () {
          this.findOpenToWorkEngineers();
        }.bind(this);
        document.getElementById(loader.panelId).appendChild(btn);
      },
      findOpenToWorkEngineers: function () {
        console.log('Looking for open to work engineers...')
      }
    });
  
    const loader = {
      iframeId: 'loader-inner-iframe-5079520',
      panelId: null,
      contentWindow: undefined,
      plugins: [],
      init: function () {
        this.panelId = this.iframeId + '345345';
        this.createIframe(true);
        this.windowInit();
        this.initPlugins();
      },
      createIframe: function (removeHTML) {
  
        removeHTML = removeHTML || false;
        try {
          document.body.removeChild(document.getElementById(this.iframeId));
        } catch (e) {
  
        }
        const iframe = document.createElement('iframe');
        iframe.src = document.location.href;
        iframe.id = this.iframeId;
        iframe.width = '100%';
        iframe.height = jQuery(window).height();
  
        if (removeHTML) {
          document.body.innerHTML = '';
        }
        document.body.appendChild(iframe);
        this.contentWindow = iframe.contentWindow;
  
        this.createPanel();
      },
      createPanel: function () {
        try {
          document.body.removeChild(document.getElementById(this.panelId));
        } catch (e) {
  
        }
  
        const div = document.createElement('div');
        div.style = 'position: absolute; top: 5px; left: 20px; font-weight: bold;';
        div.id = this.panelId;
        div.innerHTML = '';
        document.body.appendChild(div);
      },
      windowInit: function () {
        if (this.contentWindow.document.getElementById('a11y-notification') !== null) {
          const script = this.contentWindow.document.createElement('script');
          script.type = 'text/javascript';
          script.async = false;
          script.src = JQUERY_URL;
          this.contentWindow.document.getElementsByTagName('head')[0].appendChild(script);
          jQuery.noConflict();
          return;
        }
        setTimeout(this.windowInit.bind(this), 100);
      },
      initPlugins: function () {
        this.plugins.forEach(function (plugin) {
          plugin.init();
        });
      },
      addPlugin: function (plugin) {
        this.plugins.push(plugin);
        plugin.setApp(this);
        return this;
      }
    };
  
    loader.addPlugin(iTAPlugin);
    loader.init();
  });
  script.src = JQUERY_URL;
  document.getElementsByTagName('head')[0].appendChild(script);
}());