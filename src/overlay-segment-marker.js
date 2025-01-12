/**
 * @file
 *
 * Defines the {@link OverlaySegmentMarker} class.
 *
 * @module default-segment-marker
 */

import { Rect } from 'konva/lib/shapes/Rect';
import { Text } from 'konva/lib/shapes/Text';

/**
 * Creates a segment marker handle.
 *
 * @class
 * @alias OverlaySegmentMarker
 *
 * @param {CreateSegmentMarkerOptions} options
 */

function OverlaySegmentMarker(options) {
  this._options = options;
}

OverlaySegmentMarker.prototype.init = function(group) {
  var handleWidth  = 10;
  var handleHeight = 20;
  var handleX      = -(handleWidth / 2) + 0.5; // Place in the middle of the marker

  var xPosition = this._options.startMarker ? -24 : 24;

  var time = this._options.startMarker ? this._options.segment.startTime :
                                         this._options.segment.endTime;

  // Label - create with default y, the real value is set in fitToView().
  this._label = new Text({
    x:          xPosition,
    y:          0,
    text:       this._options.layer.formatTime(time),
    fontFamily: this._options.fontFamily,
    fontSize:   this._options.fontSize,
    fontStyle:  this._options.fontStyle,
    fill:       '#000',
    textAlign:  'center'
  });

  this._label.hide();

  // Handle - create with default y, the real value is set in fitToView().
  this._handle = new Rect({
    x:      handleX,
    y:      0,
    width:  handleWidth,
    height: handleHeight
  });

  group.add(this._label);
  group.add(this._handle);

  this.fitToView();

  this.bindEventHandlers(group);
};

OverlaySegmentMarker.prototype.bindEventHandlers = function(group) {
  var self = this;

  var xPosition = self._options.startMarker ? -24 : 24;

  if (self._options.draggable) {
    group.on('dragstart', function() {
      if (self._options.startMarker) {
        self._label.setX(xPosition - self._label.getWidth());
      }

      self._label.show();
    });

    group.on('dragend', function() {
      self._label.hide();
    });
  }

  self._handle.on('mouseover touchstart', function() {
    if (self._options.startMarker) {
      self._label.setX(xPosition - self._label.getWidth());
    }

    self._label.show();

    document.body.style.cursor = 'ew-resize';
  });

  self._handle.on('mouseout touchend', function() {
    self._label.hide();

    document.body.style.cursor = 'default';
  });
};

OverlaySegmentMarker.prototype.fitToView = function() {
  var height = this._options.layer.getHeight();

  this._label.y(height / 2 - 5);
  this._handle.y(height / 2 - 10.5);
};

OverlaySegmentMarker.prototype.timeUpdated = function(time) {
  this._label.setText(this._options.layer.formatTime(time));
};

export default OverlaySegmentMarker;
