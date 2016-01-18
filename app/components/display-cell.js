import Ember from 'ember';
const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ['cell'],
  classNameBindings: [
    'cell.isOpen:is-open',
    'cell.isClosed:is-closed',
    'cell.isActiveMine:is-active-mine',
    'cell.isIncorrectlyFlagged:is-incorrectly-flagged',
    'cellDigit'
  ],

  cell: null,
  cellDigit: computed('cell.digit', function() {
    return `digit-${this.get('cell.digit')}`;
  }),

  click(evt) {
    evt.preventDefault();
    let isShift = evt.shiftKey;

    let cell = this.get('cell');
    if (cell.get('isOpen')) {
      if (cell.get('isSurroundFlagged')) {
        cell.openImmediateSurrounding();
      } else if (cell.get('isFlagged') && isShift) {
        cell.unflag();
      }
    } else {
      if (isShift) {
        cell.flag();
      } else {
        cell.open();
        if (cell.get('isEmpty')) {
          cell.openEmptySurrounding();
        }
      }
    }
  }
});
