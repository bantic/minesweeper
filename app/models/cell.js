import Ember from 'ember';
const {computed} = Ember;

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

  isOpen: computed.equal('state', STATES.OPEN),
  isClosed: computed.equal('state', STATES.CLOSED),
  isEmpty: computed.equal('digit', 0),

  open() {
    this.set('state', STATES.OPEN);
  },

  openSurrounding() {
    this.get('board').openSurrounding(this);
  },

  close() {
    this.set('state', STATES.CLOSED);
  },

  toggleFlag() {
    this.toggleProperty('isFlagged');
    this.close();
  },

  digit: computed(function() {
    let neighbors = this.get('board').neighborsFor(this);
    return neighbors.reduce((prev, neighbor) => {
      return prev + (neighbor.get('hasMine') ? 1 : 0);
    }, 0);
  })
});
