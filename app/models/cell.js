import Ember from 'ember';
const {computed, computed: {and, equal, not}} = Ember;

const STATES = {
  CLOSED:   0,
  OPEN:     1
};

export default Ember.Object.extend({
  hasMine: false,
  state: STATES.CLOSED,
  board: null,
  row: null,
  col: null,
  isFlagged: false,

  isOpen: equal('state', STATES.OPEN),
  isClosed: equal('state', STATES.CLOSED),
  isZero: equal('digit', 0),
  notHasMine: not('hasMine'),
  isEmpty: and('isZero', 'notHasMine'),

  open() {
    this.set('state', STATES.OPEN);
  },

  openEmptySurrounding() {
    this.get('board').openEmptySurrounding(this);
  },

  openImmediateSurrounding() {
    this.get('board').openImmediateSurrounding(this);
  },

  close() {
    this.set('state', STATES.CLOSED);
  },

  toggleFlag() {
    this.toggleProperty('isFlagged');
    this.close();
  },

  isSurroundFlagged: computed(function() {
    if (this.get('hasMine')) {
      return false;
    }
    let neighbors = this.get('board').neighborsFor(this);
    neighbors = neighbors.filterBy('isFlagged', true);
    let digit = this.get('digit');
    return neighbors.get('length') === digit;
  }).volatile(),

  digit: computed(function() {
    let neighbors = this.get('board').neighborsFor(this);
    return neighbors.reduce((prev, neighbor) => {
      return prev + (neighbor.get('hasMine') ? 1 : 0);
    }, 0);
  })
});
