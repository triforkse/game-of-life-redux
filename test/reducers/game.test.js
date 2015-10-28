import expect from 'expect';
import {generateDefualtBoard} from '../../reducers/game';

describe('game reducers', function() {

  it('should genereate correct board structure', function() {
    const result = generateDefualtBoard(2);

    expect(result[0][0]).toBe(false);
    expect(result[0][1]).toBe(false);
    expect(result[1][0]).toBe(false);
    expect(result[1][1]).toBe(false);

    expect(result[2]).toNotExist();

  });

});
