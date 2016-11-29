/**
 * Sift Ocado. Frontend view entry point.
 */
'use strict';

import { createSiftView } from '@redsift/sift-sdk-web';
import { html as bars } from '@redsift/d3-rs-bars';
import { select } from 'd3-selection';
import { utcParse } from 'd3-time-format';
import pfv from './powerhouse-fv.json';
import '@redsift/ui-rs-hero';

var PFV_LINK = 'https://www.cdc.gov/pcd/issues/2014/13_0390.htm';
var GOOGLE_SEARCH_TEMPLATE = 'https://www.google.co.uk/search?q=';

var SiftOcadoView = createSiftView({
  init: function () {
    console.log('sift-ocado: view: init');
    // We subscribe to 'storageupdate' updates from the Controller
    this.controller.subscribe('storageupdate', this.onStorageUpdate.bind(this));
    this.registerOnResizeHandler(this.onResize.bind(this));
  },

  /**
   * Sift lifecycle method 'presentView'
   * Called by the framework when the loadView callback in frontend/controller.js calls the resolve function or returns a value
   */
  presentView: function (value) {
    console.log('sift-ocado: view: presentView: ', value);
    // convert counts keys to epoch
    var parseTime = utcParse('%Y%m');
    this._counts = value.data.map(function (e) {
      return {
        l: parseTime(e.key).getTime(),
        v: [e.value]
      };
    });
    if(!this._expense) {
      this._expense = bars('monthly')
        .tickCountIndex('utcMonth') // want monthly ticks
        .tickDisplayValue(function(d){ return '£' + d; }) // Force to £ for now
        .labelTime('%b') // use the smart formatter
        .orientation('bottom')
        .height(200)
        .tickFormatValue('($.0f');
    }
    this.onResize();
  },

  onResize: function () {
    var content = document.querySelector('.content__container--expand');
    select('#expense')
      .datum(this._counts)
      .call(this._expense.width(content.clientWidth * 0.8));
  },

  /**
   * Sift lifecycle method 'willPresentView'
   * Called when a sift starts to transition between size classes
   */
  willPresentView: function (value) {
    console.log('sift-ocado: view: willPresentView: ', value);
  },

  /**
   * Custom methods defined by the developer
   */
  onStorageUpdate: function (data) {
    console.log('sift-ocado: view: onStorageUpdate: ', data);
    this.presentView({data: data});
  }
});
