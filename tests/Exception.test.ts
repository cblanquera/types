import { describe, it } from 'mocha';
import { expect } from 'chai';
import Exception from '../src/Exception';

describe('Exception Tests', () => {
  it('Should throw template', () => {
    try {
      throw Exception.for('Something good is bad')
    } catch(e) {
      expect(e.name).to.equal('Exception');
      expect(e.message).to.equal('Something good is bad');
      expect(e.code).to.equal(500);
    }
  
    try {
      throw Exception.for('Something good is bad', 'good', 'bad')
    } catch(e) {
      expect(e.name).to.equal('Exception');
      expect(e.message).to.equal('Something good is bad');
      expect(e.code).to.equal(500);
    }
  
    try {
      throw Exception.for('Something %s is %s', 'good', 'bad')
    } catch(e) {
      expect(e.name).to.equal('Exception');
      expect(e.message).to.equal('Something good is bad');
      expect(e.code).to.equal(500);
    }
  });

  it('Should throw errors found', () => {
    try {
      throw Exception.forErrorsFound({key: 'value'})
    } catch(e) {
      expect(e.name).to.equal('Exception');
      expect(e.message).to.equal('Invalid Parameters');
      expect(e.errors.key).to.equal('value');
      expect(e.code).to.equal(500);
    }
  });

  it('Should throw required', () => {
    try {
      const count = 0;
      Exception.require(count > 1, 'Count %s should be more than 1', count.toString())
    } catch(e) {
      expect(e.name).to.equal('Exception');
      expect(e.message).to.equal('Count 0 should be more than 1');
      expect(e.code).to.equal(500);
    }
  });

  it('Should throw with code', () => {
    try {
      throw Exception.for('Something good is bad').withCode(400)
    } catch(e) {
      expect(e.name).to.equal('Exception');
      expect(e.message).to.equal('Something good is bad');
      expect(e.code).to.equal(400);
    }
  });

  it('Should throw with position', () => {
    try {
      throw Exception.for('Something good is bad').withPosition(1, 2)
    } catch(e) {
      expect(e.name).to.equal('Exception');
      expect(e.message).to.equal('Something good is bad');
      expect(e.code).to.equal(500);
      expect(e.start).to.equal(1);
      expect(e.end).to.equal(2);
    }
  });

  it('Should return json error payload', () => {
    try {
      throw Exception.for('Something good is bad')
    } catch(e) {
      const json = e.toJSON();
      expect(json.error).to.equal(true)
      expect(json.code).to.equal(500)
      expect(json.message).to.equal('Something good is bad')
    }
  });
});