import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['cell'],
  classNameBindings: [
    'cell.isOpen:is-open', 'cell.isClosed:is-closed'
  ],

  cell: null,

  click(evt) {
    evt.preventDefault();

    let cell = this.get('cell');

    if (evt.shiftKey) {
      cell.toggleFlag();
    } else {
      cell.open();
      if (cell.get('isEmpty')) {
        cell.openEmptySurrounding();
      } else if (cell.get('isSurroundFlagged')) {
        cell.openImmediateSurrounding();
      }
    }
  }
});
