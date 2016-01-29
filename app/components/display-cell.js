import Ember from 'ember';
const { computed, computed: { reads, or } } = Ember;

export default Ember.Component.extend({
  classNames: ['cell'],
  classNameBindings: [
    'cell.isOpen:is-open',
    'cell.isClosed:is-closed',
    'cell.isActiveMine:is-active-mine',
    'cell.isIncorrectlyFlagged:is-incorrectly-flagged',
    'cell.isFlagged:is-flagged',
    'shouldReveal:is-revealed',
    'cell.hasMine:has-mine',
    'cellDigit'
  ],

  cell: null,
  board: reads('cell.board'),
  shouldReveal: reads('board.isLost'),
  ignoreClicks: or('board.isWon', 'board.isLost'),

  cellDigit: computed('cell.isFlagged', 'cell.hasMine', 'cell.digit', function() {
    if (this.get('cell.isFlagged') || this.get('cell.hasMine')) {
      return '';
    } else {
      return `digit-${this.get('cell.digit')}`;
    }
  }),

  click(evt) {
    evt.preventDefault();
    let cell = this.get('cell');
    let isShift = evt.shiftKey;

    if (this.get('ignoreClicks')) {
      return;
    }
    if (cell.get('isFlagged')) {
      cell.unflag();
      return;
    }

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
