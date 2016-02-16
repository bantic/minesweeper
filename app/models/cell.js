import Ember from 'ember';
const {computed, computed: {and, equal, not}} = Ember;

// when revealed:
//   correctly flagged: show flag
//   incorrectly flagged: show X over bomb
//   clicked bomb: show red bomb
//   bomb: show normal bomb

export default Ember.Object.extend({
  hasMine: false,
  board: null,
  row: null,
  col: null,

  isFlagged: false,
  notIsFlagged: not('isFlagged'),
  isOpen: false,

  isClosed: not('isOpen'),
  isCorrectlyFlagged: and('hasMine', 'isFlagged'),
  isIncorrectlyFlagged: and('notHasMine', 'isFlagged'),
  isActiveMine: and('isOpen', 'hasMine', 'notIsFlagged'),

  isZero: equal('digit', 0),
  notHasMine: not('hasMine'),
  isEmpty: and('isZero', 'notHasMine'),

  open() {
    this.get('board').open(this);
  },

  openSelfAndEmptySurrounding() {
    this.open();
    if (this.get('isEmpty')) {
      this.openEmptySurrounding(this);
    }
  },

  openEmptySurrounding() {
    this.get('board').openEmptySurrounding(this);
  },

  openImmediateSurrounding() {
    this.get('board').openImmediateSurrounding(this);
  },

  close() {
    this.set('isOpen', false);
  },

  flag() {
    this.set('isFlagged', true);
    this.set('isOpen', true);
  },

  unflag() {
    this.set('isFlagged', false);
    this.set('isOpen', false);
  },

  isSurroundFlagged: computed(function() {
    console.log('isSurroundFlagged');
    if (this.get('hasMine')) {
      return false;
    }
    let neighbors = this.get('board').neighborsFor(this);
    neighbors = neighbors.filterBy('isFlagged', true);
    let digit = this.get('digit');
    return neighbors.get('length') === digit;
  }).volatile(),

  digit: computed(function() {
    console.log('digit');
    let neighbors = this.get('board').neighborsFor(this);
    return neighbors.reduce((prev, neighbor) => {
      return prev + (neighbor.get('hasMine') ? 1 : 0);
    }, 0);
  })
});
