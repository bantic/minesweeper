import Ember from 'ember';
import Board from '../models/board';

export default Ember.Route.extend({
  model() {
    return Board.create({
      mines: 40,
      rows: 16,
      cols: 16
    });
  }
});
