import calculate from './calculate';
import { expect } from 'chai';

function pressButtons(buttons) {
  const value = {};
  buttons.forEach((button) => {
    Object.assign(value, calculate(value, button));
  });
  // no need to distinguish between null and undefined values
  Object.keys(value).forEach((key) => {
    if (value[key] === null) {
      delete value[key];
    }
  });
  return value;
}

function expectButtons(buttons, expectation) {
  expect(pressButtons(buttons)).to.deep.equal(expectation);
}

function test(buttons, expectation) {
  it(`buttons ${buttons.join(',')} -> ${JSON.stringify(expectation)}`, () => {
    expectButtons(buttons, expectation);
  })
}

test(['6'], { next: '6' });

test(['6', '6'], { next: '66' });

test(['6', '+', '6'], {
  next: '6',
  total: '6',
  operation: '+',
});

test(['6', '+', '6', '='], {
  total: '12',
});

test(['0', '0', '+', '0', '='], {
  total: '0',
});

test(['6', '+', '6', '=', '9'], {
  next: '9',
});

test(['3', '+', '6', '=', '+'], {
  total: '9',
  operation: '+',
});

test(['3', '+', '6', '=', '+', '9'], {
  total: '9',
  operation: '+',
  next: '9',
});

test(['3', '+', '6', '=', '+', '9', '='], {
  total: '18',
});

// When '=' is pressed and there is not enough information to complete
// an operation, the '=' should be disregarded.
test(['3', '+', '=', '3', '='], {
  total: '6',
});

test(['+'], {
  operation: '+',
});

test(['+', '2'], {
  next: '2',
  operation: '+',
});

test(['+', '2', '+'], {
  total: '2',
  operation: '+',
});

test(['+', '2', '+', '+'], {
  total: '2',
  operation: '+',
});

test(['+', '2', '+', '5'], {
  next: '5',
  total: '2',
  operation: '+',
});

test(['+', '2', '5'], {
  next: '25',
  operation: '+',
});

test(['+', '2', '5'], {
  next: '25',
  operation: '+',
});

test(['+', '6', '+', '5', '='], {
  total: '11',
});

// should clear the operator when AC is pressed
test(['1', '+', '2', 'AC'], {});
test(['+', '2', 'AC'], {});
