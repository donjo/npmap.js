/* global L */

'use strict';

var SmallZoomControl = L.Control.extend({
  options: {
    position: 'topleft'
  },
  initialize: function(options) {
    L.Util.extend(this.options, options);
    return this;
  },
  onAdd: function(map) {
    this._container = L.DomUtil.create('div', 'leaflet-control-zoom leaflet-bar');
    this._zoomInButton = this._createButton('Zoom in', 'in', this._container, this._zoomIn, this);
    this._zoomOutButton = this._createButton('Zoom out', 'out', this._container, this._zoomOut, this);
    map.on('zoomend zoomlevelschange', this._updateDisabled, this);
    this._updateDisabled();

    return this._container;
  },
  onRemove: function(map) {
    map.off('zoomend zoomlevelschange', this._updateDisabled, this);
  },
  _createButton: function(title, clsName, container, handler, context) {
    var button = L.DomUtil.create('button', clsName, container);

    button.title = title;

    L.DomEvent.disableClickPropagation(button);
    L.DomEvent
      .on(button, 'click', L.DomEvent.preventDefault)
      .on(button, 'click', handler, context);

    return button;
  },
  _updateDisabled: function() {
    var clsName = 'leaflet-disabled',
      map = this._map;

    L.DomUtil.removeClass(this._zoomInButton, clsName);
    L.DomUtil.removeClass(this._zoomOutButton, clsName);

    if (map._zoom === map.getMinZoom()) {
      L.DomUtil.addClass(this._zoomOutButton, clsName);
    }
    if (map._zoom === map.getMaxZoom()) {
      L.DomUtil.addClass(this._zoomInButton, clsName);
    }
  },
  _zoomIn: function(e) {
    this._map.zoomIn(e.shiftKey ? 3 : 1);
  },
  _zoomOut: function(e) {
    this._map.zoomOut(e.shiftKey ? 3 : 1);
  }
});

L.Map.mergeOptions({
  smallzoomControl: true
});
L.Map.addInitHook(function() {
  if (this.options.smallzoomControl) {
    var options = {};

    if (typeof this.options.smallzoomControl === 'object') {
      options = this.options.smallzoomControl;
    }

    this.smallzoomControl = L.npmap.control.smallzoom(options).addTo(this);
  }
});

module.exports = function(options) {
  return new SmallZoomControl(options);
};
